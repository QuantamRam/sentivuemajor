import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeSentiment, analyzeSentimentWithAI, type SentimentResult } from "@/lib/sentiment";
import { Send, RotateCcw, ThumbsUp, ThumbsDown, Minus, Loader2, Sparkles, UploadCloud, Download, PieChart as PieChartIcon, Tag } from "lucide-react";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const exampleTexts = [
  "I absolutely love this product! Best purchase I've ever made.",
  "Terrible experience. The service was awful and I want a refund.",
  "The screen quality on this phone is terrible."
];

const AnalyzePage = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [batchResults, setBatchResults] = useState<{text: string, result: SentimentResult}[]>([]);
  const [isBatchLoading, setIsBatchLoading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    const r = await analyzeSentimentWithAI(text);
    setResult(r);
    setBatchResults([]); // Clear batch if single analysis
    setIsLoading(false);
  };

  const handleExample = async (t: string) => {
    setText(t);
    setIsLoading(true);
    const r = await analyzeSentimentWithAI(t);
    setResult(r);
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
        const texts = results.data.map((row: any) => row[0]).filter((t: any) => t && typeof t === 'string').slice(0, 50); // limit 50 for safety
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

  const dashboardData = getDashboardData();
  const sentimentIcon = result?.label === "Positive" ? ThumbsUp : result?.label === "Negative" ? ThumbsDown : Minus;
  const sentimentColor = result?.label === "Positive" ? "text-green-400" : result?.label === "Negative" ? "text-red-400" : "text-muted-foreground";
  const sentimentBg = result?.label === "Positive" ? "bg-green-500/10 border-green-500/20" : result?.label === "Negative" ? "bg-red-500/10 border-red-500/20" : "bg-muted/50 border-border";

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
               <button onClick={() => { setText(""); setResult(null); setBatchResults([]); }} className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50">
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
                    <p className="text-xs text-muted-foreground mt-1 px-4">Drop a CSV file to analyze up to 50 rows automatically.</p>
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
                    <h3 className="text-center font-medium text-sm text-foreground mb-2">Sentiment Distribution</h3>
                    {dashboardData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={dashboardData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {dashboardData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(value: number) => value.toFixed(1) + (result ? '%' : ' rows')} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground italic text-sm">No chart data available</div>
                    )}
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyzePage;
