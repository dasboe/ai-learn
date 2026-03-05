# Session Closure — Pre-Graduation

Complete end-of-session checklist for learners who have not yet graduated.

**All state file operations use MCP tools — see CLAUDE.md § Learner State.**

Read profile and progression via `read_profile` and `read_progression` before starting. Determine current session number from Sessions Log via `read_claude_md`.

---

## Step 1 — Complete the session README

Finalize `sessions/session-{NN}/README.md`:
- **Key Takeaways**: 2–3 bullet points, concise
- **Files Created**: list all files produced
- **Next Session Preview**: one sentence

This README is **frozen** after this step. Never edit past session READMEs.

---

## Step 2 — Update or create a reference page

Distill the session's concept into the appropriate `reference/` page.

| Do | Don't |
|---|---|
| Concise, findable lookup ("How does X work?") | Copy of the session README |
| Format for the learner (code examples for technical, how-to guides for non-technical) | One-size-fits-all |
| Update existing pages when topics overlap | Create a new page per session |

---

## Step 3 — Update the Sessions Log

Update the row in `## Sessions Log` in `CLAUDE.md` with what was actually created:
```
| {NN} | {Topic} | {What was actually created} |
```

---

## Step 4 — Update progression.md

Append under "Verlauf":

```markdown
### Session {NN} — {date}

**Beobachtungen**: What happened vs. expected? How did the learner handle the concept
compared to profile and current phase?

**Tempo-Check**: Pace right? Too fast / too slow / on track — and why?

**Phasen-Check**: Current phase still fit? Ready for next phase? Or phases need rewriting?
Phases are hypotheses — rewrite when reality diverges.

**Graduation-Check**: Does the learner show readiness signals? Observe — don't ask:
- Asks about the environment on their own?
- Transfers concepts from sandbox to other contexts?
- Expresses wanting to work on own project?
- Corrects or questions Claude output unprompted?
- Understands why CLAUDE.md exists (not just that it does)?
If multiple signals present, note them. Graduation emerges across sessions, not in one.

**Nächster Schritt**: Concrete topic for next session → starting point for next `/start`.
```

Update "Aktueller Stand" if the phase changed.

---

## Step 5 — Check if profile needs updating

Read last 2–3 Verlauf entries in `.settings/progression.md`.

| Situation | Action |
|---|---|
| Consistent mismatch over 2–3 sessions | Update `.settings/learner-profile.md` using `.settings/profiling-guide.md` |
| Single-session deviation | Note it, don't update yet |
| No mismatch | Skip |

---

## Step 5.5 — Graduation trigger

Read last 2–3 Graduation-Check entries from `.settings/progression.md`.

### Decision

| Signal pattern | Action |
|---|---|
| Readiness signals consistently present across 2–3 sessions | Suggest graduation (see below) |
| Mixed signals (some present, some missing) | Don't suggest. Note which are missing. Consider planning next session around gaps. |
| No clear signals | Continue normal sessions |
| **Edge case**: Technical + fast learner, all 7 criteria met in Session 01 | May suggest after single session — don't hold back artificially |

### If suggesting graduation

1. **Propose naturally** in the learner's language. Adapt tone:

| Pace | Tone |
|---|---|
| Steady | Encouraging: "Du arbeitest schon sehr eigenständig..." |
| Fast | Direct: "Du bist bereit für dein eigenes Projekt." |

2. **If learner agrees:**
   - Update `.settings/progression.md` "Aktueller Stand" → `Graduation erreicht — {date}`
   - Flag to `.settings/coach/flags.md`: `### Graduation — {date}` with signals observed
   - Tell learner what changes: real project becomes workspace, learning env stays available

3. **If learner declines:**
   - Respect it. Don't push.
   - Note: "Graduation suggested, learner declined — {reason if given}"
   - Re-evaluate in 2–3 sessions.

---

## Step 6 — Write coach flags (if needed)

Only flag what you cannot resolve through the progression review.

| Flag-worthy | Not flag-worthy |
|---|---|
| Repeated concept failure despite correction | Normal learning struggles |
| Signs of frustration or disengagement | Occasional slow session |
| Uncertain dimension assessment | Minor pace adjustment needed |
| Something learner said needing coach follow-up | Routine observations (→ progression.md) |

Format: Append to `.settings/coach/flags.md`:
```markdown
### Session {NN} — {date}
- {specific observation — coach reads without session context}
```

If nothing needs flagging, skip this step.

---

## Step 7 — Close the session

- Preview next session (from "Nächster Schritt")
- Tell user: session complete, close Claude
- Next time: open Claude, type `/start`
