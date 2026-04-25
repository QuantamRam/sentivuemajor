import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Scale, MessageSquareWarning, TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { analyzeSentiment, analyzeAdvanced } from "@/lib/sentiment";

/* 1. SENTIMENT HEATMAP */
export function SentimentHeatmapPanel() {
  const [text, setText] = useState(
    "The new design is absolutely stunning and fast, but the checkout keeps crashing and customer support was terribly rude."
  );

  const { highlights, base, adv } = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return { highlights: [] as ReturnType<typeof analyzeAdvanced>["highlights"], base: null as ReturnType<typeof analyzeSentiment> | null, adv: null as ReturnType<typeof analyzeAdvanced> | null };
    const b = analyzeSentiment(trimmed);
    const a = analyzeAdvanced(trimmed, b);
    return { highlights: a.highlights, base: b, adv: a };
  }, [text]);

  const tokenClass = (type: string) => {
    switch (type) {
      case "positive": return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
      case "negative": return "bg-red-500/20 text-red-300 border border-red-500/30";
      case "negator": return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
      case "intensifier": return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
      default: return "text-muted-foreground";
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative bg-card border border-border rounded-2xl p-6 md:p-8 shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 pointer-events-none" />
      <div className="relative z-10 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-display font-semibold text-foreground">Sentiment Heatmap</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">● Live</span>
            </div>
            <p className="text-xs text-muted-foreground">Word-level polarity visualization with negation & intensifier detection.</p>
          </div>
        </div>

        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[110px] bg-background/50 font-sans text-sm" />

        {highlights.length > 0 && base && adv && (
          <>
            <div className="p-4 rounded-xl bg-background/50 border border-border min-h-[80px] leading-loose">
              {highlights.map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.01, 0.5) }}
                  className={`inline-block mx-0.5 my-0.5 px-1.5 py-0.5 rounded text-sm ${tokenClass(h.type)}`}
                >
                  {h.token}
                </motion.span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 text-xs">
              <Legend color="bg-emerald-500/30 border-emerald-500/40" label="Positive" />
              <Legend color="bg-red-500/30 border-red-500/40" label="Negative" />
              <Legend color="bg-amber-500/30 border-amber-500/40" label="Negator" />
              <Legend color="bg-purple-500/30 border-purple-500/40" label="Intensifier" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <MiniStat label="Positive" value={base.positiveCount} accent="text-emerald-400" />
              <MiniStat label="Negative" value={base.negativeCount} accent="text-red-400" />
              <MiniStat label="Polarity" value={`${adv.polarity > 0 ? "+" : ""}${adv.polarity}`} accent="text-primary" />
              <MiniStat label="Subjectivity" value={`${adv.subjectivity}%`} accent="text-foreground" />
            </div>
          </>
        )}
      </div>
    </motion.section>
  );
}

/* 2. SARCASM DETECTOR */
const sarcasmCues = ["yeah right", "sure thing", "oh great", "just great", "thanks a lot", "as if", "love it", "exactly what i needed", "what a surprise"];
const negativeContextCues = ["broken", "late", "crash", "crashed", "failed", "wrong", "problem", "issue", "rude", "delay", "delayed", "lost", "missing", "waste", "again", "still", "another", "supposed"];

export function SarcasmDetectorPanel() {
  const [text, setText] = useState("Oh great, another update that broke everything. Thanks a lot, exactly what I needed today.");

  const result = useMemo(() => {
    const t = text.trim();
    if (!t) return null;
    const lower = t.toLowerCase();
    const base = analyzeSentiment(t);
    const sarcasmHits = sarcasmCues.filter((c) => lower.includes(c));
    const negContextHits = negativeContextCues.filter((c) => lower.includes(c));
    const exclaim = (t.match(/!/g) || []).length;
    const ellipsis = (t.match(/\.{2,}/g) || []).length;
    const quotedPositive = /"[^"]*(great|amazing|wonderful|perfect|love)[^"]*"/i.test(t);

    let score = 0;
    score += sarcasmHits.length * 25;
    score += negContextHits.length * 12;
    score += quotedPositive ? 25 : 0;
    score += ellipsis * 8;
    if (base.positiveCount > 0 && negContextHits.length > 0) score += 25;
    if (base.label === "Positive" && negContextHits.length >= 2) score += 20;
    score = Math.min(100, score);

    const verdict = score >= 65 ? "Likely Sarcastic" : score >= 35 ? "Possibly Ironic" : "Sincere";
    return { score, verdict, sarcasmHits, negContextHits, exclaim, ellipsis, base };
  }, [text]);

  const verdictColor =
    result?.verdict === "Likely Sarcastic" ? "text-rose-400 border-rose-500/30 bg-rose-500/10"
    : result?.verdict === "Possibly Ironic" ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
    : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative bg-card border border-border rounded-2xl p-6 md:p-8 shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-pink-500/5 pointer-events-none" />
      <div className="relative z-10 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <MessageSquareWarning className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-display font-semibold text-foreground">Sarcasm & Irony Detector</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">● Live</span>
            </div>
            <p className="text-xs text-muted-foreground">Detects positive language colliding with negative context — a classic NLP challenge.</p>
          </div>
        </div>

        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[110px] bg-background/50 font-sans text-sm" />

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={`md:col-span-1 p-4 rounded-xl border ${verdictColor} flex flex-col items-center justify-center text-center`}>
              <div className="text-xs uppercase tracking-wider font-mono opacity-80">Verdict</div>
              <div className="text-xl font-display font-bold mt-1">{result.verdict}</div>
              <div className="mt-3 w-full h-2 rounded-full bg-secondary/50 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${result.score}%` }} transition={{ duration: 0.6 }} className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500" />
              </div>
              <div className="text-[10px] font-mono mt-1 opacity-70">{result.score}/100 sarcasm score</div>
            </div>

            <div className="md:col-span-2 p-4 rounded-xl bg-background/50 border border-border space-y-2 text-xs">
              <Detector label="Sarcasm cue phrases" hits={result.sarcasmHits} />
              <Detector label="Negative context words" hits={result.negContextHits} />
              <div className="flex flex-wrap justify-between gap-2 text-muted-foreground pt-1 border-t border-border">
                <span>Exclamations: <span className="text-foreground font-mono">{result.exclaim}</span></span>
                <span>Ellipses: <span className="text-foreground font-mono">{result.ellipsis}</span></span>
                <span>Surface label: <span className="text-foreground font-mono">{result.base.label}</span></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}

