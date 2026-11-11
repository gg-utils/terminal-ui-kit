import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { startInkCliTaskProcess, type InkCliSessionLine } from "./ink/bridge-task.js";

for (const exitCode of [0, 7]) {
  void test(`process bridge captures both streams and exit ${exitCode}`, async () => {
    const lines: InkCliSessionLine[] = [];
    const task = startInkCliTaskProcess({
      projectRoot: process.cwd(), command: process.execPath,
      args: ["-e", `process.stdout.write('hello\\nlast'); process.stderr.write('problem\\n'); process.exitCode=${exitCode}`],
      callbacks: { onStarted: () => {}, onLine: (line) => { lines.push(line); } },
    });
    const result = await task.promise;
    assert.equal(result.exitCode, exitCode);
    assert.equal(result.status, exitCode === 0 ? "succeeded" : "failed");
    assert.deepEqual(lines.filter((line) => line.source === "stdout").map((line) => line.text), ["hello", "last"]);
    assert.deepEqual(lines.filter((line) => line.source === "stderr").map((line) => line.text), ["problem"]);
  });
}

void test("published entries exist in dist", () => {
  const manifest: unknown = JSON.parse(readFileSync("package.json", "utf8"));
  function check(value: unknown): void {
    if (typeof value === "string") assert.ok(existsSync(value), value);
    else if (value !== null && typeof value === "object") for (const child of Object.values(value)) check(child);
  }
  assert.ok(manifest !== null && typeof manifest === "object" && "exports" in manifest);
  check(manifest.exports);
});
