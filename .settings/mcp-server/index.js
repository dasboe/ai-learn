import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFile, writeFile, appendFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { existsSync } from "node:fs";

// Project root = grandparent of .settings/mcp-server/
const PROJECT_ROOT = join(dirname(new URL(import.meta.url).pathname), "../..");

function resolve(relativePath) {
  const full = join(PROJECT_ROOT, relativePath);
  // Safety: must stay within project root
  if (!full.startsWith(PROJECT_ROOT)) {
    throw new Error("Path escapes project root");
  }
  return full;
}

async function safeRead(relativePath) {
  const full = resolve(relativePath);
  try {
    return await readFile(full, "utf-8");
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
}

async function safeWrite(relativePath, content) {
  const full = resolve(relativePath);
  const dir = dirname(full);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  await writeFile(full, content, "utf-8");
}

async function safeAppend(relativePath, content) {
  const full = resolve(relativePath);
  const dir = dirname(full);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  await appendFile(full, content, "utf-8");
}

// --- Server ---

const server = new McpServer({
  name: "ai-learn-state",
  version: "1.0.0",
});

// --- Profile ---

server.tool("read_profile", "Read .settings/learner-profile.md", {}, async () => {
  const content = await safeRead(".settings/learner-profile.md");
  if (content === null) return { content: [{ type: "text", text: "File does not exist." }] };
  return { content: [{ type: "text", text: content }] };
});

server.tool("write_profile", "Write .settings/learner-profile.md", { content: z.string() }, async ({ content }) => {
  await safeWrite(".settings/learner-profile.md", content);
  return { content: [{ type: "text", text: "Written." }] };
});

// --- Progression ---

server.tool("read_progression", "Read .settings/progression.md", {}, async () => {
  const content = await safeRead(".settings/progression.md");
  if (content === null) return { content: [{ type: "text", text: "File does not exist." }] };
  return { content: [{ type: "text", text: content }] };
});

server.tool("write_progression", "Write .settings/progression.md", { content: z.string() }, async ({ content }) => {
  await safeWrite(".settings/progression.md", content);
  return { content: [{ type: "text", text: "Written." }] };
});

// --- Coach ---

server.tool("read_coach_notes", "Read .settings/coach/notes.md", {}, async () => {
  const content = await safeRead(".settings/coach/notes.md");
  if (content === null) return { content: [{ type: "text", text: "File does not exist." }] };
  return { content: [{ type: "text", text: content }] };
});

server.tool("append_coach_flags", "Append to .settings/coach/flags.md", { content: z.string() }, async ({ content }) => {
  await safeAppend(".settings/coach/flags.md", content);
  return { content: [{ type: "text", text: "Appended." }] };
});

// --- CLAUDE.md ---

server.tool("read_claude_md", "Read CLAUDE.md", {}, async () => {
  const content = await safeRead("CLAUDE.md");
  if (content === null) return { content: [{ type: "text", text: "File does not exist." }] };
  return { content: [{ type: "text", text: content }] };
});

server.tool("write_claude_md", "Write CLAUDE.md", { content: z.string() }, async ({ content }) => {
  await safeWrite("CLAUDE.md", content);
  return { content: [{ type: "text", text: "Written." }] };
});

// --- Bootstrap backup ---

server.tool("read_bootstrap_backup", "Read .settings/CLAUDE.md.bootstrap", {}, async () => {
  const content = await safeRead(".settings/CLAUDE.md.bootstrap");
  if (content === null) return { content: [{ type: "text", text: "File does not exist." }] };
  return { content: [{ type: "text", text: content }] };
});

server.tool("write_bootstrap_backup", "Write .settings/CLAUDE.md.bootstrap (one-time backup)", { content: z.string() }, async ({ content }) => {
  if (existsSync(resolve(".settings/CLAUDE.md.bootstrap"))) {
    return { content: [{ type: "text", text: "Backup already exists. Not overwritten." }] };
  }
  await safeWrite(".settings/CLAUDE.md.bootstrap", content);
  return { content: [{ type: "text", text: "Written." }] };
});

// --- Session READMEs ---

const sessionSchema = { session: z.string().regex(/^\d{2}$/, "Two-digit session number, e.g. '01'") };

server.tool("read_session_readme", "Read sessions/session-{NN}/README.md", sessionSchema, async ({ session }) => {
  const content = await safeRead(`sessions/session-${session}/README.md`);
  if (content === null) return { content: [{ type: "text", text: "File does not exist." }] };
  return { content: [{ type: "text", text: content }] };
});

server.tool("write_session_readme", "Write sessions/session-{NN}/README.md (creates folder if needed)", {
  session: z.string().regex(/^\d{2}$/, "Two-digit session number, e.g. '01'"),
  content: z.string(),
}, async ({ session, content }) => {
  await safeWrite(`sessions/session-${session}/README.md`, content);
  return { content: [{ type: "text", text: "Written." }] };
});

// --- Reference pages ---

const refSchema = { name: z.string().regex(/^[a-z0-9-]+$/, "Lowercase alphanumeric with hyphens") };

server.tool("read_reference", "Read reference/{name}.md", refSchema, async ({ name }) => {
  const content = await safeRead(`reference/${name}.md`);
  if (content === null) return { content: [{ type: "text", text: "File does not exist." }] };
  return { content: [{ type: "text", text: content }] };
});

server.tool("write_reference", "Write reference/{name}.md", {
  name: z.string().regex(/^[a-z0-9-]+$/, "Lowercase alphanumeric with hyphens"),
  content: z.string(),
}, async ({ name, content }) => {
  await safeWrite(`reference/${name}.md`, content);
  return { content: [{ type: "text", text: "Written." }] };
});

// --- Start ---

const transport = new StdioServerTransport();
await server.connect(transport);
