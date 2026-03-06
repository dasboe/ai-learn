# Returning Session — Pre-Graduation

Flow for returning learners who have not yet graduated.

`$ARGUMENTS` may contain a topic request — overrides the recommendation from context.md.

**All state file operations use MCP tools — see CLAUDE.md § Learner State.**

---

## Step 1 — Orient (silent)

Read:
- `.settings/context.md` via `state(action: "read", file: "context")`
- `.settings/coach/notes.md` (if exists — coach instructions override defaults)

Extract:

| What | Source |
|---|---|
| Tech level + pace | context.md → Lerner-Kurzprofil |
| Current stage (Stufe) | context.md → Aktueller Stand |
| Last session number | context.md → Aktueller Stand |
| What was built last | Sessions Log in `CLAUDE.md` |
| Next topic | context.md → Nächste Session |

If `$ARGUMENTS` contains a topic or coach notes override → use that instead.

---

## Step 2 — Research (silent, conditional)

### Part A — Topics Registry

Fetch `topics.md` from the GitHub repo (Raw-URL via WebFetch, silent).

| Result | Action |
|---|---|
| Fetch successful | Use the current stage from context.md to filter relevant topics. Primarily: topics of the current stage. Secondary: topics of the next stage (only if stage-change signals are present). Ignore: earlier stages and stages 2+ away. |
| Fetch failed | Continue with own knowledge + web search. Don't mention the failure. |

### Part B — Web Search (conditional)

Only run this if ALL of these are true:
- Tech level = Technical
- Current stage ≥ 2 (Stage 1 focuses on basic Claude Code partnership — no search needed)

Search Anthropic's own sources, focused on the planned session topic:
- `site:anthropic.com` — official guides, feature explanations, best practices
- `site:docs.anthropic.com` — updated documentation

Extract max 3 bullets:
- A technique or pattern not yet covered in previous sessions
- A feature relevant to today's topic
- A better way to do something already learned

Skip: general AI news, hype, third-party opinions, anything already covered in the Sessions Log.

| Result | Action |
|---|---|
| Relevant findings | Weave into Step 5 (Brief) under "Aktuell von Anthropic:" |
| Nothing relevant | Continue silently. Don't mention the search. |

---

## Step 3 — Plan the session

### Concept — one only

| Tech level | Content focus |
|---|---|
| Non-technical | Prompting, text workflows, AI for their domain. Stage 3+: what CLAUDE.md does, how project structure helps |
| Semi-technical | Bridging existing tools with AI. Stage 2+: Claude Code basics, shaping their environment |
| Technical | Code architecture, Claude Code features (CLAUDE.md, MCPs, hooks, subagents) |

### Deliverable — one tangible thing

Match to motivation driver (from "What drives me" in profile):

| Motivation driver | Must feel like | Example |
|---|---|---|
| Time/effort savings | "30 min → 30 seconds" | Business proposal, reformatted report |
| Intellectual challenge | "Sharp, at my level" | Non-obvious analysis, strategy doc with depth |
| Creative expression | "My idea came to life" | Working HTML from design, visualization |
| Proof of competence | "I did that. I verified it." | Code they steered and reviewed |
| Understanding/discovery | "Now I get WHY" | Self-written explanation, visible experiment |
| Production utility | "I can use this tomorrow" | Tool config, pipeline, working script |

**Test: Would THIS person be excited to show this to someone?**

### Depth

| Pace | Approach |
|---|---|
| Steady | Explain everything. Analogies. Check understanding after each step. One small concept, celebrate the win. |
| Moderate | Explain new concepts, build on existing knowledge. One concept with hands-on practice. |
| Fast | Skip obvious things. Nuance, trade-offs, deeper patterns. Challenge the learner. |

---

## Step 4 — Create session folder

Session number = last + 1 (zero-padded: `01`, `02`...).

Create `sessions/session-{NN}/README.md`:

```markdown
# Session {NN} — {Topic}

## What We Learn
{one sentence}

## What We Create
{one sentence}

## Key Takeaways
<!-- filled during session -->

## Files Created
<!-- filled during session -->

## Next Session Preview
<!-- filled at end -->
```

---

## Step 5 — Brief the user

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SESSION {NN} — {Topic}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Last session: {what was built}
Today: {what we learn + create}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

| Pace | Adjustment |
|---|---|
| Steady | Add a sentence making the session feel approachable |
| Fast | Keep minimal — they want to start |

---

## Step 6 — Update sessions log

Add row to `## Sessions Log` in `CLAUDE.md`:
```
| {NN} | {Topic} | — |
```
Third column filled by `/end`.

---

## During the session

- Build the deliverable together
- One concept — don't overload
- Every session produces something tangible
- **Follow the Tool Announcements matrix** (CLAUDE.md) — announce file writes and bash commands before triggering permission prompts, especially for non-technical learners

| Learner behavior | Response |
|---|---|
| Struggles | Slow down, simplify, smaller pieces |
| Flies through it | Add depth, broader connections, challenge |
| Behaves differently than profile predicts | Note the mismatch — feeds `/end` review |

**Observe vs. profile**: Actively compare actual behavior against profile predictions. Faster/slower than expected? Deeper questions than tech level suggests? More reassurance needed? These observations feed the `/end` review.

Document progress in `sessions/session-{NN}/README.md` as you go.
