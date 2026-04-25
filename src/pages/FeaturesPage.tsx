import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Globe, Brain, Shield, Zap, BarChart3, Bot,
  Layers, Workflow, Fingerprint, Sparkles, Lock, Radar, Wand2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { analyzeSentiment, analyzeAdvanced } from "@/lib/sentiment";

const features = [
  {
    icon: Globe,
    title: "Website Crawler",
    description: "Crawl any website and extract sentiment from articles, reviews, and user comments in real-time.",
    status: "coming-soon" as const,
    gradient: "from-sky-500/20 to-blue-600/20",
    iconColor: "text-sky-400",
  },
  {
    icon: Brain,
    title: "AI-Powered NLP",
    description: "Deep learning transformer models (BERT, GPT) for state-of-the-art sentiment classification accuracy.",
    status: "coming-soon" as const,
    gradient: "from-purple-500/20 to-violet-600/20",
    iconColor: "text-purple-400",
  },
  {
    icon: Radar,
    title: "Real-Time Monitoring",
    description: "Live dashboard tracking sentiment shifts across platforms with instant alerts and notifications.",
    status: "coming-soon" as const,
    gradient: "from-emerald-500/20 to-green-600/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Bot,
    title: "Chatbot Integration",
    description: "AI chatbot for natural language queries about sentiment trends and data insights.",
    status: "coming-soon" as const,
    gradient: "from-amber-500/20 to-orange-600/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Shield,
    title: "Fake Review Detection",
    description: "Machine learning algorithms to identify and flag suspicious or fraudulent reviews.",
    status: "coming-soon" as const,
    gradient: "from-red-500/20 to-rose-600/20",
    iconColor: "text-red-400",
  },
  {
    icon: Layers,
    title: "Multi-Language Support",
    description: "Analyze sentiment across 50+ languages with automatic language detection and translation.",
    status: "coming-soon" as const,
    gradient: "from-teal-500/20 to-cyan-600/20",
    iconColor: "text-teal-400",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Comprehensive reports with trend forecasting, competitor analysis, and exportable dashboards.",
    status: "coming-soon" as const,
    gradient: "from-indigo-500/20 to-blue-600/20",
    iconColor: "text-indigo-400",
  },
  {
    icon: Workflow,
    title: "API Integrations",
    description: "Connect with Slack, Discord, Teams, and 100+ platforms for automated sentiment workflows.",
    status: "coming-soon" as const,
    gradient: "from-pink-500/20 to-fuchsia-600/20",
    iconColor: "text-pink-400",
  },
  {
    icon: Fingerprint,
    title: "Entity Recognition",
    description: "Named entity extraction to identify brands, people, and topics driving sentiment.",
    status: "coming-soon" as const,
    gradient: "from-lime-500/20 to-green-600/20",
    iconColor: "text-lime-400",
  },
  {
    icon: Zap,
    title: "Emotion Detection",
    description: "Go beyond positive/negative — detect joy, anger, fear, surprise, and more nuanced emotions.",
    status: "live" as const,
    gradient: "from-yellow-500/20 to-amber-600/20",
    iconColor: "text-yellow-400",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "SOC 2 compliant data handling with end-to-end encryption and role-based access control.",
    status: "coming-soon" as const,
    gradient: "from-slate-500/20 to-zinc-600/20",
    iconColor: "text-slate-400",
  },
  {
    icon: Sparkles,
    title: "Custom Model Training",
    description: "Train domain-specific models on your own data for industry-tailored sentiment analysis.",
    status: "coming-soon" as const,
    gradient: "from-cyan-500/20 to-sky-600/20",
    iconColor: "text-cyan-400",
  },
];

