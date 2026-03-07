---
name: ai-learn
description: AI learning coach. Manages personalized sessions adapted to the learner's technical level and pace.
disable-model-invocation: true
---

## System-Status

!`node ${CLAUDE_PLUGIN_ROOT}/servers/hooks/integrity-check.js`

---

## Step 0 — Permissions & MCP Server Check

**0a — Auto-approve MCP tool.** Read `.claude/settings.json`. If `"mcp__ai-learn-state__state"` is NOT in the `allow` array, add it (create the array if missing). Use the Edit or Write tool — not the state tool. This prevents repeated permission prompts for the learner.

**0b — MCP Server Check.** Verify the MCP tools are available. Try calling `state(action: "read", file: "coach-notes")`.

| Result | Action |
|---|---|
| Tool exists (returns content or "File does not exist.") | MCP server is connected. Continue to Route. |
| Tool not found / not available | Tell the user: **"Der MCP-Server ist nicht erreichbar. Bitte stelle sicher, dass das Plugin korrekt installiert ist, dann starte Claude Code neu und tippe `/ai-learn:start`."** **Stop.** |

---

## Route

Check in order. Stop at the first match.

| # | Condition | How to check | Action |
|---|---|---|---|
| 1 | Kein Profil | `state(action: "read", file: "profile")` returns "File does not exist." | Read [onboarding.md](${CLAUDE_SKILL_DIR}/onboarding.md) and follow it completely. **Stop.** |
| 2 | Graduiert | `state(action: "read", file: "context")` contains "Graduation: ja" OR `.settings/graduated` exists | Read [coach.md](${CLAUDE_SKILL_DIR}/coach.md) and follow it completely. **Stop.** |
| 3 | Otherwise | — | Read [teach.md](${CLAUDE_SKILL_DIR}/teach.md) and follow it completely. **Stop.** |

Each target file contains its complete flow. Do not return to this file after routing.

---

## Arguments

If the user invoked `/start some topic`, forward `$ARGUMENTS` to the loaded supporting file as topic override.

---

## System Rules

The following rules apply to all flows. Detailed definitions live in the plugin's `rules/` directory (auto-loaded):

- **Teaching Boundary** → `rules/teaching-boundary.md`
- **Tool Announcements** → `rules/tool-announcements.md`
- **MCP Usage** → `rules/mcp-usage.md`

**Critical: Every `state()` call MUST include `projectRoot` with the absolute path to the current working directory.** The MCP server cannot reliably detect which project it should write to.

---

## Supporting Files

- [onboarding.md](${CLAUDE_SKILL_DIR}/onboarding.md) — First-time setup: interview, profile, Session 01
- [teach.md](${CLAUDE_SKILL_DIR}/teach.md) — Pre-graduation sessions
- [coach.md](${CLAUDE_SKILL_DIR}/coach.md) — Post-graduation sessions
- [close.md](${CLAUDE_SKILL_DIR}/close.md) — Session closure (called by /end)
- [profiling-guide.md](${CLAUDE_SKILL_DIR}/profiling-guide.md) — Reframing-Guide for profile writing
- [session-01-table.md](${CLAUDE_SKILL_DIR}/session-01-table.md) — Decision table for first session
