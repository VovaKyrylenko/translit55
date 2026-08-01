# KMU Resolution No. 55 (2010) — Ukrainian → Latin transliteration: authoritative research

Status: complete. Research date: 2026-08-01.

Primary text fetched from zakon.rada.gov.ua; Unicode facts checked with Python's
`unicodedata` (UCD 15.1.0); macOS keyboard layouts read out of the live Text Input Sources
API on macOS 26.5.2; Windows layouts taken from Microsoft's own layout documentation.

Every claim below is labelled: **THE RESOLUTION SAYS** (primary), **IMPLEMENTATIONS
COMMONLY DO** (observed in code), or **I INFER** (my reasoning). Section 7 lists what I
could not establish.

---

## 0. Source provenance

**Primary source (authoritative):**

- Постанова Кабінету Міністрів України від 27 січня 2010 р. № 55 «Про впорядкування
  транслітерації українського алфавіту латиницею».
- Permanent address: <https://zakon.rada.gov.ua/go/55-2010-%D0%BF>
- Full text actually fetched from the print view (the normal page renders the body via
  JavaScript and returns no text to a plain fetcher):
  <https://zakon.rada.gov.ua/laws/show/55-2010-%D0%BF/print>
- Document status as served on 2026-08-01: `Документ 55-2010-п, чинний, поточна редакція —
  Редакція від 12.01.2016, підстава - 1121-2015-п`.
- Official publications named by the database: `Офіційний вісник України від 05.02.2010 —
  2010 р., № 5, стор. 24, стаття 202`; `Урядовий кур'єр від 10.02.2010 — № 25`.
- Amendment history printed in the document header: `{ Із змінами, внесеними згідно з
  Постановами КМ N 185 ( 185-2013-п ) від 13.03.2013 N 415 ( 415-2013-п ) від 12.06.2013
  N 682 ( 682-2014-п ) від 26.11.2014 N 1121 ( 1121-2015-п ) від 23.12.2015 }`
- Licence of the rada.gov.ua content: the site footer states `Весь контент доступний за
  ліцензією Creative Commons Attribution 4.0 International license, якщо не зазначено інше`.

**Corroborating copies (secondary, used only to cross-check that the fetched text matches
what other official hosts publish):**

- Cabinet of Ministers, table page: <https://www.kmu.gov.ua/npas/243262567>
- Central Certification Authority (Міністерство цифрової трансформації):
  <https://czo.gov.ua/translit> — its table matched the rada.gov.ua text row for row.

**Body of the resolution (verbatim, from the primary source):**

> З метою впорядкування транслітерації українського алфавіту латиницею Кабінет Міністрів
> України п о с т а н о в л я є:
> 1. Затвердити таблицю транслітерації українського алфавіту латиницею, що додається.
> { Пункт 2 втратив чинність на підставі Постанови КМ N 1121 ( 1121-2015-п ) від 23.12.2015 }

The operative content of the standard is therefore *only* the table plus its three notes.
There is no other normative prose. (`Пункт 2`, which extended the table to other
resolutions, was repealed in 2015.)

---

## 1. The full table

**Important correction to the brief up front (THE RESOLUTION SAYS):** the table has **32
rows, not 33**. The Ukrainian alphabet has 33 letters; the soft sign `ь` has **no row of
its own** — it is disposed of by Note 2. Any implementation that expects 33 table rows is
working from a misremembered document.

Column headers, verbatim: `Український алфавіт | Латиниця | Позиція у слові | Приклади
написання: українською мовою / латиницею`.

### 1.1 The table exactly as printed

