# ClawGym II: Exploring Black-Box RL on Agent Harness — delta

**Date:** 2026-08-19
**Resource:** https://arxiv.org/abs/2608.16798v1
**Note:** [resources/18-black-box-harness-rl.md](../18-black-box-harness-rl.md) — kept, core

**expectation:** none — exploratory
**retrospective:** false

---

## known

_(nothing)_

## partial

_(nothing)_

## unknown

- **Proxy capture of model calls.** Standing an interception layer in front of
  the model endpoint to record what a harness you didn't write actually sends,
  rather than instrumenting the harness's internals. Not previously considered
  as a way to observe a harness.
- **A run as a tree, not a transcript.** That compaction, subagents and retries
  cause a single agent run to fork into multiple distinct context sequences —
  so "the conversation" is a branching structure, not one line.
- **PPO / GRPO on forked trajectories.** Both algorithms as machinery, and what
  specifically breaks in advantage estimation when the trajectory branches.
- **Mix-harness training.** That a model can be harness-*specific* at all, let
  alone what happens when you optimise one model across several harnesses with
  different tool schemas and prompt conventions.
- **Token-level consistency.** That re-serialising a transcript through a chat
  template can drift from the byte sequence actually sent on the wire, and that
  the drift matters.
- **Reliability safeguards for long rollouts.** Which mid-run failures are safe
  to discard and which silently corrupt the collected data; what "settled"
  should mean for a trajectory.
- **Sandbox isolation for concurrent agent tasks.** What an agent-task sandbox
  needs that an ordinary container doesn't.

## Notes

**Everything is `unknown` and there is no expectation.** Both halves of the
delta are empty in the same direction, which is the weakest possible input to
`/decompose-resource`. Two consequences, both real:

1. **No expectation diff in phase 2.** There is no prediction to measure the
   paper against, so the usual best phase material — a wrong belief, named —
   does not exist for this resource. The placement half carries all the weight.
2. **Phases must be cut smaller than usual.** Nothing can be assumed as
   background. In particular, topics 4 (PPO/GRPO) and 5 (token-level
   consistency) sit on prerequisites the reader does not have; a phase that
   opens on either without building up to it will defeat them, and splitting it
   further afterwards only subdivides a bad cut.

**Contamination flag — mild, disclosed.** Before phase 1 the reader asked a
scope question ("this is putting an existing LLM inside OpenClaw and training it
through the actual harness, right?"), and I confirmed it and named the training
subject (Qwen3-30B-A3B, weights updated, harness unmodified). So the placement
answers were given already knowing the paper's basic setup. The topic list was
not evaluated or ranked, and no finding was previewed, so the placements should
still be honest — but this delta is very slightly less clean than one taken
cold.

**Scope tension worth recording.** `/intake` phase 0 rejects "model training,
fine-tuning, anything below the harness layer." This paper is literally RL
fine-tuning; the reader's clarification was that the exclusion was meant to rule
out *building their own model*, not *training an existing one against a
harness*. Proceeding on that reading. Whether the harness-layer mechanism is
enough to earn a keep is phase 3's problem, not phase 0's — but if the answer
turns out to be no, the cost was one delta, and that is the intended failure
mode.
