# 10 — 12-Factor Agents

**Source:** HumanLayer (Dex Horthy) — <https://github.com/humanlayer/12-factor-agents>

## Why it matters

The software-engineering counterweight to everything else here. Its thesis is
that most production "agents" are ~80% deterministic software with LLM calls at
the decision points, and that treating the agent loop as a framework's job is
where reliability goes to die.

## The twelve factors

1. **Natural language to tool calls** — the core primitive: intent → structured
   invocation.
2. **Own your prompts** — no framework-owned prompt templates. Prompts are your
   source code.
3. **Own your context window** — actively construct what the model sees; don't
   accept a message-list append as the default.
4. **Tools are just structured outputs** — demystify. A tool call is a JSON
   object your code switches on.
5. **Unify execution and business state** — one state model, not an agent
   session shadowing your database.
6. **Launch / pause / resume with simple APIs** — agents must be interruptible
   and resumable.
7. **Contact humans with tool calls** — human-in-the-loop is just another tool.
   Escalation gets the same schema and durability as everything else.
8. **Own your control flow** — write the loop. Break, branch, and retry
   explicitly instead of inheriting a framework's `while` loop.
9. **Compact errors into the context window** — represent failures concisely so
   the model can act on them; cap consecutive retries and escalate.
10. **Small, focused agents** — narrow scope, 3–10 steps, not monoliths.
11. **Trigger from anywhere** — email, Slack, cron, webhook; the agent isn't a
    chat window.
12. **Make your agent a stateless reducer** — `f(state, event) → state`. Makes
    the whole thing testable, replayable, and resumable.

## Numbers & claims worth remembering

- Factor 3 is described as the linchpin the others depend on.
- The **"dumb zone"** finding cited in follow-up analysis: the middle 40–60% of a
  large context window is where recall degrades and reasoning falters; filling
  past ~40% shows diminishing returns. Consistent with the lost-in-the-middle
  literature and with 01's context rot. A practical target: **stay under ~40%
  of the window.**

## Wording notes

- Factor 2 has a direct implication for `CLAUDE.md`: treat it as versioned
  source, review its diffs, and delete lines that no longer earn their place.
- Factor 9 is a wording spec for error text — concise, actionable, and
  deduplicated when repeated.
- Factor 10 argues against the sprawling do-everything skill. If a skill's
  description needs "and" three times, split it.

## Tensions

- Factor 9 vs. resource 09's lesson 5. Keep the signal, compact the volume.
- Factor 12 (stateless reducer) sits awkwardly with 09's append-only KV-cache
  advice — replaying a reduced state rebuilds a prefix that may not be
  byte-identical. Worth measuring rather than assuming.

## Where it lands

→ [Lesson 08 — long-horizon control](../workshop/lessons/08-long-horizon/README.md); [projects/ — own-loop primer](../projects/README.md)
