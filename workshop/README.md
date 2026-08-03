# build-a-harness-workshop

**The first project.** A ten-lesson build in which this repo grows its own
harness, one enforcement layer at a time — and then, only at the end, extracts
what proved reusable into a bundle you can drop into any repo.

## The premise

A workshop that teaches harness design has to *be* a good harness. So the
curriculum and the build order are the same thing: each lesson adds one layer to
`ai-lab/.claude/`, and the layer is the lesson.

The first repo the workshop builds a harness for is this one. The second
already exists — `board-brainstorm` — and serves as the comparison case
throughout. Generalization waits for lesson 9.

## Two laws

**1. Promotion after evidence.**

```
lesson (concrete, in this repo) → workshop/dist (proposal) → droppable harness (canon)
```

Borrowed from board-brainstorm's `braindump → --rec → canon` ladder, for the
same reason: a pattern that has appeared once is an anecdote. Nothing enters
`dist/` until it has worked here *and* has a counterpart in a second repo.

**2. Every lesson ships something that fails loudly.**

A lesson whose only artifact is a document does not ship. Prose is not
enforcement — that confusion is the thing this workshop exists to fix. Each
lesson names its **failing check**: the command that exits non-zero when the
layer is violated.

## Lessons

| # | Lesson | Layer built | Failing check |
|---|---|---|---|
| [00](lessons/00-enforcement-map/README.md) | Enforcement map | *(none — classification)* | `harness-audit` reports unenforced rules |
| [01](lessons/01-permissions/README.md) | Permissions & trust boundary | `settings.json` | denied command is refused |
| [02](lessons/02-hooks/README.md) | Hooks | `.claude/hooks/` | bad edit blocked on write |
| [03](lessons/03-deterministic-guards/README.md) | Deterministic guards | `guards/` | broken link / stale note fails CI |
| [04](lessons/04-reference-pools/README.md) | Scoped reference pools | authority chain | citation of a non-authority fails |
| [05](lessons/05-memory/README.md) | Memory architecture | `memory/` | orphaned or stale memory fails |
| [06](lessons/06-agents-and-sandboxing/README.md) | Agents & epistemic sandboxing | `.claude/agents/` | auditor finds undocumented behaviour |
| [07](lessons/07-meta-eval/README.md) | Meta-eval | `evals/` | harness change regresses the baseline |
| [08](lessons/08-long-horizon/README.md) | Long-horizon control | tick loop + `Stop` hook | tick completes without meeting contract |
| [09](lessons/09-generalize/README.md) | Generalize | `workshop/dist/` | bundle fails on a third repo |

Lessons **00–03** and **08** are the gap-closing ones and are written in full
detail. **04–06** are *extraction* lessons — they pull patterns you already
built in board-brainstorm into reusable form, so they're shorter and framed as
prior-art-alongside-yours. **07** and **09** are the payoff.

## Lesson format

Each lesson has:

- **Concept** — what the layer is and what it can/can't hold
- **Prior art** — the matching `resources/` note, plus what board-brainstorm
  already does here
- **Build** — concrete steps against this repo
- **Failing check** — the command that must exit non-zero when violated
- **Extraction note** — what, if anything, is a `dist/` candidate and what
  evidence it still needs

## Running order

Sequential. 01 depends on 00's classification; 03 depends on 02's trigger
layer; 08 depends on 03 and 07 both existing. 04–06 can be reordered freely.

## State

Nothing built yet. `dist/` is empty by design until lesson 9.
