---
type: Resource
id: 4
title: One character off
description: Has a typo in a key name that a permissive reader would ignore.
origin: external
resource: https://example.com/typo
tag: [fixture]
tags: [fixture]
tier: core
status: stable
published: 2026-01-01
evidence:
  tier: measured
  n: 12
  summary: Twelve runs, reported with conditions.
gap: G6
falsifier: A thirteenth run diverging from the reported spread.
verified: []
generated:
  by: human:fixture
  at: 2026-01-01T00:00:00Z
sources: []
---

## Why it matters

Defect under test: `tag:` alongside `tags:`. OKF says consumers must tolerate
unknown keys; we reject them. This is the clearest case for the deviation — a
silently-ignored typo is how a queryable field quietly stops being queried.

## Where it lands

Nowhere. It is a guard fixture.
