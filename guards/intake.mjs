#!/usr/bin/env node
// Guard: the intake pipeline left complete residue.
// Exits non-zero and names the specific divergence. No warnings.
//
// Checks:
//   1. every resources/NN-*.md has a delta (or is grandfathered)
//   2. every resources/NN-*.md is listed in resources/README.md
//   3. every kept note has the required house-format sections
//   4. REJECTED.md entries are well-formed
//
// See PIPELINE.md and .claude/skills/intake/SKILL.md

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath, not .pathname — the latter yields /C:/... on Windows
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RES = join(ROOT, 'resources');
const DELTAS = join(RES, 'deltas');

const REQUIRED_SECTIONS = ['## Why it matters', '## Where it lands'];

// The fixed schema every intaken resource is explained against.
// See .claude/skills/intake/SKILL.md § The eight points
const EIGHT_POINTS = [
  'Thesis',
  'Problem',
  'Mechanism',
  'Evidence',
  'Applicability',
  'Cost',
  'Conflicts',
  'So what',
];
const fail = [];

const notes = readdirSync(RES)
  .filter((f) => /^\d\d-.*\.md$/.test(f))
  .sort();

if (notes.length === 0) fail.push('resources/ contains no numbered notes');

// --- grandfathered notes (predate the intake gate) -------------------------
const grandfatheredPath = join(DELTAS, 'GRANDFATHERED.md');
const grandfathered = new Set();
if (existsSync(grandfatheredPath)) {
  for (const m of readFileSync(grandfatheredPath, 'utf8').matchAll(/^- `(\d\d-[^`]+\.md)`/gm)) {
    grandfathered.add(m[1]);
  }
}

const deltaFiles = existsSync(DELTAS)
  ? readdirSync(DELTAS).filter((f) => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(f))
  : [];

const readmePath = join(RES, 'README.md');
const readme = existsSync(readmePath) ? readFileSync(readmePath, 'utf8') : '';
if (!readme) fail.push('resources/README.md is missing — the index is not optional');

for (const note of notes) {
  const slug = note.replace(/^\d\d-/, '').replace(/\.md$/, '');

  // 1. delta present, or explicitly grandfathered
  const hasDelta = deltaFiles.some((d) => d.endsWith(`-${slug}.md`));
  if (!hasDelta && !grandfathered.has(note)) {
    fail.push(
      `resources/${note} has no delta — expected resources/deltas/YYYY-MM-DD-${slug}.md ` +
        `(or a GRANDFATHERED.md entry). /intake phase 1 was skipped.`
    );
  }

  // 2. indexed
  if (readme && !readme.includes(note)) {
    fail.push(`resources/${note} is not listed in resources/README.md`);
  }

  // 3. house format
  const body = readFileSync(join(RES, note), 'utf8');
  for (const section of REQUIRED_SECTIONS) {
    if (!body.includes(section)) {
      fail.push(`resources/${note} is missing the required section "${section}"`);
    }
  }

  // 3c. explainer — every note that came through the gate has a visual first-contact page
  if (!grandfathered.has(note)) {
    const explainer = join(RES, 'explainers', note.replace(/\.md$/, '.html'));
    if (!existsSync(explainer)) {
      fail.push(
        `resources/${note} has no explainer — expected ` +
          `resources/explainers/${note.replace(/\.md$/, '.html')}. /intake phase 5 was skipped.`
      );
    } else {
      const html = readFileSync(explainer, 'utf8');
      // the evidence section is the counterweight to a polished page; it is never optional
      if (!/How much to believe it/i.test(html)) {
        fail.push(
          `resources/explainers/${note.replace(/\.md$/, '.html')} is missing the ` +
            `"How much to believe it" section — the evidence strip is non-negotiable`
        );
      }
      // Self-contained: no external SUBRESOURCES. An <a href> to the source paper is
      // fine — it costs nothing until clicked. Only src= and <link href=> fetch on load.
      const ext = [
        ...html.matchAll(/\bsrc\s*=\s*["'](?:https?:)?\/\//gi),
        ...html.matchAll(/<link\b[^>]*\bhref\s*=\s*["'](?:https?:)?\/\//gi),
        ...html.matchAll(/@import\s+(?:url\()?["']?(?:https?:)?\/\//gi),
      ];
      if (ext.length) {
        fail.push(
          `resources/explainers/${note.replace(/\.md$/, '.html')} makes ${ext.length} ` +
            `external request(s) — explainers must open from disk with no network`
        );
      }
    }
  }

  // 3b. the eight points — required only for notes that came through /intake.
  // Grandfathered notes predate the schema; that debt is tracked, not hidden.
  if (!grandfathered.has(note)) {
    if (!body.includes('## In brief')) {
      fail.push(
        `resources/${note} is missing "## In brief" — the eight-point schema. ` +
          `/intake phase 2 was skipped or its output was not carried into the note.`
      );
    } else {
      for (const point of EIGHT_POINTS) {
        if (!body.includes(`**${point}**`)) {
          fail.push(`resources/${note} "## In brief" is missing the ${point} row`);
        }
      }
    }
  }
}

// 4. rejected entries well-formed
const rejPath = join(RES, 'REJECTED.md');
if (existsSync(rejPath)) {
  const rej = readFileSync(rejPath, 'utf8');
  const tail = rej.split('## Rejected')[1] ?? '';
  for (const line of tail.split('\n')) {
    const t = line.trim();
    if (!t.startsWith('- ')) continue;
    if (!/^- \d{4}-\d{2}-\d{2} — \[.+\]\(.+\) — .+$/.test(t)) {
      fail.push(
        `resources/REJECTED.md malformed entry: ${t}\n` +
          `    expected: - YYYY-MM-DD — [title](url) — reason`
      );
    }
  }
} else {
  fail.push('resources/REJECTED.md is missing — ignored resources have nowhere to land');
}

// --- report ----------------------------------------------------------------
if (fail.length) {
  console.error(`intake guard: ${fail.length} problem(s)\n`);
  for (const f of fail) console.error(`  - ${f}`);
  process.exit(1);
}
process.exit(0); // success-silent
