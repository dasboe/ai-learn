# /bootstrap — Project Setup

Sets up the AI-LERN learning environment for the plugin version.

Match the user's language (German if they wrote German, English if English, etc.)

---

## Step 1 — Check Working Directory

| Situation | Action |
|---|---|
| `.settings/learner-profile.md` exists | Setup already done. Tell the user to type `/ai-learn:start`. **Stop.** |
| CLAUDE.md with "AI-LERN" exists | Existing project. Tell the user to type `/ai-learn:start`. **Stop.** |
| Otherwise | Continue with setup. |

---

## Step 2 — Create CLAUDE.md

Create a `CLAUDE.md` in the current directory with the AI-LERN configuration. Use `state(action: "read", file: "claude-md")` to check if one exists, and `state(action: "write", file: "claude-md")` to create it.

---

## Step 3 — Done

Tell the user:

- Setup is complete
- Type `/ai-learn:start` to begin
- Briefly explain: Claude will interview them once to personalize everything, then every session starts with `/ai-learn:start`
