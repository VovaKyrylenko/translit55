# Decision register

The resolution prints a table and three notes. It does not answer everything an
implementation must answer. Under C9: **contradicting the printed table or its notes is a
bug; deciding what the document leaves silent is required** — and every such decision is
recorded here, with the evidence, the rejected alternative, and a witness input that tells
the two apart.

A row whose decided output equals its rejected output is not a decision. The test suite
fails on such a row, because a register full of distinctions that make no difference is
how this artifact would rot into decoration.

Changing a row's decision or its witness is a **breaking change**: supersede the row, keep
the old one, bump major.

Status: `seeded` means the row was written during the bootstrap design cycle and its
implementation lands on the first feature branch.

| id      | question                               | resolution says                                                        | decision                                                                                                                            | rejected alternative                              | witness → decided / rejected                               | status |
| ------- | -------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------- | ------ |
| DR-001  | Is a hyphen a word boundary?           | silent — the resolution has no hyphenated example at all               | yes, for a named set: U+002D U+2010 U+2011 U+2012 U+2013 U+2014 U+2212                                                              | no                                                | `Гоголь-Яновський` → `Hohol-Yanovskyi` / `Hohol-ianovskyi` | seeded |
| DR-002a | All-uppercase input                    | silent — every printed example is Title Case                           | uppercase the whole replacement                                                                                                     | mixed form                                        | `ЗГОРАНИ` → `ZGHORANY` / `ZGhORANY`                        | seeded |
| DR-002b | Mixed-case run                         | silent                                                                 | case of each replacement follows its source character                                                                               | lookahead-driven `ZGh` (what uklatn emits)        | `ЗГорани` → `ZGHorany` / `ZGhorany`                        | seeded |
| DR-003  | Which code points are "the apostrophe" | silent — a 2010 resolution names no code points                        | U+0027 U+2019 U+02BC U+2018 U+0060 U+02B9 U+2032 U+00B4                                                                             | U+0027 and U+2019 only (what uklatn does)         | `Мар'яна` with U+02BC → `Mariana` / `Marʼiana`             | seeded |
| DR-004  | Which apostrophes does Note 2 delete   | Note 2 says deletion, with no positional condition                     | **positional**: a candidate is the orthographic apostrophe when both neighbours are Ukrainian letters; then deleted unconditionally | non-positional: delete every candidate everywhere | `' ім'я` → `' imia` / ` imia`                              | seeded |
| DR-005  | Lowercase word-initial `є ї й ю я`     | silent — no lowercase-initial form is printed                          | word-initial form regardless of case                                                                                                | non-initial form                                  | `яблуко` → `yabluko` / `iabluko`                           | seeded |
| DR-007  | Non-Ukrainian Cyrillic `ы ъ э ё`       | silent — they have no row                                              | pass through unchanged, and do **not** reset word-initial state                                                                     | reset word-initial state                          | `подъїзд` → `podъizd` / `podъYizd`                         | seeded |
| DR-008  | Digits, Latin, punctuation             | silent — outside Note 3's stated scope                                 | pass through; `.` resets word-initial state                                                                                         | `.` does not reset                                | `Петренко.Євген` → `Petrenko.Yevhen` / `Petrenko.yevhen`   | seeded |
| DR-009  | Rule application order                 | silent                                                                 | longest match first: `зг` before `з`/`г`, `щ` before `ш`/`ч`                                                                        | shortest first                                    | `Зґарда` → `Zgarda` / `Zgharda`                            | seeded |
| DR-010  | Combining acute U+0301                 | silent — Note 3 says each _letter_ is rendered; a mark is not a letter | strip before mapping                                                                                                                | retain (what uklatn and translit-ua do)           | `Ки́їв` → `Kyiv` / `Kýyiv`                                  | seeded |

## Open items inherited from the bootstrap

These were argued in the design cycle and left open on purpose; the first feature branch
owns them. They are issues, not table rows, until they are decided.

- **OI-1** Canonicalization: `normalize('NFC')` plus a capability probe, or an owned table.
  The owned table is known wrong as first drafted — `И + U+0301 + U+0306` blocks the breve,
  so a naive composition table produces `Й` where real NFC does not.
- **OI-2** The `@ts-expect-error` negative fixture has a false green: renaming `fold` to
  `foldTYPO` keeps the build passing, because the directive swallows "cannot find name".
- **OI-3** Does a restored punctuation apostrophe reset word-initial state?
  `1'їжак` → `1'yizhak` or `1'izhak`. Unstated, and it changes output on real input.
- **OI-4** DR-004 above is positional and says so. It must keep saying so — an earlier
  draft reframed it as being about identity, which hid the shape of the decision.

## Attribution

The text of the resolution and its worked examples are from
<https://zakon.rada.gov.ua/laws/show/55-2010-%D0%BF/print>, published by the Verkhovna Rada
under CC BY 4.0. `corpus/kmu55-official.json` reproduces its 76 worked pairs.
