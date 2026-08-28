---
type: Resource
id: 18
title: "ClawGym II: Exploring Black-Box RL on Agent Harness"
description: A production harness can be treated as an opaque rollout engine and trained through — by capturing model calls at the serving boundary and rebuilding the run as a prefix tree whose branch points are the harness's own context-management features.
origin: external
resource: https://arxiv.org/abs/2608.16798v1
tags:
  - black-box-rl
  - agent-harness
  - prefix-tree
  - serving-proxy
  - trajectory-reconstruction
  - compaction
  - subagents
  - mix-harness
  - token-in-token-out
  - model-harness-fit
tier: core
status: stable
published: 2026-08-17
read: 2026-08
evidence:
  tier: measured
  n: 30
  summary: >-
    n is PinchBench's task count after discarding multimodal tasks; ClawGym-Bench
    spans 6 categories but its size is undisclosed. Backbones Qwen3-8B and
    Qwen3-30A3B. Pass@1 on ClawGym-Bench +9.98 (OpenClaw) and +14.81 (Claude Code) over each
    model's own initialisation; PinchBench +11.71 / +17.28. Stable over 200–400
    optimisation steps. Ablated across two harnesses x two algorithms (PPO,
    GRPO), plus cold-start and white-box comparisons. Rubric judging by GPT-5.4,
    64K context. Weakness: single run per cell — no seeds, error bars, or
    variance reported anywhere, so per-cell differences under ~2 points are not
    separable from noise. OpenClaw and Claude Code arms differ in initialisation
    (cold-started vs. base), which the authors flag, so the two harness columns
    are not a clean head-to-head.
gap: G7
falsifier: >-
  Reconstruct the model calls of a long real Claude Code session in this repo
  and find the call graph is a single unbranched chain — no compaction or
  subagent fork starting a new root — in which case the prefix-tree machinery
  describes a structure our usage does not produce, and the note's central
  observation does not transfer here.
conflicts:
  - note: 2
    section: thesis
    nature: >-
      02 asserts "a decent model with a great harness beats a great model with a
      bad harness," treating the model as fixed and the harness as the tunable.
      This paper measures the pair and finds the fit is itself trainable and does
      not transfer: a model trained in a hand-built loop loses 9.57 points moving
      to OpenClaw, and the OpenClaw-trained model loses 11.25 going the other
      way. The unit is (model, harness), not the harness alone.
  - note: 1
    section: compaction
    nature: >-
      01 treats compaction and subagents as context-protection tactics with a
      cost in fidelity. Here they are the things that fork the run, and their own
      trajectories are excluded from optimisation entirely because the task
      reward cannot be assigned to them — an unpriced cost 01 does not name.
verified: []
generated:
  by: claude/intake-0.1
  at: 2026-08-19T00:00:00Z
sources: []
---

# 18 — ClawGym II: Exploring Black-Box RL on Agent Harness

## In brief

| | |
|---|---|
| **Thesis** | A production harness can be treated as an unmodified opaque rollout engine and still be trained through — capture model calls at the serving boundary, rebuild the run as a prefix tree, optimise over the tree — and this beats training through a transparent hand-built loop *when measured in the harness you deploy in*. |
| **Problem** | RL on agent tasks assumes an observable linear trajectory. A real harness gives you neither: its control flow is opaque, and what it emits is "fragmented, forked, and often redundant model calls." |
| **Mechanism** | Put a proxy at the model endpoint; record exact input tokens, generated tokens and rollout log-probs per call; attach each call to the node whose accumulated history is the longest prefix of its input; train on root-to-leaf paths, counting shared prefixes once. |
| **Applicability** | holds: harnesses reachable at a model endpoint, outcome-scorable tasks, an open-weights model you may update · not: closed API models, tasks with no terminal verifier, anyone unwilling to run RL infrastructure at all `inferred` |
| **Cost** | Sandbox per rollout; a proxy on the hot path; 200–400 optimisation steps; discarded data by design (dead leaves, over-branching rollouts, all compaction and subagent trajectories); a value model plus its pretraining stage if PPO. `inferred` except the discards, which are §3.2.2. |
| **Implication** | Stop treating "which harness" as a deployment detail chosen after the model. Same model, same tasks, different harness moves ClawGym-Bench by 8–16 points — larger than a 4x parameter increase in one case. |

