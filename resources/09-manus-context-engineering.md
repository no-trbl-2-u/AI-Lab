# 09 — Context Engineering for AI Agents: Lessons from Building Manus

**Source:** Manus — <https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus>
**Published:** 2025-07

## Why it matters

The most operational resource in this collection — six lessons from shipping a
production agent, several of which are counter-intuitive and none of which you'd
derive from first principles. Where 01 gives vocabulary, this gives tactics.

## The six lessons

### 1. Design around the KV-cache
> "KV-cache hit rate is the single most important metric for a production-stage
> AI agent."

Agents have roughly a **100:1 input-to-output token ratio** — nothing like chat.
Cached input tokens cost ~10× less than uncached. Therefore:

- **Keep the prompt prefix byte-stable.** A timestamp in the system prompt
  invalidates the cache for the entire session. One token changed early
  invalidates everything after it.
- **Make context append-only.** Never edit or reorder past actions and
  observations.
- Ensure deterministic serialization (JSON key ordering!).

This single lesson has more cost impact than any other item in this repo.

### 2. Mask, don't remove
Don't add/remove tool definitions mid-session — it invalidates the cache and
leaves past observations referring to tools that no longer exist, which confuses
the model badly. Instead, **mask token logits during decoding** to constrain the
available action space, keeping the definitions stable. Response prefill achieves
the same effect at the API layer.

### 3. Use the file system as context
Storage is the ultimate context: unlimited, persistent, directly operable by the
agent. Externalize memory into files the agent reads and writes on demand.

Critical detail: **compression must be reversible.** Drop a web page's content
but keep its URL; drop a file's body but keep its path. Then nothing is truly
lost — only deferred.

### 4. Manipulate attention through recitation
Manus maintains a `todo.md` and rewrites it as it works. This pushes the global
plan into the *most recent* attention span on every step, fighting drift and the
lost-in-the-middle effect on long task sequences.

It is a deliberate exploit of recency bias, not just bookkeeping.

### 5. Keep the wrong stuff in
The counter-intuitive one. **Leave failed actions and error traces in context.**
Seeing its own failure shifts the model's priors away from repeating it. Cleaning
up errors removes the evidence the model needs to recover, and is a common cause
of infinite retry loops.

### 6. Don't get few-shotted
Uniform context patterns cause the model to fall into rhythm and keep doing what
it's been doing, past the point of correctness. Introduce **structured variation**
in serialization and phrasing to break the pattern on repetitive tasks.

## Wording notes

- Never put anything volatile (timestamps, random IDs, changing counts) near the
  top of a system prompt or `CLAUDE.md`. Put stable content first, volatile
  content last.
- Lesson 6 is a warning about your own prompt files: if every example in
  `CLAUDE.md` has the same shape, the agent will produce that shape even when
  it's wrong.

## Tensions

- Lesson 5 (keep errors in) is in direct tension with 10's factor 9 (compact
  errors into the context window) — and with naive compaction generally. The
  synthesis: keep the *fact and shape* of the error; compact its volume.

## Where it lands

→ [Lesson 07 — meta-eval](../workshop/lessons/07-meta-eval/README.md) (cache baseline)
