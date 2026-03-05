# AI-LERN Bootstrap

## Instructions for Claude Code

When a user shares this URL or this file's content, follow these steps exactly.

Match the user's language (German if they wrote German, English if English, etc.)

### 1. Check the working directory

| Situation | Action |
|---|---|
| Current directory contains a `CLAUDE.md` with "AI-LERN" content | Setup already done. Tell the user to type `/start`. **Stop.** |
| Current directory is not empty | Create subdirectory `ai-learn`, clone into it |
| Current directory is empty | Clone directly into current directory |

### 2. Clone the repo

Into current directory:
```bash
git clone https://github.com/dasboe/ai-learn.git .
```

Into subdirectory:
```bash
git clone https://github.com/dasboe/ai-learn.git ai-learn
```

### 3. Run the bootstrap command

Read the file `.claude/commands/bootstrap.md` (or `ai-learn/.claude/commands/bootstrap.md` if cloned into subdirectory) from the freshly cloned repo and follow it from **Step 2** onward (skip Step 1 — you already handled that above, and skip cloning — you just did that).
