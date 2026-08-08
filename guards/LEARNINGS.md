# LEARNINGS — guards

What running the guards has taught about the guards. Format and checks:
`node tools/learnings.mjs --check`.

Entries below dated before 2026-08-06 were recovered from commit messages,
which is where they had been sitting — findable only by someone who already
knew to look.

## 2026-08-04 · `fix` · resolved 2026-08-04
`guards/intake.mjs`'s "explainers must open from disk with no network" check
fired on the explainer's own `<a href>` link to the source paper. The rule was
written as "no external URLs" when the thing that actually matters is "no
external *subresources*" — an anchor costs nothing until someone clicks it,
while `src=` and `<link href=>` fetch on load.
**Account for:** a guard phrased against a proxy for the real property will
produce false positives on the first honest case.
**Resolved:** narrowed to `src=`, `<link href=>`, and `@import` only.
`guards/intake.mjs`, commit 483651a.

## 2026-08-06 · `fix` · resolved 2026-08-06
`guards/okf.mjs` derived each note's tier by slicing `resources/README.md` at
its tier headings and attributing every note link inside a slice. The closing
prose section contains "see [11](...)", which falls inside the Reference slice
and silently overwrote note 11's real tier of `core`.
**Account for:** parsing a document by position attributes anything that
happens to sit there, including prose that was never meant as data.
**Resolved:** reads table rows only (`^| NN |`). `guards/okf.mjs`, commit f12ae02.

## 2026-08-06 · `fix` · resolved 2026-08-06
`tools/roadmap.mjs` parsed `GAPS.md`'s "format when one closes" example — a
template inside a code fence — as a real closed gap, and reported `G0 — <what
you couldn't do>` in the generated roadmap as fact.
**Account for:** any tool parsing a markdown document that documents its own
format will read the documentation as data unless fences are stripped first.
**Resolved:** `stripFences()` before parsing, in both `tools/roadmap.mjs` and
`guards/gaps.mjs`.

## 2026-08-06 · `design` · open
**Every guard bug so far was found by reading the output, not by a fixture.**
All three fixes above, plus `guards/gaps.mjs` finding three real defects in
`GAPS.md` on its first run — none of that came from the fixture suites, which
now number 40 cases across four guards.

Fixtures pin failures the author already thought of. They are regression tests,
and they have caught zero novel bugs. The bugs came from running the thing
against real data and looking hard at what came back.
**Account for:** is there a cheap way to surface parser bugs the author didn't
anticipate — property-based checks, round-tripping, or a "parse everything and
show me what you extracted" mode — or is reading the output simply the job, and
should that be written down as the practice rather than hoped for?
