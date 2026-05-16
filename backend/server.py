from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
from database import init_db, get_dashboard_stats, get_recent_posts
from scraper import start_scraper

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

# Initialize database and start background scraper
init_db()
start_scraper(emotion_classifier)

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

@app.get("/dashboard/stats")
async def get_stats():
    return get_dashboard_stats()

@app.get("/stream/live")
async def get_live_stream():
    return get_recent_posts(limit=20)

@app.get("/analyze-handle/{handle}")
async def analyze_handle(handle: str):
    import requests
    import json
    
    headers = {'User-Agent': 'Mozilla/5.0 SentiVueBot/1.0'}
    
    try:
        # We will mock the "X/Twitter" influencer handle lookup by looking up a Reddit user instead to get real data!
        url = f"https://www.reddit.com/user/{handle}/comments.json?limit=20"
        response = requests.get(url, headers=headers)
        
        posts = []
        if response.status_code == 200:
            data = response.json()
            children = data.get("data", {}).get("children", [])
            for child in children:
                posts.append(child["data"].get("body", "")[:200]) # Get first 200 chars
        
        # If the user doesn't exist or has no comments, generate some placeholder text
        if not posts:
            posts = [
                f"Just had an amazing day working on {handle} projects!",
                "Not really sure how I feel about the latest tech updates.",
                "Terrible experience with the new software update.",
                f"Can't wait to see what {handle} releases next!"
            ]
            
        processed_posts = []
        pos_count = neg_count = neu_count = 0
        
        for text in posts:
            if not text.strip(): continue
            results = emotion_classifier(text)
            emotions = results[0] if isinstance(results[0], list) else results
            emotions.sort(key=lambda x: x["score"], reverse=True)
            top_emotion = emotions[0]
            
            base_label = "Neutral"
            if top_emotion["label"] in ["joy", "love"]:
                base_label = "Positive"
                pos_count += 1
            elif top_emotion["label"] in ["sadness", "anger", "fear"]:
                base_label = "Negative"
                neg_count += 1
            else:
                neu_count += 1
                
            processed_posts.append({
                "id": str(len(processed_posts)),
                "text": text,
                "date": "Just now",
                "likes": 0,
                "retweets": 0,
                "result": {"label": base_label, "score": float(top_emotion["score"])}
            })
            
        total = max(pos_count + neg_count + neu_count, 1)
        
        return {
            "name": handle,
            "handle": f"@{handle}",
            "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={handle}",
            "followers": "1.2M",
            "category": "Technology",
            "stats": {
                "positive": int((pos_count / total) * 100),
                "negative": int((neg_count / total) * 100),
                "neutral": int((neu_count / total) * 100)
            },
            "recentPosts": processed_posts
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
