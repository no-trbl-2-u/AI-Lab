---
type: Resource
id: 14
title: Memory architecture
description: Memory partitioned by responsibility, with declared writers and scoped reads, beats a single undifferentiated store.
origin: synthesis
tags:
  - memory
  - partitioning
  - scoped-reads
  - residue
  - prior-art
tier: extraction
status: stable
published: 2026-08
conflicts: []
verified: []
generated:
  by: claude/notes-0.1
  at: 2026-08-03T00:00:00Z
sources:
  - id: work-system
    title: A proprietary production memory system
    author: human:no-trbl-2-u
  - id: board-brainstorm
    resource: https://github.com/no-trbl-2-u/board-brainstorm
    title: board-brainstorm's residue discipline
    author: human:no-trbl-2-u
---

# 14 — Memory architecture

**Type:** prior art alongside an existing production design. Published sources
cover perhaps two of the ten rows below; the rest is extracted from a
proprietary work system and from `board-brainstorm`'s residue discipline.

## Why it matters

Memory fails in two directions. Too little and every session re-derives context.
Too much and the pool fills with stale material that *outranks fresh reasoning
because it is written down*. The second failure is slower, quieter, and worse.

## Prior art vs. a working design

| Capability | Published | The working design |
|---|---|---|
| External memory file | "keep a NOTES.md" (resource 01) | ✔ |
| Recitation to exploit recency | resource 09 — rewrite `todo.md` each step | ✔ |
| Reversible compression | resource 09 — drop content, keep the path | ✔ — point at rulings, never restate |
| Session residue → next session | resource 01 (implied) | ✔ — orientation rebuilt from disk, never memory |
| **Partition by responsibility** | absent | ✔ separate files per concern |
| **Scoped reads** | absent | ✔ subagents and skills pull declared slices |
| **Declared writers** | absent | ✔ specific skills own specific partitions |
| **Conditional cleanup** | absent | ✔ skills that fire on circumstance and archive |
| **Archive invisible by default** | absent | ✔ out of scope unless explicitly asked |
| **Archive → pool promotion** | absent | ✗ — identified, not yet built |

Published state of the art is roughly row 1.

## The four mechanisms worth naming

### Partition by responsibility
One file per concern, not one memory file. Makes scoped reads possible and keeps
any single read small.

### Scoped reads
A subagent gets the slice its job needs, not the pool. This is context
engineering applied to memory — and it's what makes a large memory affordable,
the same way progressive disclosure makes a large skill library affordable
(resource 05).

### Declared writers
Each partition has exactly one skill that writes it. Without this, memory
accretes from everywhere and nothing is accountable for its quality. Checkable
by a guard.

### Archival with default invisibility
Cleanup skills move out-of-scope material to an archive that agents don't see
unless asked. This is what keeps the active pool small — and it's the mechanism
with a hole in it.

## The missing mechanism: promotion

Archival without promotion is **one-directional and silently lossy**. Anything
archived early is effectively deleted, and you never notice, because invisibility
is the design.

The fix is the promotion ladder that `board-brainstorm` already runs on ideas
(`braindump → --rec → canon`), pointed at memory:

```
active pool  ⇄  archive
     ↑  promotion (evidence-triggered)
     ↓  demotion (staleness-triggered)
```

Promotion is the **only** path into the active pool, so the pool cannot silently
fill. Demotion is the only path out, so nothing is deleted without a record.

Promotion triggers, in order of likely usefulness:

1. **Access-driven** — archived item retrieved N times. Cheap, measurable,
   requires only a retrieval log (which is worth having regardless).
2. **Recurrence-driven** — a question recurs that the archive already answers.
   Needs the eval prompt set to detect.
3. **Explicit** — a cleanup skill proposes promotions for human review.
   Slowest, most accurate, and the right one to start with.

## Wording notes

- Memory entries need **dispositions**, exactly like design ideas: what is this,
  where did it land, is it still live? An undated memory with no disposition is
  indistinguishable from a stale one.
- Convert relative time to absolute at write time. "Last week" in memory is a
  bug that ripens.
- Never restate a canonical source in memory — point at it. A paraphrase drifts
  stale the day the original is amended.
- Every partition should state, in one line, **who writes it and who reads it.**
  If you can't answer both, it isn't a partition.

## Where it lands

→ Lesson [05](../workshop/lessons/05-memory/README.md); the promotion ladder is
the same machinery as resource [11](11-enforcement-boundary.md)'s tiering and
lesson [04](../workshop/lessons/04-reference-pools/README.md)'s authority chain.
