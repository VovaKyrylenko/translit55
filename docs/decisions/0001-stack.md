# 0001: TypeScript on Node 22, published to npm, with a decision register as the product

Status: accepted
Date: 2026-08-01

## Context

`translit55` transliterates Ukrainian to Latin per Cabinet of Ministers resolution 55 of
27.01.2010. Constraints C1–C11 are in `.claude/constraints.md`; the resolution itself,
fetched from the primary source with its three notes and 76 worked pairs, is in
`docs/research-kmu55.md`.

Two rounds of an adversarial design cycle ran, each closed by a delta pass that verified by
running things rather than by arguing. The first pass raised a blocker that nearly ended
the project: **the library already exists** — `uklatn`, MIT, on npm, PyPI and crates.io,
and it reproduces all 76 official pairs with zero divergences. The owner's answer (C8) is
what this project is: not another table, but a library in which every question the
resolution leaves silent is an explicit, dated, quoted decision. The two serious
implementations that exist disagree on exactly those questions and neither writes its
answers down.

## Decision

**TypeScript on Node 22, zero runtime dependencies, published to npm; the repository is
public (C11); the decision register ships as a first-class artifact.**

The register is the deliverable. `docs/register.md` holds one row per silence with the
question, what the resolution says (or that it says nothing), the decision, the rejected
alternative, and a **witness input whose two readings differ**. A row whose readings agree
fails the test suite, because a register full of distinctions that make no difference is
how the artifact would rot into decoration.

## Alternatives considered

- **Python 3.13 → PyPI.** Rejected on C4, verified rather than argued: under
  `LC_ALL=en_US.ISO8859-1` the same input produced untransliterated bytes **with exit code
  0**. A silent locale-dependent failure at the deliverable's boundary is categorically
  worse than a loud one. Compounding it, both stated install commands fail on this machine
  (`uvx` absent; `pip` blocked by PEP 668). Honest margin: the defect is fixable in owned
  code, so this is a preference for a loud failure mode over a silent one, not a knockout.
- **Rust crate + prebuilt binaries.** Rejected on C6 (no toolchain on the machine, and the
  install must earn itself) and on C1 reach (a crate serves Rust importers only). The
  argument that originally killed it — release assets on a private repo are not publicly
  downloadable — **died** when C11 made the repository public, and is struck so nobody
  cites it later.
- **Contributing to `uklatn` instead of building this.** The adversary's own suggestion and
  the strongest alternative. Rejected under C8 because the register cannot be a patch: it is
  a different product with a different promise. The obligation it leaves behind is real and
  is filed as an issue — `uklatn` does not handle U+02BC, which the default macOS Ukrainian
  layout emits.

## Consequences

- Correctness has two tiers that must never merge: the official 76 pairs are ground truth
  and can prove the code wrong; the register's witnesses are self-consistency and can only
  prove the code undocumented. The engine may import neither.
- The CLI's output contract is load-bearing and was measured: a CLI ending in
  `process.exit(0)` delivered 8956 of 100000 lines to a slow reader with exit code 0. The
  shipped CLI uses `process.exitCode` and reserves `process.exit` for the EPIPE handler.
- Going public gains free CI minutes and a readable register. Branch protection is **not**
  assumed — CI and the local guards are the only gates.
- The first npm publish needs a granular token before OIDC can be configured
  (npm/cli#8544); it is created, used once, and revoked.
- Four implementation questions were argued and deliberately left open; they are OI-1…OI-4
  in `docs/register.md` and belong to the first feature branch, not to this bootstrap.
- Every "the owner decided" in `.claude/constraints.md` carries a proxy-owner asterisk: the
  human delegated the interview to the agent for this run. C4 and C6 are the two whose
  reversal would reopen the stack.

## Acceptance criteria

- [x] A clean clone typechecks, lints, checks formatting, tests and builds.
      check: npm run typecheck && npm run lint && npm run format:check && npm test && npm run build
- [x] The corpus holds exactly the 76 printed pairs, each with a citation, and cannot drift
      from the primary source — a tampered pair is rejected by a negative fixture.
      check: npm test
- [x] Every register row's witness distinguishes the decision from the rejected
      alternative; a row whose readings agree fails.
      check: npm test
- [x] The CLI delivers every line to a slow reader, survives a closed pipe without a stack
      trace, and calls `process.exit` in exactly one place — the EPIPE handler.
      check: npm test
- [x] CI runs the same script keys the profile names.
      check: npm run typecheck && npm run lint && npm test
- [ ] The repository is public and the register is readable without an account.
      manual: fetch the raw register URL unauthenticated → evidence: the URL and the
      observed 200 recorded in the pull request body
- [ ] The npm publish token is created, scoped to publish, recorded and revoked after the
      first release.
      manual: record scope and date in RELEASING.md → evidence: the entry linked from the
      release pull request

## Supersedes

None.

## Superseded by

None.
