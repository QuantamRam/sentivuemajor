import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { BarChart3, MessageSquareText, Database, Menu, X, Sparkles, Rocket } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { AnimatePresence, motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import AIChatBot from "./AIChatBot";

const links = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/analyze", label: "Analyze", icon: MessageSquareText },
  { to: "/x-analysis", label: "X Analysis", icon: FaXTwitter },
  { to: "/features", label: "Features", icon: Rocket },
];

const authors: string[] = [];

// Extracted Magnetic Dock Item for performance and isolation
const DockItem = ({ link, isActive }: { link: any, isActive: boolean }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  
  // Mouse position relative to the item
  const mouseX = useMotionValue(Infinity);
  
  // Calculate distance
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Calculate scale based on distance
  const scaleSync = useTransform(distance, [-150, 0, 150], [1, 1.4, 1]);
  
  // Apply spring physics to scale
  const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <NavLink
      ref={ref}
      to={link.to}
      end={link.to === "/"}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="relative group flex items-center justify-center h-12 w-12"
    >
      <motion.div
        style={{ scale }}
        className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-colors duration-200 ${
          isActive 
            ? "bg-emerald-500 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
            : "bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
        }`}
      >
        <link.icon className="w-5 h-5" />
      </motion.div>
      
      {/* Tooltip */}
      <span className="absolute -top-12 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-lg text-xs font-medium shadow-xl pointer-events-none whitespace-nowrap text-zinc-100">
          {link.label}
      </span>
      
      {/* Active Indicator Dot */}
      {isActive && (
          <motion.div layoutId="dock-indicator" className="absolute -bottom-2 w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
      )}
    </NavLink>
  );
};

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col relative z-0 pb-24 bg-background">
      {/* Top Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-panel border-x-0 border-t-0 rounded-none h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)] border border-emerald-500/20">
                <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-display font-medium text-foreground text-lg tracking-tight">SentiVue</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-2 uppercase tracking-wider">
                Enterprise
            </span>
        </div>

        <div className="hidden md:flex items-center gap-4">
            {authors.map((name, i) => (
                <span key={name} className="text-xs text-zinc-500 font-mono">
                    {name}{i < authors.length - 1 && <span className="text-emerald-500/30 ml-4">·</span>}
                </span>
            ))}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-zinc-400 active:scale-95 transition-transform">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
            <motion.div
            initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed top-16 left-0 right-0 z-30 glass-panel border-x-0 rounded-none p-4 md:hidden flex flex-col gap-2 shadow-2xl"
            >
            {links.map((link) => (
                <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-zinc-400 hover:bg-zinc-800/50"
                    }`
                }
                >
                <link.icon className="w-4 h-4" />
                {link.label}
                </NavLink>
            ))}
            </motion.div>
        )}
      </AnimatePresence>

      {/* Floating macOS style Dock (Desktop) */}
      <div className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <motion.nav 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            className="glass-panel rounded-3xl px-3 py-2 flex items-center gap-1 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-white/10"
          >
              {links.map((link) => (
                  <DockItem 
                    key={link.to} 
                    link={link} 
                    isActive={location.pathname === link.to || (link.to === "/" && location.pathname === "/")} 
                  />
              ))}
          </motion.nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-24 px-4 w-full">
        <Outlet />
      </main>

      <AIChatBot />
    </div>
  );
};

export default AppLayout;
