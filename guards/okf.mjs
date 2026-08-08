#!/usr/bin/env node
// Guard: every note in resources/ is a conformant OKF document.
// Exits non-zero and names the specific divergence. No warnings.
//
// OKF: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
//
// ── The one deliberate deviation ────────────────────────────────────────────
// OKF §Conformance says consumers MUST NOT reject a bundle for missing optional
// fields, unknown `type` values, or unknown frontmatter keys. That is correct
// for a format designed to ingest from anywhere, and wrong for this repo, whose
// entire thesis is that prose rules fail silently.
//
// So: STRICT PRODUCER, PERMISSIVE FORMAT. Everything we emit is OKF-conformant
// on the way out — any OKF reader can consume this pool. Everything we accept is
// checked harder than OKF requires on the way in. `.strict()` below is the
// clearest instance: an unknown key is almost always a typo (`tag:` for `tags:`)
// and silently ignoring it is how a queryable field quietly stops being queried.
//
// Run:  node guards/okf.mjs             check the real pool
//       node guards/okf.mjs --fixtures  prove the guard fails when it should

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RES = join(ROOT, 'resources');

// ── schema ──────────────────────────────────────────────────────────────────

// OKF actor convention: <producer>/<version> | human:<id> | process:<id>.
// The `human:` prefix is load-bearing — it's what separates a trust tier the
// reader earned from one an agent asserted.
const Actor = z
  .string()
  .regex(
    /^(human:[\w.@-]+|process:[\w.-]+|[\w.-]+\/[\w.-]+)$/,
    'must be human:<id>, process:<id>, or <producer>/<version>'
  );

const DateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be YYYY-MM-DD');
const Timestamp = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z?$/, 'must be an ISO-8601 timestamp');

const SourceEntry = z.object({
  id: z.string().min(1),
  resource: z.string().min(1).optional(),
  title: z.string().min(1),
  author: Actor.optional(),
  usage_count: z.number().int().nonnegative().optional(),
  last_modified: DateStr.optional(),
});

const VerifiedEntry = z.object({
  by: Actor,
  at: Timestamp,
  // local extension: which pipeline stage produced this verification
  stage: z.enum(['intake', 'explain-back', 'decay-recheck']).optional(),
});

const Evidence = z.object({
  tier: z.enum(['measured', 'asserted', 'anecdotal', 'none']),
  n: z.number().int().positive().nullable().optional(),
  summary: z.string().min(10, 'say what the evidence actually is, not just its tier'),
});

const Conflict = z.object({
  note: z.number().int().positive(),
  section: z.string().min(1),
  nature: z.string().min(10, 'name the nature of the conflict, not just its existence'),
});

const ResourceDoc = z
  .object({
    // --- OKF core ---
    type: z.literal('Resource'),
    title: z.string().min(1),
    description: z.string().min(10, 'one sentence — the thesis, compressed'),
    resource: z.string().url().optional(),
    tags: z.array(z.string().min(1)).min(1, 'at least one tag — this is the search surface'),

    // --- OKF provenance & trust ---
    generated: z.object({ by: Actor, at: Timestamp }),
    verified: z.array(VerifiedEntry).default([]),
    sources: z.array(SourceEntry).default([]),

    // --- OKF lifecycle ---
    status: z.enum(['draft', 'stable', 'deprecated']),
    stale_after: DateStr.optional(),

    // --- local extensions (OKF permits unknown keys; we require these) ---
    id: z.number().int().positive(),
    origin: z.enum(['external', 'synthesis', 'original']),
    tier: z.enum(['core', 'extraction', 'reference']),
    published: z.string().min(4).optional(),
    read: z.string().min(4).optional(),
    evidence: Evidence.optional(),
    gap: z
      .string()
      .regex(/^(G\d+([/,] ?G\d+)*|none — reference)$/, 'must be G<n>, G<n>/G<m>, or "none — reference"')
      .optional(),
    falsifier: z.string().min(10, 'name the observation that would show it is wrong here').optional(),
    conflicts: z.array(Conflict).default([]),
  })
  .strict() // see the deviation note at the top of this file
  .refine((d) => d.origin !== 'external' || !!d.resource, {
    message: 'origin: external requires a `resource` URL',
    path: ['resource'],
  })
  .refine((d) => d.origin === 'external' || d.sources.length > 0, {
    message: 'a synthesis/original note must name what it was assembled from in `sources`',
    path: ['sources'],
  })
  .refine((d) => !!(d.published || d.read), {
    message: 'need `published` (dated source) or `read` (undated source)',
    path: ['published'],
  });

// ── frontmatter ─────────────────────────────────────────────────────────────

const FM = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function split(raw) {
  const m = FM.exec(raw);
  if (!m) return null;
  return { yaml: m[1], body: m[2] };
}

