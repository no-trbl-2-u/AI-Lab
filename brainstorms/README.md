# Brainstorms — sessions, not knowledge

One file per `/brainstorm` run. **Nothing here is knowledge.** These are records
of how a decision got made, not things that are true. `resources/` is the pool;
this is the transcript.

## Every session resolved to something

That is the point, and `guards/gaps.mjs` enforces it. A session carries a
`verdict` in its frontmatter, and it is one of four:

| Verdict | Means | Also required |
|---|---|---|
| `gap` | It's a real thing you can't do | `gap:` id that resolves in `GAPS.md`, and `provenance:` |
| `declined` | Not worth building | `reason:` — an unrecorded rejection gets re-litigated |
| `resource-question` | You needed to *know* something, not build it | → `/intake` or `/reinforce` |
| `deferred` | Real, not now | the trigger that would make it urgent, in the body |

A brainstorm that resolved to nothing is the failure mode
[G12](../GAPS.md) describes: an idea that neither entered the spine nor was
turned down, and therefore gets re-had in three weeks.

## Declined ideas need no separate index

`grep -l 'verdict: declined' brainstorms/*.md` — same move as the OKF frontmatter
on `resources/`. A rejection you can't find is a rejection you'll repeat, and a
second index file would just be another thing to drift.

Useful queries:

```bash
grep -l 'verdict: gap' brainstorms/*.md          # which sessions fed the spine
grep -l 'verdict: declined' brainstorms/*.md     # what was turned down, and why
grep '^provenance:' brainstorms/*.md             # is everything getting tagged `stated`?
```

That last one is worth running occasionally. If every session comes back
`stated`, the capture question in phase 1 isn't doing its job — it's collecting
wishes rather than establishing whether anything actually broke.

## Format

See [`.claude/skills/brainstorm/SKILL.md`](../.claude/skills/brainstorm/SKILL.md)
§ Phase 6. Checked by:

```bash
node guards/gaps.mjs
```
