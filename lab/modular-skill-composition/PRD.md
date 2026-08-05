# PRD — Modular skill composition

## Gap

[G11](../../GAPS.md#g11--no-systematic-way-to-decompose-a-large-task-into-small-testable-modular-skills)
— `stated`.

## What you can't do yet

Large tasks get planned as one long prose runbook, or built as one big skill
that quietly does three things. There's no shared contract for what makes a
skill *modular* — single responsibility, explicit inputs/outputs, its own
failing check — and no procedure for splitting a large task along those
seams instead of arbitrary ones. Composition between skills (who invokes
whom, what crosses the boundary) is left to whatever context happens to be
loaded rather than declared anywhere.

## What closes it

1. **A skill-unit contract** — [workshop/spec/skill-contract.md](../../workshop/spec/skill-contract.md)
   — stated mechanically enough that a guard can check it without judgment.
2. **A guard** — [guards/skill-contract.mjs](../../guards/skill-contract.mjs) —
   that fails a skill spec missing any required part of the contract, and
   passes a conforming one. Built in phase 1.
3. **A `/decompose-task` skill** that takes a large task and produces a set
   of candidate skill specs, each conforming to the contract, plus an
   explicit composition manifest (invocation order, no cycles). Phase 2.
4. **A worked decomposition** of a real large task already in this repo —
   the [long-horizon runner](../README.md#long-horizon-runner), which
   `lab/README.md` already informally splits into five parts — run through
   `/decompose-task` and compared against that hand-written split. Phase 3.

## Non-goals

- Not building the long-horizon runner itself — that stays its own queued
  lab, blocked on workshop lessons 03/07/08.
- Not a general project-management or task-tracking tool. Scope is Claude
  Code skills specifically: files with frontmatter, a body, and a trigger.
- Not solving trigger-wording accuracy (whether `description` actually fires
  correctly) — that's [lesson 07](../../workshop/lessons/07-meta-eval/README.md)'s
  job, and this contract says so explicitly rather than pretending to cover it.

## Done when

Every check in G11's "Closed when" line holds: `/decompose-task` exists,
everything it produces passes `guards/skill-contract.mjs`, and it's been run
on the long-horizon runner with the output compared against the existing
five-part table, divergences named.
