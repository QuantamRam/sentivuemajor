import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeSentiment, analyzeSentimentWithAI, type SentimentResult } from "@/lib/sentiment";
import { Send, RotateCcw, ThumbsUp, ThumbsDown, Minus, Loader2, Sparkles, UploadCloud, Download, PieChart as PieChartIcon, Tag, Activity, BrainCircuit, Zap, MessageSquare } from "lucide-react";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
        // Assume text is in first column
        const texts = results.data.map((row: any) => row[0]).filter((t: any) => t && typeof t === 'string');
        const analyzed = [];
        for(const t of texts) {
            const r = await analyzeSentimentWithAI(t);
            analyzed.push({text: t, result: r});
        }
        setBatchResults(analyzed);
        setResult(null); // clear single result
        setIsBatchLoading(false);
      }
    });
  }

  const exportReport = async () => {
    if (!reportRef.current) return;
    try {
        const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
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
  const sentimentColor = result?.label === "Positive" ? "text-green-400" : result?.label === "Negative" ? "text-red-400" : "text-muted-foreground";
  const sentimentBg = result?.label === "Positive" ? "bg-green-500/10 border-green-500/20" : result?.label === "Negative" ? "bg-red-500/10 border-red-500/20" : "bg-muted/50 border-border";

  const currentStateOfMind = result ? getStateOfMind(result.emotion, result.label) : (batchResults.length > 0 ? getBatchStateOfMind(batchResults) : null);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-display font-bold text-foreground">Enterprise Analytics</h1>
           <p className="text-muted-foreground mt-1">Single query or bulk CSV processing powered by DistilBERT</p>
        </div>
        {(result || batchResults.length > 0) && (
           <button onClick={exportReport} className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 outline outline-1 outline-border font-medium transition-colors cursor-pointer z-10">
              <Download className="w-4 h-4" /> Export Report
           </button>
        )}
      </motion.div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
            <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAnalyze(); } }}
            placeholder="Type or paste text to analyze sentiment..."
            className="w-full bg-secondary/50 border border-border rounded-lg p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring font-body text-sm min-h-[120px]"
            />
            <div className="flex items-center justify-between mt-4">
               <button onClick={() => { setText(""); setResult(null); setBatchResults([]); setSentenceData([]); }} className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50">
                   <RotateCcw className="w-4 h-4" /> Clear
               </button>
               <button onClick={handleAnalyze} disabled={!text.trim() || isLoading} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                   {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                   {isLoading ? "Analyzing..." : "Analyze"}
               </button>
            </div>
            
             <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
               <span className="text-xs font-medium text-muted-foreground pt-1 mr-1">Examples:</span>
              {exampleTexts.map((t) => (
                <button
                  key={t}
                  onClick={() => handleExample(t)}
                  className="text-xs px-2 py-1 bg-secondary/50 border border-border rounded-md text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-left max-w-xs truncate"
                >
                  {t}
                </button>
              ))}
            </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)] flex flex-col items-center justify-center text-center border-dashed border-2 cursor-pointer hover:bg-secondary/20 transition-colors relative">
            <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            {isBatchLoading ? (
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm font-medium">Processing Batch...</p>
                </div>
            ) : (
                <>
                    <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
                    <h3 className="font-medium text-foreground">Bulk CSV Upload</h3>
                    <p className="text-xs text-muted-foreground mt-1 px-4">Drop a CSV file to analyze all rows automatically.</p>
                </>
            )}
        </div>
      </motion.div>

      {/* Report Dashboard */}
      <AnimatePresence mode="wait">
        {(result || batchResults.length > 0) && (
          <motion.div
            key={result ? "single" : "batch"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {/* We wrap the content to be exported in a ref div */}
            <div ref={reportRef} className="bg-card border border-border rounded-xl p-6 shadow-lg bg-background">
                <div className="flex items-center gap-2 mb-6 border-b pb-4 border-border">
                    <PieChartIcon className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-display font-bold">Analysis Dashboard</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Result Column */}
                    <div>
                    {result ? (
                            <div className={`border rounded-xl p-6 mb-4 ${sentimentBg}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    {(() => { const Icon = sentimentIcon; return <Icon className={`w-8 h-8 ${sentimentColor}`} />; })()}
                                    <div>
                                        <h3 className={`text-2xl font-display font-bold ${sentimentColor}`}>{result.label}</h3>
                                        <p className="text-sm text-muted-foreground">Sentiment Classification</p>
                                    </div>
                                </div>
                                
                                {result.keywords && result.keywords.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                    <div className="w-full flex items-center gap-1 text-xs text-muted-foreground mb-1"><Tag className="w-3 h-3"/> Key Aspects:</div>
                                    {result.keywords.map(kw => (
                                        <span key={kw} className="px-2 py-1 bg-background border rounded-md text-xs font-medium capitalize shadow-sm">{kw}</span>
                                    ))}
                                    </div>
                                )}
                            </div>
                    ) : (
                            <div className="bg-secondary/20 p-6 rounded-xl border border-border">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary"/> Batch Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                                        <span className="font-medium text-sm">Total Processed</span>
                                        <span className="font-bold">{batchResults.length} rows</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-500/10 text-green-500 rounded-lg border border-green-500/20">
                                        <span className="font-medium text-sm">Positive Sentiment</span>
                                        <span className="font-bold">{batchResults.filter(r => r.result.label === 'Positive').length}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20">
                                        <span className="font-medium text-sm">Negative Sentiment</span>
                                        <span className="font-bold">{batchResults.filter(r => r.result.label === 'Negative').length}</span>
                                    </div>
                                </div>
                            </div>
                    )}

                        {result?.isAi && result?.emotion && (
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between shadow-sm mt-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    <span className="font-medium text-foreground">AI Emotion Detected</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-primary">{result.emotion}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chart Column */}
                    <div className="h-[300px] bg-background/50 rounded-xl border border-border p-4 flex flex-col justify-center relative">
                    {result?.allEmotions ? (
                        <>
                            <h3 className="text-center font-medium text-sm text-foreground mb-2">Feeling Fingerprint</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getEmotionData()}>
                                    <PolarGrid stroke="var(--border)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Emotion Score" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
                                    <RechartsTooltip formatter={(value: number) => value.toFixed(1) + '%'} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </>
                    ) : batchResults.length > 0 ? (
                        <>
                            <h3 className="text-center font-medium text-sm text-foreground mb-2">Sentiment Volume</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getBarData()} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} axisLine={false} tickLine={false} />
                                    <YAxis tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <RechartsTooltip cursor={{fill: "hsl(var(--secondary))"}} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                        {getBarData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.name === 'Positive' ? '#10b981' : entry.name === 'Negative' ? '#ef4444' : '#f59e0b'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </>
                    ) : dashboardData.length > 0 ? (
                        <>
                            <h3 className="text-center font-medium text-sm text-foreground mb-2">Word Distribution</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={dashboardData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {dashboardData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(value: number) => value.toFixed(1)} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground italic text-sm">No chart data available</div>
                    )}
                    </div>
                </div>

                {/* Cognitive State Analysis */}
                {currentStateOfMind && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 pt-6 border-t border-border">
                        <h3 className="text-lg font-display font-bold flex items-center gap-2 mb-6">
                            <BrainCircuit className="w-5 h-5 text-purple-500" />
                            Cognitive & Behavioral Analytics
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            
                            {/* State of Mind Widget */}
                            <div className="bg-secondary/30 border border-border rounded-xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <Activity className="w-4 h-4 text-blue-500" />
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">State of Mind</h4>
                                </div>
                                <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                                    {currentStateOfMind.mind}
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {currentStateOfMind.description}
                                </p>
                            </div>

                            {/* Tone Insight Widget */}
                            <div className="bg-secondary/30 border border-border rounded-xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Primary Tone</h4>
                                </div>
                                <p className="text-xl font-bold text-foreground mb-2">
                                    {currentStateOfMind.tone}
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Determined from linguistic sentiment patterns and overall emotional signature.
                                </p>
                            </div>

                            {/* Intensity / Confidence Widget */}
                            <div className="bg-secondary/30 border border-border rounded-xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                        {result ? "Emotional Intensity" : "Consensus Strength"}
                                    </h4>
                                </div>
                                <div className="flex items-end gap-2 mb-3">
                                    <span className="text-3xl font-display font-bold text-foreground leading-none">
                                        {result ? Math.round((result.confidence || result.score || 0) * 100) : Math.round((Math.max((dashboardData.find((d: any) => d.name === 'Positive') as any)?.value || 0, (dashboardData.find((d: any) => d.name === 'Negative') as any)?.value || 0) / batchResults.length) * 100)}%
                                    </span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" 
                                         style={{ width: `${result ? Math.round((result.confidence || result.score || 0) * 100) : Math.round((Math.max((dashboardData.find((d: any) => d.name === 'Positive') as any)?.value || 0, (dashboardData.find((d: any) => d.name === 'Negative') as any)?.value || 0) / batchResults.length) * 100)}%` }} 
                                    />
                                </div>
                            </div>

                            {/* Key Indicators Widget */}
                            <div className="bg-secondary/30 border border-border rounded-xl p-5 shadow-sm flex flex-col justify-center">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Key Indicators</h4>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Complexity</span>
                                        <span className="font-medium">{result ? (result.wordCount > 20 ? 'High' : result.wordCount > 10 ? 'Medium' : 'Low') : 'High Volume'}</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Dominant Polarity</span>
                                        <span className="font-medium text-primary">{result ? result.label : (batchResults.filter(r => r.result.label === 'Positive').length > batchResults.filter(r => r.result.label === 'Negative').length ? 'Positive' : 'Negative')}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Lexical Analysis Deep Dive */}
                {result && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 pt-6 border-t border-border">
                        <h3 className="text-lg font-display font-bold flex items-center gap-2 mb-6">
                            <Tag className="w-5 h-5 text-indigo-500" />
                            Lexical Deep Dive
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-background border border-border rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm">
                                <span className="text-3xl font-display font-bold text-foreground">{result.uniqueWords || 0}</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Unique Words</span>
                            </div>
                            <div className="bg-background border border-border rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm">
                                <span className="text-3xl font-display font-bold text-foreground">{result.readingTime || 0}s</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Reading Time</span>
                            </div>
                            <div className="bg-background border border-border rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm">
                                <span className="text-3xl font-display font-bold text-foreground">{result.averageWordLength || 0}</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Avg Word Length</span>
                            </div>
                            <div className="bg-background border border-border rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm">
                                <span className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">{result.complexityScore || "Basic"}</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Complexity</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Sentiment Journey Visualization */}
                {result && sentenceData.length > 1 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8 pt-6 border-t border-border">
                        <h3 className="text-lg font-display font-bold flex items-center gap-2 mb-6">
                            <Activity className="w-5 h-5 text-blue-500" />
                            Sentiment Journey
                        </h3>
                        <div className="bg-background border border-border rounded-xl p-6 h-[250px] shadow-sm">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sentenceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} axisLine={false} tickLine={false} />
                                    <YAxis tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} axisLine={false} tickLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                                    <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyzePage;
