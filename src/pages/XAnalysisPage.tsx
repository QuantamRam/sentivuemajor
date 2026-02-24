import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { FaXTwitter } from "react-icons/fa6";
import { Heart, Repeat2, TrendingUp, TrendingDown, Users, ChevronRight, ArrowLeft } from "lucide-react";
import { influencers, getInfluencerOverview, Influencer } from "@/lib/influencers";

const overview = getInfluencerOverview();

const overallPie = [
  { name: "Positive", value: overview.positive, color: "hsl(150, 70%, 45%)" },
  { name: "Negative", value: overview.negative, color: "hsl(0, 70%, 55%)" },
  { name: "Neutral", value: overview.neutral, color: "hsl(215, 20%, 55%)" },
];

const categoryData = (() => {
  const cats = new Map<string, { positive: number; negative: number; neutral: number }>();
  influencers.forEach((inf) => {
    if (!cats.has(inf.category)) cats.set(inf.category, { positive: 0, negative: 0, neutral: 0 });
    const c = cats.get(inf.category)!;
    c.positive += inf.stats.positive;
    c.negative += inf.stats.negative;
    c.neutral += inf.stats.neutral;
  });
  return Array.from(cats.entries()).map(([cat, v]) => ({ category: cat, ...v }));
})();

const radarData = influencers.map((inf) => ({
  name: inf.name.split(" ")[0],
  positivity: Math.round((inf.stats.positive / inf.stats.total) * 100),
  negativity: Math.round((inf.stats.negative / inf.stats.total) * 100),
}));

