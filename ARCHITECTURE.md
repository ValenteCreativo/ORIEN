# ORIEN - Architecture Planning

## Component Ownership

### Kukulcán (PM - Backend/Coordinator)
- Backend Coordinator service
- Session Manager
- Metering Engine
- Payment & Settlement Engine
- API design & documentation

### Pantera (Strategist - Frontend/Provider Node)
- Frontend (Next.js)
- Provider Node design & execution API
- Payment SDK integration
- Security guardrails

---

## Provider Node Architecture

### Purpose
Controlled execution environment on provider hardware that exposes a restricted tool API to renting agents.

### Core Principles
- **No raw shell access** - agents cannot execute arbitrary commands
- **Tool whitelisting** - only pre-approved tools exposed
- **Ephemeral workspaces** - each session gets isolated temp directory
- **No secrets storage** - agents must never store credentials on provider machines
- **Capability-based execution** - tool API defines what's possible

### API Endpoints

#### `GET /health`
Health check for provider node availability.

**Response:**
```json
{
  "status": "ok",
  "uptime": 3600,
  "activeSession": "session_xyz" | null
}
```

#### `GET /tools`
List available tools on this provider node.

**Response:**
```json
{
  "tools": [
    {
      "id": "run_build",
      "name": "Build Project",
      "command": "npm run build",
      "maxDurationSeconds": 300,
      "description": "Runs the build process"
    },
    {
      "id": "render_scene",
      "name": "Render 3D Scene",
      "command": "blender --background --python /scripts/render.py",
      "maxDurationSeconds": 600,
      "args": ["scene_file", "output_path"]
    }
  ]
}
```

#### `POST /tools/run`
Execute a tool with provided arguments.

**Request:**
```json
{
  "sessionId": "session_xyz",
  "toolId": "render_scene",
  "args": {
    "scene_file": "/workspace/scene.blend",
    "output_path": "/workspace/output.png"
  }
}
```

**Response:**
```json
{
  "executionId": "exec_abc123",
  "status": "running",
  "startedAt": "2026-02-08T05:00:00Z"
}
```

#### `GET /executions/:executionId`
Check execution status and retrieve output.

**Response:**
```json
{
  "executionId": "exec_abc123",
  "status": "completed",
  "startedAt": "2026-02-08T05:00:00Z",
  "completedAt": "2026-02-08T05:05:00Z",
  "effectiveDurationSeconds": 300,
  "output": "Build completed successfully...",
  "exitCode": 0
}
```

#### `GET /logs/:executionId`
Stream execution logs.

**Response:** (Server-Sent Events)
```
data: {"timestamp": "2026-02-08T05:00:01Z", "line": "Starting build..."}
data: {"timestamp": "2026-02-08T05:00:05Z", "line": "Compiling..."}
```

### Security Model

#### Workspace Isolation
- Each session gets `/tmp/orien_session_<sessionId>`
- Workspace is deleted after session ends
- Tools can only access session workspace + pre-approved shared resources

#### Tool Whitelisting
Providers define allowed tools in `provider-config.json`:

```json
{
  "providerId": "provider_xyz",
  "tools": [
    {
      "id": "run_build",
      "command": "npm run build",
      "workspaceRequired": true,
      "maxDuration": 300,
      "resourceLimits": {
        "cpu": "2",
        "memory": "4GB"
      }
    }
  ]
}
```

#### Execution Guardrails
1. **Time limits** - hard timeout per tool
2. **Resource caps** - CPU/memory limits
3. **Command validation** - no command injection
4. **Allowlist enforcement** - only pre-configured tools can run
5. **Workspace confinement** - tools cannot escape workspace

---

## Frontend Architecture

### Pages

#### `/marketplace`
Browse available providers and their capabilities.

**Components:**
- `ProviderCard` - shows provider info, pricing, uptime, tools
- `FilterBar` - filter by capability type, price range, uptime
- `ProviderDetails` - modal/drawer with full provider info

**Data needed:**
- `GET /api/providers` - list all providers
- `GET /api/providers/:id` - provider details

#### `/sessions/new`
Start a new execution session.

**Components:**
- `ProviderSelector` - pick provider
- `BudgetInput` - set session budget allowance
- `MissionInput` - describe mission (optional metadata)
- `PaymentMethodSelector` - choose payment token (if using LI.FI)

**Flow:**
1. Select provider
2. Set budget (in USDC or other token via LI.FI)
3. Confirm session start
4. Redirect to `/sessions/:sessionId`

#### `/sessions/:sessionId`
Active session console.

**Components:**
- `SessionHeader` - status, elapsed time, budget consumed
- `ExecutionLog` - real-time log of tool executions
- `ToolPalette` - list of available tools on this provider
- `ExecuteTool` - form to run a tool with args
- `CostMeter` - visual indicator of budget consumption

**Real-time updates:**
- WebSocket or SSE for live execution logs
- Metering updates every N seconds

#### `/sessions/history`
Past sessions.

**Components:**
- `SessionList` - table of past sessions with status, duration, cost
- `SessionSummary` - expandable details per session

#### `/earnings`
Provider earnings dashboard.

