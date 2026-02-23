import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dataset } from "@/lib/dataset";
import { Search, Filter, Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";

type FilterType = "All" | "Positive" | "Negative" | "Neutral";

const ADMIN_PASSWORD = "sentivue2025";

const DatasetPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("All");
  const [sourceFilter, setSourceFilter] = useState("All");

  const sources = useMemo(() => ["All", ...new Set(dataset.map((d) => d.source))], []);

  const filtered = useMemo(() => {
    return dataset.filter((d) => {
      if (filter !== "All" && d.result.label !== filter) return false;
      if (sourceFilter !== "All" && d.source !== sourceFilter) return false;
      if (search && !d.text.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, filter, sourceFilter]);

  const filterButtons: FilterType[] = ["All", "Positive", "Negative", "Neutral"];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password. Access denied.");
      setPassword("");
    }
  };

  // ===== PASSWORD GATE =====
  if (!isAuthenticated) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-card)] relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
              </div>

              <h2 className="text-2xl font-display font-bold text-foreground text-center mb-2">
                Protected Dataset
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-8">
                This dataset contains {dataset.length} analyzed entries and is restricted to authorized personnel only.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Enter admin password"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3.5 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-xs text-center font-mono"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={!password.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[var(--shadow-glow)]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Authenticate
                </button>
              </form>

              <p className="text-xs text-muted-foreground/50 text-center mt-6 font-mono">
                Contact project admins for access credentials
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ===== AUTHENTICATED VIEW =====
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dataset Explorer</h1>
          <p className="text-muted-foreground mt-1">{dataset.length} social media entries analyzed · Filter and search the dataset</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span className="text-xs font-mono text-green-400">Authenticated</span>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-4 shadow-[var(--shadow-card)] space-y-4"
      >
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {filterButtons.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? f === "Positive" ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : f === "Negative" ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-primary/10 text-primary border border-primary/20"
                  : "bg-secondary/50 text-muted-foreground border border-transparent hover:border-border"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="text-muted-foreground text-xs mx-2">|</span>
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => setSourceFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sourceFilter === s
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-secondary/50 text-muted-foreground border border-transparent hover:border-border"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground font-mono">{filtered.length} results</p>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card)]"
      >
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-border bg-secondary/50 backdrop-blur-sm">
                <th className="text-left p-4 text-xs font-mono text-muted-foreground w-8">#</th>
                <th className="text-left p-4 text-xs font-mono text-muted-foreground">Text</th>
                <th className="text-left p-4 text-xs font-mono text-muted-foreground w-24">Source</th>
                <th className="text-left p-4 text-xs font-mono text-muted-foreground w-28">Date</th>
                <th className="text-left p-4 text-xs font-mono text-muted-foreground w-24">Sentiment</th>
                <th className="text-left p-4 text-xs font-mono text-muted-foreground w-20">Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="p-4 text-xs font-mono text-muted-foreground">{entry.id}</td>
                  <td className="p-4 text-sm text-foreground max-w-md">{entry.text}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-md text-xs font-mono bg-secondary/50 text-muted-foreground">
                      {entry.source}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono text-muted-foreground">{entry.timestamp}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium ${
                      entry.result.label === "Positive" ? "bg-green-500/10 text-green-400" :
                      entry.result.label === "Negative" ? "bg-red-500/10 text-red-400" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {entry.result.label}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono text-foreground">{(entry.result.score * 100).toFixed(0)}%</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">No entries match your filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DatasetPage;
