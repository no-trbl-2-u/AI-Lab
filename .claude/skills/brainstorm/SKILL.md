---
name: brainstorm
description: >
  Socratic partner for harness and AI-workspace design. Mirrors a rough idea
  back, captures whether it has actually been hit or is a hypothesis, grounds it
  in resources/ by note and section, runs an isolated idea-man and
  devil's-advocate pair, offers 2–3 directions each with a telltale failure
  mode, and ends in a forced verdict — a GAPS.md entry with a provenance tag, or
  an explicit "not a gap". Never writes code.
  Use when the user says "/brainstorm", "let's brainstorm", "what if", "I had an
  idea", "I'm thinking about", "should we build", "would it make sense to", or
  asks any open-ended design question about agents, skills, subagents, memory,
  enforcement, permissions, hooks, retrieval, or the pipeline itself.
---

# /brainstorm — the front of the pipeline

`GAPS.md` is the spine and **nothing feeds it.** This is the stage that does.
See [PIPELINE.md](../../../PIPELINE.md) build order #6 and
[G12](../../../GAPS.md).

**Before running: read this skill's [`LEARNINGS.md`](LEARNINGS.md) and apply
any open `fix` entries.** A `fix` left open is an instruction this file is known
to get wrong; running the file as written repeats the failure that produced it.

## Called with no argument

```bash
node tools/learnings.mjs --next
```

That prints the **oldest open `design` learning** across every skill, agent, and
guard — a real unanswered question about the harness, recorded by whoever last
ran the thing. Run the normal flow below with it as the idea, and note which
entry you took.

Deterministic, not random: a random pull re-surfaces the same entry and stops
being trusted. If it prints `NONE`, **say so and stop.** Do not fall back to
inventing a topic — nothing open means nothing open, and manufacturing a session
to fill the silence is how these files fill with noise.

On `verdict: gap`, set `from_learning: <unit>:<date>` in the session file and
mark the source entry `resolved` pointing at the new gap. That closes the loop:
a run teaches something → it becomes a gap → a lab closes it.

## The job

**The job is not to hand over a finished plan, and it is emphatically not to
build the thing.** It is to:

1. Reflect the idea back so the underlying design problem is named.
2. Establish **whether this has actually been hit, or is a hypothesis.**
3. Ground it in `resources/` — by note and section, or say the pool is silent.
4. Get an isolated argument for it and against it.
5. Offer 2–3 directions, each carrying its own telltale failure mode.
6. End in a **verdict**: a `GAPS.md` entry, or an explicit "not a gap."

> **The output is a gap or a decision. Never code, never a PRD, never a lab.**

A brainstorm that ends in an implementation plan has skipped the spine, which is
precisely how the two over-builds in G12's evidence happened.

---

## Ground the conversation first

One quick read. Don't audit the repo before talking.

| The idea touches | Read first |
|---|---|
| Enforcement, rules, what holds | `resources/11-enforcement-boundary.md`, `workshop/lessons/00-enforcement-map/README.md` |
| Long-horizon work, drift, contracts | `resources/12-long-horizon-control.md` |
| Subagents, isolation, prediction | `resources/13-epistemic-sandboxing.md`, `07`, `08` |
| Memory, retrieval, promotion | `resources/14-memory-architecture.md`, `15` |
| Context, caching, cost | `resources/01-*.md`, `09-manus-context-engineering.md` |
| Skills, progressive disclosure | `resources/05-agent-skills-progressive-disclosure.md` |
| The pipeline itself | `PIPELINE.md`, `.claude/skills/intake/SKILL.md` |
| Anything | `GAPS.md` — it may already be there |

The pool is OKF, so its state is one `grep`:

```bash
grep -l 'tier: asserted' resources/*.md    # what is unmeasured
grep -l '^gap: .*G5' resources/*.md        # what serves a given gap
grep -A2 '^conflicts:' resources/*.md      # where the pool disagrees with itself
```

---

## Phase 0 — Mirror

Restate the idea and name the design problem underneath it. The surface question
is rarely the real one.

> You're asking whether the auditor should run on every commit. The problem
> underneath is: *is harness drift continuous or episodic?* Those want different
> triggers, and we've never measured which one this repo has.

If the underlying problem isn't clear, say so and move to phase 1 anyway.

## Phase 1 — Capture (the one mandatory question)

