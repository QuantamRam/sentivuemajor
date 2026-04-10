/**
 * One-shot: stage all, commit, push. Run when you're ready to sync.
 *
 * Usage:
 *   npm run commit:push -- "your message here"
 *   $env:COMMIT_MSG="your message"; npm run commit:push
 */

import { execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");

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

const fromArgs = process.argv.slice(2).join(" ").trim();
const fromEnv = (process.env.COMMIT_MSG || "").trim();
let msg = fromArgs || fromEnv;
if (!msg) {
  const stamp = new Date().toISOString().replace(/:/g, "-");
  msg = `chore: save ${stamp}`;
}

if (!hasUncommittedChanges()) {
  console.log("[commit:push] Nothing to commit — working tree clean.");
  process.exit(0);
}

const msgFile = join(tmpdir(), `commit-push-${process.pid}-${Date.now()}.txt`);
writeFileSync(msgFile, msg, "utf8");

try {
  run("git add -A");
  run(`git commit -F "${msgFile.replace(/\\/g, "/")}"`);
} catch {
  console.error("[commit:push] Commit failed (hooks, empty stage, or message issue).");
  process.exit(1);
} finally {
  try {
    unlinkSync(msgFile);
  } catch {
    /* ignore */
  }
}

const branch = currentBranch();
run(`git push -u origin "${branch}"`);
console.log(`\n[commit:push] Pushed: ${msg}\n`);