| Український алфавіт | Латиниця | Позиція у слові | Приклади (укр.) | Приклади (лат.) |
|---|---|---|---|---|
| Аа | Aa | | Алушта, Андрій | Alushta, Andrii |
| Бб | Bb | | Борщагівка, Борисенко | Borshchahivka, Borysenko |
| Вв | Vv | | Вінниця, Володимир | Vinnytsia, Volodymyr |
| Гг | Hh | | Гадяч, Богдан, Згурський | Hadiach, Bohdan, Zghurskyi |
| Ґґ | Gg | | Ґалаґан, Ґорґани | Galagan, Gorgany |
| Дд | Dd | | Донецьк, Дмитро | Donetsk, Dmytro |
| Ее | Ee | | Рівне, Олег, Есмань | Rivne, Oleh, Esman |
| Єє | Ye | на початку слова | Єнакієве, Гаєвич | Yenakiieve, Haievych |
| Єє | ie | в інших позиціях | Короп'є | Koropie |
| Жж | Zh zh | | Житомир, Жанна, Жежелів | Zhytomyr, Zhanna, Zhezheliv |
| Зз | Zz | | Закарпаття, Казимирчук | Zakarpattia, Kazymyrchuk |
| Ии | Yy | | Медвин, Михайленко | Medvyn, Mykhailenko |
| Іі | Ii | | Іванків, Іващенко | Ivankiv, Ivashchenko |
| Її | Yi | на початку слова | Їжакевич, Кадиївка | Yizhakevych, Kadyivka |
| Її | i | в інших позиціях | Мар'їне | Marine |
| Йй | Y | на початку слова | Йосипівка, Стрий | Yosypivka, Stryi |
| Йй | i | в інших позиціях | Олексій | Oleksii |
| Кк | Kk | | Київ, Коваленко | Kyiv, Kovalenko |
| Лл | Ll | | Лебедин, Леонід | Lebedyn, Leonid |
| Мм | Mm | | Миколаїв, Маринич | Mykolaiv, Marynych |
| Нн | Nn | | Ніжин, Наталія | Nizhyn, Nataliia |
| Оо | Oo | | Одеса, Онищенко | Odesa, Onyshchenko |
| Пп | Pp | | Полтава, Петро | Poltava, Petro |
| Рр | Rr | | Решетилівка, Рибчинський | Reshetylivka, Rybchynskyi |
| Сс | Ss | | Суми, Соломія | Sumy, Solomiia |
| Тт | Tt | | Тернопіль, Троць | Ternopil, Trots |
| Уу | Uu | | Ужгород, Уляна | Uzhhorod, Uliana |
| Фф | Ff | | Фастів, Філіпчук | Fastiv, Filipchuk |
| Хх | Kh kh | | Харків, Христина | Kharkiv, Khrystyna |
| Цц | Ts ts | | Біла Церква, Стеценко | Bila Tserkva, Stetsenko |
| Чч | Ch ch | | Чернівці, Шевченко | Chernivtsi, Shevchenko |
| Шш | Sh sh | | Шостка, Кишеньки | Shostka, Kyshenky |
| Щщ | Shch shch | | Щербухи, Гоща, Гаращенко | Shcherbukhy, Hoshcha, Harashchenko |
| Юю | Yu | на початку слова | Юрій, Корюківка | Yurii, Koriukivka |
| Юю | iu | в інших позиціях | | |
| Яя | Ya | на початку слова | Яготин, Ярошенко | Yahotyn, Yaroshenko |
| Яя | ia | в інших позиціях | Костянтин, Знам'янка, Феодосія | Kostiantyn, Znamianka, Feodosiia |
| ь | — | | | (Note 2: not rendered) |
| ' (апостроф) | — | | | (Note 2: not rendered) |

Note on the example column: the printed table stacks example words inside one row without
aligning them to the position sub-rows. `Кадиївка — Kadyivka` sits visually in the
`на початку слова` block for `Її` but is in fact a **medial** example (`ї` → `i`);
likewise `Стрий — Stryi` under `Йй`. THE RESOLUTION'S LAYOUT IS AMBIGUOUS HERE; the
transliterations themselves are not.

### 1.2 Pasteable form

Case-invariant one-to-one letters (upper → upper, lower → lower):

```
А→A  а→a      Б→B  б→b      В→V  в→v      Ґ→G  ґ→g      Д→D  д→d
Е→E  е→e      З→Z  з→z      И→Y  и→y      І→I  і→i      К→K  к→k
Л→L  л→l      М→M  м→m      Н→N  н→n      О→O  о→o      П→P  п→p
Р→R  р→r      С→S  с→s      Т→T  т→t      У→U  у→u      Ф→F  ф→f
Г→H  г→h
```

Multi-letter equivalents — the resolution prints **both** cases explicitly, capitalised
form only capitalises the first Latin letter:

```
Ж→"Zh"   ж→"zh"
Х→"Kh"   х→"kh"
Ц→"Ts"   ц→"ts"
Ч→"Ch"   ч→"ch"
Ш→"Sh"   ш→"sh"
Щ→"Shch" щ→"shch"
```

Position-dependent letters — the resolution prints **only two forms per letter**: a
capitalised word-initial form and a lowercase non-initial form. It never prints a
lowercase word-initial form nor a capitalised non-initial form (see §3).

```
Є  word-initial → "Ye"   otherwise → "ie"
Ї  word-initial → "Yi"   otherwise → "i"
Й  word-initial → "Y"    otherwise → "i"
Ю  word-initial → "Yu"   otherwise → "iu"
Я  word-initial → "Ya"   otherwise → "ia"
```

Digraph rule, applied before the single-letter rules:

```
зг → "zgh"   (Зг → "Zgh")
```

Deleted characters:

```
ь → ""       ' → ""
```

---

## 2. The context-dependent rules — the resolution's own notes

Verbatim, all three notes, complete (this is the entire normative commentary):

> _______________
> Примітка:
> 1. Буквосполучення "зг" відтворюється латиницею як "zgh" (наприклад, Згорани - Zghorany,
>    Розгон - Rozghon) на відміну від "zh" - відповідника української літери "ж".
> 2. М'який знак і апостроф латиницею не відтворюються.
> 3. Транслітерація прізвищ та імен осіб і географічних назв здійснюється шляхом
>    відтворення кожної літери латиницею.

Point by point against what was asked:

