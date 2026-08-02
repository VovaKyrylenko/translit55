#!/usr/bin/env node
// Publishing may only be reached from the default branch or a manual dispatch.
//
// A release workflow that also fires on a pull request or on every branch push turns any
// contributor's branch into a tag on the registry. Nothing in this repository would have
// caught that: the criterion was in the arbiter's record and was dropped from the decision
// record, so the trigger has been unguarded since the bootstrap.
//
// Usage: node scripts/check-release-trigger.mjs [root]

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] ?? ".";
const file = join(root, ".github/workflows/kit-release.yml");
if (!existsSync(file)) {
  console.error(`check-release-trigger: ${file} does not exist`);
  process.exit(1);
}

const workflow = readFileSync(file, "utf8");
const findings = [];

// The `on:` block only, up to the next top-level key. Scanning the whole file would trip
// on the word "pull_request" inside a comment or a step.
const onBlock = workflow.match(/^on:\s*\n((?:[ \t]+.*\n|\n)*)/m)?.[1] ?? "";
if (!onBlock) findings.push("no `on:` block found");

if (/^\s+pull_request:/m.test(onBlock))
  findings.push(
    "fires on pull_request — a proposed change must not be able to publish",
  );

const pushBranches = onBlock.match(
  /^\s+push:\s*\n\s+branches:\s*\[(.*)\]/m,
)?.[1];
if (pushBranches) {
  const branches = pushBranches
    .split(",")
    .map((b) => b.trim().replace(/^["']|["']$/g, ""));
  const stray = branches.filter((b) => !["main", "master"].includes(b));
  if (stray.length)
    findings.push(
      `push trigger includes ${stray.join(", ")} — publishing must be reachable only from the default branch`,
    );
} else if (/^\s+push:/m.test(onBlock)) {
  findings.push(
    "push trigger does not restrict branches — every branch would publish",
  );
}

if (findings.length) {
  for (const f of findings) console.error(`check-release-trigger: ${f}`);
  process.exit(1);
}
console.log(
  "check-release-trigger: publishing is reachable only from the default branch",
);
