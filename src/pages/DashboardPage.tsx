import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { TrendingUp, TrendingDown, MessageSquare, Gauge, Activity } from "lucide-react";
import { SourceBadge, sourceMap } from "@/components/SourceIcons";
import { useQuery } from "@tanstack/react-query";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900/90 backdrop-blur-xl p-3 rounded-xl border border-white/10 shadow-2xl">
        {label && <p className="text-zinc-100 font-mono text-xs mb-3 uppercase tracking-wider">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-6 text-sm mb-1.5 last:mb-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              <span className="text-zinc-400 capitalize">{entry.name}</span>
            </div>
            <span className="text-zinc-100 font-mono">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- Perpetual Micro-Animation Components ---

const LiveStatusBadge = () => (
  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="w-1.5 h-1.5 rounded-full bg-emerald-400"
    />
    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Live</span>
  </div>
);

const ShimmerText = ({ text, className }: { text: string; className?: string }) => (
  <div className={`relative overflow-hidden inline-block ${className}`}>
    <span className="opacity-0">{text}</span>
    <motion.div
      animate={{ x: ["-100%", "200%"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
    />
    <span className="absolute inset-0">{text}</span>
  </div>
);

// --- Dashboard Component ---

const DashboardPage = () => {
  const { data: statsData } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/dashboard/stats');
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    refetchInterval: 5000,
  });

  const { data: liveStream } = useQuery({
    queryKey: ['live-stream'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/stream/live');
      if (!res.ok) throw new Error("Failed to fetch live stream");
      return res.json();
    },
    refetchInterval: 5000,
  });

  const stats = statsData || { total: 0, positive: 0, negative: 0, neutral: 0, avgConfidence: 0, bySource: [], trend: [] };
  const dataset: any[] = liveStream || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-medium text-white tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 mt-1 font-light">Sentiment analysis overview from <span className="text-zinc-300">{stats.total}</span> entries.</p>
        </div>
        <LiveStatusBadge />
      </motion.div>

      {/* Motion-Engine Bento Grid */}
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 md:gap-6"
      >
        
        {/* Metric 1: Total Analyzed */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 glass-panel rounded-3xl p-6 flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between mb-8">
            <div className="w-10 h-10 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-white/5">
              <MessageSquare className="w-5 h-5 text-zinc-300" />
            </div>
          </div>
          <div>
              <ShimmerText text={stats.total.toString()} className="text-4xl font-display font-medium text-white tracking-tighter" />
              <p className="text-xs text-zinc-500 mt-2 font-mono uppercase tracking-wider">Total Streams</p>
          </div>
        </motion.div>

        {/* Metric 2: Positive Bias */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 glass-panel rounded-3xl p-6 flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
             <TrendingUp className="w-24 h-24 text-emerald-400" />
          </div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="relative z-10">
              <p className="text-4xl font-display font-medium text-emerald-400 tracking-tighter">{stats.total > 0 ? Math.round((stats.positive / stats.total) * 100) : 0}%</p>
              <p className="text-xs text-zinc-500 mt-2 font-mono uppercase tracking-wider">Positive Bias</p>
          </div>
        </motion.div>

        {/* Metric 3: Negative Bias */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 glass-panel rounded-3xl p-6 flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
             <TrendingDown className="w-24 h-24 text-rose-400" />
          </div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <TrendingDown className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div className="relative z-10">
              <p className="text-4xl font-display font-medium text-rose-400 tracking-tighter">{stats.total > 0 ? Math.round((stats.negative / stats.total) * 100) : 0}%</p>
              <p className="text-xs text-zinc-500 mt-2 font-mono uppercase tracking-wider">Negative Bias</p>
          </div>
        </motion.div>

        {/* Metric 4: Confidence */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 glass-panel rounded-3xl p-6 flex flex-col justify-between group overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="w-10 h-10 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-white/5">
              <Gauge className="w-5 h-5 text-zinc-300" />
            </div>
          </div>
          <div>
              <p className="text-4xl font-display font-medium text-white tracking-tighter">{Math.round(stats.avgConfidence * 100)}%</p>
              <p className="text-xs text-zinc-500 mt-2 font-mono uppercase tracking-wider">Avg Confidence</p>
          </div>
        </motion.div>

        {/* Trend Area Chart */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-4 lg:col-span-8 glass-panel rounded-3xl p-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
             <div>
                <h3 className="text-lg font-display font-medium text-white">Sentiment Velocity</h3>
                <p className="text-xs text-zinc-500 mt-1">Temporal analysis</p>
             </div>
             <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"/> Positive</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"/> Negative</div>
             </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.trend} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} dy={10} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} fill="url(#colorPos)" activeDot={{ r: 4, strokeWidth: 0, fill: "#10b981" }} />
                <Area type="monotone" dataKey="negative" stroke="#f43f5e" strokeWidth={2} fill="url(#colorNeg)" activeDot={{ r: 4, strokeWidth: 0, fill: "#f43f5e" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Source Breakdown Bar Chart */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-4 lg:col-span-4 glass-panel rounded-3xl p-6">
          <div className="mb-8">
            <h3 className="text-lg font-display font-medium text-white">Source Distribution</h3>
            <p className="text-xs text-zinc-500 mt-1">Breakdown by platform</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.bySource} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="source" tick={{ fill: "#71717a", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: "#71717a", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="positive" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" maxBarSize={40} />
                <Bar dataKey="neutral" fill="#71717a" radius={[0, 0, 0, 0]} stackId="a" maxBarSize={40} />
                <Bar dataKey="negative" fill="#f43f5e" radius={[4, 4, 0, 0]} stackId="a" maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Entries - Intelligent List */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-4 lg:col-span-12 glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
            <div>
              <h3 className="text-lg font-display font-medium text-white">Live Stream</h3>
              <p className="text-xs text-zinc-500 mt-1">Real-time inference queue</p>
            </div>
            <Activity className="w-5 h-5 text-zinc-500 opacity-50" />
          </div>
          
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {dataset.slice(0, 10).map((entry, idx) => (
                <motion.div 
                  key={entry.id} 
                  layoutId={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20, delay: idx * 0.05 }}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm text-zinc-300 truncate font-light">{entry.text}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <SourceBadge source={entry.source} />
                      <span className="text-[10px] text-zinc-600 font-mono tracking-wider">{entry.timestamp}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest ${
                      entry.result.label === "Positive" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      entry.result.label === "Negative" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                      "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    }`}>
                      {entry.result.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default DashboardPage;
