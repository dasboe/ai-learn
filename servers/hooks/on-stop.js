#!/usr/bin/env node
// Copyright 2026 Björn Bösenberg
// Licensed under the MIT License
// Stop-Hook: Checks if a session was not properly closed.
// Outputs decision:block to prevent Claude from stopping if session is open.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// In plugin context: user data lives in CWD, not relative to script location
const PROJECT_ROOT = process.cwd();

// Find the last session
const sessionsDir = join(PROJECT_ROOT, 'sessions');
let lastSession = null;
try {
  const dirs = readdirSync(sessionsDir)
    .filter(d => d.startsWith('session-'))
    .sort()
    .reverse();
  if (dirs.length > 0) lastSession = dirs[0];
} catch { /* no sessions dir */ }

if (!lastSession) process.exit(0);

// Check if README contains "Key Takeaways" (= completed)
const readmePath = join(sessionsDir, lastSession, 'README.md');
try {
  const content = readFileSync(readmePath, 'utf-8');
  if (content.includes('<!-- filled during session -->') || !content.includes('Key Takeaways')) {
    // Session not completed
    const sessionNum = lastSession.replace('session-', '');
    const result = JSON.stringify({
      decision: "block",
      reason: `Session ${sessionNum} wurde nicht abgeschlossen. Frage den User ob er /end ausführen will.`
    });
    process.stdout.write(result);
  }
} catch { /* README doesn't exist or can't be read */ }
