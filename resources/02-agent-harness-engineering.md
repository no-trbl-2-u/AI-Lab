---
type: Resource
id: 2
title: Agent Harness Engineering
description: The harness around the model — hooks, loops, contracts — determines agent reliability more than the model does.
origin: external
resource: https://addyosmani.com/blog/agent-harness-engineering/
tags:
  - harness-design
  - hooks
  - ralph-loop
  - sprint-contracts
  - ratchet
tier: core
status: stable
read: 2026-08
conflicts:
  - note: 8
    section: multi-agent
    nature: "The Planner/Generator/Evaluator split is a multi-agent architecture. Reconciliation: role separation for verification is safe, for construction is dangerous."
verified: []
generated:
  by: claude/notes-0.1
  at: 2026-08-03T00:00:00Z
sources: []
---

# 02 — Agent Harness Engineering

## Why it matters

The clearest single-page articulation of *harness* as the unit of engineering.
Where 01 says "curate the context," this says "the thing that curates the
context is a system you design, version, and improve." It also catalogues the
patterns that have converged across Claude Code, Cursor, Codex, Aider, and Cline
— convergence across different underlying models is strong evidence these
patterns are load-bearing rather than incidental.

## The thesis

> A decent model with a great harness beats a great model with a bad harness.

Corollary — **the "skill issue" reframe**: most agent failures are harness
configuration defects, not model limitations. Every agent mistake should
therefore produce a harness change.

## Core patterns

1. **The Ratchet** — every failure becomes a permanent rule (prompt line, hook,
   lint rule) so it cannot recur. Rules only ever move in one direction.
2. **Behaviour-driven design** — work backwards from a desired behaviour to the
   harness component that enables it. No component without a named behaviour.
3. **Compaction & context rotation** — summarize, and periodically do a full
   reset into a clean window.
4. **Planner / Generator / Evaluator split** — separate roles so the thing that
   grades the work isn't the thing that produced it. Defeats self-evaluation
   bias, which is the failure mode monolithic self-correction can't escape.
5. **Ralph Loops** — intercept the agent's attempt to declare done, reinject the
   original intent into a fresh context window, and let it re-derive state from
   the filesystem. Named for the "Context Anxiety" failure where agents quit
   early because the window is filling, not because the work is finished.
6. **Progressive disclosure** — load tools/skills on demand, not at startup.
7. **Tool-call offloading** — large outputs (logs, build output, file dumps)
   land on disk; only a reference enters the context.
8. **Hook-based enforcement** — pre-tool, post-edit, pre-commit lifecycle
   scripts. Design rule: **success-silent, failures-verbose.** Feedback is then
   nearly free in the common case.
9. **Sprint contract** — planner and executor agree explicit done-conditions
   *before* work starts. Cheapest available defense against scope drift.
10. **Master configuration document** — a concise `AGENTS.md` (the post suggests
    under ~60 lines) holding conventions, constraints, and encoded lessons.

## Numbers & claims worth remembering

- Filesystem + Git are called the single most foundational primitive: durable
  state, coordination substrate, context offload target, and multi-session
  memory in one.
- "Harnesses don't shrink, they move" — as models improve, scaffolding migrates
  (into the model, into the sandbox, into the tools) rather than disappearing.
- Related finding from the wider 2026 literature: a large share of enterprise
  agent failures trace to harness defects — context drift, schema misalignment,
  state degradation — rather than model error.

## Wording notes

- **Every line in `AGENTS.md` should be traceable to a real failure or a real
  external constraint.** Speculative rules are noise competing for attention.
  This is the most actionable wording rule in the whole collection.
- Keep the config document short enough that you'd actually re-read it. Length
  is the enemy of compliance — for the model and for you.
- Hook messages are prompts too. Write error output that tells the agent what to
  do next, not just what went wrong.

## Tensions

- The Planner/Generator/Evaluator split is a multi-agent architecture, which
  cuts against 08. The reconciliation: role separation for *verification* is
  safe (evaluator needs less context), while role separation for *construction*
  is dangerous (builders need shared context).

## Where it lands

→ Lessons [00](../workshop/lessons/00-enforcement-map/README.md)–[03](../workshop/lessons/03-deterministic-guards/README.md)

## Related

Synthesizes 01, 05, 06 and 09 into a single engineering discipline.
