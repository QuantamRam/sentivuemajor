import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  analyzeSentimentWithAI,
  analyzeAdvanced,
  type SentimentResult,
  type AdvancedAnalytics,
} from "@/lib/sentiment";
import {
  Send, RotateCcw, ThumbsUp, ThumbsDown, Minus, Loader2, Sparkles,
  Activity, Brain, Gauge, Lightbulb, BarChart3,
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  Cell,
} from "recharts";

const exampleTexts = [
  "I absolutely love this product! Best purchase I've ever made.",
  "Terrible experience. The service was awful and I want a refund.",
  "The package arrived on time and the contents were as described.",
  "This is the worst app I've ever used. Crashes constantly!",
  "Really happy with the quality. Would definitely recommend to friends.",
];

const AnalyzePage = () => {
  const [text, setText] = useState("");
  const [analyzedText, setAnalyzedText] = useState("");
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [history, setHistory] = useState<{ text: string; result: SentimentResult }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const advanced: AdvancedAnalytics | null = useMemo(
    () => (result && analyzedText ? analyzeAdvanced(analyzedText, result) : null),
    [result, analyzedText]
  );

  const runAnalyze = async (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setIsLoading(true);
    const r = await analyzeSentimentWithAI(trimmed);
    setResult(r);
    setAnalyzedText(trimmed);
    setHistory((prev) => [{ text: trimmed, result: r }, ...prev].slice(0, 20));
    setIsLoading(false);
  };

  const handleAnalyze = () => runAnalyze(text);
  const handleExample = (t: string) => { setText(t); runAnalyze(t); };

  const sentimentIcon = result?.label === "Positive" ? ThumbsUp : result?.label === "Negative" ? ThumbsDown : Minus;
  const sentimentColor = result?.label === "Positive" ? "text-green-400" : result?.label === "Negative" ? "text-red-400" : "text-muted-foreground";
  const sentimentBg = result?.label === "Positive" ? "bg-green-500/10 border-green-500/20" : result?.label === "Negative" ? "bg-red-500/10 border-red-500/20" : "bg-muted/50 border-border";

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-foreground">Analyze Text</h1>
        <p className="text-muted-foreground mt-1">Enter any text to analyze its sentiment using our rule-based classifier</p>
      </motion.div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)]"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAnalyze(); } }}
          placeholder="Type or paste text to analyze sentiment..."
          className="w-full bg-secondary/50 border border-border rounded-lg p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring font-body text-sm min-h-[120px]"
        />
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => { setText(""); setResult(null); setAnalyzedText(""); }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
          >
            <RotateCcw className="w-4 h-4" /> Clear
          </button>
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isLoading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </motion.div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.label + result.score}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`border rounded-xl p-6 ${sentimentBg}`}
          >
            <div className="flex items-center gap-4 mb-4">
              {(() => { const Icon = sentimentIcon; return <Icon className={`w-8 h-8 ${sentimentColor}`} />; })()}
              <div>
                <h3 className={`text-2xl font-display font-bold ${sentimentColor}`}>{result.label}</h3>
                <p className="text-sm text-muted-foreground">Sentiment Classification</p>
              </div>
            </div>
            
            {result.isAi && result.emotion && (
              <div className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between shadow-sm">
                 <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">AI Emotion Detected</span>
                 </div>
                 <div className="text-right">
                    <p className="text-lg font-bold text-primary">{result.emotion}</p>
                 </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <p className="text-lg font-mono font-bold text-foreground">{(result.score * 100).toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <p className="text-lg font-mono font-bold text-foreground">{(result.confidence * 100).toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <p className="text-lg font-mono font-bold text-green-400">{result.positiveCount}</p>
                <p className="text-xs text-muted-foreground">Positive Words</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <p className="text-lg font-mono font-bold text-red-400">{result.negativeCount}</p>
                <p className="text-xs text-muted-foreground">Negative Words</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Analytics */}
      <AnimatePresence>
        {advanced && result && (
          <motion.div
            key="adv"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Mood + recommendation */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-4">
                  <div className="text-5xl leading-none">{advanced.moodEmoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                      <Brain className="w-3.5 h-3.5" /> Detected Mood
                    </div>
                    <h3 className="text-2xl font-display font-bold text-foreground mt-1">{advanced.mood}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{advanced.emotionalState}</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  <Lightbulb className="w-3.5 h-3.5" /> Suggested Action
                </div>
                <p className="text-sm text-foreground leading-relaxed">{advanced.recommendation}</p>
              </div>
            </div>

            {/* Gauges */}
            <div className="grid md:grid-cols-3 gap-4">
              <MetricGauge label="Polarity" value={advanced.polarity} min={-100} max={100} icon={<Activity className="w-4 h-4" />} colorVar="--primary" />
              <MetricGauge label="Energy" value={advanced.energy} min={0} max={100} icon={<Gauge className="w-4 h-4" />} colorVar="--primary" />
              <MetricGauge label="Subjectivity" value={advanced.subjectivity} min={0} max={100} icon={<BarChart3 className="w-4 h-4" />} colorVar="--primary" />
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
                <h4 className="text-sm font-medium text-foreground mb-1">Emotion Profile</h4>
                <p className="text-xs text-muted-foreground mb-4">Six-axis mapping of detected emotions</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={Object.entries(advanced.emotions).map(([k, v]) => ({ emotion: k.charAt(0).toUpperCase() + k.slice(1), value: v }))}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="emotion" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.35} />
                      <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
                <h4 className="text-sm font-medium text-foreground mb-1">Top Influential Words</h4>
                <p className="text-xs text-muted-foreground mb-4">Words contributing most to the score</p>
                <div className="h-64">
                  {advanced.topWords.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No strong signal words detected</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={advanced.topWords} layout="vertical" margin={{ left: 8, right: 16 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="word" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} width={80} />
                        <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                        <Bar dataKey="weight" radius={[0, 6, 6, 0]}>
                          {advanced.topWords.map((w, i) => (
                            <Cell key={i} fill={w.type === "positive" ? "hsl(142 71% 45%)" : "hsl(0 72% 51%)"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {advanced.topWords.map((w) => (
                    <span
                      key={w.word}
                      className={`text-xs px-2 py-1 rounded-md font-mono ${
                        w.type === "positive"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {w.word}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Word-level highlight + readability */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
                <h4 className="text-sm font-medium text-foreground mb-3">Token-Level Breakdown</h4>
                <div className="flex flex-wrap gap-1.5 leading-relaxed">
                  {advanced.highlights.map((h, i) => (
                    <span
                      key={i}
                      className={`text-sm px-1.5 py-0.5 rounded ${
                        h.type === "positive" ? "bg-green-500/15 text-green-400" :
                        h.type === "negative" ? "bg-red-500/15 text-red-400" :
                        h.type === "negator" ? "bg-yellow-500/15 text-yellow-400" :
                        h.type === "intensifier" ? "bg-primary/15 text-primary" :
                        "text-muted-foreground"
                      }`}
                    >
                      {h.token}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 mt-4 text-xs text-muted-foreground">
                  <LegendDot color="bg-green-500/40" label="positive" />
                  <LegendDot color="bg-red-500/40" label="negative" />
                  <LegendDot color="bg-yellow-500/40" label="negator" />
                  <LegendDot color="bg-primary/40" label="intensifier" />
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)] space-y-3">
                <h4 className="text-sm font-medium text-foreground">Linguistics</h4>
                <Stat label="Sentences" value={advanced.readability.sentences.toString()} />
                <Stat label="Avg word length" value={`${advanced.readability.avgWordLength}`} />
                <Stat label="Lexical diversity" value={`${advanced.readability.uniqueRatio}%`} />
                <Stat label="Total words" value={result.wordCount.toString()} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Examples */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Try an example</h3>
        <div className="flex flex-wrap gap-2">
          {exampleTexts.map((t) => (
            <button
              key={t}
              onClick={() => handleExample(t)}
              className="text-xs px-3 py-2 bg-secondary/50 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-left max-w-xs truncate"
            >
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      {/* History */}
      {history.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Analysis History</h3>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card)] divide-y divide-border">
            {history.map((h, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4">
                <p className="text-sm text-foreground truncate flex-1">{h.text}</p>
                <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-mono font-medium ${
                  h.result.label === "Positive" ? "bg-green-500/10 text-green-400" :
                  h.result.label === "Negative" ? "bg-red-500/10 text-red-400" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {h.result.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnalyzePage;
