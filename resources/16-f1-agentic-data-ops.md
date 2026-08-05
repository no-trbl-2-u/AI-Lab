---
type: Resource
id: 16
title: "From Weeks to Minutes: How F1 Uses Agentic AI on AWS"
description: F1 cut data-source onboarding from 6–8 weeks to ~40 minutes by having one agent with modular skills draft artifacts as PRs that engineers approve.
origin: external
resource: https://aws.amazon.com/blogs/machine-learning/from-weeks-to-minutes-how-formula-1-uses-agentic-ai-on-aws-to-accelerate-data-operations/
tags:
  - production-case-study
  - enforcement
  - pr-gate
  - data-ops
  - single-agent
tier: reference
status: stable
published: "2026"
read: 2026-08
evidence:
  tier: asserted
  summary: Self-reported by two named F1/AWS stakeholders in a vendor blog. No A/B test, no baseline methodology, no disclosed PR rework rate, and no definition of "task" behind the 95%-autonomous figure.
gap: G2/G3
falsifier: A disclosed high PR-rework rate, which would collapse the 95%/99% claims into "we still do the work, just review AI-drafted boilerplate".
conflicts:
  - note: 7
    section: multi-agent
    nature: F1's production choice is a single agent with modular skills, not multi-agent orchestration — landing on 08's side for a case that could plausibly have gone either way.
verified: []
generated:
  by: claude/notes-0.1
  at: 2026-08-03T00:00:00Z
sources: []
---

# 16 — From Weeks to Minutes: How F1 Uses Agentic AI on AWS

## In brief

| | |
|---|---|
| **Thesis** | F1 cut new-MarTech-data-source onboarding from 6–8 weeks to ~40 minutes of code generation by having a Bedrock AgentCore agent draft config/pipeline/governance artifacts as PRs that engineers approve. |
| **Problem** | Manual schema mapping, pipeline building, and GDPR tagging created an 18-month backlog for 12 sources; undocumented upstream schema drift broke pipelines mid-race-weekend with no unified lineage to debug from. |
| **Mechanism** | One agent (not a swarm) with modular "skill" definitions (schema mapping, DQ, governance, PII classification) reads a BRD, opens a PR + Jira ticket, then on approval opens three more linked PRs (infra, DBT, governance). A separate event-driven agent watches for schema drift and proposes fix PRs. Enforcement is structural: agents can only open PRs, never merge; short-lived (1hr) scoped tokens; VPC isolation; all model access routed through an internal AI Gateway for audit. |
| **Applicability** | holds: template-shaped, code-generation-style work in an org that already has PR review culture, IaC repos, and least-privilege tooling built · not: ambiguous specs, orgs without that scaffolding already in place `inferred` |
| **Cost** | No tokens/latency/$ disclosed anywhere. Build: one developer, 4 months PoC→production. Standing: every PR still needs human review — the bottleneck moved, didn't vanish — plus uncosted AI Gateway and context-graph authoring. |
| **Implication** | Treat "agent can only open a PR, never merge" as a concrete, cheap enforcement-boundary implementation — no hook required, the gate is structural. |

## Why it matters

This is the pool's first *production case study* rather than an engineering essay — useful less for new mechanism than as a real-world data point on two tensions the pool already carries. It resolves the 07-vs-08 multi-agent question toward single-agent-with-skills in a case that had room to go either way, and it shows the enforcement boundary (11) implemented entirely at the infra tier — short-lived tokens, VPC isolation, and "the agent literally cannot merge" — with no hooks or prose involved.

## Core patterns

- **Structural no-merge permission as enforcement.** The agent's role ends at opening a PR; it holds no merge credential. This is a tier-below-hooks enforcement move: not a gate that fires on an event, but a capability the agent never had.
- **PR-as-approval-gate.** Every generated artifact (config, infra, DBT, governance tags, schema-drift fix) surfaces as a reviewable diff linked to one Jira ticket, giving a single human checkpoint per unit of change regardless of how many files the agent touched.
- **Context-graph-augmented RCA.** Root-cause tooling reads raw failure logs plus a hand-authored JSON topology/business-context graph, so failures surface in business terms ("provider rescheduled delivery") instead of raw symptoms ("file missing in S3").
- **Multi-pass reasoning for token management** inside a single long agent invocation (Pass-0 budget, Pass-1 per-output summarize, Pass-2 rollup) — thin detail in the source, but a named pattern worth tracking if a fuller account surfaces elsewhere.

## Numbers & claims worth remembering

All `asserted`, self-reported, unaudited:
- Onboarding: 6–8 weeks → ~40 min code generation (+ deployment/review hours); ~99% time-to-value reduction.
- "95% of the work" handled autonomously — no definition of "task" given.
- Schema-drift resolution: days → hours.
- 18-month backlog (12 sources) cleared in weeks.
- Identity-resolution latency down 50% — **not agent-driven at all**, plain algorithm tuning bundled under the "agentic AI" umbrella.
- Build: one developer, 4 months, PoC to production.

## Wording notes

None — this resource confirms existing wording in 11 (enforcement tiers) and the 07/08 comparison table rather than requiring new language. No change to `SKILL.md`/`CLAUDE.md`/`AGENTS.md` warranted.

## Tensions

- **07 vs. 08**: adds a real deployment data point to 08's side — see Conflicts above.
- **11**: supports rather than tenses with it — a concrete instance of the harness/deterministic tiers doing the work prose can't.

## Where it lands

→ No lesson currently needs this; referenced from 11's enforcement-boundary discussion and the 07/08 comparison table in `README.md` as a real-world example.

## Related

- 07 — How We Built Our Multi-Agent Research System (the orchestrator-worker side of the tension this resource complicates)
- 08 — Don't Build Multi-Agents (the side this resource's production choice actually confirms)
- 11 — The enforcement boundary (this resource is an infra-tier instance of that thesis)

**Evidence caveat for future citation:** This may be cited as an *illustrative example* of PR-gate-as-enforcement and single-agent-with-skills architecture in production. It may **not** be cited as evidence that agentic onboarding actually saves 99% of engineering time, that "95% autonomous" reflects genuine unsupervised correctness, or that any of these numbers hold outside F1's specific tooling (GitHub+Jira+IaC-everywhere) — all figures are vendor-published, self-reported by two named stakeholders, with no disclosed baseline, audit, or PR-rework rate.
