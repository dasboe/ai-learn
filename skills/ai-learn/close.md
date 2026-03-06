# Session Closure

<!-- context: no-fork — Steps 1 + 4 require conversation context (session summary,
     context.md rewrite) that a forked agent wouldn't have. Must run in main thread. -->

Flow for session closure. Works for both pre- and post-graduation learners.

**All state file operations use MCP tools — see CLAUDE.md § Learner State.**

Read context and profile via `state(action: "read", file: "context")` and `state(action: "read", file: "profile")` before starting. Determine current session number from Sessions Log via `state(action: "read", file: "claude-md")`.

Check graduation status: `.settings/graduated` exists → post-graduation flow.

---

## Step 1 — Complete the session README

Finalize `sessions/session-{NN}/README.md`:

**Pre-graduation format:**
- **Key Takeaways**: 2–3 bullet points, concise
- **Files Created**: list all files produced
- **Next Session Preview**: one sentence

**Post-graduation format:**
- **What We Did**: brief summary
- **Key Decisions**: architectural or design decisions made
- **Open Questions**: what's still unresolved

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

## Step 4 — Rewrite context.md

This is the most important step. Read the current context.md and the session README, then **rewrite context.md completely** using this template:

```markdown
# Context — AI-LEARN

> Automatisch generiert. Wird nach jeder Session überschrieben.
> Letzte Aktualisierung: {date}

## Lerner-Kurzprofil
{2-3 Sätze: Wer, Tech-Level, Pace, Motivation-Driver}
{Referenz auf vollständiges Profil in .settings/learner-profile.md}

## Aktueller Stand
- Stufe: {1-5} — {Name der Stufe}
- Session: {letzte Session-Nummer}
- Graduation: {nein / ja seit {date}}

## Was bisher geschah
{Kompakte Zusammenfassung der bisherigen Lernreise — max 10 Zeilen.
Nicht was in jeder Session passiert ist, sondern: was kann der Lerner,
was waren Wendepunkte, was hat gut/schlecht funktioniert.}

## Beobachtungen
{Aktuelle Beobachtungen aus den letzten 2-3 Sessions:
Tempo-Abgleich, Stufen-Abgleich, Profil-Abweichungen.}

## Nächste Session
- Thema: {geplantes Thema}
- Warum: {kurze Begründung}
- Achtung: {falls relevant: Coach-Hinweise, offene Gaps, Besonderheiten}

## Graduation-Signale
{Nur pre-graduation: Welche der 5 Signale wurden beobachtet, seit wann}
```

**Stage update:** Update the stage (Stufe) based on observations from this session — not by checklist, but by what the learner demonstrated.

Write via `state(action: "write", file: "context")`.

---

## Step 5 — Check if profile needs updating

Read the current context.md observations section.

| Situation | Action |
|---|---|
| Consistent mismatch over 2–3 sessions | Update `.settings/learner-profile.md` using [profiling-guide.md](${CLAUDE_SKILL_DIR}/profiling-guide.md) |
| Single-session deviation | Note it in context.md, don't update yet |
| No mismatch | Skip |

---

## Step 6 — Graduation check (pre-graduation only)

Skip this step if `.settings/graduated` exists.

Read the Graduation-Signale section from context.md.

### Graduation signals

- Asks about the environment on their own?
- Transfers concepts from sandbox to other contexts?
- Expresses wanting to work on own project?
- Corrects or questions Claude output unprompted?
- Understands why CLAUDE.md exists (not just that it does)?

### Decision

| Signal pattern | Action |
|---|---|
| Readiness signals consistently present across 2–3 sessions | Suggest graduation (see below) |
| Mixed signals (some present, some missing) | Don't suggest. Note which are missing. Consider planning next session around gaps. |
| No clear signals | Continue normal sessions |
| **Edge case**: Technical + fast learner, all criteria met in Session 01 | May suggest after single session — don't hold back artificially |

### If suggesting graduation

1. **Propose naturally** in the learner's language. Adapt tone:

| Pace | Tone |
|---|---|
| Steady | Encouraging: "Du arbeitest schon sehr eigenständig..." |
| Fast | Direct: "Du bist bereit für dein eigenes Projekt." |

2. **If learner agrees:**
   - Create `.settings/graduated` (empty file — existence is the flag)
   - Update context.md: set "Graduation: ja seit {date}"
   - Flag to `.settings/coach/flags.md`: `### Graduation — {date}` with signals observed
   - Tell learner what changes: real project becomes workspace, learning env stays available

3. **If learner declines:**
   - Respect it. Don't push.
   - Note in context.md: "Graduation suggested, learner declined — {reason if given}"
   - Re-evaluate in 2–3 sessions.

---

## Step 7 — Post-graduation check (post-graduation only)

Skip this step if `.settings/graduated` does NOT exist.

| Signal | Assessment |
|---|---|
| Sets own tasks, makes decisions | Independent — on track |
| Waits for guidance, defers to Claude | May be struggling |
| Uses Claude as peer, questions output | Healthy |
| Falls back into student mode | May need support |

If struggling across 2–3 post-graduation sessions → flag to coach: "Learner may benefit from returning to guided sessions." Graduation is not a one-way door.

---

## Step 8 — Write coach flags (if needed)

Only flag what you cannot resolve through the context review.

| Flag-worthy | Not flag-worthy |
|---|---|
| Repeated concept failure despite correction | Normal learning struggles |
| Signs of frustration or disengagement | Occasional slow session |
| Uncertain dimension assessment | Minor pace adjustment needed |
| Learner consistently struggling post-graduation | Single rough session |
| Something learner said needing coach follow-up | Routine observations (→ context.md) |

Format: Append to `.settings/coach/flags.md`:
```markdown
### Session {NN} — {date}
- {specific observation — coach reads without session context}
```

If nothing needs flagging, skip this step.

---

## Step 9 — Close the session

- Preview next session (from context.md → Nächste Session)
- Tell user: session complete, close Claude
- Next time: open Claude, type `/start`
