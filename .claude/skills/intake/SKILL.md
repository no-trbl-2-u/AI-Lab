---
name: intake
description: >
  The gate for resources/ — read a candidate resource, capture what the reader
  already knew before discussing it, explain it against a fixed eight-point
  schema, evaluate what it adds to the existing pool, and end with an explicit
  keep-or-ignore decision plus written residue.
  Use when the user says "/intake", "intake this", "look at this article",
  "should we keep this", "here's a resource", "break this apart", or pastes a
  URL or file path to an article, paper, blog post, or docs page they are
  considering adding to the repo.
---

# /intake — the gate for `resources/`

Nothing enters `resources/` without passing through here. See
[PIPELINE.md](../../../PIPELINE.md) for where this sits.

Three products:

1. An **understanding** — the resource explained against a fixed schema, so the
   decision is informed rather than impressionistic.
2. A **decision** — keep or ignore, never a maybe.
3. A **knowledge delta** — what the reader knew *before* reading. The input
   `/decompose-resource` needs to cut phases at their comprehension seams
   rather than at mine.

---

## The eight points

Every resource gets explained against the same schema. Fixed, so notes are
comparable and so gaps become visible — **a point the article doesn't address
is itself information**, usually about how far you can trust it.

Four of the eight land in the note's YAML frontmatter (`evidence`, `conflicts`,
and `So what`'s gap and falsifier) because downstream tooling reads them as
data — `/reinforce` searches a note's weak points by looking them up rather than
by parsing prose. The other four stay in the body table. See § House format.

### What it says

1. **Thesis** — the claim, in one sentence. If it takes three, say so; an
   article whose thesis won't compress is usually bundling several.
2. **Problem** — what breaks without this. Grounds the thesis in a failure
   someone actually has.
3. **Mechanism** — *how* it works, concretely enough to build from. "Use
   context engineering" is not a mechanism; "hold identifiers, fetch bodies at
   runtime" is. If you can't state the mechanism, the article is advocacy.

### How much to believe it

4. **Evidence** — with numbers and conditions, labelled:
   `measured` (ran an experiment, reported n) · `asserted` (claimed from
   practice, no data) · `anecdotal` (one story) · `none`.
   Most writing in this space is *asserted*. That's not disqualifying, but it
   must be labelled, because the note will outlive your memory of how solid it
   was.
5. **Applicability** — when it holds, and when it doesn't. Scale, task shape,
   model, cost tolerance. Boundaries are almost never stated, so mark yours
   `inferred`.
6. **Cost** — tokens, latency, complexity, maintenance, new failure modes.
   Nothing is free, and articles rarely price their own advice.

### What it means for us

7. **Conflicts** — against this pool by note number and section, and against
   the wider field. A new contradiction is worth more than a new agreement —
   the pool's existing tensions (01 vs. 08, 09 §5 vs. 10 §factor-9) are
   load-bearing.
8. **So what** — three parts: **the gap it touches** (an ID from
   [`GAPS.md`](../../../GAPS.md), or `none — reference`), what we'd do
   differently if it's true, and **what observation would show it's wrong here.**

   The gap ID is what keeps the pool from becoming a shelf of interesting
   things — a resource that touches no gap is still keepable, but only as
   reference, and saying so out loud is the whole point. The falsifier is what
   `/decompose-resource` turns into a phase's failing check; an article with no
   answer to it is not actionable.

### Integrity rule

**Separate what the article says from what you inferred.** Points 5 and 6 are
usually absent from the source. Mark every inference `inferred` — a note that
launders my reasoning as the author's claim is worse than no note, because it
can't be checked later.

---

## Phase 0 — Skim, don't read

Fetch the resource. **Skim only** — enough to extract its topic list, not enough
to form an opinion.

Produce **5–8 topics** it actually covers, in the resource's own vocabulary.
Concrete, not categorical: `"prefix caching and what invalidates it"` not
`"performance"`.

Do not summarize. Do not evaluate. Do not hint at what you think.

**Fetching arXiv:** pull `/abs/<id>` for title, authors, date and abstract — the
`/pdf/` fetch extracts headings poorly, but it saves the file locally, and that
copy reads cleanly page-by-page in phase 2. Fetch both in one call.

**The ordering is the methodology.** Explain the resource first and ask what the
reader knew second, and the answer is contaminated — they'll report
understanding acquired ninety seconds earlier and be unable to tell the
difference. Prediction precedes observation, as in
[resource 13](../../../resources/13-epistemic-sandboxing.md).

## Phase 1 — Capture the delta (before any explanation)

Ask the reader to place each topic. `AskUserQuestion`, batched (≤4 per call):

- **known** — could act on it, not just recognize it
- **partial** — know it matters; can't yet predict, apply, or debug it
- **unknown** — new

