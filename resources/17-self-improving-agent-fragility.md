---
type: Resource
id: 17
title: "On the Fragility of Self-Improving Agents: Variance, Task Order, and Underspecification"
description: Reported gains from memory-based self-improving agents are largely an artifact of single-run evaluation on a favourably-ordered task stream — under 3 runs and shuffled orders the loop amplifies variance and degrades below the no-memory baseline.
origin: external
resource: https://arxiv.org/abs/2608.18066
tags:
  - evaluation
  - variance
  - task-order
  - memory
  - self-improvement
  - underspecification
  - reliability
  - noise-floor
  - memory-poisoning
tier: core
status: stable
published: 2026-08-18
evidence:
  tier: measured
  n: 3
  summary: >-
    3 identical runs × 3 benchmarks (WebArena 812, VisualWebArena 910, SCUBA 267
    tasks) × 3 task orders (default, Shuffle-1, Shuffle-2), GPT-5-mini backbone,
    ground-truth reward rather than LLM-judge. Variance rose in 17/24 cases
    (71%) when a memory method was added, 11 of them by >50% relative; baseline
    best-worst gap 4.4% on WebArena GitLab vs 7.8% with ReasoningBank, up to
    10.4% on Multisite. Headline gain +1.5% carries p=0.23 (unpaired t-test,
    n=3). Shuffling drops WebArena 54.8% → 49.1% (AWM) / 49.8% (RBank).
    Mitigations recover 31% of the degradation; 69% unexplained. Memory
    inspection (§4.1) is explicitly qualitative and non-exhaustive.
gap: G4
falsifier: >-
  Run one AI-Lab skill 3× same-day on a fixed prompt set and find the best-worst
  gap smaller than the effect sizes we routinely claim from single runs. If our
  own noise floor is negligible, the 3-runs-plus-shuffle protocol is web-agent
  overhead we do not need, and G4's original same-day double run was sufficient.
conflicts:
  - note: 9
    section: "5 — keep the wrong stuff in"
    nature: >-
      Manus says leave failed actions and error traces in context so the model's
      priors shift away from repeating them. This paper shows the opposite once
      failures are written to a persistent store: ReasoningBank writes memories
      from failed trajectories, and the wrong lessons compound across tasks
      rather than inoculating against them. The boundary is window vs. bank —
      keep errors in the context window, gate what reaches the memory store.
  - note: 15
    section: outcome-weighted-retrieval
    nature: >-
      Springdrift demotes memories by utility, (successes+1)/(retrievals+2). The
      Haversine case defeats it: an unintended fallback strategy that
      occasionally produces correct answers keeps a respectable utility score
      while being the wrong strategy. Outcome-weighting is a usefulness filter,
      not a correctness filter, and cannot catch a memory that is wrong for the
      right-looking reason.
  - note: 14
    section: "the missing mechanism — promotion"
    nature: >-
      14 names access-driven promotion (archived item retrieved N times) as the
      cheapest trigger. Fig. 4(c) is a wrong memory climbing exactly that
      curve — the earlier "Haversine" enters, the more it is retrieved. An
      access-driven ladder would promote it. Promotion needs a correctness
      gate, not just a frequency counter.
verified: []
generated:
  by: claude/intake-0.1
  at: 2026-08-19T00:00:00Z
sources: []
---

# 17 — On the Fragility of Self-Improving Agents

## In brief

