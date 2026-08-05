#!/usr/bin/env node
// Generates ROADMAP.md — the single "what's next" view, derived from the five
// places work is actually tracked.
//
// ROADMAP.md is NEVER hand-edited. A hand-maintained index would be a sixth
// list that goes stale; a derived one cannot lie about its sources. `--check`
// regenerates and diffs, so "I forgot to update it" is loud instead of silent.
//
// Deliberately no timestamp in the output: a generated file that changes on
// every run can't be staleness-checked, which would defeat the whole point.
//
// Run:  node tools/roadmap.mjs           write ROADMAP.md
//       node tools/roadmap.mjs --check   fail if ROADMAP.md is out of date

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), 'utf8') : '');

// Fenced blocks hold *templates* — GAPS.md's "format when one closes" example
// contains a literal `### G0 — <what you couldn't do>`. Parsing it as a real
// closed gap is how a generated file starts reporting fiction.
const stripFences = (s) => s.replace(/^```[\s\S]*?^```/gm, '');

// ── sources ─────────────────────────────────────────────────────────────────

/** GAPS.md — the spine. Each gap: id, title, provenance tags, readiness, link. */
function gaps() {
  const src = stripFences(read('GAPS.md'));
  const open = [];
  const closed = [];

  const openSection = src.split(/^## Open$/m)[1]?.split(/^## Not gaps/m)[0] ?? '';
  const closedSection = src.split(/^## Closed$/m)[1] ?? '';

  for (const block of openSection.split(/^### /m).slice(1)) {
    const head = /^(G\d+) — (.+)$/m.exec(block);
    if (!head) continue;
    // the metadata line is the first non-empty line after the heading
    const metaLine = block.split('\n').slice(1).find((l) => l.trim()) ?? '';
    open.push({
      id: head[1],
      title: head[2].trim(),
      provenance: [...metaLine.matchAll(/`([a-z]+)`/g)].map((m) => m[1]),
      // "**ready now**", "**partly closed**", "needs G2 + G4", "not urgent", …
      readiness:
        /\*\*(ready now[^*]*)\*\*/i.exec(metaLine)?.[1]?.trim() ??
        /\*\*(partly closed)\*\*/i.exec(metaLine)?.[1]?.trim() ??
        /·\s*(needs [^·]+)/i.exec(metaLine)?.[1]?.trim() ??
        /·\s*(not urgent|low priority)/i.exec(metaLine)?.[1]?.trim() ??
        '—',
      link: /→ \[([^\]]+)\]\(([^)]+)\)/.exec(metaLine)?.[2] ?? null,
      linkText: /→ \[([^\]]+)\]\(([^)]+)\)/.exec(metaLine)?.[1] ?? null,
    });
  }

  for (const m of closedSection.matchAll(/^### (G\d+) — (.+)$/gm)) {
    closed.push({ id: m[1], title: m[2].trim() });
  }
  return { open, closed };
}