Then one open follow-up: **what do you expect this resource to say?**

That prediction is the most valuable line in the delta. A wrong expectation
names a belief worth correcting, and phase 2 will measure it.

**"No expectation" is a first-class answer.** A reader who picked the resource
on intrigue rather than a hypothesis has nothing to predict from, and pressing
for a guess manufactures noise. Record `expectation: none — exploratory`, state
the consequence, and move on — **do not ask twice.** The consequence is real
and belongs in the delta: no expectation diff in phase 2, so the placement half
carries all the weight, and phases must be cut smaller because nothing can be
assumed as background.

Write `resources/deltas/YYYY-MM-DD-<slug>.md` **now**, before phase 2.

If the reader has already read the resource, record `retrospective: true` and
treat the delta as lower-confidence.

## Phase 2 — Explain it

Now read it fully. Deliver the overview the reader needs to decide — this is
teaching, not summarizing.

**Structure:** a short orienting paragraph (what kind of thing this is and why
anyone wrote it), then the eight points, then:

**Expectation diff.** Compare against the reader's phase-1 prediction. Name
where they were right, where they were wrong, and where the article answers a
question they didn't think to ask. **Wrong predictions are the best phase
material available** — flag them explicitly for `/decompose-resource`.

Check overlap against the pool before claiming novelty: grep `resources/` for
the topic vocabulary rather than loading all 14 notes. Past ~25 notes, delegate
this to a subagent that returns only the overlap list.

## Phase 3 — Decide

`AskUserQuestion`, recommended option first, with a one-line reason:

- **Keep — core** — closes a real gap; something downstream depends on it
- **Keep — reference** — sound, no current gap; look-up material
- **Ignore** — with the reason
- **Defer** — only if genuinely unjudgeable; must name what would settle it

Don't hedge into "it depends." If the evidence is mixed, say which way you lean.

## Phase 4 — Write the residue

**Kept** → `resources/NN-<slug>.md` in the house format below, plus an entry in
`resources/README.md` under the right tier.

**Ignored** → one line in
[`resources/REJECTED.md`](../../../resources/REJECTED.md):
`- YYYY-MM-DD — [title](url) — <reason>`.

**Either way** → the delta exists from phase 1. Never skipped.

Then:

```bash
npm run guard
```

That runs the OKF schema check, its fixtures, and the intake-residue check.
Neither guard enforces the eight points alone — `okf.mjs` holds the four
frontmatter fields and `intake.mjs` holds the six body rows — so a green run
means both halves are present.

### Always — what this run taught about this skill

If the run exposed something about **`/intake` itself**, append it to
[`LEARNINGS.md`](LEARNINGS.md) next to this file:

```markdown
## YYYY-MM-DD · `kind` · open
<what happened>
**Account for:** <what should change, or what to watch for>
```

`fix` apply directly · `design` a real open question, and what `/brainstorm`
pulls with no argument · `friction` it worked but was tedious.

This step exists because it was already learned the hard way: the first run of
this skill produced four fixes, recorded them in a `## Findings for the skill`
section invented on the spot inside the delta, and **the very next delta didn't
have that section.** A residue convention that lives outside the procedure does
not survive its first author.

**"Nothing new" is a first-class answer** — the same rule as phase 1's "no
expectation", and for the same reason. A run that taught nothing adds nothing.

### House format

