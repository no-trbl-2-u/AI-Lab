---
type: Resource
id: 8
title: Don't Build Multi-Agents
description: Sub-agents fracture context and produce conflicting work; prefer a single-threaded agent with a compacted history.
origin: external
resource: https://cognition.com/blog/dont-build-multi-agents
tags:
  - multi-agent
  - context-fracture
  - single-threaded-agents
tier: reference
status: stable
read: 2026-08
conflicts:
  - note: 7
    section: thesis
    nature: Directly opposed on whether sub-agents help or fracture, for what look like different task shapes.
verified: []
generated:
  by: claude/notes-0.1
  at: 2026-08-03T00:00:00Z
sources: []
---

# 08 — Don't Build Multi-Agents

## Why it matters

The best-argued case against reflexive multi-agent architecture, from the team
behind Devin. Its value isn't the conclusion — it's the two principles, which
are correct regardless of which architecture you pick.

## The two principles

1. **Share context** — and share *full agent traces*, not just individual
   messages. A summary of what an agent did loses the reasons it did it.
2. **Actions carry implicit decisions, and conflicting decisions carry bad
   results.** Every action an agent takes commits to assumptions that were never
   stated. Parallel agents accumulate incompatible commitments silently.

Principle 2 is the deep one. It explains why multi-agent failures are so hard to
debug: nothing went visibly wrong at any step.

## The Flappy Bird example

Clone Flappy Bird. Subagent 1 builds the background, subagent 2 builds the bird.
Subagent 1 renders a Super Mario Bros-style background; subagent 2 builds a bird
in an incompatible art style. Neither made an error against its own brief. The
final agent inherits the impossible job of reconciling two coherent-but-
incompatible outputs.

The generalization: **decomposition is safe when subtasks are independent, and
unsafe when they share unstated design context.** Research subtasks are usually
independent. Construction subtasks usually aren't.

## The recommended architecture

- **Single-threaded linear agent** as the default. Continuous context, every
  action visible to every subsequent decision.
- When context overflows, add a **compression layer** — a dedicated model that
  distills the action history into key decisions and events.
- The honest caveat: reliable compression is hard and needs significant
  domain-specific tuning. It is a real engineering project, not a prompt.

## Reconciling 07 and 08

| | Favours single-threaded (08) | Favours orchestrator-worker (07) |
|---|---|---|
| Subtask coupling | High — shared design decisions | Low — independent lookups |
| Output type | Artifact to be merged | Findings to be synthesized |
| Cost tolerance | Normal | High-value task, ~15× tokens acceptable |
| Failure mode feared | Incoherent merge | Context exhaustion / too slow |

**Working rule for this lab:** parallelize *reading*, serialize *writing*. Use
subagents to gather and to verify; keep construction on one thread.

## Wording notes

- If you do delegate, pass the *decisions*, not just the task. "Build the bird"
  fails; "build the bird — 8-bit NES palette, 16×16 sprite, matching the
  existing `assets/bg.png` style" succeeds.
- The most valuable thing to write into a delegation prompt is the set of
  constraints that are obvious to you and invisible to the subagent.

## Where it lands

→ [Lesson 06 — agents & sandboxing](../workshop/lessons/06-agents-and-sandboxing/README.md)
