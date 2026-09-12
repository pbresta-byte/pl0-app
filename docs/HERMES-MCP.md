# Connecting Hermes as an MCP server to Claude Code

This repo registers **Hermes** as a project-scoped [Model Context Protocol
(MCP)](https://modelcontextprotocol.io) server so that Claude Code can call
Hermes as a tool. When you open this repo in Claude Code, it reads
`.mcp.json` at the repo root and offers to connect the `hermes` server.

> **Direction of the connection.** MCP is client->server. Here, **Claude Code is
> the client** and **Hermes is the server**. This is the wiring for "let Claude
> Code use Hermes as a tool." It is *not* the wiring for "let Hermes use Claude
> as its model backend" -- that lives inside Hermes/OpenCode and calls the
> Anthropic API instead.

## Current configuration: local stdio

Hermes runs as a local Node process that speaks MCP over stdio. Claude Code
launches it as a subprocess. This is what `.mcp.json` configures:

```json
{
  "mcpServers": {
    "hermes": {
      "type": "stdio",
      "command": "node",
      "args": ["C:\\Users\\drrag\\OneDrive\\Desktop\\pl0-unpacked\\hermes-agent-mcp.js"]
    }
  }
}
```

> **The script path is machine-specific.** The absolute Windows path above
> points at one particular machine's copy of `hermes-agent-mcp.js`. On any other
> machine, edit the path in `.mcp.json` to wherever the Hermes MCP script lives.
> No secrets are stored here; if the script needs credentials, provide them via
> the script's own environment (add an `"env": { ... }` block referencing
> `${VAR}` placeholders rather than hardcoding values).

## Alternative: HTTP / SSE transport

If you instead run Hermes as a network service, replace the `hermes` entry with
an HTTP endpoint and (optionally) an auth header sourced from an env var so no
secret is committed:

```json
{
  "mcpServers": {
    "hermes": {
      "type": "http",
      "url": "${HERMES_MCP_URL}",
      "headers": { "Authorization": "Bearer ${HERMES_MCP_TOKEN}" }
    }
  }
}
```

Then set `HERMES_MCP_URL` (and `HERMES_MCP_TOKEN` if required) in your
environment before launching Claude Code. Drop the `headers` block if Hermes
needs no auth.

## Adding it via the CLI instead

If you prefer not to hand-edit `.mcp.json`, register the same server from a
persistent (local) Claude Code install:

```bash
# stdio transport (current setup)
claude mcp add hermes -- node "C:\\Users\\drrag\\OneDrive\\Desktop\\pl0-unpacked\\hermes-agent-mcp.js"

# or HTTP transport
claude mcp add --transport http hermes "$HERMES_MCP_URL" \
  --header "Authorization: Bearer $HERMES_MCP_TOKEN"
```

## Verifying the connection

1. Open this repo in Claude Code and approve the `hermes` server when prompted.
2. Run `/mcp` (or `claude mcp list`) to confirm `hermes` shows as connected.
3. Ask Claude to list Hermes's tools; they should appear as `mcp__hermes__*`.

If it fails to connect: confirm Node is installed and on PATH, that the script
path in `.mcp.json` exists on this machine, and that running
`node <path-to-hermes-agent-mcp.js>` by hand starts without error.

## Note on ephemeral sessions

Claude Code running in an ephemeral web/cloud container cannot use this config:
it has no access to your local machine's filesystem, so the stdio script path
will not resolve there. This server is for a persistent, local Claude Code
install.
