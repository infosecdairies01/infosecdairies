#!/usr/bin/env node
// Wraps `vite` so that a plain `npm run dev` also starts/stops the local
// Wazuh SIEM stack alongside the frontend dev server. See
// docs/superpowers/specs/2026-07-18-wazuh-dev-lifecycle-coupling-design.md.
//
// Wazuh starts in the background (non-blocking — Vite starts immediately,
// doesn't wait on Wazuh's ~20-90s boot time) and is stopped when this dev
// session ends, via Ctrl+C or Vite exiting on its own. A failure to start
// Wazuh (e.g. WSL not running) is logged as a warning only — it never
// blocks or crashes the frontend dev session.
//
// Known limitation: abruptly closing the whole terminal window (not
// Ctrl+C) can let Windows kill this process tree without running the
// cleanup below, leaving Wazuh running. `npm run wazuh:stop` cleans that
// up manually; the next `npm run dev` starting Wazuh again is a harmless
// no-op if it's already up.
import { spawn } from "node:child_process";
import { start as startWazuh, stop as stopWazuh } from "./wazuh.mjs";

// Wazuh's manager container has been observed taking longer than a naive
// 15s to stop cleanly (it manages several internal daemons) — 45s gives
// it realistic room while still guaranteeing Ctrl+C can't hang forever.
const STOP_TIMEOUT_MS = 45000;

console.log("Starting Wazuh in the background...");
startWazuh().catch((err) => {
  console.warn(`Wazuh did not start cleanly (continuing without it): ${err.message}`);
});

const vite = spawn("npx", ["vite"], { stdio: "inherit", shell: true });

let stopping = false;
async function stopWazuhAndExit(code) {
  if (stopping) return;
  stopping = true;
  console.log("\nStopping Wazuh...");
  try {
    await stopWazuh({ timeoutMs: STOP_TIMEOUT_MS });
  } catch (err) {
    console.warn(`Could not cleanly stop Wazuh: ${err.message}`);
  }
  process.exit(code);
}

process.on("SIGINT", () => {
  vite.kill("SIGINT");
  stopWazuhAndExit(130);
});
process.on("SIGTERM", () => {
  vite.kill("SIGTERM");
  stopWazuhAndExit(143);
});
vite.on("exit", (code) => stopWazuhAndExit(code ?? 0));
