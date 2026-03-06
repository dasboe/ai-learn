# AI-LERN Bootstrap — Design Decisions

> This document is for developers and AI instances working on the bootstrap.
> It explains the reasoning behind every major design choice.
> Not for end users — they read README.md.

---

## What this system is

A personalized AI learning environment built on Claude Code's Skill architecture. The user clones a repo, starts Claude Code, and types `/start`. The `/start` command triggers the `ai-learn` skill (`.claude/skills/ai-learn/SKILL.md`), which routes to the appropriate flow: interview for first-time users, teaching for pre-graduation sessions, coaching for post-graduation. Claude interviews new learners, creates a learner profile, personalizes CLAUDE.md, and starts a session loop. No curriculum, no predefined content — Claude adapts everything based on who the learner is.

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

A full rewrite would be too risky — Claude could delete the First Contact Protocol or the Rules. The [ADAPT] approach is surgical: only marked sections change, the skeleton survives. If Claude messes up one section, the rest is intact. Additionally, system rules now live in `.claude/rules/` as modular files (teaching-boundary.md, tool-announcements.md, mcp-usage.md) — they're automatically loaded by Claude Code and can't be accidentally deleted from CLAUDE.md.

### Where are the interview instructions?

The interview instructions live in `.claude/skills/ai-learn/onboarding.md` — a supporting file that's only loaded when the root skill detects no profile exists. This keeps the CLAUDE.md lean from the start: the bootstrap version never contains interview instructions in the main file. The reframing guide and Session 01 decision table are extracted into their own supporting files (`profiling-guide.md` and `session-01-table.md`) within the same skill directory, referenced from `onboarding.md` via `${CLAUDE_SKILL_DIR}`. The profiling guide is also referenced from `close.md` for profile updates at session end.

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

- **Non-technical + Semi-technical**: No web search. Content is domain-specific, not feature-driven. The topics registry (fetched via WebFetch) provides topic orientation for all learners.
- **Technical Stage 1**: No web search. Focus is on basic Claude Code partnership — the learner needs to understand the tool, not its changelog.
- **Technical Stage 2+**: Web search for session-topic-relevant updates from Anthropic sources. Findings inform session planning and appear in the briefing.
- **Post-graduation**: Always search. The learner works independently and needs current information. Findings are woven into the greeting conversationally, not as a formal block.

Additionally, all session types now attempt to fetch `topics.md` from the GitHub repo (silent, via WebFetch). The topics registry provides a curated index of AI topics organized by five learning stages, helping Claude select appropriate topics for the learner's current stage. If the fetch fails, Claude falls back to its own knowledge + web search.

This preserves the "minimal bootstrap" principle while ensuring learners get topic orientation and technical learners don't work with outdated patterns. The web search is targeted (Anthropic sources only, max 3 bullets, skip noise) to avoid context bloat.

---

## Why no explicit curriculum / roadmap

The session progression is intentionally implicit. Claude determines the next topic based on:
- The learner profile (dimensions)
- The Sessions Log (what was already covered)
- The content type rules in `teach.md` Step 3 (what content maps to which tech level and stage)
- `.settings/context.md` (current stage, last observations, planned next step)
- The topics registry (`topics.md`, fetched from GitHub) — a curated index of AI topics organized by five learning stages

A predefined roadmap would:
- Conflict with the adaptive nature of the system
- Need to be maintained for every dimension combination (3 × 3 = 9 paths minimum)
- Become a constraint rather than a guide

The current approach trusts Claude to plan sensible progressions, aided by the topics registry which provides orientation without prescription. This works well for ~5-6 sessions. Beyond that, the gap is filled by `.settings/context.md` — a rolling summary that Claude rewrites after every session, capturing the current state, observations, and planned next step. See "Why context.md exists" below for the full rationale.

---

## Why an integrity check instead of blind trust

### The problem: cross-session drift

Each session runs in a fresh Claude instance. Drift doesn't happen within a conversation — it happens **through the persisted files**. If Claude in Session 5 accidentally deletes a rule from CLAUDE.md, Session 6 starts on a corrupted foundation. The drift compounds silently: each session inherits the previous session's mistakes.

The dangerous part: the learner never notices. And Claude in Session 6 can't detect what Claude in Session 5 broke — because it has no memory of what the file should look like.

### Why at `/start`, not `/end`

An integrity check at `/end` would use the **same instance** that potentially caused the drift. A drifted Claude checking itself is unreliable.

At `/start`, a **fresh instance** — with no drift from previous sessions — reads the files cold and compares them against the bootstrap backup. It's an external validator, not a self-assessment.

