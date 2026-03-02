# AI-LERN

Learn to work with AI — at your level, at your pace.

## What This Is

A learning framework where AI adapts to **you**. Whether you run a business, practice law, design interfaces, or write code — you start here, and the AI figures out what to teach you and what to create.

**How it works:**
1. Open Claude, type `/start` — the first time, Claude interviews you (5 min) to understand your level, your work, and your goals
2. Claude sets up a personalized learning path — adapted to what you do, not just what you know
3. Each session: open Claude, type `/start`, learn one thing, build one thing, close Claude
4. Every time the same: open, `/start`, learn, build, close

The goal: **get better at working with AI — in whatever way is useful to you.**

## What You Need

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and working
- A Claude subscription that includes Claude Code (Pro, Max, or Team)
- A terminal — Claude handles the rest

> **Complete beginner?** If the terminal feels scary, ask someone to help you
> with the three setup steps below. Once Claude is running, it takes over and
> guides you at your pace.

## Get Started

**Setup (once):**
```bash
git clone <repo-url> my-ai-learning
cd my-ai-learning
```

**Every session (including the first):**
```bash
claude
```
Then type `/start`. The first time, Claude interviews you and sets up your project. Every time after, it picks up where you left off. One concept, one deliverable. When you're done, close Claude.

Everything adapts — content, complexity, pace, language. An electrician might use AI to write client proposals in seconds. A lawyer might build an AI-assisted contract review workflow. A designer might go from Figma to working prototype without waiting on developers. A retired teacher might explore AI out of pure curiosity. A developer might have a full-stack app running by session five. All are valid paths.

## Project Structure

You start with just two files. After your first session:

```
my-ai-learning/
├── CLAUDE.md              ← adapts to you after profiling
├── learner-profile.md     ← your profile, created in the interview
├── progression.md         ← tracks where you are in your learning journey
├── sessions/
│   └── session-01/
│       └── README.md      ← what you learned and built
└── [your project]         ← grows session by session
```

## FAQ

**What will I learn?**
How to work with AI effectively — starting with good prompting, then progressively deeper based on your background. The AI figures out what's relevant for you: practical text workflows for your job, design-to-code prototyping, data automation, or full Claude Code mastery with advanced features. It depends on who you are.

**Do I need to know how to code?**
No. The AI adapts to your background and profession — not just your tech level. A tradesperson gets AI tools for proposals and client communication. A designer gets prototyping workflows. A developer gets a full-stack coding partner. And everyone learns at their own pace — fast thinkers move fast, regardless of technical experience.

**What language does this work in?**
Any. Claude detects your language from your first message and matches it.

**Can I change direction?**
Anytime. The learning path isn't a fixed curriculum — tell Claude what you want and it adjusts.

**What's the meta-concept?**
You learn to work with AI by actually working with AI. Every session produces something real — a document, a script, a tool, an app. The learning IS the doing. There's no theory module you have to sit through first.

---

Created by [@dasboe](https://github.com/dasboe) — built with [Claude Code](https://docs.anthropic.com/en/docs/claude-code).
