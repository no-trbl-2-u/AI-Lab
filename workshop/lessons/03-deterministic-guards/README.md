# Lesson 03 — Deterministic guards

**Layer built:** `guards/`
**Depends on:** lesson 02 (hooks are the trigger; guards are the judgment)

## Concept

This is the drift-guard fix from resource 12, in miniature.

A guard answers one question with a boolean, using code. Not a model. The
division of labour:

```
hook      = WHEN the check runs      (harness event)
guard     = WHETHER it passed        (deterministic code)
model     = evidence, never verdict  (optional, and only as input)
```

**A guard implemented as an LLM judgment drifts with the thing it is judging.**
That is not a prompt-tuning problem, it is structural: a judge with no fixed
rubric has nothing to be stable against. The case-study runner's guard drifted because it
was asked to decide "did this tick stay in scope?" with the same faculty that
had wandered out of scope.

### When you genuinely need judgment

Sometimes the property is unquantifiable — "is this card's wording clear?" is
not a boolean. The move is not to give up and let a model judge; it's the one
`rules-reader` already makes:

> **Make the model predict, then let code count divergences.**

The model produces *evidence* (a prediction, an observation). Code produces the
*verdict* (does prediction match observation, and how often). The count is
stable even though each individual prediction isn't. That's how board-brainstorm
quantized wording clarity, and it's the general technique for guarding anything
soft.

## Prior art

- `resources/12-long-horizon-control.md` — the full post-mortem framing
- **board-brainstorm is the reference implementation.** Every guard that works
  there is code: `applyRecs()` fatals on a renamed card; `pipeline-freshness.mjs`
  compares mtimes; `--drift` reports "288 cells within 0pp" from a seeded rerun;
  the mobile parity test asserts. Zero of them ask a model whether things look
  right.
- The `rules-reader` predict-then-count technique is the escape hatch for soft
  properties, and it is yours.

## Build

### 1. Three guards for this repo

Start mechanical. `guards/` is plain `.mjs`, no deps, exit codes only.

- **`links.mjs`** — every markdown link resolves; every `resources/` note has a
  lesson backlink and vice versa. Catches the single most common rot in a notes
  repo.
- **`frontmatter.mjs`** — every `SKILL.md` has `name` + `description`; every
  description contains an explicit trigger phrase (`Use when`). Encodes the
  wording convention you already follow, so it can't silently lapse.
- **`unenforced.mjs`** — from lesson 00, extended: any `CLAUDE.md` line tagged
  `<!-- enforce:deterministic -->` must have a matching guard.

Wire all three to `Stop` and to a single `node guards/all.mjs`.

### 2. A soft guard, done properly

Pick something genuinely unquantifiable about this repo — *"does each lesson's
failing check actually fail?"* Nobody can eyeball that.

Predict-then-count, `rules-reader`-style:

1. An agent reads a lesson's **Failing check** section only — not `guards/`.
2. It predicts: what input should make this exit non-zero?
3. Code runs that input against the real guard.
4. **Divergence count is the metric.** Prediction says fail, guard says pass →
   finding.

The agent never renders a verdict. Code does. Run it twice on the same lesson
and the counts should match — if they don't, your evidence step is
underdetermined and needs a tighter prompt, which is itself the finding.

### 3. The drift guard, correctly built

Now the general form the case study needed:

```
spec (written, versioned, machine-readable)
  ↓
guard compares repo state to spec
  ↓
exit non-zero + name the specific divergence
```

For ai-lab: `workshop/spec/harness.yaml` declares what layers exist, which
lessons built them, and each layer's failing check.
`guards/spec-drift.mjs` verifies reality matches. The guard cannot drift
because **the guard is a comparison, not an opinion.**

The spec is the piece the case study was missing. There was nothing fixed to compare
against, so "drift" had no referent — and an auditor with no referent invents
one, freshly, every time.

## Failing check

```bash
node guards/all.mjs
```

And the meta-check: deliberately break each guard's precondition and confirm a
non-zero exit. Record in `runs/`. An unverified guard is decoration.

## Design rules

1. **Guards exit non-zero. They do not warn.** A warning is prose with extra
   steps.
2. **Name the specific divergence**, not the category. `resources/07 links to
   lab/07-orchestrator-worker/README.md (deleted)` beats `broken link found`.
3. **Fast.** Anything on `PostToolUse` runs hundreds of times a session.
4. **No network, no model, no clock** where avoidable — a guard that isn't
   deterministic isn't a guard.
5. **Satisfiable.** A guard the agent can't act on causes a stall loop
   (lesson 02).

## Extraction note

`links.mjs` and `frontmatter.mjs` are near-universal — strong `dist/`
candidates. `spec-drift.mjs` is the valuable one and the one that needs the most
evidence: it only proves out if a spec written for one repo survives being
written for a second. That's lesson 09's job.