### What the check covers

The integrity check is implemented as a standalone script (`.settings/hooks/integrity-check.js`) that runs three mechanical checks and returns JSON:

**A. Structural check** — do required files exist? (`.settings/learner-profile.md`, `.settings/context.md`, `.settings/CLAUDE.md.bootstrap`). Missing files are either critical (no profile → `status: "critical"`) or warnings.

**B. CLAUDE.md drift check** — compares immutable sections (First Contact Protocol, Rules) against the bootstrap backup. If content was altered, reports `status: "warning"` with the drifted section name. Note: Teaching Boundary, Tool Announcements, and MCP usage rules now live in `.claude/rules/` and are not subject to drift — they're version-controlled rule files, not generated content.

**C. context.md staleness check** — if `context.md` is older than 7 days, reports a warning. Stale context means the previous session didn't update it properly.

**Output:** `{ "status": "ok"|"warning"|"critical", "issues": [...] }`. Claude interprets the result and decides (silently repair or inform user). The script can be invoked via `state(action: "read", file: "integrity")` through the MCP server, or directly via `node .settings/hooks/integrity-check.js`.

### What it can and cannot catch

The check catches **structural drift** — deleted rules, missing files, stale context. These are mechanically verifiable: compare file A to file B, check if file exists, check modification dates.

It cannot catch **behavioral drift** — did Claude teach at the wrong pace? Did it ignore the motivation driver? Did it work on the learner's real project instead of the learning project? These require judgment, which is exactly what the coach layer is for.

### Design principle: mechanical checks only

Every check is a file comparison or existence check. No interpretation, no "does this feel right?" questions. This is deliberate: a check that requires Claude's judgment is subject to the same drift it's trying to detect.

### Scenarios that remain self-healing (no guardrails needed)

**`/start` before profiling:** Handled by the root skill's routing logic — `SKILL.md` checks for `.settings/learner-profile.md` via MCP and routes to `onboarding.md` if it doesn't exist. The integrity check still runs (via preprocessing) but only reports missing files as expected.

**Learner reads the flow files:** The interview and session flows live in `.claude/skills/ai-learn/` as supporting files, not in CLAUDE.md itself. If a learner finds and reads them, they're tech-savvy enough to understand what they are.

**Sessions log gets corrupted:** Claude can extract the last entry from a malformed markdown table.

**Session aborted mid-way:** Half-filled README is visible at next session start. Claude sees where things stopped and can continue.

---

## Why context.md exists

### The problem it solves

Without a navigation document, Claude determines the next topic from the learner profile, the sessions log, and memory. This works for ~5-6 sessions where the natural "what comes next?" is obvious. Beyond that, topic decisions happen from scratch every conversation — Claude has to reconstruct where the learner is, what direction they're heading, and whether the pace is right. Memory helps but is unstructured and spread across entries.

Three questions need a persistent answer:
1. **Where are we?** — Not "what did we do last" (sessions log), but "where does this sit in the bigger learning journey?"
2. **Where are we going?** — Not "what's the next topic?" (ephemeral), but "what's the learning trajectory?"
3. **Is the path right?** — Not "is the pace right?" (profile review), but "are we even heading in the right direction?"

### Why not a curriculum?

A predefined curriculum would need 9 paths minimum (3 tech levels × 3 paces) and becomes a constraint rather than a guide. But relying purely on Claude's judgment starts failing at session 10+ because accumulated context becomes fragmented.

### The solution: context.md as a rolling summary

`.settings/context.md` sits between the learner profile (who) and the sessions log (what). It answers: **where are we, where are we going, and is it working?**

Unlike V1's append-only `progression.md` (which grew with every session and needed compression at >15 entries), context.md is **rewritten completely after every session**. It always contains ~30-50 lines — everything the next instance needs, nothing more.

It contains:
- **Lerner-Kurzprofil**: 2-3 sentences summarizing who the learner is, with a reference to the full profile.
- **Aktueller Stand**: Current stage (Stufe 1-5), last session number, graduation status. The five stages come from the topics registry (`topics.md`) and represent content depth, not speed.
- **Was bisher geschah**: A compact synthesis of the learning journey — what the learner can do, what the turning points were, what worked and what didn't. Max 10 lines. This replaces the V1 "Verlauf" (append-only per-session entries).
- **Beobachtungen**: Current observations from the last 2-3 sessions — pace alignment, stage alignment, profile deviations.
- **Nächste Session**: Planned topic, rationale, and any relevant notes (coach hints, gaps, special circumstances).
- **Graduation-Signale** (pre-graduation only): Which of the 5 readiness signals have been observed, and since when.

