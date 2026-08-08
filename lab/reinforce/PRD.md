# `/reinforce` — PRD

**Provenance:** [PIPELINE.md](../../PIPELINE.md) build order #3. Deliberately
*not* a `GAPS.md` entry — a gap is something **you** can't do, and this is a
missing stage in the pipeline itself. Items 1 and 2 of the build order are done;
nothing blocks this one.

---

## The problem: two dead ends

**Dead end one — notes never get stronger.** Twelve of the sixteen notes in
`resources/` carry `Evidence: asserted`. The pipeline has no stage that revisits
them. A note enters at whatever confidence it had on the day it was read and
stays there forever, while the field moves underneath it. The eight-point schema
already names each note's soft spots — `Evidence`, `Conflicts`, the falsifier in
`So what` — and nothing consumes them.

**Dead end two — the knowledge-layer rule has nowhere to go.** The `CLAUDE.md`
rule we're about to write says: *if the question has a determinate answer and the
pool is silent, stop and say so.* Without `/reinforce`, that rule terminates in
an apology. It tells you what you don't have and offers no way to get it, which
makes it a rule you'll route around within a week.

Both dead ends are the same missing thing: **a way to search that produces
candidates without producing commitments.**

## What you'll be able to do

- Point at a note and get back candidates aimed at *its specific weak points* —
  not more articles about its topic.
- Point at a question the pool can't answer and get back candidates aimed at
  *that gap*, with the gap ID attached.
- Trust that nothing found this way can quietly become knowledge: the queue is
  non-authoritative by construction, and `/intake` remains the only door.

## Non-goals

| Not this | Why |
|---|---|
| A search-results dumper | Twenty links with no reason attached is accumulation, the exact failure mode [01](../../resources/01-effective-context-engineering.md) and [02](../../resources/02-agent-harness-engineering.md) warn about |
| A note writer | `/reinforce` **never** writes to `resources/NN-*.md`. It writes to `resources/queue/` and nowhere else |
| A replacement for `/intake` | The gate doesn't move. A candidate is a nomination, not an admission |
| An OKF migration of the existing pool | Sequenced **before** this lab, not inside it. `/reinforce` inherits an OKF pool and reads its frontmatter; it doesn't introduce the format |
| A judge of what's true | It finds the other side of an argument; it doesn't settle it |

---

## The four axes

The instruction that makes this skill work, and the one it will get wrong if
left implicit:

> **Search the note's weak points, not its topic.** Searching the topic returns
> more of what you already have. Searching the weak points returns what would
> change it.

| Axis | Fires when | What it searches | Zero results means |
|---|---|---|---|
| `measured` | Evidence is `asserted` / `anecdotal` / `none` | The Mechanism restated as an empirical question — benchmark, ablation, n= | Nobody has measured it. This **strengthens the note's caveat**, it doesn't weaken the axis |
| `alternative` | always | The note's **Problem**, never its Mechanism | The problem is rare, or stated too narrowly to match anyone |
| `opposing` | Conflicts row is non-empty, or the pool records a tension involving it | The opposing position, named | The conflict may be ours alone — worth recording |
| `falsifier` | `So what` names a falsifier | The falsifier restated as an outcome someone would report | Nobody has run it. Note stays unfalsified |

Axis 2 is the one that gets done wrong. Searching the Mechanism finds people who
already agree with the note; searching the Problem finds people who solved it
some other way. **The axis is defined by what it searches, and that definition is
load-bearing.**

**A zero is a result.** Every run reports all applicable axes, including the ones
that returned nothing. A run that quietly drops its empty axes looks identical to
a run that never tried them.

## Two entry modes, one machine

```
/reinforce 09              note-directed  → axes: measured, alternative, opposing, falsifier
/reinforce "<question>"    gap-directed   → axis:  gap
```

Same search discipline, same output, same gate. Mode 2 exists because of the
`CLAUDE.md` rule; without it that rule is a dead end.

---

## The queue

`resources/queue/<slug>.md` — one file per candidate, OKF-conformant.

```yaml
---
type: Resource Candidate          # OKF: the only field OKF itself requires
title: <title>
description: <one sentence — what it appears to claim>
resource: <url>
tags: [<topic vocabulary>]
targets: 09#evidence              # ours — see below
axis: measured                    # measured | alternative | opposing | falsifier | gap
generated:
  by: reinforce/0.1               # OKF actor format: <producer>/<version>
  at: 2026-08-05T14:30:00Z
status: draft                     # OKF lifecycle
stale_after: 2026-09-04           # OKF decay — 30 days out
sources:
  - id: search
    resource: <query or search url>
    title: <how it was found>
---

## Why this is a candidate
<2–4 sentences: the specific weak point, and what this would do to it>

## What would disqualify it
<one line, written before reading>
```