// ── checks ──────────────────────────────────────────────────────────────────

const REQUIRED_SECTIONS = ['## Why it matters', '## Where it lands'];
const WEAK_TIERS = new Set(['anecdotal', 'none']);

function knownGaps() {
  const p = join(ROOT, 'GAPS.md');
  if (!existsSync(p)) return null;
  return new Set([...readFileSync(p, 'utf8').matchAll(/^### (G\d+) — /gm)].map((m) => m[1]));
}

function grandfathered() {
  const p = join(RES, 'deltas', 'GRANDFATHERED.md');
  if (!existsSync(p)) return new Set();
  return new Set(
    [...readFileSync(p, 'utf8').matchAll(/^- `(\d\d-[^`]+\.md)`/gm)].map((m) => m[1])
  );
}

/**
 * Validate one note. Returns an array of human-readable problems.
 * `ctx` carries pool-wide facts so each note can be checked against the others.
 */
function checkNote(file, raw, ctx) {
  const fail = [];
  const at = (msg) => fail.push(`${file}: ${msg}`);

  const parts = split(raw);
  if (!parts) {
    at('no YAML frontmatter — an OKF document opens with a `---` block');
    return fail;
  }

  let data;
  try {
    data = parseYaml(parts.yaml);
  } catch (e) {
    at(`frontmatter is not valid YAML — ${e.message.split('\n')[0]}`);
    return fail;
  }
  if (data === null || typeof data !== 'object') {
    at('frontmatter is empty');
    return fail;
  }

  const parsed = ResourceDoc.safeParse(data);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const path = issue.path.length ? issue.path.join('.') : '(root)';
      at(`${path} — ${issue.message}`);
    }
    return fail; // downstream checks need a valid shape
  }
  const d = parsed.data;

  // id agrees with the filename it is filed under
  const fileId = Number(file.slice(0, 2));
  if (d.id !== fileId) at(`id is ${d.id} but the file is numbered ${fileId}`);

  // gap resolves against the spine
  if (d.gap && d.gap !== 'none — reference' && ctx.gaps) {
    for (const g of d.gap.match(/G\d+/g) ?? []) {
      if (!ctx.gaps.has(g)) at(`gap ${g} is not in GAPS.md — the spine has no such entry`);
    }
  }

  // conflicts point at notes that exist, and never at itself
  for (const c of d.conflicts) {
    if (!ctx.ids.has(c.note)) at(`conflicts references note ${c.note}, which does not exist`);
    if (c.note === d.id) at('conflicts references itself');
  }

  // tier agrees with where README.md files it
  const readmeTier = ctx.readmeTier.get(d.id);
  if (readmeTier && readmeTier !== d.tier) {
    at(`tier is "${d.tier}" but resources/README.md lists it under "${readmeTier}"`);
  }
  if (!readmeTier) at('not listed in resources/README.md — the index is not optional');

  // the eight-point fields that only exist for notes that came through the gate.
  // Grandfathered notes predate the schema; that debt is tracked, not hidden.
  if (!ctx.grandfathered.has(file)) {
    for (const field of ['evidence', 'gap', 'falsifier']) {
      if (d[field] === undefined) {
        at(`${field} is required for a note that came through /intake`);
      }
    }
  }

  // weak evidence carries a citation caveat future-you will need
  if (d.evidence && (WEAK_TIERS.has(d.evidence.tier) || d.evidence.n === 1)) {
    if (!/\*\*Evidence caveat for future citation:\*\*/.test(parts.body)) {
      at(
        `evidence.tier is "${d.evidence.tier}"${d.evidence.n === 1 ? ' (n=1)' : ''} — ` +
          'the body needs an "**Evidence caveat for future citation:**" line'
      );
    }
  }

  // body still carries the prose the frontmatter deliberately does not hold
  for (const s of REQUIRED_SECTIONS) {
    if (!parts.body.includes(s)) at(`body is missing the required section "${s}"`);
  }

  return fail;
}

// ── README tier index ───────────────────────────────────────────────────────

function readmeTiers() {
  const p = join(RES, 'README.md');
  const map = new Map();
  if (!existsSync(p)) return map;
  const src = readFileSync(p, 'utf8');
  const headings = [
    [/^## Core/m, 'core'],
    [/^## Extraction/m, 'extraction'],
    [/^## Reference/m, 'reference'],
  ];
  // Slice the file at each tier heading, then read only the *table rows* in
  // that slice — a note number in the leading cell. Matching every link instead
  // picks up incidental prose references ("see [11](...)") that fall in some
  // other tier's slice and silently overwrite the real answer.
  const marks = headings
    .map(([re, tier]) => ({ tier, idx: src.search(re) }))
    .filter((m) => m.idx >= 0)
    .sort((a, b) => a.idx - b.idx);
  for (let i = 0; i < marks.length; i++) {
    const slice = src.slice(marks[i].idx, marks[i + 1]?.idx ?? src.length);
    for (const m of slice.matchAll(/^\|\s*(\d\d)\s*\|/gm)) {
      map.set(Number(m[1]), marks[i].tier);
    }
  }
  return map;
}

// ── run ─────────────────────────────────────────────────────────────────────

function runPool() {
  const notes = readdirSync(RES)
    .filter((f) => /^\d\d-.*\.md$/.test(f))
    .sort();
  if (!notes.length) {
    console.error('okf guard: resources/ contains no numbered notes');
    process.exit(1);
  }

  const ctx = {
    gaps: knownGaps(),
    grandfathered: grandfathered(),
    readmeTier: readmeTiers(),
    ids: new Set(notes.map((f) => Number(f.slice(0, 2)))),
  };

  const fail = [];
  const stale = [];
  const today = new Date().toISOString().slice(0, 10);

  for (const file of notes) {
    const raw = readFileSync(join(RES, file), 'utf8');
    fail.push(...checkNote(file, raw, ctx));

    // Staleness is REPORTED, never failed. With no `verified` entries anywhere
    // yet, failing on it would make the guard red from birth — and a guard
    // that's always red is a guard you learn to ignore.
    const parts = split(raw);
    if (parts) {
      try {
        const d = parseYaml(parts.yaml);
        if (d?.stale_after && d.stale_after < today) {
          const last = d.verified?.length ? d.verified[d.verified.length - 1].at.slice(0, 10) : 'never';
          stale.push(`${file} — stale since ${d.stale_after}, last verified: ${last}`);
        }
      } catch {
        /* already reported above */
      }
    }
  }

  if (stale.length) {
    console.error(`okf guard: ${stale.length} note(s) past stale_after (report, not failure)\n`);
    for (const s of stale) console.error(`  · ${s}`);
    console.error('');
  }

  if (fail.length) {
    console.error(`okf guard: ${fail.length} problem(s)\n`);
    for (const f of fail) console.error(`  - ${f}`);
    process.exit(1);
  }
  process.exit(0); // success-silent
}

// ── fixtures ────────────────────────────────────────────────────────────────
// A guard nobody has watched fail is a guard nobody knows works.

function runFixtures() {
  const dir = join(ROOT, 'guards', 'fixtures', 'okf');
  if (!existsSync(dir)) {
    console.error(`okf guard: no fixtures at ${dir}`);
    process.exit(1);
  }

  const ctx = {
    gaps: new Set(['G1', 'G5', 'G6']),
    grandfathered: new Set(['02-grandfathered-ok.md']),
    readmeTier: new Map([[1, 'core'], [2, 'core'], [3, 'core'], [4, 'core'], [5, 'core'], [6, 'core'], [7, 'core'], [8, 'core']]),
    ids: new Set([1, 2, 3, 4, 5, 6, 7, 8]),
  };

  // filename → substring that MUST appear in the failure, or null to expect a pass
  const expect = {
    '01-valid.md': null,
    '02-grandfathered-ok.md': null,
    '03-missing-targets.md': 'falsifier is required',
    '04-unknown-key.md': 'Unrecognized key',
    '05-dangling-gap.md': 'is not in GAPS.md',
    '06-dangling-conflict.md': 'does not exist',
    '07-weak-evidence-no-caveat.md': 'Evidence caveat for future citation',
    '08-id-mismatch.md': 'but the file is numbered',
  };

  let bad = 0;
  for (const [file, want] of Object.entries(expect)) {
    const p = join(dir, file);
    if (!existsSync(p)) {
      console.error(`  ✗ ${file} — fixture missing`);
      bad++;
      continue;
    }
    const problems = checkNote(file, readFileSync(p, 'utf8'), ctx);
    const joined = problems.join('\n');

    if (want === null) {
      if (problems.length) {
        console.error(`  ✗ ${file} — expected clean, got:\n${problems.map((x) => `      ${x}`).join('\n')}`);
        bad++;
      } else {
        console.log(`  ✓ ${file} — passes`);
      }
    } else if (!joined.includes(want)) {
      console.error(
        `  ✗ ${file} — expected a failure containing "${want}", got:\n` +
          (problems.length ? problems.map((x) => `      ${x}`).join('\n') : '      (no failure at all)')
      );
      bad++;
    } else {
      console.log(`  ✓ ${file} — fails as intended (${want})`);
    }
  }

  if (bad) {
    console.error(`\nokf guard fixtures: ${bad} fixture(s) did not behave as specified`);
    process.exit(1);
  }
  console.log('\nokf guard fixtures: all behave as specified');
  process.exit(0);
}

process.argv.includes('--fixtures') ? runFixtures() : runPool();
