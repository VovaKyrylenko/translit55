#!/usr/bin/env node
// The code is MIT; the resolution's text is somebody else's, under CC BY 4.0.
//
// The corpus reproduces 76 worked pairs printed by the Verkhovna Rada, and the licence
// that permits it requires attribution. This is the cheapest possible obligation to meet
// and the easiest to lose in a refactor, which is why it is a check and not a habit.
//
// Usage: node scripts/check-attribution.mjs [root]

import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] ?? ".";
const findings = [];
const read = (p) => readFileSync(join(root, p), "utf8");

if (!/MIT License/i.test(read("LICENSE")))
  findings.push("LICENSE is not the MIT licence the package declares");

const corpus = JSON.parse(read("corpus/kmu55-official.json"));
if (!/CC BY 4\.0/i.test(corpus.licence ?? ""))
  findings.push(
    "corpus/kmu55-official.json does not carry the CC BY 4.0 licence of its source",
  );
if (!/zakon\.rada\.gov\.ua/.test(corpus.source_url ?? ""))
  findings.push("corpus/kmu55-official.json does not link the primary source");

const register = read("docs/register.md");
if (!/CC BY 4\.0/i.test(register) || !/zakon\.rada\.gov\.ua/.test(register))
  findings.push(
    "docs/register.md does not attribute the resolution's text to its source",
  );

if (findings.length) {
  for (const f of findings) console.error(`check-attribution: ${f}`);
  process.exit(1);
}
console.log(
  "check-attribution: MIT for the code, CC BY 4.0 attributed for the resolution",
);
