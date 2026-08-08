# LEARNINGS — agents

What running `idea-man` and `devils-advocate` has taught about their prompts.
Format and checks: `node tools/learnings.mjs --check`.

**Nothing yet — neither has ever been invoked.** This file exists empty on
purpose: an empty file that is checked reads differently from a file that was
never created, and the second is indistinguishable from having forgotten.

A lesson belongs here rather than in `/brainstorm`'s file when it is about an
agent's *own prompt* — "the devil's advocate keeps objecting on cost even when
cost isn't the issue" is a prompt problem. A lesson about *when* the pair fires,
or what the orchestrator does with their output, belongs in
[`/brainstorm`](../skills/brainstorm/LEARNINGS.md).

Things worth watching on the first few runs, recorded here as prompts to
observation rather than as entries, since nothing has been observed:

- Does `devils-advocate` ever return "I can't make a strong case against this"?
  It is explicitly permitted to, and an advocate that never does is one that has
  learned to always find something.
- Does `idea-man` actually reach for the *cheapest* version that would prove the
  idea, or does it default to the most impressive one?
- Do either of them cite `resources/` by note and section, or fall back to
  arguing from training data when the pool is silent? Both are told to say the
  pool is silent instead.
