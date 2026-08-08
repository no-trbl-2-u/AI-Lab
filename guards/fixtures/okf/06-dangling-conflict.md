---
type: Resource
id: 6
title: Argues with nobody
description: Records a tension against a note that does not exist.
origin: external
resource: https://example.com/dangling-conflict
tags: [fixture]
tier: core
status: stable
published: 2026-01-01
evidence:
  tier: asserted
  summary: Asserted from practice with no data behind it.
gap: G1
falsifier: The conflicting note turning out to agree on re-reading.
conflicts:
  - note: 42
    section: mechanism
    nature: Disagrees about something, with a note that is not in the pool.
verified: []
generated:
  by: human:fixture
  at: 2026-01-01T00:00:00Z
sources: []
---

## Why it matters

Defect under test: `conflicts[0].note: 42` does not exist. The pool's tensions
are load-bearing and `/reinforce`'s opposing axis reads them directly — a
dangling one sends it searching for the other side of an argument nobody made.

## Where it lands

Nowhere. It is a guard fixture.
