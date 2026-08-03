# projects/

Work that comes **after** the harness exists. Each project either extends the
harness or is encapsulated here.

Nothing lives here yet — `workshop/` has to run first, because every project
below assumes layers it builds.

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

## Adding a project

A project belongs here if it doesn't build a harness layer. If it does, it's a
workshop lesson. If it extends an existing layer, it goes in that layer's
directory with a `runs/` entry.