### Why rolling instead of append

1. **Each instance reads one file, not a history.** The next AI doesn't need "what happened in Session 3" — it needs "where we stand now."
2. **No size problem.** context.md stays ~30-50 lines regardless of session count.
3. **Forces synthesis.** Claude must summarize the overall state after every session, not just append a block. This produces better orientation for the next instance.
4. **Sessions as archive.** Session details remain in `sessions/session-NN/README.md`. context.md is the pointer to the current state, not the archive.

### Why five stages instead of custom phases

V1 created custom phases per learner ("Phase 1: Prompting basics" for one, "Phase 1: Claude Code als Partner" for another). This was conceptually elegant but had two problems:

1. **Claude had to invent phases.** The quality varied — sometimes phases were too vague, sometimes too specific.
2. **No shared vocabulary.** Each learner's phases were unique, making it impossible to compare progress or build a topics registry.

V2 uses five universal stages defined in the topics registry. The stages describe content depth, not speed:

| Stage | Name | Core question |
|---|---|---|
| 1 | KI verstehen & prompten | "Was kann KI und wie rede ich mit ihr?" |
| 2 | CC als Arbeitsumgebung | "Wie nutze ich CC produktiv?" |
| 3 | CC konfigurieren | "Wie passe ich CC an mein Projekt an?" |
| 4 | CC erweitern | "Wie baue ich eigene Tools in CC?" |
| 5 | Eigene KI-Systeme | "Wie baue ich Dinge, die über CC hinausgehen?" |

Stage and tech level are independent. A non-technical learner may graduate at Stage 2. A technical learner might skip Stage 1 entirely. Graduation typically falls between Stage 3 and 4, but the graduation signals — not the stage — decide.

### How responsibilities are split

- **`.settings/context.md`**: Current state, observations, next step — everything about trajectory. Rewritten every session.
- **Memory**: General learnings (preferences, what resonated) — not progression tracking
- **Sessions Log**: Compact lookup table of what happened — stays in CLAUDE.md
- **`.settings/learner-profile.md`**: Who the learner is — updates only when context.md shows consistent mismatch over 2-3 sessions

### How it integrates

Four touch points:
1. **First Contact Protocol** (CLAUDE.md): Reads `.settings/coach/notes.md` — and via `/start`, also `.settings/context.md`
2. **Session start flows** (`teach.md`, `coach.md`): Orient step reads context.md; Research step fetches topics.md and optionally searches Anthropic sources; "Nächste Session" is the starting point for topic planning
3. **Session end flow** (`close.md`): Rewrites context.md completely — synthesizes the session into the overall state, updates stage if warranted, records observations and planned next step
4. **Coach review** (`.settings/coach/README.md`): Checklist item — "is the stage progression sensible?"

### What it doesn't replace

- `.settings/learner-profile.md`: Who the learner is. Identity, dimensions, motivation. Changes rarely.
- Sessions Log: Compact reference of what happened. Changes every session but stays in CLAUDE.md for quick lookup.
- `.settings/coach/flags.md`: Observations needing human judgment. Progression issues that Claude can resolve stay in context.md; problems Claude can't resolve go to flags.

---

## Why the CLAUDE.md shrinks after profiling

### The problem

Claude reads CLAUDE.md at the start of every conversation. The bootstrap version contains `[ADAPT]` sections with examples and comments that guide personalization. After profiling, these are replaced with concrete values — but the CLAUDE.md should also get leaner overall.

### Two-stage reduction

The CLAUDE.md gets smaller in three ways:

1. **At bootstrap design time**: Session flows live as supporting files under `.claude/skills/ai-learn/`. Flows are loaded on demand by the root skill's routing logic.

2. **Rule modularization**: Teaching Boundary, Tool Announcements, and MCP usage rules are extracted into `.claude/rules/` — automatically loaded by Claude Code, no imports needed. The bootstrap CLAUDE.md only contains First Contact Protocol, learner config, and short references.

3. **After profiling**: Claude backs up the original as `.settings/CLAUDE.md.bootstrap` and fills in the `[ADAPT]` sections (replacing verbose comments with concrete values).

The result: ~70 lines in CLAUDE.md. Rules, flows, and config each live in their own space.

### Why the reframing guide needs to persist

The reframing guide — the table that maps observations to behavioral descriptions — is needed whenever Claude updates the learner profile (which happens when context.md shows consistent mismatch over 2-3 sessions). It lives in `.claude/skills/ai-learn/profiling-guide.md` as a supporting file, referenced from both `onboarding.md` (initial profile creation) and `close.md` (profile updates at session end) via `${CLAUDE_SKILL_DIR}`. It's only loaded when needed, not every conversation.

