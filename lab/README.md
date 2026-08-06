# lab/

Where learning gets built. Each lab either extends the harness or is
encapsulated here.

Labs are the output of `/decompose-resource` (see [PIPELINE.md](../PIPELINE.md)),
so each one gets:

```
lab/<name>/
  PRD.md        what it's for; what you'll be able to do after
  ROADMAP.md    ordered phases, dependencies, current position
  phases/NN.md  one per phase, each with its own failing check
```

The entries under **Queued** are hand-written placeholders and should be
replaced by real decompositions once `/decompose-resource` exists — every lab
below assumes layers `workshop/` builds.

## Active

### [Modular skill composition](modular-skill-composition/PRD.md)
Closes [G11](../GAPS.md) — no systematic way to decompose a large task into
small, testable, modular skills. Phase 1 is done: a skill-unit contract
(`workshop/spec/skill-contract.md`) and a guard
(`guards/skill-contract.mjs`) that checks a skill spec for single
responsibility, explicit inputs/outputs/composition, and a real failing
check. Phases 2–3 (a `/decompose-task` skill, then dogfooding it on the
long-horizon runner below) are queued.

This one didn't wait on `workshop/` — it doesn't extend a harness layer, it's
a decomposition procedure for skills themselves, so it stood on its own gap
(G11, `stated`) rather than a resource delta.

### [`/reinforce`](reinforce/PRD.md)
Pipeline build-order item #3 — the stage that searches an existing note's weak
points rather than its topic, and the terminating action for `CLAUDE.md`'s
knowledge-layer rule. Queue, guard, and skill are built; the four axes are
specified but have never been run against a real note, which is the open
question in [phase 02](reinforce/phases/02.md).

Cut from `PIPELINE.md`'s build order rather than from a gap — a gap is something
*you* can't do, and this was a missing stage in the pipeline itself.

## Queued

### Long-horizon runner
The real target. A harness for work that outlives a single context window —
contracts as predicates, a code-based drift guard, and completion gated from
outside the loop.

**The capability:** point it at a repo, a task, and a contract; it works in
ticks until the contract is met or a cap is hit, without scope creep and
without declaring victory early. Nothing about it is domain-specific.

Five parts, each independently useful:

| Part | Built in | Purpose |
|---|---|---|
| contract schema + checker | lesson 08 | done-conditions as predicates |
| tick loop | lesson 08 | the execution shape |
| external completion gate | lesson 02 (`Stop` hook) | the agent doesn't decide it's done |
| fresh-context restart | lesson 08 | survive the window, rebuild from disk |
| capped escalation | lesson 08 | stop retrying, file a blocker |

Blocked on: workshop lessons 03 (guards), 07 (baseline), 08 (contracts).

**A good first target — one you already need.** `board-brainstorm`'s card chain:
`--pdf → --cards → --sheets → publish-assets → push → --tts`. It's multi-step,
has an objective done state, is partly gated already, and
`NEEDS_HUMAN_ATTENTION.md` records that it has been left half-finished more than
once — including at the one step with no gate. That makes it an honest
long-horizon test rather than a toy: real failure modes, verifiable completion,
and finishing it is worth something regardless of what the runner teaches you.

The prior-failure analysis behind the design is in
[resources/12](../resources/12-long-horizon-control.md). Short version: an LLM
drift-guard drifts with the thing it's guarding, and self-auditing cannot be
enforced from inside the prompt.

### Harness auditor
A subagent whose only job is to audit the harness from outside it: do the
guards still fire, have skills drifted from their contracts, does every
`CLAUDE.md` rule still sit in the tier it claims.

It has to be a subagent rather than a skill for a structural reason —
[resource 12](../resources/12-long-horizon-control.md) is explicit that
self-audit cannot be requested from inside the prompt, so the auditor must not
share the context it is auditing. That is the same argument as
[resource 13](../resources/13-epistemic-sandboxing.md), pointed at the harness
instead of at a rules question.

Mostly it should *run the deterministic guards and report*, not reason about
compliance. An LLM judging whether rules were followed is the drift problem
again.

Serves [G13](../GAPS.md). Blocked on there being enough harness to audit.

### Implementation subagent
"Implement phase 04" → it does, stopping at every point where it would have to
infer, asking, appending the Q&A to the PRD, and continuing. Deliverable-shaped,
so a subagent rather than a skill: you want the diff, not the conversation.

The appended Q&A is the interesting part — it turns the gaps in a PRD into a
written record of what wasn't specified, which is exactly the input
`/phase-overview` needs.

Blocked on `/decompose-resource` producing PRDs worth implementing against.

### MCP-as-code
Generate a typed filesystem API from connected MCP servers so tool catalogues
live on disk instead of in context. Published result: 150k → 2k tokens on a
data-movement workflow.

Natural target: `kb-query` plus one other server. Worth measuring whether the
specialized MCP path beats grepping the corpus directly — `board-brainstorm`'s
`CLAUDE.md` already hedges that the server is "an accelerator, not a
dependency," and resource 03 has a counter-example where generic filesystem
tools beat purpose-built retrieval by 30 points.

Requires a sandbox. Do not skip it — this hands code execution to a model
reading untrusted corpus text.

### Own-loop primer
Build a small tick-based agent against the API with your own loop, state, and
verification. Currently every harness you've built lives inside someone else's
loop — which is precisely why "between ticks" was hard to control.

Best done *after* lesson 08, when you know exactly which control point you were
missing.

## Adding a lab

A lab belongs here if it doesn't build a harness layer. If it does, it's a
workshop lesson. If it extends an existing layer, it goes in that layer's
directory with a `runs/` entry.
