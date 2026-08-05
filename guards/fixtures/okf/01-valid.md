---
type: Resource
id: 1
title: A fully conformant note
description: The shape every note in the pool is checked against.
origin: external
resource: https://example.com/valid
tags: [fixture, conformant]
tier: core
status: stable
published: 2026-01-01
stale_after: 2099-01-01
evidence:
  tier: measured
  n: 300
  summary: 300 seeded runs per cell, baselines rerun from the same code.
gap: G5
falsifier: A rerun at the same seed producing a different headline number.
conflicts:
  - note: 2
    section: mechanism
    nature: Fixture 2 claims the opposite about ordering.
verified: []
generated:
  by: human:fixture
  at: 2026-01-01T00:00:00Z
sources: []
---

## Why it matters

Nothing — this exists so the guard has a known-good baseline. If this fixture
starts failing, the schema changed and the pool needs re-checking.

## Where it lands

Nowhere. It is a guard fixture.
