# Lesson 00 — The enforcement map

**Layer built:** none. This lesson classifies before it constructs.
**Prerequisite for:** everything.

## Concept

Every rule governing an agent sits in exactly one of three tiers:

| Tier | Mechanism | Holds when… | Fails when… |
|---|---|---|---|
| **Deterministic** | code that exits non-zero | always, if it runs | nobody runs it |
| **Harness** | hook, permission, tool allowlist | always, automatically | the event never fires |
| **Prose** | a line in `CLAUDE.md` | the model chooses to comply | context fills, or attention drifts |

Prose is not enforcement. It is a *request with good odds*. Those odds decay
with context fill — which is why a rule that held for the first hour of a
session stops holding in the fourth.

The failure this lesson prevents: believing a rule is enforced because you
wrote it down clearly.

## Prior art

- `resources/11-enforcement-boundary.md` — the tier model in full
- **board-brainstorm already does tier 1 well and tier 3 heavily.**
  `pipeline-freshness.mjs` and the `applyRecs()` drift guard are deterministic
  and they hold. But `CLAUDE.md`'s "never run `--rec` blind — show the manifest
  and ask WHICH", "never rule silently", and "commit messages: no emojis, no
  trailers" are all prose. They mostly work. *Mostly* is the whole point.
- The `tools:` frontmatter on `mechanics-expert` and `rules-reader` is tier 2 —
  the one place that repo uses harness-level enforcement, and it's airtight.

## Build

### 1. Classify board-brainstorm

It's the richer corpus and you know it cold. Go through `CLAUDE.md` line by
line, plus each `SKILL.md`'s procedure section, and produce
`workshop/lessons/00-enforcement-map/board-brainstorm.md`:

```markdown
| Rule | Tier | Mechanism | Would I notice if it broke? |
|---|---|---|---|
| publish refuses on stale manifest | deterministic | pipeline-freshness.mjs | yes, loudly |
| always push the assets repo after publish | prose | CLAUDE.md | NO — silent 404 later |
| mechanics-expert returns no code | harness | tools: frontmatter (no Edit/Write) | yes, immediately |
| never re-litigate owner rulings | prose | CLAUDE.md | no |
```

The fourth column is the one that matters. **A prose rule whose violation is
silent is a bug waiting to be filed.** `CLAUDE.md` already tells you where one
of these lives: *"the step with no gate is pushing the assets repo — a hash
nobody pushed is a 404."* That's a known silent-failure prose rule, documented
as such, still prose.

### 2. Classify this repo

Same table for ai-lab. It's nearly empty — that's fine, it's the baseline you'll
watch fill over lessons 01–08.

### 3. Write the audit skill

`.claude/skills/harness-audit/SKILL.md`. It reads a repo's `CLAUDE.md`,
`.claude/`, and `settings.json`, and emits the classification table plus a
**ranked list of prose rules with silent failure modes.**

Description wording — you already know the trigger-list convention, so use it:

```yaml
description: >
  Classify every agent-governing rule in this repo as deterministic, harness,
  or prose enforcement, and rank the prose rules whose violation would be
  silent. Use when the user says "harness audit", "what's actually enforced",
  "enforcement map", before adding rules to CLAUDE.md, or after an agent
  violated a rule that was already written down.
```

## Failing check

```bash
node guards/unenforced.mjs
```

Exits non-zero when a rule tagged `<!-- enforce:deterministic -->` in
`CLAUDE.md` has no corresponding entry in `guards/`. Tiny — 30 lines — and it's
the first thing in this repo that can fail. Build it here, extend it in lesson 03.

## What you'll probably find

Prediction, recorded before you run it so it can be wrong: **the majority of
board-brainstorm's rules are prose, and 3–6 of them have silent failure modes.**
The loud ones you already converted to gates, because loud failures nagged you
until you did. Silent ones don't nag. That asymmetry is why the map is worth
drawing rather than reasoning about.

## Extraction note

`harness-audit` is the strongest `dist/` candidate in the whole workshop — it's
useful on any repo on day one and needs no repo-specific knowledge. **Still hold
it** until lesson 09, per the promotion law. Evidence needed: it must find
something real in a third repo, not just in the two it was designed against.