### Safety

If the personalized CLAUDE.md gets corrupted or Claude fills the [ADAPT] sections poorly: restore from `.settings/CLAUDE.md.bootstrap`. The bootstrap always contains the full template.

---

## Why session boundaries matter

### The recommendation

A learning session is one learning unit — typically one day, one topic. The user opens Claude, types `/start`, works through the session, and types `/end` when done. A fresh Claude instance per session is recommended but not enforced.

V1 enforced "one instance = one session" as a hard rule. V2 softens this: context.md as a rolling summary makes the instance boundary less critical — whether the next `/start` happens in a fresh instance or a continuing conversation, context.md carries the state. The Stop hook reminds about unclosed sessions as a safety net.

### Why boundaries still matter

1. **Clean context window.** Claude reads the profile, context.md, and coach notes from scratch every time. No stale conversation context bleeding between sessions. What Claude "remembers" comes from files, not from an increasingly compressed conversation history.

2. **Reliable state.** The `/start` skill routes to a path-specific supporting file. Pre-graduation: integrity check (via preprocessing) → orient → research (conditional) → plan → create folder → brief → update log. Post-graduation: orient → research → greet → work → session folder. Each supporting file is self-contained — Claude only reads the steps relevant to the current path. If Claude starts a session mid-conversation after other back-and-forth, it might skip steps or carry assumptions from earlier messages.

3. **Session boundaries are real.** A session has a start (briefing), a middle (building), and an end (README, context update, log update). Closing the instance enforces the end boundary. Without it, sessions blend into each other and the end-of-session protocol (which includes the critical context.md update) might be skipped.

4. **Non-technical users need simple rules.** "Open Claude, type `/start`, close when done" is a ritual anyone can follow. "Continue the conversation, or start a new one, or type a command, or just say something" is a decision tree that creates confusion.

### What about the first session?

The first session follows the same ritual: open Claude, type `/start`, close when done. The root skill detects that no profile exists yet and routes to `onboarding.md` automatically. The user doesn't need to know or do anything different.

### What persists between instances

Everything the learner needs is in files:
- `.settings/learner-profile.md` — who they are
- `.settings/context.md` — where they are, where they're going, what to do next
- `sessions/` — what they've done
- `reference/` — what they've learned
- Auto-memory — general learnings and preferences

The conversation itself is ephemeral. The files are the source of truth.

---

## The /start and /end skills

### Why a single entry point

The user types `/start` every time — first session and every session after. The user types `/end` when a session is done. Two commands, always the same. "Open Claude, type `/start`, close when done" — that's the entire ritual, from day one.

### Skill architecture (V2)

V2 replaces the V1 command-based routers with a proper Claude Code Skill at `.claude/skills/ai-learn/SKILL.md`. The `/start` and `/end` commands in `.claude/commands/` become thin one-liners that trigger the skill.

**Why a single skill with supporting files:** Claude Code discovers skills at the direct level under `.claude/skills/`. Nested sub-skills are not automatically discovered. The solution: one root skill (`ai-learn`) with supporting files that are loaded on demand — exactly like the V1 router pattern, but in the official Skill format.

**Root skill (`SKILL.md`) responsibilities:**
1. **Preprocessing:** Runs the integrity check via `!`command`` syntax before Claude sees the prompt. The output (JSON status) is injected into context automatically.
2. **MCP server check:** Verifies `state` tool availability (identical to V1).
3. **Routing:** Checks learner state via MCP, loads the appropriate supporting file.
4. **System rules:** References `.claude/rules/` (modular rule files, replacing inline CLAUDE.md rules).
5. **Arguments forwarding:** `$ARGUMENTS` from `/start some topic` is passed to supporting files as topic override.

**Frontmatter:**
```yaml
---
name: ai-learn
description: AI learning coach. Manages personalized sessions adapted to the learner's technical level and pace.
disable-model-invocation: true
---
```

`disable-model-invocation: true` prevents Claude from auto-triggering the skill. The routing logic requires MCP calls to check state — auto-triggering on "Hallo" would load the entire SKILL.md and cause uncontrolled routing. `/start` as explicit trigger is safer and consistent with the First Contact Protocol.

**`/start` routes (via supporting files):**

| Condition | Supporting file |
|---|---|
| No profile | `onboarding.md` — interview + profile + Session 01 |
| Graduated | `coach.md` — post-graduation peer sessions |
| Otherwise | `teach.md` — pre-graduation teaching sessions |

