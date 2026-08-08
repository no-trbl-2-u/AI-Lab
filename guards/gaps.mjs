#!/usr/bin/env node
// Guard: GAPS.md is well-formed, and every brainstorm session resolved to
// something. Exits non-zero and names the specific divergence. No warnings.
//
// GAPS.md is the spine — labs are cut from it, resources declare which gap they
// serve, and tools/roadmap.mjs parses it to answer "what's next". Until now it
// had no validation at all, which is how a template inside a code fence came to
// be reported as a real closed gap named G0.
//
// ── What this guard deliberately does NOT check ─────────────────────────────
// Whether a gap is *honestly* tagged. `observed` vs `stated` is the ranking
// signal for the whole repo, and it is a judgment call. A guard that claimed to
// check it would be an LLM grading its own work — resource 12's exact failure
// mode. This checks that a tag is present and from the fixed set, and stops.
// Tag honesty stays a prose rule, and CLAUDE.md says so.
//
// Run:  node guards/gaps.mjs             check the spine and the sessions
//       node guards/gaps.mjs --fixtures  prove it fails when it should

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SESSIONS = join(ROOT, 'brainstorms');

const PROVENANCE = ['stated', 'observed', 'delta', 'inferred'];

// The readiness forms tools/roadmap.mjs knows how to bucket. A gap whose marker
// drifts outside this set doesn't error there — it silently renders as "—",
// which is the kind of quiet degradation this repo exists to make loud.
const READINESS = [
  /\*\*ready now[^*]*\*\*/i,
  /\*\*partly closed\*\*/i,
  /·\s*needs [^·]+/i,
  /·\s*not urgent/i,
  /·\s*low priority/i,
];

// Templates and examples live in fences. Parsing them as real entries is how
// ROADMAP.md came to report a closed gap that never existed.
const stripFences = (s) => s.replace(/^```[\s\S]*?^```/gm, '');

const FM = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

// ── the spine ───────────────────────────────────────────────────────────────

