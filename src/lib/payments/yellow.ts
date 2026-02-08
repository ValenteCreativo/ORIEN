// Yellow Network Integration
// State channels for instant micropayments during sessions
// 
// NOTE: This is a simplified MVP implementation.
// Full integration requires wallet signing and WebSocket management.
// See: https://docs.yellow.org/docs/build/quick-start/

// ClearNode endpoints
const CLEARNODE_SANDBOX = 'wss://clearnet-sandbox.yellow.com/ws';
const CLEARNODE_PRODUCTION = 'wss://clearnet.yellow.com/ws';

export interface YellowSession {
  sessionId: string;
  agentAddress: string;
  providerAddress: string;
  initialBalance: bigint;
  currentBalance: bigint;
  status: 'pending' | 'active' | 'closed';
  createdAt: Date;
}

export interface YellowPayment {
  id: string;
  sessionId: string;
  amount: bigint;
  sender: string;
  recipient: string;
  timestamp: Date;
}

// In-memory session tracking for MVP
const yellowSessions: Map<string, YellowSession> = new Map();
const yellowPayments: Map<string, YellowPayment[]> = new Map();

/**
 * Get ClearNode endpoint URL
 */
export function getClearNodeEndpoint(sandbox = true): string {
  return sandbox ? CLEARNODE_SANDBOX : CLEARNODE_PRODUCTION;
}

/**
 * Create a Yellow session for micropayments
 * MVP: In-memory tracking. Production: WebSocket + nitrolite SDK
 */
export function createYellowSession(
  agentAddress: string,
  providerAddress: string,
  budgetAllowance: bigint
): YellowSession {
  const sessionId = `yellow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  
  const session: YellowSession = {
    sessionId,
    agentAddress,
    providerAddress,
    initialBalance: budgetAllowance,
    currentBalance: budgetAllowance,
    status: 'active',
    createdAt: new Date(),
  };

  yellowSessions.set(sessionId, session);
  yellowPayments.set(sessionId, []);

  console.log(`✅ Yellow session created: ${sessionId}`);
  return session;
}

/**
 * Record a micropayment for tool execution
 */
export function recordMicropayment(
  sessionId: string,
  amount: bigint
): YellowPayment | null {
  const session = yellowSessions.get(sessionId);
  if (!session || session.status !== 'active') {
    console.error(`❌ Invalid session: ${sessionId}`);
    return null;
  }

  if (session.currentBalance < amount) {
    console.error(`❌ Insufficient balance in session ${sessionId}`);
    return null;
  }

  const payment: YellowPayment = {
    id: `payment-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    sessionId,
    amount,
    sender: session.agentAddress,
    recipient: session.providerAddress,
    timestamp: new Date(),
  };

  // Update balance
  session.currentBalance -= amount;
  yellowSessions.set(sessionId, session);

  // Record payment
  const payments = yellowPayments.get(sessionId) || [];
  payments.push(payment);
  yellowPayments.set(sessionId, payments);

  console.log(`💸 Micropayment recorded: ${formatUSDC(amount)} (remaining: ${formatUSDC(session.currentBalance)})`);
  return payment;
}

/**
 * Close session and prepare for settlement
 */
export function closeYellowSession(sessionId: string): {
  session: YellowSession;
  payments: YellowPayment[];
  totalConsumed: bigint;
} | null {
  const session = yellowSessions.get(sessionId);
  if (!session) {
    return null;
  }

  session.status = 'closed';
  yellowSessions.set(sessionId, session);

  const payments = yellowPayments.get(sessionId) || [];
  const totalConsumed = session.initialBalance - session.currentBalance;

  console.log(`✅ Yellow session closed: ${sessionId}, consumed: ${formatUSDC(totalConsumed)}`);

  return {
    session,
    payments,
    totalConsumed,
  };
}

/**
 * Get session status
 */
export function getYellowSession(sessionId: string): YellowSession | null {
  return yellowSessions.get(sessionId) || null;
}

/**
 * Get session payments
 */
export function getSessionPayments(sessionId: string): YellowPayment[] {
  return yellowPayments.get(sessionId) || [];
}

/**
 * Format USDC from 6-decimal format to human readable
 */
function formatUSDC(amount: bigint): string {
  const dollars = Number(amount) / 1_000_000;
  return `$${dollars.toFixed(6)}`;
}

/**
 * Check if Yellow integration is available
 * MVP: always true (in-memory). Production: check WebSocket connection.
 */
export function isYellowAvailable(): boolean {
  return true;
}

// Export types
export type { YellowSession as YellowSessionType };
