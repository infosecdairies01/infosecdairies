# Wazuh Tied to `npm run dev` — Design

**Date:** 2026-07-18
**Status:** Approved by user. Follow-up to `2026-07-18-wazuh-local-access-design.md` — that spec's Task 1 gave Wazuh explicit, decoupled `npm run wazuh:start/stop/status` scripts (deliberately not hooked into `npm run dev`, to avoid slowing down unrelated frontend work). This spec reverses that specific decision after the user observed the real consequence: stopping Wazuh independently in WSL left the project with no way to notice or react, since nothing coupled the two lifecycles together.

## 1. Problem Statement

Wazuh currently runs as a fully independent thing in WSL. The `wazuh:*` npm scripts added previously can poke it (start/stop/check), but nothing ties its lifecycle to the project itself — a user can stop Wazuh out-of-band (as demonstrated: `ERR_CONNECTION_REFUSED` on `https://localhost` after a manual WSL-side stop) with zero project-side awareness or reaction.

The user wants: starting the project (specifically, `npm run dev`) starts Wazuh; stopping that same session stops Wazuh too. One coupled unit, not two independently-managed things.

## 2. Decisions

- **Scope: frontend only.** `npm run dev` owns Wazuh's lifecycle. The Django backend (`python manage.py runserver`) is untouched — separate terminal, separate lifecycle, exactly as today. Chosen over coupling both frontend and backend because that would require cross-process coordination (two separate programs, Node and Python, agreeing on when it's safe to stop a shared resource) for no clear benefit — rejected as unnecessary complexity for a problem the user didn't actually describe.
- **Startup ordering: non-blocking.** `npm run dev` starts Wazuh and Vite at the same time; it does not wait ~20-90s for Wazuh to become reachable before Vite starts. The Logs page's dashboard link simply might not be reachable for Wazuh's normal boot time after a fresh `npm run dev`.
- **Failure isolation:** if Wazuh fails to start (e.g., WSL not running), `npm run dev` prints a warning and continues — it never blocks or crashes the frontend dev session over Wazuh's state.
- **Stop trigger:** Ctrl+C (SIGINT) on the `npm run dev` terminal, or the underlying Vite process exiting on its own, triggers `docker compose stop` for Wazuh before the wrapper process itself exits.
- **Known limitation, accepted as-is:** abruptly closing the terminal window (not Ctrl+C) can let Windows kill the whole process tree without running Node's cleanup handlers, so Wazuh could be left running in that case. Mitigation is the existing `npm run wazuh:stop` (manual) plus the fact that the next `npm run dev` starting Wazuh again is a harmless no-op if it's already up.
- **No duplication:** the existing `npm run wazuh:start/stop/status` commands (from the prior spec) are kept as-is for manual control; the new coupling reuses the same WSL/`docker compose` logic rather than re-implementing it.

## 3. Architecture

- **Refactor `scripts/wazuh.mjs`:** its `checkWslAvailable`, `runComposeInWsl`, `checkDashboardReachable`, `start`, `stop`, `status` functions become named exports, importable by other scripts. Its existing CLI dispatch (`process.argv[2]` → start/stop/status) is preserved, guarded so it only runs when the file is executed directly (not when imported as a module) — standard `import.meta.url === file://${process.argv[1]}` check. Behavior of `npm run wazuh:start/stop/status` is unchanged.
- **New file `scripts/dev-with-wazuh.mjs`:**
  1. Calls the imported Wazuh `start()` function but does not `await` its dashboard-reachability polling loop — fires the WSL `docker compose start` call and logs a one-line "Starting Wazuh in the background..." message, then proceeds immediately regardless of outcome. Any failure here is caught and logged as a warning, never thrown/fatal.
  2. Spawns `vite` (via `node_modules/.bin/vite`, or `npx vite` for portability) as a child process with `stdio: "inherit"`, so the interactive dev server behaves identically to today (colored banner, HMR output, etc.) in the same terminal.
  3. Registers `process.on("SIGINT", ...)` and a handler for the child process's own `"exit"` event: either one triggers the imported Wazuh `stop()` function (`docker compose stop` in WSL), waited on with a bounded timeout (so a slow/hung WSL doesn't hang the terminal indefinitely on Ctrl+C), then exits with the same code Vite exited with (or 130 for SIGINT).
- **`package.json`:** `"dev"` changes from `"vite"` to `"node scripts/dev-with-wazuh.mjs"`. No other scripts change.

## 4. Explicitly Out of Scope

- Coupling the Django backend's startup/shutdown to Wazuh.
- Guaranteeing Wazuh stops on every possible way a terminal can be closed (only Ctrl+C / clean process exit is handled — abrupt window-kill is a documented, accepted limitation).
- Any change to `npm run build`, `npm run build:dev`, or `npm run preview` — these remain plain Vite commands, untouched.
