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
