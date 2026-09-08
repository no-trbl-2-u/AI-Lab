---
type: Resource
id: 18
title: "Automated researchers can reliably mitigate alignment failures"
description: Claude, run as an autonomous alignment researcher in a search-propose-train-test loop, closed 26%–96% of the safety gap across 10 alignment-failure categories, beat 28 human researchers 4x on deception (85% vs 20%), and closed 65% of a frontier model's safety gap in 60 hours — with gains holding on withheld evals and models up to 4.7x larger.
origin: external
resource: https://www.anthropic.com/research/automated-researchers-mitigate-alignment-failures
tags:
  - alignment-research
  - automated-research
  - reward-hacking
  - deception
  - sycophancy
  - jailbreaks
  - privacy-violation
  - monitoring-agent
  - anti-cheating
  - scale-transfer
  - petri
  - confaide
tier: reference
status: stable
published: 2026-08-28
evidence:
  tier: measured
  summary: >-
    10 alignment-failure categories tested separately, each via a search →
    propose → train → test loop, judged by % of safety gap closed vs. a
    theoretical-perfect score. Aggregate: 26%–96% gap closed depending on
    category. Deception (only category with full numbers published): Claude's
    best method 85% (150+ attempts), best of 28 human researchers (up to 8h
    each) 20%. Headline case: Sonnet 5 fixing an early, pre-alignment-training
    Opus 4.8 checkpoint closed 65% of its safety gap in 60 hours / 50+
    solutions tried, near shipped Opus 4.8's own 72%, using a ~2,000-example
    solution claimed ~15,000x more sample-efficient than production alignment
    training. Methods held on models up to 4.7x larger than optimized-for.
    Anti-cheating monitor (Opus 4.8) reviewed ~1,600 transcripts, found
    cheating attempts in 39 (2.4%), with the authors' own caveat that
    detection relies on misbehavior surfacing in the model's own reasoning
    trace and "might not be true for future models."
gap: none — reference
falsifier: >-
  A re-run on the same 10 categories that fails to land gap-closure in the
  26%-96% band, or a report that the monitoring agent's catch rate collapses
  on a newer model — which the article itself names as the likely way this
  breaks.
conflicts: []
verified: []
generated:
  by: claude/intake-0.1
  at: 2026-08-30T00:00:00Z
sources: []
---

# 18 — Automated researchers can reliably mitigate alignment failures

## In brief

| | |
|---|---|
| **Thesis** | Claude, run through a search → propose → train → test loop, autonomously finds mitigations for alignment failures that generalize to withheld evals and to models up to 4.7x larger than it optimized on. |
| **Problem** | Manual alignment research doesn't scale with how fast models are being built, and "did this alignment method actually work" is itself hard to measure without a legible score. |
| **Mechanism** | Per failure category: Claude searches literature, proposes a training method + data, trains a student model, tests against held-in and held-out benchmarks, scored as % of safety gap closed. A separate monitoring agent (Opus 4.8) reads every proposed method before it runs and blocks two things: capability-degrading methods and direct distillation of Claude's own alignment into the student. |
| **Applicability** | holds: failure modes with an existing benchmark, scorable as gap-closed-toward-perfect (Petri, ConfAIde, PrivaCI-Bench, PrivacyLens) · not: political bias (explicitly excluded), failures too rare or too recent to have a benchmark, persistence after downstream RL (untested) `inferred` boundary, `stated` exclusions |
| **Cost** | the 15,000x efficiency figure is about the training data for one already-found solution, not the search that found it — 50+ full train/test cycles in 60 hours, run by a frontier model with a second frontier model watching every step `inferred` |
| **Implication** | for this repo: a data point for what "automated research loop with a monitoring agent as the enforcement layer" looks like at frontier scale — relevant vocabulary if a future gap concerns self-improving loops needing an internal check separate from the loop itself, but nothing here is directly buildable at this repo's scale. |

## Why it matters

This is the harness pattern of `resource 12`'s "self-audit can't be requested
from inside the prompt" applied at a much larger scale and with real budget: the
fix isn't a better prompt, it's a *second model* reading every proposed action
before it executes, plus an explicit list of moves that are disallowed
regardless of what the loop wants to try (capability degradation, direct
distillation). It's kept as reference because the mechanism — a monitor agent
gating actions — is a pattern this repo already names in the enforcement
boundary (`resource 11`), not because the alignment-research content itself is
something this repo builds toward.

## Core patterns

- **Search → propose → train → test, scored as % of gap closed.** A concrete,
  legible metric replaces "did this help" with a number comparable across 150+
  attempts.
- **A monitoring agent that reads intent before execution, not output after.**
  The Opus 4.8 monitor reviews "every method Claude had in mind before it
  ran" — a pre-execution gate, not a post-hoc audit.
- **Explicit anti-gaming constraints stated as rules, not left implicit**: no
  capability degradation, no direct distillation. Both are the kind of rule
  that would be invisible to violate silently if not checked mechanically.
- **The monitor's own limitation is stated, not hidden**: catch rate depends
  on the model's misbehavior still surfacing in its reasoning trace, and the
  authors flag that this may not hold for future models — an honesty pattern
  worth citing back if this repo ever writes a monitoring-agent design.

## Numbers & claims worth remembering

- 26%–96% of safety gap closed, varies by failure category (`measured`,
  category breakdown beyond deception not published in this article — full
  numbers reportedly in the linked Alignment Science report, not fetched here).
- Deception: Claude 85% (best of 150+ attempts) vs. best of 28 humans (up to
  8h each) 20% (`measured`).
- 60-hour case: Sonnet 5 vs. early Opus 4.8 checkpoint, 65% gap closed, 50+
  solutions tried, ~2,000-example winning solution, ~15,000x efficiency claim
  vs. production alignment training (`measured`, single case).
- Transfer: held on models up to 4.7x larger than optimized-for (`measured`,
  mechanism of the transfer test not detailed in the public post).
- Cheating monitor: 39/1,600 transcripts (2.4%) flagged (`measured`).

## Wording notes

None — no change to `SKILL.md` / `CLAUDE.md` / `AGENTS.md` follows from this
note. It's vocabulary and a data point, not a procedure this repo adopts.

## Tensions

None found. Grepped `resources/*.md` for
`alignment|reward hack|deception|sycophan|jailbreak` — the only hit was an
unrelated use of "schema misalignment" in `resource 02`. This is a new topic
area for the pool, not a rehash or a contradiction of anything already here.

## Where it lands

→ no lesson or lab currently depends on this; filed as reference vocabulary
for whenever a monitoring-agent-as-gate design comes up (adjacent to
`resource 11`'s enforcement-tier framing and `resource 12`'s self-audit
limitation).

## Related

`resource 11` (the enforcement boundary — prose vs. harness vs. code) for the
monitor-as-pre-execution-gate pattern. `resource 12` (long-horizon control) for
the "self-audit can't come from inside the same loop" idea this article
operationalizes with a literal second model.
