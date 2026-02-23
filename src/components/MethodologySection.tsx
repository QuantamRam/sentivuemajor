import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Data Collection", desc: "Collect social media posts via APIs or public datasets" },
  { num: "02", title: "Text Preprocessing", desc: "Clean text: remove URLs, emojis, stopwords; apply stemming/lemmatization" },
  { num: "03", title: "Feature Extraction", desc: "Convert text to numerical features using TF-IDF or Bag-of-Words" },
  { num: "04", title: "Train/Test Split", desc: "Divide dataset into 80% training and 20% testing data" },
  { num: "05", title: "Model Training", desc: "Train Logistic Regression with hyperparameter tuning via grid search" },
  { num: "06", title: "Evaluation", desc: "Measure accuracy, precision, recall, F1-score and confusion matrix" },
];

const MethodologySection = () => {
  return (
    <section id="methodology" className="py-24 px-6 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">Methodology</h2>
          <div className="section-glow-line mb-4" />
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex items-start mb-12 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary shadow-[var(--shadow-glow)] z-10" />

              <div className={`ml-16 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                <span className="font-mono text-primary text-sm">{step.num}</span>
                <h3 className="text-xl font-display font-semibold mt-1 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground mt-2">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