## Why it matters

Two reasons, and only the second is about RL.

**It measures what [02](02-agent-harness-engineering.md) asserts.** 02 is the
pool's clearest statement that the harness matters more than the model, and it
is asserted from practice. Table 1 here holds the model fixed and swaps the
harness, which is the experiment 02 never ran. It largely confirms 02 — and
then complicates it, because harness fit turns out to be *trainable*, which
means "the harness is the unit of engineering" is only half true. The pair is
the unit.

**It is the pool's first outside-in description of what a harness does to a
conversation.** Every other note describes harness features from the designer's
seat — here is compaction, here is subagent delegation. This one had to
reconstruct those features from the wire, without source access, and the
reconstruction is a precise account of what they *do to the shape of the run*:
they fork it. That reframing — a session is a tree whose branch points are
exactly its context-management events — is not in any of 01–16.

## Core patterns

1. **The serving boundary is a complete observation point for the model,
   and only for the model.** However opaque the harness, every model action
   crosses the wire. Nothing about the harness's internal decisions does. This
   is a clean statement of what black-box observability buys and what it
   cannot.
2. **A harness run is a tree, not a transcript.** Within an uninterrupted
   segment each call extends the last; compaction or subagent execution "may
   start a new segment from a shortened or alternative context." Leaves are
   calls nothing extends; each root-to-leaf path is a candidate trajectory.
3. **Reconstruct by longest-prefix attachment.** Attach each call to the node
   whose accumulated history is the longest prefix of that call's input. Diffing
   a child's input against parent-history-plus-parent-response also recovers the
   tool outputs the harness injected — you can recover the environment's side of
   the conversation without instrumenting the environment.
4. **Retries leave dead leaves.** A superseded attempt is a leaf nothing
   extends. Named example: OpenClaw regenerating after a malformed tool call.
   Within each compaction-delimited segment, keep the leaf with the longest
   valid continuation; discard the siblings.
5. **Over-branching is a corruption signal, not a feature.** Past a leaf-count
   threshold the rollout has "entered repeated or failed generation rather than
   legitimate interaction branching" — discard the whole rollout. A
   harness-agnostic detector for *the agent is stuck in a loop*, computed purely
   from call structure.
6. **Two views of every model call.** Generated tokens are grafted onto the tree
   and are the sole training data; the decoded text is what the harness acts on.
   Harness-side tool-call normalisation and assistant-message re-serialisation
   therefore "stay on its own view" and cannot perturb the token record. The
   general form: *the transcript is a rendering, not the record.*
7. **Group by task–harness pair, not by task.** Mix-harness training normalises
   advantages within each pair, so one harness's reward distribution cannot
   distort the other's.
8. **Settling before assembly.** A harness that retries asynchronously may still
   be writing records after the request returns. Wait until the record count is
   unchanged across several checks, with a timeout. *Request completion is not
   record completion.*

## Numbers & claims worth remembering

All `measured`, all single-run — see the evidence caveat below.

