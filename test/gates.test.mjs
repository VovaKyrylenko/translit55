import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// The gates the arbiter's record asked for and the decision record dropped. Each is
// exercised twice: against this repository, where it must pass, and against a copy with
// exactly one thing broken, where it must fail. The second half is the point — every one
// of these was written to catch a defect nobody would otherwise notice, and a guard that
// has never been seen refusing is a guard nobody has tested.

const GATES = [
  "check-ci-parity",
  "check-release-trigger",
  "check-node-pin",
  "check-attribution",
  "check-ground-truth",
];

const run = (gate, root) =>
  spawnSync("node", [`scripts/${gate}.mjs`, root], { encoding: "utf8" });

// A copy of the repository's checkable surface, so a fixture can break one file without
// touching the working tree.
function sandbox(mutate) {
  const dir = mkdtempSync(join(tmpdir(), "translit55-gate-"));
  for (const p of [
    ".claude",
    ".github",
    ".nvmrc",
    "package.json",
    "LICENSE",
    "corpus",
    "docs",
  ])
    cpSync(p, join(dir, p), { recursive: true });
  mutate(dir);
  return dir;
}

const withSandbox = (mutate, assertion) => {
  const dir = sandbox(mutate);
  try {
    assertion(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

test("every gate passes against this repository", () => {
  for (const gate of GATES) {
    const r = run(gate, ".");
    assert.equal(r.status, 0, `${gate} failed here:\n${r.stderr}`);
  }
});

test("ci-parity fails when a workflow inlines a command instead of naming the script", () => {
  withSandbox(
    (dir) => {
      const f = join(dir, ".github/workflows/ci.yml");
      writeFileSync(
        f,
        readFileSync(f, "utf8").replace(
          "- run: npm run typecheck",
          "- run: npx tsc -b",
        ),
      );
    },
    (dir) => {
      const r = run("check-ci-parity", dir);
      assert.equal(r.status, 1);
      assert.match(r.stderr, /TYPECHECK|npx tsc/);
    },
  );
});

test("release-trigger fails when a pull request can publish", () => {
  withSandbox(
    (dir) => {
      const f = join(dir, ".github/workflows/kit-release.yml");
      writeFileSync(
        f,
        readFileSync(f, "utf8").replace(
          "  push:\n    branches: [main, master]",
          "  pull_request:\n  push:\n    branches: [main, master]",
        ),
      );
    },
    (dir) => {
      const r = run("check-release-trigger", dir);
      assert.equal(r.status, 1);
      assert.match(r.stderr, /pull_request/);
    },
  );
});

test("release-trigger fails when every branch push would publish", () => {
  withSandbox(
    (dir) => {
      const f = join(dir, ".github/workflows/kit-release.yml");
      writeFileSync(
        f,
        readFileSync(f, "utf8").replace(
          "branches: [main, master]",
          'branches: ["**"]',
        ),
      );
    },
    (dir) => {
      const r = run("check-release-trigger", dir);
      assert.equal(r.status, 1);
      assert.match(r.stderr, /\*\*/);
    },
  );
});

test("node-pin fails when .nvmrc and engines disagree", () => {
  withSandbox(
    (dir) => writeFileSync(join(dir, ".nvmrc"), "20\n"),
    (dir) => {
      const r = run("check-node-pin", dir);
      assert.equal(r.status, 1);
      assert.match(r.stderr, /engines\.node/);
    },
  );
});

test("node-pin fails when the workflow repeats the version instead of reading it", () => {
  withSandbox(
    (dir) => {
      const f = join(dir, ".github/workflows/ci.yml");
      writeFileSync(
        f,
        readFileSync(f, "utf8").replace(
          "node-version-file: .nvmrc",
          "node-version: 20",
        ),
      );
    },
    (dir) => {
      const r = run("check-node-pin", dir);
      assert.equal(r.status, 1);
      assert.match(r.stderr, /ci\.yml pins node 20/);
    },
  );
});

test("attribution fails when the corpus loses the licence of its source", () => {
  withSandbox(
    (dir) => {
      const f = join(dir, "corpus/kmu55-official.json");
      const corpus = JSON.parse(readFileSync(f, "utf8"));
      delete corpus.licence;
      writeFileSync(f, JSON.stringify(corpus, null, 2));
    },
    (dir) => {
      const r = run("check-attribution", dir);
      assert.equal(r.status, 1);
      assert.match(r.stderr, /CC BY 4\.0/);
    },
  );
});

test("ground-truth fails when a decision rests on a neighbour implementation", () => {
  withSandbox(
    (dir) => {
      const f = join(dir, "docs/register.md");
      const register = readFileSync(f, "utf8");
      const row = register.split("\n").find((l) => /^\| DR-001/.test(l));
      const cells = row.split("|");
      cells[4] = " because uklatn does it this way ";
      writeFileSync(f, register.replace(row, cells.join("|")));
    },
    (dir) => {
      const r = run("check-ground-truth", dir);
      assert.equal(r.status, 1);
      assert.match(r.stderr, /DR-001/);
    },
  );
});

test("ground-truth fails when the corpus names a neighbour", () => {
  withSandbox(
    (dir) => {
      const f = join(dir, "corpus/kmu55-official.json");
      const corpus = JSON.parse(readFileSync(f, "utf8"));
      corpus.note = `${corpus.note} Cross-checked against uklatn.`;
      writeFileSync(f, JSON.stringify(corpus, null, 2));
    },
    (dir) => {
      const r = run("check-ground-truth", dir);
      assert.equal(r.status, 1);
      assert.match(r.stderr, /corpus/);
    },
  );
});

// The corpus is ground truth, so the transformation that produced it has to be repeatable
// by someone who was not there. It was originally a one-off script that never reached the
// repository.
test("the corpus can be regenerated from the primary source, byte for byte", () => {
  const out = execFileSync("node", ["scripts/extract-corpus.mjs", "--check"], {
    encoding: "utf8",
  });
  assert.match(out, /identical to the committed file/);
});

test("the regeneration check notices an edited corpus", () => {
  const original = readFileSync("corpus/kmu55-official.json", "utf8");
  const tampered = original.replace('"Zghurskyi"', '"Zhurskyi"');
  assert.notEqual(
    tampered,
    original,
    "the fixture must actually change something",
  );
  writeFileSync("corpus/kmu55-official.json", tampered);
  try {
    const r = spawnSync("node", ["scripts/extract-corpus.mjs", "--check"], {
      encoding: "utf8",
    });
    assert.equal(r.status, 1);
    assert.match(r.stderr, /edited by hand/);
  } finally {
    writeFileSync("corpus/kmu55-official.json", original);
  }
});
