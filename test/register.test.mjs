import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const REQUIRED = [
  "id",
  "question",
  "resolution says",
  "decision",
  "rejected alternative",
  "witness",
  "status",
];

function rows(markdown) {
  return markdown
    .split("\n")
    .filter((l) => /^\| DR-/.test(l))
    .map((l) =>
      l
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim()),
    );
}

const register = readFileSync("docs/register.md", "utf8");

test("the register has a row for every decision the cycle seeded", () => {
  assert.equal(rows(register).length, 10);
});

test("no cell in any row is empty", () => {
  for (const row of rows(register)) {
    assert.equal(
      row.length,
      REQUIRED.length,
      `row ${row[0]} has ${row.length} cells`,
    );
    row.forEach((cell, i) =>
      assert.ok(cell.length > 0, `${row[0]}: empty ${REQUIRED[i]}`),
    );
  }
});

// A row whose two readings produce the same string is not a decision — it is a sentence.
// This is the gate that keeps the register from filling up with distinctions that make no
// difference, which is the one failure mode the whole artifact cannot survive.
const witnessSides = (cell) =>
  cell
    .split("→")[1]
    ?.split("/")
    .map((s) => s.trim()) ?? [];

test("every row's witness distinguishes the decision from the rejected alternative", () => {
  for (const row of rows(register)) {
    const [decided, rejected] = witnessSides(row[5]);
    assert.ok(
      decided && rejected,
      `${row[0]}: witness must read "input → decided / rejected"`,
    );
    assert.notEqual(
      decided,
      rejected,
      `${row[0]}: both readings give the same output`,
    );
  }
});

test("the witness gate rejects a row whose readings agree", () => {
  const fake =
    "| DR-999 | q | silent | d | r | `x` → `same` / `same` | seeded |";
  const [decided, rejected] = witnessSides(rows(fake)[0][5]);
  assert.equal(decided, rejected);
});

test("the register carries the open items the bootstrap did not close", () => {
  for (const id of ["OI-1", "OI-2", "OI-3", "OI-4"])
    assert.match(register, new RegExp(id));
});
