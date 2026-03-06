#!/usr/bin/env node
// PreToolUse-Hook: Blocks Write/Edit outside the sandbox (pre-graduation).

import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

// In plugin context: user data lives in CWD, not relative to script location
const PROJECT_ROOT = process.cwd();

// Graduated learners may do anything
if (existsSync(join(PROJECT_ROOT, '.settings/graduated'))) {
  process.exit(0);
}

// Read tool input from stdin
let input = '';
process.stdin.setEncoding('utf-8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const filePath = data.tool_input?.file_path || data.tool_input?.command || '';

    // Allowed paths (relative to project root)
    const resolved = resolve(filePath);
    const projectRoot = resolve(PROJECT_ROOT);

    // Allow anything within the project root
    const isAllowed = resolved.startsWith(projectRoot);

    if (!isAllowed) {
      const result = JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: "Datei liegt außerhalb des Lernprojekts. Pre-graduation: nur project/, sessions/, reference/ erlaubt."
        }
      });
      process.stdout.write(result);
    }
  } catch {
    // On parse error: don't block
  }
});
