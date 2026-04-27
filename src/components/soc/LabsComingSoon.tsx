import { Lock } from "lucide-react";
import SOCSidebar from "@/components/soc/SOCSidebar";
import Navbar from "@/components/Navbar";
import labsPreview from "@/assets/labs-preview.png";

interface LabsComingSoonProps {
  activeItem: string;
}

const LabsComingSoon = ({ activeItem }: LabsComingSoonProps) => {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16 md:pt-20 overflow-hidden">
        <SOCSidebar activeItem={activeItem} />

        {/* Main content area */}
        <div className="flex-1 relative overflow-hidden">

          {/* Blurred dashboard screenshot background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${labsPreview})` }}
          />

          {/* Dark blur overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-black/60" />

          {/* Access denied card */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="relative text-center max-w-sm w-full">
              {/* Lock icon */}
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-black/40">
                <Lock className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">
                You don't have access to this page
              </h2>
              <p className="text-sm text-white/60 leading-relaxed">
                Please upgrade your plan or contact the administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LabsComingSoon;
