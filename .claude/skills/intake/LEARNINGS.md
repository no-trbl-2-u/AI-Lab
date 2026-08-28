# LEARNINGS — /intake

What running `/intake` has taught about `/intake`. Format and checks:
`node tools/learnings.mjs --check`.

The four entries dated 2026-08-03 come from the skill's **first real run**
(Springdrift, commit bc2b6e3). They were originally written into that run's
delta file under a `## Findings for the skill` heading — see the last entry for
what happened to that convention.

## 2026-08-03 · `fix` · resolved 2026-08-03
Phase 1 assumed the reader always arrives with a prediction. This reader had
picked the paper on intrigue and had none, and pressing for one would have
manufactured noise rather than captured a belief.
**Account for:** a phase that assumes an input always exists will extract a
fake one when it doesn't.
**Resolved:** `"No expectation" is a first-class answer` — record
`expectation: none — exploratory`, state the consequence, and **do not ask
twice**. `.claude/skills/intake/SKILL.md` § Phase 1.

## 2026-08-03 · `fix` · resolved 2026-08-03
The failure-mode test "the eight points came back all-full, so I invented
something" produced a false positive: the paper genuinely addressed
applicability and cost, which most sources don't.
**Account for:** fullness is a proxy. The real question is whether each point
can be traced to somewhere in the source.
**Resolved:** the test is now **provenance, not fullness** — for each point,
can I name where it came from? `.claude/skills/intake/SKILL.md` § Failure modes.

## 2026-08-03 · `fix` · resolved 2026-08-03
Fetching an arXiv paper was unspecified, and the obvious approach (fetch the
PDF) extracts headings badly.
**Account for:** source-specific fetch quirks belong in the skill, not in the
operator's memory.
**Resolved:** pull `/abs/<id>` for metadata and `/pdf/` in the same call — the
PDF reads poorly for structure but saves locally and reads cleanly page-by-page
in phase 2. `.claude/skills/intake/SKILL.md` § Phase 0.

## 2026-08-03 · `fix` · resolved 2026-08-03
A note resting on n=1 read, six months later, exactly like a note resting on a
benchmark. Nothing in the format warned the future reader.
**Account for:** you will remember the idea and forget the sample size.
**Resolved:** `**Evidence caveat for future citation:**`, required whenever
evidence is `anecdotal`, `none`, or n=1, and enforced by `guards/okf.mjs`.

## 2026-08-05 · `design` · resolved 2026-08-06
The `## Findings for the skill` section that captured the four fixes above was
invented on the spot during one run. `deltas/README.md` never documented it and
no guard checked for it — **and the very next delta doesn't have it.** The
convention died after a single use, and the lessons from every run since have
been stranded in commit messages.
**Account for:** a residue convention that isn't in the skill's procedure and
isn't checked will not survive its first author.
**Resolved:** this file, plus `tools/learnings.mjs` and a residue step in every
skill's final phase. Whether *that* survives is still a prose rule — see
`CLAUDE.md`'s enforcement table, where its failure is marked silent.

## 2026-08-19 · `fix` · open
The arXiv fetch recipe resolved on 2026-08-03 says the `/pdf/` fetch "saves
locally and reads cleanly page-by-page in phase 2." In this run it didn't. The
web fetch returned prose but left no file on disk, so phase 2 had to `curl` the
PDF separately and extract text — and the obvious extractor (`pypdf`) failed on
a broken system `cryptography` binding until `pip install --upgrade cffi
cryptography` was run. Roughly ten minutes of the run went to plumbing that the
skill claims is already solved.
**Account for:** a resolved `fix` is only resolved for the environment it was
resolved in. The recipe should either state the fallback (`curl` to the
scratchpad, then a text extractor, and the `cffi` fix if `pypdf` panics) or stop
promising a local copy it doesn't control. Prefer the first — the local copy is
genuinely the right way to read 28 pages, it just isn't free.

## 2026-08-19 · `design` · open
The phase-1 vocabulary is `known` / `partial` / `unknown`, which classifies
*conceptual* familiarity. This reader's delta came back with **zero** `unknown`
and three of four `partial` entries whose boundary was **quantitative, not
conceptual** — they knew evaluation noise, task-order curricula, and
rubric-injection as ideas, and did not know their magnitudes. "Would expect
noise but hasn't reasoned about magnitude" and "new framing, never heard of it"
both land on `partial`, and they want completely different phases: the first
wants a measurement exercise, the second wants an explanation. The delta caught
it only because the notes field was used to say so in prose, which no tooling
reads.
**Account for:** `partial` is doing two jobs. Worth asking whether phase 1 needs
a second axis (*can you state it* vs. *can you predict its size*), or whether
that's over-instrumenting a step whose value is that it's quick. Note the
interaction with the empty `unknown` column: a resource that is pure
calibration rather than introduction inverts the usual decomposition risk —
the danger isn't phases that are too big, it's phases that restate something
already known and teach nothing. Nothing in `/decompose-resource` currently
reads for that.

## 2026-08-19 · `design` · open
Phase 0's out-of-scope rule says reject "model training, fine-tuning, anything
below the harness layer." ClawGym II *is* RL fine-tuning and would have been
rejected on a literal reading — but its mechanism is entirely harness-layer
(proxy interception, trajectory reconstruction from an opaque harness), and it
became a `core` note that measures resource 02's central claim. The rule tests
the resource's **artifact** (weights) when what matters is its **mechanism**.
The reader had to override it by hand, and only did so because they happened to
ask a clarifying question first.
**Account for:** a scope filter keyed on output type will reject the paper that
studies your layer from an adjacent one. But loosening it to "anything whose
mechanism is harness-shaped" plausibly admits most of ML — so the replacement
wording is not obvious, which is why this is `design` and not `fix`.

## 2026-08-19 · `design` · open
Between phase 0 and phase 1 the reader asked whether the paper was about
building their own model. Answering it required naming the training setup, so
the phase-1 placements were given already knowing what the paper does. Mild
contamination, disclosed in the delta — but the skill has no procedure for it,
and phase 0's whole design is about not leaking exactly this.
**Account for:** phase 1 assumes silence between the topic list and the
placements. Readers ask questions there, and scope questions are the most
likely kind because phase 0 is when the resource first looks unfamiliar.
Options: defer all answers until after the delta is written; answer only in the
resource's own vocabulary; or accept it and require a contamination line. None
is obviously right.

## 2026-08-19 · `fix` · open
The 2026-08-03 arXiv fetching entry says pull `/abs` and `/pdf` together. Both
halves failed here: the sandbox had no `pdftoppm`/`pdftotext` and `pypdf`'s
import chain was broken, so the saved PDF was unreadable; and the `/html/`
fallback renders **every number inside `<math>` tags**, so ordinary tag-strip
extraction silently dropped all of the headline figures — the abstract read
"improves Pass@1 by [MATH] and [MATH] points."
**Account for:** the numbers are in the `alttext` attribute of the `<math>`
element. Strip tags for prose, then regex `alttext="([^"]+)"` to recover the
figures — and treat a text extraction with no digits in it as a failed
extraction, not as a paper without numbers. That silent-loss mode is the
dangerous part: the evidence tier would have come out `asserted`.
