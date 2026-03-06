# Onboarding — First-Time Setup

This file is loaded by the root skill when no `.settings/learner-profile.md` exists. It contains everything needed to run the profiling interview, create the learner profile, set up the project, and start Session 01.

**All state file operations use MCP tools — see CLAUDE.md § Learner State.**

---

## Context

This project uses a two-dimension learner model:

- **Technical experience** (non-technical / semi-technical / technical) — determines WHAT content to teach
- **Learning pace** (steady / moderate / fast) — determines HOW FAST and DEEP to go

These dimensions are independent. A non-technical person can be a fast learner (e.g. a strategist who doesn't code but thinks in systems). A technical person can be steady (e.g. a junior dev who needs time). Never assume one from the other.

---

## The interview

**Goal:** Understand who you're working with so you can adapt everything.

### How to run this
- Warm, relaxed conversation — not a test, not a checklist.
- Detect the user's language from their first message. Match it.
- Ask one or two questions at a time. Listen.
- The whole thing should take 5–10 minutes.

### What to discover

**Who they are beyond tech** — What do they do professionally? What are they good at? (communication, organization, domain expertise, people skills, creative work, analytical thinking, strategic planning) — These strengths matter and belong in the profile.

**Technical background** — Do they write code? What kind? (nothing / HTML-CSS / scripting / framework / fullstack) — Terminal comfort? — Used AI tools before? How? (just search / prompting / building with AI)

**How they think and learn** — Do they pick up new concepts quickly? (This can be abstract thinking, but also practical, spatial, or people-oriented intelligence.) Are they used to learning new tools or skills? Do they need to see results before understanding theory, or can they work with concepts first? Are they confident trying new things, or do they need reassurance? This determines pace and depth — independent of code ability.

**Learning context** — Why are they here? (curiosity, job, career switch, freelance efficiency) — Time per session? (15 / 30 / 60 min) — Prefer guided steps or free exploration?

**What motivates them** — What would make them come back for the next session? Listen for what lights them up. Common drivers: saving time on real tasks / being intellectually challenged / seeing creative ideas come to life / proving to themselves they're capable / understanding how things work. This is critical for choosing deliverables.

**Self-assessment** — What feels easy? What feels intimidating? — Ever tried learning something technical and quit? Why?

**Important:** Self-assessments are a starting point, not ground truth. Many learners misjudge themselves — in both directions. Someone may say "I'm not good with tech" but demonstrate sharp logical thinking. Someone may say "I learn fast" but need more repetition than expected. Record what the learner SAYS but also note what you OBSERVE during the interview itself (how quickly they follow questions, how precisely they express themselves, whether they show systems thinking without realizing it). When the two diverge, trust your observation for initial dimension assessment — but frame the profile respectfully. Don't contradict the learner's self-image; instead, leave room for the profile to evolve as real session data replaces self-assessment.

---

## Writing the learner profile

For the Reframing-Guide and profile structure, see [profiling-guide.md](${CLAUDE_SKILL_DIR}/profiling-guide.md).

---

## After the interview — determine the two dimensions

From the interview, assess two independent dimensions:

**Dimension 1 — Technical experience** (what CONTENT to teach)
- **Non-technical**: Has not worked with code. Starts with prompting, text files, practical AI use for their domain.
- **Semi-technical**: Some code or strong tool skills (e.g. HTML/CSS, advanced Excel, SQL, scripting, design tools). Can handle light technical content.
- **Technical**: Writes code in a framework or stack. Starts building immediately.

**Dimension 2 — Learning pace** (how FAST and DEEP to go)
- **Steady**: Needs small steps, lots of confirmation, concrete examples before abstraction. This can be due to unfamiliarity, low confidence, or preference for thoroughness — the reason matters for tone but not for pace. One concept per session, revisit often.
- **Moderate**: Comfortable with new concepts, needs some practice before moving on. One concept per session with hands-on application.
- **Fast**: Picks up abstractions quickly, thinks in systems, wants depth and challenge. Can handle ambitious sessions.

---

## After the interview — determine the initial stage (Stufe)

Based on the interview, set the initial stage:

| Tech level | CC experience | Initial stage |
|---|---|---|
| Non-technical | — | Stufe 1 |
| Semi-technical | — | Stufe 2 |
| Technical | No CC experience | Stufe 2 |
| Technical | Some CC experience | Stufe 3 |

The stage is written to context.md (see below), not to a separate file.

---

## After the interview — setup steps

### 1. Write `.settings/learner-profile.md`
Strengths first, then technical starting point, then learning preferences. Show it to the user, ask for confirmation.

### 2. Save a backup
Copy `CLAUDE.md` to `.settings/CLAUDE.md.bootstrap` (so the original template can always be restored).

### 3. Personalize `CLAUDE.md`
Replace the three `[ADAPT]` placeholders based on the two dimensions:

**My Project** — match their world, not a generic template:
- Non-technical + trades/business: "AI tools for my business — proposals, client communication, and project estimates created faster with AI."
- Non-technical + legal/consulting: "AI-enhanced professional workflows — research, document drafting, and analysis at a higher level with AI as a thinking partner."
- Non-technical + curiosity/retirement: "Exploring what AI can do — a personal learning journal documenting discoveries, experiments, and insights."
- Non-technical + office: "Practical AI skills for my daily work — prompts and templates that solve real problems in my job."
- Semi-technical + design: "From design to working prototype — using AI to bridge the gap between visual ideas and functional code."
- Semi-technical + data: "A data analysis project using Python and AI — turning messy spreadsheets into clean insights."
- Technical: "A full-stack web application in [their stack] — learning to use Claude Code as an integrated development partner."
- Technical + already AI-savvy: "Integrating Claude Code into my development workflow — evaluating advanced features for real-world use."

**My Stack** — match their tools:
- Non-technical: "Text files and prompts. Tools grow as I grow."
- Semi-technical + design: "HTML, CSS, and design tools. AI fills the gaps to working prototypes."
- Semi-technical + data: "Python scripts, Excel, maybe some SQL. AI handles the heavy lifting."
- Technical: "Vue 3, Express, MongoDB — or whatever the learner's preferred stack is."

**Session Conventions** — match pace and preferences:
- Steady: "30 min sessions. German. Very guided, one small concept per session, always check understanding before moving on. Visible wins every session."
- Fast: "60 min sessions. German. Ambitious, conceptual depth, challenge me. I'll say if it's too much."

Also update the bootstrap notice: replace the "This is the bootstrap version" blockquote with `> Personalisiert für den Lerner. Original-Template: \`.settings/CLAUDE.md.bootstrap\``

### 4. Create the project structure
Directories: `sessions/`, `reference/`, `project/`. The `.settings/coach/` directory with its README already exists in the project template.

### 5. Start Session 01

For the Session 01 decision table, see [session-01-table.md](${CLAUDE_SKILL_DIR}/session-01-table.md).

### 6. Create `.settings/context.md` at the end of Session 01

After Session 01 is complete, create the initial context.md using the following template:

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
- Graduation: nein

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

Write this via `state(action: "write", file: "context")`.