**Training gains** (Pass@1, over each model's own initialisation):

| | ClawGym-Bench | PinchBench |
|---|---|---|
| via OpenClaw | +9.98 | +11.71 |
| via Claude Code | +14.81 | +17.28 |

**Harness sensitivity** — same model, same benchmark, ClawGym-Bench average.
*Derived by me from Table 1; the paper does not present this comparison.*

| Model | OpenClaw | Claude Code | Δ |
|---|---|---|---|
| Qwen3-8B | 35.02 | 18.54 | 16.48 |
| Qwen3-32B | 40.32 | 29.37 | 10.95 |
| Qwen3-30A3B | 45.11 | 37.06 | 8.05 |
| Qwen3-235A23B | 54.48 | 45.59 | 8.89 |

The line worth keeping: **Qwen3-8B under OpenClaw (35.02) beats Qwen3-32B under
Claude Code (29.37).** A 4x parameter difference, reversed by harness choice.
Caveat: Claude Code is built for long-horizon coding and terminal work, and
ClawGym-Bench is mostly not that — so this is partly task–harness mismatch, not
a quality ranking of harnesses. That is the point restated, not a defect.

**White-box vs. black-box** (§4.6, ClawGym-Bench average). WhiteBox-30A3B is
trained in a hand-built five-tool agent loop; ClawII-OC-30A3B through OpenClaw:

| Evaluated in ↓ | ClawII-OC-30A3B | WhiteBox-30A3B |
|---|---|---|
| White-box AgentLoop | 51.37 | **59.90** |
| OpenClaw | **62.62** | 50.33 |

Each wins in its home harness. White-box training does transfer — WhiteBox-30A3B
beats its own Qwen3-30A3B baseline by 5.22 under OpenClaw — which the authors
read as evidence that "different harnesses share a common set of underlying
agentic capabilities." But it stays 12.29 points behind the model trained in
place.

**Other:** stable across 200–400 steps · GRPO 32 tasks x 8 rollouts, PPO 256
tasks x 1 · JobBench-Easy 20.46 → 27.20 · OfficeQA-Full 8.53 → 21.54 · 64K
context · GPT-5.4 as rubric judge · cold start improves stability and entropy
behaviour but is not required.

## Wording notes

Nothing here changes a rule in `CLAUDE.md` — this repo does not train models.
Two things it changes in how we *talk*:

- **Stop saying "the transcript."** Say the call tree, or say the rendering. The
  thing you read in the terminal is a view the harness composed; §3.2.4 is a
  documented case of that view differing from what the model emitted in a way
  that mattered. Relevant well beyond RL — it is the same reason a
  post-hoc summary of a session is weaker evidence than the session.
- **When citing 02's harness-over-model claim, cite the pair.** "A decent model
  with a great harness beats a great model with a bad harness" is now measured
  and survives, but with a condition 02 does not carry: the advantage is
  specific to the harness the model was fitted to.

## Tensions

- **Against [02](02-agent-harness-engineering.md) §thesis** — the main one, in
  frontmatter. 02 treats the model as fixed; this makes model–harness fit the
  trainable quantity. Not a contradiction: a strengthening with a boundary
  attached.
- **Against [01](01-effective-context-engineering.md) §compaction and
  [09](09-manus-context-engineering.md)** — both treat compaction as a tactic
  with a fidelity cost. Here it is structural: it terminates a segment and
  starts a new root. And §3.2.2 excludes compaction and subagent trajectories
  from optimisation entirely, because the terminal reward "would introduce
  ambiguous credit assignment." So the harness's most sophisticated
  context-management moves are precisely the ones nothing can score. That is a
  sharper version of the unease in the 07-vs-08 dispute: **subagent work is hard
  to credit, not just hard to coordinate.**
- **Alongside [10](10-twelve-factor-agents.md) §own-your-loop** — 10 says own
  your loop. §4.6 is the closest thing to a measurement of that advice, and
  splits it: owning the loop gives you a better training environment (+18.21 in
  its own loop) but a model that underperforms in the harness you actually ship.
  Own your loop for control; do not assume what you learn in it transfers.

## Where it lands

→ Informs [G7](../GAPS.md) — *never written the agent loop yourself.* It does
not close G7 and does not help build a loop; what it adds is the trade-off G7
was missing, from §4.6. Read before deciding how much to invest there.

## Related

- [02](02-agent-harness-engineering.md) — the claim this measures.
- [10](10-twelve-factor-agents.md) §factor 8 — own your control flow.
- [01](01-effective-context-engineering.md) §compaction, [08](08-dont-build-multi-agents.md) — the features that turn out to be the branch points.

**Evidence caveat for future citation:** every cell in every table is a single
run. No seeds, no error bars, no variance, no repeated evaluation — so
differences under roughly 2 points should not be cited as differences at all,
and the mix-harness "matches or slightly outperforms" result in particular rests
on gaps inside that band. The OpenClaw and Claude Code arms also differ in
initialisation (ClawII-OC is cold-started, ClawII-CC is not), which the authors
disclose, so the harness columns are **not** a controlled head-to-head — cite
the harness-sensitivity table as *the base-model rows*, which share an
initialisation, and not as a claim about the trained models. Cite the +9.98 /
+14.81 headline as "improvement over own initialisation," never as a comparison
between the two harnesses.