**`/end` loads:**

| Supporting file | Purpose |
|---|---|
| `close.md` | Session closure (README, context.md, coach flags, graduation trigger) |

### Why this split (unchanged from V1)

The original design packed all paths into a single file per skill. `start.md` was 268 lines containing the interview routing, the integrity check, the normal session flow, Session 01 guidance, graduation criteria, AND the post-graduation flow. Claude read all of it every time — even though only one path applied per session.

This created three problems:

1. **Irrelevant context dilutes attention.** When Claude reads 268 lines but only 80 apply, it processes 188 lines of "skip this" instructions. Studies on LLM instruction-following show that irrelevant context degrades compliance — especially for steps in the middle of long documents (position bias).

2. **Conditional prose is hard to parse.** "If graduated, skip Steps 0.5–5 and go to the Post-Graduation section at the end" requires Claude to navigate a document non-linearly. A router that loads only the relevant file eliminates this entirely.

3. **Decision density per file.** A file with 3 tech levels × 3 paces × pre/post-graduation contains many decision branches. Splitting by path means each file only has the branches relevant to that path.

V2 preserves this pattern. The supporting files replace the V1 flow files, each containing only the logic for its specific path.

### Preprocessing vs. prompt-based integrity check

V1 implemented the integrity check as prompt instructions in the session start flow — Claude had to read the instructions, execute the check steps, and interpret the results. V2 uses Claude Code's `!`command`` preprocessing syntax: the integrity check runs as a Node.js script **before** the skill content reaches Claude. Claude sees the JSON result directly in context — no instructions needed.

This moves the integrity check from "Claude follows steps to check itself" to "a script checks the system and Claude reads the result." The check still runs at session start (fresh instance detects what the previous one broke), but now as a mechanical guarantee rather than a prompt-based hope.

### Why decision tables instead of prose

The flow files use tables for all conditional logic:

| Instead of | Use |
|---|---|
| "For steady learners, explain everything. For fast learners, skip obvious things." | A pace × approach table |
| "Non-technical learners should get prompting content. Semi-technical learners should get..." | A tech-level × content table |
| "If the learner struggles, slow down. If they fly through it, add depth." | A behavior × response table |

Tables are faster to scan than paragraphs of if/then prose. Claude can look up the relevant row by matching the learner's dimensions, rather than parsing conditional sentences to find the applicable clause.

### Why flow files don't repeat CLAUDE.md context

The original `start.md` included a "Context: Two-dimension model" section re-explaining the dimensions. The flow files omit this — CLAUDE.md is always loaded and contains the system context. The flow files reference dimension values (via tables) without re-explaining what dimensions are. This reduces duplication and keeps flow files focused on execution.

### Path references in supporting files

Supporting files reference each other via `${CLAUDE_SKILL_DIR}` — the absolute path to the skill directory, resolved by Claude Code regardless of working directory. Example: `[profiling-guide.md](${CLAUDE_SKILL_DIR}/profiling-guide.md)`. This replaces the V1 pattern of hardcoded `.claude/commands/` paths.

---

## File inventory

```
bootstrap/
├── README.md                        → For users. Setup instructions, FAQ.
├── bootstrap.md                     → URL entry point: clone instructions for fresh Claude Code instances.
├── CLAUDE.md                        → For Claude. First Contact, learner config, short references (~70 lines).
├── DESIGN.md                        → For developers/AI. This file. Design rationale.
├── topics.md                        → Topics registry: curated index of AI topics in 5 stages. Fetched by teach.md/coach.md via WebFetch.
├── .mcp.json                        → Project-local MCP server registration (auto-detected by Claude Code).
├── .gitignore                       → Standard ignores (node_modules, .env, .DS_Store, .settings/coach/)
├── .settings/
│   ├── coach/
│   │   └── README.md                → Coach workflow documentation.
│   ├── hooks/
│   │   ├── on-stop.js               → Stop-Hook: reminds about unclosed sessions.
│   │   ├── boundary-check.js        → PreToolUse-Hook: blocks Write/Edit outside the project.
│   │   └── integrity-check.js       → Integrity check: validates core files and CLAUDE.md drift.
│   └── mcp-server/
│       ├── package.json             → MCP server package (dependency: @modelcontextprotocol/sdk)
│       └── index.js                 → MCP server: single `state` tool for all learner state I/O.
└── .claude/
    ├── settings.json                → Auto-approves MCP tool + hooks config (Stop, PreToolUse).
    ├── commands/
    │   ├── bootstrap.md             → Setup flow: cleanup, npm install, restart instructions.
    │   ├── start.md                 → Thin entry point: triggers ai-learn skill.
    │   └── end.md                   → Thin entry point: loads close.md from ai-learn skill.
    ├── rules/
    │   ├── teaching-boundary.md     → Two project spaces rule (auto-loaded by Claude Code).
    │   ├── tool-announcements.md    → Decision matrix + pacing rules (auto-loaded).
    │   └── mcp-usage.md             → MCP state tool keys + usage rule (auto-loaded).
    └── skills/
        └── ai-learn/
            ├── SKILL.md             → Root skill: preprocessing, MCP check, routing, system rules.
            ├── onboarding.md        → Supporting file: interview + profile + Session 01.
            ├── teach.md             → Supporting file: pre-graduation teaching sessions.
            ├── coach.md             → Supporting file: post-graduation peer sessions.
            ├── close.md             → Supporting file: session closure (README, context, flags).
            ├── profiling-guide.md   → Supporting file: reframing guide for profile writing.
            └── session-01-table.md  → Supporting file: decision table for first session.
```