const SentimentBadge = ({ label }: { label: string }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium ${
    label === "Positive" ? "bg-green-500/10 text-green-400" :
    label === "Negative" ? "bg-red-500/10 text-red-400" :
    "bg-muted text-muted-foreground"
  }`}>{label}</span>
);

const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ElementType; color: string }) => (
  <div className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-card)]">
    <div className="flex items-center justify-between mb-3">
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <p className={`text-2xl font-mono font-bold ${color}`}>{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{label}</p>
  </div>
);

// ===== INFLUENCER DETAIL VIEW =====
const InfluencerDetail = ({ person, onBack }: { person: Influencer; onBack: () => void }) => {
  const personPie = [
    { name: "Positive", value: person.stats.positive, color: "hsl(150, 70%, 45%)" },
    { name: "Negative", value: person.stats.negative, color: "hsl(0, 70%, 55%)" },
    { name: "Neutral", value: person.stats.neutral, color: "hsl(215, 20%, 55%)" },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to all influencers
      </button>

      {/* Profile Header */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-5">
          <img src={person.avatar} alt={person.name} className="w-20 h-20 rounded-2xl border-2 border-primary/20 object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-display font-bold text-foreground">{person.name}</h2>
              <FaXTwitter className="w-5 h-5 text-foreground" />
            </div>
            <p className="text-primary font-mono text-sm">{person.handle}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-muted-foreground font-mono">{person.followers} followers</span>
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">{person.category}</span>
            </div>
          </div>
          <div className="hidden md:block">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={personPie} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4} dataKey="value">
                  {personPie.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Person Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Positive Tweets" value={person.stats.positive} icon={TrendingUp} color="text-green-400" />
        <StatCard label="Negative Tweets" value={person.stats.negative} icon={TrendingDown} color="text-red-400" />
        <StatCard label="Total Analyzed" value={person.stats.total} icon={Users} color="text-primary" />
      </div>

      {/* Tweet Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-display font-semibold text-foreground">All Tweets</h3>
        {person.tweets.map((tweet) => (
          <motion.div
            key={tweet.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-card)] hover:border-primary/20 transition-colors"
          >
            <div className="flex items-start gap-4">
              <img src={person.avatar} alt="" className="w-10 h-10 rounded-full border border-border mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">{person.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">{person.handle}</span>
                  <span className="text-xs text-muted-foreground font-mono">· {tweet.date}</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-3">{tweet.text}</p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Heart className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono">{(tweet.likes / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Repeat2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono">{(tweet.retweets / 1000).toFixed(1)}K</span>
                  </div>
                  <SentimentBadge label={tweet.result.label} />
                  <span className="text-xs font-mono text-muted-foreground">
                    Score: {(tweet.result.score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ===== MAIN PAGE =====
const XAnalysisPage = () => {
  const [selected, setSelected] = useState<Influencer | null>(null);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <AnimatePresence mode="wait">
        {selected ? (
          <InfluencerDetail key="detail" person={selected} onBack={() => setSelected(null)} />
        ) : (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-1">
                <FaXTwitter className="w-7 h-7 text-foreground" />
                <h1 className="text-3xl font-display font-bold text-foreground">X (Twitter) Analysis</h1>
              </div>
              <p className="text-muted-foreground">Sentiment analysis of {overview.total} tweets from {overview.count} influential public figures</p>
            </motion.div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Tweets", value: overview.total, icon: FaXTwitter, color: "text-foreground" },
                { label: "Positive", value: `${Math.round((overview.positive / overview.total) * 100)}%`, icon: TrendingUp, color: "text-green-400" },
                { label: "Negative", value: `${Math.round((overview.negative / overview.total) * 100)}%`, icon: TrendingDown, color: "text-red-400" },
                { label: "Influencers", value: overview.count, icon: Users, color: "text-primary" },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Distribution Pie */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
                <h3 className="text-lg font-display font-semibold text-foreground mb-4">Overall Sentiment</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={overallPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {overallPie.map((e) => <Cell key={e.name} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 mt-2">
                  {overallPie.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-muted-foreground">{s.name}</span>
                      </div>
                      <span className="font-mono text-foreground">{s.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Category Breakdown */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
                <h3 className="text-lg font-display font-semibold text-foreground mb-4">Sentiment by Category</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                    <XAxis dataKey="category" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: 8 }} />
                    <Bar dataKey="positive" fill="hsl(150, 70%, 45%)" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="neutral" fill="hsl(215, 20%, 55%)" stackId="a" />
                    <Bar dataKey="negative" fill="hsl(0, 70%, 55%)" radius={[4, 4, 0, 0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Radar Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
              <h3 className="text-lg font-display font-semibold text-foreground mb-4">Positivity vs Negativity Radar</h3>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="hsl(222, 30%, 16%)" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} />
                  <Radar name="Positivity" dataKey="positivity" stroke="hsl(150, 70%, 45%)" fill="hsl(150, 70%, 45%)" fillOpacity={0.3} />
                  <Radar name="Negativity" dataKey="negativity" stroke="hsl(0, 70%, 55%)" fill="hsl(0, 70%, 55%)" fillOpacity={0.3} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: 8 }} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Influencer Cards */}
            <div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-4">Influencer Profiles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {influencers.map((person, i) => (
                  <motion.button
                    key={person.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => setSelected(person)}
                    className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-card)] hover:border-primary/30 hover:shadow-[var(--shadow-glow)] transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <img src={person.avatar} alt={person.name} className="w-14 h-14 rounded-xl border border-border object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground truncate">{person.name}</h4>
                          <FaXTwitter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        </div>
                        <p className="text-xs text-primary font-mono">{person.handle}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{person.followers} followers · {person.category}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                    {/* Mini sentiment bar */}
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden flex">
                        <div className="h-full bg-green-500" style={{ width: `${(person.stats.positive / person.stats.total) * 100}%` }} />
                        <div className="h-full bg-muted-foreground/40" style={{ width: `${(person.stats.neutral / person.stats.total) * 100}%` }} />
                        <div className="h-full bg-red-500" style={{ width: `${(person.stats.negative / person.stats.total) * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">{person.stats.total} tweets</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default XAnalysisPage;
