# Connecting Hermes as an MCP server to Claude Code

This repo registers **Hermes** as a project-scoped [Model Context Protocol
(MCP)](https://modelcontextprotocol.io) server so that Claude Code can call
Hermes as a tool. When you open this repo in Claude Code, it reads
`.mcp.json` at the repo root and offers to connect the `hermes` server.

> **Direction of the connection.** MCP is client→server. Here, **Claude Code is
> the client** and **Hermes is the server**. This is the wiring for "let Claude
> Code use Hermes as a tool." It is *not* the wiring for "let Hermes use Claude
> as its model backend" — that lives inside Hermes/OpenCode and calls the
> Anthropic API instead.

## No secrets are committed

`.mcp.json` uses `${VAR}` placeholders that Claude Code expands from your
environment at connect time. Nothing sensitive is stored in git. Set these
before launching Claude Code:

```bash
export HERMES_MCP_URL="https://your-hermes-host.example/mcp"
export HERMES_MCP_TOKEN="your-hermes-token"
```

If Hermes needs no auth, delete the `headers` block from `.mcp.json`.

## Transport options

### 1. HTTP / SSE (the committed default)

Use this when Hermes exposes a network endpoint. This is what `.mcp.json`
already configures — just fill in `HERMES_MCP_URL` (and `HERMES_MCP_TOKEN` if
required).

### 2. Local stdio (Hermes launched as a subprocess)

Use this when Hermes runs as a local command that speaks MCP over stdio. Replace
the `hermes` entry in `.mcp.json` with:

```json
{
  "mcpServers": {
    "hermes": {
      "type": "stdio",
      "command": "hermes",
      "args": ["mcp", "serve"],
      "env": {
        "HERMES_TOKEN": "${HERMES_MCP_TOKEN}"
      }
    }
  }
}
```

Adjust `command`/`args` to however Hermes/OpenCode starts its MCP server.

## Adding it via the CLI instead

If you prefer not to hand-edit `.mcp.json`, you can register the same server
from a persistent (local) Claude Code install:

```bash
# HTTP transport
claude mcp add --transport http hermes "$HERMES_MCP_URL" \
  --header "Authorization: Bearer $HERMES_MCP_TOKEN"

# or stdio transport
claude mcp add hermes -- hermes mcp serve
```

## Verifying the connection

1. Open this repo in Claude Code and approve the `hermes` server when prompted.
2. Run `/mcp` (or `claude mcp list`) to confirm `hermes` shows as connected.
3. Ask Claude to list Hermes's tools; they should appear as `mcp__hermes__*`.

If it fails to connect, check that `HERMES_MCP_URL` is reachable and that the
token is valid — the most common failures are an unset env var or an
unreachable endpoint.
