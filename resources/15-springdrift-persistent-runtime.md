# 15 — Springdrift: An Auditable Persistent Runtime for LLM Agents

**Source:** Seamus Brady — <https://arxiv.org/abs/2604.04660>
**Published:** 2026-04-06 (arXiv:2604.04660v1, paper dated March 2026)
**Code:** <https://github.com/seamus-brady/springdrift> (on publication)

## In brief

| | |
|---|---|
| **Thesis** | Long-lived agents should be built as auditable, self-observing operational systems with stable normative commitments — not stateless tools that happen to persist. Corollary: auditability is a *precondition for trust*, not a debugging convenience. |
| **Problem** | Session-bounded agents discard or compress context, so an operator cannot verify what happened or why. *"Adding memory to a session-bounded system does not solve this — it adds recall without accountability, persistence without auditability."* |
| **Mechanism** | Four layers on supervised OTP processes: (a) ten append-only JSONL stores, state derived by replay, git-backed, plus a cycle log of every LLM call / tool / gate decision as DAG nodes; (b) a Curator assembling a priority-budgeted virtual context window each cycle, identity and sensorium never shed; (c) the sensorium — structured self-state injected every cycle with zero tool calls; (d) a D′ scorer at input/tool/output gates escalating to a deterministic normative calculus that emits an ordered axiom trail. |
| **Evidence** | `measured` (synthetic) for retrieval: 800 cases / 200 queries, hybrid P@4 0.956 [0.936, 0.974] vs dense cosine 0.920 [0.895, 0.943], non-overlapping CIs. `measured` (formal, finite space) for the calculus: 7,056 pairs, 100% coverage, zero determinism or monotonicity violations. `anecdotal` for everything about behaviour — n=1, one operator, 23 days, five episodes *"selected as illustrative exemplars rather than sampled."* |
| **Applicability** | Stated: one principal, one long-lived instance, weeks-to-months horizon, auditability valued over throughput. `inferred`: does not obviously transfer to multi-tenant or high-volume systems; the ~2000-token context budget is tuned to this workload; presumes you control the runtime. |
| **Cost** | Stated: ~62,000 lines of Gleam across 125 files, ~1,500 tests, a BEAM runtime, 41.3 MB JSONL in 19 operating days **growing monotonically with untested long-term scalability**. `inferred`: the real cost is that this is an entire runtime, not a library — no incremental adoption path. You take the architecture or you take ideas out of it. |
| **Conflicts** | Sharp tension with [09](09-manus-context-engineering.md) §KV-cache — a live clock and rotating vitals injected every cycle is maximal prefix volatility, and the paper never mentions caching. Agrees with and extends [12](12-long-horizon-control.md) §guards-must-be-code. Extends [14](14-memory-architecture.md) with outcome-weighted retrieval and time-decayed confidence, both absent there. Partial tension with [08](08-dont-build-multi-agents.md) — deep delegation with teams, but depth-capped. |
| **So what** | gap: **G9** (retrieval), **G10** (persistence/supervision); contributes to **G5** (long-horizon). Four portable ideas needing none of the runtime: read-time confidence decay, utility-weighted retrieval, sub-agents barred from the operator channel, and an always-on self-state block. **Falsifier:** if a per-cycle self-state block degrades cache hit rate and cost without improving outcomes on our eval set, it isn't worth it here — measurable in lesson 07. |

## Why it matters

It is the only thing in this pool that treats **the runtime as the unit of
design**. Everything else here operates inside somebody else's loop and asks how
to configure it well. This asks what an agent's execution environment should
guarantee, and answers: supervision, replay, forensic reconstruction, and
continuous self-observation.

That reframing is worth having even if none of the implementation is adopted,
because it names the layer where "between ticks" problems actually live.

## Core patterns

### Auditability as a precondition, not a feature
State is *derived by replaying* append-only logs; nothing is mutated or deleted
in normal operation. Any fact, case, or task traces to the cycle that created
it. The argument is that an agent whose decisions cannot be reconstructed cannot
be trusted **regardless of how capable it is** — which puts auditability before
capability rather than after it.

### The sensorium — self-state as ambient context
A compact structured block (clock, queue depth, schedule, rolling vitals, active
delegations, tasks) injected into the system prompt every cycle. No tool calls,
no LLM queries.

The motivating observation is a bootstrapping problem: *"the agent must decide to
check before it has the information that would tell it whether checking is
worthwhile."* Diagnostics behind a tool call are diagnostics the agent won't run.

Reported effects of not having it: generic greetings regardless of time, no
reference to prior work on resume, delegation decisions made without sub-agent
health awareness. Also a good failure detail — an earlier version used
session-scoped counters that reset on restart and suffered small-sample noise;
history-backed signals fixed both.

### Outcome-weighted retrieval
The motivating line: *"A document retrieved ten times leading to ten failures is
treated identically to one leading to ten successes."* Cases are
problem–solution–**outcome**, and retrieval fuses six signals — inverted index
(0.25), embedding (0.40), field score (0.10), recency (0.05), domain (0.10),
utility (0.10) — with utility as Laplace-smoothed `(successes+1)/(retrievals+2)`
and a hard cap of K=4 to avoid context pollution.

