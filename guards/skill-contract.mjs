#!/usr/bin/env node
// Guard: a skill spec satisfies the modular-skill-composition contract.
// Exits non-zero and names the specific divergence. No warnings.
//
// Checks a skill spec (a SKILL.md-shaped file) against the contract in
// workshop/spec/skill-contract.md:
//   1. YAML frontmatter has `name` and `description`
//   2. `## Responsibility`, `## Inputs`, `## Outputs`, `## Composes with` are present
//   3. `## Responsibility` is a single sentence — no " and " joining two of them
//   4. `## Failing check` is present and non-placeholder, unless frontmatter
//      declares `type: reading`
//
// Usage: node guards/skill-contract.mjs <path-to-skill-spec.md> [...]

import { readFileSync } from 'node:fs';

const REQUIRED_SECTIONS = ['## Responsibility', '## Inputs', '## Outputs', '## Composes with'];
const PLACEHOLDER = /^(tbd|todo|n\/a|none)\.?$/i;

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error(
    'skill-contract guard: no files given\n  usage: node guards/skill-contract.mjs <spec.md> [...]'
  );
  process.exit(1);
}

const fail = [];

for (const file of files) {
  const body = readFileSync(file, 'utf8');
  const frontmatterMatch = body.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';

  if (!frontmatterMatch) fail.push(`${file} has no YAML frontmatter`);
  if (!/^name:/m.test(frontmatter)) fail.push(`${file}: frontmatter is missing "name"`);
  if (!/^description:/m.test(frontmatter)) fail.push(`${file}: frontmatter is missing "description"`);

  const isReading = /^type:\s*reading\s*$/m.test(frontmatter);

  for (const section of REQUIRED_SECTIONS) {
    if (!body.includes(section)) fail.push(`${file} is missing the required section "${section}"`);
  }

  // Responsibility must read as one thing, not two joined by "and"
  const respMatch = body.match(/## Responsibility\n+([^\n#]+)/);
  if (respMatch) {
    const resp = respMatch[1].trim();
    if (/\band\b/i.test(resp)) {
      fail.push(
        `${file}: "## Responsibility" reads as two responsibilities joined by "and" — split it: "${resp}"`
      );
    }
  }

  // A build unit needs a real failing check; a reading task is exempt but must say so
  if (!isReading) {
    if (!body.includes('## Failing check')) {
      fail.push(
        `${file} is missing "## Failing check" — mark \`type: reading\` in frontmatter if ` +
          `this is a reading task, not a build unit`
      );
    } else {
      const checkMatch = body.match(/## Failing check\n+([^\n#]+)/);
      if (!checkMatch || PLACEHOLDER.test(checkMatch[1].trim())) {
        fail.push(`${file}: "## Failing check" is empty or a placeholder — name the actual command`);
      }
    }
  }
}

if (fail.length) {
  console.error(`skill-contract guard: ${fail.length} problem(s)\n`);
  for (const f of fail) console.error(`  - ${f}`);
  process.exit(1);
}
process.exit(0); // success-silent
