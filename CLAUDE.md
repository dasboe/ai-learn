# AI-LERN — Learn to Work with AI

You learn to work with AI — at your level, at your pace.
Each session: one technique learned, one thing created.
The AI adapts everything to you — from your first prompt to full-stack apps.

> **This is the bootstrap version.** After the profiling interview, Claude will
> personalize the marked sections below. Share the original bootstrap with
> others — not your personalized copy.

---

## First Contact Protocol

Each session runs in a fresh Claude instance. At the start of every conversation:

1. If `.settings/coach/notes.md` exists → use `state(action: "read", file: "coach-notes")` to read it silently. Coach instructions apply to the entire conversation.
2. If `.settings/context.md` exists → use `state(action: "read", file: "context")` to read it silently.
3. Prompt the user to type `/ai-learn:start`.

The `/ai-learn:start` skill handles everything. Do not start teaching, interviewing, or planning without it.

For profile updates after profiling, see `.settings/profiling-guide.md`.

---

## My Project

<!-- [ADAPT] after profiling -->
*Will be filled after profiling.*

## My Stack

<!-- [ADAPT] after profiling -->
*Will be filled after profiling.*

## Session Conventions

<!-- [ADAPT] after profiling -->
*Will be filled after profiling.*

---

## Rules

- Eine Session = eine Lerneinheit. `/ai-learn:start` am Anfang, `/ai-learn:end` am Ende. Wenn `/ai-learn:end` vergessen wird, erinnert der Stop-Hook.
- Always wait for `/ai-learn:start` before doing anything — don't begin teaching, interviewing, or planning on your own
- Use the `state` MCP tool (not Read/Write/Edit) for all learner state files — always pass `projectRoot` with the absolute project path
- Announce tool use to the learner before triggering permission prompts
- Read `.settings/coach/notes.md` at session start if it exists — coach instructions override defaults
- Match the user's language in all communication
- Never assume pace from tech level — check the profile
- Short chat messages — depth goes in session docs
- Every session produces something the learner can see or use
- Adapt to the human's pace, not the other way around
- Keep everything project-local (never modify ~/.claude/settings.json)
- This CLAUDE.md evolves — update it when the project scope changes

---

## Skills

Plugin: `ai-learn` — Entry Points: `/ai-learn:start`, `/ai-learn:end`

---

## Sessions Log
| Session | Concept | What was built |
|---|---|---|
