# `/brainstorm` — roadmap

**Current position:** all three phases built. Never run on a real idea.

```
01  guards/gaps.mjs — the spine gets validation   ← no skill involved
     │  found 3 real defects on first run
     ↓
02  session schema + verdict enforcement
     │  a brainstorm cannot resolve to nothing
     ↓
03  the skill + the isolated advocate pair
```

## Why this order

**01 before everything** because `/brainstorm` writes into `GAPS.md`, and until
this phase the spine had **zero validation** — `tools/roadmap.mjs` parsed it and
degraded silently when the format drifted. Building the container before the
contents, the same ordering used for `guards/reinforce.mjs`.

That ordering paid immediately: phase 01's first run against the real `GAPS.md`
found **three gaps with no `Closed when:` clause** (G8, G9, G10), which by
`GAPS.md`'s own definition made them topics rather than gaps. Fixed in the same
phase.

**02 before 03** so the skill has a schema to satisfy rather than a shape to
invent.

## Phases

| # | Claim | Failing check | Type |
|---|---|---|---|
| [01](phases/01.md) | A malformed gap entry is rejected before it reaches the spine | `node guards/gaps.mjs --fixtures` | build |
| [02](phases/02.md) | Every brainstorm resolves to exactly one verdict, and a `gap` verdict names a gap that exists | `node guards/gaps.mjs --fixtures` | build |
| [03](phases/03.md) | A real brainstorm produces a session file and a tagged gap entry, without producing code | `npm run guard` + `git diff --quiet -- lab/ guards/ tools/` | build |

## Verification

Phase 03's stage-5 question, and the one that decides whether this was worth
building: **did the advocate pair change any outcome?**

If every session ends in `verdict: gap` and the devil's advocate never talked
anyone out of anything, the pair is theatre and the context isolation is not
buying what it costs. The counter-evidence would be one session that ended
`declined` *because of* something the advocate said.

That cannot be answered from a commit. It needs several real sessions.
