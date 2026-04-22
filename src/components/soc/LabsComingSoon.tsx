import { Construction } from "lucide-react";
import SOCSidebar from "@/components/soc/SOCSidebar";
import Navbar from "@/components/Navbar";

interface LabsComingSoonProps {
  activeItem: string;
}

const LabsComingSoon = ({ activeItem }: LabsComingSoonProps) => {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-20 overflow-hidden">
        <SOCSidebar activeItem={activeItem} />
        <div className="flex-1 flex items-center justify-center relative">
          <div className="absolute inset-0 circuit-pattern opacity-10 pointer-events-none" />
          <div className="relative text-center px-6 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Construction className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Under Construction</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The <span className="text-primary font-medium">{activeItem}</span> section is currently being built.
              Check back soon — it's going to be good.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Work in progress
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LabsComingSoon;
