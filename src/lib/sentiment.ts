// Rule-based sentiment analyzer using keyword scoring

const positiveWords = new Set([
  "love", "great", "amazing", "awesome", "excellent", "fantastic", "wonderful",
  "good", "best", "happy", "beautiful", "perfect", "brilliant", "superb",
  "outstanding", "incredible", "delightful", "impressive", "magnificent",
  "enjoy", "pleased", "glad", "thankful", "grateful", "recommend", "favorite",
  "like", "nice", "cool", "fun", "exciting", "positive", "helpful", "friendly",
  "comfortable", "satisfied", "fast", "easy", "convenient", "reliable",
  // expanded
  "loved", "loves", "loving", "liked", "likes", "liking", "enjoyed", "enjoying", "enjoys",
  "adore", "adored", "admire", "admired", "appreciate", "appreciated", "appreciation",
  "wow", "yay", "hooray", "cheerful", "joy", "joyful", "joyous", "blissful", "bliss",
  "ecstatic", "elated", "thrilled", "delighted", "delight", "smile", "smiling", "laugh", "laughing",
  "win", "winning", "won", "success", "successful", "succeed", "achieved", "achievement",
  "proud", "pride", "honored", "honor", "respect", "respected", "respectful",
  "kind", "kindness", "generous", "warm", "warmth", "sweet", "lovely", "charming",
  "stunning", "gorgeous", "elegant", "graceful", "smooth", "clean", "fresh",
  "calm", "peaceful", "peace", "relax", "relaxed", "relaxing", "soothing", "serene",
  "hope", "hopeful", "optimistic", "encouraging", "encourage", "encouraged", "inspiring", "inspired", "inspire",
  "motivated", "motivating", "energetic", "vibrant", "bright", "shine", "shining",
  "thanks", "thank", "thx", "appreciated", "blessed", "blessing", "lucky", "fortunate",
  "amaze", "amazed", "wonder", "wonderful", "marvelous", "splendid", "fabulous", "terrific",
  "exceptional", "remarkable", "phenomenal", "spectacular", "stellar", "epic", "legendary",
  "good-quality", "premium", "quality", "valuable", "worthwhile", "worth",
  "smart", "clever", "intelligent", "wise", "talented", "skilled", "capable", "competent",
  "easy-to-use", "intuitive", "seamless", "effortless", "efficient", "productive", "effective",
  "secure", "safe", "trustworthy", "honest", "genuine", "authentic", "real",
  "improved", "improvement", "better", "upgrade", "upgraded", "enhance", "enhanced",
  "fixed", "solved", "resolved", "working", "works", "stable",
  "agree", "agreed", "yes", "absolutely", "definitely", "certainly", "sure",
  "ok", "okay", "fine", "alright", "decent", "solid",
  "handsome", "pretty", "cute", "adorable",
  "fair", "fairly", "reasonable", "affordable", "cheap", "bargain", "deal", "discount",
  "rich", "wealthy", "abundant", "plenty",
  "passionate", "passion", "dedicated", "devoted", "committed",
  "courageous", "brave", "bold", "fearless", "strong", "powerful", "mighty",
  "free", "freedom", "liberated",
  "celebrate", "celebrated", "celebration", "festive",
  "healthy", "healthier", "wellness", "fit", "fitness", "energized",
  "innovative", "innovation", "creative", "creativity", "original",
  "popular", "famous", "renowned", "trusted",
  "fast-paced", "quick", "rapid", "swift", "responsive", "snappy",
  "comfortable", "cozy", "pleasant", "pleasing", "enjoyable", "satisfying", "satisfaction",
  "approve", "approved", "approval", "accept", "accepted", "welcome", "welcomed",
]);

