# 0002: The gates the bootstrap dropped, restored as executable checks

Status: accepted
Date: 2026-08-02

## Context

The bootstrap design cycle's arbiter issued **fifteen** acceptance criteria, each with a
`check:` command or a `manual:` line. The decision record written from it,
[0001](0001-stack.md), carries **seven**. Nobody decided to drop the other eight; they went
missing in the retelling between the arbiter's output and the ADR, and the loss was invisible
because the ADR looks complete on its own.

The arbiter's record is now kept verbatim at `docs/design/decision-record.md`, so the two
can be compared. What was lost:

- the Node pin being identical in `.nvmrc`, `engines` and the workflow;
- CI invoking exactly the script keys the profile names;
- the release workflow being unreachable from a branch push or a pull request;
- the MIT/CC BY 4.0 attribution;
- no neighbour implementation cited as ground truth;
- the EPIPE handler not masking a failure already in flight;
- the four open items being filed as issues.

Two of these — the release trigger and CI parity — were the only executable defences
against a class of defect the first live run of this kit had already produced. The
release workflow has been unguarded since the bootstrap: nothing in the repository would
have noticed a `pull_request` trigger being added to it.

A post-mortem of the run also found that three of the seven criteria that _did_ survive
share one `check: npm test`. A command shared by three criteria cannot say which of them
broke.

## Decision

Restore the dropped criteria as scripts under `scripts/`, each with a negative fixture in
`test/gates.test.mjs` that proves it refuses:

| gate                         | what it refuses                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `check-ci-parity.mjs`        | a workflow step that inlines a command instead of naming a profile script key                   |
| `check-release-trigger.mjs`  | a release workflow reachable from a pull request or from any branch                             |
| `check-node-pin.mjs`         | `.nvmrc`, `engines.node` and the workflow disagreeing about the Node version                    |
| `check-attribution.mjs`      | the MIT licence or the CC BY 4.0 attribution of the resolution's text going missing             |
| `check-ground-truth.mjs`     | a register row whose _decision_ or _what the standard says_ rests on a neighbour implementation |
| `extract-corpus.mjs --check` | a corpus that no longer matches a fresh extraction from the primary source                      |

The gates run inside `npm test`, so CI exercises them without a new workflow step and
without a script key the profile does not name.

`check-ground-truth` is deliberately **not** the arbiter's literal
`! rg -q "uklatn|translit-ua" corpus/ docs/register.md`. That check would fail on the
shipped register for the one reason that is allowed: the register names both neighbours in
its `rejected alternative` and `witness` columns, which is the opposite of citing them as
truth. Written per column, the gate can be both true and enforced — a criterion reshaped to
be _checkable_, not reshaped to be _easy_.

## Alternatives considered

- **Amend 0001 in place.** Rejected: an accepted record is never edited, because the point
  of the record is what was believed when. The loss is part of the history and belongs in a
  new record that says so.
- **Run the gates as separate CI steps.** Rejected: every step that is not a profile script
  key is exactly what `check-ci-parity` exists to forbid, and adding a key per gate would
  put six near-identical entries in the profile. Running them from the test suite keeps one
  entry point.
- **Restore only the two that matter most** (release trigger, CI parity). Rejected: the
  other four cost an afternoon between them, and the reason to write them down at all was
  that nobody can tell in advance which one fires first.

## Consequences

- `kit doctor` can now compare the arbiter's record with the decision records and fail on
  an unexplained gap. This project is the first that can be checked that way.
- Six more scripts to maintain. Each is under fifty lines, has one job, and is exercised by
  a fixture — the maintenance cost is real and small, and the alternative was discovering
  the absence of a gate from its consequence.
- The corpus can be regenerated from the primary source by someone who was not in the
  session that produced it. Until now the transformation existed only in one run's memory.
- `kit doctor` will keep warning that three criteria in 0001 share `check: npm test`, and
  that warning is left standing. It is true, 0001 is an accepted record and is not edited,
  and each of those three concerns now also has a criterion below whose command fails only
  for it. A warning that states a fact about the repository is worth more than a silenced
  one.

## Acceptance criteria

- [x] The Node version is pinned identically in `.nvmrc`, `package.json#engines` and the CI
      workflow, and the workflow reads the pin rather than repeating it.
      check: node scripts/check-node-pin.mjs
- [x] CI invokes the script keys the profile names, and no step inlines a command.
      check: node scripts/check-ci-parity.mjs
- [x] The release workflow cannot fire from a branch push or a pull request.
      check: node scripts/check-release-trigger.mjs
- [x] The MIT licence and the CC BY 4.0 attribution for the resolution's text are in place.
      check: node scripts/check-attribution.mjs
- [x] No neighbour implementation is cited as ground truth in the corpus or as the reason
      for a register decision.
      check: node scripts/check-ground-truth.mjs
- [x] The corpus is byte-identical to a fresh extraction from the researched primary source.
      check: node scripts/extract-corpus.mjs --check
- [x] The CLI contract holds where it is observed rather than where it is convenient: a
      closed pipe exits 141 with an empty stderr, a failure in flight is not masked, an
      unknown flag is a usage error, and a negative fixture proves the assertions can see a
      crash at all.
      check: node --test test/cli-contract.test.mjs
- [x] The corpus cannot silently drift from the primary source, and a tampered pair is
      rejected by a negative fixture.
      check: node --test test/corpus.test.mjs
- [x] Every register row's witness distinguishes the decision from the rejected
      alternative, and a row whose readings agree fails.
      check: node --test test/register.test.mjs
- [x] The four open items inherited from the bootstrap are filed and linked.
      manual: `/create-issue` for OI-1…OI-4 → evidence: issues #2, #3, #4 and #5, linked
      from `docs/register.md`

## Supersedes

None. It restores what [0001](0001-stack.md) lost without changing any decision 0001 made.

## Superseded by

None.
