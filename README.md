# AI-LERN

Learn to work with AI — at your level, at your pace.
A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugin.

## What This Is

A Claude Code plugin that turns Claude into your personal AI tutor. It adapts to **you** — whether you run a business, practice law, design interfaces, or write code. Claude interviews you once, then builds a personalized learning path. Each session: one concept learned, one thing built.

## Install

**You need:**
- **[VS Code](https://code.visualstudio.com/)** with the **[Claude Code extension](https://marketplace.visualstudio.com/items?itemName=anthropics.claude-code)**
- A Claude subscription that includes Claude Code (Pro, Max, or Team)

**Then in Claude Code:**

```
/plugin marketplace add dasboe/ai-learn
/plugin install ai-learn@ai-learn-marketplace
```

Restart Claude Code, then type `/ai-learn:start`.

That's it. Claude interviews you once, then every session starts with `/ai-learn:start`.

---

## How It Works

1. Type `/ai-learn:start` — the first time, Claude interviews you (5 min)
2. Claude sets up a personalized learning path — adapted to what you do, not just what you know
3. Each session: `/ai-learn:start`, learn, build, `/ai-learn:end`
4. Every time the same loop. The goal: **get better at working with AI — in whatever way is useful to you.**

## Commands

| Command | What it does |
|---|---|
| `/ai-learn:start` | Start a session — interview (first time) or next lesson |
| `/ai-learn:end` | Close the session — saves progress, updates context |
| `/ai-learn:bootstrap` | Initial setup for new learners |

## How It Adapts

Everything adapts — content, complexity, pace, language. An electrician might use AI to write client proposals in seconds. A lawyer might build an AI-assisted contract review workflow. A designer might go from Figma to working prototype without waiting on developers. A retired teacher might explore AI out of pure curiosity. A developer might have a full-stack app running by session five. All are valid paths.

## What's Included

- **Skills** — Routing, onboarding, teaching, coaching, session closure
- **Hooks** — Stop (reminds about `/end`), PreToolUse (sandbox enforcement)
- **MCP Server** — State management for learner profile, context, sessions
- **Rules** — Teaching boundary, tool announcements, MCP usage

## User Data

The plugin creates these files in your working directory (not tracked by git):

```
your-project/
├── .settings/
│   ├── learner-profile.md    <- your profile, created in the interview
│   └── context.md            <- tracks where you are and what's next
├── sessions/
│   └── session-01/
│       └── README.md         <- what you learned and built
├── reference/                <- lookup docs you build over time
└── project/                  <- your learning project, grows session by session
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
