# Resources

Notes on **harness design** — where "harness" means the full AI workspace:
agents and subagents, memory, skills, scoped reference pools, permissions, and
the enforcement layer that holds them together. Not the coding-agent product.

Each note carries: source, why it matters, core patterns, memorable numbers,
**wording notes** (what it should change in `SKILL.md` / `CLAUDE.md` /
`AGENTS.md`), tensions with the other notes, and where it lands in the workshop.

**This is a gated pool.** Nothing enters without passing `/intake`
([PIPELINE.md](../PIPELINE.md)); what didn't make it is recorded in
[REJECTED.md](REJECTED.md), and what you knew before reading each one is in
[deltas/](deltas/README.md). Promotion is the only path in — which is what keeps
the pool from filling with material nobody chose.

## Core — read these

The four that map to actual gaps. 11 and 12 are the ones to read first.

| # | Resource | Theme |
|---|---|---|
| 11 | [The enforcement boundary](11-enforcement-boundary.md) | prose vs. harness vs. code — what each tier can hold |
| 12 | [Long-horizon control](12-long-horizon-control.md) | contracts, tick loops, why LLM drift-guards drift |
| 01 | [Effective context engineering](01-effective-context-engineering.md) | context rot, altitude, JIT retrieval |
| 02 | [Agent harness engineering](02-agent-harness-engineering.md) | the ratchet, hooks, Ralph loops, sprint contracts |
| 06 | [Claude Agent SDK loop](06-claude-agent-sdk-loop.md) | gather → act → verify |
| 09 | [Lessons from Manus](09-manus-context-engineering.md) | KV-cache, recitation, keep errors in |
| 10 | [12-Factor Agents](10-twelve-factor-agents.md) | own your loop, cap retries, stateless reducer |
| 15 | [Springdrift: an auditable persistent runtime](15-springdrift-persistent-runtime.md) | the runtime as the unit of design — replay, self-state, outcome-weighted memory `anecdotal` |

## Extraction — prior art alongside your own patterns

Ground you already cover in `board-brainstorm` or at work. Written as
side-by-side comparisons so the gaps show in both directions.

| # | Resource | Your counterpart |
|---|---|---|
| 13 | [Epistemic sandboxing](13-epistemic-sandboxing.md) | `rules-reader` — **original pattern, unpublished** |
| 14 | [Memory architecture](14-memory-architecture.md) | the work system; 8 of 10 rows have no published counterpart |

## Reference — read once, don't build on

Sound, but they cover ground you already have or aren't currently working in.

| # | Resource | Why demoted |
|---|---|---|
| 03 | [Code execution with MCP](03-code-execution-with-mcp.md) | queued as a project, not a lesson |
| 04 | [Writing tools for agents](04-writing-tools-for-agents.md) | you consume MCP more than you author it |
| 05 | [Agent Skills](05-agent-skills-progressive-disclosure.md) | you already write trigger-shaped descriptions |
| 07 | [Multi-agent research system](07-multi-agent-research-system.md) | orchestration already works in `/rules-audit` |
| 08 | [Don't build multi-agents](08-dont-build-multi-agents.md) | ditto — keep for the two principles |

## The through-line

Two claims recur across every source here.

**Context is a finite, degrading resource, and the harness's job is to protect
it.** Filesystem offloading, progressive disclosure, subagents, compaction,
code execution over tool calls, recitation — different tactics, one strategy.

**Most agent failures are harness defects, not model limitations.** Which is
good news: harness defects are fixable.

And one claim the published literature does *not* make, which this collection
adds because it's where the expensive failures live:

**A rule you wrote down is not a rule you enforced.** See [11](11-enforcement-boundary.md).

## Provenance

01–10 are summaries of external sources, read August 2026 — re-check numbers
before relying on them. 11–14 are synthesis: no single source, assembled from
the above plus two working systems and one failed one.
