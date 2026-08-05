---
type: Resource
id: 5
title: Points at a gap that isn't there
description: Names a gap ID the spine has no entry for.
origin: external
resource: https://example.com/dangling-gap
tags: [fixture]
tier: core
status: stable
published: 2026-01-01
evidence:
  tier: asserted
  summary: Asserted from practice with no data behind it.
gap: G99
falsifier: Someone measuring the claim and reporting the opposite.
verified: []
generated:
  by: human:fixture
  at: 2026-01-01T00:00:00Z
sources: []
---

## Why it matters

Defect under test: `gap: G99` does not exist in `GAPS.md`. Gaps are the spine;
a note claiming to serve one that was closed or renamed is how the pool drifts
away from the list it is supposed to be pulled toward.

## Where it lands

Nowhere. It is a guard fixture.
