import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// The output contract, tested rather than documented. The design cycle reproduced a CLI
// ending in process.exit(0) delivering 8956 of 100000 lines to a slow reader — with exit
// code 0. Everything here exists to make that specific failure impossible to reintroduce.

const LINES = 20000;

// stderr is CAPTURED, never inherited. The shipped version of this file used
// `stdio: [..., "inherit"]` and asserted `doesNotMatch(stdout, /EPIPE/)`, so every run of
// `npm test` printed an unhandled EPIPE stack trace immediately above its own `ok`. An
// assertion about the absence of something has to observe where that something appears.
function pipeThroughSlowReader(args = []) {
  // `head -0`-style consumers are the easy case; a reader that is merely SLOW is the one
  // that catches a premature exit, because the writer has buffered output still pending.
  // The producer swallows its own EPIPE: when the CLI finishes and closes its stdin, a
  // producer still flushing would dump an unhandled-error trace into the test log, which
  // is precisely the noise this file exists to keep out. The producer is not under test.
  const producer = spawn("node", [
    "-e",
    `process.stdout.on("error", () => process.exit(0));` +
      `for(let i=0;i<${LINES};i++)process.stdout.write("рядок"+i+"\\n")`,
  ]);
  const cli = spawn("node", ["bin/translit55.js", ...args], {
    stdio: ["pipe", "pipe", "pipe"],
  });
  producer.stdout.pipe(cli.stdin);
  return new Promise((resolve) => {
    let received = "";
    let stderr = "";
    cli.stderr.on("data", (d) => (stderr += d));
    producer.stderr.on("data", (d) => (stderr += d));
    setTimeout(() => cli.stdout.on("data", (d) => (received += d)), 300);
    cli.on("close", (code) =>
      setTimeout(
        () =>
          resolve({
            code,
            stderr,
            lines: received.split("\n").filter(Boolean).length,
          }),
        100,
      ),
    );
  });
}

test("a slow reader still receives every line", async () => {
  const { code, lines, stderr } = await pipeThroughSlowReader();
  assert.equal(code, 0);
  assert.equal(lines, LINES);
  assert.equal(stderr, "", `nothing may be written to stderr, got: ${stderr}`);
});

// A real shell pipeline, because that is what the contract is about — and stderr goes to
// a file so it can be asserted on. Routing the child's stdout through the parent instead
// would mean the CLI never sees the closed pipe at all: the parent's socket stays open,
// and the test measures nothing while looking like it measures everything.
function closedPipe(writer, statusIndex) {
  const dir = mkdtempSync(join(tmpdir(), "translit55-"));
  const errFile = join(dir, "stderr.txt");
  const out = execFileSync(
    "bash",
    [
      "-c",
      `${writer} 2>"${errFile}" | head -3 >/dev/null; echo status=\${PIPESTATUS[${statusIndex}]}`,
    ],
    { encoding: "utf8" },
  );
  const stderr = readFileSync(errFile, "utf8");
  rmSync(dir, { recursive: true, force: true });
  return { status: out.trim(), stderr };
}

// Same reasoning as the slow-reader producer: it exits quietly when the CLI stops reading,
// so the only EPIPE anywhere in this suite is the one the negative fixture exists to show.
const PRODUCER =
  `node -e 'process.stdout.on("error",()=>process.exit(0));` +
  `for(let i=0;i<50000;i++)process.stdout.write(i+"\\n")'`;

test("a closed pipe is not a crash", () => {
  const { status, stderr } = closedPipe(
    `${PRODUCER} | node bin/translit55.js`,
    1,
  );
  // Exactly 141, not "141 or 0": the shipped assertion accepted both, and those are the
  // two outcomes it exists to tell apart.
  assert.equal(status, "status=141");
  assert.doesNotMatch(stderr, /EPIPE|Error:/);
});

test("the closed-pipe assertion can see a crash", () => {
  // Negative fixture: the same writer with no EPIPE handler. If this came back clean, the
  // assertion above would be watching the wrong stream and would prove nothing.
  const { stderr } = closedPipe("node test/fixtures/no-epipe-handler.js", 0);
  assert.match(stderr, /EPIPE/);
});

test("a failure in flight is not masked by the EPIPE handler", () => {
  // The residual the delta pass found: exiting 141 on a closed pipe would turn a real
  // failure into a success under `set -o pipefail`.
  const out = execFileSync(
    "bash",
    [
      "-c",
      "node bin/translit55.js /nonexistent 2>/dev/null | head -1 >/dev/null; echo status=${PIPESTATUS[0]}",
    ],
    { encoding: "utf8" },
  );
  assert.match(out, /status=1\b/);
});

test("usage errors exit 2, unreadable input exits 1", () => {
  const status = (cmd) =>
    execFileSync("bash", ["-c", `${cmd} >/dev/null 2>&1; echo $?`], {
      encoding: "utf8",
    }).trim();
  assert.equal(status("node bin/translit55.js a b"), "2");
  // An unknown flag is a usage error, not a missing file. Treating it as a file name
  // reported "no such file or directory" and exited 1, against a contract promising 2.
  assert.equal(status("node bin/translit55.js --ouput x"), "2");
  assert.equal(status("echo | node bin/translit55.js -x"), "2");
  assert.equal(status("node bin/translit55.js /nonexistent"), "1");
  assert.equal(status("node bin/translit55.js --help"), "0");
  assert.equal(status("node bin/translit55.js --version"), "0");
});

test("an unreadable file is reported once, with no stack trace", () => {
  // readline re-emits the stream's error on the Interface, and an Interface with no error
  // listener throws — so this path printed the clean message AND a full unhandled-'error'
  // dump. Both spellings exit 1, which is why asserting only on the exit code missed it.
  const err = execFileSync(
    "bash",
    ["-c", "node bin/translit55.js /nonexistent 2>&1 >/dev/null || true"],
    { encoding: "utf8" },
  );
  assert.match(err, /no such file or directory/);
  assert.doesNotMatch(err, /Unhandled 'error' event|at ReadStream/);
  assert.equal(err.trim().split("\n").length, 1);
});

test("the version is the package's own", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const out = execFileSync("node", ["bin/translit55.js", "--version"], {
    encoding: "utf8",
  });
  assert.equal(out.trim(), pkg.version);
});

test("-- ends option parsing", () => {
  const out = execFileSync(
    "bash",
    ["-c", "node bin/translit55.js -- --weird 2>&1 >/dev/null; echo $?"],
    { encoding: "utf8" },
  );
  // Treated as a file name: it is reported as unreadable input, not as a bad option.
  assert.match(out, /no such file or directory/);
  assert.match(out, /\n1\n?$/);
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
