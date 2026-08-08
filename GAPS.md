# Gaps

The standing list of things you can't do yet. **This is the spine of the repo** —
`/decompose-resource` cuts labs from gaps, not from resources.

Last reviewed: **2026-08-06**

## What belongs here

A gap is **a thing you cannot currently do**, stated concretely enough that you'd
know when it closed. Not a topic you find interesting, and not a resource you
haven't read.

Every gap carries its **provenance**, because gaps you inferred are weaker than
gaps you hit:

| Tag | Meaning |
|---|---|
| `stated` | You said it directly |
| `observed` | It happened in a session — the strongest kind |
| `delta` | Surfaced by a resource's knowledge delta |
| `inferred` | My read, **unverified** — treat as a hypothesis |

Gaps leave the list one way: **a lab closes them, and the closing is recorded
with a date.** A gap that stops feeling urgent is not closed, it's deferred —
say so rather than deleting it.

---

## Open

### G1 — Can't say which rules are enforced vs. merely requested
`stated` `observed` · **ready now** · → [lesson 00](workshop/lessons/00-enforcement-map/README.md)

You have a rich `CLAUDE.md` in board-brainstorm and no map of which lines are
held by code, which by the harness, and which only by the model choosing to
comply.

**Evidence it's real:** you answered "not sure what's enforced" directly. Then
mid-session a `git push` was blocked by a rule neither of us knew was there —
which is the same gap from the other side.

**Closed when:** every rule in board-brainstorm's `CLAUDE.md` is classified, and
the prose rules whose violation would be *silent* are ranked.

---

### G2 — Hooks: know they exist, haven't built with them
`stated` · **ready now** · → [lesson 02](workshop/lessons/02-hooks/README.md)

The one harness layer that enforces without the model's cooperation, and the one
you've used least.

**Evidence:** "Barely used them… familiar, but haven't done a lot with them yet."
board-brainstorm has **zero hooks** and at least four `CLAUDE.md` rules that
want to be hooks — including "always finish the push," whose failure is silent
and which `NEEDS_HUMAN_ATTENTION.md` records being missed repeatedly.

**Closed when:** a `PostToolUse` validator and a `Stop` hook that blocks
completion both exist and have been *seen to fail*.

---

### G3 — Permissions were never systematically decided
`stated` `observed` · **partly closed** · → [lesson 01](workshop/lessons/01-permissions/README.md)

**Evidence:** "Not sure what's enforced." `.claude/settings.json` now exists —
but it was written under duress mid-task to unblock a push, not decided. No
deny-first pass has been done on either repo.

**Closed when:** board-brainstorm has a deliberate deny list, every entry has a
recorded rationale, and each deny has been *seen to fire*.

**Known limit to record:** a `Read` deny does not stop a shell command reading
the same file. Permissions match tool invocations, not intentions.

---

### G4 — Measurement discipline has never been pointed at the workspace
`stated` `observed` · needs G1–G3 first · → [lesson 07](workshop/lessons/07-meta-eval/README.md)

You run 300 games/cell, seeded, with baselines rerun from the same code and
determinism checks before a headline. None of that has ever been applied to the
skills, agents, or prompts.

**Evidence:** "Not in this repo… it was mostly unsuccessful since it's hard to
quantize success/failure."

**Closed when:** a fixed prompt set exists, a routing-accuracy baseline is
recorded, and the noise floor is known from a same-day double run.

---

### G5 — Long-horizon work: no way to enforce scope or completion from outside the loop
`stated` `observed` · needs G2 + G4 · → [lesson 08](workshop/lessons/08-long-horizon/README.md) · [lab](lab/README.md)

**Evidence:** a previous runner failed on exactly this — "the drift-guard drifted
itself" and "I couldn't figure out how to enforce self-auditing between ticks."
Diagnosed in [resource 12](resources/12-long-horizon-control.md): an LLM guard
drifts with its subject, and self-audit can't be requested from inside the prompt.

**Closed when:** a tick runs, a contract check fails it, and the harness blocks
completion — without the agent's cooperation.

---

### G6 — Cost mechanics are unmeasured
`inferred` **unverified** · **ready now, one hour** · → [lesson 07 §3](workshop/lessons/07-meta-eval/README.md)

Prefix stability, cache hit rate, and what invalidates them have never been
probed here.

**This is my inference, not your statement** — I never asked directly. Verify
before spending on it. If you already watch cache metrics, delete this.

**Closed when:** a cache hit rate is measured for one real session, and
`CLAUDE.md` has been audited for volatile content near the top.

---

### G7 — Never written the agent loop yourself
`stated` · not urgent · → [lab — own-loop primer](lab/README.md)

**Evidence:** "No — all inside Claude Code."

Every harness you've built lives inside someone else's loop, which is precisely
why "between ticks" (G5) was hard to control — you didn't own the between.

**Closed when:** a small tick-based agent runs against the API with your own
loop, state, and verification.

---

### G8 — MCP authoring is directed, not owned
`stated` · low priority

**Evidence:** "Claude wrote it, I reviewed" on `kb-mcp-resolve.mjs`.

Fine as-is — you consume MCP more than you author it. Listed so it isn't
mistaken for a strength, not because it needs closing soon.

**Closed when:** one MCP server has been authored from scratch — tool schemas,
error shapes, and the decision about what *not* to expose — without a draft to
review first.

