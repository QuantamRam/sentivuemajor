import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeSentiment, analyzeSentimentWithAI, type SentimentResult } from "@/lib/sentiment";
import { Send, RotateCcw, ThumbsUp, ThumbsDown, Minus, Loader2, Sparkles, UploadCloud, Download, PieChart as PieChartIcon, Tag, Activity, BrainCircuit, Zap, MessageSquare } from "lucide-react";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b', '#06b6d4'];

const exampleTexts = [
  "I absolutely love this product! Best purchase I've ever made.",
  "Terrible experience. The service was awful and I want a refund.",
  "The screen quality on this phone is terrible."
];

const getStateOfMind = (emotion?: string, label?: string) => {
    if (!emotion) {
         if (label === 'Positive') return { mind: 'Satisfied / Content', description: 'The user is exhibiting a positive attitude towards the subject.', tone: 'Appreciative' };
         if (label === 'Negative') return { mind: 'Dissatisfied / Frustrated', description: 'The user is exhibiting a negative attitude or displeasure.', tone: 'Critical' };
         return { mind: 'Objective / Neutral', description: 'The user is stating facts or lacking strong emotion.', tone: 'Factual' };
    }
    const lower = emotion.toLowerCase();
    if (lower === 'joy') return { mind: 'Euphoric / Highly Satisfied', description: 'Experiencing high levels of pleasure and happiness.', tone: 'Enthusiastic' };
    if (lower === 'sadness') return { mind: 'Disappointed / Regretful', description: 'Feeling let down or sorrowful about the experience.', tone: 'Sorrowful' };
    if (lower === 'anger') return { mind: 'Frustrated / Aggravated', description: 'Showing signs of hostility or intense frustration.', tone: 'Hostile' };
    if (lower === 'fear') return { mind: 'Anxious / Concerned', description: 'Expressing worry, anxiety, or unease.', tone: 'Alarmed' };
    if (lower === 'surprise') return { mind: 'Startled / Astonished', description: 'Reacting to something unexpected or shocking.', tone: 'Astounded' };
    if (lower === 'love') return { mind: 'Deeply Connected / Enchanted', description: 'Showing extreme fondness or affection.', tone: 'Warm & Affectionate' };
    return { mind: 'Complex / Mixed', description: 'Experiencing a nuanced emotional state.', tone: 'Ambiguous' };
};

