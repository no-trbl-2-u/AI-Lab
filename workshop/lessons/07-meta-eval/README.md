# Lesson 07 — Meta-eval

**Layer built:** `evals/`
**Depends on:** 03 and 06. Required by 08.

## Concept

You have measurement discipline — 300 games/cell, seeded, baselines rerun from
the same code, determinism checks before a headline. It has never been pointed
at the workspace.

The obstacle was real: *"hard to quantize success/failure."* Lesson 03's answer
applies here too — **the model produces evidence, code produces the verdict** —
plus one thing sim work gives you free that harness work doesn't: a **fixed
input set**. Without it, every run measures a different thing and variance eats
the signal.

The property hooks can't reach (lesson 02): *a skill should have fired and
didn't.* That negative space is unreachable from the enforcement layer entirely.
It's only measurable with a fixed prompt set and a count.

## Build

### 1. The prompt set

30–40 prompts, versioned, never edited in place (append-only, like the results
archive). For each: which skill/agent *should* fire, and which should not.
Include ambiguous prompts and negatives — those carry the signal; unambiguous
positives pass trivially.

### 2. Routing accuracy

Run the set; log what fired. Recall, precision, misrouting. This is the baseline
every later harness change gets measured against.

### 3. Cost baseline — the cheap win

Extend the transcript reader over `~/.claude/projects/**/*.jsonl` to sum
`cache_read_input_tokens` vs. `cache_creation_input_tokens`.

Then audit for **prefix volatility**. Anything changing near the top of a system
prompt or `CLAUDE.md` invalidates the cache for everything after it — cached
tokens run roughly 10× cheaper, and agents run ~100:1 input:output, so this is
the highest-leverage line-level change available.

Look at board-brainstorm specifically: `CLAUDE.md` opens with stable prose (good),
but check whether anything injects dates, git state, or file counts early. Stable
content first, volatile content last.

*Expected result: a real multiple, no behaviour change.* One hour, permanent.

### 4. Determinism check

Run the same prompt set twice, same day, no changes. **Whatever differs is your
noise floor** — and no harness change smaller than it is measurable. You already
apply this rule to sim results; it's why "the drift guard drifted itself" was
diagnosable at all.

### 5. Archive

`evals/results-YYYY-MM-DD.md`, append-only, with headlines. Same format as the
sim archive, for the same reason: a future session should cite it without
rereading the table.

## Folded-in experiments

From the deleted `lab/`, the three that survived:

- **Constraint decay** — state 5 constraints, run at ~20% / ~45% / ~70% context
  fill, count how many survive. Tests whether the ~40% guidance binds for your
  work. Directly relevant to lesson 08: if compliance decays with fill, long
  ticks need fresh-context restarts, not better prompts.
- **Verification arms** — same task, four ways: no feedback / prose instruction
  / hook / hook + reviewer. Measure **false completion rate** (said done, check
  was red). Quantifies what lesson 02 bought you.
- **Token-matched orchestration control** — for `/rules-audit`: run 8 parallel
  readers vs. one reader given the same *total* token budget. Published work
  says token volume explains ~80% of multi-agent gains; without this arm you
  can't tell whether parallelism or spend is doing the work.

## Failing check

```bash
node evals/run.mjs --compare baseline
```

Non-zero when routing accuracy regresses more than the noise floor from step 4.

## Extraction note

The prompt-set *format*, the determinism protocol, and the cache audit are all
`dist/` candidates. The prompts themselves never transfer.
