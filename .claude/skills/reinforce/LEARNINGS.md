# LEARNINGS — /reinforce

What running `/reinforce` has taught about `/reinforce`. Format and checks:
`node tools/learnings.mjs --check`.

**It has never been run.** The entry below is therefore a design question rather
than an observation, and it is the first thing a real run should answer.

## 2026-08-06 · `design` · open
The skill's entire premise is one instruction — *search the note's weak points,
not its topic* — implemented as four axes. **None of it has been executed.**

The claim is that weak-point search returns materially different candidates
than topic search. That is currently an assertion by the person who wrote the
skill, which is the weakest possible evidence. The run record was designed to
force a topic-search control and record the overlap as a number precisely
because this was unproven at authoring time.

There is also a known coverage problem: axes `measured` and `falsifier` read
`evidence.tier` and `falsifier` from frontmatter, and notes 01–14 are
grandfathered without either. **Two of sixteen notes are visible to half the
axes.**
**Account for:** run it against note 09 or 15, record the control overlap, and
decide. If the overlap is near-total the axes are decorative and the skill needs
rethinking rather than shipping. Separately: does the grandfathered coverage hole
make the whole skill premature until retrospective intakes are done?
