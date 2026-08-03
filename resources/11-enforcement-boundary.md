# 11 — The enforcement boundary

**Type:** synthesis. No single source — assembled from Claude Code's hook and
permission surfaces, resource 02's hook-based enforcement, resource 10's
factor 8, and one failed long-horizon runner (resource 12).

## Why it matters

The most expensive confusion in workspace design is believing a rule is enforced
because you wrote it down clearly. Prose is not enforcement; it is a request
with good odds, and the odds decay as context fills.

## The three tiers

| Tier | Mechanism | Holds when | Fails when | Cost |
|---|---|---|---|---|
| **Deterministic** | code exiting non-zero | always, if invoked | nothing invokes it | build once |
| **Harness** | hook, permission, tool allowlist | automatically, on an event | the event never fires | config |
| **Prose** | `CLAUDE.md`, `SKILL.md` body | the model complies | attention drifts | tokens, every turn |

Each tier can hold what the tier below it cannot. Each costs more to build. The
correct move is *not* to push everything up — prose is right for judgment calls,
and a deterministic guard for something unquantifiable is worse than nothing
because it will be wrong confidently.

## The diagnostic question

For every rule you've written:

> **If this were violated, would I find out?**

Loud violations self-correct — they nag you until you build a gate. Silent ones
never nag, so they stay prose forever, and they're the ones that cost you.
Ranking by *silence* rather than by importance is the trick.

## What each tier can't do

- **Permissions** can't express conditions. "Don't edit rulings.md *without
  asking*" isn't a permission — but "don't edit rulings.md" is, and the asking
  follows structurally.
- **Hooks** fire on harness events, not model intentions. You can intercept "a
  skill was invoked." You cannot intercept "a skill should have been invoked and
  wasn't." That negative space needs an eval (resource 13's technique).
- **Deterministic guards** can't judge unquantifiable properties — but see
  below, because the escape hatch is better than it sounds.
- **Prose** can't hold across a long session. This is the one people
  systematically overestimate.

## The escape hatch for soft properties

When the property genuinely isn't a boolean — "is this wording clear?", "did
this stay in scope?" — the move is not to hand the judgment to a model. It's:

> **The model produces evidence; code produces the verdict.**

An agent predicts, acts, and reports divergences. Code counts them. Each
prediction is noisy; the count is stable. This is what makes an unquantifiable
property measurable without introducing a judge that drifts.

## Wording notes

- Tag rules in `CLAUDE.md` with their intended tier as an HTML comment, so a
  guard can check that deterministic-tagged rules actually have guards.
- A prose rule is worth writing when it's a judgment call, when a guard would be
  wrong more often than the model, or as an interim step while you build the
  guard. It is not worth writing as a substitute for a guard you could build.
- **Rules-per-tier is a health metric.** A workspace with fifty prose rules and
  two guards is one that has been documenting its failures rather than fixing
  them.

## Where it lands

→ Lessons [00](../workshop/lessons/00-enforcement-map/README.md),
[01](../workshop/lessons/01-permissions/README.md),
[02](../workshop/lessons/02-hooks/README.md),
[03](../workshop/lessons/03-deterministic-guards/README.md).
