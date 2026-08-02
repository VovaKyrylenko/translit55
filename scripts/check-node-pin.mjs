#!/usr/bin/env node
// One Node version, pinned in three places that must agree.
//
// `.nvmrc` is what a person gets, `engines` is what a consumer is told, and the workflow
// is what CI actually ran. When they disagree the failure surfaces as "works on my
// machine" long after the change that caused it.
//
// Usage: node scripts/check-node-pin.mjs [root]

import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] ?? ".";
const findings = [];

const nvmrc = readFileSync(join(root, ".nvmrc"), "utf8").trim();
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const workflow = readFileSync(join(root, ".github/workflows/ci.yml"), "utf8");

const major = nvmrc.replace(/^v/, "").split(".")[0];
if (!/^\d+$/.test(major))
  findings.push(`.nvmrc holds "${nvmrc}", which is not a version`);

const engines = pkg.engines?.node ?? "";
if (!engines) findings.push("package.json has no engines.node");
else if (!engines.includes(major))
  findings.push(`engines.node is "${engines}" but .nvmrc pins ${major}`);

// The workflow must read the pin rather than repeat it: a second literal is a second
// thing to update, and it is always the one nobody updates.
if (!/node-version-file:\s*\.nvmrc/.test(workflow)) {
  const literal = workflow.match(/node-version:\s*["']?(\d+)/)?.[1];
  if (literal && literal !== major)
    findings.push(`ci.yml pins node ${literal} while .nvmrc pins ${major}`);
  else
    findings.push(
      "ci.yml does not use `node-version-file: .nvmrc` — the pin can drift",
    );
}

if (findings.length) {
  for (const f of findings) console.error(`check-node-pin: ${f}`);
  process.exit(1);
}
console.log(`check-node-pin: node ${major} in .nvmrc, engines and ci.yml`);
