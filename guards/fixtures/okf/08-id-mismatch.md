---
type: Resource
id: 88
title: Filed under the wrong number
description: Its declared id disagrees with the filename it lives in.
origin: external
resource: https://example.com/mismatch
tags: [fixture]
tier: core
status: stable
published: 2026-01-01
evidence:
  tier: measured
  n: 40
  summary: Forty runs with conditions reported.
gap: G6
falsifier: A rerun at the same conditions diverging from the reported result.
verified: []
generated:
  by: human:fixture
  at: 2026-01-01T00:00:00Z
sources: []
---

## Why it matters

Defect under test: `id: 88` in `08-*.md`. Every cross-reference in the pool —
`conflicts[].note`, citations, the README index — resolves by number, so an id
that disagrees with its filename breaks the graph silently.

## Where it lands

Nowhere. It is a guard fixture.
