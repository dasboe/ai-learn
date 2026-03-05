# AI-LERN

Learn to work with AI — at your level, at your pace.
Built for [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

## Quickstart

1. Create a **new, empty folder** on your computer
2. Open that folder in **VS Code**
3. Open the **Claude Code** panel and paste this:

```
https://github.com/dasboe/ai-learn/blob/main/bootstrap.md
```

4. Claude sets everything up. When it's done, **close Claude Code**, reopen it in the same folder, and type `/start`.

That's it. No terminal, no git, no setup knowledge needed.

---

## What This Is

A Claude Code project that turns Claude into your personal AI tutor. It adapts to **you** — whether you run a business, practice law, design interfaces, or write code.

**How it works:**
1. Open Claude Code, type `/start` — the first time, Claude interviews you (5 min) to understand your level, your work, and your goals
2. Claude sets up a personalized learning path — adapted to what you do, not just what you know
3. Each session: open Claude Code, type `/start`, learn one thing, build one thing, type `/end`
4. Every time the same: open, `/start`, learn, build, `/end`

The goal: **get better at working with AI — in whatever way is useful to you.**

## What You Need

- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** — this project runs entirely inside Claude Code
- A Claude subscription that includes Claude Code (Pro, Max, or Team)
- **[VS Code](https://code.visualstudio.com/)** with the **[Claude Code extension](https://marketplace.visualstudio.com/items?itemName=anthropics.claude-code)** (recommended)

> **Complete beginner?** VS Code is free, and the Claude Code extension gives you
> everything in one window. Ask someone to help you install it. Once Claude Code
> is running, it takes over and guides you at your pace.

## Alternative: Git Clone

If you know git:

```bash
git clone https://github.com/dasboe/ai-learn.git my-ai-learning
cd my-ai-learning
```

Open the folder in VS Code, open Claude Code, type `/start`.

## How It Adapts

Everything adapts — content, complexity, pace, language. An electrician might use AI to write client proposals in seconds. A lawyer might build an AI-assisted contract review workflow. A designer might go from Figma to working prototype without waiting on developers. A retired teacher might explore AI out of pure curiosity. A developer might have a full-stack app running by session five. All are valid paths.

## Project Structure

After your first session, Claude Code creates:

```
my-ai-learning/
├── CLAUDE.md              <- drives Claude Code's behavior, adapts to you
├── learner-profile.md     <- your profile, created in the interview
├── progression.md         <- tracks your learning journey
├── sessions/
│   └── session-01/
│       └── README.md      <- what you learned and built
└── project/               <- your learning project, grows session by session
```

## FAQ

**What will I learn?**
How to work with AI effectively — starting with good prompting, then progressively deeper based on your background. Claude Code figures out what's relevant for you: practical text workflows, design-to-code prototyping, data automation, or full Claude Code mastery with CLAUDE.md, custom commands, and hooks. It depends on who you are.

**Do I need to know how to code?**
No. Claude Code adapts to your background and profession — not just your tech level. A tradesperson gets AI tools for proposals and client communication. A designer gets prototyping workflows. A developer gets a full-stack coding partner. Everyone learns at their own pace.

**What language does this work in?**
Any. Claude detects your language from your first message and matches it.

**Can I change direction?**
Anytime. The learning path isn't a fixed curriculum — tell Claude what you want and it adjusts.

**What's the meta-concept?**
You learn to work with AI by working with AI. Every session produces something real — a document, a script, a tool, an app. The learning IS the doing. There's no theory module you have to sit through first.

---

Created by [@dasboe](https://github.com/dasboe) — built with [Claude Code](https://docs.anthropic.com/en/docs/claude-code).
