# Wazuh Local Access — Phase 0 Design

**Date:** 2026-07-18
**Status:** Approved by user. Supersedes the "Optional: Open in Wazuh" idea in `2026-07-16-wazuh-labs-integration-design.md` §3 point 8 for this phase — implemented now as a standalone feature, decoupled from the Case/CaseAttempt system (which remains a future phase, unstarted).

## 1. Problem Statement

Two gaps stand between "we have a Wazuh SIEM running locally" and "the project's Practice → Logs section actually uses it":

1. Wazuh currently only runs because the user manually opens WSL and runs `docker compose start` in `~/wazuh-docker/single-node`. It's not part of the project's own dev workflow.
2. `src/pages/LabsLogs.tsx` is a fully static mockup — a hardcoded 15-row fake log table with fake stat cards and filters. It has no connection to Wazuh at all.

This phase does **not** build the full guided-lab/scoring system from the 2026-07-16 design (Case/CaseQuestion/CaseAttempt, course-purchase gating, Django-proxied live log queries). It does **not** inject any synthetic log data into Wazuh. Both are explicitly deferred. This phase only:

- Makes Wazuh startable/stoppable as part of this project's local dev tooling (Task 1).
- Replaces the fake Logs section UI with a simple access point into the real Wazuh dashboard (Task 2).

## 2. Environment Facts (established via direct inspection this session)

- The user's Wazuh stack (`wazuh.manager-1`, `wazuh.indexer-1`, `wazuh.dashboard-1`, image versions 4.7.5) runs as Docker containers inside the **`Ubuntu-22.04` WSL2 distro**, using its own native Docker Engine — confirmed via `wsl -l -v` (distro is `Running`) and the user's own terminal transcript (`docker ps -a` executed inside that distro).
- This is a **separate Docker installation from Docker Desktop for Windows** — Docker Desktop's own backend distro (`docker-desktop`) was confirmed `Stopped`, and a plain `docker version` from Windows fails to connect. Windows-side `docker`/`docker compose` CLI cannot reach the Wazuh containers directly; the only reliable path is invoking commands inside the `Ubuntu-22.04` distro via `wsl.exe -d Ubuntu-22.04 -- ...`.
- The compose project lives at `~/wazuh-docker/single-node` inside that distro (contains `docker-compose.yml`, `config/`, `generate-indexer-certs.yml`).
- Container ports are published to the Windows host via WSL2's automatic `localhost` forwarding: dashboard on `443` (confirmed reachable at `https://localhost` from Windows, returning a `302` to `/app/login` with `osd-name: wazuh.dashboard` header), indexer on `9200`, manager on `1514-1515`/`55000`.
- No agents are currently connected to the Wazuh manager, so there is no real log/alert data yet — irrelevant to this phase since neither task touches log data.

## 3. Task 1 — Wazuh Lifecycle npm Scripts

**New file:** `scripts/wazuh.mjs` — a Node script (chosen for cross-platform consistency with the rest of this Vite/npm project) with three subcommands, each targeting the `Ubuntu-22.04` distro and `~/wazuh-docker/single-node` compose project:

- **`start`**
  1. Runs `wsl.exe -d Ubuntu-22.04 -- bash -lc "cd ~/wazuh-docker/single-node && docker compose start"`.
  2. Polls `https://localhost` every few seconds (TLS verification disabled, since the dashboard uses a self-signed cert), for up to ~90 seconds.
  3. Prints `Wazuh dashboard ready at https://localhost` on first successful response, or a timeout warning with a troubleshooting hint if it never comes up.
- **`stop`** — runs `docker compose stop` the same way (frees the RAM the indexer/manager use when not in use for labs work).
- **`status`** — runs `docker compose ps` inside the distro and performs the same one-shot reachability check against `https://localhost`, printing both.

**New `package.json` scripts:**
```json
"wazuh:start": "node scripts/wazuh.mjs start",
"wazuh:stop": "node scripts/wazuh.mjs stop",
"wazuh:status": "node scripts/wazuh.mjs status"
```

**Trigger model:** explicit, not automatic. These are run manually alongside the existing separate frontend (`npm run dev`) and backend (`python manage.py runserver`) startup steps — not wired into a `predev` hook or a combined concurrently-based script. This avoids adding WSL/Docker startup latency (and a new failure mode) to unrelated frontend-only dev sessions.

**Error handling:** friendly one-line messages (not raw stack traces) for the realistic failure cases — `wsl.exe` not found (WSL not installed), the `Ubuntu-22.04` distro not present/running, or the `docker compose` command itself failing inside WSL (e.g., Docker Engine not started) — each with a short remediation hint.

**Docs:** a new "Wazuh (local SOC labs)" section added to `CLAUDE.md`'s Commands block, documenting the three scripts alongside the existing frontend/backend command lists.

**Explicitly out of scope for Task 1:** no changes to the Wazuh containers, images, or compose config themselves; no migration to Docker Desktop; no changes to how the frontend or backend are started.

## 4. Task 2 — Logs Section Access Panel

`src/pages/LabsLogs.tsx` is rewritten to remove all fake data and replace it with a single access panel.

**Removed:** the `logsData` array and `LogEntry`/`levelConfig` types, the ERROR/WARN/INFO/DEBUG stat cards, the search/source-filter bar, and the log table (including row expansion behavior).

**Kept unchanged:** `Navbar`, `SOCSidebar` (with `activeItem="Logs"`), and the overall page chrome/header structure. No other SOC Labs page (`Labs.tsx`, sidebar items, `Dashboard`/`Alerts`/`Incidents`/etc.) is touched.

**Header copy:** title stays "Log Explorer"; subtitle changes from "Search and analyze raw security logs" to something like *"Investigate real security logs in the Wazuh SIEM dashboard"* (exact final wording decided at implementation time, low-stakes copy).

**New centered panel, replacing everything removed above:**
- Short explanatory copy: log analysis happens in the real Wazuh SIEM; use the credentials shown to sign in.
- Username and password, displayed in monospace, each with a small copy-to-clipboard button.
- A button labeled "Open Wazuh Dashboard" that opens the dashboard URL in a new tab (`target="_blank" rel="noopener noreferrer"`).
- No shield icon (explicitly excluded per user feedback) — icon-free or a non-shield icon if a small visual accent is wanted at implementation time.

**Configuration — new Vite env vars** (matching the existing `VITE_API_BASE_URL` convention in `src/services/api.ts`):
- `VITE_WAZUH_DASHBOARD_URL` — default `https://localhost`
- `VITE_WAZUH_DASHBOARD_USER` — default `admin`
- `VITE_WAZUH_DASHBOARD_PASSWORD` — default `SecretPassword`

These are the standard Wazuh docker-compose single-node defaults; the user has not yet confirmed whether their instance's actual credentials differ from these defaults, and will correct them if wrong.

**Explicitly out of scope for Task 2:** no Django backend endpoint, no real log data fetching, no auth/course-purchase gating on this page, no changes to any other SOC Labs page.

## 5. Explicitly Deferred (future phases, not started)

- Injecting synthetic/fake log data into Wazuh so there's something to see after logging in (separate future task, mentioned explicitly by the user as "later").
- Installing/connecting real Wazuh agents.
- The full Case/CaseQuestion/CaseAttempt system and course-purchase gating from the 2026-07-16 design doc.
- Scoped/read-only Wazuh accounts per student (currently: single shared admin credential shown to anyone who reaches the page).
