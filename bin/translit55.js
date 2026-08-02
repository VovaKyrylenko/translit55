#!/usr/bin/env node
// The CLI shell. It does not transliterate yet — the transliterator lands on the first
// feature branch, after the corpus and the register it is checked against.
//
// What this file exists to establish now is the output contract, because it is the part
// that is easy to get wrong and hard to notice: the design cycle reproduced 8956 of
// 100000 lines being delivered, with exit code 0, when the CLI ended with process.exit().
import { createInterface } from "node:readline";
import { createReadStream, readFileSync } from "node:fs";

const EXIT_OK = 0;
const EXIT_INPUT = 1;
const EXIT_USAGE = 2;
const EXIT_SIGPIPE = 141; // the shell's 128 + SIGPIPE(13)

const USAGE = `usage: translit55 [FILE|-]
  reads stdin when no file is given

  -h, --help     print this and exit 0
  -V, --version  print the package version and exit 0
  --             stop option parsing; what follows is a file name
`;

// EPIPE is normal: the reader went away (`translit55 names.txt | head -3`). Exiting here
// is the one place process.exit is correct — the pipe is gone, nothing can be flushed —
// and 141 is the shell's 128 + SIGPIPE. A failure already in flight must not be masked
// as success, which is the residual the delta pass found in the first version of this.
process.stdout.on("error", (err) => {
  if (err && err.code === "EPIPE")
    process.exit(process.exitCode ? Number(process.exitCode) : EXIT_SIGPIPE);
  throw err;
});

// Parsed against an explicit allowlist. Treating an unrecognised `--flag` as a file name
// is how `translit55 --ouput x` reported "no such file or directory" and exited 1 while
// the contract promised 2 for a usage error: the message named the wrong problem and the
// exit code lied to whatever script was reading it.
// Not exported: importing this file runs the CLI, so the tests drive it as a process,
// which is also the only way to observe the exit codes the contract is about.
function parseArgs(argv) {
  const files = [];
  let endOfOptions = false;
  for (const arg of argv) {
    if (endOfOptions || arg === "-" || !arg.startsWith("-")) {
      files.push(arg);
    } else if (arg === "--") {
      endOfOptions = true;
    } else if (arg === "-h" || arg === "--help") {
      return { action: "help" };
    } else if (arg === "-V" || arg === "--version") {
      return { action: "version" };
    } else {
      return { action: "usage-error", message: `unknown option '${arg}'` };
    }
  }
  if (files.length > 1)
    return {
      action: "usage-error",
      message: "expected at most one file argument",
    };
  return {
    action: "run",
    file: files[0] && files[0] !== "-" ? files[0] : null,
  };
}

// Read rather than imported: JSON import attributes are still a moving target across Node
// majors, and this file must run under whatever version `npx` happens to pick.
function version() {
  const pkg = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  );
  return pkg.version;
}

const parsed = parseArgs(process.argv.slice(2));

if (parsed.action === "help") {
  process.stdout.write(USAGE);
  process.exitCode = EXIT_OK;
} else if (parsed.action === "version") {
  process.stdout.write(`${version()}\n`);
  process.exitCode = EXIT_OK;
} else if (parsed.action === "usage-error") {
  process.stderr.write(`translit55: ${parsed.message}\n${USAGE}`);
  process.exitCode = EXIT_USAGE;
} else {
  const input = parsed.file
    ? createReadStream(parsed.file, "utf8")
    : process.stdin;
  // Reported once, on both emitters. readline re-emits the stream's error on the
  // Interface, and an Interface with no error listener throws — so an unreadable file
  // printed the clean message and then a full unhandled-'error' stack trace. The exit code
  // was 1 either way, which is why the original test could not see it.
  const reportInputFailure = (err) => {
    if (process.exitCode === EXIT_INPUT) return;
    process.stderr.write(`translit55: ${err.message}\n`);
    process.exitCode = EXIT_INPUT;
  };
  input.on("error", reportInputFailure);
  const lines = createInterface({ input, crlfDelay: Infinity });
  lines.on("error", reportInputFailure);
  // Identity for now. The point of shipping it is the contract, not the transform.
  lines.on("line", (line) => process.stdout.write(line + "\n"));
  // No process.exit(0) here, deliberately: it would truncate stdout on a pipe.
}