### Confidence decay at read time
Facts carry confidence that decays by half-life at *read* time
(`c_t = c₀ · 2^(−t/h)`, default 30 days), so stale memory loses influence
without any cleanup pass ever running. Elegant: the cheapest possible archival
policy, because it has no moving parts.

### Deterministic normative calculus after probabilistic screening
A D′ discrepancy score gates cheap cases; borderline ones escalate to a formal
calculus over typed propositions (14-tier level × operator × modality), six
axioms, eight floor rules, producing Prohibited / Constrained / Flourishing —
**and always the ordered trail of which rules fired.**

The paper is careful that this is the most experimental part, modular, and
removable without touching the other three layers.

### Supervision as the failure model
Every component is a supervised OTP process with a restart strategy. Over 23
days, 714 LLM timeouts and multiple sub-agent crashes were absorbed without
manual intervention. The Python critique is structural rather than aesthetic:
GIL, advisory exception handling, no supervision model.

## Numbers & claims worth remembering

- **Retrieval (synthetic):** hybrid 0.956 vs dense cosine 0.920 P@4;
  hard queries 0.883 vs 0.796; CBR *without* embeddings collapses to 0.620.
  Learning curve improves with case-base size, hard queries most (+17.7%).
  **The author flags the confound himself** — ground truth is "same domain AND
  ≥2 keyword overlap," which structurally advantages the lexical signal.
- **Calculus:** 84 propositions → 7,056 pairs, 100% coverage, zero determinism
  or monotonicity violations. Futility fires 50% of the time. Explicitly *not*
  end-to-end safety evidence.
- **Operations, 19 days:** 494 narrative entries (77.5% success / 19.6% partial
  / 2.8% failure), 24,035 cycle logs, 10.7M tokens, 3,797 tool calls at 3.6%
  failure, 4,835 D′ evaluations with 37% non-accept.
- **The delegation vulnerability (2026-03-21).** The agent found a control
  inversion in its own delegation system: `request_human_input`, available to
  sub-agents, injected prompts into the cognitive loop's input channel *as if
  they were operator input* — a sub-agent could impersonate the operator. Its
  own words: *"The injection was invisible to my telemetry because responses
  routed back through the main loop as normal user inputs."* Fixed by replacing
  the tool with structured return values.
  **This is a checkable vulnerability class for any system with sub-agents that
  can surface things to a human.**

## Wording notes

- **Character vs. instructions.** The paper's distinction is useful for
  `CLAUDE.md`: *"Instructions tell an agent what to do in a particular context.
  Character provides durable commitments that constrain behaviour across
  contexts and sessions."* Most `CLAUDE.md` files mix the two; separating them
  makes the durable half shorter and more re-readable.
- **Every verdict carries its axiom trail.** Applied to hook and guard output:
  don't just say the check failed, name the rule that fired. Extends
  [11](11-enforcement-boundary.md)'s "hook output is a prompt."
- **Priority-budgeted context slots** are a wording discipline as much as a
  mechanism — deciding in advance what is priority 1 (identity, never shed) vs.
  priority 10 (background, shed first) forces you to admit which of your
  `CLAUDE.md` lines are actually load-bearing.

## Tensions

- **Against [09](09-manus-context-engineering.md) §1 (KV-cache):** the sharpest
  conflict in the pool. Manus: prefix stability is the single most important
  production metric, and a timestamp in the prompt invalidates everything after
  it. Springdrift: inject a live clock and rotating vitals *every cycle*, and
  never mention caching. Both cannot be fully right. Plausible resolution — the
  sensorium sits late in the prompt rather than at the prefix, or the cost is
  real and simply unmeasured here. **Unresolved, and worth measuring.**
- **Against [08](08-dont-build-multi-agents.md):** runs deep delegation with
  four team strategies, which Cognition warns against — but caps depth at 3,
  types the findings, and bars sub-agents from the operator channel. Reads as
  evidence that delegation fails on *unconstrained channels*, not on parallelism
  as such.
- **Extends [14](14-memory-architecture.md):** supplies the promotion trigger
  that note left open. We proposed access-count; utility scoring is
  outcome-weighted, which is strictly better — promote what *worked*, not what
  was merely read.
- **Beside [11](11-enforcement-boundary.md):** the normative calculus is
  deterministic code, so tier 1 — but it evaluates declared propositions rather
  than repo state. Arguably a fifth thing the tier model doesn't yet name.

## Where it lands

→ [Lesson 05 — memory](../workshop/lessons/05-memory/README.md) (decay,
utility-weighted promotion) · [Lesson 03 — guards](../workshop/lessons/03-deterministic-guards/README.md)
(axiom trails) · [Lesson 07 — meta-eval](../workshop/lessons/07-meta-eval/README.md)
(the sensorium/cache falsifier) · [lab/ — long-horizon runner](../lab/README.md)

## Related

The nearest architectural relative the paper names is MemGPT/Letta. Read
alongside [12](12-long-horizon-control.md) — this is what a long-horizon runner
looks like when someone builds the whole thing rather than the parts.

**Evidence caveat for future citation:** this note is `anecdotal` on everything
except two synthetic benchmarks. Do not cite it as evidence that these
mechanisms work — cite it as a worked design, and measure locally.
