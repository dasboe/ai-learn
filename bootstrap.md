# AI-LERN Bootstrap

> **Paste this URL into Claude Code to get started.**
> No terminal, no git, no setup knowledge needed.

---

## How to Start

1. Open **Visual Studio Code** (or any editor with Claude Code)
2. Open the **Claude Code** panel
3. Paste this URL into the chat:

```
https://github.com/dasboe/ai-learn/blob/main/bootstrap.md
```

Claude sets everything up and tells you what to do next.

> **If Claude doesn't start automatically**, paste this instead:
>
> `Richte mein AI-Lernprojekt ein. Folge den Anweisungen in: https://github.com/dasboe/ai-learn/blob/main/bootstrap.md`

---

## What You Need

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and working
- A Claude subscription (Pro, Max, or Team)
- [Visual Studio Code](https://code.visualstudio.com/) with the [Claude Code extension](https://marketplace.visualstudio.com/items?itemName=anthropics.claude-code) (recommended)

---

## Setup Instructions for Claude Code

**When a user shares this URL or this file's content, follow these steps:**

### 1. Check the working directory

- If the current directory already contains a `CLAUDE.md` file, skip setup. Tell the user to type `/start`.
- If the current directory is NOT empty, create a subdirectory called `ai-learn` and work inside it.
- If the current directory is empty, use it directly.

### 2. Clone and clean up

Run these two commands in a single Bash call (chain with `&&`):

```bash
git clone https://github.com/dasboe/ai-learn.git . && rm -f DESIGN.md bootstrap.md
```

If the directory is not empty (step 1 created a subdirectory), clone into that subdirectory instead:

```bash
git clone https://github.com/dasboe/ai-learn.git ai-learn && rm -f ai-learn/DESIGN.md ai-learn/bootstrap.md
```

This gives the learner all project files plus git history in one step. `DESIGN.md` and `bootstrap.md` are removed because they are development docs, not needed for learning.

### 4. Done

Tell the user:

- Setup is complete
- **Close this Claude Code instance** and open a new one in the same folder
- In the new instance, type `/start` to begin
- Briefly explain: Claude will interview them once, then every session starts with `/start`

Important: `/start` is a custom slash command that only works in a new Claude Code instance after the project files are in place. The current bootstrap instance cannot use it.

Match the user's language (German if they wrote German, English if English, etc.)
