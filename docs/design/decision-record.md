# Design Decision Record — bootstrap stack

**Provenance.** This is the `design-arbiter` output of the bootstrap design cycle
(2026-08-01, step 13 of the run, agent `a5c2b351`), transcribed verbatim from the raw run
record kept in the kit repository at
`research/live-runs/2026-08-01-translit55-bootstrap.md`. It is stored here because the ADR
derived from it is a retelling, and the retelling is where seven of its fifteen acceptance
criteria went missing. Nothing below has been edited; where the record has since been
acted on, that is recorded in `docs/decisions/0002-restore-the-dropped-gates.md`, not here.

---

# Design Decision Record: translit55 — bootstrap stack

## Decision

**Chosen: A — TypeScript on Node 22 → npm.**

Three things decide it, and only the first two are settled evidence.

1. **C4 is the product's hardest constraint, and B fails it silently.** `verified` in round 1: Python's text I/O is locale-dependent, and under `LC_ALL=en_US.ISO8859-1` the same input produced untransliterated bytes with **exit 0**. C4 says "same input, same bytes out … under any locale". A defect that fails _open_ at the deliverable's boundary is categorically worse than one that fails loudly, and it is a property of the runtime's stdout wrapper meeting the user's environment — we would have to remember to defend against it at every entry point, forever. Node's stdio is UTF-8 unconditionally.
2. **Install reality on the owner's machine** (verified by me on disk, see below): Node 22 is present and default; Python 3.13 exists only as an _unlinked Homebrew keg_ carrying a PEP 668 marker, with no `uv`, `uvx` or `pipx`; Rust is absent entirely. C6 says a stack needing an install must justify it against one that does not. A needs none.
3. **Nothing about the product favours B or C.** Under C8 the deliverable is a dated, quoted decision register plus the resolution's own 76 pairs — a Markdown/JSON artifact any stack can ship. There is no performance argument for C and no ecosystem argument for B that touches the register. C10 forbids the only argument C had left.

The `verified` items above carry the decision. The round-2 items that are still `open` (canonicalization, the negative fixture, the apostrophe rule, DR-004) are **plans nobody has confirmed** — and none of them is a stack question. I agree with the delta pass on that specific point and I checked it against the substance: every one of them is a paragraph in the register or a handful of lines, and each has the same shape in all three candidates.

## Rejected alternatives

