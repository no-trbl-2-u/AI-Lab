# AI Lab

A collection of resources focused around AI, and a collection of attempts to
test and try their implementation.

**Harness**, here, means the full AI workspace — agents and subagents, memory,
skills, scoped reference pools, permissions, and the enforcement layer that
holds them together. Not the coding-agent product.

**Out of scope:** building or training models. Everything here sits above the
model.

## Layout

```
PIPELINE.md  How material enters this repo and becomes work.
resources/   Notes on harness design. Prior art + synthesis.
workshop/    Project 1 — build-a-harness-workshop. Ten lessons.
projects/    Work that comes after the harness exists.
.claude/     This repo's own harness — the thing the workshop builds.
```

Nothing enters `resources/` without passing `/intake`; nothing becomes a project
without `/decompose-resource`. See [PIPELINE.md](PIPELINE.md) — the governing
rule is that **the deliverable is your understanding, not the artifact.**

## The plan

| | Project | What it proves |
|---|---|---|
| 1 | [Build this repo's harness](workshop/README.md) — lessons 00–08 | the layers work here |
| 2 | [Extract the bundle](workshop/lessons/09-generalize/README.md) — lesson 09 | the patterns survive past n=1 |
| 3 | Drop it on a third repo | it works where it wasn't designed |
| 4 | [Long-horizon runner](projects/README.md) | the real target, with parts that exist |

The workshop is the container, not a separate build: lessons 00–08 grow
`.claude/` one enforcement layer at a time, and lesson 09 extracts what
survived. Generalization is earned, not designed up front.

## Two laws

**Promotion after evidence.** `lesson → dist/ → droppable harness`. A pattern
that has appeared once is an anecdote.

**Every lesson ships something that fails loudly.** A lesson whose only artifact
is a document does not ship — that confusion is what the workshop exists to fix.

## Start here

- New to the framing → [resources 11](resources/11-enforcement-boundary.md),
  then [12](resources/12-long-horizon-control.md)
- Ready to build → [Lesson 00 — the enforcement map](workshop/lessons/00-enforcement-map/README.md)
- Want the cheap win first → [Lesson 07 §3](workshop/lessons/07-meta-eval/README.md),
  the prefix-volatility audit. One hour, permanent cost multiplier.

## Working notes

- `board-brainstorm` is the comparison case throughout — a working harness built
  by accretion. The workshop's job is to turn that instinct into a process.
- Every lesson gets a `runs/` folder. Record negative results; they're the ones
  worth having.
- Nothing in `workshop/dist/` until lesson 09. It's empty by design.
