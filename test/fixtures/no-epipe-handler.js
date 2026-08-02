#!/usr/bin/env node
// Negative fixture for the closed-pipe contract: the same writer without the
// `process.stdout` error listener. Piped into a reader that closes early it must produce
// an unhandled EPIPE and a stack trace on stderr — which is what proves the assertions in
// cli-contract.test.mjs can see a crash at all.
//
// The shipped test asserted "no crash" against stdout only, so it passed while `npm test`
// printed this exact trace directly above its own `ok`. A guard that cannot be shown
// failing is not a guard.
for (let i = 0; i < 50000; i++) process.stdout.write(i + "\n");
