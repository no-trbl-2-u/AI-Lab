#!/usr/bin/env node
// LEARNINGS — what a run taught about the thing that ran.
//
// Every runnable unit (skill, agent set, guard set) carries a LEARNINGS.md.
// This validates them, summarises them, and picks the one /brainstorm should
// pull when invoked with no argument.
//
// ── Why this exists, and why it will probably still be hard ────────────────
// The repo already tried this once. Commit bc2b6e3 ("First intake run:
// Springdrift, plus four skill fixes it surfaced") recorded its findings in a
// "## Findings for the skill" section invented on the spot inside a delta file.
// The very next delta doesn't have that section — deltas/README.md never
// documented it and no guard checked for it, so the convention died after one
// use.
//
// This tool cannot fix that. Nothing here detects a run that learned something
// and recorded nothing; that needs a Stop hook, which is G2 and unbuilt. What
// it can do is make a malformed entry fail loudly, so the files can't quietly
// rot into free text the way the last attempt did.
//
// Run:  node tools/learnings.mjs             summary
//       node tools/learnings.mjs --check     validate; non-zero on any problem
//       node tools/learnings.mjs --next      the entry /brainstorm would pull
//       node tools/learnings.mjs --fixtures  prove --check fails when it should

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const KINDS = ['fix', 'design', 'friction'];

// One friction report is noise. Four is a signal. At the threshold the check
// fails, which forces a decision — promote one to `design`, or resolve some —
// rather than letting a persistent annoyance accumulate unread forever.
const FRICTION_THRESHOLD = 4;

// `## YYYY-MM-DD · `kind` · open`  /  `· resolved YYYY-MM-DD`
const HEADING = /^## (\d{4}-\d{2}-\d{2}) · `([a-z]+)` · (open|resolved \d{4}-\d{2}-\d{2})\s*$/;

// ── discovery ───────────────────────────────────────────────────────────────

/** Every runnable unit that carries a LEARNINGS.md. */
function units() {
  const out = [];
  const skillsDir = join(ROOT, '.claude', 'skills');
  if (existsSync(skillsDir)) {
    for (const name of readdirSync(skillsDir).sort()) {
      const p = join(skillsDir, name, 'LEARNINGS.md');
      if (existsSync(p)) out.push({ unit: `/${name}`, path: p });
    }
  }
  for (const [unit, rel] of [
    ['agents', join('.claude', 'agents', 'LEARNINGS.md')],
    ['guards', join('guards', 'LEARNINGS.md')],
  ]) {
    const p = join(ROOT, rel);
    if (existsSync(p)) out.push({ unit, path: p });
  }
  return out;
}

// ── parsing ─────────────────────────────────────────────────────────────────

/**
 * Split a LEARNINGS.md into entries. Returns { entries, problems }.
 * A `## ` heading that doesn't match the shape is a problem, not a skipped
 * line — silently ignoring it is how these files rot into free text.
 */
function parse(text, label) {
  const entries = [];
  const problems = [];
  const lines = text.split('\n');

  let current = null;
  const flush = () => {
    if (current) entries.push(current);
    current = null;
  };

  for (const line of lines) {
    if (!line.startsWith('## ')) {
      if (current) current.body.push(line);
      continue;
    }
    flush();
    const m = HEADING.exec(line);
    if (!m) {
      problems.push(
        `${label}: malformed entry heading "${line.trim()}"\n` +
          '      expected: ## YYYY-MM-DD · `kind` · open   (or `· resolved YYYY-MM-DD`)'
      );
      continue;
    }
    const [, date, kind, status] = m;
    if (!KINDS.includes(kind)) {
      problems.push(`${label}: unknown kind \`${kind}\` on ${date} — expected one of ${KINDS.map((k) => `\`${k}\``).join(', ')}`);
      continue;
    }
    current = { date, kind, status, resolved: status.startsWith('resolved'), body: [], label };
  }
  flush();

  for (const e of entries) {
    const body = e.body.join('\n');
    if (!/\*\*Account for:\*\*/.test(body)) {
      problems.push(
        `${label}: the ${e.kind} entry dated ${e.date} has no **Account for:** line — ` +
          'a learning with no consequence is a diary entry'
      );
    }
    if (e.resolved && !/\*\*Resolved:\*\*/.test(body)) {
      problems.push(
        `${label}: the entry dated ${e.date} is marked resolved but has no **Resolved:** line ` +
          'saying what changed and where'
      );
    }
    e.text = body.trim();
  }

  const openFriction = entries.filter((e) => e.kind === 'friction' && !e.resolved).length;
  if (openFriction >= FRICTION_THRESHOLD) {
    problems.push(
      `${label}: ${openFriction} open \`friction\` entries (threshold ${FRICTION_THRESHOLD}). ` +
        'One is noise; this many is a signal. Promote one to `design` or resolve some.'
    );
  }

  return { entries, problems };
}

