# 04 — Writing Effective Tools for AI Agents

**Source:** Anthropic Engineering — <https://www.anthropic.com/engineering/writing-tools-for-agents>

## Why it matters

Most MCP servers in the wild are thin auto-generated wrappers over REST
endpoints. This post is the argument for why that's the wrong abstraction: tools
should be designed for an agent's *workflow*, not mirror an API's *resources*.

## Core patterns

### Consolidation
Combine related operations into one tool that matches a task, not an endpoint.
A single `schedule_event` that resolves availability and books beats
`list_users` + `get_availability` + `create_event`. Fewer round trips, fewer
tokens, and — importantly — fewer places for the agent to make a wrong turn.

The test: *does one tool call accomplish one thing a user would ask for?*

### Namespacing
With hundreds of tools across multiple servers, common prefixes disambiguate:
`asana_projects_search`, `jira_search`. Namespacing is cheap and prevents the
most common failure — calling the right-shaped tool on the wrong service.

### Token-efficient responses
- Pagination, filtering, and truncation with sensible defaults.
- **Return semantically meaningful content, not low-level identifiers.** A UUID
  costs tokens and tells the model nothing; a name informs the next decision.
- Offer a `response_format` parameter (`"concise"` | `"detailed"`) so the agent
  can choose its own token/precision tradeoff.

### Error messages are prompts
An error is a turn of the conversation. Opaque codes waste it. Say what was
wrong, what the valid shape is, and what to try instead. A good error message
converts a failed call into a corrected one; a bad one converts it into three
more failed calls.

### The evaluation loop
Build evals from realistic multi-call workflows, read the agent's reasoning
transcripts to see *why* it chose wrong, and iterate on descriptions and schemas
empirically. The post explicitly suggests handing transcripts back to Claude and
asking it to improve the tool definitions.

## Wording notes

This is the resource most directly about wording.

- The tool description is a prompt with a very high read-to-write ratio. It gets
  loaded every turn, forever. Budget words accordingly.
- Describe **when to use** and **when not to use**, not just what it does.
  Disambiguation from neighbouring tools is the highest-value sentence.
- Parameter descriptions carry most of the weight. `limit: number` teaches
  nothing; `limit: max rows to return (default 50, max 1000)` prevents a class
  of failures.
- If two tools need a paragraph each to distinguish, merge them.

## Tensions

- With 03: consolidation via tool design vs. composition via generated code.
  Rule of thumb — small stable tool sets favour consolidation; large sprawling
  ones favour the code-execution approach.

## Where it lands

→ [lab/](../lab/README.md) — reference only

## Related

The tool-layer detail behind 01's "minimal viable tool set" and 06's "take
action" phase.
