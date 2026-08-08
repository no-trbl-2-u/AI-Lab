#!/usr/bin/env node
// Guard: every candidate in resources/queue/ is accountable to a specific weak
// point, and the queue has not become a graveyard.
// Exits non-zero and names the specific divergence. No warnings.
//
// The queue is where speculative accumulation is *allowed*, precisely because
// nothing in it counts — /intake remains the only door into resources/. Two
// things keep that from turning into a shelf of interesting links:
//
//   `targets`      every candidate names the weak point it exists to attack
//   `stale_after`  candidates decay; an expired one is a failure, not a report
//
// The second differs deliberately from guards/okf.mjs, where staleness is only
// reported. A stale note is a note you haven't re-explained. A stale queue
// entry is the accumulation failure mode arriving on schedule.
//
// Run:  node guards/reinforce.mjs             check the real queue
//       node guards/reinforce.mjs --fixtures  prove it fails when it should

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RES = join(ROOT, 'resources');
const QUEUE = join(RES, 'queue');

// The addressable weak points of a note. `So what` split into three when the
// pool went OKF, so all three are separately targetable.
const POINTS = new Set([
  'thesis',
  'problem',
  'mechanism',
  'evidence',
  'applicability',
  'cost',
  'conflicts',
  'falsifier',
  'gap',
  'implication',
]);

const AXES = ['measured', 'alternative', 'opposing', 'falsifier', 'gap'];

const Actor = z
  .string()
  .regex(
    /^(human:[\w.@-]+|process:[\w.-]+|[\w.-]+\/[\w.-]+)$/,
    'must be human:<id>, process:<id>, or <producer>/<version>'
  );

