import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create posts table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        source TEXT,
        text TEXT,
        timestamp TEXT,
        label TEXT,
        score REAL,
        raw_emotions TEXT
    )
    ''')
    
    conn.commit()
    conn.close()

def insert_post(post_id, source, text, timestamp, label, score, raw_emotions):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO posts (id, source, text, timestamp, label, score, raw_emotions) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (post_id, source, text, timestamp, label, score, raw_emotions)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        # Post already exists, ignore
        pass
    finally:
        conn.close()

def get_recent_posts(limit=20):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, source, text, timestamp, label, score, raw_emotions FROM posts ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": row[0],
            "source": row[1],
            "text": row[2],
            "timestamp": row[3],
            "result": {
                "label": row[4],
                "score": row[5]
            }
        }
        for row in rows
    ]

def get_dashboard_stats():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM posts")
    total = cursor.fetchone()[0]
    
    cursor.execute("SELECT label, COUNT(*) FROM posts GROUP BY label")
    label_counts = dict(cursor.fetchall())
    
    cursor.execute("SELECT AVG(score) FROM posts")
    avg_conf = cursor.fetchone()[0] or 0.0
    
    # By source
    cursor.execute("SELECT source, label, COUNT(*) FROM posts GROUP BY source, label")
    source_stats = cursor.fetchall()
    
    # Trend (group by day)
    cursor.execute("SELECT substr(timestamp, 1, 10) as date, label, COUNT(*) FROM posts GROUP BY date, label ORDER BY date ASC")
    trend_stats = cursor.fetchall()
    
    conn.close()
    
    # Process by source
    by_source_dict = {}
    for source, label, count in source_stats:
        if source not in by_source_dict:
            by_source_dict[source] = {"source": source, "positive": 0, "negative": 0, "neutral": 0}
        label_key = label.lower()
        if label_key in ["positive", "negative", "neutral"]:
            by_source_dict[source][label_key] += count
            
    # Process trend
    trend_dict = {}
    for date, label, count in trend_stats:
        if date not in trend_dict:
            trend_dict[date] = {"date": date, "positive": 0, "negative": 0, "neutral": 0}
        label_key = label.lower()
        if label_key in ["positive", "negative", "neutral"]:
            trend_dict[date][label_key] += count

    return {
        "total": total,
        "positive": label_counts.get("Positive", 0),
        "negative": label_counts.get("Negative", 0),
        "neutral": label_counts.get("Neutral", 0),
        "avgConfidence": avg_conf,
        "bySource": list(by_source_dict.values()),
        "trend": list(trend_dict.values())
    }
