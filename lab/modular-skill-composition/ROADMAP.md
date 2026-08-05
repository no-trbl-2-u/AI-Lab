# Roadmap — Modular skill composition

Boundaries follow `known → partial → unknown`, per
[PIPELINE.md](../../PIPELINE.md#phases-are-drawn-at-your-seams). The contract
is knowable in advance (we already know what "modular" should mean, from
`guards/intake.mjs` and PIPELINE's own phase rule); the decomposition
procedure and its behavior on a real task are not, so they get their own
phases.

## Current position

**Phase 1 — done.** Phases 2–3 not started.

## Phases

| Phase | What it tests | Status |
|---|---|---|
| 1 | A skill spec can be checked mechanically for modularity, without a judgment call | **done** |
| 2 | A large task can be split into skill specs that each pass phase 1's guard | queued |
| 3 | The procedure holds up on a real task already partly decomposed by hand | queued |

Phase 2 depends on phase 1 (the contract it's splitting against). Phase 3
depends on phase 2 (nothing to run against a real task without it).

See `phases/01.md`, `phases/02.md`, `phases/03.md` for each phase's claim,
citation, build, failing check, and done condition.

## Why three phases and not one

Per PIPELINE.md's stopping rule — *"a phase is atomic when it has exactly one
failing check and fits one sitting"* — applied here to phases about skills:

- Phase 1 is checkable today: write the contract, write the guard, prove it
  fires on a bad spec and passes a good one. One sitting.
- Phase 2 is a different kind of work — designing an interview/split
  procedure — and its failing check (every produced spec passes the phase-1
  guard) can't be written until phase 1's guard exists.
- Phase 3 is dogfooding against unknown terrain (a task nobody has run this
  process on yet) and is expected to surface where phases 1–2 were wrong,
  per PIPELINE.md's stage-5 verification loop.
