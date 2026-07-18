#!/usr/bin/env node
// Starts/stops/checks the local Wazuh SIEM stack (manager + indexer +
// dashboard), which runs as Docker containers inside the Ubuntu-22.04 WSL2
// distro under its own native Docker Engine — a separate installation from
// Docker Desktop for Windows, whose engine cannot see these containers.
// See docs/superpowers/specs/2026-07-18-wazuh-local-access-design.md.
import { spawnSync } from "node:child_process";
import net from "node:net";

const WSL_DISTRO = "Ubuntu-22.04";
const COMPOSE_DIR = "~/wazuh-docker/single-node";
const DASHBOARD_URL = "https://localhost";
const DASHBOARD_HOST = "localhost";
const DASHBOARD_PORT = 443;
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 90000;

function checkWslAvailable() {
  const result = spawnSync("wsl.exe", ["-l", "-q"], { encoding: "utf-8" });
  if (result.error) {
    console.error(
      "Could not run wsl.exe. Is WSL installed? See https://learn.microsoft.com/windows/wsl/install"
    );
    process.exit(1);
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
    process.exit(1);
  }
}

function runComposeInWsl(composeArgs) {
  const command = `cd ${COMPOSE_DIR} && docker compose ${composeArgs}`;
  return spawnSync("wsl.exe", ["-d", WSL_DISTRO, "--", "bash", "-lc", command], {
    stdio: "inherit",
  });
}

function checkDashboardReachable() {
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

async function waitForDashboard() {
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

async function start() {
  checkWslAvailable();
  console.log(`Starting Wazuh containers in WSL distro "${WSL_DISTRO}"...`);
  const result = runComposeInWsl("start");
  if (result.status !== 0) {
    console.error(
      `docker compose start failed inside WSL (exit ${result.status}). Is Docker Engine running there?\n` +
        `Try: wsl -d ${WSL_DISTRO} -- sudo service docker start`
    );
    process.exit(result.status || 1);
  }
  await waitForDashboard();
}

function stop() {
  checkWslAvailable();
  console.log(`Stopping Wazuh containers in WSL distro "${WSL_DISTRO}"...`);
  const result = runComposeInWsl("stop");
  if (result.status !== 0) {
    console.error(`docker compose stop failed inside WSL (exit ${result.status}).`);
    process.exit(result.status || 1);
  }
  console.log("Wazuh containers stopped.");
}

async function status() {
  checkWslAvailable();
  console.log(`Wazuh container status (WSL distro "${WSL_DISTRO}"):`);
  runComposeInWsl("ps");
  const reachable = await checkDashboardReachable();
  console.log(
    reachable
      ? `Dashboard reachable at ${DASHBOARD_URL}`
      : `Dashboard NOT reachable at ${DASHBOARD_URL}`
  );
}

const action = process.argv[2];
if (action === "start") {
  await start();
} else if (action === "stop") {
  stop();
} else if (action === "status") {
  await status();
} else {
  console.error("Usage: node scripts/wazuh.mjs <start|stop|status>");
  process.exit(1);
}
