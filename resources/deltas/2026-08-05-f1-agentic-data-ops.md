# From Weeks to Minutes: How F1 Uses Agentic AI on AWS — delta

**Resource note:** resources/16-f1-agentic-data-ops.md

**Date:** 2026-08-05
**Resource:** https://aws.amazon.com/blogs/machine-learning/from-weeks-to-minutes-how-formula-1-uses-agentic-ai-on-aws-to-accelerate-data-operations/
**Captured:** before any explanation (phase 1, uncontaminated)
**Retrospective:** false

## Placement

**known**
- Automated schema evolution detection (agents/tooling reacting to upstream
  schema drift) — could already act on this concept.

**partial**
- End-to-end observability with root-cause analysis — know it matters,
  couldn't yet predict or debug a concrete implementation of it.
- Security/governance architecture for agentic systems (scoping agent
  permissions, credentials, boundaries in production) — same boundary.

**unknown**
- Automated data source onboarding as an agentic workflow (BRD → generated
  config/pipeline/PR)
- Amazon Bedrock AgentCore specifically
- Unified data access/governance via a single platform (SageMaker Unified
  Studio tying access control across sources)
- Customer identity resolution as a named workstream
- Multi-agent workstream architecture (five workstreams composed for one
  platform migration)

## Expectation

**Real agentic architecture** — the reader predicted the article would give
concrete detail on how the agents are orchestrated, scoped, and supervised,
not just a marketing showcase.

## Notes

Expectation was **partly right, partly wrong**. Right: permission/scoping
detail (short-lived tokens, VPC isolation, AI Gateway) is genuinely concrete,
more so than typical vendor case studies. Wrong: the "orchestration" is
thinner than the framing implies — one of five "workstreams" (identity
resolution) has no agent at all, another (observability) only reads and
explains rather than acting, and the headline numbers (99%, 95% autonomous)
have no disclosed baseline, audit, or rework rate. The gap between the title's
"agentic AI platform" and what's actually agentic in the body is itself the
most useful finding — three of five workstreams aren't autonomous
decision-making.
