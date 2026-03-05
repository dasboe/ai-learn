# /start — Router

Single entry point for every session. Routes to the correct flow based on learner state.

Optional: pass a topic as `$ARGUMENTS` (forwarded to session flow).

**All state file operations use MCP tools — see CLAUDE.md § Learner State.**

---

## Step 0 — MCP Server Check

Before routing, verify the MCP tools are available. Try calling `state(action: "read", file: "coach-notes")`.

| Result | Action |
|---|---|
| Tool exists (returns content or "File does not exist.") | MCP server is connected. Continue to Route. |
| Tool not found / not available | Tell the user: **"Der MCP-Server ist nicht erreichbar. Bitte stelle sicher, dass `npm install` in `.settings/mcp-server/` ausgeführt wurde, dann starte Claude Code neu und tippe `/start`."** **Stop.** |

---

## Route

Check in order. Stop at the first match.

| # | Condition | How to check | Action |
|---|---|---|---|
| 1 | `.settings/learner-profile.md` does not exist | `state(action: "read", file: "profile")` returns "File does not exist." | Read `.claude/commands/interview.md` and follow it completely. **Stop.** |
| 2 | `.settings/progression.md` contains "Graduation erreicht" | `state(action: "read", file: "progression")` and check content | Read `.claude/commands/start-graduated.md` and follow it completely. **Stop.** |
| 3 | Otherwise | — | Read `.claude/commands/start-session.md` and follow it completely. **Stop.** |

Each target file contains its complete flow. Do not return to this file after routing.
