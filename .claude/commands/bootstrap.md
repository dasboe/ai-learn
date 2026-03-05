# /bootstrap — Project Setup

Sets up the AI-LERN learning environment. Called either via `/bootstrap` or from `bootstrap.md` (URL flow).

Match the user's language (German if they wrote German, English if English, etc.)

---

## Step 1 — Check Working Directory

| Situation | Action |
|---|---|
| Current directory contains `CLAUDE.md` with "AI-LERN" content | Setup already done. Tell the user to type `/start`. **Stop.** |
| Current directory is not empty and no `CLAUDE.md` | Create subdirectory `ai-learn`, use it as target |
| Current directory is empty | Use current directory as target |

---

## Step 2 — Clone (if needed)

If the repo is not yet cloned (no `.claude/commands/` directory in the target):

Into current directory:
```bash
git clone https://github.com/dasboe/ai-learn.git .
```

Into subdirectory:
```bash
git clone https://github.com/dasboe/ai-learn.git ai-learn
```

If already cloned (this command was called via `/bootstrap`), skip this step.

---

## Step 3 — Clean Up Development Files

Remove files that are only needed for development, not for learning:

```bash
rm -f DESIGN.md bootstrap.md
```

(Adjust path if cloned into subdirectory.)

---

## Step 4 — Install MCP Server Dependencies

```bash
cd <target>/.settings/mcp-server && npm install
```

---

## Step 5 — Done

Tell the user:

- Setup is complete
- **Close this Claude Code instance** and open a new one in the same folder
- In the new instance, type `/start` to begin
- Briefly explain: Claude will interview them once to personalize everything, then every session starts with `/start`

Important: `/start` is a custom slash command that only works in a new Claude Code instance after the project files are in place. The current bootstrap instance cannot use it.
