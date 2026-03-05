# AI-LERN Bootstrap — Design Decisions

> This document is for developers and AI instances working on the bootstrap.
> It explains the reasoning behind every major design choice.
> Not for end users — they read README.md.

---

## What this system is

A single CLAUDE.md that bootstraps a personalized AI learning environment. The user clones a repo, starts Claude Code, and types `/start`. Claude interviews them, creates a learner profile, personalizes the CLAUDE.md, and starts a session loop. No curriculum, no predefined content — Claude adapts everything based on who the learner is.

## The core problem this solves

People have wildly different backgrounds but the same goal: get better at working with AI. A system that treats a 45-year-old office worker the same as a senior fullstack developer will fail both. The office worker gets overwhelmed, the developer gets bored. Most learning systems solve this with difficulty levels (beginner/intermediate/advanced) — but that's one-dimensional and maps poorly to reality.

---

## Why two dimensions instead of levels

### Why not linear levels?

A simple three-level model based on coding ability (no code / some code / experienced) conflates two independent things:
- **What content to teach** (determined by technical experience)
- **How fast and deep to go** (determined by cognitive speed and abstraction ability)

A strategic manager who doesn't code but thinks in systems would be put in "beginner" and treated like a slow learner. A finance expert who thinks in models would get the same baby-step treatment. Both would quit.

A non-technical person can be intellectually fast. A technical person can need slow, guided steps. Same tech level, completely different pace. Linear levels can't express this.

### The solution: two independent axes

**Dimension 1 — Technical experience** (non-technical / semi-technical / technical)
→ Controls WHAT content Claude teaches (prompting & text workflows / scripts & data / code & architecture)

**Dimension 2 — Learning pace** (steady / moderate / fast)
→ Controls HOW FAST Claude moves, how deep explanations go, how much challenge per session

These combine into a matrix (see Test Personas for who occupies each cell):

```
                    Learning pace
                    Steady          Moderate        Fast
Tech level
Non-technical       Markus          Nils            Priya
Semi-technical       —              Jens             —
Technical           Fatima           —              Chen Wei
```

The key rule, stated explicitly in CLAUDE.md: **Never assume pace from tech level.**

---

## The dual-audience learner profile

### The problem

Claude needs honest information to teach well. If a learner is slow, resistant, or misunderstands things frequently, Claude needs to know. But the learner reads their own profile. A profile that says "learns slowly, resistant to new things, frequently misunderstands concepts" is accurate but demoralizing. The learner reads it and thinks "I'm dumb."

### The solution: behavioral reframing

Every trait — including difficult ones — is written as a behavioral description that doubles as a teaching instruction for Claude.

| Reality | What the profile says | What Claude extracts |
|---|---|---|
| Learns very slowly | "New concepts land best through repeated practical application — one concept per session, revisit across multiple sessions" | Very slow pace, lots of repetition needed |
| Resistant to learning | "Convinces herself through concrete value in her daily work, not through explanations" | Don't sell, don't motivate — show immediate practical benefit |
| Misunderstands often | "Forms her own mental models quickly — these should be actively checked and gently corrected" | Will misunderstand, verify comprehension at every step |
| Doesn't ask when confused | "May move on quietly when something is unclear — check understanding proactively" | She won't tell you she's lost, you have to ask |

The learner reads: "I learn through practice, at my own pace, I think independently."
Claude reads: "Slow, needs repetition, will misunderstand, check constantly."

Same information, completely different emotional impact.

### The key principle

**Describe observable behavior + teaching instruction. Never label the person.**

"Has not worked with code yet" instead of "cannot code."
"Convinces herself through concrete value" instead of "resistant to learning."

### Profile structure

1. **What I bring** — professional and personal strengths FIRST (always). Non-technical strengths matter: communication, domain expertise, analytical thinking, people skills. A finance expert who "can't code" is still an expert at something.
2. **Where I stand with tech** — neutral starting point, not deficit list.
3. **How I think and learn** — behavioral reframing goes here. This is where Claude gets its teaching instructions.
4. **What drives me** — the motivation type, in the learner's own words. This determines what deliverables feel rewarding (see "Motivation-driven deliverables" below).
5. **What I'm here for** — goals in the learner's own words.

---

## Why the CLAUDE.md personalizes itself

### The mechanism

After profiling, Claude:
1. Backs up the original as `.settings/CLAUDE.md.bootstrap`
2. Fills in `[ADAPT]` sections with personalized content (project description, stack, session conventions)

### Why not a separate config file?

Claude reads CLAUDE.md at the start of every conversation. It's the primary steering document. If personalization lives in a separate file (like `learning-plan.md`), Claude has to remember to read TWO files, cross-reference them, and resolve conflicts. Keeping everything in one file means one source of truth.

### Why [ADAPT] markers instead of full rewrite?

A full rewrite would be too risky — Claude could delete the First Contact Protocol, the Rules, the Teaching Boundary. The [ADAPT] approach is surgical: only marked sections change, the skeleton survives. If Claude messes up one section, the rest is intact.

### Where are the interview instructions?

The interview instructions (profiling questions, profile writing guide, reframing guide, Session 01 Guide) live in `.claude/commands/interview.md` — a separate file that's only loaded when `/start` detects no profile exists. This keeps the CLAUDE.md lean from the start: the bootstrap version never contains interview instructions in the main file. After profiling, a copy of the reframing guide is also saved to `reference/profiling-guide.md` for when Claude needs to update the profile later. See "Why the CLAUDE.md shrinks after profiling" below.

---

## Why no external MCPs (Context7 etc.) in the bootstrap

Context7 provides live library documentation — invaluable for technical learners working with frameworks. But:

- Non-technical and semi-technical learners don't use libraries. Context7 adds zero value for them.
- MCP is better introduced as a SESSION TOPIC: "Today we learn how to extend Claude Code — and install our first tool." The learner understands WHY it's there instead of just having it.

The internal `ai-learn-state` MCP server is a different case — it manages learner state silently and is part of the bootstrap infrastructure. External MCPs like Context7 are teaching content, not infrastructure.

This is a conscious tradeoff: minimal bootstrap > pre-configured bootstrap.

---

## Why conditional web search in session starts

The original single-user version (`/new-session`) searched Anthropic sources at every session start. The generic system makes this conditional:

- **Non-technical + Semi-technical**: No search. Content is domain-specific, not feature-driven.
- **Technical Phase 1**: No search. Focus is on basic Claude Code partnership — the learner needs to understand the tool, not its changelog.
- **Technical Phase 2+**: Search for session-topic-relevant updates from Anthropic sources. Findings inform session planning and appear in the briefing.
- **Post-graduation**: Always search. The learner works independently and needs current information. Findings are woven into the greeting conversationally, not as a formal block.

