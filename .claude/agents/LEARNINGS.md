# LEARNINGS — agents

What running `idea-man` and `devils-advocate` has taught about their prompts.
Format and checks: `node tools/learnings.mjs --check`.

A lesson belongs here rather than in `/brainstorm`'s file when it is about an
agent's *own prompt* — "the devil's advocate keeps objecting on cost even when
cost isn't the issue" is a prompt problem. A lesson about *when* the pair fires,
or what the orchestrator does with their output, belongs in
[`/brainstorm`](../skills/brainstorm/LEARNINGS.md).

Things worth watching on the first few runs:

- Does `devils-advocate` ever return "I can't make a strong case against this"?
  It is explicitly permitted to, and an advocate that never does is one that has
  learned to always find something.
- Does `idea-man` actually reach for the *cheapest* version that would prove the
  idea, or does it default to the most impressive one?
- Do either of them cite `resources/` by note and section, or fall back to
  arguing from training data when the pool is silent? Both are told to say the
  pool is silent instead.

## 2026-08-08 · `design` · open
Both agents were invoked once, in the first real `/brainstorm` session
([`brainstorms/2026-08-08-functional-programming-for-ai-workspaces.md`](../../brainstorms/2026-08-08-functional-programming-for-ai-workspaces.md)).
Recorded here 2026-09-04 from that session file, which is the only record;
the agents' raw output was not kept. Against the watch-list above, n=1:

- The advocate did **not** decline. It made a full case and named its own flip
  condition (one logged incident of silent re-run corruption, or `/decompose-task`
  run for real showing the contract's fields insufficient).
- The advocate's value came from **retrieval, not persuasion**: it surfaced
  `workshop/spec/skill-contract.md` and `guards/skill-contract.mjs`, which the
  orchestrator's own grep had missed, and that finding is half the recorded
  reason for the `declined` verdict. The verdict itself was driven by the
  capture answer (`inferred`), not by the advocate's argument.
- Citations: the against-argument cites the pool by section (R08
  §the-two-principles) and gaps by ID (G3, G6); the for-argument as compressed
  in the session cites gaps (G4, G6) and repo files, not notes by section.
- Whether `idea-man` named the *cheapest* version is not recoverable from the
  session's compression of its argument.

The prompt-level point: `devils-advocate`'s grounding rule says "Grep
`resources/` and `GAPS.md`", but the file that paid for the invocation lives in
`workshop/spec/`, outside that scope. The agent went wider than instructed and
that is where the payoff was.
**Account for:** on the next two or three sessions, note which directory each
advocate's best-cited file came from. If it keeps being outside `resources/`
and `GAPS.md`, widen the grounding rule in both prompts to name `workshop/`,
`guards/`, and `lab/` explicitly rather than relying on the agent to exceed its
instruction. Keep the decline-rate watch open — one session cannot answer it.
