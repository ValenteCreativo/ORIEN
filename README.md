<div align="center">

# 🛰️ ORIEN

**Orchestration Rail for Infrastructure & Execution Networks**

*The compute marketplace where agents rent GPUs and pay only for what they use.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![USDC](https://img.shields.io/badge/Payments-USDC-2775ca?logo=circle)](https://www.circle.com/usdc)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Demo](https://orien.vercel.app) · [Documentation](./SPEC.md) · [API Reference](#-api-reference)

</div>

---

## 🎯 The Problem

Your AI agent needs an A100 GPU to render a 3D scene. You have three options:

1. **Buy hardware** → $15,000 upfront, depreciates daily
2. **Cloud providers** → Complex setup, hourly billing (pay for idle time)
3. **ORIEN** → Connect, execute, pay per second of actual compute

We chose door #3.

## 💡 What is ORIEN?

ORIEN is an **orchestration rail** that connects autonomous agents to specialized compute infrastructure. Providers list their pre-configured hardware (Mac minis with Final Cut, workstations with Blender, servers with PyTorch), and agents pay for **effective execution time only**.

```
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│   AGENT     │ ──────── │   ORIEN     │ ──────── │  PROVIDER   │
│  (Client)   │  Session │   (Rail)    │  Execute │  (Compute)  │
│             │ ◀──────▶ │             │ ◀──────▶ │             │
└─────────────┘  USDC    └─────────────┘  Tools   └─────────────┘
```

<details>
<summary><b>🔑 Key Principles</b></summary>

- **Agents are primary users** — API-first, no dashboards required
- **Effective billing** — Pay for compute, not clock time
- **USDC settlements** — No custom tokens, no complexity
- **90/7/3 split** — Provider (90%), Platform (7%), Reserve (3%)
- **Not a cloud** — We're a rail, not infrastructure

</details>

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/ValenteCreativo/ORIEN.git
cd ORIEN

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Add your DATABASE_URL (Neon PostgreSQL recommended)

# Push database schema
pnpm prisma db push

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the marketplace.

<details>
<summary><b>🔧 Environment Variables</b></summary>

```env
# Database (required)
DATABASE_URL="postgresql://..."

# Wallet Connect (optional, has fallback)
NEXT_PUBLIC_WALLETCONNECT_ID="your-project-id"

# Network mode (optional, defaults to testnet)
NEXT_PUBLIC_NETWORK_MODE="testnet"  # or "mainnet"

# Payment Rails (optional for MVP)
CIRCLE_API_KEY=""
CIRCLE_CLIENT_KEY=""
LIFI_API_KEY=""
```

</details>

---

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── health/        # Health check
│   │   ├── providers/     # Provider registry
│   │   ├── sessions/      # Session management
│   │   ├── metering/      # Usage tracking
│   │   └── payments/      # Settlements
│   ├── marketplace/       # Provider discovery
│   ├── network/           # Live network topology
│   ├── sessions/          # Active sessions
│   └── earnings/          # Provider dashboard
├── components/
│   ├── layout/            # Navigation, PageWrapper
│   ├── providers/         # Provider cards, lists
│   ├── ui/                # ThreeBackground, DemoToggle
│   └── wallet/            # RainbowKit integration
├── lib/
│   ├── db/                # Prisma client & operations
│   ├── payments/          # Yellow, Circle, LI.FI
│   └── wallet/            # Chain config, USDC addresses
└── types/                 # TypeScript definitions
```

<details>
<summary><b>📊 Database Schema</b></summary>

```prisma
model Provider {
  id             String          @id
  name           String
  walletAddress  String          @unique
  status         ProviderStatus  // ONLINE | OFFLINE | BUSY
  pricePerMinute Int
  tools          Tool[]
  sessions       Session[]
  reputation     ProviderReputation?
}

model Session {
  id              String        @id
  agentId         String
  providerId      String
  status          SessionStatus // PENDING | ACTIVE | COMPLETED | SETTLED
  budgetAllowance Int
  consumed        Int
  effectiveTimeMs Int
  executions      Execution[]
  settlement      Settlement?
}

model Execution {
  id         String          @id
  sessionId  String
  toolId     String
  args       Json
  status     ExecutionStatus
  durationMs Int?
  cost       Int?
  result     Json?
}

model Settlement {
  id             String   @id
  sessionId      String   @unique
  totalAmount    Int
  providerPayout Int      // 90%
  platformFee    Int      // 7%
  reserveAmount  Int      // 3%
  txHash         String?
}
```

</details>

<details>
<summary><b>💳 Payment Flow</b></summary>

```
1. Session Start
   └── Agent deposits USDC (or swaps via LI.FI)
   └── Yellow micropayment session created

2. During Execution
   └── Each tool call → Yellow micropayment
   └── Real-time balance tracking

3. Session End
   └── Yellow session closed
   └── Circle/Arc settlement triggered
   └── 90/7/3 payout executed

4. Reinvestment (optional)
   └── Provider routes earnings to DeFi via LI.FI
```

</details>

---

## 📡 API Reference

### Health

```http
GET /api/health
```

```json
{ "status": "healthy", "service": "orien-coordinator", "version": "0.1.0" }
```

### Providers

<details>
<summary><code>GET /api/providers</code> — List all providers</summary>

```bash
curl https://orien.vercel.app/api/providers
```

```json
{
  "success": true,
  "data": [
    {
      "id": "provider-xxx",
      "name": "Neon Canvas",
      "status": "online",
      "pricePerMinute": 50,
      "tools": [...]
    }
  ]
}
```

</details>

<details>
<summary><code>POST /api/providers</code> — Register a provider</summary>

```bash
curl -X POST https://orien.vercel.app/api/providers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My GPU Rig",
    "walletAddress": "0x...",
    "pricePerMinute": 100,
    "tools": [...]
  }'
