# CLI design decisions

- **The contract is the deliverable, not the flags.** Exit 0 on success, 1 on unreadable
  input, 2 on usage error, 141 when the reader goes away. Why: this is a tool that will
  live inside pipelines, and a wrong exit code is a silent failure in someone else's script.
- **`process.exitCode`, never `process.exit()`** — except inside the EPIPE handler, where
  the pipe is already gone. Why: measured, not assumed — a CLI ending in `process.exit(0)`
  delivered 8956 of 100000 lines to a slow reader, with exit code 0.
- **The EPIPE handler must not mask a failure already in flight.** Why: under
  `set -o pipefail` a masked failure reads as success, which is worse than the crash it
  replaced.
- **Flags are an allowlist; anything unrecognised is a usage error.** Why: treating an
  unknown `--flag` as a file name reported "no such file or directory" and exited 1 where
  the contract promises 2 — the message named the wrong problem and the exit code lied to
  whatever script read it. `--` ends option parsing, `-` is stdin.
- **Every failure is reported once.** Why: `readline` re-emits its stream's error on the
  Interface, so an unreadable file printed the clean message and then a full unhandled-error
  stack trace. Both spellings exit 1, which is why the exit code alone could not see it.
- **Line-oriented, streaming, stdin by default.** Why: names arrive in files of unknown
  size; `translit55 names.txt | head` must be instant and must not buffer the world.
- **Output is UTF-8 unconditionally.** Why: C4 says the same bytes on any machine under
  any locale, and stdout encoding is exactly where a locale sneaks in.
