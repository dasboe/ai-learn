import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFile, writeFile, appendFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

// Integrity-check script lives in the plugin cache, next to mcp-server
const PLUGIN_ROOT = dirname(new URL(import.meta.url).pathname);
const INTEGRITY_SCRIPT = join(PLUGIN_ROOT, "../hooks/integrity-check.js");

// Default project root: CWD fallback for when no projectRoot is passed
const DEFAULT_ROOT = process.cwd();

function getProjectRoot(projectRoot) {
  return projectRoot || DEFAULT_ROOT;
}

function resolveSafe(projectRoot, relativePath) {
  const root = getProjectRoot(projectRoot);
  const full = join(root, relativePath);
  if (!full.startsWith(root)) {
    throw new Error("Path escapes project root");
  }
  return full;
}

// Map logical file keys to relative paths
function resolvePath(file) {
  const sessionMatch = file.match(/^session-(\d{2})$/);
  if (sessionMatch) return `sessions/session-${sessionMatch[1]}/README.md`;

  const refMatch = file.match(/^ref-([a-z0-9-]+)$/);
  if (refMatch) return `reference/${refMatch[1]}.md`;

  const map = {
    "profile": ".settings/learner-profile.md",
    "context": ".settings/context.md",
    "coach-notes": ".settings/coach/notes.md",
    "coach-flags": ".settings/coach/flags.md",
    "claude-md": "CLAUDE.md",
    "bootstrap": ".settings/CLAUDE.md.bootstrap",
  };

  if (!map[file]) throw new Error(`Unknown file key: ${file}`);
  return map[file];
}

// Run integrity-check.js and return result
function runIntegrityCheck(projectRoot) {
  try {
    const result = execSync(`node "${INTEGRITY_SCRIPT}"`, { cwd: getProjectRoot(projectRoot), encoding: "utf-8" });
    return result.trim();
  } catch (e) {
    return JSON.stringify({ status: "error", message: e.message });
  }
}

// --- Server ---

const server = new McpServer({
  name: "ai-learn-state",
  version: "2.0.0",
});

server.tool(
  "state",
  "Read, write, or append learner state files. Always pass projectRoot with the absolute path to the learner's project directory. Keys: profile, context, coach-notes, coach-flags, claude-md, bootstrap, session-NN, ref-{name}, integrity (read-only, runs integrity check)",
  {
    action: z.enum(["read", "write", "append"]),
    file: z.string().describe("File key: profile, context, coach-notes, coach-flags, claude-md, bootstrap, session-01, ref-some-name, integrity"),
    content: z.string().optional().describe("Content to write/append (required for write/append)"),
    projectRoot: z.string().optional().describe("Absolute path to the learner's project directory"),
  },
  async ({ action, file, content, projectRoot }) => {
    // Integrity check: read-only, runs script
    if (file === "integrity") {
      if (action !== "read") {
        return { content: [{ type: "text", text: "Error: integrity key is read-only." }] };
      }
      const result = runIntegrityCheck(projectRoot);
      return { content: [{ type: "text", text: result }] };
    }

    const relativePath = resolvePath(file);
    const full = resolveSafe(projectRoot, relativePath);

    if (action === "read") {
      try {
        const data = await readFile(full, "utf-8");
        return { content: [{ type: "text", text: data }] };
      } catch (e) {
        if (e.code === "ENOENT") return { content: [{ type: "text", text: "File does not exist." }] };
        throw e;
      }
    }

    if (!content) {
      return { content: [{ type: "text", text: "Error: content is required for write/append." }] };
    }

    // Bootstrap backup: one-time only
    if (file === "bootstrap" && action === "write" && existsSync(full)) {
      return { content: [{ type: "text", text: "Backup already exists. Not overwritten." }] };
    }

    const dir = dirname(full);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    if (action === "write") {
      await writeFile(full, content, "utf-8");
      return { content: [{ type: "text", text: "Written." }] };
    }

    if (action === "append") {
      await appendFile(full, content, "utf-8");
      return { content: [{ type: "text", text: "Appended." }] };
    }
  }
);

// --- Start ---

const transport = new StdioServerTransport();
await server.connect(transport);