function checkGapsDoc(src) {
  const fail = [];
  const clean = stripFences(src);

  const openSection = clean.split(/^## Open$/m)[1]?.split(/^## Not gaps/m)[0] ?? '';
  const closedSection = clean.split(/^## Closed$/m)[1] ?? '';

  if (!openSection.trim()) fail.push('GAPS.md has no "## Open" section');

  const seen = new Map();

  for (const block of openSection.split(/^### /m).slice(1)) {
    const head = /^(G\d+) — (.+)$/m.exec(block);
    if (!head) {
      fail.push(`open entry has a malformed heading: "### ${block.split('\n')[0].trim()}" — expected "### G<n> — <title>"`);
      continue;
    }
    const [, id, title] = head;
    const at = (m) => fail.push(`${id} — ${m}`);

    if (seen.has(id)) at(`duplicate id (also "${seen.get(id)}")`);
    seen.set(id, title.trim());

    const metaLine = block.split('\n').slice(1).find((l) => l.trim()) ?? '';

    // 3. provenance
    const tags = [...metaLine.matchAll(/`([a-z]+)`/g)].map((m) => m[1]).filter((t) => PROVENANCE.includes(t));
    if (!tags.length) {
      at(`no provenance tag — expected at least one of ${PROVENANCE.map((t) => `\`${t}\``).join(', ')} on the line under the heading`);
    }

    // 6. inferred gaps announce themselves
    if (tags.includes('inferred') && !/\*\*unverified\*\*/i.test(metaLine) && !/\*\*This is my inference/i.test(block)) {
      at('is tagged `inferred` but carries no **unverified** marker — an unverified hypothesis must not read like a finding');
    }

    // 5. readiness parses
    if (!READINESS.some((re) => re.test(metaLine))) {
      at(`readiness marker is missing or unrecognised — tools/roadmap.mjs would render this as "—". Use **ready now**, **partly closed**, "needs …", "not urgent", or "low priority"`);
    }

    // 4. a closing condition
    if (!/\*\*Closed when:\*\*/.test(block)) {
      at('has no **Closed when:** clause — a gap you would not recognise as closed is a topic, not a gap');
    }

    // 9. destinations that look like repo paths resolve
    for (const m of block.matchAll(/\]\((?!https?:)([^)#]+)(?:#[^)]*)?\)/g)) {
      const target = m[1].trim();
      if (!existsSync(join(ROOT, target))) {
        at(`links to ${target}, which does not exist`);
      }
    }
  }

  // 2. contiguity — a hole means an entry was deleted rather than closed
  const ids = [...seen.keys()].map((g) => Number(g.slice(1))).sort((a, b) => a - b);
  for (let i = 0; i < ids.length; i++) {
    if (ids[i] !== i + 1) {
      fail.push(
        `gap ids are not contiguous — expected G${i + 1}, found G${ids[i]}. ` +
          `A gap that stops feeling urgent is deferred, not deleted.`
      );
      break;
    }
  }

  // 7. closed gaps carry the date and the check that proves it
  for (const block of closedSection.split(/^### /m).slice(1)) {
    const head = /^(G\d+) — (.+)$/m.exec(block);
    if (!head) continue;
    const id = head[1];
    if (!/Closed \d{4}-\d{2}-\d{2}/.test(block)) {
      fail.push(`${id} is in "## Closed" without a "Closed YYYY-MM-DD" date`);
    }
    if (!/Verified by /i.test(block)) {
      fail.push(`${id} is closed but names no verification — "Verified by <the check that proves it>"`);
    }
  }

  return fail;
}

// ── brainstorm sessions ─────────────────────────────────────────────────────

const Actor = z
  .string()
  .regex(/^(human:[\w.@-]+|process:[\w.-]+|[\w.-]+\/[\w.-]+)$/, 'must be human:<id>, process:<id>, or <producer>/<version>');

const Session = z
  .object({
    type: z.literal('Brainstorm Session'),
    title: z.string().min(1),
    description: z.string().min(10, 'one sentence — the design problem underneath'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be YYYY-MM-DD'),
    verdict: z.enum(['gap', 'declined', 'resource-question', 'deferred']),
    gap: z.string().regex(/^G\d+$/).optional(),
    provenance: z.enum(PROVENANCE).optional(),
    reason: z.string().min(10).optional(),
    cites: z.array(z.number().int().positive()).default([]),
    // Set when the session came from `/brainstorm` with no argument, which
    // pulls the oldest open `design` learning. Closes the loop: a learning
    // becomes a gap becomes a lab. Format: <unit>:<YYYY-MM-DD>.
    from_learning: z
      .string()
      .regex(/^[\w/-]+:\d{4}-\d{2}-\d{2}$/, 'must be <unit>:<YYYY-MM-DD>, e.g. /reinforce:2026-08-06')
      .optional(),
    generated: z.object({ by: Actor, at: z.string().min(1) }),
  })
  .strict()
  .refine((d) => d.verdict !== 'gap' || !!d.gap, {
    message: 'verdict is `gap` but no `gap:` id is named — the whole point is that a brainstorm resolves to a spine entry',
    path: ['gap'],
  })
  .refine((d) => d.verdict !== 'gap' || !!d.provenance, {
    message: 'verdict is `gap` but no `provenance:` — an untagged gap cannot be ranked',
    path: ['provenance'],
  })
  .refine((d) => d.verdict !== 'declined' || !!d.reason, {
    message: 'verdict is `declined` but no `reason:` — an unrecorded rejection gets re-litigated',
    path: ['reason'],
  });

function checkSession(file, raw, ctx) {
  const fail = [];
  const at = (m) => fail.push(`${file}: ${m}`);

  const m = FM.exec(raw);
  if (!m) {
    at('no YAML frontmatter — a session record is an OKF document');
    return fail;
  }

  let data;
  try {
    data = parseYaml(m[1]);
  } catch (e) {
    at(`frontmatter is not valid YAML — ${e.message.split('\n')[0]}`);
    return fail;
  }

  const parsed = Session.safeParse(data);
  if (!parsed.success) {
    for (const i of parsed.error.issues) at(`${i.path.length ? i.path.join('.') : '(root)'} — ${i.message}`);
    return fail;
  }
  const d = parsed.data;

  if (d.gap && !ctx.gaps.has(d.gap)) {
    at(`claims to have produced ${d.gap}, which is not in GAPS.md`);
  }
  for (const c of d.cites) {
    if (!ctx.notes.has(c)) at(`cites note ${c}, which does not exist in resources/`);
  }

  return fail;
}

// ── context ─────────────────────────────────────────────────────────────────

function context() {
  const gapsSrc = existsSync(join(ROOT, 'GAPS.md')) ? readFileSync(join(ROOT, 'GAPS.md'), 'utf8') : '';
  const resDir = join(ROOT, 'resources');
  return {
    gaps: new Set([...stripFences(gapsSrc).matchAll(/^### (G\d+) — /gm)].map((m) => m[1])),
    notes: new Set(
      existsSync(resDir)
        ? readdirSync(resDir).filter((f) => /^\d\d-.*\.md$/.test(f)).map((f) => Number(f.slice(0, 2)))
        : []
    ),
  };
}

// ── run ─────────────────────────────────────────────────────────────────────

function run() {
  const gapsPath = join(ROOT, 'GAPS.md');
  if (!existsSync(gapsPath)) {
    console.error('gaps guard: GAPS.md is missing — the repo has no spine');
    process.exit(1);
  }

  const fail = checkGapsDoc(readFileSync(gapsPath, 'utf8'));

  if (existsSync(SESSIONS)) {
    const ctx = context();
    for (const f of readdirSync(SESSIONS).filter((x) => x.endsWith('.md') && x !== 'README.md')) {
      fail.push(...checkSession(f, readFileSync(join(SESSIONS, f), 'utf8'), ctx));
    }
  }

  if (fail.length) {
    console.error(`gaps guard: ${fail.length} problem(s)\n`);
    for (const f of fail) console.error(`  - ${f}`);
    process.exit(1);
  }
  process.exit(0); // success-silent
}

function runFixtures() {
  const dir = join(ROOT, 'guards', 'fixtures', 'gaps');
  if (!existsSync(dir)) {
    console.error(`gaps guard: no fixtures at ${dir}`);
    process.exit(1);
  }

  const ctx = { gaps: new Set(['G1', 'G2']), notes: new Set([1, 9, 12]) };

  // spine fixtures are whole GAPS.md documents; session fixtures are single records
  const spine = {
    'spine-01-valid.md': null,
    'spine-02-bad-heading.md': 'malformed heading',
    'spine-03-no-provenance.md': 'no provenance tag',
    'spine-04-no-closed-when.md': 'no **Closed when:** clause',
    'spine-05-bad-readiness.md': 'readiness marker is missing or unrecognised',
    'spine-06-inferred-unmarked.md': 'carries no **unverified** marker',
    'spine-07-noncontiguous.md': 'not contiguous',
    'spine-08-duplicate-id.md': 'duplicate id',
    'spine-09-fenced-template.md': null,
    'spine-10-closed-no-date.md': 'without a "Closed YYYY-MM-DD" date',
  };
  const sessions = {
    'session-01-valid.md': null,
    'session-02-no-verdict.md': 'verdict',
    'session-03-gap-without-id.md': 'no `gap:` id is named',
    'session-04-declined-without-reason.md': 'no `reason:`',
    'session-05-dangling-gap.md': 'which is not in GAPS.md',
    'session-06-dangling-cite.md': 'does not exist in resources/',
  };

  let bad = 0;
  const report = (file, problems, want) => {
    const joined = problems.join('\n');
    if (want === null) {
      if (problems.length) {
        console.error(`  ✗ ${file} — expected clean, got:\n${problems.map((x) => `      ${x}`).join('\n')}`);
        return 1;
      }
      console.log(`  ✓ ${file} — passes`);
      return 0;
    }
    if (!joined.includes(want)) {
      console.error(
        `  ✗ ${file} — expected a failure containing "${want}", got:\n` +
          (problems.length ? problems.map((x) => `      ${x}`).join('\n') : '      (no failure at all)')
      );
      return 1;
    }
    console.log(`  ✓ ${file} — fails as intended (${want})`);
    return 0;
  };

  for (const [file, want] of Object.entries(spine)) {
    const p = join(dir, file);
    if (!existsSync(p)) {
      console.error(`  ✗ ${file} — fixture missing`);
      bad++;
      continue;
    }
    bad += report(file, checkGapsDoc(readFileSync(p, 'utf8')), want);
  }
  for (const [file, want] of Object.entries(sessions)) {
    const p = join(dir, file);
    if (!existsSync(p)) {
      console.error(`  ✗ ${file} — fixture missing`);
      bad++;
      continue;
    }
    bad += report(file, checkSession(file, readFileSync(p, 'utf8'), ctx), want);
  }

  if (bad) {
    console.error(`\ngaps guard fixtures: ${bad} fixture(s) did not behave as specified`);
    process.exit(1);
  }
  console.log('\ngaps guard fixtures: all behave as specified');
  process.exit(0);
}

process.argv.includes('--fixtures') ? runFixtures() : run();
