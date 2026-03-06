# MCP Usage

All learner state files are managed through the `ai-learn-state` MCP server's `state` tool.
**Never use Read/Write/Edit tools for these files — always use `state`:**

```
state(action: "read"|"write"|"append", file: "<key>", content?: "<text>")
```

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
| `integrity` | — (runs check script) | read |

The tool runs silently — the learner never sees the content of state files.
