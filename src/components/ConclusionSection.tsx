import { motion } from "framer-motion";

const ConclusionSection = () => {
  return (
    <section id="conclusion" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">Conclusion & Future Work</h2>
          <div className="section-glow-line mb-8" />

          <div className="bg-card border border-border rounded-lg p-8 shadow-[var(--shadow-card)] mb-8">
            <p className="text-foreground/90 leading-relaxed text-lg">
              The sentiment analysis system with Logistic Regression demonstrates that traditional machine learning remains effective for monitoring social media at scale. With structured preprocessing, TF-IDF feature extraction, and linear classification, the model is <span className="text-primary font-medium">interpretable, computationally inexpensive, and fast</span> — ideal for real-time applications like brand monitoring and public opinion tracking.
            </p>
          </div>

          <h3 className="text-xl font-display font-semibold mb-4 text-foreground">Future Directions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Advanced Embeddings", desc: "Word2Vec, GloVe, or BERT-based contextual features for ambiguous content." },
              { title: "Multilingual Support", desc: "Expand to multiple languages for global social media analysis." },
              { title: "Sarcasm Detection", desc: "Specialized classifiers for sarcasm, irony, and detailed emotions." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card border border-border rounded-lg p-5 shadow-[var(--shadow-card)]"
              >
                <h4 className="text-primary font-mono text-sm font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConclusionSection;
