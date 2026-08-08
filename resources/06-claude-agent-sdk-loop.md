---
type: Resource
id: 6
title: Building Agents with the Claude Agent SDK
description: The agent loop reduces to gather context, take action, verify work — and the verification step is the one most often missing.
origin: external
resource: https://claude.com/blog/building-agents-with-the-claude-agent-sdk
tags:
  - agent-loop
  - sdk
  - gather-act-verify
tier: core
status: stable
read: 2026-08
conflicts: []
verified: []
generated:
  by: claude/notes-0.1
  at: 2026-08-03T00:00:00Z
sources: []
---

# 06 — Building Agents with the Claude Agent SDK

## Why it matters

The simplest correct mental model of an agent harness, and the one to hold in
your head while reading everything else:

> **gather context → take action → verify work → repeat**

Most harness bugs are a missing or weak *verify* stage. Most cost blowups are a
badly designed *gather* stage.

## Gather context

- **Agentic search** — let the agent use `grep`, `find`, `tail`, `head` over the
  real filesystem. Transparent, debuggable, no index to maintain, no staleness.
  Recommended as the default.
- **Semantic search** — faster, but opaque and stale-prone. Reach for it only
  after agentic search demonstrably isn't enough.
- **Subagents** — parallelism plus context isolation: the subagent burns its own
  window on the search and returns only the answer.
- **Compaction** — automatic summarization of earlier turns to survive long
  sessions.

The recommendation to prefer agentic search over embeddings is a real position,
and it's the same claim as the SRE-agent result cited in 03: generic tools over
a well-shaped filesystem beat purpose-built retrieval more often than expected.

## Take action

- **Tools** — the primary execution primitive; design per resource 04.
- **Bash & scripts** — general-purpose computer access. The escape hatch that
  makes the harness open-ended rather than a fixed menu.
- **Code generation** — for complex or repeated operations. Code is
  "infinitely reusable" in a way a tool call is not; this is the bridge to 03.
- **MCP servers** — standardized third-party integration with auth handled.

## Verify work

Three mechanisms, in descending order of trustworthiness:

1. **Rules-based feedback** — types, linters, tests, schema validation.
   Deterministic and cheap. Layer several.
2. **Visual feedback** — screenshots and renders for anything with a UI. The
   agent can see what it built.
3. **LLM-as-judge** — a second model grades the output. Least robust, but
   sometimes the only option for prose or design quality.

The verification layer is where an agent stops being a demo. An agent that
cannot check its own work will confidently report success.

## Wording notes

- The design question the post ends on is the right diagnostic for any failure:
  **"Does it have the right tools to succeed?"** Before adding prompt text,
  check whether the agent was simply unable to see or verify what it needed.
- Prompt text that describes *how to verify* ("after editing, run `npm test` and
  fix failures before reporting done") is consistently higher-value per token
  than text describing how to build.

## Where it lands

→ [Lesson 02 — hooks](../workshop/lessons/02-hooks/README.md), [Lesson 07](../workshop/lessons/07-meta-eval/README.md) (verification arms)

## Related

The skeleton that 01, 02, 04 and 09 all hang off.
