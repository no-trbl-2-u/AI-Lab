# 12 — Long-horizon control

**Type:** synthesis + post-mortem. Draws on resource 02 (Ralph loops, sprint
contracts), resource 10 (factors 6/8/9/12), resource 09 (recitation), and one
failed long-horizon runner (unpublished, case study below).

## Why it matters

Everything works for twenty minutes. The failures that matter appear at hour
three, and they are not prompt problems.

## Three failures, three mechanisms

Conflating these is the classic mistake — it's what "trying to handle too much
at once" looks like from the inside.

| Failure | Presentation | Mechanism | Why the others don't work |
|---|---|---|---|
| **Scope creep** | doing more than asked, plausibly | contract written before the tick | can't be prompted away; the drift is invisible to the drifter |
| **Premature exit** | "done" with work remaining | `Stop` hook blocking on the contract | the agent's own judgment is the thing in question |
| **Quality drift** | on task, doing it worse | baseline eval | invisible without a fixed comparison |

## Case study: one failed runner

A tick-based harness for long-running work, intended to prevent scope creep and
quantify implementation quality. It failed for three compounding reasons, and
all three are instructive — they're also the three most common ways this class
of system dies, so treat them as a design checklist rather than one team's bad
luck.

### 1. The drift guard drifted itself

The guard was an LLM asked "did this tick stay in scope?" A judge with no fixed
rubric has nothing to be stable against, so it drifted with its subject. **Not a
prompt-tuning problem — structural.**

The contrast that makes it obvious: in a well-built domain harness, every guard
that works is code. A manifest diff. An mtime comparison. A seeded rerun
reporting "288 cells within 0pp." A parity assertion. None of them ask a model
whether things look right.

### 2. Self-auditing was requested, not enforced

"Check yourself between ticks" is a request to the faculty that is already
off-track. Compliance is precisely what's in question.

Enforcement has to come from outside the loop:

```
tick N runs
  ↓
Stop hook — model has no say
  ↓
contract check (code)
  ↓
pass → N+1        fail → block, inject the unmet predicate
```

The agent never decides whether it's done.

### 3. Too much at once

All three failure types, one mechanism, no baseline. Fix one, run it, then add.

## Contracts

Done-conditions as checkable predicates, written **before** work starts, by a
different pass than the one doing the work.

```yaml
must:
  - guard: node guards/all.mjs
  - test: npm test -- render
must_not:
  - files_changed_outside: [render/, test/render/]
  - new_dependencies: true
```

`must_not` is the scope-creep guard, and it's the half that's usually missing.
Scope creep isn't detectable by asking "did you stay in scope?" It's detectable
by `git diff --name-only` against an allowlist — two lines that cannot drift.

**Prior art worth stealing:** a proposal system where changes are a *pure delta*
against a fixed base and staleness is detected mechanically. Same shape, applied
to work instead of to rules.

## Context anxiety and fresh restarts

Agents quit early because the window is filling, not because the work is done.
The Ralph loop answer: intercept the exit, restart in a clean window with the
contract plus **filesystem state, not transcript**.

This only works if state is reconstructible from disk. A session-orientation
routine that rebuilds the picture by reading repo residue — and explicitly never
from memory — is the same mechanism at session scope.

## Wording notes

- Contracts are written, not prompted. A done-condition in prose is a
  suggestion; in YAML with a checker it's a gate.
- The `must_not` list is where the value is. Everyone writes `must`.
- Escalation is an artifact, not a message: cap consecutive failures, then write
  a `NEEDS_HUMAN_ATTENTION`-style entry. A capped loop that files a blocker
  beats an uncapped one that apologizes.

## Related

Lesson [08](../workshop/lessons/08-long-horizon/README.md);
[projects/ — long-horizon runner](../projects/README.md).
