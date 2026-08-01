# Constraints

What the owner decided. Verbatim, not summarised.

**Provenance — read this before trusting the entries below.** The bootstrap skill forbids
an agent from answering its four mandatory interview questions. In this run the human
delegated the owner role explicitly ("invent an interesting task and run it"), so the
answers below were written by the agent acting as proxy owner on 2026-08-01. They are a
deliberate deviation from the skill, recorded here rather than hidden, and every later
claim that "the owner decided X" carries this asterisk.

- **C1** (proxy owner, 2026-08-01) — Two audiences, one artifact. The first is _me_: a
  command I run on a file or a piped string. The second is other developers who import it
  as a library. Strangers must be able to use it without asking me for access, and without
  me operating anything: no server, no API, no account, no support inbox.
  Knock-ons: whatever ships must be installable by someone who has never spoken to me.
- **C2** (proxy owner, 2026-08-01) — Correctness is defined by the official table in
  Cabinet of Ministers of Ukraine resolution 55 of 27 January 2010, not by what looks
  right. Where the standard is context-dependent it must be followed to the letter,
  including `зг → zgh` and the word-initial forms of `є ї й ю я`.
  Knock-ons: the table is the specification, so the tests need the real text of the
  resolution rather than someone's blog summary; a rule the standard does not state is a
  bug even if it produces prettier output.
- **C3** (proxy owner, 2026-08-01) — Transliteration is one-way and lossy, and I do not
  want that hidden. The soft sign and the apostrophe vanish; `Мар'яна` and `Марʼяна` and
  `Марьяна` are not all the same word but they can transliterate alike.
  Knock-ons: nothing may promise a round trip; any API that looks reversible is a lie.
- **C4** (proxy owner, 2026-08-01) — Same input, same bytes out. On my laptop, in CI, on a
  stranger's machine, under any locale, in any year.
  Knock-ons: no locale-dependent case mapping, no map iteration order, no dependency that
  can change behaviour under a minor version bump.
- **C5** (proxy owner, 2026-08-01) — My repositories are private by default and I am on
  the GitHub Free plan. I will not pay for hosting, for a registry, or for CI minutes
  beyond the free allowance.
  Knock-ons: branch protection is unavailable on a private repository on Free, so CI and
  the local guards are the only gates.
- **C6** (proxy owner, 2026-08-01) — Installing a language toolchain on this machine is
  acceptable if the choice earns it. Today the machine has Node 22 and Python 3.13;
  Homebrew is available. There is no Go and no Rust.
  Knock-ons: a stack that needs an install must justify it against one that does not.
- **C7** (proxy owner, 2026-08-01) — Not in v1: reverse transliteration (Latin back to
  Cyrillic), any other standard (BGN/PCGN, ISO 9, ГОСТ), any language other than
  Ukrainian, a web page, and an HTTP API.

## Appended later

- **C8** (proxy owner, 2026-08-01, in answer to the adversary's blocker OBJ-1) — The
  adversary is right that another transliteration table is not worth building: `uklatn`
  (MIT, on npm/PyPI/crates.io, twelve languages) already passes every discriminating case
  in the official corpus. So the product is **not** "a transliteration library". It is a
  library whose answer to every question the resolution leaves open is an explicit,
  dated, quoted decision — because the two serious implementations that exist disagree on
  exactly those questions and neither writes its answers down. The conformance corpus is
  the resolution's own 76 worked pairs; the decision register is the deliverable that
  makes this different from a fork.
  Knock-ons: a change to any registered decision is a breaking change and must be
  released as one; if the register is ever dropped, this project has no reason to exist
  and should be deleted rather than maintained. Fixing `uklatn`'s missing U+02BC upstream
  is a separate, real obligation — file it, do not use it as a justification here.
- **C9** (proxy owner, 2026-08-01, amending C2 after the adversary escalated it) — C2 as
  written was unsatisfiable: it called any rule the standard does not state a bug, and
  the standard is silent on roughly eight things an implementation cannot avoid deciding.
  C2 now means: contradicting the printed table or its three notes is a **bug**; deciding
  what the document leaves silent is **required**, and must be recorded in the decision
  register with the evidence for it and the alternative that was rejected.
  Knock-ons: C4's "same bytes in any year" attaches to the register, not to a rule
  somebody wrote once and nobody wrote down.
- **C10** (proxy owner, 2026-08-01, in answer to the adversary's process note) — "It
  exercises the kit against an unfamiliar stack" is not a tiebreak and must not decide
  the stack. If a stack wins, it wins on this product's merits; the kit test is recorded
  as a bonus where it happens to apply.
- **C11** (proxy owner, 2026-08-01, answering ESC-2 as reframed by the delta pass) — This
  one repository is **public**. C5 said private _by default_, and the default loses here:
  under C8 the product is an auditable decision register, and a register nobody can read
  is a claim rather than an artifact. Public also makes GitHub Actions free on standard
  runners, so C5's money clause is strengthened, not weakened.
  Knock-ons: the source, the register, the corpus and the whole review history are world
  readable, which is the point; npm provenance becomes available, though the delta pass is
  right that provenance was never a constraint and must not be argued as one; branch
  protection is NOT assumed — the design must hold with CI and the local guards as the
  only gates, exactly as C5's knock-on says.