This preserves the "minimal bootstrap" principle while ensuring technical learners don't work with outdated patterns. The search is targeted (Anthropic sources only, max 3 bullets, skip noise) to avoid context bloat.

---

## Why no explicit curriculum / roadmap

The session progression is intentionally implicit. Claude determines the next topic based on:
- The learner profile (dimensions)
- The Sessions Log (what was already covered)
- The content type rules in `start-session.md` Step 4 (what content maps to which tech level and phase)
- `.settings/progression.md` (current phase, last observations, planned next step)

A predefined roadmap would:
- Conflict with the adaptive nature of the system
- Need to be maintained for every dimension combination (3 × 3 = 9 paths minimum)
- Become a constraint rather than a guide

The current approach trusts Claude to plan sensible progressions. This works well for ~5-6 sessions. Beyond that, the gap is filled by `.settings/progression.md` — a living document with hypothesis-based phases that Claude checks and adjusts after every session. See "Why progression.md exists" below for the full rationale.

---

## Why an integrity check instead of blind trust

### The problem: cross-session drift

Each session runs in a fresh Claude instance. Drift doesn't happen within a conversation — it happens **through the persisted files**. If Claude in Session 5 accidentally deletes a rule from CLAUDE.md, Session 6 starts on a corrupted foundation. The drift compounds silently: each session inherits the previous session's mistakes.

The dangerous part: the learner never notices. And Claude in Session 6 can't detect what Claude in Session 5 broke — because it has no memory of what the file should look like.

### Why at `/start`, not `/end`

An integrity check at `/end` would use the **same instance** that potentially caused the drift. A drifted Claude checking itself is unreliable.

At `/start`, a **fresh instance** — with no drift from previous sessions — reads the files cold and compares them against the bootstrap backup. It's an external validator, not a self-assessment.

### What the check covers

The integrity check (Step 1 in `start-session.md`) runs four mechanical checks before any session work begins:

**A. Structural check** — do required files exist? (`.settings/learner-profile.md`, `.settings/progression.md`, `.settings/CLAUDE.md.bootstrap`, `sessions/`). Missing files are either critical (no profile → stop) or repairable (no sessions dir → create it).

**B. CLAUDE.md drift check** — diff against the bootstrap backup. Immutable sections (Rules, Teaching Boundary, Skills, First Contact Protocol) must match the bootstrap exactly. If content was removed or altered, restore it. Personalized sections (My Project, My Stack, Session Conventions) should differ — but if they still contain the bootstrap placeholder, profiling didn't complete properly.

**C. Progression.md size check** — after 15+ sessions, the Verlauf section gets too long for reliable parsing. Older entries are compressed, recent ones kept intact.

**D. Silent reporting** — if everything is fine, the learner sees nothing. If repairs were needed, they're logged to `.settings/coach/flags.md` for the coach.

### What it can and cannot catch

The check catches **structural drift** — deleted rules, missing files, corrupted tables, bloated progression files. These are mechanically verifiable: compare file A to file B, check if file exists, count entries.

It cannot catch **behavioral drift** — did Claude teach at the wrong pace? Did it ignore the motivation driver? Did it work on the learner's real project instead of the learning project? These require judgment, which is exactly what the coach layer is for.

### Design principle: mechanical checks only

Every check is a file comparison or existence check. No interpretation, no "does this feel right?" questions. This is deliberate: a check that requires Claude's judgment is subject to the same drift it's trying to detect.

### Scenarios that remain self-healing (no guardrails needed)

**`/start` before profiling:** Handled by the router — `start.md` checks for `.settings/learner-profile.md` and routes to the interview if it doesn't exist. The integrity check in `start-session.md` never runs in this case.

**Learner reads the flow files:** The interview and session flows live in `.claude/commands/`, not in CLAUDE.md itself. If a learner finds and reads them, they're tech-savvy enough to understand what they are.

**Sessions log gets corrupted:** Claude can extract the last entry from a malformed markdown table. Additionally, the integrity check reconstructs the log from session READMEs if the table is empty despite existing sessions.

**Session aborted mid-way:** Half-filled README is visible at next session start. Claude sees where things stopped and can continue.

---

## Why progression.md exists

### The problem it solves

Without a navigation document, Claude determines the next topic from the learner profile, the sessions log, and memory. This works for ~5-6 sessions where the natural "what comes next?" is obvious. Beyond that, topic decisions happen from scratch every conversation — Claude has to reconstruct where the learner is, what direction they're heading, and whether the pace is right. Memory helps but is unstructured and spread across entries.

Three questions need a persistent answer:
1. **Where are we?** — Not "what did we do last" (sessions log), but "where does this sit in the bigger learning journey?"
2. **Where are we going?** — Not "what's the next topic?" (ephemeral), but "what's the learning trajectory?"
3. **Is the path right?** — Not "is the pace right?" (profile review), but "are we even heading in the right direction?"

### Why not a curriculum?

A predefined curriculum would need 9 paths minimum (3 tech levels × 3 paces) and becomes a constraint rather than a guide. But relying purely on Claude's judgment starts failing at session 10+ because accumulated context becomes fragmented.

### The solution: progression.md as a living navigation document

`.settings/progression.md` sits between the learner profile (who) and the sessions log (what). It answers: **where are we, where are we going, and is it working?**

It contains:
- **Phases**: 3-4 learning phases, personalized to the learner's world. These are hypotheses, not curriculum. They describe what the learner can DO at each stage, in their own domain language. Non-technical and semi-technical phases include Claude Code transition points (when `project/` gets its own CLAUDE.md).
- **Current position**: Which phase, since when — or `Graduation erreicht — {date}` when the learner has graduated. This marker is what `/start` checks for three-way routing.
- **Verlauf**: After every session, Claude appends an entry with observations, tempo check, phase check, and the planned next step. Pre-graduation entries include a **Graduation-Check** (5 observation signals for readiness). Post-graduation entries replace this with a **Post-Graduation-Check** (independence signals — is the learner working autonomously or falling back into student mode?).

### Why phases are hypotheses

Fixed phase templates ("Phase 1: Prompting basics, Phase 2: Prompt patterns, Phase 3: CLAUDE.md, Phase 4: MCPs") don't work. A non-technical electrician's Phase 4 should never be "MCPs" — it should be "eigenständig neue Aufgaben mit AI erschließen." And even that might be wrong once Claude sees how the learner actually progresses.

Phases are created after profiling based on templates per tech level, then translated into the learner's domain. After every session, Claude checks: does this phase still make sense? Are the phases themselves well-defined? If reality diverges from the hypothesis, Claude rewrites the phases — not the learner's behavior.

