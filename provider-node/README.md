# ORIEN Provider Node

The execution host for ORIEN compute marketplace.

## Overview

The Provider Node is a lightweight server that runs on provider hardware (Mac minis, servers, etc.) and exposes a **restricted, capability-based API** for agent execution.

**Key principles:**
- No raw shell access for agents
- Tool whitelisting (only pre-approved commands)
- Ephemeral workspaces (auto-deleted after sessions)
- Resource limits per tool
- No agent secrets stored on provider machines

## Architecture

```
┌─────────────────────────────────────────────┐
│  ORIEN Coordinator (Backend)                │
│  - Session Manager                          │
│  - Metering Engine                          │
│  - Payment Engine                           │
└─────────────┬───────────────────────────────┘
              │
              │ HTTP API
              │
┌─────────────▼───────────────────────────────┐
│  Provider Node (This)                       │
│  - Tool Registry                            │
│  - Execution Engine                         │
│  - Workspace Manager                        │
└─────────────┬───────────────────────────────┘
              │
              │ spawn()
              │
┌─────────────▼───────────────────────────────┐
│  Isolated Execution Environment             │
│  /tmp/orien-workspaces/<sessionId>/         │
│  - No network access (optional)             │
│  - Resource limits enforced                 │
│  - Auto-deleted after session               │
└─────────────────────────────────────────────┘
```

## API Endpoints

### `GET /health`
Health check and metrics.

**Response:**
```json
{
  "status": "ok",
  "uptime": 3600,
  "activeExecutions": 2,
  "totalExecutions": 150,
  "version": "0.1.0"
}
```

### `GET /tools`
List available tools on this provider node.

**Response:**
```json
{
  "tools": [
    {
      "id": "echo",
      "name": "Echo",
      "description": "Simple echo command",
      "args": [
        {
          "name": "message",
          "type": "string",
          "required": true,
          "description": "Message to echo"
        }
      ],
      "maxDurationSeconds": 5
    }
  ]
}
```

### `POST /execute`
Execute a tool with arguments.

**Request:**
```json
{
  "sessionId": "session-abc123",
  "toolId": "node_script",
  "args": {
    "script": "index.js"
  }
}
```

**Response (202 Accepted):**
```json
{
  "executionId": "exec-xyz789",
  "status": "pending",
  "startedAt": "2026-02-08T05:00:00Z"
}
```

### `GET /executions/:executionId`
Get execution status and results.

**Response:**
```json
{
  "executionId": "exec-xyz789",
  "status": "completed",
  "startedAt": "2026-02-08T05:00:00Z",
  "completedAt": "2026-02-08T05:00:05Z",
  "effectiveDurationMs": 5000,
  "output": "Build completed successfully\n",
  "exitCode": 0
}
```

### `DELETE /sessions/:sessionId/workspace`
Clean up workspace after session ends.

**Response:**
```json
{
  "success": true,
  "message": "Workspace cleaned up"
}
```

## Configuration

Configuration is done via environment variables or `src/config.ts`:

| Variable | Default | Description |
|----------|---------|-------------|
| `PROVIDER_ID` | `provider-demo` | Unique provider identifier |
| `PROVIDER_NAME` | `Demo Provider Node` | Human-readable name |
| `COORDINATOR_URL` | `http://localhost:3000` | ORIEN Coordinator URL |
| `PROVIDER_API_KEY` | `demo-key` | API key for coordinator auth |
| `PORT` | `4000` | Server port |
| `WORKSPACE_ROOT` | `/tmp/orien-workspaces` | Workspace directory |

## Tool Whitelisting

Tools are defined in `src/config.ts`. Only whitelisted tools can be executed.

**Example tool definition:**
```typescript
{
  id: 'python_script',
  name: 'Run Python Script',
  description: 'Execute a Python script in the workspace',
  command: 'python3',
  args: [
    {
      name: 'script',
      type: 'file',
      required: true,
      description: 'Path to the Python script (relative to workspace)',
    },
  ],
  maxDurationSeconds: 120,
  resourceLimits: {
    maxCpu: 75,
    maxMemory: 1024, // MB
  },
}
```

## Security Model

### Workspace Isolation
- Each session gets `/tmp/orien-workspaces/<sessionId>`
- Workspace is **deleted** after session ends
- Tools can only access session workspace + pre-approved shared resources

### Command Execution
- **No shell execution** - uses `spawn()` directly
- **No command injection** - arguments are validated and escaped
- **Timeout enforcement** - hard kill after `maxDurationSeconds`
- **Resource limits** - CPU/memory caps (via cgroups in production)

### No Agent Secrets
- Agents must **never** store credentials on provider machines
- Secrets stay on agent's local machine or secure vaults
- Provider Node is **stateless** between sessions

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode (with hot reload)
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

## Running the Provider Node

```bash
# Start with default config
pnpm dev

# Or with custom environment
PROVIDER_ID=my-provider PORT=5000 pnpm dev
```

Server will start at `http://localhost:4000` (or your configured port).

## Testing Execution

```bash
# Check health
curl http://localhost:4000/health

# List available tools
curl http://localhost:4000/tools

# Execute a tool
curl -X POST http://localhost:4000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session",
    "toolId": "echo",
    "args": {
      "message": "Hello ORIEN!"
    }
  }'

# Get execution status (use executionId from previous response)
curl http://localhost:4000/executions/exec-xyz789
```

## Production Deployment

For production, consider:
- **Reverse proxy** (nginx, Caddy) with TLS
- **Firewall rules** - only allow coordinator IP
- **Resource monitoring** - track CPU/memory/disk usage
- **Log aggregation** - ship logs to centralized service
- **Auto-restart** - use systemd or Docker with restart policy
- **Backup strategy** - periodic snapshots (if needed)

## Future Enhancements

- [ ] Container-based execution (Docker, Podman)
- [ ] GPU tool support (for ML/rendering)
- [ ] Network sandboxing (block external connections)
- [ ] Disk I/O limits
- [ ] Real-time execution logs (SSE)
- [ ] Tool marketplace (dynamic tool installation)

---

**Status:** ✅ MVP Complete  
**Owner:** Pantera (Strategist)  
**Last updated:** 2026-02-08
