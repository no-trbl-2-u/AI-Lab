---
type: Brainstorm Session
title: Applying functional-programming methodology to AI workspaces
description: Whether a workspace's state should be held and mutated or derived by replay — and which FP guarantees survive without a compiler to enforce them.
date: 2026-08-08
verdict: declined
reason: Provenance is `inferred` by the user's own answer — general unease, no incident. The user explicitly wanted the theoretical map rather than a mechanism, and the enforceable half (declared Inputs/Outputs/Composes-with) is already built and guarded at the code tier by `guards/skill-contract.mjs`. The remaining pieces collapse into G10 and G11, already on the spine. Recording it as a gap would produce the wish-list failure the skill warns about.
cites: [5, 9, 10, 11, 12, 13, 15]
generated: { by: brainstorm/0.1, at: 2026-08-08T00:00:00Z }
---

## Surface question

"Let's discuss the idea of applying functional programming methodology to AI
workspaces."

## The problem underneath

**Is a workspace's state a thing you hold, or a thing you derive?** Purity,
idempotence, replay, and composition are all downstream of that one choice. This
repo has been choosing *held* by default — `GAPS.md` and `LEARNINGS.md` are
mutated in place — with exactly one exception, `ROADMAP.md`, which is derived,
never edited, and checked by `tools/roadmap.mjs --check`.

The second-order problem, which turned out to be the more important one: **FP's
guarantees come from a compiler, not from discipline.** In a workspace the
"functions" are prose and the "type checker" is a model that wants to be
agreeable. So the real question is which FP properties survive being enforced by
guards rather than by a type system — and which become the bolded-prose rows in
`CLAUDE.md` that already don't hold.

## Provenance

`inferred` — **unverified**, and stated as such. Asked directly whether this had
bitten or was a hypothesis, the answer was *"general unease"*, with the follow-up
*"I don't necessarily want anything other than to discuss it on a theoretical
level and see what it would look like. What translates and what doesn't."*

No incident. Nothing has been killed mid-work and failed to recover; no skill
re-run has been observed to corrupt state. This is a lens, not an incapacity.

## What the pool said

The pool is not silent. It already contains this argument, having it with itself.

- **R10 §Factor 12** — "make your agent a stateless reducer, `f(state, event) →
  state`." The FP thesis stated outright by a note already in the pool.
- **R09 §context-engineering** — append-only context, deterministic serialization
  (JSON key ordering). Immutability adopted for a cache reason, not a purity one.
- **R10 §conflicts** — the tension is already recorded and already unmeasured:
  the stateless reducer "sits awkwardly with 09's append-only KV-cache advice —
  replaying a reduced state rebuilds a prefix that may not be byte-identical.
  Worth measuring rather than assuming." R15's frontmatter carries the same
  clash and calls it "the sharpest conflict in the pool."
- **R15 §mechanism** — ten append-only JSONL stores, state derived by replay,
  every LLM call and gate decision a DAG node. Event sourcing, in production,
  n=1.
- **R11 §the-three-tiers** — the binding constraint. Deterministic guards can't
  judge unquantifiable properties. "This step is pure" is checkable at the
  boundary (did it write outside declared outputs?) and undecidable in substance.
- **R05** — progressive disclosure, which is lazy evaluation under another name.
- **`workshop/spec/skill-contract.md`** (surfaced by the devil's advocate, not by
  my grep) — already mandates `## Responsibility`, `## Inputs`, `## Outputs`,
  `## Composes with`, `## Failing check`, guarded by `guards/skill-contract.mjs`.
  The composition half of the proposal is built and at the code tier.

Adjacent gaps, neither of which is this: **G10** (replay-based state recovery,
`delta`, not urgent) and **G11** (modular decomposition with declared I/O,
`stated`, building).

## The two arguments

**For:** The qualifier "pure-ish" is load-bearing — the model call is
irreducibly stochastic, but the **write-set** is fully deterministic. Purity at
the boundary, stochasticity inside. From there: FP isn't a new philosophy but
the missing precondition for gaps already stalled. G4's evidence line ("hard to
quantize success/failure") is downstream of steps having no declared output;
G6 can't attribute a cache metric to a change if inputs weren't fixed. `ROADMAP.md`
is the existence proof — the one artifact nobody argues about is the one that is
a pure derivation, and it sits at the code tier while its neighbours in
`CLAUDE.md`'s table sit at prose with silent failure. Also: guards are already
pure-functions-over-files with fixture pairs; the pattern was discovered by hand
and left unnamed, and the marginal cost of guard #6 is where naming it pays.

**Against:** "Apply FP" is a lens; `GAPS.md` explicitly bars "a topic you find
interesting." Stated as an incapacity it collapses into G10 or G11. The
composition half is already built and guarded. Adopting replayability as house
methodology **resolves the pool's sharpest recorded conflict by fiat, in the
direction that costs cache, while G6 says cost mechanics are unmeasured and is
itself tagged `inferred` `unverified`** — an unpriced bill to settle an
unmeasured dispute. Purity is undecidable at the tier that matters, so it lands
in prose with silent failure, which is the row `CLAUDE.md` already flags as
mattering most and holding least. Predicted boring failure: a `## Side effects`
header every spec fills with `none`, a permanently-green `guards/purity.mjs`,
and a doctrine doc cited twice then never opened. Also relevant — R08
§the-two-principles: the hidden state that actually breaks agent composition is
*unstated design context*, which a declared-I/O contract by construction cannot
capture. FP discipline would have passed the Flappy Bird failure green.

