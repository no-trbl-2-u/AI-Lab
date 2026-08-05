# `/reinforce` — roadmap

Three phases. Each is independently useful and each can fail.

**Current position:** planned, nothing built.

```
01  queue format + guard          ← no searching; pure structure. Start here.
     │  the queue can reject a candidate before any search exists
     ↓
02  the skill, note-directed      ← the four axes, run record, topic-search control
     │  needs 01's guard to have something to enforce
     ↓
03  gap-directed mode + CLAUDE.md ← closes the loop the knowledge-layer rule opens
```

## Why this order

**01 before 02** because the guard is the cheap half and the searching is the
expensive half. If the queue format is wrong, that's a fixture edit; if it's
wrong *after* a real search run, it's a re-run. Building the container before
the contents is also the only way phase 2 has something to be checked by.

**03 last** because gap-directed mode is a second entry point into machinery
phase 2 builds, and because the `CLAUDE.md` wording should be written against a
skill that exists rather than one that's planned. The rule and the skill are
mutually load-bearing: the rule creates the need, the skill makes the rule
survivable.

## Phases

| # | Claim | Failing check | Type |
|---|---|---|---|
| [01](phases/01.md) | A candidate can be recorded with a machine-checkable link to the weak point it targets, and a guard rejects one that isn't | `node guards/reinforce.mjs --fixtures` | build |
| [02](phases/02.md) | A run names a resolvable weak point for every candidate and reports every axis it searched, including empty ones | `node guards/reinforce.mjs` on a real run | build |
| [03](phases/03.md) | The knowledge-layer rule terminates in a queued candidate rather than an apology | gap-directed run + `resources/NN-*.md` unchanged | build |

## Stage-3 gate

Per [PIPELINE.md](../../PIPELINE.md), start a phase **only if you understand it
going in.** Phase 01 is structural and well-understood. Phase 02's search
discipline is the part most likely to need `/phase-overview` — the four axes are
easy to describe and hard to actually execute against a search engine that wants
to return similar things.

## Verification

Each phase closes with stage 5: explain it back with the source closed, diff
against the phase file, record in `lab/reinforce/runs/`. Phase 02's stage-5 has a
specific question attached — *did weak-point search actually return different
candidates than topic search?* The guard forces the number to exist; only you can
say whether it's good enough.
