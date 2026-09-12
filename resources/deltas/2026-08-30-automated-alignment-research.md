# Automated researchers can reliably mitigate alignment failures — delta

**Resource note:** resources/18-automated-alignment-research.md

**Date:** 2026-08-30
**Resource:** https://www.anthropic.com/research/automated-researchers-mitigate-alignment-failures
**Captured:** before any explanation (phase 1, uncontaminated)
**Retrospective:** false

## Placement

**partial**
- Using Claude itself as an automated alignment researcher to find methods
  that reduce another model's alignment failures. Knows this matters as a
  direction; can't yet predict what such a method actually looks like or
  debug why one would fail.
- The 10 categories of alignment failure tested (deception, sycophancy,
  jailbreaks, privacy violations, reward hacking, etc.). Recognizes the
  categories as a taxonomy; can't yet say which are harder to mitigate or why.
- The headline result — Claude Sonnet 5 aligning an early checkpoint of
  Claude Opus 4.8 in 60 hours. Aware such a claim exists in this space;
  can't yet contextualize 60 hours as fast/slow or judge what "aligning"
  means operationally here.
- Monitoring built in to detect the research agent itself cheating/gaming
  its own attempts. Knows this is a known failure mode for self-improving
  agentic loops in general; hasn't seen how it's specifically instrumented
  for an alignment-research agent.

**unknown**
- The benchmarking/eval tools used — Petri, ConfAIde, PrivaCI-Bench,
  PrivacyLens. No prior exposure to any of these four.
- Performance comparison between Claude's autonomous mitigation methods and
  human safety researchers' proposals. No prior read on how that comparison
  came out or how it was scored.
- Methods optimized on smaller models generalizing/scaling to larger models
  than they were developed on. No prior model of whether alignment
  mitigations are expected to transfer across scale at all.
- Constraints imposed on the study (no capability degradation, no direct
  distillation) and the stated limitations (narrow failure set vs.
  production). No prior sense of what guardrails such a study would need or
  what its authors would flag as out of scope.

## Expectation

**"Mixed / failure-dependent"** — the reader predicts the automated
mitigation methods work well for some of the 10 failure categories (e.g.
sycophancy) and poorly for others (e.g. deception, reward hacking), rather
than a uniform "automated beats/matches/loses to human" result across the
board.

## Notes

Overlap check against the pool (`grep -liE 'alignment|reward hack|deception|
sycophan|jailbreak' resources/*.md`): only one incidental hit, "schema
misalignment" in resource 02, unrelated to AI alignment. **This topic area
(automated alignment research, the 10-category failure taxonomy, alignment
evals) is new to the pool** — no direct predecessor note, so phase 2's
conflicts section is likely to be thin or absent rather than a sign of
under-reading.

Placement skews `partial`/`unknown` with no `known` entries — the reader has
background exposure to adjacent ideas (self-improving-agent monitoring,
scale-transfer as a general ML question) but no direct contact with this
specific study or its named tools. That argues for treating this as an
introduction-shaped resource rather than a calibration-shaped one (contrast
with the 2026-08-19 delta, which was all `known`/`partial` and no `unknown`).

Expectation diff recorded in the note's phase-2 section (if kept) or in the
phase-2 conversation (if not).