**Where they actually disagreed:** narrower than either let on. Both converged
independently on the same two claims — that the **write-set is the only
enforceable piece**, and that **write-set equality, not content equality, is the
right bar** for re-running a step. The whole disagreement is whether that piece
is an *artifact* or a *vocabulary*: `git diff --name-only` against declared
Outputs, hooked at PostToolUse, versus R11's point that substance-purity is
undecidable and G3's recorded limit that permissions match invocations rather
than intentions.

Worth recording: the devil's advocate did **not** decline to make a strong case,
and it named its own flip condition precisely — one logged incident of silent
re-run corruption, or `/decompose-task` run for real (G11 phase 3) showing the
existing contract's fields insufficient.

## What translates, what doesn't

The actual yield of the session.

**Translates:** declared signatures (built); derived-over-held (`ROADMAP.md`,
n=1); effect declaration ≈ permission scope + write-set (partial, G3); lazy
evaluation ≈ progressive disclosure, R05 (present, unnamed); persistent
structure with sharing ≈ KV-cache prefix reuse, R09 (present, unnamed).

**Breaks outright:** referential transparency — same input ≠ same output, and
everything built on it dies with it. The compiler — FP's guarantees are
pre-ship, mechanical, and unavoidable; here only R11's deterministic tier is a
real checker, so every FP property must be independently re-derived as a guard
or it is prose. Idempotence in substance — re-running an LLM step is resampling,
not replay; only the write-set form survives.

**Three unnamed isomorphisms** — the part worth keeping:

1. **Context compaction is garbage collection, and it is not
   semantics-preserving.** A real GC drops only unreachable objects; compaction
   drops what a heuristic guesses is unimportant, and the program keeps running
   against a heap that lost live objects. That *is* drift. R12 treats drift as a
   discipline problem answered by external contracts; the FP lens says it's a
   **memory-model** problem — which is a decent explanation of why R12's answer
   had to be external in the first place.
2. **The R09/R10 conflict is `cons` versus `fold`.** R09's append-only context
   is a persistent list with structural sharing — every append preserves the
   prefix, so the cache hit is free structure reuse. R10's reducer is a fold that
   discards its input by design, so rebuilding produces a byte-different prefix.
   Framed this way the conflict is the persistent-vs-ephemeral data structure
   tradeoff, which FP already knows is **not resolvable in principle** — only
   decidable per access pattern. That is a stronger and more useful statement
   than the notes' current "worth measuring."
3. **`LEARNINGS.md` is already a reducer, and nothing checks the fold is total.**
   Runs emit typed entries, `tools/learnings.mjs --next` folds them,
   `/brainstorm` consumes the fold. Entries can be emitted and never folded;
   there is no totality check.

## Directions on the table

### Option A — Record the isomorphisms in the pool, build nothing
Amend `conflicts:`/`tensions:` on R09/R10/R15 with the cons-vs-fold reading, and
add the GC framing to R12. Cost: one sitting. Tier: **prose**, but descriptive
rather than normative, so silent failure doesn't apply.
**Telltale failure mode:** six months on, neither reframing has been cited in a
design decision — meaning they were clever rather than useful.

### Option B — Write-sets as a skill-contract amendment
One clause: no writes outside `Outputs`, enforced by a PostToolUse hook. Cost: a
hook (G2, unbuilt) plus false-positive burden on skills with incidental writes.
Tier: **code** if hooked, **prose** if not — and the devil's advocate predicts it
ships as prose.
**Telltale failure mode:** the hook fires on legitimate writes often enough that
someone widens a declared set to `**/*`, after which it is green forever and
means nothing.

### Option C — Treat it as a resource question
`/reinforce` on R10's conflict field, hunting for material that *prices* the
replay-vs-cache tradeoff with numbers rather than asserting it.
**Telltale failure mode:** the search returns only blog-tier analogies with no
measurements — confirming the tradeoff is real but unpriced, and that the pool
was not the weak link.

## Verdict

`declined`. Provenance is `inferred` by the user's own answer, the ask was
explicitly for a map rather than a mechanism, and the enforceable half is
already built at the code tier. The residue that matters is the three
isomorphisms, and they are descriptions of things the repo already has — they
belong in notes, not on the spine.

This is the second half of **G12**'s closing condition: an idea explicitly
declined rather than built, with the reason recorded.

**What would reopen it** (recorded so it isn't re-had from scratch): a logged
incident of a skill re-run corrupting or duplicating state, or of one step
silently clobbering state another depended on — either converts G10 from `delta`
to `observed` and makes immutability a fix rather than a preference. Also:
`/decompose-task` run for real, with the divergence report naming which property
the existing contract's fields were missing.

## Open questions

- Option A was offered and not taken. The isomorphisms currently live only in
  this file, which means they are retrievable by reading the transcript rather
  than by `grep` over `resources/` — the exact retrieval asymmetry OKF exists to
  fix. Worth revisiting if any of the three gets cited.
- The cons-vs-fold reading claims the R09/R10 conflict is *not resolvable in
  principle*. Both notes currently say "worth measuring." Those are different
  claims and the pool now holds both, unreconciled.
