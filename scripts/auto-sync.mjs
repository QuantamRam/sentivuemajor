/**
 * Watches the repo and pushes changes to origin after a quiet period.
 * Git still records commits; this automates add → commit → push.
 *
 * Usage: npm run sync:watch
 * Env: AUTO_SYNC_DEBOUNCE_MS (default 5000), AUTO_SYNC_BRANCH (optional override)
 */

import chokidar from "chokidar";
import { execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");

const DEBOUNCE_MS = Number(process.env.AUTO_SYNC_DEBOUNCE_MS || 5000);

function run(cmd, { inherit = true } = {}) {
  return execSync(cmd, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: inherit ? "inherit" : ["pipe", "pipe", "inherit"],
  });
}

function hasUncommittedChanges() {
  const out = run("git status --porcelain", { inherit: false });
  return out.trim().length > 0;
}

function currentBranch() {
  if (process.env.AUTO_SYNC_BRANCH) return process.env.AUTO_SYNC_BRANCH.trim();
  return run("git rev-parse --abbrev-ref HEAD", { inherit: false }).trim();
}

function sync() {
  if (!hasUncommittedChanges()) return;

  const stamp = new Date().toISOString().replace(/:/g, "-");
  const msg = `chore: auto-sync ${stamp}`;
  const msgFile = join(tmpdir(), `autosync-${process.pid}-${Date.now()}.txt`);

  try {
    run("git add -A");
    writeFileSync(msgFile, msg, "utf8");
    try {
      run(`git commit -F "${msgFile.replace(/\\/g, "/")}"`);
    } catch {
      // Nothing staged (e.g. only ignored files) or hook blocked
      return;
    } finally {
      try {
        unlinkSync(msgFile);
      } catch {
        /* ignore */
      }
    }

    const branch = currentBranch();
    run(`git push -u origin "${branch}"`);
    console.log(`\n[auto-sync] ${msg}\n`);
  } catch (e) {
    console.error("\n[auto-sync] Push or commit failed:", e?.message || e);
    console.error(
      "[auto-sync] Fix the issue (e.g. git pull --rebase, auth, conflicts), then save again.\n",
    );
  }
}

let timer = null;
function schedule() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    sync();
  }, DEBOUNCE_MS);
}

const ignored = [
  "**/node_modules/**",
  "**/.git/**",
  "**/dist/**",
  "**/dist-ssr/**",
  "**/.vite/**",
];

const watcher = chokidar.watch(ROOT, {
  ignored,
  ignoreInitial: true,
  awaitWriteFinish: { stabilityThreshold: 400, pollInterval: 100 },
  depth: 99,
});

watcher.on("ready", () => {
  console.log(
    `[auto-sync] Watching ${ROOT}\n[auto-sync] Debounce: ${DEBOUNCE_MS}ms — save files to sync to GitHub.\n`,
  );
  if (hasUncommittedChanges()) schedule();
});

watcher.on("all", () => schedule());

process.on("SIGINT", () => {
  watcher.close().then(() => process.exit(0));
});
