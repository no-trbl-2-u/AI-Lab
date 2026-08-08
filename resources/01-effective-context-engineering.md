---
type: Resource
id: 1
title: Effective Context Engineering for AI Agents
description: Context is a finite, degrading resource; engineer the smallest set of high-signal tokens rather than the largest.
origin: external
resource: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
tags:
  - context-engineering
  - context-rot
  - just-in-time-retrieval
  - compaction
  - system-prompts
tier: core
status: stable
published: 2025-09-29
conflicts:
  - note: 8
    section: multi-agent
    nature: Endorses sub-agents for context isolation; 08 argues sub-agents fracture context. Both are right about different task shapes.
verified: []
generated:
  by: claude/notes-0.1
  at: 2026-08-03T00:00:00Z
sources: []
---

# 01 — Effective Context Engineering for AI Agents

## Why it matters

This is the canonical statement of the shift from *prompt* engineering to
*context* engineering: the question stopped being "what words do I use?" and
became "what configuration of tokens is most likely to produce the behaviour I
want?" Every other resource in this collection is downstream of this framing.

## Core patterns

### Context rot
As tokens accumulate, the model's ability to recall and reason about specific
details degrades. Attention is a finite budget, and every token spent is drawn
from it. The practical consequence: **a smaller, better-curated context beats a
larger, complete one.** This is the single most load-bearing idea in the post.

### Right altitude for system prompts
Prompts fail in two directions:

- **Too rigid** — brittle if/else logic encoded in English; breaks on the first
  unanticipated case and accretes into an unmaintainable rulebook.
- **Too vague** — "be helpful and use good judgment"; assumes shared context
  that doesn't exist.

The target is the middle: specific enough to guide, general enough to
generalize. Structure with distinct sections (`<background_information>`,
`<instructions>`, `## Tool guidance`) using XML tags or Markdown headers.

**Method:** start with the minimal viable prompt. Add clarity only in response
to an observed failure mode. This is the same ratchet as resource 02.

### Minimal viable tool set
Tools should be self-contained, unambiguous in purpose, and non-overlapping.
The heuristic: *if a human engineer can't say which tool to use in a given
situation, the agent can't either.* Bloated tool sets are a context-engineering
failure, not a capability win.

### Canonical examples over exhaustive examples
Don't stuff the prompt with edge cases. Curate a small set of diverse examples
that illustrate the *shape* of expected behaviour. Quality over quantity.

## Long-horizon techniques

| Technique | What it does | When to reach for it |
|---|---|---|
| **Compaction** | Summarize history near the context limit; keep architectural decisions and open issues, drop redundant tool output | Long single-threaded sessions |
| **Structured note-taking** | Agent writes external memory (`NOTES.md`, `todo.md`) it can re-read after a reset | Multi-hour / multi-session tasks |
| **Sub-agents** | Focused task, clean context, returns a condensed summary to a coordinator | Deep search or exploration whose *intermediate* steps don't matter |
| **Just-in-time retrieval** | Hold lightweight identifiers (paths, IDs, URLs); fetch content via tools at runtime | Large corpora; anything you'd otherwise pre-load |

Note the tuning advice on compaction: **maximize recall first, then improve
precision.** Losing something important is a much worse failure than carrying
some redundancy.

## Numbers & claims worth remembering

- No headline benchmark here — the value is the vocabulary. "Context rot,"
  "right altitude," "just-in-time retrieval," and "minimal viable prompt" are
  the terms the rest of the field now uses.

## Wording notes

- Structure `CLAUDE.md` / `AGENTS.md` with explicit section headers. Flat prose
  gets skimmed; headed sections get attended to.
- Prefer heuristics to procedures. `"Prefer editing an existing file over
  creating a new one"` generalizes; a 12-step decision tree does not.
- Every instruction is a tax on attention. If you can't name the failure that
  motivated a line, delete it.
- Avoid instructions that restate default model behaviour — pure token cost.

## Tensions

- Against **08 (Don't Build Multi-Agents)**: this post endorses sub-agents for
  context isolation. Cognition argues sub-agents fracture context. Both are
  right about different task shapes — see 07/08.

## Where it lands

→ [Lesson 07 — meta-eval](../workshop/lessons/07-meta-eval/README.md) (constraint-decay experiment)

## Related

Extends into 02 (harness framing), 05 (progressive disclosure as a JIT
mechanism), 09 (production tactics for the same problem).
