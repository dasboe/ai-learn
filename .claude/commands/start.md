# /start — Router

Single entry point for every session. Routes to the correct flow based on learner state.

Optional: pass a topic as `$ARGUMENTS` (forwarded to session flow).

---

## Route

Check in order. Stop at the first match.

| # | Condition | Action |
|---|---|---|
| 1 | `learner-profile.md` does not exist | Read `.claude/commands/interview.md` and follow it completely. **Stop.** |
| 2 | `progression.md` contains "Graduation erreicht" | Read `.claude/commands/start-graduated.md` and follow it completely. **Stop.** |
| 3 | Otherwise | Read `.claude/commands/start-session.md` and follow it completely. **Stop.** |

Each target file contains its complete flow. Do not return to this file after routing.