| | |
|---|---|
| **Thesis** | Reported gains from memory-based self-improving agents are largely an artifact of single-run evaluation on a favourably-ordered task stream; under honest evaluation the loop amplifies variance and, on shuffled orders, degrades *below* the no-memory baseline. |
| **Problem** | You cannot tell whether an agent is learning or whether you got a lucky run. Web-agent papers report one run, and a self-improving loop is stateful — early randomness compounds into materially different memory states, so the loop manufactures the noise that hides its own effect. |
| **Mechanism** | Three moves, all evaluation-side. (1) Run the same configuration **3× identically** and report standard deviation and best-worst gap instead of a point estimate. (2) **Shuffle task order** — benchmark default orders are an easy-to-hard curriculum, because annotators write easy tasks first, and that curriculum is a hidden prerequisite for the method working. (3) **Read the memory bank by hand** — the failures are legible as text, not as scores. |
| **Applicability** | holds: agents that write their own lessons into a persistent store from an online task stream; strong baselines; generic memory-construction prompts · not: memory over a *stable curated corpus* (docs, notes) where nothing is self-written, and probably not single-session agents where there is no accretion to compound `inferred` |
| **Cost** | The honest protocol is **~9× a single-run number** (3 runs × 3 orders). ~$25 per WebArena run, $29 per SCUBA run on GPT-5-mini; memory-method overhead is extra LM calls plus memory in context, which the authors expect to be minimal but do not price. The hand-inspection step does not scale and they say so. |
| **Implication** | G4's closing condition is too weak. A same-day double run gives a gap, not a noise floor — for anything with a memory or accretion step it needs 3 runs *and* an order shuffle, because order is a confound the double run cannot see. |

## Why it matters

This is the pool's first `measured` note about **evaluation itself**. Everything else here that touches measurement — [R12 §self-auditing was requested, not enforced](12-long-horizon-control.md), [R02](02-agent-harness-engineering.md)'s ratchet — argues from practice; this one ran the experiment and reports n. That matters for [G4](../GAPS.md) specifically, which has been sitting on "needs G1–G3 first" with the evidence line *"it was mostly unsuccessful since it's hard to quantize success/failure."* This paper is what quantizing it looks like when you do it properly, and the answer is that the quantity you get first is the **noise**, not the effect.

The deeper reason to keep it as core: it is the strongest available argument that **a memory system without a validation gate is not a memory system, it is an amplifier**. The authors put it in one line — *"without proper validation mechanisms, agent memories are merely unverified hypotheses rather than true lessons learned."* Everything this repo has written about memory ([R14](14-memory-architecture.md), [R15](15-springdrift-persistent-runtime.md)) is about partitioning, retrieval, and decay. None of it is about whether the thing written down is *true*.

## Core patterns

### Report the spread, not the point
Three identical runs, then report standard deviation and best-worst gap per domain. The best-worst gap is the useful one for a reader: it is the range within which a single-run number could have landed by luck, and it is directly comparable to the effect sizes papers claim.

### Task order as a first-class experimental axis
The default order in a benchmark is not neutral. Annotators build easy tasks first, so task-ID order *is* a curriculum. Any method that learns across a stream is therefore being evaluated with a free head start. The fix is one line of code — shuffle — and it is the single cheapest stress test in the paper.

### Memories are contagious
The named mechanism, and the best story in the paper. In WebArena's Map domain the site sometimes fails to load, so the agent falls back to estimating distance with the **Haversine formula** (plus a 1.3 routing multiplier). This occasionally yields a correct answer, so it gets written to memory, retrieved, and reinforced. Fig. 4(c): the earlier "Haversine" enters the bank, the more often it is retrieved thereafter. Entry is stochastic; consequence is monotone. That is variance and poisoning as the *same* phenomenon rather than two.

### Underspecification lives in the memory writer, not the agent
The memory-construction module in ReasoningBank's original implementation is one generic sentence and sees neither the environment's constraints nor the task's rubric. So it writes advice about APIs and human confirmation in an environment that supports neither — plausible, unexecutable, and retrieved forever. The fix is not a better writer; it is giving the writer information it never had.

### The three specification injections
Deliberately mundane, which is the point — all three are information the system already had and was not passing along:
- **+Rub** — the evaluator's rubric and score, supplied *only* at post-completion memory construction; the agent never sees it while working.
- **+Env** — action-level environment feedback (`Failed to input text into index 41`), so UI mistakes are not re-learned.
- **+PMod** — an explicit negative list in the memory prompt: *"STRICTLY AVOID: API or programmatic solutions, visiting external websites, requesting human confirmation."*

## Numbers & claims worth remembering

All `measured` unless marked.

