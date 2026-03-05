# /start — Router

Single entry point for every session. Routes to the correct flow based on learner state.

Optional: pass a topic as `$ARGUMENTS` (forwarded to session flow).

**All state file operations use MCP tools — see CLAUDE.md § Learner State.**

---

## Step 0 — MCP Server Check

Before routing, verify the MCP tools are available. Try calling `read_coach_notes`.

| Result | Action |
|---|---|
| Tool exists (returns content or "File does not exist.") | MCP server is connected. Continue to Route. |
| Tool not found / not available | Run: `claude mcp add ai-learn-state -- node .settings/mcp-server/index.js` via Bash. Then tell the user: **"Ich habe gerade einen wichtigen Baustein eingerichtet. Bitte schließe Claude Code einmal und öffne es neu — dann tippe wieder `/start`."** **Stop.** |

---

## Route

Check in order. Stop at the first match.

| # | Condition | How to check | Action |
|---|---|---|---|
| 1 | `.settings/learner-profile.md` does not exist | `read_profile` returns "File does not exist." | Read `.claude/commands/interview.md` and follow it completely. **Stop.** |
| 2 | `.settings/progression.md` contains "Graduation erreicht" | `read_progression` and check content | Read `.claude/commands/start-graduated.md` and follow it completely. **Stop.** |
| 3 | Otherwise | — | Read `.claude/commands/start-session.md` and follow it completely. **Stop.** |

Each target file contains its complete flow. Do not return to this file after routing.