**(a) Letters with a different word-initial form** — THE RESOLUTION SAYS: `Єє`, `Її`, `Йй`,
`Юю`, `Яя`, five letters, via the `Позиція у слові` column with exactly two stated values:
`на початку слова` ("at the beginning of a word") and `в інших позиціях` ("in other
positions").

THE RESOLUTION DOES NOT DEFINE what "beginning of a word" means. There is no definition
clause anywhere in the document. The only evidence is the worked examples — and they are
decisive on one point (see (c) below).

**(b) The `зг` digraph** — THE RESOLUTION SAYS `zgh`, and states its purpose explicitly:
`на відміну від "zh" - відповідника української літери "ж"` — i.e. to keep `зг` from
colliding with the rendering of the single letter `ж`. Without it, `Розгон` would become
`Rozhon`, indistinguishable from a hypothetical `Рожон`. Stated examples: `Згорани →
Zghorany`, `Розгон → Rozghon`. A third instance sits in the table body itself:
`Згурський → Zghurskyi`.

**(c) Soft sign and apostrophe** — THE RESOLUTION SAYS both are simply not rendered:
`М'який знак і апостроф латиницею не відтворюються`. Nothing is substituted, not even a
placeholder. `Донецьк → Donetsk`, `Троць → Trots`, `Тернопіль → Ternopil`.

Crucially, the apostrophe examples settle a question the notes never address in words:
**an apostrophe does NOT start a new word.** Three primary examples prove it:

- `Короп'є → Koropie` — `є` after the apostrophe takes the *non-initial* form `ie`,
  not `Ye`.
- `Мар'їне → Marine` — `ї` after the apostrophe takes the *non-initial* form `i`, not `Yi`.
- `Знам'янка → Znamianka` — `я` after the apostrophe takes the *non-initial* form `ia`,
  not `Ya`.

This is a direct primary-source answer, not an inference.

**(d) Doubling, `ьо`, `йо`, `ий` endings, geographic vs personal names** — THE RESOLUTION
SAYS **nothing about any of them as rules**. There is no doubling rule, no `ьо`/`йо`
special case, no `-ий` ending rule, and no distinction between geographic and personal
names. Note 3 says the opposite of a special-case system: transliteration is done
`шляхом відтворення кожної літери латиницею` — by rendering *each letter*, one at a time.

What look like such rules are just the mechanical output of the letter-by-letter table:

- `Наталія → Nataliia` — the double `ii` is `і`+`я` = `i`+`ia`, not a doubling rule.
  Same for `Соломія → Solomiia`, `Феодосія → Feodosiia`, `Єнакієве → Yenakiieve`.
- `-ий → -yi`: `Стрий → Stryi`, `Рибчинський → Rybchynskyi`, `Згурський → Zghurskyi` —
  this is just `и`→`y` plus non-initial `й`→`i`, with `ь` deleted. No ending rule exists.
- `ьо` and `йо` have **no worked example in the resolution at all**. Applying the table:
  `ьо` → `o` (soft sign deleted), `йо` → `io` mid-word / `Yo` word-initially
  (`Йосипівка → Yosypivka` is the one primary datum, and it is word-initial). Mid-word
  `йо` (e.g. `Йосипівка` vs `Ковальов`) is UNTESTED BY THE DOCUMENT.
- Note 3 mentions `прізвищ та імен осіб і географічних назв` only to name the *scope of
  application*, not to create two different rule sets. Both example classes are mixed
  freely in the same table cells (`Алушта` and `Андрій` share a row).

---

## 3. What the resolution does NOT settle

Each item below is a decision the implementer must make and document. Where the primary
source *does* settle something that is commonly assumed open, it is marked SETTLED and
moved out of the way first.

### 3.0 Already settled — do not re-litigate

- **Apostrophe is not a word boundary.** SETTLED by three worked examples: `Короп'є →
  Koropie`, `Мар'їне → Marine`, `Знам'янка → Znamianka`. So `Мар'яна → Mariana`, never
  `MarYana`.
- **Space is a word boundary.** SETTLED, if only weakly, by `Біла Церква → Bila Tserkva`
  — the second token is transliterated independently and keeps its capital.
- **`зг` beats `ж`.** SETTLED by Note 1 and by `Згурський → Zghurskyi` inside the table.

### 3.1 Hyphen — UNSETTLED, and it matters

THE RESOLUTION HAS NO HYPHENATED EXAMPLE AT ALL. Not one.

For `Кам'янець-Подільський` the hyphen happens not to matter: `П` has no
position-dependent form, so both readings give `Kamianets-Podilskyi`. The question only
bites when the letter after the hyphen is one of `Є Ї Й Ю Я`:

- `Гоголь-Яновський` (a real surname) → `Hohol-Yanovskyi` if the hyphen starts a new word,
  `Hohol-ianovskyi` if it does not.
- `Нью-Йорк` → `Niu-York` or `Niu-iork`.

I INFER that treating the hyphen as a word boundary is the better default, because
Ukrainian orthography treats hyphenated compounds as two capitalised words and the
resolution's only multi-token example (`Bila Tserkva`) transliterates each token
independently. But this is an inference, not the document.

Second-order: if the hyphen is *not* a boundary, then `Я` after it is a **capital letter in
a non-initial position**, and the resolution prints no such form at all (see 3.4).

### 3.2 All-uppercase input — UNSETTLED

Every example in the resolution is Title Case. There is no all-caps example anywhere, and
the table's `Латиниця` column prints multi-letter values in exactly two forms (`Zh zh`,
`Shch shch`) — an initial-capital form and an all-lowercase form. **There is no all-caps
form in the document.**

