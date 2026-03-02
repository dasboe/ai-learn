# /end — Router

Session closure. Routes to the correct end-of-session flow.

---

## Route

| Condition | Action |
|---|---|
| `progression.md` contains "Graduation erreicht" | Read `.claude/commands/end-graduated.md` and follow it completely. **Stop.** |
| Otherwise | Read `.claude/commands/end-session.md` and follow it completely. **Stop.** |

Each target file contains its complete flow. Do not return to this file after routing.
