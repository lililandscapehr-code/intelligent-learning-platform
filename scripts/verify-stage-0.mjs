import { spawnSync } from "node:child_process";

const checks = [
  ["type-check", "npm", ["run", "type-check"]],
  ["foundation tests", "npm", ["run", "test:foundation"]]
];

for (const [label, command, args] of checks) {
  console.log(`\n[Stage 0] ${label}`);
  const result = spawnSync(command, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) {
    console.error(`[Stage 0] FAILED: ${label}`);
    process.exit(result.status ?? 1);
  }
}

console.log("\n[Stage 0] PASS: static foundation checks completed.");
console.log("[Stage 0] BLOCKED: database, browser, security, persistence, and restart checks require configured infrastructure.");