# ORIEN

**ORIEN — Orchestration Rail for Infrastructure & Execution Networks**  
_Tagline_: **The compute marketplace for agents**

---

## 1. Overview

ORIEN is a marketplace and orchestration rail where **autonomous agents rent specialized compute infrastructure** to execute missions.

Instead of agents (or their human operators) installing, licensing, configuring, and maintaining complex software stacks, ORIEN allows agents to **temporarily rent execution time** on pre-configured hardware nodes (e.g. Mac minis) that already contain the required tools.

Agents are the primary users.  
Humans are infrastructure providers.  
Money flows automatically based on **effective compute usage**.

ORIEN does **not** provide compute.  
ORIEN **orchestrates access, execution, and payment**.

---

## 2. Core Concept (Plain Terms)

- Providers own hardware (e.g. Mac minis, servers).
- Providers install expensive or complex software stacks (design, 3D, marketing, code, etc.).
- Providers list their machines on ORIEN with a **price per effective minute of execution**.
- Agents rent execution time on those machines to complete missions.
- Providers are paid for **actual resource usage**, not idle wall-clock time.
- Providers may withdraw earnings or reinvest them into DeFi strategies.

This turns idle specialized hardware into an **economic primitive for agents**.

---

## 3. What ORIEN Orchestrates (Explicit Scope)

ORIEN explicitly orchestrates:

1. **Agents as primary users**
   - Agents initiate sessions.
   - Agents select infrastructure.
   - Agents execute missions.
   - Agents pay for execution.

2. **Specialized infrastructure access**
   - Pre-configured machines with curated software stacks.
   - Temporary, paid access to execution capabilities.
   - No ownership transfer, no permanence.

3. **Execution sessions**
   - Every interaction happens inside a session.
   - Sessions define:
     - budget allowance
     - execution limits
     - lifecycle (start → execute → settle)

4. **Effective usage metering**
   - Billing is based on **effective execution time**, not idle presence.
   - Time counts only while compute resources are actively used.

5. **Economic settlement**
   - Session balances are settled in USDC.
   - Clear payout splits between provider and platform.

6. **Capital reinvestment**
   - Providers may reinvest earnings into DeFi strategies.
   - ORIEN executes the chosen strategy automatically.

7. **Paid access enforcement**
   - Execution endpoints are gated by economic access (not logins).
   - Access is temporary, revocable, and paid.

8. **Minimal operational identity**
   - Providers and agents have identifiable operational profiles.
   - Identity is used for trust and reputation, not social features.

---

## 4. What ORIEN Does NOT Orchestrate (Deliberate Exclusions)

ORIEN does NOT:

- Control or design agent internal logic or prompts.
- Train, evaluate, or optimize agent intelligence.
- Physically manage hardware or power.
- Provide kernel-level or hypervisor-grade security.
- Perform complex marketplace discovery or ranking.
- Govern behavior via DAOs or token governance.
- Judge mission ethics or intent.
- Replace cloud providers (AWS, GCP, etc.).
- Store long-lived secrets on rented compute.

ORIEN is a **rail**, not a cloud, not an OS, not a DAO.

---

## 5. Actors

### 5.1 Agent (Renter)
- Autonomous software entity.
- Initiates sessions.
- Executes missions.
- Pays for compute usage.
- Holds secrets locally (never on provider machines).

### 5.2 Provider (Infrastructure Owner)
- Owns and maintains hardware.
- Installs and curates software stacks.
- Sets pricing per effective execution minute.
- Receives USDC payouts.
- May reinvest earnings.

### 5.3 ORIEN Coordinator
- Backend orchestration service.
- Manages sessions, metering, payments, and settlement.
- Does not execute missions itself.

---

## 6. Architecture Overview

### High-Level Components

- **Frontend (Next.js)**
  - Marketplace UI
  - Session Console
  - Earnings & Reinvestment UI

- **ORIEN Coordinator (Backend)**
  - Provider Registry
  - Session Manager
  - Metering Engine
  - Payment & Settlement Engine
  - Reinvestment Router

- **Provider Node**
  - Lightweight agent host running on provider hardware
  - Exposes a restricted execution API
  - Executes tools inside ephemeral workspaces

- **Payment Rails**
  - Yellow: session-based micropayment ledger
  - Arc (Circle): USDC settlement and payouts
  - LI.FI: pay-with-anything → USDC conversion & reinvestment

