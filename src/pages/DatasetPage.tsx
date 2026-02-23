import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { dataset } from "@/lib/dataset";
import { Search, Filter } from "lucide-react";

type FilterType = "All" | "Positive" | "Negative" | "Neutral";

const DatasetPage = () => {
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

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-foreground">Dataset Explorer</h1>
        <p className="text-muted-foreground mt-1">{dataset.length} social media entries analyzed · Filter and search the dataset</p>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
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
                  <td className="p-4 text-sm text-foreground">{entry.text}</td>
                  <td className="p-4 text-xs font-mono text-muted-foreground">{entry.source}</td>
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
