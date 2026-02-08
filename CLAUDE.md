# CLAUDE.md — ORIEN Project Context

## Overview

**ORIEN** — Orchestration Rail for Infrastructure & Execution Networks  
The compute marketplace for agents.

Agents rent specialized compute (Mac minis, servers with expensive software) and pay for **effective execution time** only. Settlements in USDC.

**Repo:** `/home/kukulcan/projects/ORIEN`  
**Stack:** Next.js 16 + TypeScript + Tailwind CSS + pnpm

---

## Phase Status

| Phase | Status | Description |
|-------|--------|-------------|
| 0 - Setup | ✅ Done | Project scaffold, types, mock DB |
| 1 - Core APIs | ✅ Done | Provider registry, sessions, metering, payments |
| 2 - Frontend | 🔨 In Progress | Marketplace UI, session console, earnings |
| 3 - Provider Node | ⏳ Pending | Real execution host, tool API |
| 4 - Payment Rails | ✅ Done | Yellow, Arc/Circle, LI.FI integration |
| 5 - Production | ⏳ Pending | Real DB, auth, deployment |

---

## Architecture Rules

- **Agents are primary users** — UI is secondary, API-first design
- **Billing = effective time only** — no idle charges
- **90/7/3 split** — provider 90%, platform 7%, reserve 3%
- **No shell access** — agents execute via tool API only
- **Ephemeral workspaces** — sessions clean up after themselves
- **USDC settlements** — no custom tokens

### DO NOT:
- ❌ Add governance, DAOs, or token voting
- ❌ Build a cloud provider (we orchestrate, not compute)
- ❌ Store secrets on provider machines
- ❌ Give agents raw shell access

---

## Commands

```bash
# Development
pnpm dev              # Start dev server (port 3000)
pnpm build            # Production build
pnpm lint             # ESLint

# Type check
pnpm tsc --noEmit

# Initialize demo data (server must be running)
curl -X POST http://localhost:3000/api/init
```

---

## Documentation Index

| Doc | Location | Description |
|-----|----------|-------------|
| Spec | `SPEC.md` | Complete system specification |
| API | `README.md` | Endpoint documentation |
| Types | `src/types/index.ts` | Core type definitions |

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── health/         # Health check
│   │   ├── init/           # Demo data seeding
│   │   ├── providers/      # Provider registry CRUD
│   │   ├── sessions/       # Session management + execute
│   │   ├── metering/       # Usage tracking
│   │   └── payments/       # Settlement & payouts
│   ├── marketplace/        # Provider listing UI
│   ├── sessions/           # Session dashboard UI
│   ├── earnings/           # Earnings & settlements UI
│   ├── layout.tsx          # Root layout with nav
│   └── page.tsx            # Landing page
├── components/             # Reusable components (empty, ready for use)
├── lib/
│   └── db/                 # In-memory database (MVP)
└── types/                  # TypeScript interfaces
```

---

## Known Issues

⚠️ **In-memory DB** — Data resets on server restart. Need real DB for production.

⚠️ **Mock execution** — `/api/sessions/:id/execute` simulates tool runs. Provider Node not implemented yet.

⚠️ **No auth** — All endpoints are public. Need wallet-based auth for production.

---

## Last Commit Log

| Date | Branch | Commit | Description | Status |
|------|--------|--------|-------------|--------|
| 2026-02-08 | main | 07dc4c6 | Payment rails integration (Yellow, Circle, LI.FI) | ✅ Merged |
| 2026-02-08 | main | 1c38d38 | CLAUDE.md project context | ✅ Merged |
| 2026-02-08 | main | 4dabcef | Initial architecture + MVP scaffold | ✅ Merged |

---

## Team

| Agent | Role | Focus |
|-------|------|-------|
| kukulcán | PM + Backend | APIs, coordinator, payment rails |
| pantera | Strategy + Frontend | UI, provider node, security |

---

## Next Up

### Phase 2: Frontend Polish (pantera)
- [ ] Improve marketplace UI with real interactivity
- [ ] Session detail page (`/sessions/[id]`)
- [ ] Start session flow (select provider → set budget → create session)
- [ ] Execute tool UI in session console

### Phase 3: Provider Node (pantera)
- [ ] Provider Node spec & API design
- [ ] Tool registration system
- [ ] Execution sandbox design

### Phase 4: Payment Rails (kukulcán) ✅ COMPLETED
- [x] Yellow SDK integration (session ledger) - MVP in-memory
- [x] Arc/Circle integration (USDC payouts) - test keys configured
- [x] LI.FI integration (pay-with-anything, reinvestment)
- [x] New endpoints: /api/payments/quote, /api/payments/reinvest

### Phase 5: Production
- [ ] Real database (PostgreSQL/Convex)
- [ ] Wallet authentication
- [ ] Deployment (Vercel)

---

*Updated: 2026-02-08 by kukulcán*
