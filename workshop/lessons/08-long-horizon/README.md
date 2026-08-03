# Lesson 08 — Long-horizon control

**Layer built:** tick loop + contract + blocking `Stop` hook
**Depends on:** 03 (guards) and 07 (baseline). Do not attempt before both.

## Concept

The foundation for a **long-horizon runner** — a harness for work that outlives
a single context window. This lesson builds the parts;
[projects/](../../../projects/README.md) assembles them.

Long-running agent work fails in three distinct ways, and they need three
different mechanisms. Conflating them is what "trying to handle too much at
once" looks like from the inside:

| Failure | Looks like | Mechanism |
|---|---|---|
| **Scope creep** | doing more than asked, plausibly | contract written *before* the tick |
| **Premature exit** | "done" with work remaining | `Stop` hook blocking on the contract |
| **Quality drift** | still on task, doing it worse | baseline eval (lesson 07) |

The documented failure mode (resource 12) is trying to solve all three with one
LLM auditor. Each is tractable alone; none is tractable by asking the drifting
process to grade itself.

### Contracts

A contract is **done-conditions as checkable predicates, written before work
starts, by a different pass than the one doing the work.**

Not: "implement the card renderer properly."
But:

```yaml
tick: 14
must:
  - guard: node guards/all.mjs
  - file_exists: render/cards.mjs
  - test: npm test -- render
must_not:
  - files_changed_outside: [render/, test/render/]
  - new_dependencies: true
```

`must_not` is the scope-creep guard, and it's the half that's usually missing.
Scope creep
is not detectable by asking "did you stay in scope?" — it's detectable by
`git diff --name-only` against a declared allowlist. That's a two-line check
that cannot drift.

The pattern is your own `--rec` manifest: a **pure delta against a fixed base**,
with staleness detected mechanically by `applyRecs()`. Same shape, applied to
work instead of to game rules.

### Why "self-audit between ticks" was unenforceable

You cannot ask a process to audit itself from inside its own prompt. The request
goes to the faculty that is already off-track, and compliance is exactly the
thing in question.

Enforcement has to come from **outside the loop**:

```
tick N runs
  ↓
Stop hook fires — model has no say in this
  ↓
node guards/contract.mjs --tick N
  ↓
pass → tick N+1 may start
fail → block, inject the specific unmet predicate, agent continues
```

The agent never decides whether it's done. The harness does. That inversion is
the entire fix.

## Prior art

- `resources/12-long-horizon-control.md` — Ralph loops, sprint contracts,
  context anxiety
- `resources/10-twelve-factor-agents.md` — factors 6, 8, 9, 12: own the loop,
  cap retries, make it resumable
- board-brainstorm: the `--rec` manifest (pure delta + mechanical staleness),
  the append-only results archive (state that survives a reset), and
  `NEEDS_HUMAN_ATTENTION.md` (escalation as an artifact rather than a message)

## Build

### 1. Contract format and checker

`guards/contract.mjs` reading the YAML above. Predicates: `guard`, `file_exists`,
`test`, `files_changed_outside`, `new_dependencies`. Each is a few lines. Exit
non-zero naming the specific unmet predicate.

### 2. The tick loop

Run it on something real and boring — a multi-tick task over this repo, e.g.
"write the missing `runs/` templates for all ten lessons." Enough ticks to drift,
low enough stakes to watch it fail.

Per tick: contract written → work → `Stop` hook checks → pass advances, fail
re-injects.

### 3. Escalation, capped

Factor 9. After N consecutive contract failures on the same predicate, stop
retrying and write a `NEEDS_HUMAN_ATTENTION.md` entry. You already use exactly
this artifact — the addition is that a machine writes it when a cap is hit,
rather than a session ending with an apology.

### 4. Fresh-context restart

When a tick fails on context exhaustion rather than a real predicate miss,
restart it in a clean window with the contract plus filesystem state, not the
transcript. `/next` already proves this works: it rebuilds the picture from
repo residue and explicitly *never from memory*. Same mechanism, tick-scoped.

## Failing check

```bash
node guards/contract.mjs --tick 1 --fixture test/fixtures/scope-creep/
```

A fixture where the agent touched a file outside the allowlist. Must exit
non-zero and name the file.

## The honest scoping warning

The case study in resource 12 failed on scope before it failed on anything
else. Do not build all four steps before running one.

**Build step 1 and step 2 only. Run five ticks. Read what happened.** Steps 3
and 4 are additions you make once you've seen a real failure, not features you
design in advance — which is the same ratchet discipline your `CLAUDE.md`
already runs on, where every Windows rule is dated to the day it cost you
something.

## Extraction note

The contract *schema* and `contract.mjs` are the highest-value `dist/`
candidates in the workshop — nothing published does this concretely. Evidence
needed before promotion: it must survive a task whose scope legitimately
*should* expand mid-tick. If the contract makes correct scope changes painful,
it's wrong, and that failure mode won't appear in a toy run.
