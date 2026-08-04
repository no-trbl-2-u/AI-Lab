# 03 — Code Execution with MCP: Building More Efficient Agents

**Source:** Anthropic Engineering — <https://www.anthropic.com/engineering/code-execution-with-mcp>
**Published:** 2025-11-04

## Why it matters

The most concrete demonstration in this collection that *how you expose
capability* matters more than *what capability you expose*. Same MCP servers,
same task, ~98.7% fewer tokens — purely by changing the interface from tool
calls to a code API.

## The problem

Direct MCP tool calling has two compounding costs:

1. **Tool definition bloat.** Every connected server's full tool schema sits in
   context from turn zero, whether used or not. Hundreds of tools is now normal.
2. **Intermediate result pass-through.** Every byte of every tool result flows
   through the model, even when the model only needs a filtered subset. Copying
   a document from Drive to Salesforce means the whole document transits the
   context window twice.

## The pattern

Present each MCP server as a **filesystem of typed code modules** instead of a
tool list. The model writes TypeScript that imports and composes them; the code
runs in a sandbox.

```
servers/
├── google-drive/
│   ├── getDocument.ts
│   └── index.ts
└── salesforce/
    ├── updateRecord.ts
    └── index.ts
```

Each file exports a typed async function wrapping the underlying MCP call.

**Progressive disclosure falls out for free.** The model lists directories and
reads only the tool definitions it needs — a `search_tools` helper with a
detail-level parameter makes the discovery step cheap. The tool catalogue moves
from context into the filesystem.

## What this unlocks

- **Context-efficient filtering** — a 10,000-row sheet gets filtered in the
  sandbox; five rows reach the model.
- **Control flow** — loops, conditionals, retries, and error handling in code
  rather than as a chain of model turns.
- **Privacy** — sensitive data can move between systems without ever entering
  the context window (and therefore without entering logs).
- **State persistence** — intermediate results live in files across steps.
- **Skills** — once the agent finds a working composition, it saves the code and
  imports it later. Discovered capability becomes durable capability.

## Numbers & claims worth remembering

- **150,000 → 2,000 tokens (98.7% reduction)** on a Google Drive → Salesforce
  workflow.
- The related 2026 finding on filesystem-shaped harnesses: Microsoft's SRE agent
  replaced 100+ bespoke tools and prescriptive prompts with plain files plus
  `read_file` / `grep` / `find` / shell, and its "Intent Met" score on novel
  incidents rose from 45% to 75%. Generic tools over a well-shaped filesystem
  beat specialized tools.

## Risks (stated in the post)

Arbitrary code execution needs real sandboxing, resource limits, monitoring, and
audit logging. Prompt injection becomes materially more dangerous when the
injected instruction can execute rather than just call a fixed-schema tool.

## Wording notes

- Tool *module* names are read far more often than tool descriptions.
  `getDocument.ts` inside `google-drive/` needs no prose; a flat
  `google_drive_get_document` tool needs a paragraph.
- Directory structure is documentation. Group by server/domain so the agent can
  navigate by intuition rather than by search.

## Tensions

- Cuts against 04's "consolidate related operations into one tool" — but only
  superficially. 04 is about the *tool-call* interface; here consolidation
  happens in the agent's own code instead.

## Where it lands

→ [lab/ — MCP-as-code](../lab/README.md)

## Related

Is the mechanical implementation of 01's just-in-time retrieval, and shares
progressive disclosure with 05.
