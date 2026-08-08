---
type: Resource
id: 7
title: How We Built Our Multi-Agent Research System
description: A lead agent delegating to parallel sub-agents beats a single agent on breadth-first research, at a large token multiple.
origin: external
resource: https://www.anthropic.com/engineering/multi-agent-research-system
tags:
  - multi-agent
  - orchestration
  - research-agents
tier: reference
status: stable
read: 2026-08
conflicts:
  - note: 8
    section: thesis
    nature: Directly opposed on whether sub-agents help or fracture. See the reconciliation in 08.
verified: []
generated:
  by: claude/notes-0.1
  at: 2026-08-03T00:00:00Z
sources: []
---

# 07 — How We Built Our Multi-Agent Research System

## Why it matters

The strongest published evidence *for* multi-agent orchestration, with honest
cost accounting. Read alongside 08, which argues the opposite. The disagreement
is real and resolvable.

## Architecture: orchestrator-worker

A lead agent analyzes the query, develops a strategy, and spawns subagents to
explore different aspects **simultaneously**, then synthesizes their findings.
Each subagent gets its own context window and returns a condensed result.

The key structural property: subagents **explore in parallel and report**; they
do not **build in parallel and merge**. That distinction is the whole answer to
the 07-vs-08 tension.

## Numbers & claims worth remembering

- Claude Opus 4 lead + Claude Sonnet 4 subagents **outperformed single-agent
  Opus 4 by 90.2%** on the internal research eval.
- **Token usage explained ~80% of the variance** in browsing task success.
  Multi-agent works largely *because* it buys more total tokens of attention on
  the problem, spent in parallel across clean windows.
- Cost: **~15× the tokens of a chat interaction** (a normal single agent is
  ~4×). Only worth it when the task value is high and the work parallelizes.

## Lead agent prompt engineering

- Decompose into subtasks that each specify **objective, output format, and tool
  guidance**. Vague delegation is the dominant failure mode — this is the same
  root cause 08 identifies, addressed by prescription rather than avoidance.
- **Scale effort to complexity** with explicit resource rules (e.g. simple fact
  → 1 subagent, 3–5 calls; comparison → 2–4 subagents).
- Search broad first, then narrow.
- Use extended thinking as a controllable scratchpad for planning.
- Embed human research heuristics rather than rigid procedure.

## Production lessons

- Agents are **stateful and long-running**; you need durable execution and
  resumable checkpoints, not just retries.
- **Full production tracing** is required to diagnose failures — you're
  debugging a distribution of behaviours, not a stack trace.
- **Rainbow deployments** so updates don't disrupt in-flight agents.
- "The gap between prototype and production is often wider than anticipated."

## Wording notes

- Subagent prompts need explicit **output contracts**. Under-specified
  delegation is where multi-agent systems actually break.
- Give the orchestrator budget language, not just goals: how many subagents,
  how many calls each, when to stop.

## Tensions

- Directly against **08**. See the reconciliation there.

## Where it lands

→ [Lesson 07 — meta-eval](../workshop/lessons/07-meta-eval/README.md) (token-matched control arm)
