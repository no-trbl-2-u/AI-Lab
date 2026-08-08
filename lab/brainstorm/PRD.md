# `/brainstorm` — PRD

**Closes [G12](../../GAPS.md)** — ideas don't become gaps; they become code or
they evaporate. Also [PIPELINE.md](../../PIPELINE.md) build order #6.

---

## The problem

`GAPS.md` is the spine. Labs are cut from it, every resource declares the gap it
serves, and `ROADMAP.md` sorts by its provenance tags. **Nothing feeds it.**

There is no path from a rough idea to a gap entry, so an idea does one of two
things: it gets built immediately, skipping the spine entirely, or it's lost when
the session ends.

**Evidence, from the session that produced G12:**

- `lab/modular-skill-composition/` — a lab, a contract, a guard, and three phase
  files, cut from a gap tagged `stated` ninety seconds after the sentence that
  produced it, for a problem never actually hit.
- The OKF retrofit — 16 files, two guards, a new dependency — went from a message
  straight to code with no gap, no PRD, and no phases.

Both produced working artifacts. Neither was recorded as a decision, and nothing
fired to say so.

## What you'll be able to do

- Bring a rough idea and leave with **either a gap entry carrying an honest
  provenance tag, or a recorded reason you're not building it.**
- Get pushed back on without having to remember to ask for it.
- Find out three weeks later why you declined something.

## Non-goals

| Not this | Why |
|---|---|
| Producing a PRD or phases | That's `/decompose-resource` (build order #4), and it takes a **gap** as input. A brainstorm that outputs a plan has skipped the spine |
| Writing code | The failing check on phase 03 is partly `git diff --quiet` over `lab/`, `guards/`, and `tools/` |
| Deciding whether an idea is *good* | It decides whether the idea is a **gap**. Those are different questions |
| Replacing `/intake` | An idea that turns out to be a knowledge question exits via `resource-question` |
| Closing [G13](../../GAPS.md) | The advocate pair is a partial payment. G13 wants a check that fires on artifacts *outside* a conversation |

---

## The design calls

### One capture, then positions

Two skills on this machine disagree. `rpg-mechanics-brainstorm` asks 2–4 probing
questions before offering anything; `/mnt/skills/examples/learn` says *"three
Socratic questions before any teaching makes learners disengage."*

**Chosen: one mandatory question, then positions**, with follow-up archetypes
used only where an answer opened something. The tension is recorded in the skill
rather than resolved silently, so it can be revisited if sessions feel thin.

### The mandatory question is about provenance

> Has this actually bitten you, or is it a hypothesis? What prompted it now?

Not a design question — a **provenance** question. Its answer becomes the gap's
tag, and provenance is the signal this whole repo ranks on: `observed` above
`stated` above `inferred`, in `GAPS.md`, in `ROADMAP.md`, and in G13's future
scope check.

A brainstorm that tags everything `stated` has produced a wish list. That failure
is invisible per-session and obvious in aggregate, which is why
`brainstorms/README.md` documents `grep '^provenance:' brainstorms/*.md` as a
thing to run occasionally.

### The advocate pair is unconditional and isolated

`idea-man` and `devils-advocate` run on **every** session, and **neither sees the
other's output.**

Both properties are load-bearing and each fixes a different failure:

- **Unconditional** fixes the prior HIVE approach, which fired only on request —
  and nobody interrupts their own good mood to ask whether they're
  over-engineering.
- **Isolated** is [R13](../../resources/13-epistemic-sandboxing.md). A critic who
  has read the enthusiasm softens; an advocate who has read the objections
  hedges. Two passes in one context would produce mush wearing a debate's
  clothes, which is [R12](../../resources/12-long-horizon-control.md)'s drift
  problem in miniature.

**A devil's advocate that reports "I can't make a strong case against this" is a
finding, not a failure**, and the skill is told to surface it rather than bury
it.

### It proposes the gap entry; it doesn't write it

Mirrors `/intake` phase 3. The spine is not something a conversation edits
unattended — the skill drafts the exact block and asks.

---

## Risks

1. **Ritual fatigue.** Six phases for "what if we…" is heavy. Mitigated by
   *When to break the ritual*, which maps each escape to a precise phase-skip and
   includes a de-invocation clause. Watch for the skill firing on questions that
   wanted a two-line answer.
2. **Provenance inflation.** The one failure that corrupts everything downstream,
   and it is **not mechanically detectable** — `guards/gaps.mjs` checks that a
   tag is present and from the fixed set, never that it's honest. A guard that
   claimed otherwise would be an LLM grading its own work. This stays prose, and
   `CLAUDE.md` says so.
3. **The pair becomes theatre.** If every session ends `verdict: gap` and the
   devil's advocate never talks anyone out of anything, the isolation isn't
   buying what it costs. That's phase 03's stage-5 question.