So `ЗГОРАНИ` has three defensible outputs and no official one:

- `ZGHORANY` — case-run heuristic: an all-caps source run produces an all-caps result.
- `Zghorany` — capitalise only the first Latin letter of each replacement, from the
  printed `Zgh`.
- `ZGhORANY` — naive per-character capitalisation of the printed form; almost certainly
  wrong but it is what a careless implementation produces.

Same question for `ЩЕРБУХИ` (`SHCHERBUKHY` / `Shcherbukhy` / `SHchERBUKHY`) and `КИЇВ`
(`KYIV` / `KYiV`, since non-initial `ї` prints only as lowercase `i`).

IMPLEMENTATIONS COMMONLY DO: uppercase the whole replacement when the *following* source
character is also uppercase (or when the whole token is uppercase), giving `ZGHORANY`.
That is a convention, not the standard.

### 3.3 "Beginning of a word" when the word starts mid-string — UNSETTLED

The resolution assumes its input is a name, transliterated in isolation. It never defines
a word character. Given a longer string, the implementer must decide which characters
reset the "word-initial" state. Known points:

- apostrophe → **does not** reset (SETTLED, §3.0)
- space → **does** reset (SETTLED, §3.0)
- hyphen → unknown (§3.1)
- start of string → the document's whole premise, so yes
- digits, `.`/`,`/`(`/`"`, underscore, Latin letters adjacent to Cyrillic → **no guidance
  whatsoever**

A specific trap: `U+02BC MODIFIER LETTER APOSTROPHE` has Unicode general category **Lm — a
letter** (verified locally, §4). So a boundary rule written as `\b`, `\w`, or
`str.isalpha()` will treat `Мар'яна` typed with U+02BC as one unbroken word (correct, and
consistent with the resolution) but `Мар'яна` typed with U+0027 (category Po) as two words
(incorrect — it would yield `MarYana`). **The same code gives different answers for the
same visible text depending on which apostrophe the user typed.** This is the single most
likely real-world bug in a naive implementation.

### 3.4 Case forms the table never prints — UNSETTLED

For `Є Ї Й Ю Я` the resolution prints exactly two forms each: **capitalised initial**
(`Ye`, `Yi`, `Y`, `Yu`, `Ya`) and **lowercase non-initial** (`ie`, `i`, `i`, `iu`, `ia`).
The other two quadrants are missing:

- **lowercase word-initial**: `яблуко` → `yabluko` or `iabluko`? Every initial-position
  example in the document is a capitalised proper noun. I INFER `yabluko` (case-map the
  printed `Ya`), and note that Note 3 restricts the standard's scope to names anyway, so
  lowercase-initial is arguably out of scope entirely.
- **uppercase non-initial**: needed for all-caps input and for the hyphen-is-not-a-boundary
  reading. No form exists in the document.

### 3.5 Letters outside the Ukrainian alphabet — UNSETTLED, and unavoidable in practice

`ы ъ э ё` and the rest of Cyrillic have no row. This is not hypothetical: the macOS
Ukrainian layouts I inspected put `э`/`Э` on Alt+`є` and `ё`/`Ё` on Alt of the ґ key
(§4.3), so a Ukrainian user *can and does* type them by accident. Choose: pass through
unchanged, drop, map by analogy, or raise. The resolution offers nothing.

### 3.6 Other things the document leaves open

- **`зг` matches Cyrillic `г` U+0433 only.** `Зґарда` (with `ґ` U+0491) must NOT become
  `Zgharda`; it is `з` + `ґ` = `Zgarda`. THE RESOLUTION DOES NOT SAY THIS, but it follows
  from Note 1 naming the letter sequence `"зг"`, and `Ґґ` being a separate row. I INFER it;
  it is a high-confidence inference and a mandatory test.
- **`зг` has no morphological condition.** `безграмотний → bezghramotnyi`. Note 1 is a pure
  character-sequence rule.
- **`йо` mid-word** has no example (`Йосипівка` is word-initial only). Table-mechanical
  answer: `io`. `ьо` likewise has no example; mechanical answer: `o`.
- **Digits and Latin letters mixed into Cyrillic text** — entirely outside Note 3's stated
  scope (`прізвищ та імен осіб і географічних назв`). Passing them through is the only
  sane behaviour, but it is a library decision, not a standard.
- **The mapping is not invertible** and the resolution never claims it is: `ь` and `'` are
  destroyed, and `и`→`y` collides with word-initial `й`→`Y`, `і`→`i` with non-initial
  `й`/`ї`→`i`. Do not offer a `fromLatin` function without saying it is lossy guesswork.
- **Order of rule application** is not stated. `зг` must be tried before the single-letter
  `з`/`г` rules, and `щ`→`shch` before `ш`/`ч` — obvious to a human, but it must be an
  explicit, tested property, because `Гоща → Hoshcha` and `Гаращенко → Harashchenko` are
  the only guards against a wrong longest-match order.

---

## 4. Unicode traps — verified, not recalled

All code points below were checked on this machine with Python's `unicodedata`
(**Unicode Character Database version 15.1.0**), and the macOS layouts were read out of the
live Text Input Sources API on **macOS 26.5.2 (build 25F84)**.

