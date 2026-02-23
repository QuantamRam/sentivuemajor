import { motion } from "framer-motion";

const AbstractSection = () => {
  return (
    <section id="abstract" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">Abstract</h2>
          <div className="section-glow-line mb-8" />
          <div className="bg-card rounded-lg border border-border p-8 shadow-[var(--shadow-card)]">
            <p className="text-foreground/90 leading-relaxed text-lg">
              This work is centered on <span className="text-primary font-medium">Sentiment Analysis for Social Media Monitoring</span> based on Logistic Regression, specifically targeting Twitter data. The system extracts tweets through the Twitter API and pre-processes them by applying operations such as tokenization, stop word removal, and feature extraction using Bag-of-Words or TF-IDF representation.
            </p>
            <p className="text-foreground/90 leading-relaxed text-lg mt-4">
              A Logistic Regression classifier categorizes tweets into <span className="text-primary font-medium">positive</span>, <span className="text-primary font-medium">negative</span>, and <span className="text-primary font-medium">neutral</span> sentiments. The model performance is evaluated by accuracy, confusion matrix, ROC curves and precision-recall metrics to ensure trustable sentiment classification even with the impoverished language of tweets.
            </p>
            <p className="text-foreground/90 leading-relaxed text-lg mt-4">
              The results indicate Logistic Regression is a feasible and effective approach for real-time sentiment detection over Twitter, enabling institutions and researchers to follow public opinion, trace developments, and take well-informed decisions.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AbstractSection;
