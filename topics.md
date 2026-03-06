# AI-Themen — Was es gibt

Kompakter Index in fünf Stufen. Keine Erklärungen — nur was existiert, für wen, und seit wann.
Claude nutzt diese Liste als Orientierung und sucht eigenständig nach Details.
Stufen sind Orientierung, keine Pflicht-Reihenfolge.

## Stufe 1 — KI verstehen & prompten
"Was kann KI und wie rede ich mit ihr?"

| Thema | Zielgruppe | Stichworte |
|---|---|---|
| Erste Schritte mit KI | Non-tech | Was kann KI, was nicht? Erwartungen setzen |
| Prompting Basics | Non-tech | Klar formulieren, Kontext geben, Rolle zuweisen |
| Prompt-Patterns | Non-tech / Semi | Few-shot, Chain-of-thought, Perspektivwechsel |
| KI für Texte | Non-tech | Zusammenfassen, Umschreiben, Übersetzen, Tonalität |
| KI für Recherche | Non-tech / Semi | Faktencheck, Quellen, Halluzinationen erkennen |
| KI für Entscheidungen | Semi | Pro/Contra, Szenarien, Entscheidungsmatrizen |
| KI-Ethik & Grenzen | Alle | Bias, Datenschutz, wann KI nicht passt |

## Stufe 2 — CC als Arbeitsumgebung
"Wie nutze ich Claude Code produktiv für meine Arbeit?"

| Thema | Zielgruppe | Stichworte |
|---|---|---|
| CC-Grundbedienung | Alle | Fragen stellen, Ergebnisse bewerten, Konversation führen |
| Dateien erstellen lassen | Alle | KI erstellt Dokumente, Texte, Tabellen |
| Dateien lesen/bearbeiten | Semi / Tech | Read, Write, Edit — KI steuert Dateien |
| Ergebnisse prüfen & korrigieren | Alle | Iterieren, Feedback geben, Qualität sichern |
| Terminal-Befehle | Tech | Bash-Tool, Builds, Tests, Git |
| Projektarbeit mit CC | Semi / Tech | Workflows, Arbeitsteilung Mensch/KI |

## Stufe 3 — CC konfigurieren
"Wie passe ich Claude Code an mein Projekt an?"

| Thema | Zielgruppe | Stichworte |
|---|---|---|
| CLAUDE.md | Semi / Tech | Projekt-Kontext, Regeln, Konventionen |
| Custom Commands | Tech | .claude/commands/, /slash-commands |
| Rules | Tech | .claude/rules/, auto-loaded, modularisiert CLAUDE.md |
| Permissions & Settings | Tech | .claude/settings.json, Tool-Freigaben |
| Auto-Memory | Tech | Cross-Session, ~/.claude/memory |

## Stufe 4 — CC erweitern
"Wie baue ich eigene Tools in Claude Code?"

| Thema | Zielgruppe | Seit | Stichworte |
|---|---|---|---|
| MCP-Server | Tech | 2024 | Model Context Protocol, externe Tools, .mcp.json |
| Skills | Tech | 2025-10 | SKILL.md, Supporting Files, Frontmatter |
| Hooks | Tech | 2026 | PreToolUse, PostToolUse, Stop, Shell-Scripts |
| Subagents | Tech | 2025 | Agent-Tool, Explore, Plan, context: fork |
| Plugins | Tech | 2025 | Installierbare Pakete, Skills + Hooks + MCP |
| Git Worktrees | Tech | 2026 | Parallele Agents, isolierte Repos |
| Skill Hooks | Tech | 2026-03 | Hooks scoped to skill lifecycle |

## Stufe 5 — Eigene KI-Systeme
"Wie baue ich Dinge, die über Claude Code hinausgehen?"

| Thema | Zielgruppe | Stichworte |
|---|---|---|
| Claude API / SDK | Tech | Python/TS SDK, Tool Use, Streaming, Batches |
| Claude Agent SDK | Tech | Custom Agents, Production-Pipelines |
| Structured Output | Tech | JSON Mode, Schema-Validierung, Pydantic |
| Multi-Agent-Systeme | Tech | Orchestrierung, Delegation, Kontextübergabe |
| LangGraph | Tech | Stateful Agent Graphs, Cycles, Checkpoints |
| LangChain | Tech | Chains, Retrieval, Tool-Integration |
| RAG (Retrieval Augmented Generation) | Tech | Embeddings, Vector-DBs, Chunking-Strategien |
| Graph-Datenbanken + KI | Tech | Neo4j, Knowledge Graphs, Graph-RAG |
| Evaluations & Testing | Tech | Prompt-Evals, A/B-Tests, Benchmarks |
| Fine-Tuning vs. Prompting | Tech | Wann was, Kosten, Aufwand, Alternativen |
| KI in Produktion | Tech | Rate Limits, Caching, Kosten, Monitoring |
| Agentic Workflows | Semi / Tech | Automation, n8n, Make, Zapier + KI |
