---
type: Resource
id: 13
title: Epistemic sandboxing
description: Give a sub-agent a deliberately impoverished context so its prediction is uncontaminated, then diff that against the truth.
origin: original
tags:
  - subagents
  - epistemic-sandboxing
  - prediction
  - original-pattern
tier: extraction
status: stable
published: 2026-08
conflicts: []
verified: []
generated:
  by: claude/notes-0.1
  at: 2026-08-03T00:00:00Z
sources:
  - id: rules-reader
    resource: https://github.com/no-trbl-2-u/board-brainstorm
    title: The rules-reader agent in board-brainstorm
    author: human:no-trbl-2-u
---

# 13 — Epistemic sandboxing

**Type:** original pattern. Not published anywhere I could find. Extracted from
the `rules-reader` agent in `no-trbl-2-u/board-brainstorm`.

## Why it matters

Subagents are normally reached for to gain parallelism or to isolate context.
This is a third use with no published counterpart, and it turns an
unquantifiable property — "is this artifact self-sufficient?" — into a number
without introducing a judge that drifts.

## The pattern

> To test whether an artifact is self-sufficient, give an agent **only** that
> artifact and count what it cannot derive.

Subagents are normally used for parallelism or context isolation. This is a
third use: **restricting what an agent knows so that its confusion becomes a
measurement.**

## The reference implementation

`rules-reader` audits a physical card game's printed text. It is given:

- **ALLOWED:** exactly what a player who bought the box would hold — card text,
  the reference card, the rules spread.
- **FORBIDDEN:** the engine implementation, the owner's rulings, the results
  archive, the design discussion.

Then it plays a seeded fight through a deterministic replay interface, and at
every step:

1. **Predicts** — from printed text only, what should this action do?
2. **Acts** — takes the step.
3. **Verifies** — diffs actual state against the prediction.

Every mismatch is a finding, classified as `divergence` (text says X, engine did
Y), `underdetermined` (two readings, both plausible), `invisible` (state changed
with no printed cause), or `glossary` (keyword exceeded its gloss).

Its prompt opens: *"You are a stranger who just bought this game."*

## Why it works

Three properties, and all three are load-bearing:

1. **The restriction is the instrument.** A reviewer who knows the implementation
   cannot un-know it, and will unconsciously fill gaps the artifact leaves open.
   Ignorance has to be enforced structurally — via the `tools:` allowlist and an
   explicit forbidden list — because it can't be achieved by instruction.
2. **Prediction precedes observation.** Post-hoc, everything looks derivable.
   Committing first makes the gap undeniable.
3. **The model supplies evidence; code supplies the verdict.** Individual
   predictions are noisy. The divergence count is stable. This is what makes an
   unquantifiable property ("is this wording clear?") into a number without
   introducing a judge that drifts (resource 12).

Two further design details worth copying: the agent is told explicitly what is
**not** a finding (strategy mistakes, balance opinions) — vague delegation is
the documented failure mode of subagent systems — and **zero findings is
declared a valid, publishable result.** An auditor that must find something will.

## Where it generalizes

Anywhere an artifact is supposed to stand alone:

| Artifact | Sandbox | Findings are |
|---|---|---|
| Printed rules | player's-eye view only | wording bugs |
| API docs | docs, no source | undocumented behaviour |
| Onboarding README | README, no tribal knowledge | missing setup steps |
| Error messages | the message, no source | unactionable errors |
| **A harness** | `CLAUDE.md` + `README`, no `.claude/` or `guards/` | undocumented enforcement |

The last row is the one this repo uses (lesson 06). Predict what the harness
enforces; diff against the spec; divergences are rules that exist but that no
reader could have known.

## When it doesn't apply

- The artifact isn't meant to stand alone (internal code with tests as the spec).
- There's no ground truth to diff against — you need a *deterministic* observer.
  Without a replayable engine, "observed" is itself a judgment and the technique
  collapses back into an LLM judging.
- The property is already checkable by code. Don't spend an agent on it.

## Wording notes

- Write the **forbidden list first**. Everyone writes the allowed list and leaves
  the boundary fuzzy; the forbidden list is what makes the sandbox real.
- Enforce it with `tools:` frontmatter, not prose. Prose asks; the allowlist
  prevents.
- State the non-goals explicitly. Auditors drift into adjacent critique.
- Give the findings a rigid schema and validate it with a `SubagentStop` hook.
  A prose-declared output contract holds only while the model cooperates.

## Where it lands

→ Lesson [06](../workshop/lessons/06-agents-and-sandboxing/README.md); the verdict
split is resource [11](11-enforcement-boundary.md); the drift argument is
resource [12](12-long-horizon-control.md).
