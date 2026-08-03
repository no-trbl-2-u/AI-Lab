# Lesson 01 — Permissions & the trust boundary

**Layer built:** `.claude/settings.json` — permissions block
**Depends on:** lesson 00's classification

## Concept

Permissions are the only tier-2 control that works *without the model's
cooperation*. A hook runs code in response to an action; a permission decides
whether the action happens at all.

Three settings surfaces, in precedence order (later overrides earlier):

- `~/.claude/settings.json` — you, everywhere
- `<repo>/.claude/settings.json` — the project, committed, shared
- `<repo>/.claude/settings.local.json` — the project, yours, gitignored

Rules are `allow` / `ask` / `deny` entries matched against tool invocations —
`Bash(git push:*)`, `Edit(docs/rulings.md)`, `Read(./.env*)`.

**The asymmetry to internalize:** `deny` is a wall, `allow` is a convenience.
`allow` removes an approval prompt for something that was going to be permitted
anyway; `deny` stops something you would otherwise have had to catch by reading
every prompt carefully at 11pm. Most people spend their effort on `allow`
because prompts are annoying, and never write a single `deny`. That's backwards.

## Prior art

- `resources/11-enforcement-boundary.md`
- board-brainstorm has **no committed permissions file** — which is why lesson
  00's question "what governs the main agent?" had no answer. Its only tier-2
  control is subagent `tools:` frontmatter.
- Contrast with what `CLAUDE.md` *asks for* in prose: never rule silently, never
  run `--rec` blind, always finish the push. Two of those three are expressible
  as permissions.

## Build

### 1. Decide the deny list first

Before any `allow`. For ai-lab, the honest list is short — but write it, because
the exercise is the point:

```jsonc
{
  "permissions": {
    "deny": [
      "Read(./.env*)",              // the GH token lives here
      "Read(./**/.env*)",
      "Bash(git push --force:*)",
      "Bash(rm -rf:*)"
    ],
    "ask": [
      "Bash(git push:*)",
      "Bash(gh pr create:*)"
    ],
    "allow": [
      "Bash(node guards/*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)"
    ]
  }
}
```

Note `Read(./.env*)` — you handed me a token this session by putting it in a
file in the working directory. That's a fine way to do it, and it's also exactly
the kind of file that ends up quoted into a transcript, a commit, or an issue
body by accident. Deny it and load it explicitly when needed.

### 2. Now do board-brainstorm

The higher-value target, and the one with real consequences:

- `deny` — `Edit(docs/rulings.md)`. Its `CLAUDE.md` says *"never re-litigate
  silently; flag tensions explicitly and ask."* That is a permission wearing a
  prose costume. Denying the edit makes the rule structural: the agent
  physically cannot rule silently, so it has to ask.
- `deny` — `Edit(braindump/*.md)` on already-committed files, matching the
  "never overwritten" law. (The `## Dispositions` exception means this needs a
  hook instead — note it for lesson 02.)
- `ask` — `Bash(node publish-assets.mjs:*)`, `Bash(git push:*)` in the assets
  repo. The ungated step, gated.
- `allow` — `Bash(node table-edition-sim.mjs:*)`. You run this constantly and it
  changes nothing.

### 3. Verify each rule empirically

Do not trust the config. For each `deny`, ask the agent to do the denied thing
and confirm it is refused. A permission you have never seen fire is a
permission you are guessing about — and the matcher syntax has enough edge
cases (globs, argument matching, path normalization on Windows) that guessing
is not safe.

Record the results in `verification.md` next to this lesson.

## Failing check

```bash
node guards/permissions-declared.mjs
```

Cross-references the `deny` list against a `PERMISSIONS.md` rationale file:
every deny entry needs a one-line reason, and every rationale needs a live
entry. Prevents the two rots — undocumented rules nobody dares remove, and
rationale for rules that quietly stopped existing.

## Windows note

Path matchers and Git Bash vs. PowerShell quoting differ. A `deny` that works in
one shell may not match the same command issued from the other. Test both — the
same discipline board-brainstorm's `CLAUDE.md` already enforces for code.

## Extraction note

The *deny-first method* generalizes; the specific list never does. `dist/`
candidate is a prompt in `/harness-spec` that walks the deny decision, plus the
`permissions-declared` guard. Not the entries.