### 4.1 `й` and `ї` are precomposed characters that DO decompose and DO recompose

| Character | Precomposed | NFD decomposition | NFC recomposes? |
|---|---|---|---|
| `й` | U+0439 CYRILLIC SMALL LETTER SHORT I | U+0438 CYRILLIC SMALL LETTER I + U+0306 COMBINING BREVE | **yes** |
| `Й` | U+0419 CYRILLIC CAPITAL LETTER SHORT I | U+0418 CYRILLIC CAPITAL LETTER I + U+0306 COMBINING BREVE | **yes** |
| `ї` | U+0457 CYRILLIC SMALL LETTER YI | U+0456 CYRILLIC SMALL LETTER BYELORUSSIAN-UKRAINIAN I + U+0308 COMBINING DIAERESIS | **yes** |
| `Ї` | U+0407 CYRILLIC CAPITAL LETTER YI | U+0406 CYRILLIC CAPITAL LETTER BYELORUSSIAN-UKRAINIAN I + U+0308 COMBINING DIAERESIS | **yes** |
| `ґ` | U+0491 CYRILLIC SMALL LETTER GHE WITH UPTURN | **none — it is atomic** | n/a |

Neither `й` nor `ї` is a composition exclusion: `NFC(NFD(c)) == c` for all four, verified.
So **normalising input to NFC is a complete fix** — you do not need to handle the
decomposed forms in the mapping table itself.

Why this is a real trap and not a curiosity: **macOS filesystem APIs hand back NFD**. A
name read from a filename, or pasted out of certain apps, arrives as `И` + combining breve.
Verified locally:

```
NFC  "Йосипівка" = 9 code points
NFD  "Йосипівка" = 10 code points:
     U+0418 U+0306 U+043E U+0441 U+0438 U+043F U+0456 U+0432 U+043A U+0430
```

A char-by-char mapper without normalisation transliterates that as `Y` + a stray U+0306,
producing `Y̆osypivka` — visually almost identical, silently wrong, and it will pass a
careless eyeball review. **Normalise to NFC on entry. Test with NFD input explicitly.**

### 4.2 The apostrophe set — Unicode properties (verified locally)

| Code point | Name | General category | `isalpha()` | matches `\w` | NFKC folds to |
|---|---|---|---|---|---|
| U+0027 | APOSTROPHE | Po (punctuation) | no | no | itself |
| U+2019 | RIGHT SINGLE QUOTATION MARK | Pf (final quote) | no | no | itself |
| U+02BC | MODIFIER LETTER APOSTROPHE | **Lm (letter)** | **yes** | **yes** | itself |
| U+2018 | LEFT SINGLE QUOTATION MARK | Pi (initial quote) | no | no | itself |
| U+0060 | GRAVE ACCENT | Sk (modifier symbol) | no | no | itself |
| U+00B4 | ACUTE ACCENT | Sk | no | no | U+0020 U+0301 |

Two consequences, both verified:

1. **NFKC does not unify them.** U+2019, U+02BC, U+2018 and U+0060 all survive NFKC
   unchanged. You cannot normalise the apostrophe problem away; you need an explicit set.
2. **U+02BC is a letter (Lm).** Any word-boundary logic based on `\w`, `\b` or `isalpha`
   behaves differently for U+02BC than for the other four. See §3.3 — this is the bug.

### 4.3 Which of them do Ukrainian layouts actually produce

**macOS — read directly from the installed layouts on this machine** via
`TISCreateInputSourceList(includeAllInstalled)` + `UCKeyTranslate` (macOS 26.5.2). Three
Ukrainian layouts ship:

| Input source | Localised name | Apostrophe key | Produces |
|---|---|---|---|
| `com.apple.keylayout.Ukrainian-PC` | Українська | backslash key, unshifted | **U+02BC** (shift → U+20B4 ₴) |
| `com.apple.keylayout.Ukrainian` | Українська — класична | grave key (left of 1), unshifted | **U+0027** (shift → `~`) |
| `com.apple.keylayout.Ukrainian-QWERTY` | Українська — QWERTY | quote key, unshifted | **U+02BC** (Alt+quote → U+0027) |

So on macOS **both U+02BC and U+0027 are first-class layout output**, and U+02BC comes from
the layout simply named "Українська" — i.e. the one most Ukrainian Mac users pick. This
alone makes U+02BC support non-optional.

(Incidentally, the same read-out shows `э`/`Э` on Alt+`є` and `ё`/`Ё` on Alt of the ґ key
in the PC and classic layouts — the source of the stray non-Ukrainian Cyrillic in §3.5.)

**Windows — from Microsoft's own layout documentation** (primary vendor source):

| Layout | Page | Apostrophe |
|---|---|---|
| Ukrainian (Enhanced), `kbdur1` | <https://learn.microsoft.com/en-us/globalization/keyboards/kbdur1.html> | key left of `1`, unshifted → **U+0027 APOSTROPHE** (shift → U+20B4 ₴) |
| Ukrainian (legacy), `kbdur` | <https://learn.microsoft.com/en-us/globalization/keyboards/kbdur.html> | **no apostrophe key at all** — that key gives `ё`/`Ё` (U+0451/U+0401) |

