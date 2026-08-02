#!/usr/bin/env node
// Regenerates corpus/kmu55-official.json from the researched text of the resolution.
//
// The corpus was originally produced by a one-off script that was never committed, so the
// transformation between the primary source and the ground truth the whole project is
// checked against existed only in one session's memory. `--check` makes the regeneration
// a test: if the committed corpus and a fresh extraction differ, one of them was edited by
// hand, and a corpus edited by hand is no longer ground truth.
//
// Usage:
//   node scripts/extract-corpus.mjs           write corpus/kmu55-official.json
//   node scripts/extract-corpus.mjs --check   exit 1 if the committed file differs
//   node scripts/extract-corpus.mjs --stdout  print the JSON

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root =
  process.argv.find((a) => !a.startsWith("--") && a.endsWith("/")) ?? ".";
const research = readFileSync(join(root, "docs/research-kmu55.md"), "utf8");

const SECTION = "### 5.1";
const NEXT_SECTION = "### 5.2";
const start = research.indexOf(SECTION);
const end = research.indexOf(NEXT_SECTION);
if (start < 0 || end < 0)
  throw new Error("research-kmu55.md no longer has a §5.1 … §5.2 boundary");
const section = research.slice(start, end);

// | 9 | Згурський | Zghurskyi | Гг row |
const pairs = section
  .split("\n")
  .map((l) =>
    l.match(/^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/),
  )
  .filter(Boolean)
  .map(([, n, cyrillic, latin, source]) => ({
    n: Number(n),
    cyrillic,
    latin,
    // The document quotes the positional labels as code spans (`на початку слова`); the
    // backticks are markdown, not part of the citation.
    source: source.replace(/`/g, ""),
  }));

// The discriminating set is stated in prose in the same section, by case number, so it is
// read from there rather than restated here — a second copy is a second thing to update.
const discriminating = new Set(
  (
    section.match(
      /Cases ([\d, ]+and \d+) are the ones that actually discriminate/,
    )?.[1] ?? ""
  )
    .replace(/and/g, ",")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter(Boolean),
);

const corpus = {
  standard: "Постанова Кабінету Міністрів України від 27.01.2010 № 55",
  source_url: "https://zakon.rada.gov.ua/laws/show/55-2010-%D0%BF/print",
  edition: "Редакція від 12.01.2016, підстава - 1121-2015-п",
  licence: "Text of the resolution: CC BY 4.0 (zakon.rada.gov.ua)",
  extracted_from: "docs/research-kmu55.md §5.1",
  note: "Worked pairs printed in the resolution itself. Ground truth for conformance; never edited to match an implementation.",
  pairs: pairs.map((p) => ({ ...p, discriminating: discriminating.has(p.n) })),
};

const json = `${JSON.stringify(corpus, null, 2)}\n`;
const target = join(root, "corpus/kmu55-official.json");

if (process.argv.includes("--stdout")) {
  process.stdout.write(json);
} else if (process.argv.includes("--check")) {
  const committed = readFileSync(target, "utf8");
  if (committed !== json) {
    console.error(
      "extract-corpus: the committed corpus differs from a fresh extraction — " +
        "it was edited by hand, or the research document changed under it",
    );
    process.exit(1);
  }
  console.log(
    `extract-corpus: ${corpus.pairs.length} pairs, identical to the committed file`,
  );
} else {
  writeFileSync(target, json);
  console.log(
    `extract-corpus: wrote ${corpus.pairs.length} pairs to ${target}`,
  );
}