### G9 — Retrieval: no working model of embeddings vs. lexical vs. hybrid
`delta` · not urgent · from [resource 15](resources/15-springdrift-persistent-runtime.md)

Your memory systems retrieve structurally (grep, scoped reads, partitions). CBR,
hybrid retrieval, and outcome-weighted ranking all came back `unknown`.

Relevant because [resource 15](resources/15-springdrift-persistent-runtime.md)
supplies a better promotion trigger for lesson 05 than the access-counting we
invented — and adopting it means understanding it.

**Closed when:** resource 15's hybrid-vs-dense retrieval result can be explained
with the source closed, and lesson 05's promotion trigger has either been
adopted with its ranking understood or rejected for a stated reason.

### G10 — Persistence, supervision, and crash recovery as a runtime concern
`delta` · not urgent · from [resource 15](resources/15-springdrift-persistent-runtime.md)

Append-only is `partial` (anchored on ADR-style indexes). Supervision, restart
strategies, and replay-based state recovery are `unknown`.

**Closed when:** a process has been killed mid-work and seen to rebuild its
state by replay rather than by reloading a snapshot.

### G11 — No systematic way to decompose a large task into small, testable, modular skills
`stated` · **ready now** · → [lab/modular-skill-composition](lab/modular-skill-composition/PRD.md)

Large tasks get planned as one long prose runbook or one big skill, not as a set
of small skills that each do one thing, declare their inputs/outputs, and carry
their own failing check. There's no shared contract for what "modular" means
here, and no procedure for splitting a task along those seams instead of
arbitrary ones.

**Evidence it's real:** you asked directly for "a lab where we plan a large
task and decompose it into small, testable, modular skills."

**Closed when:** a `/decompose-task` skill exists, every skill spec it produces
passes a mechanical contract check, and it's been run on a real task in this
repo with the output compared against a hand-written decomposition.

---

### G12 — Ideas don't become gaps; they become code or they evaporate
`observed` · **ready now** · → [lab/brainstorm](lab/brainstorm/PRD.md)

`GAPS.md` is the spine, and nothing feeds it. There is no path from a rough
idea to a gap entry — ideas either get built immediately, skipping the spine
entirely, or they're lost when the session ends.

**Evidence it's real:** twice in one session. The modular-skill-composition lab
was cut from a gap tagged `stated` ninety seconds after the sentence that
produced it, having never been hit. The OKF retrofit — the largest thing built
that day — went from a message straight to code with no gap, no PRD, and no
phases. Both produced working artifacts, and neither is recorded as a decision.

**Closed when:** `/brainstorm` exists and has produced at least one `GAPS.md`
entry with a provenance tag, **and** one idea has been explicitly declined
rather than built, with the reason recorded.

---

### G13 — No external check on scope; over-engineering is self-reported
`stated` `observed` · needs G12 first

The only current defence against over-building is noticing it yourself, which
is precisely what doesn't happen while you're enjoying the build.

**Evidence:** "this one I have yet to implement well." The prior HIVE approach
spun up an idea-man and a devil's-advocate, but only *on request* — it fired
when you remembered to ask, which is never the moment you need it. Same session
as G12 supplies the observed half: nothing fired on either over-build.

The design has to key on an **artifact**, not a mood — a lab cut from a
non-`observed` gap, a phase with no failing check, a PRD that appeared after the
code. Those are checkable; "am I over-engineering?" is not.

**Closed when:** a scope check fires on an artifact without being asked, and has
been *seen to block* something that was already underway.

**Known limit to record:** this is [G5](#g5) at design time rather than run
time, and it inherits G5's problem — [resource 12](resources/12-long-horizon-control.md)
says an LLM guard drifts with its subject. The idea-man / devil's-advocate pair
only works because they're separate contexts that never see each other's output.

---

### G14 — The resource pool has never been verified
`observed` · **ready now, one sitting**

`PIPELINE.md` stage 5 says comprehension is checked, not self-assessed, and the
30-day decay rule says what you can no longer explain you no longer have.
Neither has ever run on `resources/`.

**Evidence:** all 16 notes carry `verified: []` — counted from frontmatter, not
estimated. The rule has been written down for the entire life of the repo and
executed zero times.

**Closed when:** at least one note carries a `verified` entry from a `human:`
actor, and one decay recheck has been run against a note verified 30+ days
prior.

---

## Not gaps — confirmed strengths

Recorded so they don't get re-litigated, and so labs don't get built for things
you already do well:

- **Context governance** — authority chains with explicit non-authority tiers
- **Scoped reference pools** — promotion ladders, dispositions, and status
  banners that defend against *retrieval-time* poisoning
- **Memory architecture** — partitioning by responsibility, scoped reads,
  declared writers, conditional cleanup. Ahead of the published literature;
  see [resource 14](resources/14-memory-architecture.md)
- **Epistemic sandboxing** — your own pattern, unpublished elsewhere;
  see [resource 13](resources/13-epistemic-sandboxing.md)
- **Skill trigger wording** — you already write descriptions as trigger lists
- **Subagent design** — structured output contracts and explicit tool scoping
- **Measurement discipline on domain problems** — seeded, baselined, archived,
  determinism-checked

The pattern: **you are strong at context and weak at enforcement.** Nearly every
open gap above is the same gap wearing different clothes.

---

## Closed

*(none yet)*

Format when one closes:

```
### G0 — <what you couldn't do>
Closed YYYY-MM-DD by <lab or lesson>. Verified by <the check that proves it>.
```
