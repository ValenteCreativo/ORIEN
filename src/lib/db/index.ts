// ORIEN Database Layer - Prisma PostgreSQL
import prisma from './prisma';
import type { Provider, Session, Agent, Execution } from '@/types';

// ============ PROVIDER OPERATIONS ============

export const providerDb = {
  create: async (data: Omit<Provider, 'createdAt'>): Promise<Provider> => {
    const provider = await prisma.provider.create({
      data: {
        id: data.id,
        name: data.name,
        walletAddress: data.walletAddress,
        status: data.status.toUpperCase() as 'ONLINE' | 'OFFLINE' | 'BUSY',
        pricePerMinute: data.pricePerMinute,
        tools: {
          create: data.tools.map(t => ({
            id: t.id,
            name: t.name,
            description: t.description,
            command: t.command,
            argsSchema: t.args as any,
            timeLimit: t.timeLimit,
            resourceLimit: t.resourceLimit as any,
          })),
        },
        reputation: {
          create: data.reputation,
        },
      },
      include: {
        tools: true,
        reputation: true,
      },
    });

    return mapProvider(provider);
  },

  get: async (id: string): Promise<Provider | undefined> => {
    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        tools: true,
        reputation: true,
      },
    });

    return provider ? mapProvider(provider) : undefined;
  },

  list: async (): Promise<Provider[]> => {
    const providers = await prisma.provider.findMany({
      include: {
        tools: true,
        reputation: true,
      },
    });

    return providers.map(mapProvider);
  },

  listAvailable: async (): Promise<Provider[]> => {
    const providers = await prisma.provider.findMany({
      where: { status: 'ONLINE' },
      include: {
        tools: true,
        reputation: true,
      },
    });

    return providers.map(mapProvider);
  },

  update: async (id: string, updates: Partial<Provider>): Promise<Provider | undefined> => {
    const provider = await prisma.provider.update({
      where: { id },
      data: {
        ...(updates.name && { name: updates.name }),
        ...(updates.status && { status: updates.status.toUpperCase() as 'ONLINE' | 'OFFLINE' | 'BUSY' }),
        ...(updates.pricePerMinute !== undefined && { pricePerMinute: updates.pricePerMinute }),
      },
      include: {
        tools: true,
        reputation: true,
      },
    });

    return mapProvider(provider);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.provider.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};

// ============ SESSION OPERATIONS ============

