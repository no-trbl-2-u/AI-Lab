# Lesson 04 — Scoped reference pools

**Layer built:** authority chain + non-authority declarations
**Type:** extraction — you already built this; this lesson makes it portable.

## Concept

An agent that can read everything treats everything as equally true. A reference
pool is scoped when three things are explicit: **what ranks above what**, **what
ranks nothing**, and **how something moves up.**

## Prior art, side by side

| | Published | board-brainstorm |
|---|---|---|
| Curate context | resource 01: "just-in-time retrieval", "minimal viable" | ✔ and beyond |
| Rank sources | — mostly absent | **authority chain, 4 tiers, explicit precedence** |
| Declare non-authority | — absent | `braindump/` and `playtests/` rank NOTHING |
| Promotion path | — absent | `braindump → --rec → canon`, with `## Dispositions` |
| Retrieval-time defense | — absent | **status banner on every file, so a grep hit carries its own disclaimer** |

The literature has "give the agent good context." You have a constitution. The
status-banner idea is the one I'd single out: it defends against the case where
an agent *greps into* a speculative file mid-session and never sees the folder's
README. Nobody writes that down.

Where published work has something you don't: resource 03's finding that
**generic tools over a well-shaped filesystem beat specialized retrieval** (the
SRE agent going 45% → 75% on `read_file`/`grep`/`find`). Your `kb-query` MCP
server is specialized — and `CLAUDE.md` already hedges correctly by calling it
"an accelerator, not a dependency." Worth measuring in lesson 07 whether the MCP
path actually beats grepping the corpus.

## Build

1. **Give ai-lab an authority chain.** Small but real: `resources/` notes are
   evidence, `workshop/spec/` is canon, `runs/` are measurements, lesson prose
   is speculative until its failing check exists.
2. **Status banners** on anything speculative, borrowed directly.
3. **A guard that enforces the chain** — this is the part that doesn't exist in
   board-brainstorm. `guards/authority.mjs`: any document citing a
   non-authority source as a rule fails. Currently that rule is prose
   (*"citing a braindump as a ruling is an error"*) and its violation is
   silent.

## Failing check

```bash
node guards/authority.mjs
```

Non-zero when a canon document cites a speculative one, or when a speculative
file lacks its banner.

## Extraction note

The **chain + non-authority + promotion ladder** triple is a strong `dist/`
candidate as a template. `guards/authority.mjs` needs the chain to be
machine-readable, so it belongs in `workshop/spec/harness.yaml` — which makes
this lesson a dependency of lesson 03's `spec-drift.mjs`.
