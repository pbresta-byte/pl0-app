
## Agent-to-agent bridge (MCP)

`mcp-server.js` exposes the calculation engines to external AI agents over the
Model Context Protocol (stdio). Verified working with `initialize` /
`tools/list` / `tools/call`.

### Connect Claude Code
```
claude mcp add pl0-jyotish -- node C:\Users\drrag\OneDrive\Desktop\pl0-unpacked\mcp-server.js
```

### Connect any MCP client (incl. Hermes)
Add to mcp_servers config:
```json
{ "pl0-jyotish": { "command": "node",
  "args": ["C:\\Users\\drrag\\OneDrive\\Desktop\\pl0-unpacked\\mcp-server.js"] } }
```

### Tools
| tool | args | returns |
|---|---|---|
| `panchanga` | datetime, utcOffsetHours, lat, lon | tithi, paksha, nakshatra+pada, yoga, karana, ascendant |
| `planet_positions` | same (+optional tropical) | sidereal longitudes/speeds/retrograde for all grahas |
| `vimshottari` | moonSiderealLongitude | mahadasha chain |

Example verified output (2026-07-30 12:00 IST, Delhi): Krishna Pratipada,
Moon in Sravana pada 4, Ayushman yoga, Kaulava karana, Libra ascendant.


## Hermes-as-agent bridge (`hermes-agent-mcp.js`)

The reverse direction of `mcp-server.js`: lets **Claude** (Code, Console, or any
MCP client) delegate work to **Hermes Agent** as an autonomous worker. Each tool
call spawns a real `hermes chat -q "<prompt>"` subprocess with full Hermes tool
access (files, terminal, web, skills, memory).

Registered for Claude (user scope — available in every project):
```
claude mcp add hermes --scope user   --env HERMES_BIN="C:\Users\drrag\AppData\Local\hermes\hermes-agent\venv\Scripts\hermes.exe"   -- node C:\Users\drrag\OneDrive\Desktop\pl0-unpacked\hermes-agent-mcp.js
```

### Tools
| tool | behavior |
|---|---|
| `ask_hermes` | run a task, wait, return Hermes' answer |
| `ask_hermes_async` | start a long task, get job id back immediately |
| `check_hermes_job` | poll an async job |

### Config env vars
- `HERMES_BIN` — path to the hermes launcher (default: `hermes` on PATH)
- `HERMES_MCP_MODEL` — model for the spawned runs (default: `poolside/laguna-s-2.1:free`,
  chosen because the default Nous model hits the account's credit wall in CLI runs)

Verified: handshake ✔ Connected via `claude mcp list`; end-to-end tool call
returns Hermes' answer (tested directly over stdio).