const getBatchStateOfMind = (batches: {result: SentimentResult}[]) => {
    let pos = 0, neg = 0;
    batches.forEach(b => {
        if(b.result.label === 'Positive') pos++;
        else if (b.result.label === 'Negative') neg++;
    });
    if (pos > neg * 1.5) return { mind: 'Highly Optimistic', description: 'The collective vibe is overwhelmingly positive.', tone: 'Supportive' };
    if (neg > pos * 1.5) return { mind: 'Highly Critical', description: 'The collective vibe is expressing strong dissatisfaction.', tone: 'Disgruntled' };
    if (pos > neg) return { mind: 'Moderately Positive', description: 'The group is generally satisfied with minor reservations.', tone: 'Constructive' };
    if (neg > pos) return { mind: 'Moderately Negative', description: 'The group is generally dissatisfied with few bright spots.', tone: 'Cynical' };
    return { mind: 'Divided / Neutral', description: 'The group shows highly mixed or largely neutral opinions.', tone: 'Indifferent' };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900/90 backdrop-blur-xl p-3 rounded-xl border border-white/10 shadow-2xl">
        {label && <p className="text-zinc-100 font-mono text-xs mb-3 uppercase tracking-wider">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-6 text-sm mb-1.5 last:mb-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill || entry.stroke }} />
              <span className="text-zinc-400 capitalize">{entry.name || 'Value'}</span>
            </div>
            <span className="text-zinc-100 font-mono">{typeof entry.value === 'number' && entry.name === 'Emotion Score' ? entry.value.toFixed(1) + '%' : typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyzePage = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [batchResults, setBatchResults] = useState<{text: string, result: SentimentResult}[]>([]);
  const [isBatchLoading, setIsBatchLoading] = useState(false);
  const [sentenceData, setSentenceData] = useState<{name: string, score: number}[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);

  const computeJourney = (inputText: string) => {
      const sentences = inputText.match(/[^.!?]+[.!?]+/g) || [inputText];
      const journey = sentences.filter(s => s.trim().length > 0).map((s, idx) => {
          const sr = analyzeSentiment(s); 
          return { name: `S${idx + 1}`, score: sr.score * 100 };
      });
      setSentenceData(journey);
  }

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    const r = await analyzeSentimentWithAI(text);
    setResult(r);
    computeJourney(text);
    setBatchResults([]); // Clear batch if single analysis
    setIsLoading(false);
  };

  const handleExample = async (t: string) => {
    setText(t);
    setIsLoading(true);
    const r = await analyzeSentimentWithAI(t);
    setResult(r);
    computeJourney(t);
    setBatchResults([]);
    setIsLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsBatchLoading(true);
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: async (results) => {
        const texts = results.data.map((row: any) => row[0]).filter((t: any) => t && typeof t === 'string');
        const analyzed = [];
        for(const t of texts) {
            const r = await analyzeSentimentWithAI(t);
            analyzed.push({text: t, result: r});
        }
        setBatchResults(analyzed);
        setResult(null); 
        setIsBatchLoading(false);
      }
    });
  }

  const exportReport = async () => {
    if (!reportRef.current) return;
    try {
        const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: "#09090b" });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Sentiment_Analysis_Report.pdf');
    } catch(err) {
        console.error("PDF generation failed", err);
    }
  }

  const getDashboardData = () => {
     if (result?.allEmotions) {
         return result.allEmotions.map((e) => ({ name: e.label, value: e.score * 100 }));
     }
     if (result) {
         return [
             { name: 'Positive Words', value: result.positiveCount },
             { name: 'Negative Words', value: result.negativeCount },
             { name: 'Neutral Words', value: Math.max(0, result.wordCount - result.positiveCount - result.negativeCount) }
         ].filter(i => i.value > 0);
     }
     if (batchResults.length > 0) {
         let pos = 0, neg = 0, neu = 0;
         batchResults.forEach(b => {
             if (b.result.label === 'Positive') pos++;
             else if (b.result.label === 'Negative') neg++;
             else neu++;
         });
         return [
             { name: 'Positive', value: pos },
             { name: 'Negative', value: neg },
             { name: 'Neutral', value: neu }
         ].filter(i => i.value > 0);
     }
     return [];
  };

  const getEmotionData = () => {
      if (result?.allEmotions) {
          return result.allEmotions.map((e) => ({ ...e, subject: e.label, A: e.score * 100, fullMark: 100 }));
      }
      return [];
  };

  const getBarData = () => {
      if (batchResults.length > 0) {
          let pos = 0, neg = 0, neu = 0;
          batchResults.forEach(b => {
              if (b.result.label === 'Positive') pos++;
              else if (b.result.label === 'Negative') neg++;
              else neu++;
          });
          return [
              { name: 'Positive', count: pos },
              { name: 'Neutral', count: neu },
              { name: 'Negative', count: neg }
          ].filter(i => i.count > 0);
      }
      return [];
  };

  const dashboardData = getDashboardData();
  const sentimentIcon = result?.label === "Positive" ? ThumbsUp : result?.label === "Negative" ? ThumbsDown : Minus;
  
  const currentStateOfMind = result ? getStateOfMind(result.emotion, result.label) : (batchResults.length > 0 ? getBatchStateOfMind(batchResults) : null);

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
           <h1 className="text-3xl font-display font-medium text-white tracking-tight">Enterprise Analytics</h1>
           <p className="text-zinc-500 mt-1 font-light">Single query or bulk CSV processing powered by localized ML.</p>
        </div>
        {(result || batchResults.length > 0) && (
           <button onClick={exportReport} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 outline outline-1 outline-white/10 font-medium transition-colors cursor-pointer active:scale-95 z-10">
              <Download className="w-4 h-4" /> Export Report
           </button>
        )}
      </motion.div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-2 glass-panel rounded-3xl p-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAnalyze(); } }}
              placeholder="Type or paste text to analyze sentiment..."
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-emerald-500/50 transition-colors font-body text-sm min-h-[140px]"
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
               <button onClick={() => { setText(""); setResult(null); setBatchResults([]); setSentenceData([]); }} className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800">
                   <RotateCcw className="w-4 h-4" /> Clear
               </button>
               <button 
                  onClick={handleAnalyze} 
                  disabled={!text.trim() || isLoading} 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500 text-zinc-950 rounded-lg text-sm font-medium hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-97"
                >
                   {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                   {isLoading ? "Analyzing Sequence..." : "Analyze Stream"}
               </button>
            </div>
            
             <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-2">
               <span className="text-xs font-mono uppercase tracking-widest text-zinc-600 pt-1 mr-1">Examples:</span>
              {exampleTexts.map((t) => (
                <button
                  key={t}
                  onClick={() => handleExample(t)}
                  className="text-xs px-3 py-1.5 bg-zinc-800/50 border border-white/5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-left max-w-[200px] sm:max-w-xs truncate"
                >
                  {t}
                </button>
              ))}
            </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center border-dashed border-2 border-zinc-800 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors relative group">
            <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            {isBatchLoading ? (
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    <p className="text-sm font-medium text-zinc-300">Processing Batch Queue...</p>
                </div>
            ) : (
                <>
                    <UploadCloud className="w-10 h-10 text-zinc-600 group-hover:text-emerald-500 transition-colors mb-4" />
                    <h3 className="font-display font-medium text-white">Bulk CSV Upload</h3>
                    <p className="text-xs text-zinc-500 mt-2 px-4 font-light leading-relaxed">Drop a CSV file to sequence and analyze all rows iteratively.</p>
                </>
            )}
        </div>
      </motion.div>

      {/* Report Dashboard */}
      <AnimatePresence mode="wait">
        {(result || batchResults.length > 0) && (
          <motion.div
            key={result ? "single" : "batch"}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div ref={reportRef} className="glass-panel rounded-3xl p-8 mt-4">
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                    <PieChartIcon className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-2xl font-display font-medium text-white">Analysis Dashboard</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Result Column */}
                    <div className="lg:col-span-8 flex flex-col justify-center">
                    {result ? (
                            <div className="glass-panel rounded-2xl p-8 mb-6 border border-white/5">
                                <div className="flex items-center gap-6 mb-6">
                                    {(() => { 
                                        const Icon = sentimentIcon; 
                                        const iconColor = result.label === "Positive" ? "text-emerald-400" : result.label === "Negative" ? "text-rose-400" : "text-zinc-400";
                                        const iconBg = result.label === "Positive" ? "bg-emerald-500/10 border-emerald-500/20" : result.label === "Negative" ? "bg-rose-500/10 border-rose-500/20" : "bg-zinc-800/50 border-white/5";
                                        return (
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${iconBg}`}>
                                                <Icon className={`w-8 h-8 ${iconColor}`} />
                                            </div>
                                        ); 
                                    })()}
                                    <div>
                                        <h3 className={`text-4xl font-display font-medium tracking-tight ${result.label === "Positive" ? "text-emerald-400" : result.label === "Negative" ? "text-rose-400" : "text-white"}`}>{result.label}</h3>
                                        <p className="text-sm text-zinc-500 font-mono uppercase tracking-widest mt-1">Classification Result</p>
                                    </div>
                                </div>
                                
                                {result.keywords && result.keywords.length > 0 && (
                                    <div className="mt-6 flex flex-wrap items-center gap-2">
                                        <div className="w-full flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">
                                            <Tag className="w-3.5 h-3.5"/> Key Entities Detected:
                                        </div>
                                        {result.keywords.map(kw => (
                                            <span key={kw} className="px-3 py-1.5 bg-zinc-900 border border-white/5 rounded-lg text-xs font-medium capitalize text-zinc-300">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                    ) : (
                            <div className="glass-panel p-8 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-display font-medium mb-6 flex items-center gap-2 text-white">
                                    <Sparkles className="w-5 h-5 text-emerald-500"/> Batch Execution Summary
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                                        <span className="font-mono text-sm text-zinc-400 uppercase tracking-wider">Total Rows Evaluated</span>
                                        <span className="font-display font-medium text-white text-lg">{batchResults.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-emerald-500/5 text-emerald-400 rounded-xl border border-emerald-500/10">
                                        <span className="font-mono text-sm uppercase tracking-wider">Positive Sequences</span>
                                        <span className="font-display font-medium text-lg">{batchResults.filter(r => r.result.label === 'Positive').length}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-rose-500/5 text-rose-400 rounded-xl border border-rose-500/10">
                                        <span className="font-mono text-sm uppercase tracking-wider">Negative Sequences</span>
                                        <span className="font-display font-medium text-lg">{batchResults.filter(r => r.result.label === 'Negative').length}</span>
                                    </div>
                                </div>
                            </div>
                    )}

                        {result?.isAi && result?.emotion && (
                            <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <BrainCircuit className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <span className="font-mono text-xs text-blue-400/80 uppercase tracking-widest">Neural Detection</span>
                                        <p className="font-medium text-white">Primary Emotion Synthesized</p>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="text-2xl font-display font-medium text-blue-400 capitalize">{result.emotion}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chart Column */}
                    <div className="lg:col-span-4 h-full min-h-[300px] glass-panel rounded-2xl p-6 flex flex-col justify-center relative border border-white/5">
                    {result?.allEmotions ? (
                        <>
                            <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">Emotional Fingerprint</h3>
                            <ResponsiveContainer width="100%" height={260}>
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getEmotionData()}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#a1a1aa", fontSize: 11, fontFamily: "var(--font-mono)" }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Intensity" dataKey="A" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.2} />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </>
                    ) : batchResults.length > 0 ? (
                        <>
                            <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">Sentiment Volume</h3>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={getBarData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" tick={{fill: "#a1a1aa", fontSize: 11, fontFamily: "var(--font-mono)"}} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis tick={{fill: "#a1a1aa", fontSize: 11, fontFamily: "var(--font-mono)"}} axisLine={false} tickLine={false} allowDecimals={false} dx={-10} />
                                    <RechartsTooltip content={<CustomTooltip />} cursor={{fill: "rgba(255,255,255,0.02)"}} />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                        {getBarData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.name === 'Positive' ? '#10b981' : entry.name === 'Negative' ? '#f43f5e' : '#71717a'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </>
                    ) : dashboardData.length > 0 ? (
                        <>
                            <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">Lexical Distribution</h3>
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie data={dashboardData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                                        {dashboardData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontFamily: "var(--font-mono)", color: '#a1a1aa', marginTop: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-zinc-600 font-mono text-xs">No metrics active</div>
                    )}
                    </div>
                </div>

                {/* Cognitive State Analysis */}
                {currentStateOfMind && (
                    <div className="mt-12 pt-8 border-t border-white/5">
                        <h3 className="text-xl font-display font-medium flex items-center gap-3 mb-8 text-white">
                            <BrainCircuit className="w-5 h-5 text-blue-500" />
                            Cognitive & Behavioral Vectors
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            
                            {/* State of Mind Widget */}
                            <div className="glass-panel border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-2 mb-4 relative z-10">
                                    <Activity className="w-4 h-4 text-blue-400" />
                                    <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Cognitive State</h4>
                                </div>
                                <p className="text-lg font-display font-medium text-white mb-2 relative z-10">
                                    {currentStateOfMind.mind}
                                </p>
                                <p className="text-xs text-zinc-400 font-light leading-relaxed relative z-10">
                                    {currentStateOfMind.description}
                                </p>
                            </div>

                            {/* Tone Insight Widget */}
                            <div className="glass-panel border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-2 mb-4 relative z-10">
                                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                                    <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Acoustic Tone</h4>
                                </div>
                                <p className="text-lg font-display font-medium text-white mb-2 relative z-10">
                                    {currentStateOfMind.tone}
                                </p>
                                <p className="text-xs text-zinc-400 font-light leading-relaxed relative z-10">
                                    Determined from linguistic patterns and overall emotional signature.
                                </p>
                            </div>

                            {/* Intensity / Confidence Widget */}
                            <div className="glass-panel border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Zap className="w-4 h-4 text-amber-400" />
                                        <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                                            {result ? "System Confidence" : "Consensus Strength"}
                                        </h4>
                                    </div>
                                    <div className="flex items-end gap-2 mb-4">
                                        <span className="text-4xl font-display font-medium text-white tracking-tighter">
                                            {result ? Math.round((result.confidence || result.score || 0) * 100) : Math.round((Math.max((dashboardData.find((d: any) => d.name === 'Positive') as any)?.value || 0, (dashboardData.find((d: any) => d.name === 'Negative') as any)?.value || 0) / batchResults.length) * 100)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
                                    <div className="bg-amber-400 h-full rounded-full" 
                                         style={{ width: `${result ? Math.round((result.confidence || result.score || 0) * 100) : Math.round((Math.max((dashboardData.find((d: any) => d.name === 'Positive') as any)?.value || 0, (dashboardData.find((d: any) => d.name === 'Negative') as any)?.value || 0) / batchResults.length) * 100)}%` }} 
                                    />
                                </div>
                            </div>

                            {/* Key Indicators Widget */}
                            <div className="glass-panel border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                                <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Execution Flags</h4>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-center justify-between border-b border-white/5 pb-2">
                                        <span className="text-zinc-400 font-light">Complexity</span>
                                        <span className="font-medium text-white">{result ? (result.wordCount > 20 ? 'High' : result.wordCount > 10 ? 'Medium' : 'Low') : 'High Volume'}</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span className="text-zinc-400 font-light">Vector</span>
                                        <span className="font-medium text-emerald-400">{result ? result.label : (batchResults.filter(r => r.result.label === 'Positive').length > batchResults.filter(r => r.result.label === 'Negative').length ? 'Positive' : 'Negative')}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lexical Analysis Deep Dive */}
                {result && (
                    <div className="mt-8 pt-8 border-t border-white/5">
                        <h3 className="text-xl font-display font-medium flex items-center gap-3 mb-8 text-white">
                            <Tag className="w-5 h-5 text-indigo-400" />
                            Lexical Deep Dive
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="glass-panel border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                <span className="text-4xl font-display font-medium text-white tracking-tighter">{result.uniqueWords || 0}</span>
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-3">Unique Tokens</span>
                            </div>
                            <div className="glass-panel border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                <span className="text-4xl font-display font-medium text-white tracking-tighter">{result.readingTime || 0}s</span>
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-3">Execution Time</span>
                            </div>
                            <div className="glass-panel border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                <span className="text-4xl font-display font-medium text-white tracking-tighter">{result.averageWordLength || 0}</span>
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-3">Avg Vector Length</span>
                            </div>
                            <div className="glass-panel border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                <span className="text-4xl font-display font-medium text-indigo-400 tracking-tighter capitalize">{result.complexityScore || "Basic"}</span>
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-3">Semantic Depth</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sentiment Journey Visualization */}
                {result && sentenceData.length > 1 && (
                    <div className="mt-8 pt-8 border-t border-white/5">
                        <h3 className="text-xl font-display font-medium flex items-center gap-3 mb-8 text-white">
                            <Activity className="w-5 h-5 text-blue-400" />
                            Sequential Flow Analysis
                        </h3>
                        <div className="glass-panel border border-white/5 rounded-2xl p-6 h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sentenceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" tick={{fill: "#a1a1aa", fontSize: 11, fontFamily: "var(--font-mono)"}} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis tick={{fill: "#a1a1aa", fontSize: 11, fontFamily: "var(--font-mono)"}} axisLine={false} tickLine={false} dx={-10} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                                    <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 4, strokeWidth: 0, fill: "#3b82f6" }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyzePage;