- **17 of 24 cases (71%)** show increased variance when a memory method is added; **11** by more than 50% relative.
- Best-worst gap, WebArena GitLab (180 tasks): baseline **4.4%** → ReasoningBank **7.8%**. Map: **8.3%**. Multisite (48 tasks): **10.4%**.
- Headline gains: AWM **−0.7%**, RBank **+1.5%** (WebArena). The +1.5% has **p = 0.23**, n=3, unpaired t-test — the authors say so themselves.
- Default → Shuffle-1 on WebArena: **54.8% → 49.1%** (AWM), **49.8%** (RBank). Degradation below baseline, not merely a lost gain.
- Their no-memory GPT-5-mini baseline (**54.8%**) beats *both* original papers' memory-enhanced results (AWM 36.3% on Claude-3.5-Sonnet; RBank 53.9% on Gemini-2.5-Pro). The methods were measured against weak agents.
- All three injections combined recover **2.9 points** (49.8% → 52.7%) under Shuffle-1 — **31% of the degradation**. The remaining **69% is unexplained**, and the authors decline to speculate.
- Cost: **$25** per WebArena run (812 tasks), **$29** per SCUBA run (267 tasks), GPT-5-mini, 64-CPU server.
- Human performance on WebArena is **78%**, so headroom is not the limiting factor.

## Wording notes

- **G4's closing condition needs raising.** "The noise floor is known from a same-day double run" is not enough for anything with an accretion step. Two runs give a gap; they do not give a standard deviation, and they cannot see order as a confound. For a memory-bearing skill: 3 runs, plus one shuffled input order.
- Anywhere a skill writes a lesson to a persistent file — `LEARNINGS.md`, `resources/`, `GAPS.md` — the write is **an unverified hypothesis, not a lesson.** That phrasing is worth adopting literally. `/intake`'s evidence tiers already do this job for `resources/`; `LEARNINGS.md` has no equivalent.
- When a prompt tells a writer what to produce, it should also tell it **what the environment cannot do**. `+PMod`'s "STRICTLY AVOID" list is the cheapest of the three interventions and did comparable work.
- Never report a single-run number for a skill's behaviour in this repo without saying it is single-run.

## Tensions

- **[R09 §5](09-manus-context-engineering.md) — "keep the wrong stuff in."** Manus's advice is about the *context window*; this paper's failure is in the *persistent store*. Keeping an error visible for the remainder of one task shifts priors usefully. Writing it into a bank that retrieves it for the next hundred tasks does not. The synthesis: R09 §5 is bounded to the window, and the boundary was never stated because Manus had no bank. This tension is now three-way with [R10 §factor-9](10-twelve-factor-agents.md).
- **[R15 §outcome-weighted-retrieval](15-springdrift-persistent-runtime.md).** Utility scoring demotes what fails. Haversine *sometimes succeeds* — its utility stays fine while the strategy is wrong. Outcome-weighting filters usefulness, not correctness.
- **[R14 §promotion](14-memory-architecture.md).** Access-driven promotion is the ladder's cheapest trigger and is exactly the curve Fig. 4(c) plots. A frequency counter promotes a contagious memory faster than a correct one, because contagion *is* frequency. R14's ladder wants a correctness gate at the promotion step.
- **[R13](13-epistemic-sandboxing.md)** agrees rather than conflicts, and is worth reading alongside: prediction before observation is what the +Rub intervention does structurally — the rubric arrives after the agent has committed to an answer, never before.

## Where it lands

→ [G4 — measurement discipline](../GAPS.md) · the falsifier above is a one-sitting lab: three same-day runs of one skill on a fixed prompt set, report the best-worst gap.
→ [lesson 07 — meta-eval](../workshop/lessons/07-meta-eval/README.md) — the noise-floor baseline this lesson needs is precisely the protocol here.

## Related

[R14](14-memory-architecture.md) and [R15](15-springdrift-persistent-runtime.md) are the pool's memory-design notes; this is the note that says a memory design without a validation gate has an amplifier where its filter should be. [R12](12-long-horizon-control.md) §self-auditing generalizes: a loop cannot be trusted to grade its own accretion from inside itself.