**`targets` is the accountability field.** It is the one thing that separates a
candidate from a bookmark, and it's the reason the guard can reject. Format:
`NN#<field>` for a note's weak point (field must be one of the eight points), or
`G<n>` for a gap ID. Both resolve or the guard fails.

**"What would disqualify it" is written before reading.** Once a link is sitting
in a queue it acquires standing it hasn't earned; naming the disqualifier up
front is the cheapest defence against intaking something because it's already
there.

### Why the queue can't become a graveyard

A queue that only grows is the accumulation failure mode with an extra step.
OKF's `stale_after` handles it: every entry decays 30 days out, and the guard
surfaces expired entries. An expired candidate goes to `REJECTED.md` with
`expired in queue — never intaken`, which is itself a useful signal about the
axis that produced it.

This is [resource 15](../../resources/15-springdrift-persistent-runtime.md)'s
read-time confidence decay, and the same 30-day clock `PIPELINE.md` already runs
on your own comprehension.

---

## Why OKF, and the one place we break it

[OKF](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
is a markdown + YAML-frontmatter format for knowledge bundles. Four of its fields
are things this repo already needed and was going to invent worse versions of:

| OKF field | What it already means here |
|---|---|
| `stale_after` | The 30-day decay rule in `PIPELINE.md`, which is currently **pure prose with nothing enforcing it** |
| `verified: [{by: human:…}]` | Stage 5 — explaining it back. OKF's trust tiers distinguish *machine-confirmed* from *human-reviewed*, which is exactly the distinction stage 5 exists to protect |
| `sources[]` with credibility signals | A generalization of the `Evidence` row |
| `[claim][^source-id]` footnotes | Per-claim attribution — the syntax for the "cite by note and section" rule |

Adopting a published vocabulary instead of a bespoke one costs nothing here and
means the pool is portable later.

**The deviation, stated on purpose:** OKF says consumers *MUST NOT* reject a
bundle for missing optional fields. Our guard rejects a queue entry with no
`targets`. That isn't a conformance failure — OKF constrains *consumers*, and
permissiveness is right for a format that has to ingest from anywhere. But this
repo's whole thesis is that prose rules fail silently, so:

> **Strict producer, permissive format.** Everything we emit is OKF-conformant
> on the way out. Everything we accept is checked harder than OKF requires on
> the way in.

Anyone else's OKF tooling can read our bundle. Our guard is stricter than their
reader. Both are true at once, and the deviation is one sentence long.

**Not adopted:** Attested Computations (BigQuery/dbt-specific), `index.md`
hierarchy files (the queue is flat and short-lived by design).

---

## Risks

1. **It finds agreement instead of challenge.** The default behaviour of any
   search is to return things similar to the query, and three of the four axes
   want the opposite. Mitigation: the axis definitions specify *what to search*,
   not just what to look for, and the run record forces a topic-search control so
   the overlap is visible rather than assumed.
2. **The queue becomes the pool.** Mitigation: `stale_after`, plus the guard
   rejecting any entry whose URL already lives in `resources/` or `REJECTED.md`.
3. **The `CLAUDE.md` rule is prose-tier and will fail silently.** Not mitigated —
   *classified*. See [phase 03](phases/03.md); pretending otherwise would repeat
   the exact mistake this repo exists to fix.

## Depends on

**The OKF retrofit lands first.** Three of the four axes read structured fields
that only exist once the pool is converted:

| Axis | Reads |
|---|---|
| `measured` | `evidence.tier` — to know which notes are unmeasured without opening all 16 |
| `opposing` | `conflicts[]` — tensions as data instead of prose |
| `falsifier` | `falsifier` — currently buried in a table cell |

Before the retrofit, `/reinforce` would have to parse the house-format table out
of every note to find its own inputs. After it, the whole pool's weak points are
one `grep` over frontmatter. That's the same argument for doing the retrofit at
all, arriving from the other direction.

## Follow-on, not in scope

- **A `verified:` entry written by `/intake`** on keep/ignore, closing the loop
  between the queue's trust tiers and the pool's.
