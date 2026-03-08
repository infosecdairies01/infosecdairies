import Navbar from "@/components/Navbar";
import SOCSidebar from "@/components/soc/SOCSidebar";
import AlertSummaryCards from "@/components/soc/AlertSummaryCards";
import AlertsChart from "@/components/soc/AlertsChart";
import TopSourcesChart from "@/components/soc/TopSourcesChart";
import RecentAlertsTable from "@/components/soc/RecentAlertsTable";
import { Bell, Search, User, Lock } from "lucide-react";
const Labs = () => {
  return <main className="min-h-screen bg-[#010409] flex flex-col">
      <Navbar />
      
      {/* Access Restriction Overlay */}
      <div className="fixed inset-0 top-16 md:top-20 z-40 flex items-start justify-center pt-100 md:pt-60 pointer-events-none">
        <div className="text-center pointer-events-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#21262d]/80 border border-[#30363d] flex items-center justify-center backdrop-blur-sm">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            You don't have access to this page
          </h2>
          <p className="text-sm text-[#8b949e]">Please upgrade your plan or contact the
administrator</p>
        </div>
      </div>
      
      <div className="flex flex-1 pt-5 md:pt-1 blur-[3px] pointer-events-none select-none overflow-auto">
        <SOCSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Dashboard Header */}
          <header className="bg-[#0d1117] border-b border-[#21262d] px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#c9d1d9]">Security Dashboard</h1>
              <p className="text-sm text-[#8b949e]">Real-time threat monitoring and analysis</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
                <input type="text" placeholder="Search alerts..." className="bg-[#0d1117] border border-[#21262d] rounded-md pl-10 pr-4 py-2 text-sm text-[#c9d1d9] placeholder:text-[#8b949e] focus:outline-none focus:border-[#00ffc8] w-64" />
              </div>
              
              <button className="relative p-2 text-[#8b949e] hover:text-[#c9d1d9] transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              
              <button className="w-8 h-8 bg-[#21262d] rounded-full flex items-center justify-center text-[#8b949e] hover:text-[#c9d1d9] transition-colors">
                <User className="w-4 h-4" />
              </button>
            </div>
          </header>
          
          {/* Dashboard Content */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
              {/* Alert Summary Cards */}
              <AlertSummaryCards />
              
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AlertsChart />
                <TopSourcesChart />
              </div>
              
              {/* Recent Alerts Table */}
              <RecentAlertsTable />
            </div>
          </div>
        </div>
      </div>
    </main>;
};
export default Labs;