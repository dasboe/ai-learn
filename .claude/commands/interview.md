# Interview — First-Time Setup

This file is read by the `/start` skill when no `learner-profile.md` exists. It contains everything needed to run the profiling interview, create the learner profile, set up the project, and start Session 01.

---

## Context

This project uses a two-dimension learner model:

- **Technical experience** (non-technical / semi-technical / technical) → determines WHAT content to teach
- **Learning pace** (steady / moderate / fast) → determines HOW FAST and DEEP to go

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

The profile is a **dual-audience document**: the learner reads it and feels accurately described. Claude reads it and knows exactly how to teach. Every trait — including difficult ones — must be encoded as a behavioral description with an implicit teaching instruction. Write the profile in the learner's language.

**Core principle:** Describe observable learning behavior + what Claude should do. Never label the person.

**Reframing guide:**

| What you observe | What you write in the profile | What Claude understands |
|---|---|---|
| Resistant, doesn't want to learn | "Convinces themselves through concrete value in their own daily life — not through explanations or demos" | Show immediate practical benefit, don't sell or motivate |
| Learns very slowly | "New concepts land best through repeated practical application — one concept per session, revisit across multiple sessions before adding something new" | Very slow pace, don't move on until it truly sticks |
| Misunderstands often | "Forms own mental models quickly — these should be actively checked and gently corrected before building on them" | Will misunderstand things, verify comprehension at every step |
| Gets frustrated easily | "Momentum comes from small visible wins — long explanations without results break focus" | Keep cycles short, show output fast, don't lecture |
| Lacks confidence | "Works best when each step is confirmed before moving to the next" | Needs reassurance, validate progress explicitly |
| Doesn't ask when confused | "May move on quietly when something is unclear — check understanding proactively, don't wait for questions" | Won't tell you they're lost, you have to check |

**Structure of the profile:**
1. **What I bring** — professional strengths, life experience, non-technical skills (always first)
2. **Where I stand with tech** — neutral phrasing: "has not worked with X yet", not "cannot do X"
3. **How I think and learn** — pace, abstraction level, learning patterns (behavioral reframing goes here)
4. **What drives me** — the motivation type, in the learner's own words. This determines what deliverables feel rewarding.
5. **What I'm here for** — goals in the learner's own words

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

## After the interview — setup steps

### 1. Write `learner-profile.md`
Strengths first, then technical starting point, then learning preferences. Show it to the user, ask for confirmation.

### 2. Save a backup
Copy `CLAUDE.md` to `CLAUDE.md.bootstrap` (so the original template can always be restored).

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

Also update the bootstrap notice: replace the "This is the bootstrap version" blockquote with `> Personalisiert für den Lerner. Original-Template: \`CLAUDE.md.bootstrap\``

### 4. Create `reference/profiling-guide.md`
Extract the profile writing rules (reframing guide, profile structure) into this file. This becomes the reference for future profile updates.

### 5. Create `progression.md`
Use these templates as a starting point — then translate them into the learner's world. An electrician's Phase 2 is "Angebote und Kundenkommunikation gezielt steuern", not "Prompt-Patterns lernen."

**Non-technical:**
1. AI erleben — erste brauchbare Ergebnisse erzeugen
2. Gezielt steuern — Qualität bewusst beeinflussen
3. Eigene Abläufe — wiederkehrende Aufgaben systematisieren
   *(Hier: Claude richtet project/CLAUDE.md ein, Lerner nutzt es implizit)*
4. Selbstständig — eigene Claude-Code-Umgebung verstehen und anpassen
   *(Graduation-Meilenstein: Manche erreichen ihn, viele nicht — beides ist okay)*

**Semi-technical:**
1. AI als Verstärker — vorhandene Skills erweitern
2. Zusammenspiel — eigene Tools und AI verbinden
   *(Hier: project/ wird zur Claude-Code-Umgebung, Lerner versteht Grundlagen)*
3. Eigene Projekte — komplexere Aufgaben mit Claude Code umsetzen
4. Integration — eigene Claude-Code-Umgebungen für die Arbeit einrichten
   *(Graduation-Meilenstein: Lerner kann eigenständig CC-Projekte aufsetzen)*

**Technical:**
1. Claude Code als Partner — Zusammenarbeit und Kontext
2. Projekt-Workflow — CLAUDE.md, Kontext, effektives Arbeiten
3. Erweiterte Features — MCPs, Hooks, Skills nach Bedarf
4. Architektur — Subagents, komplexe Workflows, Team-Integration

Phases are hypotheses. They are reviewed after every session in `progression.md` and rewritten when they no longer fit.

### 6. Create the project structure
Directories: `sessions/`, `reference/`, `project/`. The `.coach/` directory with its README already exists in the project template.

### 7. Start Session 01
See below.

---

## Session 01 — Decision Table

The first session after profiling is critical. It must produce an immediate win. Use both dimensions.

| Tech level | Pace | Approach | Deliverable | Key rule |
|---|---|---|---|---|
| Non-technical | Steady | One example from their daily life. Walk slowly. Celebrate. End early if needed. | File they created through prompting | No tech, no CLAUDE.md, no project setup |
| Non-technical | Moderate | Start from daily life. Show 1–2 variations. Build confidence. | File with practical AI output | No tech, no CLAUDE.md, no project setup |
| Non-technical | Fast | Start from daily life, then show how prompt changes affect output. 2–3 outputs. Name "prompt engineering." | Multiple outputs showing prompt impact | Can be conceptual — still no code |
| Semi-technical | Any | Bridge from their tools (design→HTML, data→script). AI as amplifier, not replacement. | Domain artifact, created faster | Mention `project/` will become CC environment later (naturally, not lecture) |
| Technical | Steady | Build small thing together in `project/`. Learner steers, Claude suggests. Review `project/CLAUDE.md` together. | Something they reviewed and approved | Don't scaffold from scratch — can overwhelm |
| Technical | Moderate/Fast | Jump in. `project/` = real CC project. Set up `project/CLAUDE.md` in their stack. | CC environment + something running | Focus on Claude Code as dev partner |
| Technical + AI-savvy | Fast | Skip prompting basics. CC differentiators (CLAUDE.md, context, multi-file). Learner writes own CLAUDE.md. | Own CC environment | May graduate immediately if all signals present |

### Entry points for non-technical learners

Don't start from a script. Find their entry:

| Learner context | Opening question |
|---|---|
| Has a job | "What takes too long or annoys you in your daily work?" |
| Complex profession | "Where would a sharp second opinion help?" |
| Curiosity / retired | "What made you curious about AI? What would you like to try?" |

Use their answer to demonstrate what AI can generate, rewrite, analyze, or structure.

### Key principles

- `project/` is just a folder for files in Session 01. The CC environment grows implicitly in later phases.
- Many non-technical learners will never reach Graduation — that's fine.
- For technical+fast learners: observe whether the sandbox still adds value or they should work on their own project directly.
