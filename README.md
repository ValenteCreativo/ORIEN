# ORIEN

**Orchestration Rail for Infrastructure & Execution Networks**

The compute marketplace for agents.

## Overview

ORIEN is an orchestration rail where autonomous agents rent specialized compute infrastructure to execute missions. Providers list their pre-configured hardware (Mac minis, servers) with expensive software stacks, and agents pay for effective execution time.

**Key principles:**
- Agents are primary users
- Billing based on effective execution time (not idle)
- Settlements in USDC
- No scope creep: ORIEN is a rail, not a cloud, not an OS, not a DAO

## Documentation

See [SPEC.md](./SPEC.md) for the complete specification.

## Stack

- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: Next.js API Routes
- Payments: Yellow SDK, Arc (USDC), LI.FI SDK (pending integration)
- Package manager: pnpm

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Initialize demo data (after server is running)
curl -X POST http://localhost:3000/api/init
```

## API Endpoints

### Core
- `GET /api/health` - Health check
- `POST /api/init` - Initialize demo data

### Providers
- `GET /api/providers` - List all providers
- `POST /api/providers` - Register a provider
- `GET /api/providers/:id` - Get provider details
- `PATCH /api/providers/:id` - Update provider
- `DELETE /api/providers/:id` - Remove provider

### Sessions
- `GET /api/sessions` - List sessions
- `POST /api/sessions` - Create a new session
- `GET /api/sessions/:id` - Get session details
- `PATCH /api/sessions/:id` - Update session (start/end)
- `POST /api/sessions/:id/execute` - Execute a tool

### Payments
- `GET /api/payments` - List settlements
- `POST /api/payments` - Settle a session
- `GET /api/metering?sessionId=xxx` - Get metering report

## Status

🚧 MVP in development

### Completed
- [x] Project structure (Next.js + TypeScript)
- [x] Core types and interfaces
- [x] In-memory database (MVP)
- [x] Provider Registry API
- [x] Session Manager API
- [x] Metering Engine
- [x] Payment & Settlement API
- [x] Basic UI (Marketplace, Sessions, Earnings)

### Pending
- [ ] Payment rails integration (Yellow, Arc, LI.FI)
- [ ] Provider Node implementation
- [ ] Real database (PostgreSQL/Convex)
- [ ] Authentication/authorization
- [ ] UI polish and design system
- [ ] Reinvestment strategies

## License

TBD

---

Built with 🐍 by Frutero
