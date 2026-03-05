# Session Closure — Post-Graduation

End-of-session checklist for graduated learners.

**All state file operations use MCP tools — see CLAUDE.md § Learner State.**

Read profile and progression via `read_profile` and `read_progression` before starting. Determine current session number from Sessions Log via `read_claude_md`.

---

## Step 1 — Complete the session README

Finalize `sessions/session-{NN}/README.md` (post-graduation format):
- **What We Did**: brief summary
- **Key Decisions**: architectural or design decisions made
- **Open Questions**: what's still unresolved

This README is **frozen** after this step.

---

## Step 2 — Update or create a reference page

Distill the session's concept into the appropriate `reference/` page.

| Do | Don't |
|---|---|
| Concise, findable lookup ("How does X work?") | Copy of the session README |
| Format for the learner's level | One-size-fits-all |
| Update existing pages when topics overlap | Create a new page per session |

---

## Step 3 — Update the Sessions Log

Update the row in `## Sessions Log` in `CLAUDE.md`:
```
| {NN} | {Topic} | {What was actually created} |
```

---

## Step 4 — Update progression.md

Append under "Verlauf":

```markdown
### Session {NN} — {date}

**Beobachtungen**: What was worked on? How did it go?

**Post-Graduation-Check**: Is the learner working independently?

| Signal | Assessment |
|---|---|
| Sets own tasks, makes decisions | Independent — on track |
| Waits for guidance, defers to Claude | May be struggling |
| Uses Claude as peer, questions output | Healthy |
| Falls back into student mode | May need support |

If struggling across 2–3 post-graduation sessions → flag to coach:
"Learner may benefit from returning to guided sessions."
Graduation is not a one-way door.

**Nächster Schritt**: What the learner wants to work on next (if known).
```

Update "Aktueller Stand" if needed.

---

## Step 5 — Check if profile needs updating

Read last 2–3 Verlauf entries.

| Situation | Action |
|---|---|
| Consistent mismatch over 2–3 sessions | Update `.settings/learner-profile.md` using `.settings/profiling-guide.md` |
| Single-session deviation | Note it, don't update yet |

---

## Step 6 — Write coach flags (if needed)

Only flag what you cannot resolve through the progression review.

| Flag-worthy | Not flag-worthy |
|---|---|
| Learner consistently struggling post-graduation | Single rough session |
| Signs of frustration or disengagement | Normal project challenges |
| Learner may benefit from guided sessions again | Minor questions |

Format: Append to `.settings/coach/flags.md`:
```markdown
### Session {NN} — {date}
- {specific observation — coach reads without session context}
```

If nothing needs flagging, skip this step.

---

## Step 7 — Close the session

- Preview next session if the learner mentioned plans
- Tell user: session complete, close Claude
- Next time: open Claude, type `/start`