**Ask this before offering any position, via `AskUserQuestion` — not prose.**
The question is "has this actually bitten you, or is it a hypothesis — and what
prompted it right now?", and the four provenance tags are the options. The tags
are a closed set, which is exactly the shape that tool wants; asked in prose
the question went unanswered for two turns in the first real session while
finished work sat waiting.

| Option | The answer sounds like | What the tag means for ranking |
|---|---|---|
| `observed` | "It broke last Tuesday and here's the file" | strongest; sorts first in `GAPS.md` and `ROADMAP.md` |
| `stated` | "I want to be able to do X" | a want, not an incident; the tag everything drifts toward |
| `delta` | "Reading note 15 made me realise…" | came from the pool; a resource question until proven otherwise |
| `inferred` | "General unease, nothing broke" | a hypothesis; say so out loud, and expect `declined` or `deferred` |

Each option carries its ranking consequence in its description, so the user is
choosing a position on the spine, not a phrasing. **Prose fallback:** if the
user has already volunteered the answer in their opening message, don't re-ask —
name the tag you heard and carry on.

This is the only required question, and it does double duty: it satisfies
`CLAUDE.md`'s rule that a prediction is captured before anything is explained,
and its answer *is* the provenance tag the gap will carry.

**Provenance is this repo's ranking signal.** `observed` sorts above `stated`
above `inferred` in `GAPS.md`, in `ROADMAP.md`, and in G13's future scope check.
A brainstorm that tags everything `stated` has produced a wish list.

### The follow-up archetypes

Use these **only where an answer opened something.** They are not a checklist,
and you do not run them all.

