# API design decisions

- **One exported function, and it is one-way.** `transliterate(text: string): string`. There
  is no `parse`, no `decode`, no `fromLatin`. Why: C3 — the mapping destroys the soft sign
  and the apostrophe and collides `и`/`й`/`і`/`ї` onto `y`/`i`, so any reverse-looking API
  is a lie the type system would be endorsing.
- **The register is part of the API, not documentation.** `decisions` is exported and the
  CLI has `--decisions`. Why: C8 says the register _is_ the product; an artifact you cannot
  read from the consuming program is a README with extra steps.
- **Errors are values, and there is nothing to throw.** Every input is transliterable —
  unknown characters pass through (DR-007, DR-008). Why: a name-processing library that
  throws on an unexpected code point fails inside somebody's batch job at 3am.
- **No options object in v1.** No "strict mode", no per-standard switch. Why: C7 excludes
  other standards, and an options object is where a one-way tool grows a second behaviour
  nobody tests.
- **Zero runtime dependencies, forever.** Why: C4 — a dependency that changes behaviour
  under a minor bump changes our output, and our output is the product.
