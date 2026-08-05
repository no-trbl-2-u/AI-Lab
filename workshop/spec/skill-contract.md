# The skill-unit contract

What makes a candidate skill modular and testable, stated mechanically enough
that `guards/skill-contract.mjs` can check it without judgment.

Built for [lab/modular-skill-composition](../../lab/modular-skill-composition/PRD.md),
phase 1.

## Required of every skill spec

1. **YAML frontmatter with `name` and `description`.** Claude Code's own
   requirement — `description` is the only thing deciding whether the skill
   fires, per [resource 05](../../resources/05-agent-skills-progressive-disclosure.md).
2. **`## Responsibility`** — one sentence. If it needs "and" to join two
   things, it's two skills, not one.
3. **`## Inputs`** — what the skill needs, named explicitly. Not "context" —
   the actual fields or files.
4. **`## Outputs`** — what it produces, named explicitly.
5. **`## Composes with`** — the other skills it invokes, is invoked by, or
   `none`. This is the field the contract exists for: composition has to be
   declared, not left to whatever context happens to be loaded.
6. **`## Failing check`** — a command that exits non-zero when the skill
   hasn't done its job. A spec with no failing check is a reading task, not a
   build unit — mark `type: reading` in the frontmatter instead of filling
   this section with a placeholder.

## The stopping rule

Borrowed from [PIPELINE.md](../../PIPELINE.md)'s phase rule, applied to
skills instead of phases:

> A candidate skill is atomic when it has exactly one failing check and one
> responsibility sentence with no "and". If you can't name its failing check,
> it isn't a skill yet — it's a topic, and it goes back to the decomposition.

## What this contract does not check

It cannot tell you whether the `description` will actually trigger correctly,
or whether the `Failing check` command is the *right* check — only that one
was named. Trigger accuracy and check quality are judgment calls for
[lesson 07](../lessons/07-meta-eval/README.md), not this guard.
