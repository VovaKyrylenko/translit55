#!/usr/bin/env node
// The CLI shell. It does not transliterate yet — the transliterator lands on the first
// feature branch, after the corpus and the register it is checked against.
//
// What this file exists to establish now is the output contract, because it is the part
// that is easy to get wrong and hard to notice: the design cycle reproduced 8956 of
// 100000 lines being delivered, with exit code 0, when the CLI ended with process.exit().
import { createInterface } from "node:readline";
import { createReadStream } from "node:fs";

// EPIPE is normal: the reader went away (`translit55 names.txt | head -3`). Exiting here
// is the one place process.exit is correct — the pipe is gone, nothing can be flushed —
// and 141 is the shell's 128 + SIGPIPE. A failure already in flight must not be masked
// as success, which is the residual the delta pass found in the first version of this.
process.stdout.on("error", (err) => {
  if (err && err.code === "EPIPE")
    process.exit(process.exitCode ? Number(process.exitCode) : 141);
  throw err;
});

const argv = process.argv.slice(2);
if (argv.includes("--help") || argv.includes("-h")) {
  process.stdout.write(
    "usage: translit55 [FILE|-]\n  reads stdin when no file is given\n",
  );
  process.exitCode = 0;
} else if (argv.length > 1) {
  process.stderr.write("translit55: expected at most one file argument\n");
  process.exitCode = 2;
} else {
  const target = argv[0] && argv[0] !== "-" ? argv[0] : null;
  const input = target ? createReadStream(target, "utf8") : process.stdin;
  input.on("error", (err) => {
    process.stderr.write(`translit55: ${err.message}\n`);
    process.exitCode = 1;
  });
  const lines = createInterface({ input, crlfDelay: Infinity });
  // Identity for now. The point of shipping it is the contract, not the transform.
  lines.on("line", (line) => process.stdout.write(line + "\n"));
  // No process.exit(0) here, deliberately: it would truncate stdout on a pipe.
}
