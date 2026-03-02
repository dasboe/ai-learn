# Returning Session — Pre-Graduation

Flow for returning learners who have not yet graduated.

`$ARGUMENTS` may contain a topic request — overrides the recommendation from `progression.md`.

---

## Step 1 — Integrity Check (silent — say nothing to the user)

A fresh instance validates system health before starting.

### A. Structural check

| File | If missing |
|---|---|
| `learner-profile.md` | **Critical** — tell the user, stop. |
| `progression.md` | Create minimal stub (phase: "Unknown"). Flag to coach. |
| `CLAUDE.md.bootstrap` | Flag to coach. Skip drift check (B). |
| `sessions/` directory | Create it. Flag to coach. |

### B. CLAUDE.md drift check

Compare `CLAUDE.md` against `CLAUDE.md.bootstrap` (if exists).

| Sections | Expected state | If wrong |
|---|---|---|
| `## First Contact Protocol`, `## Teaching Boundary`, `## Rules`, `## Skills` | Identical to bootstrap | Restore from bootstrap |
| `## My Project`, `## My Stack`, `## Session Conventions` | Different from bootstrap (personalized) | If still placeholder (`*Will be filled after profiling.*`), flag to coach |
| `## Sessions Log` | Has rows | If empty despite existing sessions, reconstruct from session READMEs |

### C. Progression size check

If "Verlauf" in `progression.md` has >15 entries: compress (keep last 5 intact, summarize earlier ones). Flag compression to coach.

### D. Report

| Result | Action |
|---|---|
| All checks pass | Continue silently |
| Issues auto-repaired | Continue. Append to `.coach/flags.md`: `### Integrity Check — {date}` with what was found/repaired |
| Critical (no profile) | Stop. Tell user. |

---

## Step 2 — Orient (silent)

Read:
- `learner-profile.md`
- `progression.md`
- `.coach/notes.md` (if exists — coach instructions override defaults)

Extract:

| What | Source |
|---|---|
| Tech level + pace | `learner-profile.md` |
| Last session number | Sessions Log in `CLAUDE.md` |
| What was built last | Sessions Log in `CLAUDE.md` |
| Next topic | "Nächster Schritt" in `progression.md` |

If `$ARGUMENTS` contains a topic or coach notes override → use that instead.

---

## Step 3 — Research (silent, conditional)

Only run this step if ALL of these are true:
- Tech level = Technical
- Current phase ≥ 2 (Phase 1 focuses on basic Claude Code partnership — no search needed)

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
| Relevant findings | Weave into Step 6 (Brief) under "Aktuell von Anthropic:" |
| Nothing relevant | Continue silently. Don't mention the search. |

---

## Step 4 — Plan the session

### Concept — one only

| Tech level | Content focus |
|---|---|
| Non-technical | Prompting, text workflows, AI for their domain. Phase 3+: what CLAUDE.md does, how project structure helps |
| Semi-technical | Bridging existing tools with AI. Phase 2+: Claude Code basics, shaping their environment |
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

## Step 5 — Create session folder

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

## Step 6 — Brief the user

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

## Step 7 — Update sessions log

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

| Learner behavior | Response |
|---|---|
| Struggles | Slow down, simplify, smaller pieces |
| Flies through it | Add depth, broader connections, challenge |
| Behaves differently than profile predicts | Note the mismatch — feeds `/end` review |

**Observe vs. profile**: Actively compare actual behavior against profile predictions. Faster/slower than expected? Deeper questions than tech level suggests? More reassurance needed? These observations feed the `/end` review.

Document progress in `sessions/session-{NN}/README.md` as you go.
