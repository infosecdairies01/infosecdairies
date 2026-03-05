import Navbar from "@/components/Navbar";
import SOCSidebar from "@/components/soc/SOCSidebar";
import { Bell, Search, User, Filter, ChevronDown, Clock, Monitor, Globe, AlertTriangle, Shield, Eye, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Alert {
  id: string;
  time: string;
  date: string;
  name: string;
  description: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  source: string;
  sourceType: "endpoint" | "network" | "user" | "server";
  status: "Open" | "Investigating" | "Resolved" | "Closed";
  assignee?: string;
  mitreTactic?: string;
  mitreId?: string;
}

const alertsData: Alert[] = [
  { 
    id: "ALT-2026-0847",
    time: "14:32:18", 
    date: "Jan 21, 2026",
    name: "Suspicious PowerShell Execution", 
    description: "PowerShell process spawned with encoded command and bypass execution policy. Potential malicious script execution detected.",
    severity: "Critical", 
    source: "WKS-PC-0127", 
    sourceType: "endpoint",
    status: "Open",
    assignee: "Unassigned",
    mitreTactic: "Execution",
    mitreId: "T1059.001"
  },
  { 
    id: "ALT-2026-0846",
    time: "14:28:45", 
    date: "Jan 21, 2026",
    name: "Failed Login Attempt (5x)", 
    description: "Multiple failed authentication attempts detected from single source IP within 2 minutes. Possible brute force attack.",
    severity: "High", 
    source: "192.168.1.105", 
    sourceType: "network",
    status: "Investigating",
    assignee: "John D.",
    mitreTactic: "Credential Access",
    mitreId: "T1110"
  },
  { 
    id: "ALT-2026-0845",
    time: "14:25:12", 
    date: "Jan 21, 2026",
    name: "Unusual Outbound Traffic", 
    description: "Large volume of outbound traffic detected to unknown external IP. Data exfiltration indicators present.",
    severity: "High", 
    source: "10.0.0.42", 
    sourceType: "network",
    status: "Open",
    assignee: "Unassigned",
    mitreTactic: "Exfiltration",
    mitreId: "T1041"
  },
  { 
    id: "ALT-2026-0844",
    time: "14:22:33", 
    date: "Jan 21, 2026",
    name: "New Service Installed", 
    description: "New Windows service installed on domain controller. Service name does not match approved software list.",
    severity: "Medium", 
    source: "SRV-DB-01", 
    sourceType: "server",
    status: "Resolved",
    assignee: "Sarah M.",
    mitreTactic: "Persistence",
    mitreId: "T1543.003"
  },
  { 
    id: "ALT-2026-0843",
    time: "14:18:56", 
    date: "Jan 21, 2026",
    name: "Port Scan Detected", 
    description: "Sequential port scanning activity detected from internal host. Multiple ports probed within short timeframe.",
    severity: "Medium", 
    source: "172.16.0.88", 
    sourceType: "network",
    status: "Open",
    assignee: "Unassigned",
    mitreTactic: "Discovery",
    mitreId: "T1046"
  },
  { 
    id: "ALT-2026-0842",
    time: "14:15:21", 
    date: "Jan 21, 2026",
    name: "USB Device Connected", 
    description: "Removable storage device connected to endpoint. Device not in approved hardware whitelist.",
    severity: "Low", 
    source: "WKS-PC-0042", 
    sourceType: "endpoint",
    status: "Resolved",
    assignee: "Mike R.",
    mitreTactic: "Initial Access",
    mitreId: "T1091"
  },
  { 
    id: "ALT-2026-0841",
    time: "14:12:09", 
    date: "Jan 21, 2026",
    name: "DNS Query to Suspicious Domain", 
    description: "DNS resolution request to known malicious domain. Domain associated with C2 infrastructure.",
    severity: "High", 
    source: "admin_user", 
    sourceType: "user",
    status: "Investigating",
    assignee: "John D.",
    mitreTactic: "Command and Control",
    mitreId: "T1071.004"
  },
  { 
    id: "ALT-2026-0840",
    time: "14:08:44", 
    date: "Jan 21, 2026",
    name: "Scheduled Task Created", 
    description: "New scheduled task created with suspicious parameters. Task configured to run with SYSTEM privileges.",
    severity: "Medium", 
    source: "192.168.1.78", 
    sourceType: "network",
    status: "Open",
    assignee: "Unassigned",
    mitreTactic: "Persistence",
    mitreId: "T1053.005"
  },
  { 
    id: "ALT-2026-0839",
    time: "13:55:32", 
    date: "Jan 21, 2026",
    name: "Credential Dumping Detected", 
    description: "LSASS memory access detected from non-standard process. Possible credential harvesting attempt.",
    severity: "Critical", 
    source: "WKS-PC-0089", 
    sourceType: "endpoint",
    status: "Investigating",
    assignee: "Sarah M.",
    mitreTactic: "Credential Access",
    mitreId: "T1003.001"
  },
  { 
    id: "ALT-2026-0838",
    time: "13:42:17", 
    date: "Jan 21, 2026",
    name: "Unusual Process Parent", 
    description: "cmd.exe spawned from Microsoft Word process. Potential macro-based malware execution.",
    severity: "High", 
    source: "WKS-PC-0156", 
    sourceType: "endpoint",
    status: "Open",
    assignee: "Unassigned",
    mitreTactic: "Execution",
    mitreId: "T1204.002"
  },
];

const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case "Critical":
      return "bg-destructive/20 text-destructive border-destructive/30";
    case "High":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "Medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Low":
      return "bg-primary/20 text-primary border-primary/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "Investigating":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "Resolved":
      return "bg-secondary/10 text-secondary border-secondary/20";
    case "Closed":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getSourceIcon = (sourceType: string) => {
  switch (sourceType) {
    case "endpoint":
      return Monitor;
    case "network":
      return Globe;
    case "user":
      return User;
    case "server":
      return Shield;
    default:
      return Monitor;
  }
};

const Alerts = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlerts = alertsData.filter(alert => {
    const matchesSeverity = selectedSeverity === "all" || alert.severity === selectedSeverity;
    const matchesStatus = selectedStatus === "all" || alert.status === selectedStatus;
    const matchesSearch = alert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const alertCounts = {
    critical: alertsData.filter(a => a.severity === "Critical").length,
    high: alertsData.filter(a => a.severity === "High").length,
    medium: alertsData.filter(a => a.severity === "Medium").length,
    low: alertsData.filter(a => a.severity === "Low").length,
    open: alertsData.filter(a => a.status === "Open").length,
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 pt-20 overflow-hidden">
        <SOCSidebar activeItem="Alerts" />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-card/25 backdrop-blur-lg border-b border-white/[0.08] px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Security Alerts</h1>
              <p className="text-sm text-muted-foreground">Monitor and investigate security events</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search alerts..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background/50 border border-white/[0.08] rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 w-64 transition-colors backdrop-blur-sm" 
                />
              </div>
              
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
              
              <button className="w-8 h-8 bg-primary/10 border border-primary/25 rounded-full flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                <User className="w-4 h-4" />
              </button>
            </div>
          </header>
          
          {/* Content */}
          <div className="flex-1 p-6 overflow-auto">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="relative overflow-hidden rounded-xl bg-card/25 backdrop-blur-lg border border-white/[0.08] p-4 shadow-lg shadow-black/20 hover:bg-card/35 hover:border-white/[0.12] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Open</span>
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <p className="text-2xl font-bold text-destructive mt-1">{alertCounts.open}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl bg-card/25 backdrop-blur-lg border border-white/[0.08] p-4 shadow-lg shadow-black/20 hover:bg-card/35 hover:border-white/[0.12] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Critical</span>
                  <div className="w-2 h-2 bg-destructive rounded-full" />
                </div>
                <p className="text-2xl font-bold text-foreground mt-1">{alertCounts.critical}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl bg-card/25 backdrop-blur-lg border border-white/[0.08] p-4 shadow-lg shadow-black/20 hover:bg-card/35 hover:border-white/[0.12] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">High</span>
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                </div>
                <p className="text-2xl font-bold text-foreground mt-1">{alertCounts.high}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl bg-card/25 backdrop-blur-lg border border-white/[0.08] p-4 shadow-lg shadow-black/20 hover:bg-card/35 hover:border-white/[0.12] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Medium</span>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                </div>
                <p className="text-2xl font-bold text-foreground mt-1">{alertCounts.medium}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl bg-card/25 backdrop-blur-lg border border-white/[0.08] p-4 shadow-lg shadow-black/20 hover:bg-card/35 hover:border-white/[0.12] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Low</span>
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <p className="text-2xl font-bold text-foreground mt-1">{alertCounts.low}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filters:</span>
              </div>
              
              <div className="relative">
                <select 
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="appearance-none bg-card/25 backdrop-blur-sm border border-white/[0.08] rounded-lg px-3 py-1.5 pr-8 text-sm text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                  <option value="all">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              <div className="relative">
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-card/25 backdrop-blur-sm border border-white/[0.08] rounded-lg px-3 py-1.5 pr-8 text-sm text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              <span className="text-sm text-muted-foreground ml-auto">
                Showing {filteredAlerts.length} of {alertsData.length} alerts
              </span>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              {filteredAlerts.map((alert) => {
                const SourceIcon = getSourceIcon(alert.sourceType);
                return (
                  <div 
                    key={alert.id}
                    className="relative overflow-hidden rounded-xl bg-card/25 backdrop-blur-lg border border-white/[0.08] p-4 shadow-lg shadow-black/20 hover:bg-card/35 hover:border-white/[0.12] transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Severity Indicator */}
                      <div className={cn(
                        "w-1 h-full min-h-[80px] rounded-full shrink-0",
                        alert.severity === "Critical" && "bg-destructive",
                        alert.severity === "High" && "bg-orange-500",
                        alert.severity === "Medium" && "bg-yellow-500",
                        alert.severity === "Low" && "bg-primary",
                      )} />
                      
                      {/* Alert Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-muted-foreground">{alert.id}</span>
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded border",
                                getSeverityStyles(alert.severity)
                              )}>
                                {alert.severity}
                              </span>
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded border",
                                getStatusStyles(alert.status)
                              )}>
                                {alert.status}
                              </span>
                            </div>
                            <h3 className="text-foreground font-medium group-hover:text-primary transition-colors">
                              {alert.name}
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-muted-foreground hover:text-secondary hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100">
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {alert.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{alert.date} at {alert.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <SourceIcon className="w-3.5 h-3.5" />
                            <span className="font-mono">{alert.source}</span>
                          </div>
                          {alert.mitreId && (
                            <div className="flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5" />
                              <span>{alert.mitreTactic} ({alert.mitreId})</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>{alert.assignee}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredAlerts.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-muted mx-auto mb-4" />
                <h3 className="text-foreground font-medium mb-1">No alerts found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Alerts;
