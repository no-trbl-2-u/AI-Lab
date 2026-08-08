# AI-Lab

A lab for learning harness engineering by building harnesses. **The deliverable
is understanding, not artifacts** — a phase completed without understanding is a
failed phase regardless of whether the code works.

[`GAPS.md`](GAPS.md) is the spine. [`PIPELINE.md`](PIPELINE.md) is how material
becomes work. [`ROADMAP.md`](ROADMAP.md) is the generated "what's next" view —
**never edit it**; edit its sources and run `npm run roadmap`.

---

## Answering from the knowledge layer

Before answering anything `resources/` might cover: read the index, then read
the notes that bear on it. Cite by number and section — `R09 §kv-cache` — never
by vibe.

The pool is OKF, so its weak points are one `grep` over frontmatter rather than
sixteen file reads:

```bash
grep -l 'tier: asserted' resources/*.md      # what is unmeasured
grep -l '^gap: .*G5' resources/*.md          # what serves a given gap
grep -A2 '^conflicts:' resources/*.md        # where the pool disagrees with itself
```

**If the question has a determinate answer and the pool is silent:** stop. Say
the pool is silent, name what you'd have needed, and offer `/reinforce`. Do not
backfill from training data, and never present an unsourced answer in the same
register as a sourced one.

**If the question is open** — a design call, an unsettled trade-off — say that
first, then give two to four positions with the condition that would make each
one right. Label them positions, not findings.

The last clause does the real work. The failure isn't guessing; it's guessing in
a confident voice.

## Teaching

`PIPELINE.md` stage 5 is the methodology, and it inverts the obvious one:
**capture what the reader already thinks before explaining anything.** A
well-explained answer that skips the predict-then-diff loop damages the point of
the repo, however good the explanation is.

So: for a question about something in `workshop/` or `lab/`, ask what they
expect before you tell them. Prediction precedes observation — it's
[R13](resources/13-epistemic-sandboxing.md), turned on the learner.

## Building

- **A gap before a lab.** Labs are cut from `GAPS.md`, not from whatever
  resource was interesting this week. Check the provenance tag: `observed` is
  strong, `stated` is weaker, `inferred` is a hypothesis.
- **Every build phase declares a failing check** at decomposition time. A phase
  that can't fail is a reading task — label it and move on.
- **Guards over prose.** If a rule's violation would be silent, it wants to be
  code. That's what this repo exists to practise.

```bash
npm run guard   # okf schema + fixtures + intake residue
```

---

## What in this file is actually enforced

Per [lesson 00](workshop/lessons/00-enforcement-map/README.md) — and because
[G1](GAPS.md) is precisely "can't say which rules are enforced vs. merely
requested," a `CLAUDE.md` that doesn't classify its own rules would be the gap
wearing a new hat.

| Rule | Tier | Failure is |
|---|---|---|
| Every phase declares a failing check | **code** — `guards/skill-contract.mjs` | loud |
| Notes are OKF, gaps and conflicts resolve | **code** — `guards/okf.mjs` | loud |
| Candidates name a target, queue decays | **code** — `guards/reinforce.mjs` | loud |
| `ROADMAP.md` agrees with its sources | **code** — `tools/roadmap.mjs --check` | loud |
| Gaps are well-formed, sessions resolve | **code** — `guards/gaps.mjs` | loud |
| **A gap's provenance tag is _honest_** | **prose** | **silent** |
| Nothing enters `resources/` but through `/intake` | **harness** — skill gate | loud-ish |
| **Check `resources/` before answering** | **prose** | **silent** |
| **Capture the prediction before explaining** | **prose** | **silent** |
| A gap before a lab | **prose** | silent |

The two bolded rows are the ones that matter most and hold least. Nothing
detects an answer that skipped the pool and came from training data, and
[R12](resources/12-long-horizon-control.md) is explicit that self-audit can't be
requested from inside the prompt — so asking me to police myself here is not a
fix.

Three things make compliance likelier without pretending it's enforced:
retrieval is cheap (one `grep`), the failure branch terminates in an action
(`/reinforce`) rather than an apology, and citations name a note and section, so
an **uncited answer is conspicuous** even though nothing blocks it.

That last one is the real mechanism: not a gate, but a convention that makes the
violation legible to a reader who cares. If you notice an uncited claim about
harness design in my answers, that's the rule failing — say so.