That second row explains a lot of the mess: on the legacy Windows Ukrainian layout there is
literally no way to type an apostrophe, so users improvise — switching to a Latin layout for
`'`, typing a backtick, or letting an autocorrect insert a curly quote.

**U+2019 and U+2018** are, on the evidence above, **not produced by any Ukrainian keyboard
layout key**. They arrive from *smart-quote substitution*: macOS "Smart quotes" text
substitution, iOS smart punctuation, Microsoft Word AutoFormat, and most CMS/rich-text
editors, all of which rewrite a typed U+0027 into a curly quote — U+2019 in the usual
intervocalic Ukrainian position (`Мар'яна`), U+2018 when the heuristic guesses "opening"
(apostrophe after a space or at the start of a token, or text pasted from a source that
already had it). SECONDARY/INFERRED: I could not verify the iOS Ukrainian keyboard's
apostrophe code point directly — no iOS device was available to read out, and I found no
Apple primary document naming it. Given that `Ukrainian-PC` on macOS emits U+02BC, iOS most
likely does too, but treat that as unverified.

**U+0060 GRAVE ACCENT** is produced by no Ukrainian layout as an apostrophe. It appears in
the wild as a user workaround (especially from the apostrophe-less legacy Windows layout)
and in ASCII-only data pipelines.

### 4.4 Recommended handling (my recommendation, not the standard)

Accept **all of** U+0027, U+2019, U+02BC, U+2018, U+0060 as "the apostrophe", and also
U+02B9 MODIFIER LETTER PRIME, U+2032 PRIME and U+00B4 ACUTE ACCENT, which turn up in OCR
and legacy-encoding data. Fold them to a single internal apostrophe **before** any
word-boundary decision, so that the Lm/Po category split in §4.2 can never change the
result. Then delete them per Note 2.

Also worth guarding: Cyrillic `і` U+0456 vs Latin `i` U+0069, and Cyrillic `а е і о р с у х`
vs their Latin homoglyphs. Mixed-script input is common in copy-pasted names and will
silently skip transliteration for the Latin-looking characters.

---

## 5. Test cases

### 5.1 From the resolution itself — these are not negotiable

Every pair below is printed in the document. 76 cases. Quoted exactly as they appear.

| # | Cyrillic | Latin | Where in the document |
|---|---|---|---|
| 1 | Алушта | Alushta | Аа row |
| 2 | Андрій | Andrii | Аа row |
| 3 | Борщагівка | Borshchahivka | Бб row |
| 4 | Борисенко | Borysenko | Бб row |
| 5 | Вінниця | Vinnytsia | Вв row |
| 6 | Володимир | Volodymyr | Вв row |
| 7 | Гадяч | Hadiach | Гг row |
| 8 | Богдан | Bohdan | Гг row |
| 9 | Згурський | Zghurskyi | Гг row |
| 10 | Ґалаґан | Galagan | Ґґ row |
| 11 | Ґорґани | Gorgany | Ґґ row |
| 12 | Донецьк | Donetsk | Дд row |
| 13 | Дмитро | Dmytro | Дд row |
| 14 | Рівне | Rivne | Ее row |
| 15 | Олег | Oleh | Ее row |
| 16 | Есмань | Esman | Ее row |
| 17 | Єнакієве | Yenakiieve | Єє row, `на початку слова` |
| 18 | Гаєвич | Haievych | Єє row |
| 19 | Короп'є | Koropie | Єє row, `в інших позиціях` |
| 20 | Житомир | Zhytomyr | Жж row |
| 21 | Жанна | Zhanna | Жж row |
| 22 | Жежелів | Zhezheliv | Жж row |
| 23 | Закарпаття | Zakarpattia | Зз row |
| 24 | Казимирчук | Kazymyrchuk | Зз row |
| 25 | Медвин | Medvyn | Ии row |
| 26 | Михайленко | Mykhailenko | Ии row |
| 27 | Іванків | Ivankiv | Іі row |
| 28 | Іващенко | Ivashchenko | Іі row |
| 29 | Їжакевич | Yizhakevych | Її row, `на початку слова` |
| 30 | Кадиївка | Kadyivka | Її row |
| 31 | Мар'їне | Marine | Її row, `в інших позиціях` |
| 32 | Йосипівка | Yosypivka | Йй row, `на початку слова` |
| 33 | Стрий | Stryi | Йй row |
| 34 | Олексій | Oleksii | Йй row, `в інших позиціях` |
| 35 | Київ | Kyiv | Кк row |
| 36 | Коваленко | Kovalenko | Кк row |
| 37 | Лебедин | Lebedyn | Лл row |
| 38 | Леонід | Leonid | Лл row |
| 39 | Миколаїв | Mykolaiv | Мм row |
| 40 | Маринич | Marynych | Мм row |
| 41 | Ніжин | Nizhyn | Нн row |
| 42 | Наталія | Nataliia | Нн row |
| 43 | Одеса | Odesa | Оо row |
| 44 | Онищенко | Onyshchenko | Оо row |
| 45 | Полтава | Poltava | Пп row |
| 46 | Петро | Petro | Пп row |
| 47 | Решетилівка | Reshetylivka | Рр row |
| 48 | Рибчинський | Rybchynskyi | Рр row |
| 49 | Суми | Sumy | Сс row |
| 50 | Соломія | Solomiia | Сс row |
| 51 | Тернопіль | Ternopil | Тт row |
| 52 | Троць | Trots | Тт row |
| 53 | Ужгород | Uzhhorod | Уу row |
| 54 | Уляна | Uliana | Уу row |
| 55 | Фастів | Fastiv | Фф row |
| 56 | Філіпчук | Filipchuk | Фф row |
| 57 | Харків | Kharkiv | Хх row |
| 58 | Христина | Khrystyna | Хх row |
| 59 | Біла Церква | Bila Tserkva | Цц row |
| 60 | Стеценко | Stetsenko | Цц row |
| 61 | Чернівці | Chernivtsi | Чч row |
| 62 | Шевченко | Shevchenko | Чч row |
| 63 | Шостка | Shostka | Шш row |
| 64 | Кишеньки | Kyshenky | Шш row |
| 65 | Щербухи | Shcherbukhy | Щщ row |
| 66 | Гоща | Hoshcha | Щщ row |
| 67 | Гаращенко | Harashchenko | Щщ row |
| 68 | Юрій | Yurii | Юю row, `на початку слова` |
| 69 | Корюківка | Koriukivka | Юю row |
| 70 | Яготин | Yahotyn | Яя row, `на початку слова` |
| 71 | Ярошенко | Yaroshenko | Яя row |
| 72 | Костянтин | Kostiantyn | Яя row, `в інших позиціях` |
| 73 | Знам'янка | Znamianka | Яя row |
| 74 | Феодосія | Feodosiia | Яя row |
| 75 | Згорани | Zghorany | Примітка 1 |
| 76 | Розгон | Rozghon | Примітка 1 |

