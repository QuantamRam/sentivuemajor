import { motion } from "framer-motion";

const formulas = [
  {
    title: "Logistic Regression Hypothesis",
    formula: "h(x) = 1 / (1 + e^(-θᵀx))",
    desc: "Predicts the probability that a post falls into a specific sentiment category.",
  },
  {
    title: "Sigmoid Activation",
    formula: "σ(z) = 1 / (1 + e^(-z))",
    desc: "Maps any real number into the [0, 1] range for valid probability output.",
  },
  {
    title: "Cross-Entropy Loss",
    formula: "J(θ) = −(1/m) Σ [y·log(h(x)) + (1−y)·log(1−h(x))]",
    desc: "Training loss function minimized during classifier optimization.",
  },
  {
    title: "Softmax (Multiclass)",
    formula: "P(y=j|x) = e^(θⱼᵀx) / Σₖ e^(θₖᵀx)",
    desc: "Calculates class probabilities when classifying more than two sentiments.",
  },
  {
    title: "Gradient Descent",
    formula: "θ := θ − α · ∂J(θ)/∂θ",
    desc: "Parameter optimization using gradient descent with learning rate α.",
  },
  {
    title: "TF-IDF Weighting",
    formula: "TF-IDF(t,d) = TF(t,d) × log(N / DF(t))",
    desc: "Measures importance of a term in a document relative to the corpus.",
  },
];

const FormulasSection = () => {
  return (
    <section id="formulas" className="py-24 px-6 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">Core Formulas</h2>
          <div className="section-glow-line mb-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formulas.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-card border border-border rounded-lg p-6 shadow-[var(--shadow-card)]"
            >
              <h3 className="text-sm font-semibold text-primary font-mono mb-3">{f.title}</h3>
              <div className="bg-secondary/50 rounded-md p-4 mb-3 border border-border">
                <code className="text-lg text-foreground font-mono">{f.formula}</code>
              </div>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FormulasSection;
