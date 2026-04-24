// Rule-based sentiment analyzer using keyword scoring

const positiveWords = new Set([
  "love", "great", "amazing", "awesome", "excellent", "fantastic", "wonderful",
  "good", "best", "happy", "beautiful", "perfect", "brilliant", "superb",
  "outstanding", "incredible", "delightful", "impressive", "magnificent",
  "enjoy", "pleased", "glad", "thankful", "grateful", "recommend", "favorite",
  "like", "nice", "cool", "fun", "exciting", "positive", "helpful", "friendly",
  "comfortable", "satisfied", "fast", "easy", "convenient", "reliable",
]);

const negativeWords = new Set([
  "hate", "terrible", "awful", "horrible", "worst", "bad", "poor", "disgusting",
  "ugly", "pathetic", "useless", "disappointing", "annoying", "frustrating",
  "angry", "sad", "unhappy", "broken", "failed", "waste", "boring", "dull",
  "slow", "expensive", "rude", "uncomfortable", "difficult", "complicated",
  "unreliable", "scam", "never", "dislike", "regret", "problem", "issue",
  "complaint", "refund", "cancel", "damaged", "defective",
]);

const intensifiers = new Set(["very", "extremely", "absolutely", "totally", "really", "so", "incredibly"]);
const negators = new Set(["not", "no", "never", "neither", "nobody", "nothing", "nowhere", "nor", "don't", "doesn't", "didn't", "won't", "wouldn't", "couldn't", "shouldn't", "isn't", "aren't", "wasn't", "weren't"]);

export type SentimentLabel = "Positive" | "Negative" | "Neutral";

export interface SentimentResult {
  label: SentimentLabel;
  score: number; // -1 to 1
  confidence: number; // 0 to 1
  positiveCount: number;
  negativeCount: number;
  wordCount: number;
  emotion?: string;
  emotionScore?: number;
  allEmotions?: { label: string; score: number }[];
  isAi?: boolean;
  keywords?: string[];
  uniqueWords?: number;
  readingTime?: number;
  averageWordLength?: number;
  complexityScore?: string;
}

export function analyzeSentiment(text: string): SentimentResult {
  const words = text.toLowerCase().replace(/[^a-z\s']/g, "").split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const uniqueWords = new Set(words).size;
  const readingTime = Math.round((wordCount / 200) * 60) || 1; // in seconds
  const totalChars = words.reduce((acc, word) => acc + word.length, 0);
  const averageWordLength = wordCount > 0 ? Number((totalChars / wordCount).toFixed(1)) : 0;
  
  let complexityScore = "Basic";
  if (averageWordLength > 6 || (wordCount > 50 && (uniqueWords / wordCount) > 0.8)) complexityScore = "Advanced";
  else if (averageWordLength > 4.5) complexityScore = "Intermediate";

  if (wordCount === 0) {
    return { label: "Neutral", score: 0, confidence: 0, positiveCount: 0, negativeCount: 0, wordCount: 0, uniqueWords: 0, readingTime: 0, averageWordLength: 0, complexityScore: "Basic" };
  }

  let score = 0;
  let positiveCount = 0;
  let negativeCount = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = i > 0 ? words[i - 1] : "";
    const isNegated = negators.has(prevWord);
    const isIntensified = intensifiers.has(prevWord);
    const multiplier = isIntensified ? 1.5 : 1;

    if (positiveWords.has(word)) {
      if (isNegated) {
        score -= 1 * multiplier;
        negativeCount++;
      } else {
        score += 1 * multiplier;
        positiveCount++;
      }
    } else if (negativeWords.has(word)) {
      if (isNegated) {
        score += 0.5 * multiplier;
        positiveCount++;
      } else {
        score -= 1 * multiplier;
        negativeCount++;
      }
    }
  }

  const normalizedScore = Math.max(-1, Math.min(1, score / Math.max(wordCount * 0.3, 1)));
  const confidence = Math.min(1, (positiveCount + negativeCount) / Math.max(wordCount * 0.2, 1));

  let label: SentimentLabel;
  if (normalizedScore > 0.1) label = "Positive";
  else if (normalizedScore < -0.1) label = "Negative";
  else label = "Neutral";

  return { label, score: normalizedScore, confidence: Math.round(confidence * 100) / 100, positiveCount, negativeCount, wordCount, uniqueWords, readingTime, averageWordLength, complexityScore };
}

export async function analyzeSentimentWithAI(text: string): Promise<SentimentResult> {
  const fallback = analyzeSentiment(text);
  
  if (text.trim().length === 0) {
      return fallback;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.warn("AI Backend not reachable or error, falling back to rule-based.");
      return fallback;
    }

    const data = await response.json();
    
    // Map the returned data, but keep some of the stats from the fallback 
    // for UI consistency (like positive/negative word counts).
    return {
      label: data.label, // From AI
      score: data.emotion_score, // Using emotion score as confidence for display
      confidence: data.emotion_score,
      emotion: data.emotion,
      emotionScore: data.emotion_score,
      allEmotions: data.all_emotions,
      positiveCount: fallback.positiveCount,
      negativeCount: fallback.negativeCount,
      wordCount: fallback.wordCount,
      uniqueWords: fallback.uniqueWords,
      readingTime: fallback.readingTime,
      averageWordLength: fallback.averageWordLength,
      complexityScore: fallback.complexityScore,
      isAi: true,
      keywords: data.keywords
    };
  } catch (error) {
    console.error("Failed to connect to Local AI:", error);
    return fallback;
  }
}
