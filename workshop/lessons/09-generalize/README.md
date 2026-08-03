# Lesson 09 — Extract

**Layer built:** `workshop/dist/` — the droppable bundle
**Depends on:** all prior lessons having actually run.

## Concept

Only now. Everything before this was built concretely against one repo, with
board-brainstorm as the comparison case. This lesson asks the promotion
question: **which of it survived contact with a second repo, and would it
survive a third?**

The promotion law from `workshop/README.md`:

```
lesson (concrete) → dist/ (proposal) → droppable harness (canon)
```

A pattern that appeared once is an anecdote. Nothing enters `dist/` on the
strength of having worked here.

## Build

### 1. Score every artifact

| Artifact | Worked in ai-lab | Counterpart in board-brainstorm | Repo-specific? | Promote? |
|---|---|---|---|---|
| `harness-audit` skill | | | no | |
| deny-first permission method | | | no | |
| hook templates | | | no | |
| `links.mjs` / `frontmatter.mjs` | | | no | |
| `spec-drift.mjs` | | | schema only | |
| authority-chain template | | | no | |
| memory partition + promotion | | | no | |
| `fresh-contributor` agent | | | no | |
| eval prompt-set format | | | format only | |
| `contract.mjs` + schema | | | no | |

Fill this in from `runs/`, not from memory. An artifact you built but never saw
fail (lessons 01–03 all warn about this) doesn't qualify.

### 2. The bundle

```
workshop/dist/
  .claude/
    skills/
      harness-audit/      what's actually enforced here
      harness-spec/       interview → workshop/spec/harness.yaml
      harness-build/      implement the spec
      harness-drift/      code comparing repo state to spec
    agents/
      fresh-contributor/  epistemic-sandbox auditor
    hooks/                templates, not implementations
  guards/                 repo-agnostic guards only
  spec/schema.yaml        the harness spec format
  INSTALL.md
```

`/harness-drift` is the point of the whole thing: the harness has a written
spec, and drift is detected by comparison, not judgment. The guard cannot drift
because the guard is not a model.

### 3. `/harness-spec` must be enforcement-first

The trap this workshop exists to avoid: an interview flow that emits a
well-worded `CLAUDE.md` and calls it a harness. Every rule the interview
produces must be classified at creation time — deterministic, harness, or prose
— and prose rules with silent failure modes must be flagged as debt in the spec
itself.

If `/harness-spec` can produce a harness with zero failing checks, it is wrong.

## Failing check

**Drop the bundle on a third repo and let it run.**

Not board-brainstorm and not ai-lab — both are yours, built to your instincts, so
a bundle that works on both has only proven it matches your taste. Something
with different shape: no game domain, different language, ideally someone else's
conventions.

```bash
cd <third-repo> && node guards/all.mjs && /harness-audit
```

Success is not "it ran." Success is **it found something true that you didn't
already know about that repo.**

Failure modes to expect, and what each means:

- **Guards pass trivially** → they encode ai-lab's shape, not general shape
- **The spec schema doesn't fit** → over-fitted to a docs repo; needs a code repo
- **The interview asks unanswerable questions** → assumes context only you have
- **`harness-audit` finds nothing** → it was pattern-matching your `CLAUDE.md`
  style, not analyzing enforcement

Any of those sends the artifact back from `dist/` to lesson status. That's the
ladder working, not the project failing.

## Extraction note

This lesson has no extraction note. It *is* the extraction — and what comes after
it is project 4, the long-horizon runner, with parts that exist and have been tested somewhere
other than where they were born.