/* 3. COMPARATIVE ANALYSIS */
export function ComparativePanel() {
  const [a, setA] = useState("Our new product launch was a massive success — customers love the design and performance!");
  const [b, setB] = useState("Honestly, the rollout was a disaster. Constant crashes and angry users everywhere.");

  const data = useMemo(() => {
    const build = (t: string) => {
      const trimmed = t.trim();
      if (!trimmed) return null;
      const base = analyzeSentiment(trimmed);
      const adv = analyzeAdvanced(trimmed, base);
      return { base, adv };
    };
    return { A: build(a), B: build(b) };
  }, [a, b]);

  const winner: "A" | "B" | "tie" | null =
    data.A && data.B
      ? data.A.adv.polarity > data.B.adv.polarity ? "A"
        : data.B.adv.polarity > data.A.adv.polarity ? "B" : "tie"
      : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative bg-card border border-border rounded-2xl p-6 md:p-8 shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      <div className="relative z-10 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <Scale className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-display font-semibold text-foreground">Comparative Analysis</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">● Live</span>
            </div>
            <p className="text-xs text-muted-foreground">Compare two texts head-to-head: reviews, tweets, drafts, or competitor messaging.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CompareCard label="Text A" value={a} setValue={setA} data={data.A} winner={winner === "A"} />
          <CompareCard label="Text B" value={b} setValue={setB} data={data.B} winner={winner === "B"} />
        </div>

        {data.A && data.B && winner && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3 text-sm">
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-foreground">
              {winner === "tie"
                ? "Both texts carry equivalent polarity — a true draw."
                : <>Text <span className="font-bold text-primary">{winner}</span> conveys a more {data[winner]!.adv.polarity >= 0 ? "positive" : "negative"} tone with polarity{" "}
                    <span className="font-mono">{data[winner]!.adv.polarity > 0 ? "+" : ""}{data[winner]!.adv.polarity}</span> vs{" "}
                    <span className="font-mono">{data[winner === "A" ? "B" : "A"]!.adv.polarity > 0 ? "+" : ""}{data[winner === "A" ? "B" : "A"]!.adv.polarity}</span>.
                  </>}
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}

/* Helpers */
function CompareCard({ label, value, setValue, data, winner }: {
  label: string; value: string; setValue: (s: string) => void;
  data: { base: ReturnType<typeof analyzeSentiment>; adv: ReturnType<typeof analyzeAdvanced> } | null;
  winner: boolean;
}) {
  const TrendIcon = !data ? Minus : data.adv.polarity > 5 ? TrendingUp : data.adv.polarity < -5 ? TrendingDown : Minus;
  const trendColor = !data ? "text-muted-foreground" : data.adv.polarity > 5 ? "text-emerald-400" : data.adv.polarity < -5 ? "text-red-400" : "text-muted-foreground";

  return (
    <div className={`p-4 rounded-xl bg-background/50 border border-border space-y-3 ${winner ? "ring-2 ring-primary/50" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">{label}</span>
        {winner && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-primary/10 text-primary border border-primary/30">
            More positive
          </span>
        )}
      </div>
      <Textarea value={value} onChange={(e) => setValue(e.target.value)} className="min-h-[90px] bg-background/50 text-sm" />
      {data && (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-2">
              <TrendIcon className={`w-4 h-4 ${trendColor}`} />
              <span className="text-sm font-medium text-foreground">{data.base.label}</span>
            </div>
            <span className="text-sm font-display font-bold text-foreground">{data.adv.moodEmoji} {data.adv.mood}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Tiny label="Polarity" value={`${data.adv.polarity > 0 ? "+" : ""}${data.adv.polarity}`} />
            <Tiny label="Energy" value={`${data.adv.energy}`} />
            <Tiny label="Conf." value={`${Math.round(data.base.confidence * 100)}%`} />
          </div>
        </div>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-3 h-3 rounded ${color} border`} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="p-2 rounded-lg bg-background/50 border border-border text-center">
      <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">{label}</div>
      <div className={`text-base font-display font-bold mt-0.5 ${accent}`}>{value}</div>
    </div>
  );
}

function Tiny({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-1.5 rounded bg-background/50 border border-border">
      <div className="text-[9px] uppercase tracking-wider font-mono text-muted-foreground">{label}</div>
      <div className="text-xs font-display font-bold text-foreground">{value}</div>
    </div>
  );
}

function Detector({ label, hits }: { label: string; hits: string[] }) {
  return (
    <div>
      <div className="text-muted-foreground mb-1">{label}: <span className="font-mono text-foreground">{hits.length}</span></div>
      <div className="flex flex-wrap gap-1">
        {hits.length === 0 ? (
          <span className="text-[10px] text-muted-foreground italic">none detected</span>
        ) : hits.map((h) => (
          <span key={h} className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px] font-mono">
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}
