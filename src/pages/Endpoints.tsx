import Navbar from "@/components/Navbar";
import SOCSidebar from "@/components/soc/SOCSidebar";
import { Bell, User, Monitor, Shield, Wifi, WifiOff, AlertTriangle, Clock, Cpu, HardDrive, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

interface Endpoint {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  osVersion: string;
  status: "Online" | "Offline" | "Isolated";
  lastSeen: string;
  user: string;
  department: string;
  edrStatus: "Active" | "Outdated" | "Disabled";
  cpu: number;
  memory: number;
  disk: number;
  alerts: number;
}

const endpointsData: Endpoint[] = [
  { id: "EP-001", hostname: "WKS-PC-0127", ip: "192.168.1.10", os: "Windows", osVersion: "11 Pro 23H2", status: "Online", lastSeen: "Just now", user: "Aaron", department: "SOC Analyst", edrStatus: "Active", cpu: 78, memory: 85, disk: 62, alerts: 5 },
  { id: "EP-002", hostname: "WKS-PC-0042", ip: "192.168.1.11", os: "Windows", osVersion: "11 Pro 23H2", status: "Online", lastSeen: "2m ago", user: "Benjamin", department: "SOC Analyst", edrStatus: "Active", cpu: 45, memory: 52, disk: 38, alerts: 0 },
  { id: "EP-003", hostname: "SRV-DB-01", ip: "192.168.1.12", os: "Linux", osVersion: "Ubuntu 22.04 LTS", status: "Online", lastSeen: "1m ago", user: "Daniel", department: "Pentester", edrStatus: "Active", cpu: 92, memory: 88, disk: 75, alerts: 2 },
  { id: "EP-004", hostname: "WKS-MKT-015", ip: "192.168.1.13", os: "macOS", osVersion: "Sonoma 14.3", status: "Offline", lastSeen: "3h ago", user: "Elon", department: "Network Engineer", edrStatus: "Outdated", cpu: 0, memory: 0, disk: 91, alerts: 2 },
  { id: "EP-005", hostname: "SRV-DEV-02", ip: "192.168.1.14", os: "Linux", osVersion: "CentOS 8 Stream", status: "Isolated", lastSeen: "1h ago", user: "Elisha", department: "Developer", edrStatus: "Active", cpu: 34, memory: 67, disk: 55, alerts: 8 },
  { id: "EP-006", hostname: "WKS-WKT-008", ip: "192.168.1.15", os: "Windows", osVersion: "10 Pro 22H2", status: "Online", lastSeen: "5m ago", user: "Gabriel", department: "IT Support Engineer", edrStatus: "Active", cpu: 22, memory: 41, disk: 29, alerts: 0 },
  { id: "EP-007", hostname: "WKS-EXC-001", ip: "192.168.1.16", os: "Windows", osVersion: "11 Enterprise", status: "Online", lastSeen: "Just now", user: "James", department: "Developer", edrStatus: "Active", cpu: 15, memory: 35, disk: 42, alerts: 0 },
  { id: "EP-008", hostname: "SRV-WEB-01", ip: "192.168.1.17", os: "Linux", osVersion: "Debian 12", status: "Online", lastSeen: "30s ago", user: "John Joel", department: "Technical Specialist", edrStatus: "Active", cpu: 55, memory: 62, disk: 48, alerts: 1 },
  { id: "EP-009", hostname: "SRV-WEB-02", ip: "192.168.1.18", os: "Linux", osVersion: "Debian 12", status: "Online", lastSeen: "1m ago", user: "Kane Lazarus", department: "IT Administrator", edrStatus: "Active", cpu: 48, memory: 55, disk: 41, alerts: 0 },
  { id: "EP-010", hostname: "WKS-MKT-05", ip: "192.168.1.19", os: "macOS", osVersion: "Sonoma 14.3", status: "Offline", lastSeen: "3h ago", user: "Enosh", department: "Network Engineer", edrStatus: "Outdated", cpu: 15, memory: 0, disk: 91, alerts: 3 },
  { id: "EP-011", hostname: "WKS-MKT-08", ip: "192.168.1.20", os: "macOS", osVersion: "Sonoma 14.3", status: "Offline", lastSeen: "3h ago", user: "Caroline", department: "Network Engineer", edrStatus: "Outdated", cpu: 34, memory: 0, disk: 91, alerts: 1 },
  { id: "EP-012", hostname: "SRV-DEV-07", ip: "192.168.1.21", os: "Linux", osVersion: "Debian 12", status: "Online", lastSeen: "30s ago", user: "Kenny", department: "CISO", edrStatus: "Active", cpu: 55, memory: 62, disk: 48, alerts: 0 },
];

const PAGE_SIZE = 6;

// Toned-down gradient bar: lower glow opacity + smaller blur radius than before
const GRADIENT_BAR =
  "bg-gradient-to-b from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] shadow-[0_0_4px_hsl(var(--glow-cyan)/0.2)]";
const MUTED_BAR = "bg-muted-foreground/30";

const getStatusColor = (status: Endpoint["status"]) => {
  return status === "Offline" ? "text-muted-foreground" : "text-primary";
};

const getEdrStyles = (status: Endpoint["edrStatus"]) => {
  return status === "Active" ? "text-primary" : "text-muted-foreground";
};

const Endpoints = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Endpoint["status"]>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return endpointsData.filter((ep) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        ep.hostname.toLowerCase().includes(q) ||
        ep.ip.includes(searchQuery) ||
        ep.user.toLowerCase().includes(q);
      const matchesStatus = filterStatus === "all" || ep.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const counts = {
    online: endpointsData.filter((e) => e.status === "Online").length,
    offline: endpointsData.filter((e) => e.status === "Offline").length,
    isolated: endpointsData.filter((e) => e.status === "Isolated").length,
  };
  const total = endpointsData.length;
  const pct = (n: number) => `${Math.round((n / total) * 100)}% of total`;

  const statCards = [
    { label: "Total Endpoints", count: total, description: "Across all departments", bar: GRADIENT_BAR, color: "text-foreground", icon: null },
    { label: "Online", count: counts.online, description: pct(counts.online), bar: GRADIENT_BAR, color: "text-primary", icon: null },
    { label: "Offline", count: counts.offline, description: pct(counts.offline), bar: MUTED_BAR, color: "text-muted-foreground", icon: WifiOff },
    { label: "Isolated", count: counts.isolated, description: pct(counts.isolated), bar: GRADIENT_BAR, color: "text-primary", icon: null },
  ];

  const tabs: { key: "all" | Endpoint["status"]; label: string }[] = [
    { key: "all", label: "All Endpoints" },
    { key: "Online", label: "Online" },
    { key: "Offline", label: "Offline" },
    { key: "Isolated", label: "Isolated" },
  ];

  const handleFilterChange = (key: "all" | Endpoint["status"]) => {
    setFilterStatus(key);
    setPage(1);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SOCSidebar activeItem="Endpoints" />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-card/70 backdrop-blur-lg border-b border-border px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Endpoint Inventory</h1>
              <p className="text-sm text-muted-foreground">Monitor and manage all registered endpoints</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search endpoints..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="bg-background/50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-ring w-64 transition-colors backdrop-blur-sm"
                />
              </div>
              <button className="w-8 h-8 bg-primary/10 border border-primary/25 rounded-full flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                <User className="w-4 h-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((s) => (
                  <div
                    key={s.label}
                    className="relative overflow-hidden rounded-xl bg-card/85 backdrop-blur-lg border border-border p-4 pl-6 shadow-lg shadow-black/20"
                  >
                    <span className={cn("absolute left-0 top-0 bottom-0 w-[3px]", s.bar)} />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</p>
                      {s.icon && <s.icon className={cn("w-4 h-4", s.color)} />}
                    </div>
                    <span className={cn("text-2xl font-bold block mt-1", s.color)}>{s.count}</span>
                    <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="flex items-center gap-6 border-b border-border">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => handleFilterChange(t.key)}
                    className={cn(
                      "pb-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                      filterStatus === t.key
                        ? "text-primary border-primary"
                        : "text-muted-foreground border-transparent hover:text-foreground"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Endpoint Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map((ep) => {
                  const statusInfo = getStatusIcon(ep.status);
                  return (
                    <div key={ep.id} className="group relative overflow-hidden rounded-xl bg-card/25 backdrop-blur-lg border border-white/[0.08] p-5 shadow-lg shadow-black/20 hover:bg-card/35 hover:border-white/[0.12] transition-all duration-300 cursor-pointer">
                      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", statusInfo.bg)}>
                            <Monitor className={cn("w-4 h-4", statusInfo.color)} />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{ep.hostname}</h3>
                            <span className="text-xs font-mono text-muted-foreground">{ep.ip}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", getRiskStyles(ep.risk))}>{ep.risk}</span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">OS:</span>
                          <span className="text-foreground">{ep.os} {ep.osVersion}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">User:</span>
                          <span className="text-foreground">{ep.user}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Dept:</span>
                          <span className="text-foreground">{ep.department}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">EDR:</span>
                          <span className={getEdrStyles(ep.edrStatus)}>{ep.edrStatus}</span>
                        </div>
                      </div>

                      {ep.status === "Online" && (
                        <div className="space-y-1.5 mb-3">
                          {[
                            { label: "CPU", value: ep.cpu },
                            { label: "MEM", value: ep.memory },
                            { label: "DISK", value: ep.disk },
                          ].map((r) => (
                            <div key={r.label} className="flex items-center gap-2">
                              <span className="text-[9px] text-muted-foreground/60 w-7">{r.label}</span>
                              <div className="flex-1 h-1 bg-muted/20 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full transition-all", getBarColor(r.value))} style={{ width: `${r.value}%` }} />
                              </div>
                              <span className="text-[9px] text-muted-foreground/60 w-7 text-right">{r.value}%</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <statusInfo.icon className={cn("w-3 h-3", statusInfo.color)} />
                          <span>{ep.status}</span>
                          <span className="mx-1">·</span>
                          <Clock className="w-3 h-3" />
                          <span>{ep.lastSeen}</span>
                        </div>
                        {ep.openAlerts > 0 && (
                          <span className="flex items-center gap-1 text-destructive">
                            <AlertTriangle className="w-3 h-3" />{ep.openAlerts} alerts
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="w-[170px] shrink-0">
                      <p className="text-sm text-foreground">{ep.os} {ep.osVersion}</p>
                      <p className="text-[11px] text-muted-foreground">OS</p>
                    </div>

                    <div className="w-[150px] shrink-0">
                      <p className="text-sm text-foreground">{ep.department}</p>
                      <p className="text-[11px] text-muted-foreground">Department</p>
                    </div>

                    <div className="w-[110px] shrink-0">
                      <p className="text-sm text-foreground">{ep.user}</p>
                      <p className="text-[11px] text-muted-foreground">User</p>
                    </div>

                    <div className="w-[100px] shrink-0">
                      <p className={cn("text-sm font-medium", getEdrStyles(ep.edrStatus))}>{ep.edrStatus}</p>
                      <p className="text-[11px] text-muted-foreground">EDR Status</p>
                    </div>

                    <div className="w-[100px] shrink-0">
                      <p className="text-sm text-foreground">{ep.lastSeen}</p>
                      <p className="text-[11px] text-muted-foreground">Last Seen</p>
                    </div>

                    <div className="w-[90px] shrink-0">
                      <span className={cn("text-xs font-medium", getStatusColor(ep.status))}>{ep.status}</span>
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                      <span className={cn("text-sm font-medium", ep.alerts > 0 ? "text-primary" : "text-muted-foreground")}>
                        {ep.alerts} Alert{ep.alerts === 1 ? "" : "s"}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {filtered.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Showing {startIdx + 1} to {Math.min(startIdx + PAGE_SIZE, filtered.length)} of {filtered.length} endpoints
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-white/[0.04] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {pageNumbers.map((n) => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                          n === currentPage
                            ? "bg-primary text-primary-foreground"
                            : "border border-border text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                        )}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-white/[0.04] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Endpoints;