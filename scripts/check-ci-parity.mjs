#!/usr/bin/env node
// CI must invoke the script keys the profile names, and nothing else.
//
// The point is that a local session and CI run the same thing. An inlined `npx tsc` in a
// workflow passes today and drifts tomorrow: the profile still says `typecheck`, the
// session runs `npm run typecheck`, and CI quietly checks something else. This criterion
// was in the arbiter's record and did not survive into the decision record.
//
// Usage: node scripts/check-ci-parity.mjs [root]

import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] ?? ".";
const findings = [];

const profile = readFileSync(join(root, ".claude/kit.md"), "utf8");
const workflow = readFileSync(join(root, ".github/workflows/ci.yml"), "utf8");

// | KEY | value | rows of the profile's own tables.
const profileValue = (key) => {
  const row = profile
    .split("\n")
    .find((l) => new RegExp(`^\\|\\s*${key}\\s*\\|`).test(l));
  return row ? row.split("|")[2].trim() : null;
};

const runner = profileValue("RUNNER") ?? "npm run";
const COMMAND_KEYS = ["BUILD", "TYPECHECK", "LINT", "TEST_UNIT"];

// Every `- run:` line in the workflow, single-line form only — which is itself the rule:
// a multi-line shell block in a quality job is an inlined command by another name.
const runSteps = workflow
  .split("\n")
  .filter((l) => /^\s*-\s+run:\s*\S/.test(l))
  .map((l) => l.replace(/^\s*-\s+run:\s*/, "").trim());

for (const key of COMMAND_KEYS) {
  const script = profileValue(key);
  if (!script || script === "none") continue;
  const expected = script.startsWith("raw:")
    ? script.slice(4)
    : `${runner} ${script}`;
  // `npm run test` and `npm test` are the same script; the workflow may spell it either way.
  const alternatives = [expected, expected.replace(/^npm run /, "npm ")];
  if (!runSteps.some((step) => alternatives.includes(step)))
    findings.push(
      `${key} resolves to "${expected}", which no step in ci.yml runs — CI and a local session would check different things`,
    );
}

// The reverse direction: a step that runs project code must name a script key, so the
// profile stays the single source of truth for how this project is built and checked.
const ALLOWED_LITERALS = new Set([
  "npm ci",
  "npm test",
  "npm audit signatures",
]);
for (const step of runSteps) {
  if (ALLOWED_LITERALS.has(step)) continue;
  if (step.startsWith(`${runner} `)) continue;
  if (step.startsWith("node scripts/")) continue; // the gates in this directory
  findings.push(
    `ci.yml runs "${step}", which is not a script key from the profile — inline it here and the two drift`,
  );
}

if (findings.length) {
  for (const f of findings) console.error(`check-ci-parity: ${f}`);
  process.exit(1);
}
console.log(
  `check-ci-parity: ${COMMAND_KEYS.length} command keys, all invoked by ci.yml`,
);