function readAll() {
  const all = [];
  const problems = [];
  for (const { unit, path } of units()) {
    const label = relative(ROOT, path);
    const { entries, problems: p } = parse(readFileSync(path, 'utf8'), label);
    problems.push(...p);
    all.push(...entries.map((e) => ({ ...e, unit })));
  }
  return { all, problems };
}

// ── modes ───────────────────────────────────────────────────────────────────

function check() {
  const found = units();
  if (!found.length) {
    console.error('learnings: no LEARNINGS.md files found — nothing is recording what runs teach');
    process.exit(1);
  }
  const { problems } = readAll();
  if (problems.length) {
    console.error(`learnings: ${problems.length} problem(s)\n`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  process.exit(0); // success-silent
}

function summary() {
  const { all, problems } = readAll();
  const open = all.filter((e) => !e.resolved);

  console.log('LEARNINGS\n');
  for (const { unit, path } of units()) {
    const mine = all.filter((e) => e.label === relative(ROOT, path));
    const counts = KINDS.map((k) => {
      const n = mine.filter((e) => e.kind === k && !e.resolved).length;
      return n ? `${n} ${k}` : null;
    }).filter(Boolean);
    const resolved = mine.filter((e) => e.resolved).length;
    console.log(
      `  ${unit.padEnd(12)} ${counts.length ? counts.join(', ') : 'nothing open'}` +
        (resolved ? `  (${resolved} resolved)` : '')
    );
  }

  const design = open.filter((e) => e.kind === 'design').sort((a, b) => a.date.localeCompare(b.date));
  console.log(
    `\n  ${design.length} open \`design\` entr${design.length === 1 ? 'y' : 'ies'} — what /brainstorm pulls from.` +
      (design.length ? ` Oldest: ${design[0].unit} (${design[0].date}).` : '')
  );
  if (problems.length) console.log(`\n  ${problems.length} problem(s) — run --check`);
}

/** The entry /brainstorm runs on when given no argument. */
function next() {
  const { all } = readAll();
  const design = all
    .filter((e) => e.kind === 'design' && !e.resolved)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!design.length) {
    // Deliberately not an error, and deliberately not a fallback to some
    // invented topic. Nothing open means nothing open.
    console.log('NONE — no open `design` learnings. Say so and stop; do not invent a topic.');
    process.exit(0);
  }

  const e = design[0];
  console.log(`unit: ${e.unit}`);
  console.log(`file: ${e.label}`);
  console.log(`date: ${e.date}`);
  console.log(`kind: ${e.kind}`);
  console.log('---');
  console.log(e.text);
  process.exit(0);
}

// ── fixtures ────────────────────────────────────────────────────────────────

function fixtures() {
  const dir = join(ROOT, 'guards', 'fixtures', 'learnings');
  if (!existsSync(dir)) {
    console.error(`learnings: no fixtures at ${dir}`);
    process.exit(1);
  }

  const expect = {
    '01-valid.md': null,
    '02-bad-heading.md': 'malformed entry heading',
    '03-unknown-kind.md': 'unknown kind',
    '04-no-account-for.md': 'no **Account for:** line',
    '05-resolved-without-resolution.md': 'no **Resolved:** line',
    '06-friction-threshold.md': 'open `friction` entries (threshold 4)',
    '07-bad-status.md': 'malformed entry heading',
  };

  let bad = 0;
  for (const [file, want] of Object.entries(expect)) {
    const p = join(dir, file);
    if (!existsSync(p)) {
      console.error(`  ✗ ${file} — fixture missing`);
      bad++;
      continue;
    }
    const { problems } = parse(readFileSync(p, 'utf8'), file);
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
    console.error(`\nlearnings fixtures: ${bad} fixture(s) did not behave as specified`);
    process.exit(1);
  }
  console.log('\nlearnings fixtures: all behave as specified');
  process.exit(0);
}

// ── dispatch ────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
if (argv.includes('--fixtures')) fixtures();
else if (argv.includes('--check')) check();
else if (argv.includes('--next')) next();
else summary();
