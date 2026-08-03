# Knowledge deltas

One file per intake: what you knew about a resource *before* reading it, dated.

Two jobs:

1. **Input to `/decompose-resource`.** Phases get cut along your comprehension
   seams instead of the decomposer's model of the material. Without this, a
   phase that defeats you was probably drawn in the wrong place, and splitting
   it further just subdivides a bad cut.
2. **A record of your own understanding over time.** Re-read a delta from three
   months ago and either it's obviously naive — you learned something — or it
   isn't, which is worth knowing too.

## Format

`YYYY-MM-DD-<resource-slug>.md`

```markdown
# <resource> — delta

**Date:** YYYY-MM-DD
**Resource:** resources/NN-slug.md

known:
- <concept you could already act on, not just recognize>

partial:
- <know it matters; can't yet predict, apply, or debug it>

unknown:
- <new>

## Notes
<anything that surprised you, contradicted something you believed, or that you
expect to be wrong about>
```

## Writing a good delta

The useful line is **partial**, not the other two. `known` and `unknown` are
easy and mostly uninteresting; `partial` is where phases get drawn, because
that's the material you can almost use.

Be specific about the boundary. "KV-cache" is not a delta entry. "Know cache
hits matter for cost; can't predict what invalidates a prefix" is — it names
exactly what the phase has to teach.

Honesty here is load-bearing. Overstating `known` produces a roadmap that skips
the phase you actually needed.
