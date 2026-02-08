// Provider Node Types

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  command: string;
  args: ToolArgDefinition[];
  maxDurationSeconds: number;
  resourceLimits?: ResourceLimits;
}

export interface ToolArgDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'file';
  required: boolean;
  description: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    allowedValues?: string[];
  };
}

export interface ResourceLimits {
  maxCpu?: number; // percentage (0-100)
  maxMemory?: number; // MB
  maxDiskWrite?: number; // MB
}

export interface ExecutionRequest {
  sessionId: string;
  toolId: string;
  args: Record<string, unknown>;
}

export interface ExecutionResponse {
  executionId: string;
  status: ExecutionStatus;
  startedAt: string;
  completedAt?: string;
  effectiveDurationMs?: number;
  output?: string;
  error?: string;
  exitCode?: number;
}

export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'timeout';

export interface ProviderConfig {
  providerId: string;
  name: string;
  coordinatorUrl: string;
  apiKey: string;
  port: number;
  workspaceRoot: string;
  tools: ToolDefinition[];
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  uptime: number;
  activeExecutions: number;
  totalExecutions: number;
  version: string;
}
