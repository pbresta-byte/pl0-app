# claude-mem (Claude Code memory plugin)

`claude-mem` is a third-party, open-source memory/compaction plugin for
Claude Code. It captures what the agent does during a session, compresses those
observations with AI (Anthropic's Agent SDK), and injects relevant context back
into future sessions so the assistant does not "forget" prior work on a project.

- Repository: https://github.com/thedotmack/claude-mem
- Author: Alex Newman (`thedotmack`) · License: Apache-2.0
- Verified plugin version at time of writing: **13.15.3**
  (`.claude-plugin/plugin.json`)
- npm package page: https://www.npmjs.com/package/claude-mem

> **This is not wired into cloud/web sessions.** claude-mem runs as a
> **local** Claude Code plugin: it installs a background worker service (Bun
> runtime), local hooks, and a local MCP server, and it persists data on the
> machine where Claude Code runs (see [Data storage](#data-storage)). It is
> meant for a persistent local Claude Code install on your own machine. It does
> **not** run inside ephemeral web/cloud Claude Code sessions (like this one),
> which start from a clean container each time and have nowhere to keep the
> `~/.claude-mem` store. Nothing in this repository enables it automatically —
> the steps below are something a developer runs in their own local
> environment.

## Install / enable

Run inside a local Claude Code install. Two supported paths (both verified from
the project's `README.md`):

**Option A — plugin marketplace (from within a Claude Code session):**

```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

**Option B — installer CLI (from a terminal):**

```bash
npx claude-mem install
```

> **Do not** use `npm install -g claude-mem` as the install step. Per the
> project README, that installs the **SDK/library only** and does **not**
> register the plugin hooks or set up the worker service. Use `npx claude-mem
> install` or the `/plugin` commands above.

Requirements (from the README): Node.js >= 20. The installer also provisions a
Bun runtime and (for vector search) `uv`; a local SQLite database and vector
index back the memory store.

## How it hooks into Claude Code

claude-mem installs itself as a Claude Code **plugin**. When the plugin is
installed, Claude Code auto-registers the plugin's bundled hooks and MCP
server — you do **not** hand-edit project files to wire it up. The concrete
configuration below is taken verbatim from the plugin's own bundled config in
the official repo.

### Hooks

The plugin ships its hook set in `plugin/hooks/hooks.json`. In version 13.15.3
it registers the following Claude Code lifecycle hooks (each runs a `node`
bootstrap that locates the installed plugin root and invokes the plugin's
`worker-service.cjs` with a sub-command):

| Hook event      | Matcher                | What it does (worker sub-command) |
| --------------- | ---------------------- | --------------------------------- |
| `Setup`         | `*`                    | `version-check.js` (dependency / version check) |
| `SessionStart`  | `startup\|clear\|compact` | starts the worker service (`worker-service.cjs start`) and injects context (`hook claude-code context`) |
| `UserPromptSubmit` | (all)               | `hook claude-code session-init` |
| `PostToolUse`   | `*`                    | `hook claude-code observation` (async) — captures observations |
| `PreToolUse`    | `Read`                 | `hook claude-code file-context` (async) |
| `Stop`          | (all)                  | `hook claude-code summarize` (async) — compresses/saves the session |

Notes:
- These hooks are **global to the plugin install**, not project-scoped. They
  live in the plugin package and normally end up referenced from the user's
  Claude Code config (`~/.claude`, i.e. `$CLAUDE_CONFIG_DIR`) once the plugin is
  installed. There is no need to copy them into a project `.claude/settings.json`,
  and this repo intentionally does not do so (see
  [Why this repo does not commit claude-mem config](#why-this-repo-does-not-commit-claude-mem-config)).
- This version's hook set does **not** include a `PreCompact` or `SessionEnd`
  hook; session finalization/compression is driven from the `Stop` hook and the
  `compact` matcher on `SessionStart`. (Some third-party write-ups describe the
  hook set differently; the table above reflects the actual
  `plugin/hooks/hooks.json` in the repo at version 13.15.3.)

### MCP server

The plugin also bundles a local MCP server in `plugin/.mcp.json`. It exposes the
memory-search tools to Claude Code:

- **Server name:** `mcp-search`
- **Transport:** `stdio`
- **Command:** `node -e "<bootstrap>"` — an inline Node bootstrap that resolves
  the installed plugin root (via `CLAUDE_PLUGIN_ROOT` / the plugin cache under
  `$CLAUDE_CONFIG_DIR/plugins/...`) and then spawns the plugin's
  `scripts/mcp-server.cjs`.

Because the command resolves the plugin's own install location at runtime, this
MCP entry is **only meaningful inside the installed plugin** — it is not a
portable, project-level MCP server definition you can drop into an arbitrary
repo's `.mcp.json`. It is registered automatically when you install the plugin.

## Data storage

claude-mem keeps its state locally under the user's home directory (verified
from the plugin scripts in the repo):

- `~/.claude-mem/settings.json` — plugin settings
- `~/.claude-mem/.env` — local environment/config
- `~/.claude-mem/logs/` — logs
- A local SQLite database + vector index back the compressed memory store.

The plugin itself is installed under the Claude Code config dir, e.g.
`~/.claude/plugins/...` (`$CLAUDE_CONFIG_DIR`).

## No secrets in this repo

claude-mem's configuration and any credentials live **outside** this
repository, under `~/.claude-mem/` (including `~/.claude-mem/.env`) on the local
machine. Do not copy that `.env` or any API keys into this repo. Nothing about
enabling claude-mem requires committing secrets here.

## Why this repo does not commit claude-mem config

claude-mem is installed and configured as a **user-global Claude Code plugin**.
Its hooks and its `mcp-search` MCP server are bundled inside the plugin package
and auto-registered from the plugin's install location at runtime; they are not
portable project-level entries. Committing them into this repo's `.mcp.json` or
`.claude/settings.json` would either be redundant with (or conflict with) a real
local plugin install, and the paths would not resolve correctly. For that reason
this repo documents the integration here rather than committing plugin config.
The existing project `.mcp.json` (the `hermes` server) is left unchanged.

## Sources

Verified in this session by cloning the official repo
(`github.com/thedotmack/claude-mem`, `main`) and reading:

- `.claude-plugin/plugin.json` — name, version (13.15.3), author, license
- `plugin/hooks/hooks.json` — the exact hook events and commands
- `plugin/.mcp.json` — the `mcp-search` stdio MCP server definition
- `README.md` — install commands and the `npm install -g` caveat
- `plugin/scripts/*` — `~/.claude-mem/` storage paths

npm package page: https://www.npmjs.com/package/claude-mem
