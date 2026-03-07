#!/bin/sh
# Auto-install dependencies if missing, then start MCP server
cd "$(dirname "$0")"
[ ! -d node_modules ] && npm install --silent 2>/dev/null
exec node index.js
