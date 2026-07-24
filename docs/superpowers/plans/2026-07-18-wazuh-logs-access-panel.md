# Wazuh Logs Access Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fully-fake log table in `src/pages/LabsLogs.tsx` with a simple access panel that links out to the real local Wazuh dashboard, with credentials shown so the user can sign in there directly.

**Architecture:** `LabsLogs.tsx` keeps its existing `Navbar` + `SOCSidebar` + header chrome, but everything below the header — stat cards, filters, log table — is deleted and replaced with a single centered panel. The panel reads the dashboard URL/username/password from Vite env vars (matching the existing `VITE_API_BASE_URL` convention in `src/services/api.ts`), displays them with copy-to-clipboard buttons, and links to the dashboard via a plain `<a target="_blank">` — no new backend endpoint, no data fetching.

**Tech Stack:** React 18 + TypeScript (existing), Tailwind CSS (existing utility classes, matching the page's current glassmorphism style — `bg-card/25 backdrop-blur-lg border border-white/[0.08]`), `lucide-react` icons (already a dependency), `src/components/ui/button.tsx` (shadcn Button, already in the project).

## Global Constraints

- Do not touch any other SOC Labs page or component: `src/pages/Labs.tsx`, `src/components/soc/SOCSidebar.tsx`, `src/components/soc/LabsComingSoon.tsx` stay exactly as they are.
- No shield icon in the panel (explicitly excluded per user feedback during design).
- No backend changes, no new API calls, no new npm dependencies.
- This repo has **no automated test runner** (per `CLAUDE.md`). Verification for this plan is: TypeScript/ESLint must pass clean on the changed file, and a dev-server manual check.
- Env var names and defaults, exactly as approved in the design doc (`docs/superpowers/specs/2026-07-18-wazuh-local-access-design.md` §4):
  - `VITE_WAZUH_DASHBOARD_URL` — default `https://localhost`
  - `VITE_WAZUH_DASHBOARD_USER` — default `admin`
  - `VITE_WAZUH_DASHBOARD_PASSWORD` — default `SecretPassword`

---

### Task 1: Add Wazuh dashboard env vars to `.env`

**Files:**
- Modify: `.env` (project root)

**Interfaces:**
- Produces: three env vars consumed by Task 2's `LabsLogs.tsx` via `import.meta.env.VITE_WAZUH_DASHBOARD_URL`, `import.meta.env.VITE_WAZUH_DASHBOARD_USER`, `import.meta.env.VITE_WAZUH_DASHBOARD_PASSWORD`.

- [ ] **Step 1: Add the three variables**

The project root `.env` currently contains exactly:

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Change it to:

```
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_WAZUH_DASHBOARD_URL=https://localhost
VITE_WAZUH_DASHBOARD_USER=admin
VITE_WAZUH_DASHBOARD_PASSWORD=SecretPassword
```

- [ ] **Step 2: Commit**

`.env` is expected to already be tracked in this repo (it holds the existing `VITE_API_BASE_URL`), so this is a normal file modification:

```bash
git add .env
git commit -m "$(cat <<'EOF'
Add Wazuh dashboard env vars for the Logs section access panel

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

If `git status` shows `.env` is actually gitignored in this repo, skip committing it (note this in your summary) and instead create `.env.example` with the same three lines plus the existing `VITE_API_BASE_URL` line, and commit that file instead.

---

### Task 2: Rewrite `src/pages/LabsLogs.tsx`

**Files:**
- Modify: `src/pages/LabsLogs.tsx` (full rewrite of the file body)

**Interfaces:**
- Consumes: the three env vars from Task 1 (`VITE_WAZUH_DASHBOARD_URL`, `VITE_WAZUH_DASHBOARD_USER`, `VITE_WAZUH_DASHBOARD_PASSWORD`), `Button` from `@/components/ui/button`, `cn` from `@/lib/utils`, `Navbar` from `@/components/Navbar`, `SOCSidebar` from `@/components/soc/SOCSidebar`.
- Produces: the default-exported `LabsLogs` component, routed at `/labs/logs` in `src/App.tsx` (route already exists, unchanged).

- [ ] **Step 1: Replace the full contents of `src/pages/LabsLogs.tsx`**

```tsx
import Navbar from "@/components/Navbar";
import SOCSidebar from "@/components/soc/SOCSidebar";
import { Button } from "@/components/ui/button";
import { Bell, User, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

const WAZUH_DASHBOARD_URL = import.meta.env.VITE_WAZUH_DASHBOARD_URL || "https://localhost";
const WAZUH_DASHBOARD_USER = import.meta.env.VITE_WAZUH_DASHBOARD_USER || "admin";
const WAZUH_DASHBOARD_PASSWORD = import.meta.env.VITE_WAZUH_DASHBOARD_PASSWORD || "SecretPassword";

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

              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between bg-background/50 border border-white/[0.08] rounded-lg px-3 py-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Username</p>
                    <p className="text-sm font-mono text-foreground">{WAZUH_DASHBOARD_USER}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard("user", WAZUH_DASHBOARD_USER)}
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
                    onClick={() => copyToClipboard("password", WAZUH_DASHBOARD_PASSWORD)}
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
```

- [ ] **Step 2: Type-check the change**

```bash
npx tsc --noEmit
```

Expected: no errors referencing `LabsLogs.tsx`. (Pre-existing unrelated errors elsewhere in the repo, if any, are not this task's concern — only confirm nothing new points at this file.)

- [ ] **Step 3: Lint the change**

```bash
npx eslint src/pages/LabsLogs.tsx
```

Expected: no output (clean pass). If it reports the `react-hooks/exhaustive-deps` or unused-import rules, fix by removing the unused import/variable it names — every import in the Step 1 code block above is used, so a clean pass is expected as written.

- [ ] **Step 4: Manual dev-server check**

Start the dev server if it isn't already running (`npm run dev`), then in a browser (or via `curl -s http://localhost:8081/labs/logs -o /dev/null -w '%{http_code}\n'` to at least confirm the SPA shell responds `200`) navigate to `/labs/logs`. Confirm:
- No fake stat cards, filters, or log table are visible.
- The panel shows "Investigate Logs in Wazuh", the username `admin` and password `SecretPassword` (or whatever `.env` was set to), each with a working copy button (click it, confirm the icon briefly changes to a checkmark).
- Clicking "Open Wazuh Dashboard" opens `https://localhost` in a **new tab** (verify the existing tab stays on `/labs/logs`).

- [ ] **Step 5: Commit**

```bash
git add src/pages/LabsLogs.tsx
git commit -m "$(cat <<'EOF'
Replace fake Logs section with a Wazuh dashboard access panel

The Logs section previously rendered a hardcoded 15-row fake log
table. Since log investigation now happens in the real local Wazuh
SIEM instead, this replaces it with a simple access panel: dashboard
credentials plus a link that opens the real Wazuh dashboard in a new
tab.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