export const sessionDb = {
  create: async (data: Omit<Session, 'createdAt' | 'executions'>): Promise<Session> => {
    const session = await prisma.session.create({
      data: {
        id: data.id,
        agentId: data.agentId,
        providerId: data.providerId,
        status: data.status.toUpperCase() as 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'SETTLED',
        budgetAllowance: data.budgetAllowance,
        consumed: data.consumed,
        effectiveTimeMs: data.effectiveTimeMs,
        ...(data.endedAt && { endedAt: data.endedAt }),
        ...(data.settledAt && { settledAt: data.settledAt }),
      },
      include: {
        executions: true,
      },
    });

    return mapSession(session);
  },

  get: async (id: string): Promise<Session | undefined> => {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        executions: true,
      },
    });

    return session ? mapSession(session) : undefined;
  },

  list: async (): Promise<Session[]> => {
    const sessions = await prisma.session.findMany({
      include: {
        executions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.map(mapSession);
  },

  listByAgent: async (agentId: string): Promise<Session[]> => {
    const sessions = await prisma.session.findMany({
      where: { agentId },
      include: {
        executions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.map(mapSession);
  },

  listByProvider: async (providerId: string): Promise<Session[]> => {
    const sessions = await prisma.session.findMany({
      where: { providerId },
      include: {
        executions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.map(mapSession);
  },

  update: async (id: string, updates: Partial<Session>): Promise<Session | undefined> => {
    const session = await prisma.session.update({
      where: { id },
      data: {
        ...(updates.status && { status: updates.status.toUpperCase() as 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'SETTLED' }),
        ...(updates.consumed !== undefined && { consumed: updates.consumed }),
        ...(updates.effectiveTimeMs !== undefined && { effectiveTimeMs: updates.effectiveTimeMs }),
        ...(updates.endedAt && { endedAt: updates.endedAt }),
        ...(updates.settledAt && { settledAt: updates.settledAt }),
      },
      include: {
        executions: true,
      },
    });

    return mapSession(session);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.session.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};

// ============ EXECUTION OPERATIONS ============

export const executionDb = {
  create: async (data: Omit<Execution, 'startedAt'>): Promise<Execution> => {
    const execution = await prisma.execution.create({
      data: {
        id: data.id,
        sessionId: data.sessionId,
        toolId: data.toolId,
        args: data.args as any,
        status: data.status.toUpperCase() as 'RUNNING' | 'COMPLETED' | 'FAILED',
        ...(data.endedAt && { endedAt: data.endedAt }),
        ...(data.durationMs !== undefined && { durationMs: data.durationMs }),
        ...(data.cost !== undefined && { cost: data.cost }),
        ...(data.result !== undefined && { result: data.result as any }),
        ...(data.error && { error: data.error }),
      },
    });

    return mapExecution(execution);
  },

  get: async (id: string): Promise<Execution | undefined> => {
    const execution = await prisma.execution.findUnique({
      where: { id },
    });

    return execution ? mapExecution(execution) : undefined;
  },

  listBySession: async (sessionId: string): Promise<Execution[]> => {
    const executions = await prisma.execution.findMany({
      where: { sessionId },
      orderBy: { startedAt: 'asc' },
    });

    return executions.map(mapExecution);
  },

  update: async (id: string, updates: Partial<Execution>): Promise<Execution | undefined> => {
    const execution = await prisma.execution.update({
      where: { id },
      data: {
        ...(updates.status && { status: updates.status.toUpperCase() as 'RUNNING' | 'COMPLETED' | 'FAILED' }),
        ...(updates.endedAt && { endedAt: updates.endedAt }),
        ...(updates.durationMs !== undefined && { durationMs: updates.durationMs }),
        ...(updates.cost !== undefined && { cost: updates.cost }),
        ...(updates.result !== undefined && { result: updates.result as any }),
        ...(updates.error && { error: updates.error }),
      },
    });

    return mapExecution(execution);
  },
};

// ============ AGENT OPERATIONS ============

export const agentDb = {
  create: async (data: Omit<Agent, 'createdAt'>): Promise<Agent> => {
    const agent = await prisma.agent.create({
      data: {
        id: data.id,
        name: data.name,
        walletAddress: data.walletAddress,
      },
    });

    return {
      id: agent.id,
      name: agent.name,
      walletAddress: agent.walletAddress,
      createdAt: agent.createdAt,
    };
  },

  get: async (id: string): Promise<Agent | undefined> => {
    const agent = await prisma.agent.findUnique({
      where: { id },
    });

    return agent ? {
      id: agent.id,
      name: agent.name,
      walletAddress: agent.walletAddress,
      createdAt: agent.createdAt,
    } : undefined;
  },

  list: async (): Promise<Agent[]> => {
    const agents = await prisma.agent.findMany();

    return agents.map((a: any) => ({
      id: a.id,
      name: a.name,
      walletAddress: a.walletAddress,
      createdAt: a.createdAt,
    }));
  },
};

// ============ HELPER MAPPERS ============

function mapProvider(provider: any): Provider {
  return {
    id: provider.id,
    name: provider.name,
    walletAddress: provider.walletAddress,
    status: provider.status.toLowerCase() as 'online' | 'offline' | 'busy',
    pricePerMinute: provider.pricePerMinute,
    tools: provider.tools?.map((t: any) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      command: t.command,
      args: t.argsSchema || [],
      timeLimit: t.timeLimit,
      resourceLimit: t.resourceLimit,
    })) || [],
    reputation: provider.reputation || { uptime: 100, completedSessions: 0, disputes: 0 },
    createdAt: provider.createdAt,
  };
}

function mapSession(session: any): Session {
  return {
    id: session.id,
    agentId: session.agentId,
    providerId: session.providerId,
    status: session.status.toLowerCase() as 'pending' | 'active' | 'completed' | 'failed' | 'settled',
    budgetAllowance: session.budgetAllowance,
    consumed: session.consumed,
    effectiveTimeMs: session.effectiveTimeMs,
    executions: session.executions?.map(mapExecution) || [],
    createdAt: session.createdAt,
    endedAt: session.endedAt || undefined,
    settledAt: session.settledAt || undefined,
  };
}

function mapExecution(execution: any): Execution {
  return {
    id: execution.id,
    sessionId: execution.sessionId,
    toolId: execution.toolId,
    args: execution.args || {},
    status: execution.status.toLowerCase() as 'running' | 'completed' | 'failed',
    startedAt: execution.startedAt,
    endedAt: execution.endedAt || undefined,
    durationMs: execution.durationMs || undefined,
    cost: execution.cost || undefined,
    result: execution.result || undefined,
    error: execution.error || undefined,
  };
}

export default prisma;
