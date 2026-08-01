# translit55

Official Ukrainian transliteration — Cabinet of Ministers of Ukraine resolution **№ 55 of
27 January 2010** — as a library and a CLI, with **every question the resolution leaves
open written down**.

> **Status: bootstrap.** The repository, its corpus, its decision register and its CLI
> contract exist and are tested. The transliterator itself does not — it lands on the first
> feature branch, deliberately after the artifacts it will be checked against.

## Why this exists when `uklatn` already does

[`uklatn`](https://github.com/paiv/uklatn) is good, MIT-licensed, and reproduces all 76
worked pairs the resolution prints. If you need transliteration today, use it.

This project exists for a narrower reason. The resolution prints a table and three notes,
and is **silent** on roughly ten things any implementation must decide: whether a hyphen
starts a new word, what an all-uppercase run becomes, which of the eight code points people
type as an apostrophe count, what happens to a combining acute. The two serious
implementations disagree on exactly those questions, and neither writes its answers down.

Here they are in [`docs/register.md`](docs/register.md): one row per silence, with what the
resolution says, the decision, the rejected alternative, and a **witness input whose two
readings differ**. A row whose readings agree fails the test suite. Changing a row is a
breaking change.

## The two tiers of correctness

- [`corpus/kmu55-official.json`](corpus/kmu55-official.json) — the 76 pairs printed in the
  resolution. Ground truth: it can prove the code wrong. Never edited to match an
  implementation, and a test asserts every pair still appears verbatim in the researched
  text of the primary source.
- The register's witnesses — self-consistency. They can prove the code _undocumented_, not
  wrong, because the standard is silent there.

The engine imports neither. A checker that reads the same data as the thing it checks
agrees with it by construction.

## Use

```sh
npx translit55 names.txt      # not yet — see Status above
```

## Develop

```sh
npm ci && npm test
```

`docs/research-kmu55.md` is the primary-source record — the resolution's text, its notes
verbatim, what it does not settle, and the Unicode findings. It is excluded from the
formatter on purpose: reformatting it would silently rewrite quoted material.

## Licence

MIT for the code. The text of the resolution and its worked examples come from
[zakon.rada.gov.ua](https://zakon.rada.gov.ua/laws/show/55-2010-%D0%BF/print), published by
the Verkhovna Rada under CC BY 4.0.
