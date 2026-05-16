import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { TrendingUp, MessageSquare, ShieldCheck } from "lucide-react";

// Micro-animation component isolated to prevent re-renders in parent
const PerpetualCard = () => {
  const y1 = useMotionValue(0);
  const y2 = useMotionValue(0);
  const y3 = useMotionValue(0);

  useEffect(() => {
    // Infinite gentle float animations with slightly offset timings
    animate(y1, [0, -15, 0], { ease: "easeInOut", duration: 6, repeat: Infinity });
    animate(y2, [0, 10, 0], { ease: "easeInOut", duration: 5, repeat: Infinity });
    animate(y3, [0, -8, 0], { ease: "easeInOut", duration: 7, repeat: Infinity });
  }, [y1, y2, y3]);

  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto md:ml-auto select-none pointer-events-none">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-4 p-4 opacity-10">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="border border-white/20 rounded-lg" />
        ))}
      </div>

      {/* Main Center Card */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-72 glass-panel rounded-3xl p-6 flex flex-col shadow-2xl z-20 border border-white/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="h-2.5 w-16 bg-white/20 rounded-full" />
            <div className="h-2 w-24 bg-white/10 rounded-full" />
          </div>
        </div>
        <div className="space-y-3 flex-1">
          <div className="h-2 w-full bg-white/10 rounded-full" />
          <div className="h-2 w-4/5 bg-white/10 rounded-full" />
          <div className="h-2 w-full bg-white/10 rounded-full" />
          <div className="h-2 w-2/3 bg-white/10 rounded-full" />
        </div>
        <div className="mt-auto flex items-end justify-between">
          <span className="text-xs font-mono text-emerald-400">ANALYZING...</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-emerald-400 rounded-full"
                animate={{ height: [8, 24, 8] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/4 -left-8 w-40 glass-card rounded-2xl p-4 z-30"
      >
        <div className="flex items-center gap-3">
          <MessageSquare className="w-4 h-4 text-white/50" />
          <span className="text-xs font-mono text-white/70">8,492 Streams</span>
        </div>
      </motion.div>

      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-1/4 -right-8 w-48 glass-card rounded-2xl p-4 z-10"
      >
        <div className="flex items-center gap-3">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <div>
            <p className="text-xs text-white/50">Confidence</p>
            <p className="text-sm font-mono text-white">99.4%</p>
          </div>
        </div>
      </motion.div>

      {/* Ambient Blur Behind Cards */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/10 blur-[100px] rounded-full z-0" />
    </div>
  );
};

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      } 
    },
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-background">
      {/* Absolute positioning grid background to stay out of document flow */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Side: Typography & Information */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-start text-left max-w-2xl"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-emerald-400 text-xs font-mono tracking-widest backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SentiVue AI Engine
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-display font-medium tracking-tighter leading-[1.1] mb-6 text-white"
            >
              Sentiment Analysis for <br />
              <span className="text-emerald-400">Social Media</span> Monitoring
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-[55ch] mb-12"
            >
              An advanced logistical approach to interpreting global sentiment streams. 
              Real-time processing powered by localized machine learning algorithms.
            </motion.p>

            {/* Tags */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
              {["Deep Learning", "NLP", "Real-Time Classification", "Enterprise AI"].map((kw) => (
                <span key={kw} className="px-3 py-1.5 text-xs font-mono rounded-lg bg-secondary/50 text-white/70 border border-white/5 backdrop-blur-sm">
                  {kw}
                </span>
              ))}
            </motion.div>

          </motion.div>

          {/* Right Side: Perpetual Micro-Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            className="w-full relative hidden md:block"
          >
            <PerpetualCard />
          </motion.div>

        </div>
      </div>
      
      {/* Bottom Fade Gradient to match the dark background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