- **B — Python 3.13 → PyPI.** Loses on C4 (verified silent locale failure) and on C1/C6 (the owner's own first command does not run without toolchain surgery: `uvx` absent, `pip` blocked by PEP 668). Note the margin honestly: B's locale defect is fixable (`PYTHONIOENCODING`, `reconfigure`), so this is a preference for a _loud_ failure mode over a _silent_ one, not a knockout. The register-as-product would work in Python.
- **C — Rust crate + prebuilt binaries.** Re-killed here on surviving grounds only (see Struck arguments): no `cargo`/`rustup` on the machine, so C6 demands a justification; prebuilt binaries mean a cross-platform release matrix, which is cost paid for speed the product does not need; and C10 removes "it exercises the kit against an unfamiliar stack" as a tiebreak. It loses on merits, not on the dead argument that killed it in round 1.

## Load-bearing claims I verified myself

**V1 — the toolchain facts under C6. Outcome: confirmed, and C6 partly corrected.**

- `/Users/kirilenkovolodimir/.nvm/versions/node/v22.22.1/bin/node` exists; `/Users/kirilenkovolodimir/.nvm/alias/default` contains `22`. Node 22 is present _and default_.
- No `~/.cargo`, no `~/.rustup`, nothing Rust-shaped in `/opt/homebrew/bin` (which holds only `brew`, `markdown_py`, `normalizer`). "No Rust" confirmed.
- Python 3.13 is installed only as `/opt/homebrew/Cellar/python@3.13/3.13.2/…` and is **not linked into `/opt/homebrew/bin`**, and it carries `…/lib/python3.13/EXTERNALLY-MANAGED` (the PEP 668 marker). No `uv`, `uvx` or `pipx` on any standard path. This confirms the adversary's round-1 install findings for B and **corrects C6's phrasing**: the machine does not have a readily runnable Python 3.13, it has a dependency keg.

**V2 — the ICU premise behind the "owned canonicalization table". Outcome: the premise is much weaker than argued, which inverts the proposed remedy.**
`/Users/kirilenkovolodimir/.nvm/versions/node/v22.22.1/include/node/config.gypi:465` reads `"icu_small": "false"` and line 469 `"icu_ver_major": "78"` — this Node 22 is a **full-ICU** build, so `String.prototype.normalize('NFC')` is real here, as it is in every official Node distribution. The no-ICU case is a `--without-intl` self-build. Meanwhile the owned 52-row table is `open` with a reproduced counterexample against it. So the evidence now points the other way: use `normalize('NFC')` and add a runtime capability test that fails loudly, rather than owning a normalizer. Recorded as open item OI-1, not as a stack question.

**V3 — "branch protection is genuinely unavailable". Outcome: could NOT verify, and its premise has expired.**
`/Users/…/translit55/.git/config` has **no remote at all** — the repository is local-only, so C11's "this repository is public" is itself a `proposed` item, not a fact. The round-2 verification was performed under the private-repo premise that C11 replaced, and I have no network to re-check GitHub's plan matrix for public repositories. **Do not cite "branch protection is unavailable" as evidence.** The design instruction survives anyway, because C11 states it by owner decree ("branch protection is NOT assumed"), not by evidence.

Not re-verified by me (no Bash in this role, stated so nobody mistakes assent for confirmation): the `process.exit` truncation measurements, the `exitCode` delivery of 100000 lines, the EPIPE status-swallowing residual, the `Ки́їв → Kýyiv` neighbour witness, and the uklatn zero-divergence run. All are round-1/round-2 `verified` items with reproduction procedures; I am taking them at the delta pass's word and marking them as such.

## Struck arguments — dead, do not cite

- **"Release assets on a private repo are not publicly downloadable" (the round-1 killer for C).** Dead: C11 makes the repository public. C is rejected above on other grounds.
- **"npm provenance is impossible from a private source repo."** Dead by C11 — and C11 forbids arguing provenance _for_ A either. It was never a constraint. Both directions are struck.
- **"Branch protection is genuinely unavailable."** Struck as a _fact_ (see V3). The design constraint stands on C11's wording alone.
- **The differential harness against uklatn.** Dead by its own inertness: zero divergences over the 76, so it can never fail and therefore protects nothing. Replaced by the three gates. Research §5.3 independently says uklatn's corpus encodes _their_ answers to §3 — it can only ever be a neighbour snapshot, never ground truth.

## Residual risks (knowingly accepted)

- **OBJ-9 — the B→A margin is thinner than argued, and no code exists yet.** Bound: if the four open items prove harder than claimed, the stack is not the cause and re-litigating it would waste the cycle. The only revisit trigger is a _product_ failure of C4 on Node.
- **The pinned-neighbour gate puts Python and a PyPI fetch on the per-PR path.** Bound: a network or PyPI outage, or any `translitua` release, reds a pull request that changed nothing — and the failure looks like our bug. Mitigation carried into implementation notes: commit the neighbour snapshot, have the per-PR job read the committed file, and refresh it on a scheduled/manual job.
- **Correctness of normalization depends on the runtime having ICU.** Bound: on a `--without-intl` Node, NFD input (which macOS filesystems hand back — research §4.1) transliterates to `Y̆osypivka` silently. A capability test must fail loudly at test time and the README must state the requirement.
- **C8's existential clause.** If the register is ever dropped, the project has no reason to exist and should be deleted rather than maintained. Accepted as written.
- **Every "the owner decided" carries the proxy-owner asterisk** (`constraints.md:5-10`). Bound: the human may overturn any of C1–C11; C4 and C6 are the two whose reversal would reopen the stack. Cheapest road back is in the ADR's Consequences.
- **The uklatn U+02BC gap is a separate, real upstream obligation** (C8). Bound: it must be filed as an issue and must never be used to justify this project's existence.
- **DR-004 will be positional, and that is legal.** Under C9, deciding a silence is _required_; the risk is not the positional rule, it is a register entry that hides its positionality behind a reframe. Bound: OI-4.

## Acceptance criteria (→ the pull request body)

The project does not exist yet. These are about what the bootstrap ships, not about a finished transliterator.

- [ ] A clean clone builds, typechecks, lints and tests with the script names in `.claude/kit.md`.
      check: `npm ci && npm run build && npm run typecheck && npm run lint && npm test`
- [ ] The Node version is pinned identically in `.nvmrc`, `package.json#engines` and the CI matrix, and it is 22.
      check: `node scripts/check-node-pin.mjs` (its own unit test feeds a mismatched fixture and asserts a non-zero exit)
- [ ] The official corpus ships as machine-readable data with exactly 76 entries, each carrying Cyrillic, Latin and a citation to its place in the document.
      check: `node -e "const a=require('assert'),c=require('./corpus/kmu55-official.json');a.strictEqual(c.length,76);c.forEach(r=>a.ok(r.cyrillic&&r.latin&&r.source));"`
- [ ] Every corpus pair appears verbatim in `docs/research-kmu55.md` §5.1 — the corpus cannot silently drift from the primary source.
      check: `npm run check:corpus-provenance` (ships with a negative fixture: a copy with one row altered, which the script must reject)
- [ ] The register skeleton exists and every row carries id, date, the decision, the quoted evidence, the rejected alternative and a status; no row may be blank in any of those fields.
      check: `npm run check:register` (negative fixture: a row with an empty `rejected` field must fail)
- [ ] No neighbour implementation is cited as ground truth anywhere in the corpus or the register.
      check: `bash -c '! rg -q "uklatn|translit-ua" corpus/ docs/register.md'`
- [ ] `process.exit(` appears nowhere in shipped source or the CLI entry point.
      check: `bash -c '! rg -q "process\.exit\(" src bin'` (the guard's own test points it at `test/fixtures/negative/uses-process-exit.ts` and asserts rejection)
- [ ] The piped-output contract has an executable test: a large write to a downstream that closes early delivers every line, and the `process.exit` variant in the negative fixture demonstrably loses lines.
      check: `npm run test:cli-pipe`
- [ ] The EPIPE handler does not mask failure: a run that fails while the downstream closes early is observed as non-zero under `set -o pipefail`.
      check: `npm run test:cli-pipe` (dedicated case; this is the round-2 residual with the six-line fix)
- [ ] CI invokes exactly the script keys named in `.claude/kit.md`, so CI and a local session run the same thing.
      check: `node scripts/check-ci-parity.mjs` (negative fixture: a workflow with an inlined command instead of the script key must fail)
- [ ] The release workflow cannot fire from a branch push or a pull request — publishing is tag- or dispatch-gated only.
      check: `node scripts/check-release-trigger.mjs`
- [ ] Licensing and attribution are in place: MIT for the code, and the CC BY 4.0 attribution for the rada.gov.ua text carried with the corpus.
      check: `node scripts/check-attribution.mjs`
- [ ] The repository is genuinely public and the register is world-readable without an account.
      manual: publish the repo, then fetch `https://raw.githubusercontent.com/<owner>/translit55/main/docs/register.md` with an unauthenticated `curl -o /dev/null -w '%{http_code}'` → evidence: the URL and the observed `200` pasted into the PR body. (Required because I verified there is no git remote yet — C11 is currently a plan.)
- [ ] The npm publish token exists, is scoped to publish only, and its creation is written down.
      manual: create the granular token, store it as an Actions secret, record scope and date in `RELEASING.md` → evidence: the `RELEASING.md` entry linked from the PR body. (A secret's existence is not observable from the repo, and `.npmrc` is in `SECRET_PATHS` — it must never be committed.)
- [ ] The four open items below are filed as issues and linked from the PR body.
      manual: `/create-issue` for OI-1…OI-4 → evidence: the issue numbers in the PR body and in the ADR's open-items section.

## Risk flags (→ the pre-merge audit)

- **HIGH_RISK_PATHS** — yes. The bootstrap creates `.github/workflows/` (CI and release). Every workflow change needs the `[ci-change]` discipline from the start, not retrofitted.
- **SECURITY_SYMBOLS** — yes, `token`. The npm publish token, its scope, and its storage as an Actions secret. Adjacent: `.npmrc` is in `SECRET_PATHS`; the npm setup must not write one into the repo.
- **MONEY_SYMBOLS** — not touched.
- **DESTRUCTIVE_SQL** — not touched (no database).

## Implementation notes

1. **Publish the repository first.** Everything downstream — free Actions minutes, the world-readable register, the raw-URL criterion — depends on C11 being a fact rather than a plan. It is currently a plan: there is no git remote.
2. **Then the floor:** `kit init` profile, `.nvmrc`/`engines`/CI matrix all pinned to 22, the script keys, the guards. Get `check:ci-parity` green before any product code exists, so the two can never drift.
3. **Then the corpus, before any transliteration code.** All 76 pairs as data, with the provenance check and its negative fixture. This is the artifact under C8; the code is downstream of it.
4. **Then the register skeleton**, with the rows the cycle already produced, each carrying its rejected alternative. Add the C9 framing at the top: contradicting the printed table is a bug, deciding its silences is required.
5. **Then the CLI shell** — `process.exitCode` only, the EPIPE handler with the round-2 six-line fix, and the pipe test with its negative fixture. Do this before the transliterator so the fixture cannot be quietly weakened to make a later failure go away.
6. **Normalization:** default to `String.prototype.normalize('NFC')` plus a startup/test capability probe, not an owned table (V2). If the owned table survives review anyway, it must implement decomposition, canonical ordering by combining class, and the blocking rule — the naive 52 rows are already known wrong.
7. **Gate placement:** commit the neighbour snapshot as a file. The per-PR job reads the file; a scheduled or manually dispatched job refreshes it and opens a PR when it changes. This keeps Python and PyPI off the per-PR path while keeping the witness the gate earned its place with.
8. **Watch for:** any check that cannot fail. Two of the criteria above exist specifically because the cycle already produced one false green (`@ts-expect-error`) and one inert gate (the uklatn diff). Every new guard ships with the fixture that proves it bites.

## Open items inherited by the first feature branch

**No `blocker` remained open after the final round, so this is not a stack escalation.** These four are implementation-level, they were argued and left `open`, and they must not evaporate. The first feature branch owns them.

- **OI-1 — canonicalization.** The owned table is not NFC: `И + U+0301 + U+0306` is blocked (both marks are combining class 230), so real NFC leaves it decomposed while a naive 52-row table composes it to `Й`. Also the ICU startup assertion contradicts its own purpose and throws `ReferenceError: process is not defined` in a non-Node consumer. My V2 evidence recommends `normalize('NFC')` + capability probe instead. Whatever wins, the decision goes in the register.
- **OI-2 — false-green negative fixture.** The brand chain genuinely works (stage skipping _and_ reordering are compile errors), but its `@ts-expect-error` fixture stays green when `fold(...)` is renamed to `foldTYPO(...)`, because the directive swallows "cannot find name". Six-line remedy already verified; apply it and add the rename as a mutation test.
- **OI-3 — the unstated apostrophe rule.** Does a restored punctuation apostrophe reset word-initial state? `1'їжак` → `1'yizhak` or `1'izhak`. Four target cases pass without answering it, and it changes output on real input. Register it with evidence and the rejected alternative.
- **OI-4 — DR-004 is positional and must say so.** The same code point U+0027 is classified differently in `Мар'яна` and `Мар''яна`, and `О'Коннор → OKonnor` is decided by position. C9 _permits_ this — deciding a silence is required — but the register entry must state plainly that the rule is positional rather than reframe it as something else. A register that hides the shape of its own decision is the one failure mode C8 cannot survive.

---

Цей запис треба закріпити як ADR — я маю лише Read/Grep/Glob і не можу писати. Виклич `/write-adr` і збережи його як `/Users/kirilenkovolodimir/Desktop/Personal projects/translit55/docs/decisions/0001-stack.md`, за шаблоном `/Users/kirilenkovolodimir/Desktop/Personal projects/claude-kit/docs/decisions/0000-template.md`. Файли, на які спирається рішення: `/Users/kirilenkovolodimir/Desktop/Personal projects/translit55/.claude/constraints.md`, `/Users/kirilenkovolodimir/Desktop/Personal projects/translit55/docs/research-kmu55.md`, `/Users/kirilenkovolodimir/.nvm/versions/node/v22.22.1/include/node/config.gypi` (рядки 465, 469), `/Users/kirilenkovolodimir/.nvm/alias/default`, `/opt/homebrew/Cellar/python@3.13/3.13.2/Frameworks/Python.framework/Versions/3.13/lib/python3.13/EXTERNALLY-MANAGED`.
