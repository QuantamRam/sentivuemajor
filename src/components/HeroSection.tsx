import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 text-primary text-sm font-mono tracking-wider">
            IEEE Conference Paper
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-4"
        >
          Sentiment Analysis for{" "}
          <span className="text-primary text-glow">Social Media</span>{" "}
          Monitoring
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-2xl md:text-3xl font-display text-muted-foreground mb-10"
        >
          Using Logistic Regression
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {[
            { name: "Dr. V. Suganya", role: "Assistant Professor (CSE)" },
            { name: "S. Ram Chandar", role: "Computer Science & Engineering" },
            { name: "G. Aditya Venkatesh", role: "Computer Science & Engineering" },
          ].map((author) => (
            <div key={author.name} className="text-center">
              <p className="font-medium text-foreground">{author.name}</p>
              <p className="text-sm text-muted-foreground">{author.role}</p>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm text-muted-foreground font-mono"
        >
          Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology, Chennai
        </motion.p>

        {/* Keywords */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-2"
        >
          {["Sentiment Analysis", "Logistic Regression", "NLP", "Social Media Analytics", "Machine Learning", "Text Classification"].map((kw) => (
            <span key={kw} className="px-3 py-1 text-xs font-mono rounded-md bg-secondary text-secondary-foreground border border-border">
              {kw}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
