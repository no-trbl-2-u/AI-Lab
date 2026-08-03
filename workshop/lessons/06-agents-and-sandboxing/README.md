# Lesson 06 — Agents & epistemic sandboxing

**Layer built:** `.claude/agents/` + a harness auditor
**Type:** extraction — `rules-reader` is your invention. This generalizes it.

## Concept

Subagents are usually framed as parallelism or context isolation. There's a
third use nobody writes about: **restricting what an agent knows, so that its
confusion becomes a measurement.**

`rules-reader` has a FORBIDDEN list. It audits printed card text by being
deliberately ignorant of the engine — its failed predictions *are* the wording
bugs. The general form:

> To test whether an artifact is self-sufficient, give an agent only that
> artifact and count what it cannot derive.

That works for card text, API docs, onboarding READMEs, error messages, and —
the target here — a harness.

## Prior art, side by side

| | Published | board-brainstorm |
|---|---|---|
| Subagents for context isolation | resources 01, 06, 07 | ✔ |
| Orchestrator-worker | resource 07 | ✔ (`/rules-audit` fans out 8) |
| Structured output contracts | resource 07 (mentioned) | ✔ (both agents, exact schemas) |
| Tool-scoped agents | — thin | ✔ explicit `tools:` frontmatter |
| **Epistemic sandboxing** | — **absent** | ✔ FORBIDDEN sources list |
| **Confusion as metric** | — absent | ✔ predict → act → diff, count divergences |

Also worth noting what `rules-reader` gets right that resource 07 warns about:
its prompt specifies objective, output format, tool guidance, *and* an explicit
non-goal ("not findings: strategy mistakes, balance opinions"). Vague delegation
is the documented failure mode of multi-agent systems; yours isn't vague.

## Build

### 1. A harness auditor for ai-lab

`.claude/agents/fresh-contributor.md`. Allowed: `README.md`, `workshop/README.md`,
lesson **Concept** sections. Forbidden: `guards/`, `.claude/`, `runs/`.

Task: predict what this repo's harness enforces, then code compares predictions
against `workshop/spec/harness.yaml`. Divergences are documentation gaps —
places where the harness does something no reader could have known.

### 2. Point it at board-brainstorm

The higher-value run. Allowed: `README.md` + `CLAUDE.md`. Forbidden: everything
else. Predict: what happens if I edit a card? What am I not allowed to do?

Every divergence is either an undocumented rule or a rule documented where
nobody reads it. Prediction: **the asset-push chain generates findings**, since
`CLAUDE.md` describes it in one place and `NEEDS_HUMAN_ATTENTION.md` shows it
has been missed repeatedly anyway.

### 3. Make the output contract structural

Both your agents declare a report format in prose and it holds because the model
cooperates. Lesson 02's `SubagentStop` hook makes it enforced. Do it here.

## Failing check

```bash
node guards/agent-contract.mjs < runs/latest-audit.json
```

Non-zero when an agent's output doesn't parse against its declared schema.

## Extraction note

**Epistemic sandboxing is the pattern I'd write up as originally yours** — it
isn't in the literature and it generalizes well beyond games. `dist/` gets the
*template* (allowed/forbidden lists, predict-act-diff loop, findings schema).
The `fresh-contributor` agent itself is nearly repo-agnostic and may promote
early.