const FeaturesPage = () => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-xs font-mono text-primary">Roadmap</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
          Advanced Features
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Powerful capabilities coming soon to SentiVue. Our team is building the next generation of sentiment analysis tools powered by cutting-edge AI and NLP research.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-card)] hover:border-primary/30 transition-all duration-300 overflow-hidden"
          >
            {/* Background gradient on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-secondary/50 border border-border flex items-center justify-center group-hover:border-primary/20 transition-colors`}>
                  <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                {feature.status === "live" ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    ● Live
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 animate-pulse">
                    Coming Soon
                  </span>
                )}
              </div>

              <h3 className="text-lg font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <EmotionDetectionPanel />

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative bg-card border border-border rounded-2xl p-8 md:p-12 shadow-[var(--shadow-card)] overflow-hidden text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        
        <div className="relative z-10">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
            The Future of Sentiment Analysis
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            We're building the most comprehensive sentiment analysis platform. Stay tuned for these powerful features powered by cutting-edge research from our IEEE publication.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-xl text-sm font-mono text-primary">
              Based on IEEE Research
            </div>
            <div className="px-5 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm font-mono text-muted-foreground">
              Vel Tech University
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturesPage;

const EMOTION_META: Record<string, { emoji: string; color: string; label: string }> = {
  joy: { emoji: "😊", color: "bg-yellow-400", label: "Joy" },
  anger: { emoji: "😠", color: "bg-red-500", label: "Anger" },
  sadness: { emoji: "😢", color: "bg-blue-500", label: "Sadness" },
  fear: { emoji: "😨", color: "bg-purple-500", label: "Fear" },
  surprise: { emoji: "😲", color: "bg-pink-500", label: "Surprise" },
  trust: { emoji: "🤝", color: "bg-emerald-500", label: "Trust" },
};

const SAMPLES = [
  "I'm absolutely thrilled with the new update — it works beautifully and feels so smooth!",
  "I'm worried this won't be ready in time. Everything keeps breaking and I'm exhausted.",
  "The package arrived on time. The product matches the description.",
];

function EmotionDetectionPanel() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return null;
    const base = analyzeSentiment(trimmed);
    const adv = analyzeAdvanced(trimmed, base);
    const sorted = (Object.entries(adv.emotions) as [keyof typeof adv.emotions, number][])
      .sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0];
    return { base, adv, sorted, dominant };
  }, [text]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative bg-card border border-border rounded-2xl p-6 md:p-8 shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/5 pointer-events-none" />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-display font-semibold text-foreground">Emotion Detection</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ● Live
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Paste any text — we'll detect joy, anger, fear, surprise, sadness, and trust.</p>
            </div>
          </div>

          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a sentence, review, tweet, or paragraph here…"
            className="min-h-[180px] bg-background/50 font-sans text-sm"
          />

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center">Try:</span>
            {SAMPLES.map((s, i) => (
              <Button
                key={i}
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => setText(s)}
              >
                Sample {i + 1}
              </Button>
            ))}
            {text && (
              <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setText("")}>
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {!result ? (
            <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center border border-dashed border-border rounded-xl p-6">
              <Wand2 className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Your emotion analysis will appear here.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-mono">Dominant Emotion</div>
                  <div className="text-2xl font-display font-bold text-foreground mt-1">
                    {EMOTION_META[result.dominant[0]]?.label} {EMOTION_META[result.dominant[0]]?.emoji}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-mono">Mood</div>
                  <div className="text-2xl font-display font-bold text-foreground mt-1">
                    {result.adv.moodEmoji} <span className="text-base">{result.adv.mood}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground italic px-1">
                "{result.adv.emotionalState}"
              </p>

              <div className="space-y-2">
                {result.sorted.map(([emo, val]) => {
                  const meta = EMOTION_META[emo];
                  return (
                    <div key={emo} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground font-medium">
                          {meta.emoji} {meta.label}
                        </span>
                        <span className="font-mono text-muted-foreground">{val}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 0.6 }}
                          className={`h-full ${meta.color}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <Stat label="Polarity" value={`${result.adv.polarity > 0 ? "+" : ""}${result.adv.polarity}`} />
                <Stat label="Energy" value={`${result.adv.energy}`} />
                <Stat label="Subjectivity" value={`${result.adv.subjectivity}%`} />
              </div>

              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground">
                <span className="font-semibold text-primary">Insight: </span>
                {result.adv.recommendation}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 rounded-lg bg-background/50 border border-border text-center">
      <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">{label}</div>
      <div className="text-sm font-display font-bold text-foreground mt-0.5">{value}</div>
    </div>
  );
}
