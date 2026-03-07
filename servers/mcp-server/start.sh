#!/bin/sh
# Auto-install dependencies if missing, then start MCP server
# IMPORTANT: Do not change CWD — the MCP server uses process.cwd() as fallback for the project root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
  (cd "$SCRIPT_DIR" && npm install --silent 2>/dev/null)
fi
exec node "$SCRIPT_DIR/index.js"
