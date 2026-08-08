# LEARNINGS — /brainstorm

What running `/brainstorm` has taught about `/brainstorm`. Format and checks:
`node tools/learnings.mjs --check`.

**It has never been run on a real idea.** The entry below is a design question,
not an observation.

## 2026-08-06 · `design` · open
The advocate pair — `idea-man` and `devils-advocate`, spawned unconditionally
and never shown each other's output — is the most expensive part of this skill
and the least evidenced. Two subagent invocations per session, justified by an
argument from R13 rather than by anything observed.

**The question:** does the pair change any outcome? If every session ends
`verdict: gap` and the devil's advocate never talks anyone out of anything, the
pair is theatre and the context isolation is not buying what it costs. The
counter-evidence would be a single session that ended `declined` *because of*
something the advocate raised.

A second thing worth watching: the skill has six phases, and the PRD already
names ritual fatigue as a risk. If the break-the-ritual clause turns out to be
hard to reach in practice, that's a `friction` entry, and four of those trip the
threshold in `tools/learnings.mjs`.
**Account for:** after three or four real sessions, check whether any ended
`declined` on the advocate's argument. If none did, either the isolation isn't
worth two subagents or the advocate's prompt is too soft — and those want
different fixes.

## 2026-08-08 · `fix` · open
Phase 1's capture question is specified as prose, and phase 5 is the only place
`AskUserQuestion` appears. In the first real session that ordering stalled: the
question was asked in prose, went unanswered across two turns while the advocate
pair completed, and the skill's own ordering rule ("capture before positions")
meant two turns were spent holding finished work. The user then said explicitly:
*"Use the AskUserQuestion tool when asking me questions."* Reframed as a
four-option `AskUserQuestion` — one option per provenance tag, each carrying what
that tag would mean for ranking — it was answered immediately and precisely, and
the tag came back `inferred` rather than the `stated` the README warns everything
drifts toward.

**Account for:** phase 1 should specify `AskUserQuestion` with the four
provenance tags as options, not prose. The tags are already a closed set, which
is exactly the shape that tool wants. Keep the prose fallback for when the user
has already volunteered the answer.

## 2026-08-08 · `design` · open
Partial counter-evidence for the 2026-08-06 entry, recorded rather than claimed.
This session ended `declined` — but **not because of the advocate.** The verdict
was driven by the capture answer (`inferred`, "I don't necessarily want
anything"). The devil's advocate did change the session materially: it surfaced
`workshop/spec/skill-contract.md` and `guards/skill-contract.mjs`, which my own
grep had missed, and that discovery — the composition half is already built at
the code tier — is half the stated reason for the decline. So the pair earned its
cost by *retrieval*, not by *persuasion*.

That is a different justification than the R13 argument the skill makes for it.
If the pair keeps paying off by finding files the main context missed, the honest
framing is that it is a parallel search with an adversarial prompt, and the
isolation is buying coverage rather than epistemic independence. Those want
different prompts.

**Account for:** the 2026-08-06 question stays open — one session, and the
decline was over-determined. But start tracking a second thing alongside it: how
often each advocate cites a file the main context never read. If that number is
high and the persuasion number stays zero, rewrite the justification.
