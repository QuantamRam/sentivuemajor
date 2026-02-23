import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { TrendingUp, TrendingDown, MessageSquare, Gauge } from "lucide-react";
import { getStats, dataset } from "@/lib/dataset";
import { SourceBadge, sourceMap } from "@/components/SourceIcons";

const stats = getStats();

const pieData = [
  { name: "Positive", value: stats.positive, color: "hsl(150, 70%, 45%)" },
  { name: "Negative", value: stats.negative, color: "hsl(0, 70%, 55%)" },
  { name: "Neutral", value: stats.neutral, color: "hsl(215, 20%, 55%)" },
];

// Build trend data by date
const trendMap = new Map<string, { positive: number; negative: number; neutral: number }>();
dataset.forEach((d) => {
  const date = d.timestamp;
  if (!trendMap.has(date)) trendMap.set(date, { positive: 0, negative: 0, neutral: 0 });
  const entry = trendMap.get(date)!;
  if (d.result.label === "Positive") entry.positive++;
  else if (d.result.label === "Negative") entry.negative++;
  else entry.neutral++;
});
const trendData = Array.from(trendMap.entries())
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([date, counts]) => ({ date: date.slice(5), ...counts }));

const statCards = [
  { label: "Total Analyzed", value: stats.total, icon: MessageSquare, color: "text-primary" },
  { label: "Positive", value: `${Math.round((stats.positive / stats.total) * 100)}%`, icon: TrendingUp, color: "text-green-400" },
  { label: "Negative", value: `${Math.round((stats.negative / stats.total) * 100)}%`, icon: TrendingDown, color: "text-red-400" },
  { label: "Avg Confidence", value: `${Math.round(stats.avgConfidence * 100)}%`, icon: Gauge, color: "text-primary" },
];

const DashboardPage = () => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Sentiment analysis overview from {stats.total} social media entries</p>
        {/* Source platform badges */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {Object.keys(sourceMap).map((src) => {
            const info = sourceMap[src];
            const Icon = info.icon;
            return (
              <div key={src} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${info.bgColor} border border-border/50`}>
                <Icon className={`w-3.5 h-3.5 ${info.color}`} />
                <span className={`text-xs font-mono ${info.color}`}>{src}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)]"
        >
          <h3 className="text-lg font-display font-semibold text-foreground mb-6">Sentiment Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: 8 }}
                labelStyle={{ color: "hsl(210, 40%, 92%)" }}
              />
              <Area type="monotone" dataKey="positive" stackId="1" stroke="hsl(150, 70%, 45%)" fill="hsl(150, 70%, 45%)" fillOpacity={0.3} />
              <Area type="monotone" dataKey="neutral" stackId="1" stroke="hsl(215, 20%, 55%)" fill="hsl(215, 20%, 55%)" fillOpacity={0.2} />
              <Area type="monotone" dataKey="negative" stackId="1" stroke="hsl(0, 70%, 55%)" fill="hsl(0, 70%, 55%)" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)]"
        >
          <h3 className="text-lg font-display font-semibold text-foreground mb-6">Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {pieData.map((s) => (
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
      </div>

      {/* Source Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)]"
      >
        <h3 className="text-lg font-display font-semibold text-foreground mb-6">Sentiment by Source</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stats.bySource}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
            <XAxis dataKey="source" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} />
            <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: 8 }} />
            <Bar dataKey="positive" fill="hsl(150, 70%, 45%)" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="neutral" fill="hsl(215, 20%, 55%)" radius={[0, 0, 0, 0]} stackId="a" />
            <Bar dataKey="negative" fill="hsl(0, 70%, 55%)" radius={[4, 4, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent entries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card)]"
      >
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-display font-semibold text-foreground">Recent Analyses</h3>
        </div>
        <div className="divide-y divide-border">
          {dataset.slice(-5).reverse().map((entry) => (
            <div key={entry.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{entry.text}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <SourceBadge source={entry.source} />
                  <span className="text-xs text-muted-foreground font-mono">{entry.timestamp}</span>
                </div>
              </div>
              <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-mono font-medium ${
                entry.result.label === "Positive" ? "bg-green-500/10 text-green-400" :
                entry.result.label === "Negative" ? "bg-red-500/10 text-red-400" :
                "bg-muted text-muted-foreground"
              }`}>
                {entry.result.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
