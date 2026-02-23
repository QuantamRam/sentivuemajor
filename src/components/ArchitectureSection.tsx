import { motion } from "framer-motion";
import { Database, Filter, BarChart3, Brain, Monitor, HardDrive } from "lucide-react";

const modules = [
  {
    icon: Database,
    title: "Data Acquisition",
    desc: "Retrieves social media data through APIs (Twitter API), web-scraping, or benchmark datasets. Extracts metadata like timestamps, users, and hashtags.",
  },
  {
    icon: Filter,
    title: "Preprocessing Layer",
    desc: "Cleans and normalizes raw text — tokenization, stop-word elimination, stemming, lemmatization. Handles emojis, URLs, and informal language.",
  },
  {
    icon: BarChart3,
    title: "Feature Extraction",
    desc: "Converts processed text into numeric vectors using TF-IDF, Bag-of-Words, and n-grams for weighted sentiment representations.",
  },
  {
    icon: Brain,
    title: "Logistic Regression Classifier",
    desc: "The predictive engine. Learns patterns separating positive, negative, and neutral sentiments by minimizing cross-entropy loss.",
  },
  {
    icon: Monitor,
    title: "Prediction Dashboard",
    desc: "Visualizes sentiment distribution, trends over time, keyword impact, and real-time polarity updates through interactive charts.",
  },
  {
    icon: HardDrive,
    title: "Storage Layer",
    desc: "Securely stores datasets, cleaned text, extracted features, trained models, and sentiment outputs for reproducibility.",
  },
];

const ArchitectureSection = () => {
  return (
    <section id="architecture" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">System Architecture</h2>
          <div className="section-glow-line mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each module performs a specific function that collectively enables intelligent emotional understanding and personalized cognitive assistance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-card rounded-lg border border-border p-6 hover:border-primary/40 transition-colors duration-300 shadow-[var(--shadow-card)]"
            >
              <div className="absolute inset-0 rounded-lg bg-[var(--gradient-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:shadow-[var(--shadow-glow)] transition-shadow duration-300">
                  <mod.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold font-display mb-2 text-foreground">{mod.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{mod.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
