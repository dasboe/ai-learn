#!/usr/bin/env node
// Integrity-Check: Validates core files and CLAUDE.md drift.
// Called via MCP integrity key or directly.

import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PROJECT_ROOT = join(new URL(import.meta.url).pathname, '../../..');
const issues = [];
let status = 'ok';

// 1. Check core files exist
const required = {
  'profile': '.settings/learner-profile.md',
  'context': '.settings/context.md',
  'bootstrap': '.settings/CLAUDE.md.bootstrap',
};

for (const [name, path] of Object.entries(required)) {
  if (!existsSync(join(PROJECT_ROOT, path))) {
    issues.push({ file: name, problem: 'missing' });
    if (name === 'profile') status = 'critical';
  }
}

// 2. CLAUDE.md drift check (immutable sections)
const claudeMdPath = join(PROJECT_ROOT, 'CLAUDE.md');
const bootstrapPath = join(PROJECT_ROOT, '.settings/CLAUDE.md.bootstrap');

if (existsSync(claudeMdPath) && existsSync(bootstrapPath)) {
  const current = readFileSync(claudeMdPath, 'utf-8');
  const bootstrap = readFileSync(bootstrapPath, 'utf-8');

  const immutableSections = ['## First Contact Protocol', '## Teaching Boundary', '## Rules'];
  for (const section of immutableSections) {
    const extractSection = (text, heading) => {
      const start = text.indexOf(heading);
      if (start === -1) return null;
      const nextHeading = text.indexOf('\n## ', start + heading.length);
      return text.slice(start, nextHeading === -1 ? undefined : nextHeading).trim();
    };

    const currentSection = extractSection(current, section);
    const bootstrapSection = extractSection(bootstrap, section);

    if (bootstrapSection && currentSection !== bootstrapSection) {
      issues.push({ file: 'CLAUDE.md', problem: `drift in "${section}"` });
      if (status === 'ok') status = 'warning';
    }
  }
}

// 3. context.md staleness check
const contextPath = join(PROJECT_ROOT, '.settings/context.md');
if (existsSync(contextPath)) {
  const mtime = statSync(contextPath).mtime;
  const daysSince = (Date.now() - mtime.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince > 7) {
    issues.push({ file: 'context', problem: `stale (${Math.floor(daysSince)} days old)` });
    if (status === 'ok') status = 'warning';
  }
}

console.log(JSON.stringify({ status, issues }));
