import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, MessageSquareText, Database, Menu, X, Sparkles, Rocket } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/analyze", label: "Analyze", icon: MessageSquareText },
  { to: "/dataset", label: "Dataset", icon: Database },
  { to: "/features", label: "Features", icon: Rocket },
];

const authors = [
  "Dr. V. Suganya",
  "S. Ram Chandar",
  "G. Aditya Venkatesh",
];

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl fixed inset-y-0 left-0 z-40">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shadow-[var(--shadow-glow)]">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display font-bold text-foreground text-lg leading-tight">SentiVue</h1>
                <p className="text-xs text-muted-foreground font-mono">Sentiment Analyzer</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary shadow-[var(--shadow-glow)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-border space-y-3">
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground font-mono">IEEE Conference Paper</p>
              <p className="text-xs text-primary mt-1 font-medium">Sentiment Analysis for Social Media Monitoring</p>
            </div>
            <div className="px-2">
              <p className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-widest mb-1.5">Authors</p>
              {authors.map((name) => (
                <p key={name} className="text-xs text-muted-foreground/80 font-mono leading-relaxed">{name}</p>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-foreground">SentiVue</span>
            </div>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-muted-foreground">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          <AnimatePresence>
            {mobileOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-border"
              >
                <div className="p-3 space-y-1">
                  {links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === "/"}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                        }`
                      }
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pt-16 md:pt-0">
          <Outlet />
        </main>
      </div>

      {/* Footer with author credits */}
      <footer className="md:ml-64 border-t border-border bg-card/30 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary/60" />
            <p className="text-sm text-muted-foreground font-mono">
              © 2025 SentiVue · IEEE Conference Paper
            </p>
          </div>
          <div className="flex items-center gap-4">
            {authors.map((name, i) => (
              <span key={name} className="text-xs text-muted-foreground/70 font-mono">
                {name}{i < authors.length - 1 && <span className="text-primary/40 ml-4">·</span>}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
