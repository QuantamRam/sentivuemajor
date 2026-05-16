import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import { FaXTwitter } from "react-icons/fa6";
import { Heart, Repeat2, TrendingUp, TrendingDown, Users, ArrowLeft, Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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

const InfluencerDetail = ({ handle, onBack }: { handle: string; onBack: () => void }) => {
  const { data: person, isLoading, error } = useQuery({
    queryKey: ['analyze-handle', handle],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/analyze-handle/${handle}`);
      if (!res.ok) throw new Error("Failed to fetch handle analysis");
      return res.json();
    },
    refetchInterval: false,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground font-mono animate-pulse">Analyzing @{handle}...</p>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <p className="text-red-400 font-mono">Error analyzing @{handle}. They might not exist or have no recent posts.</p>
        <button onClick={onBack} className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm">Go Back</button>
      </div>
    );
  }

  const personPie = [
    { name: "Positive", value: person.stats.positive, color: "hsl(150, 70%, 45%)" },
    { name: "Negative", value: person.stats.negative, color: "hsl(0, 70%, 55%)" },
    { name: "Neutral", value: person.stats.neutral, color: "hsl(215, 20%, 55%)" },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to search
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
        <StatCard label="Positive Score" value={`${person.stats.positive}%`} icon={TrendingUp} color="text-green-400" />
        <StatCard label="Negative Score" value={`${person.stats.negative}%`} icon={TrendingDown} color="text-red-400" />
        <StatCard label="Total Analyzed" value={person.recentPosts.length} icon={Users} color="text-primary" />
      </div>

      {/* Tweet Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-display font-semibold text-foreground">Recent Activity</h3>
        {person.recentPosts.map((tweet: any) => (
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
  const [searchInput, setSearchInput] = useState("");
  const [selectedHandle, setSelectedHandle] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSelectedHandle(searchInput.trim().replace('@', ''));
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <AnimatePresence mode="wait">
        {selectedHandle ? (
          <InfluencerDetail key="detail" handle={selectedHandle} onBack={() => setSelectedHandle(null)} />
        ) : (
          <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12 py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaXTwitter className="w-8 h-8 text-foreground" />
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground">Real-Time Account Analysis</h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Enter any public handle to instantly scrape their recent activity and run our enterprise sentiment model against their posts.
              </p>
            </div>

            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
              <div className="relative flex items-center">
                <div className="absolute left-4 text-muted-foreground">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. spez, GovSchwarzenegger, BillGates"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-32 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-[var(--shadow-card)]"
                />
                <button
                  type="submit"
                  disabled={!searchInput.trim()}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Analyze
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <StatCard label="Accounts Monitored" value="∞" icon={Users} color="text-primary" />
              <StatCard label="Real-Time Latency" value="< 2s" icon={TrendingUp} color="text-green-400" />
              <StatCard label="Model Accuracy" value="94.2%" icon={Heart} color="text-red-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default XAnalysisPage;
