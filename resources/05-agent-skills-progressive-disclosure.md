# 05 — Equipping Agents for the Real World with Agent Skills

**Source:** Anthropic Engineering — <https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills>

## Why it matters

Skills are the packaging format for procedural knowledge — the "how we do X
here" that's too specific for the model to know and too long to keep in a system
prompt. This is also the clearest worked example of progressive disclosure.

## The three-level architecture

| Level | Content | When loaded | Cost |
|---|---|---|---|
| **1 — Metadata** | `name` + `description` from YAML frontmatter | Always, at startup | ~dozens of tokens per skill |
| **2 — Body** | Full `SKILL.md` | When the model judges the skill relevant | Hundreds to low thousands |
| **3+ — Bundled files** | `reference.md`, scripts, templates | Only when the body points to them | Unbounded, paid only on use |

The analogy used in the post: a well-organized manual — table of contents, then
chapters, then appendix. The important property is that **level 1 is the only
unconditional cost**, which is what makes a large skill library affordable.

## Skills vs. MCP vs. prompt

- **Prompt / `CLAUDE.md`** — always-on, universal rules. Pay every turn.
- **Skill** — conditional procedural knowledge. Pay on relevance.
- **MCP server** — access to an external system. Pay for capability you don't
  otherwise have.

They compose: a skill often exists to teach the agent *how to use* an MCP
server well.

## Authoring guidance

- **Start with an evaluation, not a document.** Run the agent on representative
  tasks, find where it falls short, write a skill for that gap. Skills written
  ahead of observed need are usually wrong about what's hard.
- **Split when it grows.** If `SKILL.md` gets unwieldy — especially when it
  covers mutually exclusive contexts — split into separate files the body links
  to conditionally.
- **Use code for determinism.** Executable scripts for anything mechanical
  (parsing, extraction, validation); prose for judgment.
- **Iterate from real traces.** Watch how it's actually invoked. When it
  underperforms, hand the transcript back and ask the model to self-reflect on
  what went wrong.

## Wording notes

This is the highest-leverage wording surface in the whole collection, because
`description` is the *only* thing that decides whether the skill fires at all.

- Write `description` for the **trigger**, not for the human reader. It should
  contain the words that will actually appear in a user's request, plus the
  situations that count. "Use when the user mentions X, Y, or asks to Z."
- Include negative triggers when neighbouring skills exist: "Do not use for
  PDFs — use the pdf skill."
- `name` should be a noun-phrase capability, not a verb-phrase action.
- Body wording follows 01's altitude rule: procedures for mechanical steps,
  heuristics for judgment calls.
- Concrete failure mode to test for: a skill that never fires (description too
  narrow / too abstract) and a skill that fires constantly (description too
  broad). Both are wording bugs, not logic bugs.

## Where it lands

→ [Lesson 07 — meta-eval](../workshop/lessons/07-meta-eval/README.md) (trigger accuracy)

## Related

Same mechanism as 03's on-demand tool loading; the packaged form of 02's
"encode every lesson."
