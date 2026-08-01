import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const corpus = JSON.parse(readFileSync("corpus/kmu55-official.json", "utf8"));
const research = readFileSync("docs/research-kmu55.md", "utf8");

test("the corpus holds exactly the 76 pairs the resolution prints", () => {
  assert.equal(corpus.pairs.length, 76);
});

test("every pair carries both sides and a citation to where it is printed", () => {
  for (const p of corpus.pairs) {
    assert.ok(p.cyrillic && p.latin && p.source, `incomplete row ${p.n}`);
  }
});

// The corpus is ground truth for conformance, so it must not be able to drift away from
// the primary source it was extracted from. Checking each pair against the research
// document is what makes an edit here visible rather than convenient.
const provenanceViolations = (pairs) =>
  pairs.filter((p) => !research.includes(`| ${p.cyrillic} | ${p.latin} |`));

test("every pair appears verbatim in the researched text of the resolution", () => {
  assert.deepEqual(provenanceViolations(corpus.pairs), []);
});

test("the provenance check rejects a tampered pair", () => {
  // Negative fixture. Without it, the check above would also pass on an empty corpus, and
  // a guard that cannot be shown to fail is not a guard.
  const tampered = corpus.pairs.map((p, i) =>
    i === 8 ? { ...p, latin: "Zhurskyi" } : p,
  );
  assert.equal(provenanceViolations(tampered).length, 1);
});

test("the discriminating pairs are marked and include the зг digraph", () => {
  const marked = corpus.pairs.filter((p) => p.discriminating);
  assert.equal(marked.length, 11);
  assert.ok(
    marked.some((p) => p.cyrillic === "Згурський" && p.latin === "Zghurskyi"),
  );
});