Cases 9, 19, 31, 34, 42, 48, 50, 59, 67, 73 and 74 are the ones that actually discriminate
between a correct and a sloppy implementation — keep them if you ever trim the list.

### 5.2 My own constructions — NOT from the document

These are mine. Each names the decision it pins down. Confidence is my judgement.

| Input | Expected | Why, and how confident |
|---|---|---|
| `Мар'яна` | `Mariana` | HIGH. Directly analogous to `Знам'янка → Znamianka` and `Мар'їне → Marine`. Run it with each of U+0027, U+2019, U+02BC, U+2018, backtick — all five must give the same answer. |
| `Кам'янець-Подільський` | `Kamianets-Podilskyi` | HIGH. Apostrophe settled; the hyphen is irrelevant here because `П` has no positional form. Good regression case precisely because it looks hard and is not. |
| `Гоголь-Яновський` | `Hohol-Yanovskyi` | MEDIUM — this is the hyphen decision (§3.1). Alternative `Hohol-ianovskyi`. Both `uklatn` and `translit-ua` produce the `-Yanovskyi` form. Pick one, document it, freeze it. |
| `Нью-Йорк` | `Niu-York` | MEDIUM, same decision as above and far more visible. |
| `Зґарда` | `Zgarda` | HIGH. Negative test for §3.6: the `зг` rule must match `г` U+0433, never `ґ` U+0491. A one-character bug here is invisible in every other test. |
| `безграмотний` | `bezghramotnyi` | HIGH. `зг` is a plain character-sequence rule with no morphological condition. |
| `Ковальов` | `Kovalov` | HIGH. `ьо` has no worked example; this is the table-mechanical result (soft sign deleted). |
| `Воробйов` | `Vorobiov` | MEDIUM. Mid-word `йо` has no example at all in the document. |
| `Йоганнесбург` | `Yohannesburh` | HIGH. Extends `Йосипівка → Yosypivka`. |
| `ЗГОРАНИ` | `ZGHORANY` | LOW — §3.2 is genuinely open. `translit-ua` gives `ZGHUROVSKYI` for `ЗГУРОВСЬКИЙ` but `ZGhurovskyi` for the mixed `ЗГуровский`; `uklatn` gives `ZGHYN` for `ЗГИН`. Decide and document. |
| `КИЇВ` | `KYIV` | LOW. Non-initial `ї` is printed only as lowercase `i`, so the uppercase form is invented either way. |
| `яблуко` | `yabluko` | LOW. Lowercase word-initial (§3.4) is never printed. Arguably out of the standard's scope, since Note 3 limits it to names. |
| `Її` | `Yii` | MEDIUM. Word-initial `Ї`→`Yi` then non-initial `ї`→`i`. Exercises the positional switch inside one short word. |
| `Йосипівка` in **NFD** (`И`+U+0306, 10 code points) | `Yosypivka` | HIGH. §4.1. Without an NFC pass this yields `Y̆osypivka`. The single most valuable non-obvious test. |
| `Мар'яна` with the apostrophe as U+02BC | `Mariana` | HIGH. §4.2/§4.3. This is what a Mac user on the default "Українська" layout actually types, and `uklatn`'s KMU table does not cover it. |
| `` (empty string) | `` | HIGH. |
| `ь` alone / `Ь` alone | `` (empty) | HIGH. Note 2. |
| `'` alone | `` (empty) | MEDIUM. Note 2 says the apostrophe is not rendered, with no positional condition — but `uklatn` deliberately keeps a lone apostrophe (its own test asserts `' ім'я 'жук'` → `' imia 'zhuk'`), on the view that an apostrophe not between two Cyrillic letters is punctuation, not the Ukrainian letter-apostrophe. Defensible, and a real fork in the road. Decide. |
| `вул. Б. Хмельницького, 12` | `vul. B. Khmelnytskoho, 12` | MEDIUM. Digits and punctuation pass through. Outside Note 3's declared scope entirely. |
| `Петренко.Євген` | `Petrenko.Yevhen` | MEDIUM. Is `.` a word boundary? Both surveyed implementations say yes (via regex `\b`). Not in the document. |
| `Ёлка`, `Эдуард`, `подъезд` | undecided | LOW. Non-Ukrainian Cyrillic (§3.5). Choose passthrough / drop / raise and write it down. |