- **Identity (Optional / Non-core)**
  - ENS for human-readable identities

---

## 7. Provider Node (Execution Host)

### Purpose
The Provider Node enables **paid, controlled execution** of agent tasks without exposing the underlying machine.

### Characteristics
- No raw shell access for agents.
- No long-lived secrets stored.
- Execution only via a **tool API**.
- Each session runs in an **ephemeral workspace**.

### Example API
- `GET /health`
- `GET /tools`
- `POST /tools/run`
- `GET /logs`

### Tool Model
- Providers expose a whitelist of tools (e.g. `run_build`, `render_scene`, `execute_script`).
- Tools have:
  - fixed commands
  - argument schemas
  - time/resource limits

Agents cannot invent commands.

---

## 8. Execution Sessions

### Session Lifecycle
1. Agent selects provider and mission.
2. ORIEN creates a session with:
   - budget allowance
   - provider rate
3. Agent executes tools.
4. ORIEN meters **effective execution time**.
5. Agent ends session or allowance is exhausted.
6. Session is settled and paid.

### Effective Usage Definition
- Time is counted **only when tools are actively executing**.
- Idle time does not incur cost.
- Execution receipts are generated per tool call.

This prevents agents from being trapped due to lack of funds.

---

## 9. Payment & Economy

### Pricing Model
- Providers set **price per effective execution minute**.
- ORIEN does not fix prices.

### Yellow Integration
- Used as a session ledger.
- Tracks usage-based debits during the session.
- Settles final balance at session end.

### Arc (Circle) Integration
- All settlements occur in USDC.
- Payout split example:
  - Provider: 90%
  - ORIEN fee: 7%
  - Reserve: 3%

### LI.FI Integration
- Agents may pay with any supported token.
- LI.FI performs swap/bridge.
- Provider always receives USDC.
- Providers may reinvest USDC earnings via LI.FI routes.

---

## 10. Security & Guardrails (MVP)

### Principles
- Minimize blast radius.
- Enforce economic limits.
- Never store secrets on rented compute.

### Guardrails
1. No agent secrets on provider machines.
2. Capability-based execution (tool API, no shell).
3. Ephemeral workspace per session (auto-deleted).
4. Time and resource caps per tool.
5. Allowance hard stop.
6. Execution receipts (hashes, timestamps, tool logs).
7. Minimal reputation metrics:
   - uptime
   - completed sessions
   - disputes (if any)

Security is **economic and operational**, not hypervisor-grade.

---

## 11. Identity & Reputation (Minimal)

- Providers and agents may use ENS names.
- ENS records may store:
  - provider metadata
  - pricing info
  - reputation URI
- Identity is functional, not social.

ENS is optional and non-blocking.

---

## 12. Provider Onboarding (Demo Scope)

For the MVP/demo:
- Provider registration is manual.
- SSH connection to a known instance is acceptable.
- Provider Node may be simulated.
- Marketplace discovery may be static.

The goal is **demonstrating the rail**, not full decentralization.

---

## 13. SDK / CLI (Conceptual)

ORIEN exposes:
- A Provider SDK / CLI to:
  - register a node
  - publish available tools
  - report execution metrics
- A Renter SDK to:
  - start sessions
  - execute tools
  - monitor cost and usage

SDK implementation is not required for MVP, but the architecture must support it.

---

## 14. Stack Expectations

- Frontend: Next.js + TypeScript
- Backend: Node.js / API routes
- Payments: Yellow SDK, Arc (USDC), LI.FI SDK
- Infrastructure: SSH-accessible provider node (demo)
- Package manager: pnpm

---

## 15. MVP Success Criteria

The MVP is successful if it demonstrates:

1. An agent renting specialized compute.
2. Execution via restricted tools.
3. Billing based on effective execution time.
4. Settlement and payout in USDC.
5. Optional reinvestment via DeFi.
6. Clear separation of responsibilities.
7. No scope creep beyond this document.

---

## 16. Instructions for Implementing Agents

- Treat this document as the **single source of truth**.
- Do not redesign the system.
- Do not add governance, tokens, or extra features.
- Implement exactly what is described.
- Prefer clarity and determinism over optimization.

ORIEN is an orchestration rail.  
Nothing more. Nothing less.
