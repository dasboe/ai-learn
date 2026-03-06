---
name: ai-learn
description: AI learning coach. Manages personalized sessions adapted to the learner's technical level and pace.
disable-model-invocation: true
---

## System-Status

!`node ${CLAUDE_SKILL_DIR}/../../../.settings/hooks/integrity-check.js`

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
| 1 | Kein Profil | `state(action: "read", file: "profile")` returns "File does not exist." | Read [onboarding.md](${CLAUDE_SKILL_DIR}/onboarding.md) and follow it completely. **Stop.** |
| 2 | Graduiert | `state(action: "read", file: "context")` contains "Graduation: ja" OR `.settings/graduated` exists | Read [coach.md](${CLAUDE_SKILL_DIR}/coach.md) and follow it completely. **Stop.** |
| 3 | Otherwise | — | Read [teach.md](${CLAUDE_SKILL_DIR}/teach.md) and follow it completely. **Stop.** |

Each target file contains its complete flow. Do not return to this file after routing.

---

## Arguments

If the user invoked `/start some topic`, forward `$ARGUMENTS` to the loaded supporting file as topic override.

---

## System Rules

The following rules apply to all flows. Detailed definitions live in `.claude/rules/` (created in Phase 4). Until then, refer to the matching sections in `CLAUDE.md`:

- **Teaching Boundary** → `.claude/rules/teaching-boundary.md`
- **Tool Announcements** → `.claude/rules/tool-announcements.md`
- **MCP Usage** → `.claude/rules/mcp-usage.md`

---

## Supporting Files

- [onboarding.md](${CLAUDE_SKILL_DIR}/onboarding.md) — First-time setup: interview, profile, Session 01
- [teach.md](${CLAUDE_SKILL_DIR}/teach.md) — Pre-graduation sessions
- [coach.md](${CLAUDE_SKILL_DIR}/coach.md) — Post-graduation sessions
- [close.md](${CLAUDE_SKILL_DIR}/close.md) — Session closure (called by /end)
- [profiling-guide.md](${CLAUDE_SKILL_DIR}/profiling-guide.md) — Reframing-Guide for profile writing
- [session-01-table.md](${CLAUDE_SKILL_DIR}/session-01-table.md) — Decision table for first session
