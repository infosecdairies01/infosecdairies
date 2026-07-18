import Navbar from "@/components/Navbar";
import SOCSidebar from "@/components/soc/SOCSidebar";
import { Button } from "@/components/ui/button";
import { Bell, User, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

const WAZUH_DASHBOARD_URL = import.meta.env.VITE_WAZUH_DASHBOARD_URL || "https://localhost";
const WAZUH_DASHBOARD_USER = import.meta.env.VITE_WAZUH_DASHBOARD_USER;
const WAZUH_DASHBOARD_PASSWORD = import.meta.env.VITE_WAZUH_DASHBOARD_PASSWORD;

// These are real Wazuh SIEM login credentials, so they must never reach a
// production JS bundle. import.meta.env.DEV is hardcoded to false by Vite
// for every `vite build`, so this can't be bypassed by env misconfiguration.
// Mirrors the same defense-in-depth pattern as src/lib/testingMode.ts.
const SHOW_CREDENTIALS = import.meta.env.DEV && Boolean(WAZUH_DASHBOARD_USER) && Boolean(WAZUH_DASHBOARD_PASSWORD);

if (import.meta.env.PROD && (WAZUH_DASHBOARD_USER || WAZUH_DASHBOARD_PASSWORD)) {
  throw new Error(
    "VITE_WAZUH_DASHBOARD_USER/VITE_WAZUH_DASHBOARD_PASSWORD must never be set in a production build. " +
      "Remove them from the deployment environment's variables."
  );
}

type CopiedField = "user" | "password" | null;

const LabsLogs = () => {
  const [copiedField, setCopiedField] = useState<CopiedField>(null);

  const copyToClipboard = (field: "user" | "password", value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SOCSidebar activeItem="Logs" />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-card/25 backdrop-blur-lg border-b border-white/[0.08] px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Log Explorer</h1>
              <p className="text-sm text-muted-foreground">
                Investigate real security logs in the Wazuh SIEM dashboard
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/[0.04]">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
              <button className="w-8 h-8 bg-primary/10 border border-primary/25 rounded-full flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                <User className="w-4 h-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 p-6 overflow-auto flex items-center justify-center">
            <div className="w-full max-w-md rounded-xl bg-card/25 backdrop-blur-lg border border-white/[0.08] p-8 text-center space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Investigate Logs in Wazuh</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Log analysis happens in the real Wazuh SIEM. Use the credentials below to sign in.
                </p>
              </div>

              {SHOW_CREDENTIALS ? (
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between bg-background/50 border border-white/[0.08] rounded-lg px-3 py-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Username</p>
                      <p className="text-sm font-mono text-foreground">{WAZUH_DASHBOARD_USER}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard("user", WAZUH_DASHBOARD_USER as string)}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-white/[0.04]"
                      title="Copy username"
                    >
                      {copiedField === "user" ? (
                        <Check className="w-3.5 h-3.5 text-secondary" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-background/50 border border-white/[0.08] rounded-lg px-3 py-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Password</p>
                      <p className="text-sm font-mono text-foreground">{WAZUH_DASHBOARD_PASSWORD}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard("password", WAZUH_DASHBOARD_PASSWORD as string)}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-white/[0.04]"
                      title="Copy password"
                    >
                      {copiedField === "password" ? (
                        <Check className="w-3.5 h-3.5 text-secondary" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground bg-background/50 border border-white/[0.08] rounded-lg px-3 py-2">
                  Ask your instructor for dashboard sign-in credentials.
                </p>
              )}

              <Button asChild className="w-full gap-2">
                <a href={WAZUH_DASHBOARD_URL} target="_blank" rel="noopener noreferrer">
                  Open Wazuh Dashboard
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LabsLogs;
