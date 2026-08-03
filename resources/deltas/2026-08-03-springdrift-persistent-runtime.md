# Springdrift: An Auditable Persistent Runtime for LLM Agents — delta

**Date:** 2026-08-03
**Resource:** https://arxiv.org/abs/2604.04660 (Seamus Brady, 2026-04-06)
**Captured:** before any explanation (phase 1, uncontaminated)
**Retrospective:** false

## Placement

**known**
- *(none)*

**partial**
- Append-only memory — experimented with it, anchored on ADR-style indexes.
  Self-described as "barely known." Does not extend to crash recovery,
  supervision, or git-backed state reconstruction.

**unknown**
- Supervised processes / Erlang-OTP-style runtime under an agent
- Git-backed recovery of agent state
- Case-based reasoning as a memory technique
- Hybrid retrieval, and how it compares to a dense-cosine baseline
- Deterministic normative calculus for safety gating
- Auditable axiom trails
- Ambient self-perception / the "sensorium" — self-state injected each cycle
- Forensic reconstruction of agent decisions
- "Artificial Retainer" as a proposed category

## Expectation

**None.** Selected on intrigue, not on a hypothesis. The reader stated plainly:
*"I know nothing about it."*

This is exploratory intake, not gap-filling intake, and that changes what the
delta is worth downstream:

- There is **no expectation diff to measure** in phase 2. The prediction half
  of the delta is empty, so the placement half carries all the weight.
- Phases must be cut **small and foundational**. Nearly everything is
  `unknown`, so a decomposition that assumes any of these four components as
  background will fail immediately.
- The one anchor is append-only memory. Any roadmap should **start there and
  build outward**, since it's the single concept with existing purchase.

## Notes

The reader corrected my framing on the substrate question rather than accepting
the option as offered — evidence the phase-0 skim was neutral enough not to
lead. That's the contamination check passing on run one.

## Findings for the skill

Run 1 of `/intake`. Four things surfaced; all four were folded into
`.claude/skills/intake/SKILL.md` on 2026-08-03.

1. **Phase 1 assumed a prior expectation.** Sometimes there isn't one, and
   forcing it manufactures noise. → `expectation: none — exploratory` is now a
   first-class answer, with "do not ask twice."
2. **The all-full failure test was wrong.** The skill treated a complete
   eight-point block as evidence of invention. This paper genuinely addresses
   applicability and cost. → the test is now **provenance, not fullness**: can
   I name where in the source each point came from?
3. **arXiv fetching.** `/pdf/` extracts headings poorly but saves a local copy
   that reads cleanly page-by-page; `/abs/` gives clean metadata. → noted in
   phase 0.
4. **Weak-evidence notes need a citation caveat.** This one is `anecdotal`
   throughout, and that fact will outlive the memory of reading it. → now a
   rule, and required in the house format.

**Contamination check: passed.** The reader corrected my framing on the
substrate question rather than accepting the option as offered, and answered
`unknown` three times. Evidence the phase-0 skim was neutral enough not to lead
— the failure mode most likely to invalidate the whole procedure.