### Why every session, not every 3 sessions

Profile dimensions (pace, tech level) only update after 2-3 sessions of consistent mismatch — you don't change someone's pace classification after one good session. But progression tracking needs tighter feedback: a topic that was planned for next session might be wrong after today's session revealed a gap. The "Nächster Schritt" must be assessed every time.

The profile update threshold (2-3 sessions of consistent evidence) is preserved — it's triggered by patterns in the Verlauf entries, not by a single observation.

### How responsibilities are split

Without a dedicated progression document, pace observations would scatter across memory, session-end reviews, and the sessions log. `.settings/progression.md` bundles all progression tracking in one place:

- **`.settings/progression.md`**: Phases, pace observations, phase checks, next steps — everything about trajectory
- **Memory**: General learnings (preferences, what resonated) — not progression tracking
- **Sessions Log**: Compact lookup table of what happened — stays in CLAUDE.md
- **`.settings/learner-profile.md`**: Who the learner is — updates only when `.settings/progression.md` shows consistent mismatch over 2-3 sessions

### How it integrates

Four touch points:
1. **First Contact Protocol** (CLAUDE.md): Reads `.settings/coach/notes.md` — and via `/start`, also `.settings/progression.md`
2. **Session start flows** (`start-session.md`, `start-graduated.md`): Orient step reads `.settings/progression.md`; Research step (conditional) searches Anthropic sources for current information; "Nächster Schritt" is the starting point for topic planning
3. **Session end flows** (`end-session.md`, `end-graduated.md`): Update `.settings/progression.md` — observations, tempo/phase check, graduation or post-graduation check, next step
4. **Coach review** (`.settings/coach/README.md`): Checklist item — "is the phase progression sensible?"

### What it doesn't replace

- `.settings/learner-profile.md`: Who the learner is. Identity, dimensions, motivation. Changes rarely.
- Sessions Log: Compact reference of what happened. Changes every session but stays in CLAUDE.md for quick lookup.
- `.settings/coach/flags.md`: Observations needing human judgment. Progression problems that Claude can resolve stay in `.settings/progression.md`; problems Claude can't resolve go to flags.

---

## Why the CLAUDE.md shrinks after profiling

### The problem

Claude reads CLAUDE.md at the start of every conversation. The bootstrap version contains `[ADAPT]` sections with examples and comments that guide personalization. After profiling, these are replaced with concrete values — but the CLAUDE.md should also get leaner overall.

### Two-stage reduction

The CLAUDE.md gets smaller in two ways:

1. **At bootstrap design time**: Session flows live in separate files under `.claude/commands/` — interview, session, graduated, and closure flows are loaded on demand by thin routers. The bootstrap CLAUDE.md only contains rules and config, not execution logic.

2. **After profiling**: Claude backs up the original as `.settings/CLAUDE.md.bootstrap`, fills in the `[ADAPT]` sections (replacing verbose comments with concrete values), and saves the reframing guide to `reference/profiling-guide.md` for later profile updates.

### Why the reframing guide needs to persist

The reframing guide — the table that maps observations to behavioral descriptions — is needed whenever Claude updates the learner profile (which happens when `.settings/progression.md` shows consistent mismatch over 2-3 sessions). It lives in `reference/profiling-guide.md` so it's available when needed but not loaded every conversation.

### Safety

If the personalized CLAUDE.md gets corrupted or Claude fills the [ADAPT] sections poorly: restore from `.settings/CLAUDE.md.bootstrap`. The bootstrap always contains the full template.

---

## Why one instance per session

### The rule

Each learning session runs in a fresh Claude instance. The user opens Claude, types `/start`, works through the session, and closes Claude when done. No multi-session conversations, no continuing from where a previous conversation left off.

### Why this matters

1. **Clean context window.** Claude reads the profile, progression.md, and coach notes from scratch every time. No stale conversation context bleeding between sessions. What Claude "remembers" comes from files, not from an increasingly compressed conversation history.

2. **Reliable state.** The `/start` router delegates to a path-specific flow file. Pre-graduation: integrity check → orient → research (conditional) → plan → create folder → brief → update log. Post-graduation: orient → research → greet → work → session folder. Each flow is self-contained — Claude only reads the steps relevant to the current path. If Claude starts a session mid-conversation after other back-and-forth, it might skip steps or carry assumptions from earlier messages.

3. **Session boundaries are real.** A session has a start (briefing), a middle (building), and an end (README, progression update, log update). Closing the instance enforces the end boundary. Without it, sessions blend into each other and the end-of-session protocol (which includes the critical progression.md update) might be skipped.

4. **Non-technical users need simple rules.** "Open Claude, type `/start`, close when done" is a ritual anyone can follow. "Continue the conversation, or start a new one, or type a command, or just say something" is a decision tree that creates confusion.

### What about the first session?

The first session follows the same ritual: open Claude, type `/start`, close when done. The `/start` skill detects that no profile exists yet and routes to the interview automatically. The user doesn't need to know or do anything different.

### What persists between instances

Everything the learner needs is in files:
- `.settings/learner-profile.md` — who they are
- `.settings/progression.md` — where they are, where they're going, what to do next
- `sessions/` — what they've done
- `reference/` — what they've learned
- Auto-memory — general learnings and preferences

The conversation itself is ephemeral. The files are the source of truth.

---

## The /start and /end skills

### Why a single entry point

The user types `/start` every time — first session and every session after. The user types `/end` when a session is done. Two commands, always the same. "Open Claude, type `/start`, close when done" — that's the entire ritual, from day one.

### Router + flow files

Both skills are **thin routers** (~15 lines) that delegate to path-specific flow files. Claude only reads the file relevant to the current path — never the others.

**`/start` routes:**

| Condition | Target file |
|---|---|
| No profile | `interview.md` (~185 lines) |
| Graduated | `start-graduated.md` (~95 lines) |
| Otherwise | `start-session.md` (~195 lines) |

**`/end` routes:**

| Condition | Target file |
|---|---|
| Graduated | `end-graduated.md` (~95 lines) |
| Otherwise | `end-session.md` (~130 lines) |

### Why this split

The original design packed all paths into a single file per skill. `start.md` was 268 lines containing the interview routing, the integrity check, the normal session flow, Session 01 guidance, graduation criteria, AND the post-graduation flow. Claude read all of it every time — even though only one path applied per session.

This created three problems:

1. **Irrelevant context dilutes attention.** When Claude reads 268 lines but only 80 apply, it processes 188 lines of "skip this" instructions. Studies on LLM instruction-following show that irrelevant context degrades compliance — especially for steps in the middle of long documents (position bias).

