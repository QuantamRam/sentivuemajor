import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

const comparisonData = [
  { model: "Naïve Bayes", accuracy: 82.4 },
  { model: "Logistic Regression", accuracy: 87.0 },
  { model: "SVM", accuracy: 88.6 },
];

const sentimentDist = [
  { name: "Positive", value: 42, color: "hsl(187, 80%, 48%)" },
  { name: "Negative", value: 30, color: "hsl(0, 70%, 55%)" },
  { name: "Neutral", value: 28, color: "hsl(222, 30%, 40%)" },
];

const metricsData = [
  { metric: "Accuracy", value: 87 },
  { metric: "Precision", value: 85 },
  { metric: "Recall", value: 84 },
  { metric: "F1-Score", value: 85 },
];

const samplePredictions = [
  { text: "I love this product!", sentiment: "Positive" },
  { text: "The service was terrible.", sentiment: "Negative" },
  { text: "It was okay, nothing special.", sentiment: "Neutral" },
];

const ResultsSection = () => {
  return (
    <section id="results" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">Results & Discussion</h2>
          <div className="section-glow-line mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The Logistic Regression model achieved 87% accuracy and an F1-score of 0.85 across three sentiment classes.
          </p>
        </motion.div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: "Accuracy", value: "87%" },
            { label: "F1-Score", value: "0.86" },
            { label: "Precision", value: "85%" },
            { label: "Recall", value: "84%" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card border border-border rounded-lg p-6 text-center shadow-[var(--shadow-card)]"
            >
              <p className="text-3xl md:text-4xl font-mono font-bold text-primary text-glow">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Model Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-lg p-6 shadow-[var(--shadow-card)]"
          >
            <h3 className="text-lg font-display font-semibold mb-6 text-foreground">Model Accuracy Comparison</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                <XAxis dataKey="model" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} />
                <YAxis domain={[75, 95]} tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: 8 }}
                  labelStyle={{ color: "hsl(210, 40%, 92%)" }}
                  itemStyle={{ color: "hsl(187, 80%, 48%)" }}
                />
                <Bar dataKey="accuracy" fill="hsl(187, 80%, 48%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Sentiment Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6 shadow-[var(--shadow-card)]"
          >
            <h3 className="text-lg font-display font-semibold mb-6 text-foreground">Sentiment Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={sentimentDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sentimentDist.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: 8 }}
                  itemStyle={{ color: "hsl(210, 40%, 92%)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              {sentimentDist.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-sm text-muted-foreground">{s.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-lg p-6 shadow-[var(--shadow-card)] max-w-lg mx-auto mb-16"
        >
          <h3 className="text-lg font-display font-semibold mb-6 text-center text-foreground">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={metricsData}>
              <PolarGrid stroke="hsl(222, 30%, 16%)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="value" stroke="hsl(187, 80%, 48%)" fill="hsl(187, 80%, 48%)" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sample Predictions Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-lg overflow-hidden shadow-[var(--shadow-card)]"
        >
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-display font-semibold text-foreground">Sample Predictions</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-mono text-muted-foreground">Text</th>
                <th className="text-left p-4 text-sm font-mono text-muted-foreground">Predicted Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {samplePredictions.map((p) => (
                <tr key={p.text} className="border-b border-border last:border-0">
                  <td className="p-4 text-foreground">{p.text}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-mono ${
                      p.sentiment === "Positive" ? "bg-primary/10 text-primary" :
                      p.sentiment === "Negative" ? "bg-destructive/10 text-destructive" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {p.sentiment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsSection;
