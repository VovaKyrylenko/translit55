#!/usr/bin/env node
// No neighbour implementation may be cited as ground truth.
//
// `uklatn` and `translit-ua` encode *their* answers to the questions the resolution leaves
// open — the research says so explicitly, and the whole premise of this project (C8) is
// that those answers are undocumented. So they are legitimate as a rejected alternative or
// as a witness that two readings differ, and illegitimate as the reason a decision is
// right. The corpus, which is ground truth, may not mention them at all.
//
// The arbiter asked for this as `! rg -q "uklatn|translit-ua" corpus/ docs/register.md`,
// which would fail on the shipped register for the one reason that is allowed: the register
// names them in its `rejected alternative` column, which is the opposite of citing them as
// truth. The gate is written per column instead, so it can be true.
//
// Usage: node scripts/check-ground-truth.mjs [root]

import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] ?? ".";
const NEIGHBOURS = /uklatn|translit-ua|translitua/i;
const findings = [];

const corpus = readFileSync(join(root, "corpus/kmu55-official.json"), "utf8");
if (NEIGHBOURS.test(corpus))
  findings.push(
    "corpus/kmu55-official.json names a neighbour implementation — the corpus is the resolution's own worked pairs and nothing else",
  );

// | id | question | resolution says | decision | rejected alternative | witness | status |
const FORBIDDEN_COLUMNS = { 2: "resolution says", 3: "decision" };
const register = readFileSync(join(root, "docs/register.md"), "utf8");
for (const line of register.split("\n")) {
  if (!/^\|\s*DR-/.test(line)) continue;
  const cells = line.split("|").slice(1, -1);
  for (const [index, name] of Object.entries(FORBIDDEN_COLUMNS)) {
    if (NEIGHBOURS.test(cells[index] ?? ""))
      findings.push(
        `${cells[0].trim()}: "${name}" cites a neighbour implementation — it may appear as a rejected alternative or a witness, never as what the standard says or why we decided`,
      );
  }
}

if (findings.length) {
  for (const f of findings) console.error(`check-ground-truth: ${f}`);
  process.exit(1);
}
console.log(
  "check-ground-truth: the corpus is clean and no register decision rests on a neighbour",
);