const negativeWords = new Set([
  "hate", "terrible", "awful", "horrible", "worst", "bad", "poor", "disgusting",
  "ugly", "pathetic", "useless", "disappointing", "annoying", "frustrating",
  "angry", "sad", "unhappy", "broken", "failed", "waste", "boring", "dull",
  "slow", "expensive", "rude", "uncomfortable", "difficult", "complicated",
  "unreliable", "scam", "never", "dislike", "regret", "problem", "issue",
  "complaint", "refund", "cancel", "damaged", "defective",
  // expanded
  "hated", "hates", "hating", "loathe", "loathed", "despise", "despised", "detest",
  "disliked", "dislikes", "disliking", "disgust", "disgusted", "revolting", "repulsive", "gross", "nasty",
  "horrendous", "atrocious", "appalling", "dreadful", "ghastly", "vile", "wretched",
  "terrible", "horrible", "horrifying", "horrified", "scary", "scared", "frightening", "frightened",
  "afraid", "fear", "fearful", "anxious", "anxiety", "worried", "worry", "worrying",
  "nervous", "panic", "panicked", "stress", "stressed", "stressful", "tense", "tension",
  "depressed", "depression", "miserable", "misery", "gloomy", "grief", "grieving", "mourning",
  "lonely", "loneliness", "alone", "isolated", "abandoned",
  "cry", "cried", "crying", "tears", "weep", "weeping", "sob", "sobbing",
  "hurt", "hurts", "hurting", "pain", "painful", "ache", "aching", "suffer", "suffering",
  "sick", "ill", "illness", "disease", "weak", "tired", "exhausted", "fatigue", "fatigued",
  "lose", "lost", "loser", "losing", "loss", "fail", "failure", "failing", "fails",
  "wrong", "mistake", "mistaken", "error", "errors", "buggy", "bug", "bugs", "glitch", "glitchy",
  "crash", "crashes", "crashed", "crashing", "freeze", "freezes", "frozen", "lag", "laggy",
  "stupid", "dumb", "idiotic", "moronic", "ridiculous", "absurd", "silly", "foolish",
  "ignorant", "naive", "clueless",
  "evil", "wicked", "cruel", "brutal", "savage", "violent", "abusive", "abuse", "abused",
  "kill", "killed", "killing", "death", "dead", "die", "died", "dying", "murder", "murdered",
  "war", "fight", "fighting", "conflict", "battle", "attack", "attacked", "attacking",
  "enemy", "enemies", "hostile", "hostility", "threat", "threatening", "threatened",
  "betray", "betrayed", "betrayal", "cheat", "cheated", "cheating", "lie", "lied", "lying", "liar",
  "fraud", "fraudulent", "fake", "phony", "bogus", "deceptive", "deceit", "deceitful",
  "corrupt", "corruption", "shady", "sketchy", "suspicious",
  "expensive", "overpriced", "costly", "pricey", "rip-off", "ripoff",
  "broken", "shattered", "cracked", "destroyed", "ruined", "demolished",
  "dirty", "filthy", "messy", "cluttered", "stained", "smelly", "stinky",
  "noisy", "loud", "irritating", "irritated", "irritate", "bothered", "bother", "bothersome",
  "frustrated", "frustration", "furious", "fury", "outraged", "outrage", "rage", "raging",
  "mad", "pissed", "agitated", "upset", "bitter", "resent", "resentful", "resentment",
  "jealous", "jealousy", "envious", "envy", "greedy", "greed", "selfish",
  "lazy", "incompetent", "unprofessional", "unqualified", "amateur",
  "no", "nope", "nah", "nothing", "nobody", "none",
  "cannot", "can't", "couldn't", "won't", "wouldn't", "shouldn't",
  "down", "downhill", "decline", "declining", "decrease", "decreased", "drop", "dropped", "fell", "fall",
  "ban", "banned", "block", "blocked", "reject", "rejected", "denied", "deny",
  "delay", "delayed", "late", "overdue",
  "missing", "lost", "stolen", "steal", "robbed", "rob",
  "harm", "harmful", "dangerous", "danger", "risk", "risky", "unsafe", "hazardous",
  "toxic", "poison", "poisonous", "contaminated",
  "concern", "concerned", "concerning", "alarming", "alarmed",
  "doubt", "doubtful", "skeptical", "uncertain", "unsure", "confusing", "confused", "confusion",
  "ugly", "hideous", "unattractive",
  "hard", "hardest", "tough", "harsh", "severe",
  "weakness", "flaw", "flawed", "defect", "defective", "faulty", "malfunction",
  "complain", "complained", "complaining",
  "ignore", "ignored", "neglect", "neglected", "neglectful",
  "boring", "bored", "tedious", "monotonous", "bland", "tasteless",
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
}

// ─── Advanced analytics ────────────────────────────────────────────────

export type MoodLabel =
  | "Joyful"
  | "Content"
  | "Calm"
  | "Neutral"
  | "Tense"
  | "Frustrated"
  | "Angry"
  | "Sad"
  | "Excited"
  | "Anxious";

export interface EmotionScores {
  joy: number;
  anger: number;
  sadness: number;
  fear: number;
  surprise: number;
  trust: number;
}

export interface AdvancedAnalytics {
  mood: MoodLabel;
  moodEmoji: string;
  emotionalState: string;
  energy: number;        // 0-100, low=calm, high=intense
  polarity: number;      // -100..100
  subjectivity: number;  // 0-100
  emotions: EmotionScores;
  topWords: { word: string; type: "positive" | "negative"; weight: number }[];
  highlights: { token: string; type: "positive" | "negative" | "negator" | "intensifier" | "neutral" }[];
  readability: { sentences: number; avgWordLength: number; uniqueRatio: number };
  recommendation: string;
}

const emotionLexicon: Record<keyof EmotionScores, string[]> = {
  joy: ["love", "happy", "joy", "great", "amazing", "awesome", "excited", "delight", "wonderful", "fantastic", "enjoy", "glad", "pleased", "fun", "smile", "laugh", "best", "brilliant"],
  anger: ["hate", "angry", "furious", "rage", "annoying", "annoyed", "mad", "irritated", "outraged", "pissed", "frustrating", "frustrated", "rude"],
  sadness: ["sad", "unhappy", "depressed", "miserable", "cry", "cried", "lonely", "broken", "regret", "disappointing", "disappointed", "sorry", "loss", "hurt"],
  fear: ["afraid", "scared", "worried", "anxious", "nervous", "terrified", "panic", "fear", "concerned", "uneasy", "dread"],
  surprise: ["wow", "surprised", "shocked", "unexpected", "incredible", "unbelievable", "astonished", "amazed", "sudden"],
  trust: ["reliable", "trust", "honest", "safe", "secure", "recommend", "loyal", "dependable", "confident", "support", "helpful", "friendly"],
};

const moodEmojis: Record<MoodLabel, string> = {
  Joyful: "😄", Content: "🙂", Calm: "😌", Neutral: "😐",
  Tense: "😬", Frustrated: "😠", Angry: "😡", Sad: "😢",
  Excited: "🤩", Anxious: "😰",
};

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z\s']/g, "").split(/\s+/).filter(Boolean);
}

