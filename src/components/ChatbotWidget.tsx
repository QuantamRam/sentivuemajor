import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Msg = { role: "bot" | "user"; text: string; suggestions?: string[] };

const KB: { keywords: string[]; answer: string; suggestions?: string[] }[] = [
  {
    keywords: ["hi", "hello", "hey", "hola"],
    answer: "Hey there! 👋 I'm SentiBot — ask me anything about SentiVue, sentiment analysis, or how to use the app.",
    suggestions: ["What is SentiVue?", "How does analysis work?", "Show me features"],
  },
  {
    keywords: ["what", "sentivue", "about", "project"],
    answer: "SentiVue is a sentiment analysis platform built around an IEEE conference paper. It classifies text as Positive, Negative, or Neutral, and provides advanced emotional analytics, mood detection, and visualizations.",
    suggestions: ["How accurate is it?", "What are the features?"],
  },
  {
    keywords: ["how", "work", "analysis", "analyze", "classify", "classifier"],
    answer: "We use a rule-based lexicon classifier with 250+ words, negation handling (e.g. 'not good'), and intensifiers (e.g. 'very bad'). The dominant word count decides the label, with score thresholds as a fallback.",
    suggestions: ["What metrics do you show?", "Try the analyzer"],
  },
  {
    keywords: ["feature", "features", "capabilities", "what can"],
    answer: "Key features:\n• Live text analyzer\n• Mood + emotional state detection\n• Emotion radar (joy, anger, sadness, fear, surprise, trust)\n• Polarity, energy & subjectivity gauges\n• Token highlighting\n• X (Twitter) sentiment dashboard\n• Dataset explorer",
    suggestions: ["How accurate is it?", "Who built this?"],
  },
  {
    keywords: ["accurate", "accuracy", "performance", "results"],
    answer: "On the benchmark dataset the classifier reaches strong accuracy on clearly polarised text. For mixed sentences we now prioritise the dominant sentiment count, so 'okay but frustrating and broken' will correctly be Negative.",
    suggestions: ["Show me the formulas", "Try the analyzer"],
  },
  {
    keywords: ["mood", "emotion", "emotional", "feeling"],
    answer: "The Analyze page maps your text to a mood (Joyful, Calm, Anxious, Frustrated, etc.) plus six emotion axes shown on a radar chart. It also recommends a follow-up action based on the detected state.",
    suggestions: ["What metrics do you show?"],
  },
  {
    keywords: ["metric", "metrics", "score", "polarity", "energy", "subjectivity"],
    answer: "Three core metrics:\n• Polarity (-100 to +100): overall sentiment direction\n• Energy: intensity of emotion\n• Subjectivity: opinion vs fact ratio",
    suggestions: ["How does analysis work?"],
  },
  {
    keywords: ["x", "twitter", "social"],
    answer: "The X Analysis page tracks Twitter-style sentiment trends with influencer breakdowns. Find it in the sidebar under 'X Analysis'.",
  },
  {
    keywords: ["dataset", "data"],
    answer: "The Dataset page lets you explore the labelled corpus used to validate the classifier. Admin access is required for editing.",
  },
  {
    keywords: ["author", "who", "team", "made", "built", "creator"],
    answer: "Built by:\n• Dr. V. Suganya\n• S. Ram Chandar\n• G. Aditya Venkatesh\nIEEE Conference Paper · 2025",
  },
  {
    keywords: ["formula", "math", "equation"],
    answer: "Score is computed as Σ(word polarity × intensifier × negation flip) / signal-word count. Confidence factors in both signal ratio and absolute signal volume.",
  },
  {
    keywords: ["thanks", "thank", "thx", "ty"],
    answer: "Anytime! 💙 Try pasting a paragraph into the Analyze page to see the full breakdown.",
  },
  {
    keywords: ["bye", "goodbye", "see ya"],
    answer: "Catch you later! 👋",
  },
];

const FALLBACK = {
  answer: "I'm not sure about that one yet. Try asking about: how SentiVue works, features, mood detection, metrics, the dataset, or the authors.",
  suggestions: ["What is SentiVue?", "What are the features?", "How does analysis work?"],
};

const findAnswer = (input: string) => {
  const text = input.toLowerCase();
  let best: { entry: typeof KB[number]; hits: number } | null = null;
  for (const entry of KB) {
    const hits = entry.keywords.reduce((n, k) => (text.includes(k) ? n + 1 : n), 0);
    if (hits > 0 && (!best || hits > best.hits)) best = { entry, hits };
  }
  return best?.entry ?? FALLBACK;
};

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi! I'm SentiBot 🤖 — your guide to SentiVue. Ask me anything!",
      suggestions: ["What is SentiVue?", "How does analysis work?", "What are the features?"],
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    const reply = findAnswer(text);
    setMessages((m) => [
      ...m,
      { role: "user", text },
      { role: "bot", text: reply.answer, suggestions: reply.suggestions },
    ]);
    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)] flex items-center justify-center"
        aria-label="Open chatbot"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="msg" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[28rem] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border bg-secondary/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-sm text-foreground">SentiBot</p>
                <p className="text-[10px] text-muted-foreground font-mono">Online · pre-trained on SentiVue</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%] space-y-2">
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-secondary text-foreground rounded-bl-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.role === "bot" && m.suggestions && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => send(s)}
                            className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors font-mono"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="p-3 border-t border-border flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about SentiVue…"
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;