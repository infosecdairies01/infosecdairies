import { 
  LayoutDashboard, 
  AlertTriangle, 
  FileWarning, 
  ScrollText, 
  Monitor, 
  Activity,
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: AlertTriangle, label: "Alerts" },
  { icon: FileWarning, label: "Incidents" },
  { icon: ScrollText, label: "Logs" },
  { icon: Monitor, label: "Endpoints" },
  { icon: Activity, label: "Threat Intel" },
  { icon: Settings, label: "Settings" },
];

const SOCSidebar = () => {
  return (
    <aside className="w-16 lg:w-56 bg-[#0d1117] border-r border-[#21262d] flex flex-col shrink-0">
      <div className="p-4 border-b border-[#21262d]">
        <h2 className="hidden lg:block text-lg font-bold text-[#00ffc8]">SOC Labs</h2>
      </div>
      
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200",
              "hover:bg-[#161b22] hover:text-[#00ffc8]",
              item.active 
                ? "bg-[#161b22] text-[#00ffc8] border-l-2 border-[#00ffc8]" 
                : "text-[#8b949e]"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0 mx-auto lg:mx-0" />
            <span className="hidden lg:inline">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-[#21262d]">
        <div className="hidden lg:flex items-center gap-2 text-xs text-[#8b949e]">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>System Online</span>
        </div>
      </div>
    </aside>
  );
};

export default SOCSidebar;