**Generated after profiling (inside `.settings/`):**
- `.settings/learner-profile.md` — dual-audience learner profile
- `.settings/context.md` — rolling summary (rewritten every session: current stage, observations, next step)
- `.settings/CLAUDE.md.bootstrap` — backup of original CLAUDE.md before personalization
- `.settings/graduated` — empty flag file, created at graduation (existence = graduated)
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
| Non-technical | Late (Stage 3-4) | Claude sets it up, learner uses it without understanding. "Ich hab dir was eingerichtet." Understanding comes later. |
| Semi-technical | Mid-way (Stage 2-3) | Claude sets it up, explains roughly. Learner starts co-shaping. |
| Technical | Session 01 | Learner steers the setup or understands it immediately. |

### Why this matters

The learner works inside a Claude Code environment from the start (this repo). That's the learning frame. `project/` becomes their OWN project — the place where they use Claude Code for THEIR tasks. For technical learners this happens immediately. For non-technical learners it happens gradually and implicitly.

The five stages in the topics registry reflect this progression. Stage 2 ("CC als Arbeitsumgebung") is where non-technical learners start using `project/` with Claude Code implicitly. Stage 3 ("CC konfigurieren") is where they begin to understand CLAUDE.md. Technical learners start at Stage 2 or 3 and work with `project/` as a proper CC environment from Session 01.

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

These observations accumulate in context.md's "Graduation-Signale" section. Graduation is never triggered by a single session — it emerges across sessions. Exception: for technical + fast learners, a single session with strong, unambiguous signals on all 7 criteria may be sufficient.

### How Graduation is triggered

Three paths:
1. **Claude suggests**: When readiness signals are consistent over 2-3 sessions, Claude suggests graduation to the learner (in `close.md` Step 6) and flags the coach.
2. **Coach triggers**: Via `.settings/coach/notes.md`, the coach can confirm, delay, or initiate graduation.
3. **Learner asks**: If the learner says "I want to work on my own project," Claude checks readiness and responds.

The graduation marker has two representations:
- **`.settings/graduated`**: An empty flag file whose existence signals graduation. Used by hooks (`boundary-check.js`) and the root skill routing for fast, mechanical checks.
- **context.md "Aktueller Stand"**: Contains `Graduation: ja seit {date}` — the human-readable marker read by session flows.

### What changes after Graduation

| Aspect | Before | After |
|---|---|---|
| Workspace | `project/` (sandbox) | Learner's own project |
| Teaching Boundary | "Never work on the real project" | Suspended — real project IS the workspace |
| Session goal | Learning objective + deliverable | Solve tasks, learn by doing |
| Claude's role | Teacher | Sparring partner |
| Session structure | Guided (Steps 1-7) | Flexible — learner drives |

The Teaching Boundary rule (`.claude/rules/teaching-boundary.md`) says "Never work on the learner's real-world project." This rule is **mechanically enforced** pre-graduation by the `boundary-check.js` PreToolUse hook, which blocks Write/Edit operations outside the project. After graduation, the hook checks for `.settings/graduated` and allows all paths. The rule file itself is not modified — the hook provides the enforcement, and the graduated flag file provides the suspension.

### What stays after Graduation

The learning environment remains intact. Sessions and context still get tracked — in a lighter format. The learner can always come back to this folder and run `/start`. Graduation is not a one-way door.

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

Routine observations (pace mismatches, learning patterns, self-assessment corrections) are tracked in `.settings/context.md` and resolved through profile updates after 2-3 sessions of consistent evidence.

