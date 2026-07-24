# Wazuh Lifecycle Scripts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `npm run wazuh:start` / `wazuh:stop` / `wazuh:status` scripts so the project's local Wazuh SIEM (running as Docker containers inside the `Ubuntu-22.04` WSL2 distro) can be managed from the project's own dev workflow, instead of the user manually opening a WSL shell every time.

**Architecture:** A single Node ESM script (`scripts/wazuh.mjs`) shells out to `wsl.exe -d Ubuntu-22.04 -- bash -lc "cd ~/wazuh-docker/single-node && docker compose <action>"` for each subcommand, and for `start`/`status` also does a reachability check against the dashboard port using a raw TCP connect (`node:net`) — not an HTTPS request — so the check never has to make a trust decision about the dashboard's self-signed certificate. No new dependencies.

**Tech Stack:** Node.js (ESM, `.mjs`, matching the existing `scripts/check-jwt-key-sync.mjs` convention), `node:child_process.spawnSync`, `node:net`. Runs on Windows with WSL2 installed and the `Ubuntu-22.04` distro present.

## Global Constraints

- Target distro name is exactly `Ubuntu-22.04` and the compose project path is exactly `~/wazuh-docker/single-node` — both confirmed via direct inspection this session (`wsl -l -v` output; user's terminal transcript). Do not parameterize or make these configurable — this is single-machine dev tooling, not a shared config surface.
- Dashboard reachability check targets `localhost:443` via a raw TCP connect, not an HTTPS request. Never disable TLS certificate verification (`rejectUnauthorized: false` or equivalent) anywhere in this script — a TCP-level check answers "is it listening" without needing to trust or bypass the dashboard's self-signed cert at all. `https://localhost` is still used as the human-facing URL in printed messages.
- This repo has **no automated test runner** (per `CLAUDE.md`: "No test runner is configured — there are no test files in this project."). Verification in this plan is manual: run the actual npm script against the real, currently-running Wazuh stack and confirm the printed output matches what's expected. Do not add a test framework as part of this work.
- Follow the existing script convention from `scripts/check-jwt-key-sync.mjs`: `#!/usr/bin/env node` shebang, plain ESM (`node:` prefixed built-in imports), `console.error` + `process.exit(1)` for failures, no external dependencies.
- Do not modify the Wazuh containers, images, or compose config themselves, and do not touch `npm run dev`, `vite.config.ts`, or the Django backend startup commands.

---

### Task 1: `scripts/wazuh.mjs` with start/stop/status subcommands

**Files:**
- Create: `scripts/wazuh.mjs`
- Modify: `package.json` (add three scripts to the `"scripts"` object)

**Interfaces:**
- Consumes: nothing from other tasks (this is the first and only code task).
- Produces: `node scripts/wazuh.mjs start|stop|status` — a CLI invoked via the new `npm run wazuh:start`, `npm run wazuh:stop`, `npm run wazuh:status` scripts. Task 2 (docs) references these three npm script names verbatim.

- [ ] **Step 1: Write `scripts/wazuh.mjs`**

```js
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
```

- [ ] **Step 2: Add the three npm scripts to `package.json`**

In `package.json`, the `"scripts"` object currently reads:

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview",
    "check:jwt-key": "node scripts/check-jwt-key-sync.mjs"
  },
```

Change it to:

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview",
    "check:jwt-key": "node scripts/check-jwt-key-sync.mjs",
    "wazuh:start": "node scripts/wazuh.mjs start",
    "wazuh:stop": "node scripts/wazuh.mjs stop",
    "wazuh:status": "node scripts/wazuh.mjs status"
  },
```

- [ ] **Step 3: Verify `wazuh:status` against the real running stack**

The Wazuh containers were confirmed running earlier this session. Run:

```bash
npm run wazuh:status
```

Expected output: a `docker compose ps` table showing `single-node-wazuh.dashboard-1`, `single-node-wazuh.manager-1`, `single-node-wazuh.indexer-1` all `Up`, followed by the line:
```
Dashboard reachable at https://localhost
```

- [ ] **Step 4: Verify `wazuh:stop` then `wazuh:start` round-trip**

Run:

```bash
npm run wazuh:stop
```

Expected: `docker compose stop` output showing the three containers stopping, then `Wazuh containers stopped.`

Then run:

```bash
npm run wazuh:start
```

Expected: `docker compose start` output showing the three containers starting, then a line of `.` progress dots (polling), then `Wazuh dashboard ready at https://localhost` within 90 seconds. If it prints the timeout message instead, check `npm run wazuh:status` and the container logs (`wsl -d Ubuntu-22.04 -- bash -lc "cd ~/wazuh-docker/single-node && docker compose logs --tail 50"`) before proceeding — do not move on with a stack that isn't actually reachable.

- [ ] **Step 5: Verify the "not found" error path**

Temporarily confirm the friendly-error behavior by pointing at a distro name that doesn't exist. Run:

```bash
node -e "
const { spawnSync } = require('node:child_process');
const r = spawnSync('wsl.exe', ['-d', 'not-a-real-distro', '--', 'echo', 'hi'], { encoding: 'utf-8' });
console.log('exit code:', r.status);
"
```

Expected: a non-zero exit code (confirms `wsl.exe -d <bad-name>` fails the way `checkWslAvailable`'s distro-list check is designed to catch — this validates the assumption Step 1's error handling relies on, without needing to temporarily edit the real script).

- [ ] **Step 6: Commit**

```bash
git add scripts/wazuh.mjs package.json
git commit -m "$(cat <<'EOF'
Add npm scripts to start/stop/check the local Wazuh SIEM stack

Wraps `docker compose start/stop/ps` inside the Ubuntu-22.04 WSL2
distro (where the Wazuh containers actually run, separately from
Docker Desktop's own engine), plus a dashboard reachability check,
so Wazuh can be managed from this project instead of a manual WSL
shell every time.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Document the new scripts in `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: the three npm script names produced by Task 1 (`wazuh:start`, `wazuh:stop`, `wazuh:status`) — must be documented verbatim, matching `package.json` exactly.
- Produces: nothing consumed by later tasks (documentation-only, terminal task for this plan).

- [ ] **Step 1: Add a "Wazuh (local SOC labs)" section to `CLAUDE.md`**

In `CLAUDE.md`, the `## Commands` section currently ends with the "Backend (Django)" code block (after `npm run preview` and before `## Architecture`). Insert a new subsection immediately after the "Backend (Django)" code block and before `## Architecture`:

```markdown
### Wazuh (local SOC labs)

The Practice → Logs section links out to a local Wazuh SIEM instance running as Docker containers inside the `Ubuntu-22.04` WSL2 distro (separate from Docker Desktop). Manage it from this project with:

```sh
npm run wazuh:start   # Start the Wazuh containers, wait until the dashboard is reachable
npm run wazuh:stop    # Stop the containers (frees RAM the indexer/manager use)
npm run wazuh:status  # Show container status + dashboard reachability
```

Dashboard: `https://localhost` (self-signed cert — expect a browser warning). See `docs/superpowers/specs/2026-07-18-wazuh-local-access-design.md` for the full design.
```

- [ ] **Step 2: Verify the doc renders sensibly**

Read the edited `CLAUDE.md` back and confirm: the new section sits between "Backend (Django)" and "## Architecture", the three script names match `package.json` exactly (`wazuh:start`, `wazuh:stop`, `wazuh:status`), and the fenced code block syntax isn't broken (no stray/mismatched triple-backtick nesting — this section nests a ```sh block inside the surrounding prose, not inside another code fence).

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
Document Wazuh lifecycle npm scripts in CLAUDE.md

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
