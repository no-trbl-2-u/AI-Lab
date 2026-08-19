# On the Fragility of Self-Improving Agents — delta

**Resource note:** resources/17-self-improving-agent-fragility.md

**Date:** 2026-08-19
**Resource:** https://arxiv.org/abs/2608.18066
**Captured:** before any explanation (phase 1, uncontaminated)
**Retrospective:** false

## Placement

**known**
- Memory-based self-improving agents as a setting — an agent working an online
  task stream while maintaining a textual memory bank it writes to and
  retrieves from. Could build or debug one: knows what gets written, when, and
  how it's retrieved.
- Task order as an implicit easy-to-hard curriculum, and that it can be a
  hidden prerequisite for a method working. Would already shuffle order when
  evaluating a learning loop.
- Task underspecification — could predict how one bad lesson from an ambiguous
  query compounds across a task stream.

**partial**
- Agent Workflow Memory and ReasoningBank specifically. Heard of one or both;
  could not state how their memory *formats* differ — which matters here,
  because the paper's variance result is per-method.
- Run-to-run variance in agent benchmarks. Would expect noise, but has not
  reasoned about **magnitude**, nor about how stacking a learning loop on top
  interacts with it. The boundary is quantitative, not conceptual.
- Environment underspecification. Has seen agents propose unavailable
  affordances; hasn't tied it specifically to a *memory write* persisting the
  error so it re-fires on later tasks.
- Injecting rubrics and environment feedback into the memory-construction step
  — intuitive as a direction, but could not say **how much** of the damage it
  recovers. Again the boundary is the number, not the idea.

**unknown**
- (none — no topic landed here)

## Expectation

**"Memory poisoning is the core story"** — the reader predicted the paper's
mechanism would be bad memories compounding, one wrong lesson contaminating
everything downstream, with variance a *symptom* rather than the headline
finding.

## Notes

Three of four `partial` entries have a **quantitative** boundary, not a
conceptual one: the reader knows the phenomena and does not know their size.
That is an unusual delta shape and it should drive decomposition — phases here
want to be measurement exercises (run it N times, plot the spread) rather than
explanations, because explanation is not the missing thing.

`unknown` is empty. Read honestly that means this resource is a
**calibration** resource for this reader, not an introduction, and the risk is
the opposite of the usual one: not that phases are too big, but that a phase
which merely restates a known concept teaches nothing.

Expectation diff recorded in the note's phase-2 section.