export function analyzeAdvanced(text: string, base: SentimentResult): AdvancedAnalytics {
  const words = tokenize(text);
  const sentences = Math.max(1, (text.match(/[.!?]+/g) || []).length);
  const unique = new Set(words);
  const avgWordLength = words.length ? words.reduce((s, w) => s + w.length, 0) / words.length : 0;

  // Emotion scoring
  const emotions: EmotionScores = { joy: 0, anger: 0, sadness: 0, fear: 0, surprise: 0, trust: 0 };
  const wordWeights = new Map<string, { type: "positive" | "negative"; weight: number }>();
  const highlights: AdvancedAnalytics["highlights"] = [];

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const prev = i > 0 ? words[i - 1] : "";
    const negated = negators.has(prev);
    const intensified = intensifiers.has(prev);
    const mult = intensified ? 1.6 : 1;

    let matched = false;
    (Object.keys(emotionLexicon) as (keyof EmotionScores)[]).forEach((emo) => {
      if (emotionLexicon[emo].includes(w)) {
        emotions[emo] += mult * (negated ? 0.3 : 1);
        matched = true;
      }
    });

    if (positiveWords.has(w)) {
      const t = negated ? "negative" : "positive";
      wordWeights.set(w, { type: t, weight: (wordWeights.get(w)?.weight || 0) + mult });
      highlights.push({ token: w, type: t });
      matched = true;
    } else if (negativeWords.has(w)) {
      const t = negated ? "positive" : "negative";
      wordWeights.set(w, { type: t, weight: (wordWeights.get(w)?.weight || 0) + mult });
      highlights.push({ token: w, type: t });
      matched = true;
    } else if (negators.has(w)) {
      highlights.push({ token: w, type: "negator" });
      matched = true;
    } else if (intensifiers.has(w)) {
      highlights.push({ token: w, type: "intensifier" });
      matched = true;
    }
    if (!matched) highlights.push({ token: w, type: "neutral" });
  }

  // Normalize emotions to 0..100
  const maxEmo = Math.max(1, ...Object.values(emotions));
  const normalized: EmotionScores = {
    joy: Math.round((emotions.joy / maxEmo) * 100),
    anger: Math.round((emotions.anger / maxEmo) * 100),
    sadness: Math.round((emotions.sadness / maxEmo) * 100),
    fear: Math.round((emotions.fear / maxEmo) * 100),
    surprise: Math.round((emotions.surprise / maxEmo) * 100),
    trust: Math.round((emotions.trust / maxEmo) * 100),
  };

  // Energy = exclamations + caps + intensifiers + total emotion magnitude
  const exclaims = (text.match(/!/g) || []).length;
  const capsWords = (text.match(/\b[A-Z]{2,}\b/g) || []).length;
  const intensCount = words.filter((w) => intensifiers.has(w)).length;
  const emoSum = Object.values(emotions).reduce((s, v) => s + v, 0);
  const energy = Math.min(100, Math.round(exclaims * 12 + capsWords * 10 + intensCount * 8 + emoSum * 6));

  const polarity = Math.round(base.score * 100);
  const subjectivity = Math.min(100, Math.round(((base.positiveCount + base.negativeCount) / Math.max(1, words.length)) * 250));

  // Mood derivation
  let mood: MoodLabel = "Neutral";
  const dominant = (Object.entries(normalized) as [keyof EmotionScores, number][])
    .sort((a, b) => b[1] - a[1])[0];
  const [domEmo, domVal] = dominant;

  if (domVal < 15 && Math.abs(polarity) < 15) mood = "Neutral";
  else if (domEmo === "joy") mood = energy > 55 ? "Excited" : polarity > 40 ? "Joyful" : "Content";
  else if (domEmo === "trust") mood = "Calm";
  else if (domEmo === "anger") mood = energy > 50 ? "Angry" : "Frustrated";
  else if (domEmo === "sadness") mood = "Sad";
  else if (domEmo === "fear") mood = energy > 45 ? "Anxious" : "Tense";
  else if (domEmo === "surprise") mood = polarity >= 0 ? "Excited" : "Tense";

  // Emotional state sentence
  const stateMap: Record<MoodLabel, string> = {
    Joyful: "The writer expresses strong positive emotion and satisfaction.",
    Content: "A generally pleasant, settled emotional tone.",
    Calm: "Composed and trusting — measured language with positive undertones.",
    Neutral: "Balanced and informational — little emotional charge detected.",
    Tense: "Subtle unease or apprehension is present in the wording.",
    Frustrated: "Mild irritation or dissatisfaction is evident.",
    Angry: "Strong negative emotion and high intensity detected.",
    Sad: "Low mood and disappointment dominate the language.",
    Excited: "High energy combined with positive arousal.",
    Anxious: "Worry and elevated arousal — fear-related cues are strong.",
  };

  const recMap: Record<MoodLabel, string> = {
    Joyful: "Amplify this — share the experience publicly.",
    Content: "Good moment to engage further or follow up.",
    Calm: "Trust signals are high — a great time for outreach.",
    Neutral: "Consider asking a clarifying question to surface true sentiment.",
    Tense: "Address concerns proactively before escalation.",
    Frustrated: "Acknowledge the issue and offer a concrete fix.",
    Angry: "Prioritize empathetic response and immediate resolution.",
    Sad: "Respond with empathy and supportive language.",
    Excited: "Channel the energy into a clear next step or CTA.",
    Anxious: "Provide reassurance and clear, factual information.",
  };

  const topWords = Array.from(wordWeights.entries())
    .map(([word, v]) => ({ word, ...v }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 6);

  return {
    mood,
    moodEmoji: moodEmojis[mood],
    emotionalState: stateMap[mood],
    energy,
    polarity,
    subjectivity,
    emotions: normalized,
    topWords,
    highlights,
    readability: {
      sentences,
      avgWordLength: Math.round(avgWordLength * 10) / 10,
      uniqueRatio: words.length ? Math.round((unique.size / words.length) * 100) : 0,
    },
    recommendation: recMap[mood],
  };
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
      isAi: true
    };
  } catch (error) {
    console.error("Failed to connect to Local AI:", error);
    return fallback;
  }
}
