from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI(title="Emotion Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading Emotion AI Model. This may take a minute if downloading for the first time...")
emotion_classifier = pipeline(
    "text-classification", 
    model="bhadresh-savani/distilbert-base-uncased-emotion", 
    top_k=None # Returns all emotion scores
)
print("Model loaded successfully!")

class AnalyzeRequest(BaseModel):
    text: str

def extract_keywords(text: str) -> list:
    stop_words = {"i","me","my","myself","we","our","ours","ourselves","you","your","yours","yourself","yourselves",
                  "he","him","his","himself","she","her","hers","herself","it","its","itself","they","them","their",
                  "theirs","themselves","what","which","who","whom","this","that","these","those","am","is","are",
                  "was","were","be","been","being","have","has","had","having","do","does","did","doing","a","an",
                  "the","and","but","if","or","because","as","until","while","of","at","by","for","with","about",
                  "against","between","into","through","during","before","after","above","below","to","from","up",
                  "down","in","out","on","off","over","under","again","further","then","once","here","there","when",
                  "where","why","how","all","any","both","each","few","more","most","other","some","such","no","nor",
                  "not","only","own","same","so","than","too","very","s","t","can","will","just","don","should","now"}
    import string
    words = text.translate(str.maketrans('', '', string.punctuation)).lower().split()
    keywords = [w for w in words if w not in stop_words and len(w) > 2]
    # Return unique keywords up to 5
    return list(dict.fromkeys(keywords))[:5]

@app.post("/analyze")
async def analyze_text(request: AnalyzeRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    try:
        results = emotion_classifier(request.text)
        # Results is a list of lists when passing a single string directly depending on version, 
        # but top_k=None returns a list of dicts: [[{'label': 'joy', 'score': 0.99}, ...]]
        emotions = results[0] if isinstance(results[0], list) else results
        
        emotions.sort(key=lambda x: x["score"], reverse=True)
        top_emotion = emotions[0]
        
        positive_emotions = ["joy", "love"]
        negative_emotions = ["sadness", "anger", "fear"]
        
        base_label = "Neutral"
        if top_emotion["label"] in positive_emotions:
            base_label = "Positive"
        elif top_emotion["label"] in negative_emotions:
            base_label = "Negative"
            
        return {
            "emotion": top_emotion["label"].capitalize(),
            "emotion_score": float(top_emotion["score"]),
            "label": base_label,
            "all_emotions": [{ "label": e["label"].capitalize(), "score": float(e["score"]) } for e in emotions],
            "keywords": extract_keywords(request.text)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
