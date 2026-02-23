import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AbstractSection from "@/components/AbstractSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import MethodologySection from "@/components/MethodologySection";
import ResultsSection from "@/components/ResultsSection";
import FormulasSection from "@/components/FormulasSection";
import ConclusionSection from "@/components/ConclusionSection";
import ReferencesSection from "@/components/ReferencesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AbstractSection />
      <ArchitectureSection />
      <MethodologySection />
      <ResultsSection />
      <FormulasSection />
      <ConclusionSection />
      <ReferencesSection />
      <footer className="py-8 px-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground font-mono">
          © 2025 Vel Tech University · IEEE Conference Paper
        </p>
      </footer>
    </div>
  );
};

export default Index;
