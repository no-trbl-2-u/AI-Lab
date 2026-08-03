# Lesson 02 — Hooks: the enforcement layer

**Layer built:** `.claude/hooks/` + the `hooks` block in `settings.json`
**Depends on:** lesson 01

## Concept

Hooks are shell commands the harness runs on lifecycle events, outside the
model's control. They are how a prose rule becomes a rule.

The events, roughly (verify against your installed version — this surface moves):

| Event | Fires | Good for |
|---|---|---|
| `SessionStart` | session opens | injecting current state |
| `UserPromptSubmit` | before your prompt reaches the model | context injection, blocking |
| `PreToolUse` | before a tool runs | vetoing an action |
| `PostToolUse` | after a tool runs | validation, formatting, tests |
| `Stop` | agent tries to finish | **blocking premature completion** |
| `SubagentStop` | a subagent tries to finish | validating a subagent's contract |
| `PreCompact` | before compaction | preserving what must survive |
| `SessionEnd` | session closes | residue capture |

`Stop` and `SubagentStop` are the ones to care about. They are the answer to
"how do I enforce self-auditing between ticks" — you don't ask the agent to
audit itself, you **block its exit** until a check passes.

### The two design rules

**Success-silent, failures-verbose.** A hook that prints on success burns tokens
on every single tool call, forever, and trains you to ignore its output. Emit
nothing when things are fine; emit the raw error when they aren't.

**Hook output is a prompt.** Whatever a failing hook prints goes into the
model's context as the next thing it reads. Write it as an instruction, not a
log line. `error TS2345: Argument of type 'string'...` beats `validation failed`
by a wide margin, because the first one is actionable and the second causes a
guessing loop.

## Prior art

- `resources/11-enforcement-boundary.md`
- board-brainstorm has **zero hooks**, and its `CLAUDE.md` contains at least
  four rules that want to be hooks. Named in the build below.

## Build

### 1. The smallest real hook

`PostToolUse` on `Write|Edit` for this repo — validate that any touched
`resources/*.md` still has required frontmatter and that its `→ lesson` link
resolves.

```jsonc
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{ "type": "command", "command": "node .claude/hooks/validate-note.mjs" }]
    }]
  }
}
```

The hook reads the tool payload from stdin as JSON, checks only the file that
changed, and exits 0 silently or exits non-zero with the specific problem.

### 2. A `Stop` hook — the one that matters

Block completion when the session changed a resource note but left the index in
`resources/README.md` stale. This is a miniature of the long-horizon problem: *the agent
believes it is done; something outside the agent disagrees and says so.*

```jsonc
"Stop": [{
  "hooks": [{ "type": "command", "command": "node guards/index-fresh.mjs" }]
}]
```

Run into the loop risk deliberately: if the hook blocks and the agent cannot fix
the cause, you get a stall. Guards must be **satisfiable and specific**. Note
what happens in `runs/`.

### 3. Port board-brainstorm's prose rules to hooks

The four candidates, in value order:

1. **`PostToolUse` on `Write(braindump/*)`** — enforce the status banner and a
   `## Dispositions` section. Currently prose in `braindump/README.md`. Also
   handles the append-only rule with its Dispositions exception, which lesson
   01 couldn't express as a permission.
2. **`Stop`** — if `cards.json` changed this session and the manifest is now
   stale, refuse to finish without saying so. Encodes *"change a card, run the
   chain"* — the rule whose failure is silent.
3. **`PostToolUse` on `Edit(table-edition-sim.mjs)`** — run
   `node table-edition-sim.mjs --rec-list` and surface staleness immediately
   rather than at the next `--rec` run.
4. **`SubagentStop`** — validate that `rules-reader` output matches its declared
   report format. Right now that contract is prose in the agent file and holds
   only because the model cooperates.

Number 4 is the interesting one: **it makes a subagent output contract
structural.** That technique is what lesson 08 needs.

## Failing check

```bash
node .claude/hooks/validate-note.mjs < test/fixtures/bad-note.json
```

Must exit non-zero. A hook nobody has seen fail is a hook you're guessing about
— same discipline as lesson 01.

## Trap

Hooks fire on **harness events, not model intentions.** You can intercept "a
skill was invoked." You cannot intercept "a skill should have been invoked and
wasn't." That negative space is unreachable from the hook layer entirely — it's
what lesson 07's eval exists to measure.

## Extraction note

Strong `dist/` candidates: the hook *templates* (validate-on-write, block-on-
stop) and the success-silent/failures-verbose convention. Repo-specific
validators never generalize.
