# Queue — candidates, not knowledge

Output of [`/reinforce`](../../.claude/skills/reinforce/SKILL.md). Nothing here
counts. `/intake` is still the only door into `resources/`.

This is the one place in the repo where speculative accumulation is **allowed**,
and it works precisely because entries have no standing. A candidate is a
nomination with a reason attached, not a thing you know.

## Every entry names the weak point it attacks

```yaml
targets: 09#evidence     # a note's addressable weak point
targets: G9              # a gap
```

`targets` is the field that separates a candidate from a bookmark, and the one
`guards/reinforce.mjs` will reject you for omitting. A link with no target is
something you found interesting, which is the failure mode
[01](../01-effective-context-engineering.md) and
[02](../02-agent-harness-engineering.md) both warn about.

## It decays

Every entry carries `stale_after`, 30 days out. **Expiry is a guard failure
here, not a report** — the opposite of `resources/`, where staleness is only
surfaced. A stale note is one you haven't re-explained; a stale queue entry is
the graveyard arriving on schedule.

Two ways out, both cheap:

- `/intake <url>` → it becomes a note, or a line in `REJECTED.md`
- sweep it → `REJECTED.md` with `expired in queue — never intaken`

An expiring axis is itself information. If everything from `alternative` rots
while `opposing` gets intaken, the problem statement is probably too narrow to
match anyone.

## Format

See [`lab/reinforce/PRD.md § The queue`](../../lab/reinforce/PRD.md). Check with:

```bash
node guards/reinforce.mjs
```
