# /end — Router

Session closure. Routes to the correct end-of-session flow.

**All state file operations use MCP tools — see CLAUDE.md § Learner State.**

---

## Route

| Condition | How to check | Action |
|---|---|---|
| `.settings/progression.md` contains "Graduation erreicht" | `read_progression` and check content | Read `.claude/commands/end-graduated.md` and follow it completely. **Stop.** |
| Otherwise | — | Read `.claude/commands/end-session.md` and follow it completely. **Stop.** |

Each target file contains its complete flow. Do not return to this file after routing.
