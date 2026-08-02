# Verification: fix/cli-contract-and-gates

What was run, and what it printed. Executed on 2026-08-02, macOS, Node v22.22.1.

## The pipeline

```
$ npm run typecheck && npm run lint && npm run format:check && npm test && npm run build
> tsc -b --force
> oxlint
> prettier --check .
All matched files use Prettier code style!
# tests 31
# pass 31
# fail 0
> tsc -b
```

`npm test` writes **nothing** to stderr now:

```
$ npm test >/dev/null 2>/tmp/e; wc -l < /tmp/e
       0
$ npm test 2>&1 | grep -c "Unhandled"
0
```

Before this branch the same command printed a full unhandled-`EPIPE` stack trace directly
above `ok 1 - a slow reader still receives every line`. Two producers in the suite were
crashing on a closed pipe; neither was under test, and the assertion could not see either
because it read stdout while the trace went to stderr.

## The contract, observed rather than assumed

```
$ node bin/translit55.js --ouput x >/dev/null 2>&1; echo $?
2
$ node bin/translit55.js /nonexistent 2>&1 >/dev/null
translit55: ENOENT: no such file or directory, open '/nonexistent'
$ node bin/translit55.js /nonexistent >/dev/null 2>&1; echo $?
1
$ node bin/translit55.js --version
0.0.0
```

Before: an unknown flag was treated as a file name, so it exited **1** with "no such file
or directory" against a contract promising 2 — the message named the wrong problem and the
exit code lied to whatever script read it.

## A defect found while fixing another

An unreadable file crashed _after_ reporting itself cleanly:

```
$ node bin/translit55.js --weird            # before
translit55: ENOENT: no such file or directory, open '--weird'
node:events:497
      throw er; // Unhandled 'error' event
      ^
Error: ENOENT: no such file or directory, open '--weird'
    at ReadStream.onerror (node:internal/readline/interface:246:10)
...
Node.js v22.22.1
```

`readline` re-emits its input stream's error on the Interface, and an Interface with no
error listener throws. Both spellings exit 1, which is exactly why the shipped test —
`node bin/translit55.js /nonexistent >/dev/null 2>&1; echo $?` — passed while the CLI was
crashing. The test now asserts the message appears **once** and that no stack trace follows
it:

```
$ node --test test/cli-contract.test.mjs
ok 6 - an unreadable file is reported once, with no stack trace
```

## Each gate, observed refusing

Every restored gate has a negative fixture; the suite runs each one twice, once against
this repository and once against a copy with one thing broken.

```
$ node --test test/gates.test.mjs
ok 1 - every gate passes against this repository
ok 2 - ci-parity fails when a workflow inlines a command instead of naming the script
ok 3 - release-trigger fails when a pull request can publish
ok 4 - release-trigger fails when every branch push would publish
ok 5 - node-pin fails when .nvmrc and engines disagree
ok 6 - node-pin fails when the workflow repeats the version instead of reading it
ok 7 - attribution fails when the corpus loses the licence of its source
ok 8 - ground-truth fails when a decision rests on a neighbour implementation
ok 9 - ground-truth fails when the corpus names a neighbour
ok 10 - the corpus can be regenerated from the primary source, byte for byte
ok 11 - the regeneration check notices an edited corpus
# pass 11
# fail 0
```

The closed-pipe assertion is itself checked by a fixture, because that is the assertion
that was broken:

```
ok 2 - a closed pipe is not a crash                  (status=141, stderr empty)
ok 3 - the closed-pipe assertion can see a crash     (fixture with no handler → EPIPE)
```

The first version of the rewritten test drove the pipeline through the parent process
instead of a real shell pipeline. It hung, because the CLI's stdout stayed connected to the
parent and never saw the closed pipe — a test that would have measured nothing while
looking thorough. It is a real `bash` pipeline now, with the CLI's stderr captured to a
file so it can be asserted on.

## The corpus is reproducible again

```
$ node scripts/extract-corpus.mjs --check
extract-corpus: 76 pairs, identical to the committed file
```

The original extraction script was never committed, so the transformation between the
primary source and the project's ground truth existed only in one session's memory. The
first run of the reconstructed script differed from the committed corpus in exactly one
respect — backticks around the positional labels (`` `на початку слова` ``) — which is
markdown, not part of the citation. Stripping them makes the two byte-identical.

## kit doctor

```
$ kit doctor
PASS  acceptance-criteria          14 with a command, 3 manual — all resolvable
WARN  criteria-distinct            1 check command(s) are shared by several criteria
                                   3 docs/decisions/0001-stack.md npm test
PASS  criteria-fidelity            15 in the arbiter's record, 17 carried, 0 recorded as dropped
doctor: 27 checks, 0 failed, 1 warnings
```

The warning is true and is left standing: 0001 is an accepted record and is not edited. The
fidelity check now has something to compare against, because the arbiter's own record is
kept at `docs/design/decision-record.md` instead of existing only inside a transcript.

## Not verified

- **The npm publish path.** No token was created and nothing was published; `RELEASING.md`
  records the sequence and the log line is empty on purpose. C1 — that a stranger can
  install this without asking — remains undemonstrated, and will stay so until there is a
  transliterator worth installing.
- **The gates under CI.** They run inside `npm test`, which CI runs, but this branch's CI
  run is the first time that will have happened on a runner rather than on this machine.
