// ORIEN Core Types

// ============ ACTORS ============

export interface Agent {
  id: string;
  name: string;
  walletAddress: string;
  createdAt: Date;
}

export interface Provider {
  id: string;
  name: string;
  walletAddress: string;
  status: 'online' | 'offline' | 'busy';
  pricePerMinute: number; // in USDC cents
  tools: Tool[];
  reputation: ProviderReputation;
  createdAt: Date;
}

export interface ProviderReputation {
  uptime: number; // percentage
  completedSessions: number;
  disputes: number;
}

// ============ TOOLS ============

export interface Tool {
  id: string;
  name: string;
  description: string;
  command: string;
  args: ToolArg[];
  timeLimit: number; // seconds
  resourceLimit?: ResourceLimit;
}

export interface ToolArg {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  description: string;
}

export interface ResourceLimit {
  maxCpu?: number; // percentage
  maxMemory?: number; // MB
}

// ============ SESSIONS ============

export type SessionStatus = 'pending' | 'active' | 'completed' | 'failed' | 'settled';

export interface Session {
  id: string;
  agentId: string;
  providerId: string;
  status: SessionStatus;
  budgetAllowance: number; // USDC cents
  consumed: number; // USDC cents
  effectiveTimeMs: number; // milliseconds of actual execution
  executions: Execution[];
  createdAt: Date;
  endedAt?: Date;
  settledAt?: Date;
}

export interface Execution {
  id: string;
  sessionId: string;
  toolId: string;
  args: Record<string, unknown>;
  status: 'running' | 'completed' | 'failed';
  startedAt: Date;
  endedAt?: Date;
  durationMs?: number;
  cost?: number; // USDC cents
  result?: unknown;
  error?: string;
}

// ============ PAYMENTS ============

export interface PayoutSplit {
  provider: number; // percentage
  platform: number; // percentage
  reserve: number; // percentage
}

export interface Settlement {
  id: string;
  sessionId: string;
  totalAmount: number; // USDC cents
  providerPayout: number;
  platformFee: number;
  reserveAmount: number;
  txHash?: string;
  settledAt: Date;
}

// ============ API RESPONSES ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============ CONSTANTS ============

export const DEFAULT_PAYOUT_SPLIT: PayoutSplit = {
  provider: 90,
  platform: 7,
  reserve: 3,
};