Flags are for what Claude cannot resolve alone:
- Repeated failure despite its own correction attempts (something structural is wrong)
- Emotional or motivational signals that require human sensitivity
- Dimension changes where Claude is genuinely uncertain
- Information the learner shared that has implications beyond the session

The instruction "only flag what you can't resolve yourself" is the critical guardrail. Without it, Claude flags everything and the file becomes noise the coach stops reading.

### Integration points

The coach layer touches four places in the existing system:

1. **First Contact Protocol** (CLAUDE.md): Checks for `.settings/coach/notes.md` and reads it
2. **Session start flows** (`teach.md`, `coach.md`): Orient step reads `.settings/coach/notes.md`
3. **Session end flow** (`close.md`): Coach flags step writes to `.settings/coach/flags.md` if needed
4. **Graduation trigger** (`close.md`): Flags graduation to coach in `.settings/coach/flags.md`

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

## Hooks infrastructure

Hooks solve problems that were previously implemented as prompt instructions in V1. They guarantee behavior mechanically instead of requesting it.

**Principle:** Hooks only for system-internal enforcement. User-facing behavior (tool announcements, pacing) stays prompt-driven because it's part of the learning experience.

### Stop-Hook: Session closure reminder

**Problem:** If the learner forgets `/end`, context.md is not updated, no session README is finalized, no coach flags are written. The next instance starts with stale state.

**Solution:** `.settings/hooks/on-stop.js` runs when Claude finishes responding. It checks whether the last `sessions/session-NN/README.md` was completed (contains "Key Takeaways"). If not, it returns `{ "decision": "block", "reason": "Session NN wurde nicht abgeschlossen..." }` — which prevents Claude from stopping and prompts it to ask the user about running `/end`.

**What it does NOT do:** It doesn't close the session automatically. The user keeps control. The hook is a safety net, not an autopilot.

### PreToolUse-Hook: Teaching boundary enforcement

**Problem:** "Never work on the learner's real project" is a prompt rule. Over a long session, Claude can forget it — especially if the user explicitly asks.

**Solution:** `.settings/hooks/boundary-check.js` runs before every Write/Edit tool call. It receives the tool input as JSON on stdin (including `tool_input.file_path`), resolves the path, and checks:

1. Is the learner graduated? (`fs.existsSync('.settings/graduated')`) → Allow everything
2. Is the target path within the project root? → Allow
3. Otherwise → Block via `permissionDecision: "deny"`

**Why only Write/Edit:** Read is harmless — the learner may read anywhere. Write/Edit outside the project is the problem.

**Graduation flag:** Instead of parsing context.md (fragile), the hook checks `fs.existsSync('.settings/graduated')`. The flag file is written by the close skill when graduation occurs.

### Integrity check as preprocessing script

The integrity check moved from a 15-point prompt instruction (V1) to a standalone Node.js script (`.settings/hooks/integrity-check.js`). See "Why an integrity check instead of blind trust" above for the rationale.

In V2, the script runs via Claude Code's `!`command`` preprocessing syntax in the root skill (`SKILL.md`). The command `!`node ${CLAUDE_SKILL_DIR}/../../../.settings/hooks/integrity-check.js`` executes before the skill content reaches Claude. The JSON output is injected directly into context — Claude reads the result without needing instructions to run the check. The script can also be invoked via the MCP server's `integrity` key or directly via `node .settings/hooks/integrity-check.js`.

### Hook configuration

Hooks are configured in `.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          { "type": "command", "command": "node .settings/hooks/on-stop.js" }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "node .settings/hooks/boundary-check.js" }
        ]
      }
    ]
  }
}
```

Stop hooks don't support matchers (always fire). PreToolUse hooks match on tool name via regex (`Write|Edit`).

---

## MCP-based learner state

### The problem

Claude Code's default file tools (Read, Write, Edit) have two properties that hurt the learning experience:

1. **Permission prompts.** Every file write requires user confirmation. A single `/end` closure writes to 4-6 files (session README, context.md, CLAUDE.md sessions log, possibly coach flags, possibly profile update, possibly reference page). That's 4-6 approval dialogs for housekeeping the learner doesn't care about.

