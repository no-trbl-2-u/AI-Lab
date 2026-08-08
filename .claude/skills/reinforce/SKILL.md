---
name: reinforce
description: >
  Searches a resource note's weak points — not its topic — for material that
  would strengthen, contradict, or falsify it, and queues the results as
  candidates without ever writing to the pool. Also runs gap-directed, when a
  question has a determinate answer and resources/ is silent on it.
  Use when the user says "/reinforce", "reinforce note NN", "strengthen this
  note", "who disagrees with this", "has anyone measured this", "find the other
  side", "what would falsify this", or when an answer required leaving the
  resource pool because nothing in it covered the question.
---

# /reinforce — search the weak points

Produces **candidates**, never notes. `/intake` remains the only door into
`resources/`. See [PIPELINE.md](../../../PIPELINE.md) build order #3 and
[lab/reinforce/PRD.md](../../../lab/reinforce/PRD.md).

## The instruction everything else rests on

> **Search the note's weak points, not its topic.**

Searching the topic returns more of what the pool already has — that's how a
reference pool fills with agreeable material nobody chose. The axes below are
defined by *what they search*, and those definitions are the load-bearing part.

---

## Mode 1 — note-directed: `/reinforce <NN>`

Read the note's frontmatter. It holds the weak points as data, so this is a
lookup, not a parse.

| Axis | Fires when | Search **this** | Not this |
|---|---|---|---|
| `measured` | `evidence.tier` is `asserted`/`anecdotal`/`none` | the `mechanism` restated as an empirical question — benchmark, ablation, n= | the mechanism's name |
| `alternative` | always | the note's **Problem** | the note's Mechanism |
| `opposing` | `conflicts[]` non-empty | the opposing position, named | the note's own position |
| `falsifier` | `falsifier` present | the falsifier restated as an outcome someone would report | the claim itself |

**Axis 2 is the one that gets done wrong.** Searching the Mechanism finds people
who already agree with the note. Searching the Problem finds people who solved
it some other way. If you catch yourself pasting the mechanism into the query,
you are running axis 2 as a topic search.

### Notes 01–14 have no `evidence` field

They predate the intake gate and carry no `evidence`, `gap`, or `falsifier` —
see `deltas/GRANDFATHERED.md`. For those, axes 1 and 4 **cannot fire**. Say so
in the run record rather than substituting a topic search; "this note has no
recorded evidence tier to attack" is the finding, and the fix is a retrospective
intake, not a worse search.

## Mode 2 — gap-directed: `/reinforce "<question>"`

For a question with a determinate answer that `resources/` cannot answer. Three
axes: what would answer this, who disagrees about it, has anyone measured it.
Every candidate gets `targets: G<n>` and `axis: gap`.

If the question maps to no gap in `GAPS.md`, **stop and say so.** Either it
belongs on the list — propose the entry with its provenance tag — or it's
curiosity, which is legitimate but goes in through `/intake`'s side door
instead. Do not invent a gap ID to make a candidate validate.

---

## Zero is a result

Report **every applicable axis**, including the ones that found nothing. A run
that silently drops its empty axes is indistinguishable from one that never
tried them.

"Nobody has measured this" **strengthens the note's caveat**. It is not a
failed search, and it is often the most useful thing a run produces.

## The control

Before writing the run record, run the **topic search** you were told not to
run, and record the overlap with what the axes returned.

This is not busywork. It is the only evidence that the axes did anything, and
it goes in the record as a number. The guard checks the control exists; it does
not grade it — an LLM grading its own search is
[resource 12](../../../resources/12-long-horizon-control.md)'s exact failure
mode. Reading the number is stage 5's job.

---

## Output

One file per candidate in `resources/queue/`, plus one run record.

```yaml
---
type: Resource Candidate
title: <title>
description: <one sentence — what it appears to claim>
resource: <url>
tags: [<vocabulary>]
targets: 09#evidence          # NN#<field> or G<n> — must resolve
axis: measured                # measured | alternative | opposing | falsifier | gap
status: draft
stale_after: <today + 30 days>
generated: { by: reinforce/0.1, at: <ISO-8601> }
sources:
  - id: search
    title: <the query that found it>
---

## Why this is a candidate
<2–4 sentences: the specific weak point, and what this would do to it>

## What would disqualify it
<one line, written BEFORE reading it>
```

Run record → `lab/reinforce/runs/YYYY-MM-DD-<note|gap>.md`, per
[phase 02](../../../lab/reinforce/phases/02.md).

Then:

```bash
node guards/reinforce.mjs
```

### Always — what this run taught about this skill

If the run exposed something about **`/reinforce` itself** — an axis that
returned nothing useful, a query shape that kept finding agreement, a note whose
frontmatter couldn't feed the axes — append it to [`LEARNINGS.md`](LEARNINGS.md)
next to this file:

```markdown
## YYYY-MM-DD · `kind` · open
<what happened>
**Account for:** <what should change, or what to watch for>
```

`fix` apply directly · `design` a real open question, and what `/brainstorm`
pulls with no argument · `friction` it worked but was tedious.

The control's overlap number belongs here whenever it's surprising, in either
direction. **"Nothing new" is a first-class answer.**

```bash
node tools/learnings.mjs --check
```

---

## Rules

1. **Never write to `resources/NN-*.md`.** Not a note, not a correction, not a
   tweak to an evidence tier. The queue and the run record are the only outputs.
2. **Every candidate names a target that resolves.** No target, no candidate.
3. **Write the disqualifier before reading.** A link sitting in a queue acquires
   standing it hasn't earned; naming what would kill it up front is the cheapest
   defence against intaking something because it's already there.
4. **Check the pool and `REJECTED.md` first.** Re-queueing a rejection
   re-litigates a decision that was already made.
5. **Don't judge, collect.** Finding the other side of an argument is the job.
   Settling it is not.
6. **Candidates are capped at ~3 per axis.** More than that is a search-results
   dump, and the reason each one is a candidate stops being written carefully.

## Failure modes

- **Every candidate agrees with the note.** You ran topic searches with axis
  labels on them. The control's overlap number will show it.
- **The queue grows and nothing gets intaken.** The candidates aren't compelling
  enough to act on, which means the *reasons* are thin, not that the queue needs
  a bigger cap.
- **A gap ID gets invented to make a candidate validate.** The guard catches the
  dangling ID; nothing catches a plausible-but-wrong one but you.
- **The falsifier axis finds the claim restated.** Searching the claim, not the
  outcome. "Recitation improves goal adherence" is the claim; "we added a todo
  file and drift got worse" is the outcome.
