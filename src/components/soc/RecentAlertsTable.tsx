import { cn } from "@/lib/utils";

const alerts = [
  { time: "14:32:18", name: "Suspicious PowerShell Execution", severity: "Critical", source: "WKS-PC-0127", status: "Open", mitre: "T1059.001" },
  { time: "14:28:45", name: "Failed Login Attempt (5x)", severity: "High", source: "192.168.1.105", status: "Investigating", mitre: "T1110" },
  { time: "14:25:12", name: "Unusual Outbound Traffic", severity: "High", source: "10.0.0.42", status: "Open", mitre: "T1041" },
  { time: "14:22:33", name: "New Service Installed", severity: "Medium", source: "SRV-DB-01", status: "Resolved", mitre: "T1543.003" },
  { time: "14:18:56", name: "Port Scan Detected", severity: "Medium", source: "172.16.0.88", status: "Open", mitre: "T1046" },
  { time: "14:15:21", name: "USB Device Connected", severity: "Low", source: "WKS-PC-0042", status: "Resolved", mitre: "T1091" },
  { time: "14:12:09", name: "DNS Query to Suspicious Domain", severity: "High", source: "admin_user", status: "Investigating", mitre: "T1071.004" },
  { time: "14:08:44", name: "Scheduled Task Created", severity: "Medium", source: "192.168.1.78", status: "Open", mitre: "T1053.005" },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Open": return "text-destructive bg-destructive/10 border-destructive/20";
    case "Investigating": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    case "Resolved": return "text-secondary bg-secondary/10 border-secondary/20";
    default: return "text-muted-foreground bg-muted border-border";
  }
};

const RecentAlertsTable = () => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-card/25 backdrop-blur-lg border border-white/[0.08] shadow-lg shadow-black/20 transition-all duration-300">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/[0.02] via-transparent to-secondary/[0.01] pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary to-secondary opacity-50" />

      <div className="relative">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recent Alerts</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Latest security events requiring attention</p>
          </div>
          <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-full bg-muted/20 border border-white/[0.06]">
            {alerts.length} alerts
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Time</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Alert</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Severity</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Source</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">MITRE</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, index) => {
                return (
                  <tr
                    key={index}
                    className="border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3.5 text-xs text-muted-foreground font-medium">{alert.time}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{alert.name}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-white font-medium">{alert.severity}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-muted-foreground font-medium">{alert.source}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-white font-medium">{alert.mitre}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-white font-medium">
                        {alert.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentAlertsTable;
