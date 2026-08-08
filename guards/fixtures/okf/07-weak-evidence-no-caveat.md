---
type: Resource
id: 7
title: One story, told confidently
description: Rests on a single anecdote and says nothing about how to cite it.
origin: external
resource: https://example.com/anecdote
tags: [fixture]
tier: core
status: stable
published: 2026-01-01
evidence:
  tier: anecdotal
  summary: One team's account of one deployment, self-reported.
gap: G1
falsifier: A second team reporting the opposite outcome under the same setup.
verified: []
generated:
  by: human:fixture
  at: 2026-01-01T00:00:00Z
sources: []
---

## Why it matters

Defect under test: `evidence.tier: anecdotal` with no citation caveat in the
body. Future-you will remember the idea and forget the sample size, so the
caveat is written for them rather than for now.

## Where it lands

Nowhere. It is a guard fixture.