```

</details>

### Sessions

<details>
<summary><code>POST /api/sessions</code> — Create a session</summary>

```bash
curl -X POST https://orien.vercel.app/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent-xxx",
    "providerId": "provider-xxx",
    "budgetAllowance": 1000
  }'
```

</details>

<details>
<summary><code>POST /api/sessions/:id/execute</code> — Execute a tool</summary>

```bash
curl -X POST https://orien.vercel.app/api/sessions/session-xxx/execute \
  -H "Content-Type: application/json" \
  -d '{
    "toolId": "blender-render",
    "args": { "scene": "product.blend", "quality": "4K" }
  }'
```

```json
{
  "success": true,
  "data": {
    "execution": {
      "id": "exec-xxx",
      "status": "completed",
      "durationMs": 3500,
      "cost": 6
    },
    "remainingBudget": 994,
    "effectiveTimeMs": 3500
  }
}
```

</details>

### Payments

<details>
<summary><code>POST /api/payments</code> — Settle a session</summary>

```bash
curl -X POST https://orien.vercel.app/api/payments \
  -H "Content-Type: application/json" \
  -d '{ "sessionId": "session-xxx" }'
```

```json
{
  "success": true,
  "data": {
    "id": "settlement-xxx",
    "totalAmount": 500,
    "providerPayout": 450,
    "platformFee": 35,
    "reserveAmount": 15,
    "txHash": "0x..."
  }
}
```

</details>

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Navy (Background) | `#0A1128` |
| Cyan (Accent) | `#00F5FF` |
| Gray (Secondary) | `#A2AAAD` |
| Font | System UI |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| 3D Graphics | Three.js + React Three Fiber |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 5 |
| Wallet | RainbowKit + wagmi + viem |
| Payments | Yellow SDK, Circle, LI.FI |

---

## 🗺️ Roadmap

- [x] Core API (providers, sessions, execute, settle)
- [x] Prisma + Neon PostgreSQL
- [x] Payment rails architecture (Yellow, Circle, LI.FI)
- [x] Demo mode with sample providers
- [x] Wallet connection (Sepolia testnet)
- [x] Network topology visualization
- [ ] Provider node SDK
- [ ] Real-time WebSocket metering
- [ ] On-chain settlements
- [ ] Provider reputation system
- [ ] Multi-chain support (Base, Arbitrum, Optimism)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m 'feat: add amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with 🐍 by [Frutero](https://frutero.club)**

*From México with 💙*

[![Twitter](https://img.shields.io/badge/Twitter-@fruteroclub-1DA1F2?logo=twitter&logoColor=white)](https://twitter.com/fruteroclub)
[![Discord](https://img.shields.io/badge/Discord-Join%20us-5865F2?logo=discord&logoColor=white)](https://discord.gg/frutero)

</div>
