import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeSentiment, type SentimentResult } from "@/lib/sentiment";
import { Send, RotateCcw, ThumbsUp, ThumbsDown, Minus } from "lucide-react";

const exampleTexts = [
  "I absolutely love this product! Best purchase I've ever made.",
  "Terrible experience. The service was awful and I want a refund.",
  "The package arrived on time and the contents were as described.",
  "This is the worst app I've ever used. Crashes constantly!",
  "Really happy with the quality. Would definitely recommend to friends.",
];

const AnalyzePage = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [history, setHistory] = useState<{ text: string; result: SentimentResult }[]>([]);

  const handleAnalyze = () => {
    if (!text.trim()) return;
    const r = analyzeSentiment(text);
    setResult(r);
    setHistory((prev) => [{ text: text.trim(), result: r }, ...prev].slice(0, 20));
  };

  const handleExample = (t: string) => {
    setText(t);
    const r = analyzeSentiment(t);
    setResult(r);
    setHistory((prev) => [{ text: t, result: r }, ...prev].slice(0, 20));
  };

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
            onClick={() => { setText(""); setResult(null); }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
          >
            <RotateCcw className="w-4 h-4" /> Clear
          </button>
          <button
            onClick={handleAnalyze}
            disabled={!text.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" /> Analyze
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