2. **Visibility.** The learner sees the full content of every file being read or written. This breaks the dual-audience design: `.settings/learner-profile.md` contains behavioral reframing ("needs confirmation at every step"), `.settings/context.md` contains raw observations ("misapplied concept despite correction"), `.settings/coach/flags.md` contains things explicitly meant to be hidden. A curious learner scrolling through tool output sees all of it.

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
| `context` | `.settings/context.md` | read, write |
| `coach-notes` | `.settings/coach/notes.md` | read |
| `coach-flags` | `.settings/coach/flags.md` | append |
| `claude-md` | `CLAUDE.md` | read, write |
| `bootstrap` | `.settings/CLAUDE.md.bootstrap` | read, write (one-time) |
| `session-NN` | `sessions/session-{NN}/README.md` | read, write |
| `ref-{name}` | `reference/{name}.md` | read, write |
| `integrity` | *(runs `.settings/hooks/integrity-check.js`)* | read |

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
- `.claude/settings.json` auto-approves the `state` tool (no permission prompts) and configures hooks (Stop, PreToolUse)
- `.claude/rules/mcp-usage.md` contains the key table and the rule: "Never use Read/Write/Edit for these files"
- All supporting files reference `.claude/rules/mcp-usage.md` for the state tool contract
- The root skill (`SKILL.md`) uses `state(action: "read", file: "profile")` / `state(action: "read", file: "context")` for routing decisions
- Bootstrap runs `npm install` in `.settings/mcp-server/` during setup

---

## Known limitations

1. **Claude as pedagogue is unproven.** The CLAUDE.md gives good teaching instructions, but whether Claude follows them consistently across many sessions and conversation boundaries is unknown. The integrity check (`.settings/hooks/integrity-check.js`, invocable via MCP `integrity` key) catches structural drift (deleted rules, missing files, stale context) but cannot detect behavioral drift (wrong pace, ignored motivation drivers). Auto-memory helps but isn't perfect.

2. **The system requires Claude Code.** This is a CLI tool that runs in a terminal. Non-technical users who are uncomfortable with terminals need a human coach for setup. The bootstrap doesn't solve this — it's a conscious scope boundary.

3. **Long-term progression is untested.** Sessions 1-6 are well-guided by the profile + adaptation guidelines. Session 10+ relies on accumulated context (memory, session history). Whether Claude can maintain coherent learning progression over 20+ sessions is unknown.

4. **The [ADAPT] personalization depends on Claude's judgment.** If Claude fills in the sections poorly, the CLAUDE.md becomes a worse steering document. The backup (`.settings/CLAUDE.md.bootstrap`) enables recovery, but doesn't prevent the issue.

5. **Single-model dependency.** The entire system is designed for Claude Code. It doesn't work with ChatGPT, Copilot, or other AI tools. This is by design (the goal IS to learn Claude Code), but limits portability.

6. **Graduation detection is untested.** The system observes 5 readiness signals across sessions and triggers graduation when signals are consistently present. Whether Claude reliably detects these signals — especially the subtle ones like "understands WHY CLAUDE.md exists" — is unproven. The fast-learner edge case (graduation after a single session) adds complexity. The coach layer provides a safety net: graduation is flagged to the coach, who can confirm or delay.

7. **The coach layer depends on a human actually coaching.** If `.settings/coach/notes.md` exists but the coach stops reviewing flags or updating notes, Claude continues autonomously — which is the baseline behavior anyway. The system degrades gracefully: without a coach, it works exactly as before. But stale coach-notes that contradict the learner's current state could misdirect Claude. A coach who stops coaching should delete `.settings/coach/notes.md` rather than leave outdated instructions in place.

8. **MCP server adds a setup step.** The learner state MCP server requires `npm install` in `.settings/mcp-server/` before first use. The `/bootstrap` command handles this automatically, but manual git-clone users must run it themselves. The server is registered via `.mcp.json` (auto-detected by Claude Code), so no manual `claude mcp add` is needed. If `npm install` fails or `node_modules/` is missing, `/start` detects the problem and tells the user what to do.

9. **`project/` is not a standalone Claude Code project.** Claude Code reads `.claude/settings.json` from the working directory. Since sessions run from the learning repo root (where `/start` and `/end` live), `project/` is just a subdirectory — not an independent Claude Code context. This means hooks, permissions, and settings intended for the learner's project must live in the root `.claude/settings.json`, not in `project/.claude/settings.json`. The learner effectively learns a wrong pattern: "my project's hooks live one level above my project." In real-world use, `project/` would be the repo root. This is a fundamental tension between two requirements: the learning system needs to run from root (for skill routing), but the learner's project needs its own configuration scope (for realistic Claude Code usage). After graduation this resolves naturally — the learner works in their own repo. Pre-graduation, it remains an unsolved architectural limitation. Discovered in Session 04 (Hooks) when a learner identified the mismatch independently.