**Components:**
- `EarningsOverview` - total earned, pending, settled
- `RecentSessions` - sessions that generated earnings
- `WithdrawButton` - trigger USDC withdrawal
- `ReinvestmentPanel` - configure DeFi reinvestment strategy

---

## Payment Flow

### Session Start
1. Agent calls `POST /api/sessions`
2. Backend creates Yellow session ledger
3. Agent deposits budget allowance (USDC or token via LI.FI)
4. Session ID returned, execution can begin

### During Execution
1. Agent calls provider node `POST /tools/run`
2. Provider node executes tool, tracks effective time
3. Provider node reports execution receipt to backend
4. Backend debits Yellow ledger based on effective time × rate

### Session End
1. Agent calls `POST /api/sessions/:id/end`
2. Backend calculates final balance
3. Settlement executed:
   - Provider: 90% USDC
   - ORIEN fee: 7%
   - Reserve: 3%
4. Yellow session closed
5. Arc transfer executed for provider payout

### Reinvestment (Optional)
1. Provider sets reinvestment strategy in UI
2. After each payout, ORIEN executes LI.FI route:
   - USDC → target DeFi protocol
   - E.g., deposit into Aave, buy yield tokens, etc.

---

## Data Models

### Provider
```typescript
interface Provider {
  id: string;
  name: string;
  description: string;
  ensName?: string;
  pricePerMinute: number; // USDC
  tools: Tool[];
  uptime: number; // percentage
  totalSessions: number;
  reputation: {
    completedSessions: number;
    disputes: number;
    avgResponseTime: number; // ms
  };
  payoutAddress: string; // wallet address
  reinvestmentStrategy?: ReinvestmentStrategy;
}
```

### Tool
```typescript
interface Tool {
  id: string;
  name: string;
  description: string;
  command: string;
  args: ToolArgument[];
  maxDurationSeconds: number;
  resourceLimits: {
    cpu: string;
    memory: string;
  };
}
```

### Session
```typescript
interface Session {
  id: string;
  agentId: string;
  providerId: string;
  budgetAllowance: number; // USDC
  budgetConsumed: number; // USDC
  status: 'active' | 'completed' | 'expired' | 'failed';
  startedAt: string;
  endedAt?: string;
  effectiveExecutionSeconds: number;
  executions: Execution[];
}
```

### Execution
```typescript
interface Execution {
  id: string;
  sessionId: string;
  toolId: string;
  args: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  effectiveDurationSeconds: number;
  output: string;
  exitCode?: number;
  cost: number; // USDC
}
```

### Settlement
```typescript
interface Settlement {
  id: string;
  sessionId: string;
  totalCost: number; // USDC
  providerPayout: number; // 90%
  platformFee: number; // 7%
  reserve: number; // 3%
  settledAt: string;
  txHash: string; // blockchain transaction hash
}
```

---

## Tech Stack Details

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **State:** React hooks + Context (or Zustand if needed)
- **Real-time:** WebSockets or Server-Sent Events
- **Forms:** React Hook Form + Zod validation
- **HTTP client:** fetch (native) or ky

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Next.js API routes (or Express if separate)
- **Database:** PostgreSQL (via Prisma or pg)
- **Payment SDKs:**
  - Yellow SDK (session ledger)
  - Arc SDK (USDC settlement)
  - LI.FI SDK (token swaps, reinvestment)
- **Metering:** In-memory or Redis for active session state
- **Auth:** API keys for agent access, JWT for provider dashboard

### Provider Node
- **Runtime:** Node.js 20+ (lightweight)
- **Framework:** Fastify (fast, low overhead)
- **Process isolation:** child_process with resource limits
- **Workspace management:** fs + tmpdir
- **Security:** no-shell execution, allowlist enforcement

### DevOps (Future)
- **Hosting:** Vercel (frontend), Railway/Fly.io (backend)
- **Database:** Supabase or Neon (managed Postgres)
- **Monitoring:** Sentry (errors), LogTail (logs)

---

## Next Steps (Immediate)

### Kukulcán
- [ ] Initialize pnpm workspace monorepo
- [ ] Setup Next.js app in `apps/frontend`
- [ ] Setup Node.js backend in `apps/backend`
- [ ] Configure TypeScript
- [ ] Setup Prisma with initial schema (providers, sessions, executions)
- [ ] Create API route stubs (`POST /api/sessions`, `GET /api/providers`)

### Pantera
- [ ] Create Provider Node scaffold in `apps/provider-node`
- [ ] Implement `/tools` and `/tools/run` endpoints
- [ ] Design frontend pages (`/marketplace`, `/sessions/:id`)
- [ ] Create component library in `packages/ui`
- [ ] Setup payment SDK integration docs
- [ ] Implement security guardrails (tool whitelisting, workspace isolation)

---

## Questions / Blockers

- **API keys needed:** Yellow, Arc, LI.FI → tag <@1065151917023576074> when ready
- **Database decision:** PostgreSQL via Prisma or raw pg? (recommend Prisma for type safety)
- **Monorepo structure:** pnpm workspaces or Turborepo?
- **Provider Node deployment:** SSH-based or Docker for demo?

---

_Last updated: 2026-02-08 by Pantera_