| Archetype | The question |
|---|---|
| Failure mode | What's the most boring way this becomes noise you learn to ignore? |
| Inverse | If we never built it, what actually breaks? |
| Scope | Load-bearing for the whole harness, or a knob on one lab? |
| Budget | One guard, one skill, one subagent, or a subsystem? |
| Comparable | Which note already solves this, and which would you most want to *avoid* copying? |
| Enforcement | If this rule got violated, would you notice? (lesson 00's fourth column) |

**Stop asking when the user signals enough. Don't grind.**

> **A recorded tension.** Two earlier skills of the author's, on another
> machine and not in this repo, took opposite positions: one asked 2–4 probing
> questions before offering anything; the other argued *"three Socratic
> questions before any teaching makes learners disengage; if they're stuck,
> teach, then ask."* This skill chooses **one capture, then positions**, with
> follow-ups only on live threads. The choice is recorded rather than assumed so
> it can be revisited if sessions feel thin. (`AGENTS.md` § During a lesson
> holds the same tension for the repo as a whole: Socratic in lessons, default
> when building.)

## Phase 2 — Ground it in the pool

Grep before asserting. Three outcomes:

- **Already a gap** → say which, and stop. The idea isn't new; the gap is just
  unbuilt. That's a scheduling conversation, not a brainstorm.
- **The pool covers it** → cite by note and section (`R09 §kv-cache`) and say
  what it already tells you.
- **The pool is silent** → say exactly that, name what you'd have needed, and
  **offer `/reinforce`.** Do not backfill from training data, and never present
  an unsourced answer in the same register as a sourced one.

If you don't have a confident read on something, the sentence to say is: **"I
don't have a confident read on that — it's not in the pool."** Say that rather
than producing something plausible.

## Phase 3 — The advocate pair (unconditional)

Spawn both, in the same message so they run concurrently:

- `idea-man` — the happy path, and what it enables at scale.
- `devils-advocate` — the cost, what breaks, and the case for not building it.

**Give each one the idea and nothing else.** Neither sees the other's output.
That isolation is the entire mechanism — it's
[R13](../../../resources/13-epistemic-sandboxing.md) epistemic sandboxing, and a
critic who has read the enthusiasm is
[R12](../../../resources/12-long-horizon-control.md)'s drift problem in
miniature.

**This runs every time, not on request.** The prior approach fired only when
asked, which is never the moment it's needed — nobody interrupts their own good
mood to file a complaint.

Report both, briefly, and say where they actually disagreed. **If the devil's
advocate says it can't make a strong case, report that as a finding** — it's the
strongest evidence the idea is sound, and it should not be buried.

## Phase 4 — Directions

2–3 options. Never one, and never a recommendation until asked.

> **Option A — <short name>** *(nearest prior art: R<nn> §<section>, or "none in the pool")*
> Sketch: <one paragraph, in this repo's terms>
> Cost: <tokens / context / maintenance / new failure modes>
> Enforcement tier: <code | harness | prose> — and whether its failure is silent
> **Telltale failure mode:** <what you'd observe if this is the wrong call>

The last line is not optional. An option with no disconfirming observable is a
preference, and this repo's whole method is that a claim you can't falsify isn't
a claim. It becomes the gap's `falsifier` if this direction wins.

## Phase 5 — Verdict

Forced. `AskUserQuestion`, recommended option first, one-line reason. **No
maybes.**

| Verdict | Means | Next |
|---|---|---|
| `gap` | A real thing you can't do | Draft the `GAPS.md` entry |
| `declined` | Not worth building — **record why** | Session file only |
| `resource-question` | You need to know something, not build something | `/intake` or `/reinforce` |
| `deferred` | Real, but not now — **name what would make it urgent** | Session file only |

`deferred` without a trigger condition is a maybe in a costume. Push for the
condition or take `declined`.

## Phase 6 — Residue

**Always** → the session file, `brainstorms/YYYY-MM-DD-<slug>.md`:

```markdown
---
type: Brainstorm Session
title: <the idea, one line>
description: <the design problem underneath, one sentence>
date: YYYY-MM-DD
verdict: gap                 # gap | declined | resource-question | deferred
gap: G15                     # required iff verdict is `gap`
provenance: observed         # required iff verdict is `gap`
reason: <required iff verdict is `declined`>
cites: [9, 12]               # notes consulted, by id
from_learning: /reinforce:2026-08-06   # iff the session came from --next
generated: { by: brainstorm/0.1, at: <ISO-8601> }
---

## Surface question
<their original framing, one line>

## The problem underneath
<what phase 0 named>

## Provenance
<what phase 1 established, and the evidence for it>

## What the pool said
- **R<nn> §<section>** — <one line>
- <or: "the pool was silent on X; /reinforce offered">

## The two arguments
**For:** <idea-man, compressed>
**Against:** <devil's-advocate, compressed>
**Where they actually disagreed:** <one line — this is the useful part>

## Directions on the table
### Option A — <name>
<sketch> · Cost: <…> · Tier: <…>
**Telltale failure mode:** <…>

## Verdict
<one of the four, and why>

## Open questions
- <bullet, or "none">
```

**On `verdict: gap`** → draft the `GAPS.md` entry and **ask before writing it.**
Show the exact block. The spine is not something a conversation edits unattended.

```markdown
### G<n> — <what you can't do>
`<provenance>` · **ready now** · → <destination, or omit>

**Evidence it's real:** <what phase 1 established>

**Closed when:** <the observable that would end this gap>
```

Then:

```bash
node guards/gaps.mjs
npm run roadmap
```

**If the session came from `--next`**, mark the source entry `resolved` with a
line saying where it landed, and set `from_learning:` in the session file.

### Always — what this run taught about this skill

If the run exposed something about **`/brainstorm` itself** — a phase that
dragged, a case it didn't handle, an instruction that turned out to be wrong —
append it to [`LEARNINGS.md`](LEARNINGS.md) next to this file. Format, kinds,
the "nothing new" rule and the check: see `CLAUDE.md` § Learning from a run.

---

## When to break the ritual

- "Just tell me what you think" → skip phase 1's follow-ups, keep phase 3.
  **Never skip the advocate pair** — that's the one the user asked to be
  protected from themselves on.
- Already a gap in `GAPS.md` → say so in phase 2 and stop. Don't run the whole
  ritual on a decision that's already recorded.
- The user is mid-implementation with a quick scoped question → answer it. **Do
  not invoke this skill** for "should this function be async."
- Not a design question at all — a bug, a refactor, a git problem → do not
  invoke this skill.
- The user explicitly wants to build now and has accepted the risk → say once,
  plainly, that this is the G12 pattern, record the session as `deferred` with
  that note, and get out of the way. It's their repo.

## Anti-patterns

- ❌ Producing a PRD, a phase list, or code. **The output is a gap or a decision.**
- ❌ Skipping the advocate pair because the idea seems obviously good. That's
  exactly when it fires.
- ❌ Letting the two advocates see each other's output.
- ❌ Tagging `observed` when the answer to phase 1 was "general unease." That
  single move corrupts the ranking signal the entire roadmap sorts on.
- ❌ Citing the pool vaguely ("resource 12 says something about drift") — name
  the section.
- ❌ Inventing pool support for an idea the pool is silent on.
- ❌ Accepting `deferred` with no trigger condition.
- ❌ Grinding through all six follow-up archetypes when one landed.
