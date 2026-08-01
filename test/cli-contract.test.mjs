import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// The output contract, tested rather than documented. The design cycle reproduced a CLI
// ending in process.exit(0) delivering 8956 of 100000 lines to a slow reader — with exit
// code 0. Everything here exists to make that specific failure impossible to reintroduce.

const LINES = 20000;

function pipeThroughSlowReader(args = []) {
  // `head -0`-style consumers are the easy case; a reader that is merely SLOW is the one
  // that catches a premature exit, because the writer has buffered output still pending.
  const producer = spawn("node", [
    "-e",
    `for(let i=0;i<${LINES};i++)process.stdout.write("рядок"+i+"\\n")`,
  ]);
  const cli = spawn("node", ["bin/translit55.js", ...args], {
    stdio: ["pipe", "pipe", "inherit"],
  });
  producer.stdout.pipe(cli.stdin);
  return new Promise((resolve) => {
    let received = "";
    setTimeout(() => cli.stdout.on("data", (d) => (received += d)), 300);
    cli.on("close", (code) =>
      setTimeout(
        () =>
          resolve({ code, lines: received.split("\n").filter(Boolean).length }),
        100,
      ),
    );
  });
}

test("a slow reader still receives every line", async () => {
  const { code, lines } = await pipeThroughSlowReader();
  assert.equal(code, 0);
  assert.equal(lines, LINES);
});

test("a closed pipe is not a crash", () => {
  const out = execFileSync(
    "bash",
    [
      "-c",
      "node -e 'for(let i=0;i<50000;i++)process.stdout.write(i+\"\\n\")' | node bin/translit55.js | head -3; echo status=${PIPESTATUS[1]}",
    ],
    { encoding: "utf8" },
  );
  assert.match(out, /status=141|status=0/);
  assert.doesNotMatch(out, /EPIPE|Error:/);
});

test("usage errors exit 2, unreadable input exits 1", () => {
  const usage = execFileSync(
    "bash",
    ["-c", "node bin/translit55.js a b >/dev/null 2>&1; echo $?"],
    { encoding: "utf8" },
  );
  assert.equal(usage.trim(), "2");
  const missing = execFileSync(
    "bash",
    ["-c", "node bin/translit55.js /nonexistent >/dev/null 2>&1; echo $?"],
    { encoding: "utf8" },
  );
  assert.equal(missing.trim(), "1");
});

// Source hygiene: the ban is on the mechanism, not on remembering the lesson.
function filesUnder(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? filesUnder(p) : [p];
  });
}
// Comments discuss process.exit deliberately — this file does. Strip them first, or the
// guard fires on the prose explaining why the call is banned.
const codeLines = (src) =>
  src
    .split("\n")
    .map((l) => l.replace(/\/\/.*$/, ""))
    .filter((l) => /process\.exit\(/.test(l));
const offenders = (files) =>
  files.filter(
    (f) =>
      /\.(js|mjs|ts)$/.test(f) && codeLines(readFileSync(f, "utf8")).length > 0,
  );

test("nothing outside the EPIPE handler calls process.exit", () => {
  const found = offenders([...filesUnder("src"), ...filesUnder("bin")]);
  // bin/translit55.js contains exactly one, inside the EPIPE handler, where it is correct.
  const counted = found.flatMap((f) => codeLines(readFileSync(f, "utf8")));
  assert.equal(
    counted.length,
    1,
    `expected exactly one guarded call, found ${counted.length} in ${found}`,
  );
  // Checked by context, not by the call's own line: the formatter is free to wrap it, and
  // a test that breaks on line wrapping is a test people switch off.
  const src = readFileSync("bin/translit55.js", "utf8").split("\n");
  const at = src.findIndex((l) =>
    /process\.exit\(/.test(l.replace(/\/\/.*$/, "")),
  );
  const context = src.slice(Math.max(0, at - 3), at + 1).join(" ");
  assert.match(
    context,
    /EPIPE/,
    "the one permitted call must sit in the EPIPE handler",
  );
});

test("the source-hygiene check rejects the negative fixture", () => {
  assert.deepEqual(offenders(["test/fixtures/uses-process-exit.js"]), [
    "test/fixtures/uses-process-exit.js",
  ]);
});