### 5.3 A free extra corpus

`paiv/uklatn` ships a machine-readable KMU test corpus at
<https://github.com/paiv/uklatn/blob/main/src/tests/test_KMU_55.json>, including a full
pangram, a stress-mark (`U+0301`) block, an every-consonant-plus-`я` block, and a
punctuation sweep. It is MIT-licensed. It encodes *their* answers to the open questions in
§3, so treat it as a comparison baseline, not as ground truth.

---

## 6. Existing implementations worth reading

| Project | Language(s) | Licence | `зг`? | Word-initial? | Verdict |
|---|---|---|---|---|---|
| [paiv/uklatn](https://github.com/paiv/uklatn) | 12 (Python, JS, C, Java, .NET, Go, PHP, Elixir, Julia, Swift, Ruby, Rust) | MIT | yes — `Zgh`/`zgh`/`ZGH`/`zGH` | yes, regex `\b` | **Read this one.** Rules are data, not code (`src/regex/uk-uk_Latn_KMU_55.json`): NFC pass, apostrophe deleted only *between two Cyrillic letters* (so the word-initial rule sees `Маряна` and correctly yields `Mariana`), separate case variants driven by lookahead, and stress marks handled. Gap: its apostrophe set is only U+2019 and U+0027 — **no U+02BC**, so the default macOS Ukrainian layout breaks it. |
| [dchaplinsky/translit-ua](https://github.com/dchaplinsky/translit-ua) | Python | MIT | yes — `зг`→`zgh`, `ЗГ`→`ZGh` | yes, regex `\b(є\|ї\|й\|ю\|я)` | Read second. Maintained (last push 2026-07), 67 stars, and it deletes U+0027, U+2019 **and U+02BC** — the one thing it does better than uklatn. Also ships ~25 other romanisation tables, and its ~20 doctests are a ready-made corpus. |
| [yakimka/transliteration-ua](https://github.com/yakimka/transliteration-ua) | Python | MIT | not verified | not verified | Skip. New, zero stars, no advantage over the two above. Listed only so you know it was looked at. |
| [podviaznikov/ua.transliteration](https://github.com/podviaznikov/ua.transliteration) | JavaScript | **none** | claims KMU 55 | — | **Do not use.** No licence file and last touched in 2012. |

The useful conclusion: the two serious implementations agree on everything the resolution
settles, and **disagree on the open questions in §3** — most visibly on all-caps `зг`
(`ZGh` vs `ZGH`) and on which apostrophes count. That disagreement is the strongest
available evidence that §3 lists real gaps in the standard, not gaps in my reading of it.

---

## 7. What I could not establish

- **The iOS Ukrainian keyboard's apostrophe code point.** No iOS device was available to
  read out, and Apple publishes no per-layout character chart comparable to Microsoft's.
  The macOS `Ukrainian-PC` layout emits U+02BC and iOS very likely matches it, but I am
  labelling that an inference. Verify on a device before relying on it. (It changes
  nothing practical: accept the whole apostrophe set regardless.)
- **Whether the 2013–2015 amendments ever touched the table.** The header lists four
  amending resolutions (185-2013-п, 415-2013-п, 682-2014-п, 1121-2015-п) but the served
  text is the consolidated `Редакція від 12.01.2016` and shows only `Пункт 2` being
  repealed. I did not diff the 2010 original against the current edition, so I cannot rule
  out a silent change to a table cell between 2010 and 2016. Low risk — the current
  consolidated edition is the one in force, and it is what §1 reproduces.
- **The official English wording of the notes.** The resolution exists only in Ukrainian on
  rada.gov.ua; every English rendering I saw was a translation by a third party. §2 quotes
  the Ukrainian and translates inline, which is why the Ukrainian is quoted verbatim.
- **Any official ruling on hyphens.** I searched for a subsequent clarification, a
  ministry instruction, or a passport-service guideline that defines "beginning of a word";
  I found none tied to Resolution 55. If one exists it is not linked from the resolution.
- **`yakimka/transliteration-ua`'s actual rule handling.** Metadata only (MIT, Python,
  0 stars). I did not read its source, because the two better options made it moot.
- **Whether the resolution's example-column layout intends `Кадиївка` and `Стрий` as
  word-initial examples.** The fixed-width table stacks examples without aligning them to
  the position sub-rows. The transliterations are unambiguous; the intent of the layout is
  not.