Notes are [OKF](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
documents: YAML frontmatter, then the body. The eight points are split across
the two by **query pattern** — you filter on evidence, gap, falsifier and
conflicts, and you read the rest. Nothing appears in both places.

```markdown
---
type: Resource                  # OKF: the only field OKF itself requires
id: <NN>                        # must match the filename
title: <Title>
description: <the thesis, compressed to one sentence>
origin: external                # external | synthesis | original
resource: <url>                 # required when origin is external
tags: [<the resource's own vocabulary — this is the search surface>]
tier: core                      # core | extraction | reference
status: stable                  # draft | stable | deprecated
published: YYYY-MM-DD           # or `read: YYYY-MM` if undated
evidence:
  tier: asserted                # measured | asserted | anecdotal | none
  n: <sample size, or omit>
  summary: <numbers and conditions — not just a restatement of the tier>
gap: <G-id, or `none — reference`>
falsifier: <what observation would show it's wrong here>
conflicts:
  - note: <NN>
    section: <section>
    nature: <the nature of the disagreement>
verified: []                    # stage-5 records land here; empty is honest
generated:
  by: claude/intake-0.1         # OKF actor: <producer>/<version> | human:<id>
  at: <ISO-8601>
sources: []                     # required non-empty when origin isn't external
---

# NN — <Title>

## In brief

| | |
|---|---|
| **Thesis** | <one sentence> |
| **Problem** | <what breaks without it> |
| **Mechanism** | <the actual move> |
| **Applicability** | holds: <…> · not: <…> `inferred` |
| **Cost** | <tokens / latency / complexity / maintenance> |
| **Implication** | <what we'd do differently if it's true> |

## Why it matters
<one paragraph — the reason it's in this repo, not a summary>

## Core patterns
<the reusable ideas, named>

## Numbers & claims worth remembering
<the concrete bits; measured vs. asserted>

## Wording notes
<what this changes in SKILL.md / CLAUDE.md / AGENTS.md>

## Tensions
<where it disagrees with another note here, by number>

## Where it lands
→ <lesson or project link>

## Related
<one or two lines>

<!-- required when Evidence is `anecdotal`, `none`, or n=1 -->
**Evidence caveat for future citation:** <what this may and may not be cited for>
```

## Phase 5 — the explainer (kept resources only)

`resources/explainers/NN-<slug>.html` — a single self-contained page answering
one question: **what is this thing for?**

Not a summary. The note is the summary. This is *first contact* — what you'd
want in front of you before deciding whether to spend a week on the paper, built
for scanning rather than reading.

### Fixed skeleton

Same six sections every time. **The structure is fixed so this stays a
ten-minute job rather than a bespoke design project** — only the content varies.

| | Section | Source |
|---|---|---|
| — | Hero: title, source, one-line thesis | Thesis |
| 01 | The problem it exists to solve | Problem |
| 02 | How it works — **one** diagram | Mechanism |
| 03 | **How much to believe it** | Evidence |
| 04 | The numbers | Evidence |
| 05 | The one thing to remember | the single most reusable finding |
| 06 | What we take from it — take / leave / conflicts | So what, Conflicts |

**Section 03 is non-negotiable and never softened.** A visual explainer makes weak
evidence feel strong — big type and clean diagrams read as authority. The evidence
strip is the counterweight, and it goes *before* the results, not after. Every row
carries an icon and a written tier label, never colour alone.

Sections 01 and 06 use the reader's language, not the paper's. If the paper says
"normative calculus," section 06 says "the ethics engine."

### Build rules

- **Self-contained.** Inline CSS and JS, no external requests, no fonts, no CDN.
  It must open from disk with no network.
- **Theme-aware.** Light and dark, via `prefers-color-scheme` plus a
  `[data-theme]` override.
- **Charts follow the `dataviz` skill.** Load it before writing any chart code
  and run the palette validator — do not eyeball colour.
- **Wide content scrolls in its own container.** The page body never scrolls
  sideways.
- **Every chart gets a table view** behind a `<details>`.
- **Footer states the simplification**: the note has the caveats, the paper has
  the detail.
- **Render it and look at it.** The validator checks colour, not layout. If the
  browser pane won't display, say so rather than claiming it was verified.

### Scope discipline

One diagram in section 02, not four. One chart in section 04, or none if the
paper has no numbers worth plotting. **A paper with no numbers still gets an
explainer** — sections 03 and 04 just say so plainly, which is itself the useful
signal.

---

## Rules

1. **No maybes.** Phase 3 ends in a decision. "Defer" requires naming what
   would settle it, or it's a maybe in a costume.
2. **Cite the pool.** Claims about novelty or duplication name the note and
   section. Impressions are not findings.
3. **Skim before, read after.** Phase 0 is deliberately shallow.
4. **Label evidence and inference.** Every time.
5. **Keeping is not free.** Every kept note costs attention on every future
   visit. The bar is "changes something," not "is correct."
6. **Summaries are not the product.** A note that only summarizes is a link
   with extra steps.
7. **Weak evidence gets a citation caveat.** A note whose Evidence is
   `anecdotal`, `none`, or n=1 closes with an explicit line saying what it may
   and may not be cited for. Future-you will remember the ideas and forget the
   sample size — the caveat is written for them, not for now.

## Failure modes

- **Reader defers to my read.** If phase-1 answers track whatever I emphasized
  in phase 0, the delta is contaminated — I skimmed too loudly. Re-skim.
- **Everything looks new** because I didn't grep the pool first.
- **The eight points come back all-full.** Usually a warning sign, since most
  sources leave applicability and cost unstated. But the real test is
  **provenance, not fullness**: for each point, can I name where in the source
  it came from? If yes, the source is unusually thorough and the fullness is
  earned — some are. If no, I filled a hole with plausible invention. Mark it
  `inferred` or drop it.
- **Paywalled or won't fetch.** Say so, ask for a paste. Never evaluate from
  title and abstract.
- **Out of scope** — model training, fine-tuning, anything below the harness
  layer. Reject at phase 0; don't spend a delta on it.
