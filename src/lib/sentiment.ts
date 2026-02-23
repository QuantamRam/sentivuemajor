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
}

export function analyzeSentiment(text: string): SentimentResult {
  const words = text.toLowerCase().replace(/[^a-z\s']/g, "").split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount === 0) {
    return { label: "Neutral", score: 0, confidence: 0, positiveCount: 0, negativeCount: 0, wordCount: 0 };
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

  return { label, score: normalizedScore, confidence: Math.round(confidence * 100) / 100, positiveCount, negativeCount, wordCount };
}