2. **Conditional prose is hard to parse.** "If graduated, skip Steps 0.5–5 and go to the Post-Graduation section at the end" requires Claude to navigate a document non-linearly. A router that loads only the relevant file eliminates this entirely.

3. **Decision density per file.** A file with 3 tech levels × 3 paces × pre/post-graduation contains many decision branches. Splitting by path means each file only has the branches relevant to that path.

The interview was already separate (loaded on demand by `/start`). The new architecture extends this pattern to all paths.

### Why decision tables instead of prose

The flow files use tables for all conditional logic:

| Instead of | Use |
|---|---|
| "For steady learners, explain everything. For fast learners, skip obvious things." | A pace × approach table |
| "Non-technical learners should get prompting content. Semi-technical learners should get..." | A tech-level × content table |
| "If the learner struggles, slow down. If they fly through it, add depth." | A behavior × response table |

Tables are faster to scan than paragraphs of if/then prose. Claude can look up the relevant row by matching the learner's dimensions, rather than parsing conditional sentences to find the applicable clause.

### Why the integrity check is in `/start`, not `/end`

See "Why an integrity check instead of blind trust" above. The short version: a fresh instance at session start can detect what the previous instance broke. The same instance at session end cannot reliably check itself. The integrity check lives in `start-session.md` — it only runs for returning pre-graduation learners (post-graduation and first-time paths don't need it).

### Why flow files don't repeat CLAUDE.md context

The original `start.md` included a "Context: Two-dimension model" section re-explaining the dimensions. The flow files omit this — CLAUDE.md is always loaded and contains the system context. The flow files reference dimension values (via tables) without re-explaining what dimensions are. This reduces duplication and keeps flow files focused on execution.

---

## File inventory

```
bootstrap/
├── README.md                        → For users. Setup instructions, FAQ.
├── bootstrap.md                     → URL entry point: clone instructions for fresh Claude Code instances.
├── CLAUDE.md                        → For Claude. System rules + learner config + MCP tool table.
├── DESIGN.md                        → For developers/AI. This file. Design rationale.
├── .mcp.json                        → Project-local MCP server registration (auto-detected by Claude Code).
├── .gitignore                       → Standard ignores (node_modules, .env, .DS_Store, .settings/coach/)
├── .settings/
│   ├── coach/
│   │   └── README.md                → Coach workflow documentation.
│   └── mcp-server/
│       ├── package.json             → MCP server package (dependency: @modelcontextprotocol/sdk)
│       └── index.js                 → MCP server: single `state` tool for all learner state I/O.
└── .claude/
    ├── settings.json                → Auto-approves ai-learn-state MCP tool.
    └── commands/
        ├── bootstrap.md             → Setup flow: cleanup, npm install, restart instructions.
        ├── start.md                 → Router: routes to interview / graduated / session flow.
        ├── start-session.md         → Flow: returning pre-graduation session (integrity check, orient, research, plan, brief).
        ├── start-graduated.md       → Flow: post-graduation session (orient, research, greet, work together).
        ├── interview.md             → Flow: first-time profiling interview + Session 01 guide.
        ├── end.md                   → Router: routes to pre-grad / post-grad closure.
        ├── end-session.md           → Flow: pre-graduation closure (README, progression, graduation trigger, flags).
        └── end-graduated.md         → Flow: post-graduation closure (README, progression, post-grad check, flags).
```

**Generated after profiling (inside `.settings/`):**
- `.settings/learner-profile.md` — dual-audience learner profile
- `.settings/progression.md` — living navigation document (phases, observations, next steps)
- `.settings/CLAUDE.md.bootstrap` — backup of original CLAUDE.md before personalization
- `reference/profiling-guide.md` — extracted from interview.md (reframing guide, profile structure)
- `sessions/session-NN/README.md` — frozen session records

**Coach layer** (optional — created by coach, not included in bootstrap):
- `.settings/coach/notes.md` — coach input (coach creates and writes, Claude reads)
- `.settings/coach/flags.md` — Claude output (coach creates header, Claude appends flags)

---

## Test Personas

Six personas that cover the two-dimension matrix. Used to validate every design decision.

### Markus (52) — Master electrician, owns his business
**Non-technical + steady**

Runs an electrical company with 8 employees. Computer = invoices and email. Incredible spatial thinking, plans complex installations in his head, coordinates multi-trade projects. But digitally at zero. His tax advisor told him to "look into AI." He has no idea why.

**What he tests:** Resistant, slow, but brilliant in his domain. The profile must honor his planning and leadership skills without hiding that he's starting from scratch digitally. Session 01 must show immediate value for HIS world — not tech demos.

**Expected Session 01:** "What annoys you about paperwork?" → AI writes a client proposal from bullet points Markus dictates. Seeing 20 minutes of Word-fumbling done in 3 seconds — that's his moment.

**Profile reframing challenge:** "Digitally at zero" → "Has not worked with digital tools beyond Office." "Resistant" → "Convinces himself through concrete time savings in his daily business operations, not through explanations."

---

### Priya (38) — Partner at a commercial law firm
**Non-technical + fast**

Thinks in argument chains, finds contract weaknesses in seconds, negotiates with board members. Zero code, zero tech interest — but intellectually aggressive. Already uses ChatGPT for research, finds it "useful but shallow." Heard about Claude Code and wants to know if it goes deeper.

**What she tests:** Fast thinker without code. Must NOT be treated like a beginner. The system must match her pace and work at her intellectual level — contract analysis, legal strategy documents, argument frameworks. If Claude starts with "Let me explain what a prompt is" she's gone.

**Expected Session 01:** She brings a real draft contract. Claude analyzes weaknesses, suggests clauses, reformulates in different tones (aggressive/cooperative). Then: "The prompt you just wrote — that's how you control quality." Prompt engineering through legal practice, not theory.

**Profile reframing challenge:** Minimal — Priya's profile is mostly strengths. The only tricky part: "Has no interest in technology itself" → "Focuses on outcomes and practical application rather than the tools behind them."

---

### Jens (31) — UX Designer at a digital agency
**Semi-technical + moderate**

Works in Figma, can read HTML/CSS and make simple changes. Started a JavaScript course once, quit after 3 weeks ("too abstract"). Understands concepts well when he can see them visually. Wants to go from design to working prototype faster — currently waits on developers for everything.

**What he tests:** The completely untested semi-technical dimension. Not a beginner, not a developer. Can write HTML but can't start a server. The system must use his design strength as an entry point and build technical skills from there — not start at zero but not pretend he can program either.

**Expected Session 01:** Jens describes a design. Claude builds it as HTML/CSS — step by step, visible in browser. Then: "Want to change the color scheme? Just tell me." He learns: AI as bridge between design and code.

**Profile reframing challenge:** "Quit JavaScript after 3 weeks" → "Learns best through visual, concrete output rather than abstract concepts. Benefits from seeing results before understanding the mechanics."

---

### Fatima (24) — Bootcamp graduate
**Technical + steady**

Completed a 6-month web dev bootcamp. Can write React components, knows Express basics, has connected a MongoDB. But: massively insecure. Rewrites every line three times, constantly wonders if it's "correct." Afraid of error messages. Freezes in job interviews when she doesn't immediately know something. Can do more than she believes.

**What she tests:** Technical + steady — the combination that proves code ability and learning speed are independent. The profile must acknowledge her technical skills AND say "needs confirmation at every step" without her reading it as incompetent.

**Expected Session 01:** Not "here's how React works" (she knows). Instead: Claude builds WITH her in `project/`. She says what she wants, Claude suggests code, she reviews. Claude prepares a `project/CLAUDE.md` — Fatima reviews it. Every successful review step builds confidence. The shift: from "I must do everything alone" to "I steer, AI delivers, I verify."

**Profile reframing challenge:** "Massively insecure" → "Works best when each step is confirmed before moving to the next — builds confidence through accumulated small successes." "Afraid of error messages" → "Prefers understanding what went wrong before trying a fix — benefits from Claude explaining errors in plain language before suggesting solutions."

---

### Chen Wei (44) — Staff Engineer, FinTech
**Technical + fast**

15 years experience. Go, Python, TypeScript, Kubernetes — thinks in systems, not files. Has evaluated Copilot, tested Claude API in a prototype, knows LLM limitations. Doesn't want to "learn AI" — wants to know if Claude Code fits into his team's workflow. Will question everything.

**What he tests:** The expert case. The system must not explain anything he already knows. No "what is a prompt", no "how does an LLM work." He wants hooks, subagents, custom MCPs, CLAUDE.md architecture. Session 01 must start at his level immediately. If the system walks him through basics, he uninstalls it.

**Expected Session 01:** Write a `project/CLAUDE.md` in his preferred stack, with Claude giving feedback rather than leading. Discuss context management, when subagents make sense, how hooks fit into a CI pipeline. Deliverable: a working Claude Code project in `project/` — his own environment. May be ready for Graduation almost immediately if the sandbox adds no value.

**Profile reframing challenge:** Minimal — Chen Wei's profile is mostly technical strengths. The tricky part: "Will question everything" → "Evaluates tools critically against production requirements — expects concrete evidence of value before adopting." His skepticism is a professional strength, not a personality flaw.

---

### Nils (61) — Retired vocational school teacher
**Non-technical + moderate**

Taught electrical engineering for 35 years. No code, no terminal, but: understands how to explain things, thinks didactically, is genuinely curious. Retired 2 years ago, discovered ChatGPT — "fascinating, but I'm only scratching the surface." Has time, has motivation, has no career goal. Learns because he finds it interesting.

**What he tests:** Intrinsically motivated non-technical learner with moderate pace. Not resistant like Markus, not fast like Priya. The system must recognize that he WANTS to learn but doesn't HAVE to — no work pressure, no career goal. Sessions can be more exploratory. And: as a former teacher, he'll evaluate the system itself. If Claude explains badly, Nils notices.

**Expected Session 01:** "What fascinated you about ChatGPT?" → From there: Claude shows something ChatGPT can't do (create files, steer projects). Nils' teacher brain will immediately want to see the structure behind it. Deliverable: a "What I learned about AI today" document that Nils formulates himself.

**Profile reframing challenge:** Mostly positive profile. The subtle challenge: "No career goal" needs to be framed so Claude doesn't default to "let me help you be more productive at work." → "Learns driven by curiosity and the joy of understanding new systems. Sessions can prioritize exploration and depth over immediate practical output."

---

### Coverage matrix

```
                 Steady          Moderate        Fast
Non-technical    Markus (52)     Nils (61)       Priya (38)
Semi-technical    —              Jens (31)        —
Technical        Fatima (24)      —              Chen Wei (44)
```

5 of 9 cells covered. The 4 empty cells (semi-technical steady/fast, technical moderate) are low-risk — if the edges work, the middle works. Moderate is the unproblematic pace: if steady and fast are handled well, moderate falls naturally in between.

---

## Motivation-driven deliverables

### Why not just match deliverables to tech level?

Choosing deliverables by tech level alone (non-technical gets a text file, semi-technical gets a script, technical gets code) gets the FORMAT right — but the emotional payoff of a session depends on the learner's motivation, not their tech level.

A text file is the right format for Markus (non-technical). But if that text file is a generic "My first AI prompt" document, he doesn't care. If it's a client proposal that would have taken him 20 minutes in Word, done in 30 seconds — he's hooked. Same format, completely different impact.

### How it works

The profiling interview discovers the learner's **motivation driver** — what would make them come back for the next session. This maps to what the deliverable must FEEL like:

| Driver | The deliverable must feel like... |
|---|---|
| Time/effort savings | "This would have taken me 30 minutes, it took 30 seconds" |
| Intellectual challenge | "This is sharp, this is at my level" |
| Creative expression | "My idea came to life" |
| Proof of competence | "I did that. I reviewed it. It's correct." |
| Understanding/discovery | "Now I understand WHY this works" |
| Production utility | "I can actually use this at work tomorrow" |

The key question for every session: **"Would THIS person be excited to show this to someone?"** If not, the deliverable is wrong — even if it's technically appropriate for their level.

### Why motivation is in the profile

The "What drives me" section in `.settings/learner-profile.md` is written in the learner's own words. Claude reads it and knows what emotional payoff to aim for. This is separate from pace (how fast) and tech level (what content) — it's a third axis that determines WHY the learner engages.

---

## Why project/ becomes a Claude Code environment

### The design decision

The learning goal of AI-LERN is not just "understand AI" but **"work with Claude Code."** Therefore `project/` always evolves toward a Claude Code environment — with its own CLAUDE.md. The difference between tech levels is not WHETHER but WHEN and HOW CONSCIOUSLY:

| Tech level | When does project/ get its own CLAUDE.md? | How? |
|---|---|---|
| Non-technical | Late (Phase 3-4) | Claude sets it up, learner uses it without understanding. "Ich hab dir was eingerichtet." Understanding comes later. |
| Semi-technical | Mid-way (Phase 2-3) | Claude sets it up, explains roughly. Learner starts co-shaping. |
| Technical | Session 01 | Learner steers the setup or understands it immediately. |

### Why this matters

The learner works inside a Claude Code environment from the start (this repo). That's the learning frame. `project/` becomes their OWN project — the place where they use Claude Code for THEIR tasks. For technical learners this happens immediately. For non-technical learners it happens gradually and implicitly.

This means the phase templates in `.settings/progression.md` include Claude Code transition points per tech level. Non-technical phases include "Claude richtet project/CLAUDE.md ein, Lerner nutzt es implizit" in Phase 3. Technical phases start with "Claude Code als Partner" in Phase 1.

### What this is NOT

Not every learner needs to understand CLAUDE.md. A non-technical learner who uses `project/` productively — with a CLAUDE.md that Claude set up — is a success. Understanding comes if and when it comes.

---

## Why Graduation is a mode switch

### What Graduation is

Graduation is the transition from sandbox learning (`project/`) to independent work on the learner's own project. It's a **mode switch**, not an endpoint. After Graduation, the learner still learns — but the learning happens at their own project, not in the sandbox.

Many learners will never graduate. Many will graduate almost immediately. Both are fine. The system detects readiness through observation, not through asking.

### The 7 graduation criteria

**Knowledge** (what the learner must understand):
1. **What a Claude Code environment is** — a project folder with CLAUDE.md that gives every Claude instance context
2. **What an instance is** — each `claude` starts fresh, CLAUDE.md is the memory
3. **How to open a parallel workspace** — new terminal, different folder, `claude`

**Ability** (what the learner must be able to do):
4. **Write a CLAUDE.md** — understand what goes in (project context, stack, conventions) and what doesn't
5. **Context split: CLAUDE.md vs. chat** — know what's persistent context and what's a session task
6. **Steer results iteratively** — not just accept the first output
7. **Recognize when Claude is wrong** — at least a sense for when to verify

**Not required**: MCPs, hooks, subagents, skills, perfect CLAUDE.md. These are advanced features or grow with use.

### Why observation, not checkpoints

Asking "Do you understand what an instance is?" gets unreliable answers — especially from learners who overestimate or underestimate themselves (see "The living profile" below). Instead, the system observes signals:
- Does the learner ask questions about the environment on their own?
- Do they transfer concepts from the sandbox to other contexts?
- Do they express wanting to work on their own project?
- Do they correct or question Claude output unprompted?
- Do they understand WHY CLAUDE.md exists (not just that it does)?

These observations accumulate in `.settings/progression.md` Graduation-Check entries. Graduation is never triggered by a single session — it emerges across sessions. Exception: for technical + fast learners, a single session with strong, unambiguous signals on all 7 criteria may be sufficient.

### How Graduation is triggered

Three paths:
1. **Claude suggests**: When readiness signals are consistent over 2-3 sessions, Claude suggests graduation to the learner (in `end-session.md` Step 5.5) and flags the coach.
2. **Coach triggers**: Via `.settings/coach/notes.md`, the coach can confirm, delay, or initiate graduation.
3. **Learner asks**: If the learner says "I want to work on my own project," Claude checks readiness and responds.

The graduation marker lives in `.settings/progression.md` under "Aktueller Stand": `Graduation erreicht — {date}`.

### What changes after Graduation

| Aspect | Before | After |
|---|---|---|
| Workspace | `project/` (sandbox) | Learner's own project |
| Teaching Boundary | "Never work on the real project" | Suspended — real project IS the workspace |
| Session goal | Learning objective + deliverable | Solve tasks, learn by doing |
| Claude's role | Teacher | Sparring partner |
| Session structure | Guided (Steps 1-7) | Flexible — learner drives |

The Teaching Boundary rule in CLAUDE.md says "Never work on the learner's real-world project." This rule is **explicitly suspended** after Graduation via the Post-Graduation section in `/start`. The CLAUDE.md rule itself is not modified (it's protected by the integrity check) — instead, `/start` tells Claude that the suspension is intentional and by design. The CLAUDE.md rule protects pre-graduation learners from skipping the learning process; post-graduation learners have earned the right to work on their real project.

### What stays after Graduation

The learning environment remains intact. Sessions and progression still get logged — in a lighter format. The learner can always come back to this folder and run `/start`. Graduation is not a one-way door.

If a graduated learner consistently struggles across 2-3 post-graduation sessions (not setting own tasks, deferring everything to Claude, falling back into student mode), Claude flags this to the coach. The coach can revert graduation.

---

## The living profile

### The problem

The initial design treated `.settings/learner-profile.md` as a one-time creation. But learners change — confidence grows, interests shift, pace accelerates. A static profile becomes inaccurate over time, leading Claude to teach at the wrong level.

### The solution: profile review at session end

After each session, Claude compares the profile against observed behavior. Two types of changes are tracked:

**Real shifts** — the learner actually changed:
- Started steady, now clearly moderate (confidence grew through accumulated wins)
- Started non-technical, now curious about code (Nils asks "how does that script actually work?")
- Started for the job, now genuinely curious (Markus starts experimenting on his own)

**Self-assessment mismatches** — the profile was inaccurate from the start:
- Fatima says "I'm not good at React" but reviews code correctly every time → competence exceeds self-image
- A learner says "I learn fast" but needs concepts repeated across sessions → pace was overestimated
- Markus says "this AI stuff isn't for me" but keeps coming back and picks up prompting faster than expected → resistance masks genuine interest

### Why this matters

Self-assessment is unreliable — especially for people with low confidence (underestimate themselves) or high social desirability (overestimate themselves). The profiling interview captures what the learner SAYS. Sessions reveal what is actually TRUE. The system must bridge this gap gradually:

1. **During profiling**: Record self-assessment, but also note what you observe in the interview itself (how quickly they follow, how precisely they express themselves, whether they show systems thinking). When the two diverge, trust observation for initial assessment.
2. **During sessions**: Actively compare observed behavior against profile predictions. Note mismatches.
3. **In memory**: Track observations with session numbers ("Session 03: handled concept faster than steady predicts — second time").
4. **Profile update**: After 2-3 sessions of consistent mismatch, update the profile. Use dual-audience reframing — don't tell the learner "you were wrong about yourself." Instead, the updated profile reads as natural growth: "Picks up new concepts faster than initially expected — ready for more ambitious sessions."

### The dual-audience principle applies to corrections too

A learner who underestimates themselves shouldn't read "was assessed as steady but is actually moderate." They should read: "Has grown more confident with each session — now comfortable taking on new concepts with less scaffolding." Same information, one feels like a correction, the other feels like progress.

---

## The coach layer

### The problem

Claude runs sessions autonomously and does a reasonable job of adapting to the learner. But there are limits to what an AI can observe and decide:

1. **Private context**: The learner tells the coach things they won't tell Claude — frustration, external pressure, private goals, interpersonal dynamics. Claude cannot act on information it doesn't have.
2. **Uncertain judgment calls**: Claude can detect that a learner's pace doesn't match the profile, but it can't always tell if this is a real shift, a topic-specific anomaly, or a temporary state. A human coach can.
3. **Override authority**: Sometimes the right call is to ignore the data and make a human judgment. Claude shouldn't update a profile dimension just because 3 sessions suggest a change — the coach might know the learner was having a good week, or that the topic happened to be in their comfort zone.
4. **Quality assurance**: Is the topic progression sensible? Are the deliverables actually matching the learner's motivation? Is the profile accurate? These are questions a coach can answer by reviewing session outputs — Claude can't evaluate its own teaching effectively.

### The solution: two files, two directions

The coach layer adds two files with clear ownership:

| File | Who writes | Who reads | Purpose |
|---|---|---|---|
| `.settings/coach/notes.md` | Coach | Claude | Instructions, overrides, private context |
| `.settings/coach/flags.md` | Claude | Coach | Observations needing human judgment |

**`.settings/coach/notes.md`** is the coach's input channel. It has two sections: "Current instructions" (actionable directives like "move to moderate pace") and "Context the learner won't share" (background like "learner is stressed about job interview"). Claude reads it at every session start and treats it as authoritative — coach instructions override the profile or Claude's own assessment when they conflict.

**`.settings/coach/flags.md`** is Claude's output channel. At session end, Claude appends observations that exceed its own judgment capacity: repeated concept failures despite correction, emotional signals, uncertain dimension shifts, things the learner said that might need follow-up. Each entry is tagged with session number and date for chronological scanning. The coach reviews weekly and clears resolved flags.

### Why two files instead of one

Putting everything in a single file — coach writes instructions at the top, Claude appends flags at the bottom — breaks for two reasons:

1. **Ownership confusion**: Who controls the file? If Claude appends to a file the coach edits, they can step on each other. The coach deletes a section thinking it's old, but it contained Claude's latest flags. Or Claude appends flags below coach instructions, and the file becomes a tangled conversation.
2. **Different lifecycles**: Coach notes are persistent instructions that stay until the coach removes them ("be more patient" might apply for weeks). Flags are transient observations that should be cleared after review. Mixing persistent and transient content in one file makes cleanup error-prone.

Two files, clear ownership, no ambiguity.

### Why flags are not in session READMEs

Session READMEs are frozen after completion — a core rule of the system. Flags are for the coach, not the learner. Mixing them into session READMEs either breaks the frozen-session rule (coach needs to mark flags as resolved) or pollutes the learner's learning journal with coach-facing content.

### Why the review protocol is in .settings/coach/README.md

The weekly review checklist lives in `.settings/coach/README.md` — the same directory as the coach's operational files. This keeps all coach-facing documentation in one place. The coach opens the `.settings/coach/` directory and finds the README alongside `notes.md` and `flags.md`. Claude doesn't need to read the review protocol (it's for the human coach), so it doesn't belong in CLAUDE.md.

### What is NOT a flag

Routine observations (pace mismatches, learning patterns, self-assessment corrections) are tracked in `.settings/progression.md` and resolved through profile updates after 2-3 sessions of consistent evidence.

Flags are for what Claude cannot resolve alone:
- Repeated failure despite its own correction attempts (something structural is wrong)
- Emotional or motivational signals that require human sensitivity
- Dimension changes where Claude is genuinely uncertain
- Information the learner shared that has implications beyond the session

The instruction "only flag what you can't resolve yourself" is the critical guardrail. Without it, Claude flags everything and the file becomes noise the coach stops reading.

### Integration points

The coach layer touches four places in the existing system:

1. **First Contact Protocol** (CLAUDE.md): Checks for `.settings/coach/notes.md` and reads it
2. **Session start flows** (`start-session.md`, `start-graduated.md`): Orient step reads `.settings/coach/notes.md`
3. **Session end flows** (`end-session.md`, `end-graduated.md`): Coach flags step writes to `.settings/coach/flags.md` if needed
4. **Graduation trigger** (`end-session.md`): Flags graduation to coach in `.settings/coach/flags.md`

Each touch point is a single line or short paragraph. The coach layer is integrated, not bolted on.

### Why the files are in a hidden directory

Coach files contain things the learner should never see: private feedback from coach conversations ("learner told me sessions feel too slow but won't say it"), Claude's unfiltered observations ("misapplied concept 3 times despite correction"), and dimension assessments that would feel like labels. This directly contradicts the dual-audience profile design — the whole point is that the learner never reads demoralizing truths about themselves.

The `.settings/coach/` directory solves this:
- Hidden from `ls` and most file browsers by convention (dot-prefix)
- Non-technical learners won't find it — they don't browse filesystems
- Technical learners understand "hidden = not for you"
- Added to `.gitignore` — coach notes don't belong in version history
- Claude reads it fine — hidden directories are just directories

### Setting up the coach layer

The `.settings/coach/` directory **is included in the bootstrap** — but only with a `README.md` that documents the coach workflow (weekly review checklist, what the coach can do). The two operational files (`notes.md` and `flags.md`) are NOT included. The coach creates them when needed:

**`.settings/coach/notes.md`** — create with this structure:

```markdown
# Coach Notes

Instructions for Claude. Everything here is read at the start of every
session and applied immediately.

---

## Current instructions

<!-- Examples:
- "The learner finds the pace too slow but won't say it. Move to moderate pace."
- "Next session should focus on [topic] — the learner needs it for a work deadline."
- "More challenge, less hand-holding. The learner is ready."
- "Don't change the profile yet — I want to observe one more session first."

Delete instructions once they're no longer relevant. -->

## Context the learner won't share

<!-- Examples:
- "Learner mentioned feeling overwhelmed but doesn't want to slow down visibly."
- "Learner is preparing for a job interview — practical skills matter more now."
- "Learner's real motivation is proving to their boss that AI is worth investing in."
-->
```

**`.settings/coach/flags.md`** — create with this minimal header:

```markdown
# Coach Flags

Observations from Claude that need human judgment.
Review weekly. Delete or archive resolved flags.

---
```

Claude appends entries at session end in this format:

```markdown
### Session {NN} — {YYYY-MM-DD}

- {Specific observation with context}
```

---

## MCP-based learner state

### The problem

Claude Code's default file tools (Read, Write, Edit) have two properties that hurt the learning experience:

1. **Permission prompts.** Every file write requires user confirmation. A single `/end` closure writes to 4-6 files (session README, progression, CLAUDE.md sessions log, possibly coach flags, possibly profile update, possibly reference page). That's 4-6 approval dialogs for housekeeping the learner doesn't care about.

2. **Visibility.** The learner sees the full content of every file being read or written. This breaks the dual-audience design: `.settings/learner-profile.md` contains behavioral reframing ("needs confirmation at every step"), `.settings/progression.md` contains raw observations ("misapplied concept despite correction"), `.settings/coach/flags.md` contains things explicitly meant to be hidden. A curious learner scrolling through tool output sees all of it.

Both problems get worse over time. Early sessions write fewer files. By session 5+, every `/start` reads 3-4 files and every `/end` writes 4-6. The approval fatigue compounds. And the more sessions exist, the more sensitive content accumulates in state files.

### The solution: a project-local MCP server

The `.settings/mcp-server/` directory contains a Node.js MCP server (`ai-learn-state`) that exposes a single `state` tool with three parameters:

```
state(action: "read"|"write"|"append", file: "<key>", content?: "<text>")
```

File keys map to hardcoded paths — no arbitrary file access:

| Key | File | Allowed actions |
|---|---|---|
| `profile` | `.settings/learner-profile.md` | read, write |
| `progression` | `.settings/progression.md` | read, write |
| `coach-notes` | `.settings/coach/notes.md` | read |
| `coach-flags` | `.settings/coach/flags.md` | append |
| `claude-md` | `CLAUDE.md` | read, write |
| `bootstrap` | `.settings/CLAUDE.md.bootstrap` | read, write (one-time) |
| `session-NN` | `sessions/session-{NN}/README.md` | read, write |
| `ref-{name}` | `reference/{name}.md` | read, write |

### Why these restrictions

- **No generic file access.** A tool that accepts arbitrary paths would be a security risk and defeats the purpose of whitelisting. Each key maps to exactly one file.
- **Append-only for coach flags.** Claude should never overwrite existing flags — only append new ones. The coach manages the file.
- **Write-once for bootstrap backup.** The backup is created once during profiling. If it already exists, the tool refuses. This prevents accidental overwrites of the original CLAUDE.md template.
- **Key validation.** Session numbers must be exactly two digits (`01`-`99`). Reference names must be lowercase alphanumeric with hyphens. No path traversal possible.
- **Path safety.** All resolved paths are checked to stay within the project root.

### Why Node.js

Claude Code requires Node.js — it's a prerequisite. Anyone running Claude Code already has `node` and `npm` installed. No additional runtime dependency.

### What the learner experiences

MCP tool calls don't show file content in the chat. The learner sees "Claude used a tool" (if they look at the tool activity) but not the content being read or written. No permission prompts for MCP tools auto-approved in `.claude/settings.json`. The session flow feels seamless — Claude reads state, plans, teaches, writes state, all without interrupting the learner.

### Integration

- `.mcp.json` registers the MCP server (auto-detected by Claude Code, no manual setup)
- `.claude/settings.json` auto-approves the `state` tool (no permission prompts)
- CLAUDE.md § "Learner State — MCP Tools" contains the key table and the rule: "Never use Read/Write/Edit for these files"
- All flow files reference CLAUDE.md § Learner State at the top
- Routers (`start.md`, `end.md`) use `state(action: "read", file: "profile")` / `state(action: "read", file: "progression")` for routing decisions
- Bootstrap runs `npm install` in `.settings/mcp-server/` during setup

---

## Known limitations

1. **Claude as pedagogue is unproven.** The CLAUDE.md gives good teaching instructions, but whether Claude follows them consistently across many sessions and conversation boundaries is unknown. The integrity check at `/start` catches structural drift (deleted rules, missing files, corrupted state) but cannot detect behavioral drift (wrong pace, ignored motivation drivers). Auto-memory helps but isn't perfect.

2. **The system requires Claude Code.** This is a CLI tool that runs in a terminal. Non-technical users who are uncomfortable with terminals need a human coach for setup. The bootstrap doesn't solve this — it's a conscious scope boundary.

3. **Long-term progression is untested.** Sessions 1-6 are well-guided by the profile + adaptation guidelines. Session 10+ relies on accumulated context (memory, session history). Whether Claude can maintain coherent learning progression over 20+ sessions is unknown.

4. **The [ADAPT] personalization depends on Claude's judgment.** If Claude fills in the sections poorly, the CLAUDE.md becomes a worse steering document. The backup (`.settings/CLAUDE.md.bootstrap`) enables recovery, but doesn't prevent the issue.

5. **Single-model dependency.** The entire system is designed for Claude Code. It doesn't work with ChatGPT, Copilot, or other AI tools. This is by design (the goal IS to learn Claude Code), but limits portability.

6. **Graduation detection is untested.** The system observes 5 readiness signals across sessions and triggers graduation when signals are consistently present. Whether Claude reliably detects these signals — especially the subtle ones like "understands WHY CLAUDE.md exists" — is unproven. The fast-learner edge case (graduation after a single session) adds complexity. The coach layer provides a safety net: graduation is flagged to the coach, who can confirm or delay.

7. **The coach layer depends on a human actually coaching.** If `.settings/coach/notes.md` exists but the coach stops reviewing flags or updating notes, Claude continues autonomously — which is the baseline behavior anyway. The system degrades gracefully: without a coach, it works exactly as before. But stale coach-notes that contradict the learner's current state could misdirect Claude. A coach who stops coaching should delete `.settings/coach/notes.md` rather than leave outdated instructions in place.

8. **MCP server adds a setup step.** The learner state MCP server requires `npm install` in `.settings/mcp-server/` before first use. The `/bootstrap` command handles this automatically, but manual git-clone users must run it themselves. The server is registered via `.mcp.json` (auto-detected by Claude Code), so no manual `claude mcp add` is needed. If `npm install` fails or `node_modules/` is missing, `/start` detects the problem and tells the user what to do.

9. **`project/` is not a standalone Claude Code project.** Claude Code reads `.claude/settings.json` from the working directory. Since sessions run from the learning repo root (where `/start` and `/end` live), `project/` is just a subdirectory — not an independent Claude Code context. This means hooks, permissions, and settings intended for the learner's project must live in the root `.claude/settings.json`, not in `project/.claude/settings.json`. The learner effectively learns a wrong pattern: "my project's hooks live one level above my project." In real-world use, `project/` would be the repo root. This is a fundamental tension between two requirements: the learning system needs to run from root (for skill routing), but the learner's project needs its own configuration scope (for realistic Claude Code usage). After graduation this resolves naturally — the learner works in their own repo. Pre-graduation, it remains an unsolved architectural limitation. Discovered in Session 04 (Hooks) when a learner identified the mismatch independently.
