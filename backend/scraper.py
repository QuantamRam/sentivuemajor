import requests
import time
import threading
import json
from datetime import datetime
from database import insert_post

# Prevent recursive imports by passing the classifier
def start_scraper(classifier_fn):
    def scrape_loop():
        subreddits = ["technology", "worldnews", "movies", "gaming", "science"]
        current_sub = 0
        
        headers = {'User-Agent': 'Mozilla/5.0 SentiVueBot/1.0'}
        
        while True:
            sub = subreddits[current_sub]
            current_sub = (current_sub + 1) % len(subreddits)
            
            try:
                # Fetch new posts
                url = f"https://www.reddit.com/r/{sub}/new.json?limit=5"
                response = requests.get(url, headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    children = data.get("data", {}).get("children", [])
                    
                    for child in children:
                        post_data = child["data"]
                        post_id = post_data["name"]
                        title = post_data["title"]
                        created_utc = post_data["created_utc"]
                        timestamp = datetime.fromtimestamp(created_utc).isoformat()
                        
                        # Use the provided classifier function
                        results = classifier_fn(title)
                        
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
                            
                        # Insert into database
                        insert_post(
                            post_id=post_id,
                            source="Reddit",
                            text=title,
                            timestamp=timestamp,
                            label=base_label,
                            score=float(top_emotion["score"]),
                            raw_emotions=json.dumps([{"label": e["label"], "score": float(e["score"])} for e in emotions])
                        )
                
            except Exception as e:
                print(f"Scraper error: {e}")
                
            # Sleep for 15 seconds before fetching next
            time.sleep(15)
            
    thread = threading.Thread(target=scrape_loop, daemon=True)
    thread.start()
    print("Background scraper started.")