/** PIPELINE.md build order — the repo's own tooling. Not gaps. */
function buildOrder() {
  const src = read('PIPELINE.md').split(/^## Build order$/m)[1] ?? '';
  const items = [];
  for (const m of src.matchAll(/^(\d)\.\s+\*\*(.+?)\*\*\s+—\s+([\s\S]*?)(?=^\d\.\s+\*\*|^##|\Z)/gm)) {
    const body = m[3];
    // "Not built" must be tested first — it contains "built".
    const status = /\*\*Not built\.?\*\*/i.test(body)
      ? 'not built'
      : /\*\*Built\*\*/i.test(body) || /\bdone\b/i.test(body)
        ? 'built'
        : 'unknown';
    items.push({ n: m[1], name: m[2].replace(/`/g, ''), status });
  }
  return items;
}

/**
 * Two forms are in use across the labs: an inline `**Current position:** …`
 * field, and a `## Current position` section. Accept both rather than forcing
 * every lab to be rewritten to match whichever one this parser happened to
 * see first.
 */
function currentPosition(src) {
  const inline = /^\*\*Current position:\*\*\s*(.+)$/m.exec(src);
  if (inline) return inline[1].trim();

  const section = src.split(/^## Current position\s*$/m)[1];
  if (section) {
    const text = section
      .split(/^## /m)[0]
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .join(' ');
    if (text) return text;
  }
  return 'no current position recorded';
}

// Each lab's ROADMAP.md — committed builds and where each one actually is.
function labs() {
  const dir = join(ROOT, 'lab');
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const rm = `lab/${name}/ROADMAP.md`;
    if (!existsSync(join(ROOT, rm))) continue;
    const src = read(rm);
    const pos = currentPosition(src);
    // Count the phase files themselves rather than table rows — the table is a
    // presentation choice each lab makes differently; the directory is not.
    const phaseDir = join(dir, name, 'phases');
    const phases = existsSync(phaseDir)
      ? readdirSync(phaseDir).filter((f) => /^\d\d\.md$/.test(f)).length
      : 0;
    out.push({ name, position: pos.replace(/\*\*/g, ''), phases });
  }
  return out;
}

/** workshop/lessons — the curriculum. Fixed sequence, separate track from labs. */
function lessons() {
  const dir = join(ROOT, 'workshop', 'lessons');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((d) => /^\d\d-/.test(d))
    .sort()
    .map((d) => {
      const title = /^#\s+(.+)$/m.exec(read(`workshop/lessons/${d}/README.md`))?.[1] ?? d;
      return { dir: d, title: title.trim() };
    });
}

/** resources/ — debt that is now queryable because the pool is OKF. */
function poolDebt() {
  const dir = join(ROOT, 'resources');
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter((f) => /^\d\d-.*\.md$/.test(f));
  let noEvidence = 0;
  let unverified = 0;
  for (const f of files) {
    const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(join(dir, f), 'utf8'));
    if (!m) continue;
    try {
      const d = parseYaml(m[1]);
      if (!d?.evidence) noEvidence++;
      if (!d?.verified?.length) unverified++;
    } catch {
      /* okf.mjs reports malformed notes */
    }
  }
  const queueDir = join(dir, 'queue');
  const queued = existsSync(queueDir)
    ? readdirSync(queueDir).filter((f) => f.endsWith('.md') && f !== 'README.md').length
    : 0;
  return { total: files.length, noEvidence, unverified, queued };
}

// ── render ──────────────────────────────────────────────────────────────────

function render() {
  const { open, closed } = gaps();
  const build = buildOrder();
  const lab = labs();
  const lesson = lessons();
  const debt = poolDebt();

  const isReady = (g) => /^ready now/i.test(g.readiness);
  const isBlocked = (g) => /^needs /i.test(g.readiness);
  const strongest = (g) =>
    g.provenance.includes('observed') ? 'observed' : g.provenance.includes('stated') ? 'stated' : g.provenance[0] ?? '—';

  const L = [];
  L.push('# Roadmap');
  L.push('');
  L.push('<!-- GENERATED by tools/roadmap.mjs — do not edit. Run `npm run roadmap`. -->');
  L.push('');
  L.push('The single "what\'s next" view. Derived from `GAPS.md`, `PIPELINE.md`\'s');
  L.push('build order, `lab/*/ROADMAP.md`, and `resources/` frontmatter — each of which');
  L.push('stays the source of truth for its own kind of thing. Edit those, not this.');
  L.push('');
  L.push('**Provenance is the ranking signal.** `observed` gaps came from a session that');
  L.push('actually failed; `stated` ones came from a sentence; `inferred` ones are my');
  L.push('hypotheses and unverified. Build against the top of that order.');
  L.push('');

  // --- ready now
  L.push('## Ready now');
  L.push('');
  const ready = open.filter(isReady);
  if (!ready.length) L.push('*Nothing unblocked.*');
  else {
    L.push('| Gap | What you can\'t do | Provenance | Lands in |');
    L.push('|---|---|---|---|');
    for (const g of ready) {
      const where = g.link ? `[${g.linkText}](${g.link})` : '—';
      L.push(`| **${g.id}** | ${g.title} | \`${strongest(g)}\` | ${where} |`);
    }
  }
  L.push('');

  // --- blocked
  L.push('## Blocked');
  L.push('');
  const blocked = open.filter(isBlocked);
  if (!blocked.length) L.push('*Nothing blocked.*');
  else {
    L.push('| Gap | What you can\'t do | Waiting on |');
    L.push('|---|---|---|');
    for (const g of blocked) L.push(`| **${g.id}** | ${g.title} | ${g.readiness} |`);
  }
  L.push('');

  // --- the rest
  const rest = open.filter((g) => !isReady(g) && !isBlocked(g));
  if (rest.length) {
    L.push('## Also open');
    L.push('');
    L.push('| Gap | What you can\'t do | Note |');
    L.push('|---|---|---|');
    for (const g of rest) L.push(`| ${g.id} | ${g.title} | ${g.readiness} |`);
    L.push('');
  }

  // --- in flight
  L.push('## In flight');
  L.push('');
  if (!lab.length) L.push('*No labs.*');
  else {
    L.push('| Lab | Phases | Current position |');
    L.push('|---|---|---|');
    for (const l of lab) L.push(`| [${l.name}](lab/${l.name}/PRD.md) | ${l.phases} | ${l.position} |`);
  }
  L.push('');

  // --- pipeline tooling
  L.push('## Pipeline tooling');
  L.push('');
  L.push('Not gaps — a gap is something *you* can\'t do. These are the repo\'s own stages.');
  L.push('');
  L.push('| # | Stage | Status |');
  L.push('|---|---|---|');
  for (const b of build) {
    const mark = b.status === 'built' ? '✅ built' : b.status === 'not built' ? '⬜ not built' : '· unknown';
    L.push(`| ${b.n} | ${b.name} | ${mark} |`);
  }
  L.push('');

  // --- debt
  if (debt) {
    L.push('## Debt');
    L.push('');
    L.push('Counted from frontmatter, so it cannot drift from the pool it describes.');
    L.push('');
    L.push(`- **${debt.noEvidence} of ${debt.total} notes carry no \`evidence\` tier.** They predate the`);
    L.push('  intake gate (`resources/deltas/GRANDFATHERED.md`). Concrete cost: `/reinforce`\'s');
    L.push(`  \`measured\` and \`falsifier\` axes can only see the other ${debt.total - debt.noEvidence}.`);
    L.push(`- **${debt.unverified} of ${debt.total} notes have never been explained back.** \`verified: []\``);
    L.push('  everywhere means PIPELINE stage 5 has not run on the pool once.');
    L.push(`- **${debt.queued} candidate(s) in \`resources/queue/\`.** They expire 30 days after queueing.`);
    L.push('');
  }

  // --- curriculum
  L.push('## Curriculum');
  L.push('');
  L.push('A separate track from labs: a lesson builds a harness *layer*, a lab doesn\'t.');
  L.push('');
  for (const l of lesson) L.push(`- [${l.title}](workshop/lessons/${l.dir}/README.md)`);
  L.push('');

  // --- closed
  L.push('## Closed');
  L.push('');
  if (!closed.length) L.push('*No gap has been closed yet.*');
  else for (const g of closed) L.push(`- **${g.id}** — ${g.title}`);
  L.push('');

  return L.join('\n');
}

// ── run ─────────────────────────────────────────────────────────────────────

const out = render();
const target = join(ROOT, 'ROADMAP.md');

if (process.argv.includes('--check')) {
  const current = existsSync(target) ? readFileSync(target, 'utf8') : '';
  if (current !== out) {
    console.error('roadmap guard: ROADMAP.md is out of date with its sources.\n');
    console.error('  Run `npm run roadmap` and commit the result.\n');
    // show the first divergence so the cause is obvious
    const a = current.split('\n');
    const b = out.split('\n');
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i] !== b[i]) {
        console.error(`  first difference at line ${i + 1}:`);
        console.error(`    on disk:   ${a[i] ?? '(end of file)'}`);
        console.error(`    generated: ${b[i] ?? '(end of file)'}`);
        break;
      }
    }
    process.exit(1);
  }
  process.exit(0); // success-silent
}

writeFileSync(target, out);
console.log(`roadmap: wrote ROADMAP.md`);
