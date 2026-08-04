# Pipeline

How material enters this repo and becomes work.

**[`GAPS.md`](GAPS.md) is the spine.** Labs are cut from gaps — things you can't
do yet — not from whatever resource happened to cross your desk. Resources are
pulled toward gaps; curiosity can still push one in the side door, but it has to
declare which gap it serves.

```
GAPS.md ──── the standing list of things you can't do yet
   │
   │  pulls                                    pushes (curiosity)
   ├──────────→ /intake <url> ←───────────────────────┘
   │                 │
   │                 ├─→ resources/  (kept: note + explainer + delta)
   │                 └─→ REJECTED.md (not)
   │
   └──→ /decompose-resource <gap> ──→ lab/<name>/{PRD, ROADMAP, phases/}
                                            │
                        follow ROADMAP; start a phase only if you
                        understand it going in
                                            │
                    ┌───────────────────────┴───────────────┐
                    │                                       │
            you understand it              you don't → /phase-overview
                    │                        (walk it through, or split)
                    ↓
            build it, then VERIFY by explaining it back
            with the source closed
                    │
                    ↓
            30 days later: explain it back again
```

## The governing rule

**The deliverable is your understanding, not the artifact.** A phase you
completed without understanding is a failed phase regardless of whether the code
works. That's what makes this a lab and not a delivery pipeline.

## Why gaps are the spine

A resource-driven pipeline builds whatever you happened to read. That's the
autodidact failure mode: a shelf of half-finished projects, each started because
something was interesting that week, none of them closing a gap you had.

Gap-driven work is more disciplined and less fun, so the side door stays open —
serendipity is real and has already paid off here. [Resource 15](resources/15-springdrift-persistent-runtime.md)
arrived on curiosity alone and handed lesson 05 a better promotion trigger than
the one we'd invented. Nothing gap-driven would have found it.

**One rule joins the two directions:** every kept resource names the gap it
touches, or says `none — reference`. Enough to prevent accumulation without
killing serendipity.

---

## Stage 1 — `/intake <url>`

Read the resource, discuss it, decide. Ends with an explicit **keep or ignore**,
never a maybe. Five phases, and the ordering is the methodology — skim, capture
the reader's delta, *then* explain. See
[`.claude/skills/intake/SKILL.md`](.claude/skills/intake/SKILL.md).

**Kept** → a note in `resources/` in the house format, **plus** a visual
explainer at `resources/explainers/NN-<slug>.html` — six fixed sections, built
for scanning. Section 03, "How much to believe it," is non-negotiable: a polished
page makes weak evidence feel strong, and the evidence strip is the counterweight.

**Ignored** → one line in [`resources/REJECTED.md`](resources/REJECTED.md) with
the reason and date. Rejection is a decision; unrecorded, it gets re-litigated.

**Either way** → the knowledge delta in `resources/deltas/`, written *before* any
explanation. Never skipped.

**Either way** → the note's **So what** row names a gap ID from
[`GAPS.md`](GAPS.md), or `none — reference`.

## Stage 2 — `/decompose-resource <gap>`

Takes **a gap** plus the resources that contribute to it, and produces a lab:

```
lab/<name>/
  PRD.md        the gap, and what you'll be able to do once it's closed
  ROADMAP.md    ordered phases, dependencies, current position
  phases/NN.md  one file per phase
```

### Phases are drawn at *your* seams

Resource deltas are not optional input. Without them, phases get cut along the
decomposer's model of the material — and when phase 3 defeats you, the boundary
itself was wrong, so re-splitting only subdivides a bad cut.

Boundaries follow `known → partial → unknown`. Work you already understand gets
one phase; work you don't gets several.

### Every phase declares its failing check, at decomposition time

```yaml
phase: 3
claim: <the specific assertion this phase tests>
cites: resources/09-manus-context-engineering.md#kv-cache
build: <what you make>
failing_check: <command that exits non-zero when the claim doesn't hold>
done_when: <observable condition>
```

A phase with no `failing_check` is a **reading task** — label it `type: reading`
and move on. What isn't allowed is a build phase that can't fail, because a
roadmap of unfalsifiable phases looks like progress and isn't.

`cites` points at a section, not a whole note.

## Stage 3 — follow the ROADMAP

Start a phase **only if you understand it going in.** If you don't, stop and go
to stage 4. Skipping that gate is the one way to break this pipeline, and it will
feel efficient at the time.

## Stage 4 — `/phase-overview <phase>`

For a phase you can't start. Two outcomes: walk through it together while
implementing, or split it further.

### The stopping rule

> **A phase is atomic when it has exactly one failing check and fits one
> sitting.**

If you can't name its failing check, it isn't a phase — it's a topic, and it goes
back to the reading list. This keeps "very very modular" from subdividing forever
into a sixty-phase roadmap you never start.

## Stage 5 — verify by explaining it back

**Comprehension is checked, not self-assessed.** Finishing a phase means:

1. Close the note, the code, and the resource.
2. Explain what you built and why it works — out loud or written.
3. Diff that against `phases/NN.md` and the cited note section.
4. **Divergences are what you didn't actually get.** They become the next phase,
   or a `/phase-overview` run.

The self-assessed gate in stage 3 is a *filter*; this is the *check*. They are
not the same thing, and this repo already demonstrates why — capturing
predictions before reading exists precisely because self-assessed understanding
is unreliable. It's the [epistemic sandboxing](resources/13-epistemic-sandboxing.md)
pattern turned on the learner: predict, then diff.

Record the run in `lab/<name>/runs/`.

## Decay — 30 days later

Re-run stage 5 on a closed phase after **30 days**, source closed. What you can
no longer explain, you no longer have.

This is [resource 15](resources/15-springdrift-persistent-runtime.md)'s read-time
confidence decay applied to your own knowledge: nothing needs cleaning up,
things simply lose standing until re-verified. A gap that reopens goes back on
[`GAPS.md`](GAPS.md), noted as closed once.

---

## Build order

The skills are themselves a lab, and they need
[lesson 00](workshop/lessons/00-enforcement-map/README.md)'s classification so
they don't repeat the prose-only mistake this repo exists to fix.

1. **`/intake`** — done. Everything downstream needs its delta output.
2. **The artifacts** — `REJECTED.md`, `deltas/`, `GAPS.md`. Done.
3. **`/reinforce`** — searches a note's *weak points*, not its topic: who
   measured what this asserted, who solves the same problem differently, who
   holds the other side of an unresolved conflict, and whether anyone has run
   the falsifier. Outputs candidates to a queue, never notes. **Not built.**
4. **`/decompose-resource`** — after 3–4 real intakes, when you know what a delta
   actually looks like. **Not built.**
5. **`/phase-overview`** — last. You won't know what "too big" feels like until a
   phase defeats you. **Not built.**

## Why the intake gate matters

It makes broad searching safe. Without a gate, hunting for resources is
speculative accumulation — the failure mode
[resource 01](resources/01-effective-context-engineering.md) and
[02](resources/02-agent-harness-engineering.md) both warn about, where a pool
fills with material nobody chose. With one, a search produces only *candidates*,
and nothing enters without a decision.

Same machinery as `braindump → --rec → canon`: promotion is the only path in.
