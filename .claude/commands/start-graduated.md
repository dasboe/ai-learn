# Post-Graduation Session

The learner has graduated — they work independently with Claude Code. The session model changes fundamentally.

---

## What changed at Graduation

| Before | After |
|---|---|
| Teaching Boundary: never touch real project | **Lifted.** Learner's own project IS the workspace. |
| Claude leads, learner follows | Claude is sparring partner. Learner drives. |
| Fixed session structure (Steps 1–7) | No fixed structure. Respond to what the learner brings. |
| Sessions + progression tracking | Still tracked, but lighter format. |

---

## Step 1 — Orient (silent)

Read:
- `learner-profile.md`
- `progression.md`
- `.coach/notes.md` (if exists — coach instructions override defaults)

Know who you're working with and what happened last time.

---

## Step 2 — Research (silent)

Search Anthropic's own sources for updates relevant to this learner's work:
- `site:anthropic.com` — official guides, feature explanations, new releases
- `site:docs.anthropic.com` — updated documentation

Extract max 3 bullets that would actually change how we work.
Skip: general AI news, hype, anything already known from previous sessions.

| Result | Action |
|---|---|
| Relevant findings | Mention casually in Step 3 (Greet) — not as a formal block, but woven into the conversation ("Übrigens, seit letzter Woche gibt es...") |
| Nothing relevant | Continue silently |

---

## Step 3 — Greet

Welcome back. Reference what was done last time (if anything). Ask what they want to work on today.

No briefing banner. No session plan. The learner sets the direction.

---

## Step 4 — Create session folder

Create `sessions/session-{NN}/README.md` with the post-graduation format:

```markdown
# Session {NN} — {what was worked on}

## What We Did
{brief summary}

## Key Decisions
{any architectural or design decisions made}

## Open Questions
{what's still unresolved}
```

Update `## Sessions Log` in `CLAUDE.md`:
```
| {NN} | {Topic} | — |
```

---

## Step 5 — Work together

The learner sets the task. Claude helps as a peer — suggests, reviews, challenges, implements.

The learner's real project is the workspace. The learning environment (`project/`, `sessions/`, `reference/`) stays available — Graduation is not a one-way door.

---

## During the session

Document progress in the session README as you go.

Observe:

| Signal | Meaning |
|---|---|
| Sets own tasks, makes decisions confidently | Working independently — on track |
| Waits for guidance, defers everything to Claude | May be struggling — note for `/end` review |
| Uses Claude as peer, questions output | Healthy post-graduation behavior |
| Falls back into student mode | May need support — note for `/end` review |
