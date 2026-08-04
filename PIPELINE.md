# Pipeline

How material enters this repo and becomes work. Four stages, three of them
skills. Nothing skips a stage.

```
link → /intake → resources/ (kept: note + explainer) or REJECTED.md (not)
                      ↓ + knowledge delta
              /decompose-resource → projects/<name>/{PRD, ROADMAP, phases/}
                      ↓
              follow ROADMAP; implement a phase only if you understand it
                      ↓ (if you don't)
              /phase-overview → walk it through, or split it further
```

## The governing rule

**The deliverable is your understanding, not the artifact.** A phase you
completed without understanding is a failed phase regardless of whether the
code works. That's what makes this a lab and not a delivery pipeline, and it's
why the comprehension gate sits between the roadmap and the work rather than
after it.

## Stage 1 — `/intake <url>`

Read the resource, discuss it, decide. Ends with an explicit **keep or ignore**,
never a maybe.

The conversation covers: what it claims, what's genuinely new against the
existing 14 notes, where it contradicts something already here, and whether it
changes anything we'd actually do.

**Kept** → a note in `resources/`, in the house format, **plus a visual explainer**
at `resources/explainers/NN-<slug>.html` — a single self-contained page answering
*what is this for?* Six fixed sections, built for scanning rather than reading.
Section 03, "How much to believe it," is non-negotiable: a polished visual page
makes weak evidence feel strong, and the evidence strip is the counterweight.
**Ignored** → one line in [`resources/REJECTED.md`](resources/REJECTED.md) with
the reason and date. Rejection is a decision worth recording; without it you
re-litigate the same link in three months.

### Output: the knowledge delta

Every intake ends by recording what you knew going in:

```markdown
## <resource> — delta (YYYY-MM-DD)
known:    <concepts you could already act on>
partial:  <know it matters, can't yet predict or apply it>
unknown:  <new to you>
```

Lives in `resources/deltas/`. This is the input stage 2 depends on, and it
doubles as a dated record of your own understanding — so drift in it becomes
visible instead of invisible.

## Stage 2 — `/decompose-resource <note>`

Takes a kept note **plus its delta** and produces a project:

```
projects/<name>/
  PRD.md        what this project is for; what you'll be able to do after
  ROADMAP.md    ordered phases, dependencies, current position
  phases/NN.md  one file per phase
```

### Phases are drawn at *your* seams

The delta is not optional input. Without it, phases get cut along the
decomposer's model of the material — and when phase 3 defeats you, the boundary
itself was in the wrong place, so re-splitting only subdivides a bad cut.

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

A phase with no `failing_check` is a **reading task**, not a build task. That's
allowed — label it `type: reading` and move on. What isn't allowed is a build
phase that can't fail, because a roadmap of unfalsifiable phases looks like
progress and isn't.

`cites` points at a section, not a whole note. At phase 5 you want the
paragraph, not a re-read — and it gives the link checker something real to
verify.

## Stage 3 — follow the ROADMAP

Implement a phase **only if you understand it going in.** If you don't, stop and
escalate to stage 4. Skipping the gate is the one way to break this pipeline,
and it will feel efficient at the time.

## Stage 4 — `/phase-overview <phase>`

For a phase you can't start. Two outcomes: walk through it together while
implementing, or split it into smaller phases.

### The stopping rule

> **A phase is atomic when it has exactly one failing check and fits one
> sitting.**

If you can't name its failing check, it isn't a phase — it's a topic, and it
goes back to the reading list. This is what keeps "very very modular" from
subdividing forever into a sixty-phase roadmap you never start.

## Build order

The skills are themselves a project, and they need
[lesson 00](workshop/lessons/00-enforcement-map/README.md)'s classification so
they don't repeat the prose-only mistake this repo exists to fix.

1. **`/intake`** — smallest, immediately useful, and everything downstream needs
   its delta output
2. **The artifacts** — `REJECTED.md` and the delta format, before more
   automation
3. **`/decompose-resource`** — after 3–4 real intakes, when you know what a
   delta actually looks like
4. **`/phase-overview`** — last. You won't know what "too big" feels like until
   a phase defeats you

## Why the intake gate matters

It makes broad searching safe. Without a gate, hunting for more resources is
speculative accumulation — the failure mode
[resource 01](resources/01-effective-context-engineering.md) and
[02](resources/02-agent-harness-engineering.md) both warn about, where a pool
fills with material nobody chose. With one, a search only produces *candidates*,
and nothing enters without a decision.

Same machinery as `braindump → --rec → canon`: promotion is the only path in.
