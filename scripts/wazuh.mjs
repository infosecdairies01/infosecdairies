#!/usr/bin/env node
// Starts/stops/checks the local Wazuh SIEM stack (manager + indexer +
// dashboard), which runs as Docker containers inside the Ubuntu-22.04 WSL2
// distro under its own native Docker Engine — a separate installation from
// Docker Desktop for Windows, whose engine cannot see these containers.
// See docs/superpowers/specs/2026-07-18-wazuh-local-access-design.md.
//
// start/stop/status are also imported by scripts/dev-with-wazuh.mjs (see
// docs/superpowers/specs/2026-07-18-wazuh-dev-lifecycle-coupling-design.md)
// to tie Wazuh's lifecycle to `npm run dev`. None of these functions call
// process.exit() themselves — only the CLI dispatch block at the bottom
// does — so they're safe to import and call from another long-running
// process without risking it being killed out from under it.
import { spawn, spawnSync } from "node:child_process";
import net from "node:net";
import { pathToFileURL } from "node:url";

const WSL_DISTRO = "Ubuntu-22.04";
const COMPOSE_DIR = "~/wazuh-docker/single-node";
const DASHBOARD_URL = "https://localhost";
const DASHBOARD_HOST = "localhost";
const DASHBOARD_PORT = 443;
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 90000;

export function checkWslAvailable() {
  const result = spawnSync("wsl.exe", ["-l", "-q"], { encoding: "utf-8" });
  if (result.error) {
    console.error(
      "Could not run wsl.exe. Is WSL installed? See https://learn.microsoft.com/windows/wsl/install"
    );
    return false;
  }
  const distros = (result.stdout || "")
    .replace(/\0/g, "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!distros.includes(WSL_DISTRO)) {
    console.error(
      `WSL distro "${WSL_DISTRO}" not found. Available distros: ${distros.join(", ") || "(none)"}`
    );
    return false;
  }
  return true;
}

// Runs `docker compose <composeArgs>` inside the WSL distro. Uses async
// spawn (not spawnSync) so an optional timeoutMs can actually preempt a
// hung/slow call — spawnSync blocks the event loop and can't be raced
// against a timer.
function runComposeInWsl(composeArgs, { timeoutMs } = {}) {
  const command = `cd ${COMPOSE_DIR} && docker compose ${composeArgs}`;
  return new Promise((resolve) => {
    const child = spawn("wsl.exe", ["-d", WSL_DISTRO, "--", "bash", "-lc", command], {
      stdio: "inherit",
    });
    let timedOut = false;
    let timer;
    if (timeoutMs) {
      timer = setTimeout(() => {
        timedOut = true;
        child.kill();
      }, timeoutMs);
    }
    child.on("exit", (code) => {
      if (timer) clearTimeout(timer);
      resolve({ status: code, timedOut });
    });
    child.on("error", () => {
      if (timer) clearTimeout(timer);
      resolve({ status: 1, timedOut });
    });
  });
}

export function checkDashboardReachable() {
  // Raw TCP connect only — no TLS handshake, so no certificate trust
  // decision is needed just to answer "is something listening on 443".
  return new Promise((resolve) => {
    const socket = net.createConnection({
      host: DASHBOARD_HOST,
      port: DASHBOARD_PORT,
      timeout: 3000,
    });
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("error", () => resolve(false));
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
  });
}

export async function waitForDashboard() {
  const start = Date.now();
  process.stdout.write("Waiting for Wazuh dashboard to become reachable");
  while (Date.now() - start < POLL_TIMEOUT_MS) {
    if (await checkDashboardReachable()) {
      console.log(`\nWazuh dashboard ready at ${DASHBOARD_URL}`);
      return true;
    }
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  console.log(
    `\nTimed out after ${POLL_TIMEOUT_MS / 1000}s waiting for ${DASHBOARD_URL}.\n` +
      `Check it manually: run \`wsl -d ${WSL_DISTRO}\` then \`cd ${COMPOSE_DIR} && docker compose ps\`.`
  );
  return false;
}

export async function start() {
  if (!checkWslAvailable()) return false;
  console.log(`Starting Wazuh containers in WSL distro "${WSL_DISTRO}"...`);
  const result = await runComposeInWsl("start");
  if (result.status !== 0) {
    console.error(
      `docker compose start failed inside WSL (exit ${result.status}). Is Docker Engine running there?\n` +
        `Try: wsl -d ${WSL_DISTRO} -- sudo service docker start`
    );
    return false;
  }
  return waitForDashboard();
}

export async function stop({ timeoutMs } = {}) {
  if (!checkWslAvailable()) return false;
  console.log(`Stopping Wazuh containers in WSL distro "${WSL_DISTRO}"...`);
  const result = await runComposeInWsl("stop", { timeoutMs });
  if (result.timedOut) {
    console.error(`docker compose stop timed out after ${timeoutMs}ms inside WSL.`);
    return false;
  }
  if (result.status !== 0) {
    console.error(`docker compose stop failed inside WSL (exit ${result.status}).`);
    return false;
  }
  console.log("Wazuh containers stopped.");
  return true;
}

export async function status() {
  if (!checkWslAvailable()) return false;
  console.log(`Wazuh container status (WSL distro "${WSL_DISTRO}"):`);
  await runComposeInWsl("ps");
  const reachable = await checkDashboardReachable();
  console.log(
    reachable
      ? `Dashboard reachable at ${DASHBOARD_URL}`
      : `Dashboard NOT reachable at ${DASHBOARD_URL}`
  );
  return reachable;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const action = process.argv[2];
  if (action === "start") {
    const ok = await start();
    process.exit(ok ? 0 : 1);
  } else if (action === "stop") {
    const ok = await stop();
    process.exit(ok ? 0 : 1);
  } else if (action === "status") {
    // Original behavior: "not reachable" is informative, not a CLI failure.
    await status();
  } else {
    console.error("Usage: node scripts/wazuh.mjs <start|stop|status>");
    process.exit(1);
  }
}