const Candidate = z
  .object({
    type: z.literal('Resource Candidate'),
    title: z.string().min(1),
    description: z.string().min(10, 'one sentence — what it appears to claim'),
    resource: z.string().url(),
    tags: z.array(z.string().min(1)).default([]),
    // The field that separates a candidate from a bookmark.
    targets: z
      .string()
      .regex(/^(\d\d?#[a-z-]+|G\d+)$/, 'must be NN#<field> (a note weak point) or G<n> (a gap)'),
    axis: z.enum(AXES),
    status: z.enum(['draft', 'stable', 'deprecated']).default('draft'),
    stale_after: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be YYYY-MM-DD'),
    generated: z.object({ by: Actor, at: z.string().min(1) }),
    sources: z
      .array(
        z.object({
          id: z.string().min(1),
          resource: z.string().min(1).optional(),
          title: z.string().min(1),
        })
      )
      .default([]),
  })
  .strict();

const FM = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

const REQUIRED_SECTIONS = ['## Why this is a candidate', '## What would disqualify it'];

function checkCandidate(file, raw, ctx) {
  const fail = [];
  const at = (m) => fail.push(`${file}: ${m}`);

  const m = FM.exec(raw);
  if (!m) {
    at('no YAML frontmatter — a queue entry is an OKF document');
    return fail;
  }

  let data;
  try {
    data = parseYaml(m[1]);
  } catch (e) {
    at(`frontmatter is not valid YAML — ${e.message.split('\n')[0]}`);
    return fail;
  }

  const parsed = Candidate.safeParse(data);
  if (!parsed.success) {
    for (const i of parsed.error.issues) {
      at(`${i.path.length ? i.path.join('.') : '(root)'} — ${i.message}`);
    }
    return fail;
  }
  const d = parsed.data;
  const body = m[2];

  // targets resolves — a candidate accountable to nothing is a bookmark
  if (d.targets.startsWith('G')) {
    if (ctx.gaps && !ctx.gaps.has(d.targets)) {
      at(`targets ${d.targets} is not in GAPS.md`);
    }
  } else {
    const [noteId, field] = d.targets.split('#');
    if (!ctx.notes.has(Number(noteId))) {
      at(`targets note ${noteId}, which does not exist in resources/`);
    }
    if (!POINTS.has(field)) {
      at(`targets field "${field}" is not one of the addressable points (${[...POINTS].join(', ')})`);
    }
  }

  // gap-directed candidates carry the gap axis, and vice versa
  const isGapTarget = d.targets.startsWith('G');
  if (isGapTarget && d.axis !== 'gap') {
    at(`targets a gap but axis is "${d.axis}" — gap-directed candidates use axis: gap`);
  }
  if (!isGapTarget && d.axis === 'gap') {
    at('axis is "gap" but targets a note weak point rather than a gap ID');
  }

  // already decided — never re-litigate a note or a rejection
  if (ctx.poolUrls.has(d.resource)) {
    at(`resource is already a note in resources/ — intaken already, dequeue it`);
  }
  if (ctx.rejectedUrls.has(d.resource)) {
    at(`resource is already in REJECTED.md — rejection is a decision, not a maybe`);
  }

  // decay: a failure here, unlike in the pool
  if (d.stale_after < ctx.today) {
    at(
      `expired ${d.stale_after} — intake it or sweep it to REJECTED.md with ` +
        `"expired in queue — never intaken"`
    );
  }

  for (const s of REQUIRED_SECTIONS) {
    if (!body.includes(s)) at(`body is missing the required section "${s}"`);
  }

  return fail;
}

// ── pool facts ──────────────────────────────────────────────────────────────

function poolContext() {
  const notes = existsSync(RES)
    ? readdirSync(RES).filter((f) => /^\d\d-.*\.md$/.test(f))
    : [];

  const poolUrls = new Set();
  for (const f of notes) {
    const m = FM.exec(readFileSync(join(RES, f), 'utf8'));
    if (!m) continue;
    try {
      const d = parseYaml(m[1]);
      if (d?.resource) poolUrls.add(d.resource);
    } catch {
      /* okf.mjs reports malformed notes; not this guard's job */
    }
  }

  const rejPath = join(RES, 'REJECTED.md');
  const rejectedUrls = new Set();
  if (existsSync(rejPath)) {
    for (const m of readFileSync(rejPath, 'utf8').matchAll(/^- \d{4}-\d{2}-\d{2} — \[.+?\]\((.+?)\)/gm)) {
      rejectedUrls.add(m[1]);
    }
  }

  const gapsPath = join(ROOT, 'GAPS.md');
  const gaps = existsSync(gapsPath)
    ? new Set([...readFileSync(gapsPath, 'utf8').matchAll(/^### (G\d+) — /gm)].map((x) => x[1]))
    : null;

  return {
    notes: new Set(notes.map((f) => Number(f.slice(0, 2)))),
    poolUrls,
    rejectedUrls,
    gaps,
    today: new Date().toISOString().slice(0, 10),
  };
}

// ── run ─────────────────────────────────────────────────────────────────────

function runQueue() {
  if (!existsSync(QUEUE)) {
    console.error(`reinforce guard: ${QUEUE} does not exist`);
    process.exit(1);
  }
  const ctx = poolContext();
  const files = readdirSync(QUEUE).filter((f) => f.endsWith('.md') && f !== 'README.md');

  const fail = [];
  for (const f of files) {
    fail.push(...checkCandidate(f, readFileSync(join(QUEUE, f), 'utf8'), ctx));
  }

  if (fail.length) {
    console.error(`reinforce guard: ${fail.length} problem(s)\n`);
    for (const x of fail) console.error(`  - ${x}`);
    process.exit(1);
  }
  process.exit(0); // success-silent
}

function runFixtures() {
  const dir = join(ROOT, 'guards', 'fixtures', 'reinforce');
  if (!existsSync(dir)) {
    console.error(`reinforce guard: no fixtures at ${dir}`);
    process.exit(1);
  }

  const ctx = {
    notes: new Set([1, 9, 12, 15, 16]),
    poolUrls: new Set(['https://example.com/already-a-note']),
    rejectedUrls: new Set(['https://example.com/already-rejected']),
    gaps: new Set(['G5', 'G6', 'G9']),
    today: '2026-08-05',
  };

  const expect = {
    '01-valid.md': null,
    '02-valid-gap-directed.md': null,
    '03-dangling-target.md': 'does not exist in resources/',
    '04-bad-axis.md': 'axis',
    '05-expired.md': 'expired 2026-01-01',
    '06-already-a-note.md': 'already a note',
    '07-already-rejected.md': 'already in REJECTED.md',
    '08-no-disqualifier.md': 'What would disqualify it',
    '09-axis-target-mismatch.md': 'gap-directed candidates use axis: gap',
  };

  let bad = 0;
  for (const [file, want] of Object.entries(expect)) {
    const p = join(dir, file);
    if (!existsSync(p)) {
      console.error(`  ✗ ${file} — fixture missing`);
      bad++;
      continue;
    }
    const problems = checkCandidate(file, readFileSync(p, 'utf8'), ctx);
    const joined = problems.join('\n');

    if (want === null) {
      if (problems.length) {
        console.error(`  ✗ ${file} — expected clean, got:\n${problems.map((x) => `      ${x}`).join('\n')}`);
        bad++;
      } else console.log(`  ✓ ${file} — passes`);
    } else if (!joined.includes(want)) {
      console.error(
        `  ✗ ${file} — expected a failure containing "${want}", got:\n` +
          (problems.length ? problems.map((x) => `      ${x}`).join('\n') : '      (no failure at all)')
      );
      bad++;
    } else console.log(`  ✓ ${file} — fails as intended (${want})`);
  }

  if (bad) {
    console.error(`\nreinforce guard fixtures: ${bad} fixture(s) did not behave as specified`);
    process.exit(1);
  }
  console.log('\nreinforce guard fixtures: all behave as specified');
  process.exit(0);
}

process.argv.includes('--fixtures') ? runFixtures() : runQueue();
