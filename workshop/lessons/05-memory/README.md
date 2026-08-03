# Lesson 05 — Memory architecture

**Layer built:** `memory/` with partitioned scopes
**Type:** extraction — your work-system design is ahead of the literature here.

## Concept

Memory fails in two directions. Too little and every session re-derives context.
Too much and the pool fills with stale material that outranks fresh reasoning
because it's *written down*. The second failure is slower and worse.

The fix is the same shape as lesson 04: **scoping, plus a path in and a path
out.**

## Prior art, side by side

| | Published | Your system |
|---|---|---|
| External memory | resource 01: "keep a NOTES.md" | ✔ |
| Recitation | resource 09: rewrite `todo.md` to exploit recency | ✔ (`/next`, NEEDS_HUMAN_ATTENTION) |
| Reversible compression | resource 09: drop content, keep the path | ✔ (dispositions point, never restate) |
| **Partition by responsibility** | — absent | ✔ separate files per concern |
| **Scoped reads** | — absent | ✔ subagents/skills pull specific slices |
| **Write discipline** | — absent | ✔ specific skills are the writers |
| **Archival with cleanup skills** | — absent | ✔ fires on circumstance |
| **Archive invisible by default** | — absent | ✔ unless explicitly asked |
| **Archive → pool promotion** | — absent | ✗ — *your idea, this conversation* |

Eight of ten rows have no published counterpart. The literature's state of the
art is "write a notes file."

## The missing row

Your instinct mid-conversation:

> "it'd be a good idea to then promote certain items in the archive into the
> reference pool the agents use"

That's `braindump → --rec → canon` applied to memory, and it closes the loop the
same way: **promotion is the only path into the active pool**, so the pool can't
silently accumulate. Without it, archival is one-directional and anything
archived early is effectively deleted — which makes the cleanup skill quietly
lossy, and you'd never notice, because the loss is invisible by design.

The promotion trigger is the open question. Candidates, in rough order:

1. **Access-driven** — archive item retrieved N times → promote. Cheap,
   measurable, and the most likely to work.
2. **Recurrence-driven** — a question recurs that the archive already answers.
3. **Explicit** — a cleanup skill proposes promotions for review.

Option 1 needs retrieval logging, which you'd want anyway.

## Build

1. `memory/` for ai-lab, partitioned: `decisions/`, `measurements/`,
   `open-questions/`. Small — the point is the mechanism.
2. **One writer per partition.** Declared, and guarded (a guard can check which
   skill wrote last via git blame).
3. **Retrieval logging** — every read of an archived item appends to
   `memory/.access.log`. Prerequisite for promotion trigger 1.
4. **Promotion guard** — `guards/memory-promotion.mjs` flags archive items over
   the access threshold. Reports; doesn't auto-promote. Promotion stays a
   decision.
5. **Staleness guard** — active-pool items with no access in N days are demotion
   candidates. The reverse direction, and the one that keeps the pool small.

## Failing check

```bash
node guards/memory.mjs
```

Non-zero on: an orphaned memory file (no partition), a partition with no
declared writer, or an active item past the staleness threshold with no
disposition.

## Extraction note

Strongest **original** contribution in the workshop. The partition +
scoped-read + promotion-ladder design is `dist/`-worthy and genuinely
publishable — nothing in the ten resources describes it. Evidence needed: the
promotion trigger has to run long enough to fire at least once, which means this
lesson's real result won't exist for weeks. Start the access log early.
