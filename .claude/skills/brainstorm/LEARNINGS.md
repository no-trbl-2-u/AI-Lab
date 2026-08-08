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
