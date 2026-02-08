// ORIEN Database Layer - Prisma PostgreSQL
import prisma from './prisma';
import type { Provider, Session, Agent, Execution } from '@/types';
import { Prisma } from '@prisma/client';

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
            argsSchema: t.args as unknown as Prisma.InputJsonValue,
            maxDurationSeconds: t.timeLimit,
          })),
        },
        reputation: {
          create: {
            uptime: data.reputation.uptime,
            completedSessions: data.reputation.completedSessions,
            disputes: data.reputation.disputes,
          },
        },
      },
      include: { tools: true, reputation: true },
    });
    return mapProvider(provider);
  },

  get: async (id: string): Promise<Provider | undefined> => {
    const provider = await prisma.provider.findUnique({
      where: { id },
      include: { tools: true, reputation: true },
    });
    return provider ? mapProvider(provider) : undefined;
  },

  list: async (): Promise<Provider[]> => {
    const providers = await prisma.provider.findMany({
      include: { tools: true, reputation: true },
    });
    return providers.map(mapProvider);
  },

  listAvailable: async (): Promise<Provider[]> => {
    const providers = await prisma.provider.findMany({
      where: { status: 'ONLINE' },
      include: { tools: true, reputation: true },
    });
    return providers.map(mapProvider);
  },

  update: async (id: string, updates: Partial<Provider>): Promise<Provider | undefined> => {
    try {
      const provider = await prisma.provider.update({
        where: { id },
        data: {
          ...(updates.name && { name: updates.name }),
          ...(updates.status && { status: updates.status.toUpperCase() as 'ONLINE' | 'OFFLINE' | 'BUSY' }),
          ...(updates.pricePerMinute && { pricePerMinute: updates.pricePerMinute }),
        },
        include: { tools: true, reputation: true },
      });
      return mapProvider(provider);
    } catch {
      return undefined;
    }
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
        yellowSessionId: null,
      },
      include: { executions: true },
    });
    return mapSession(session);
  },

  get: async (id: string): Promise<Session | undefined> => {
    const session = await prisma.session.findUnique({
      where: { id },
      include: { executions: true },
    });
    return session ? mapSession(session) : undefined;
  },

  list: async (): Promise<Session[]> => {
    const sessions = await prisma.session.findMany({
      include: { executions: true },
      orderBy: { createdAt: 'desc' },
    });
    return sessions.map(mapSession);
  },

  listByAgent: async (agentId: string): Promise<Session[]> => {
    const sessions = await prisma.session.findMany({
      where: { agentId },
      include: { executions: true },
    });
    return sessions.map(mapSession);
  },

  listByProvider: async (providerId: string): Promise<Session[]> => {
    const sessions = await prisma.session.findMany({
      where: { providerId },
      include: { executions: true },
    });
    return sessions.map(mapSession);
  },

  update: async (id: string, updates: Partial<Session>): Promise<Session | undefined> => {
    try {
      const session = await prisma.session.update({
        where: { id },
        data: {
          ...(updates.status && { status: updates.status.toUpperCase() as 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'SETTLED' }),
          ...(updates.consumed !== undefined && { consumed: updates.consumed }),
          ...(updates.effectiveTimeMs !== undefined && { effectiveTimeMs: updates.effectiveTimeMs }),
          ...(updates.endedAt && { endedAt: updates.endedAt }),
          ...(updates.settledAt && { settledAt: updates.settledAt }),
        },
        include: { executions: true },
      });
      return mapSession(session);
    } catch {
      return undefined;
    }
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
    return mapAgent(agent);
  },

  get: async (id: string): Promise<Agent | undefined> => {
    const agent = await prisma.agent.findUnique({ where: { id } });
    return agent ? mapAgent(agent) : undefined;
  },

  getByWallet: async (walletAddress: string): Promise<Agent | undefined> => {
    const agent = await prisma.agent.findUnique({ where: { walletAddress } });
    return agent ? mapAgent(agent) : undefined;
  },

  list: async (): Promise<Agent[]> => {
    const agents = await prisma.agent.findMany();
    return agents.map(mapAgent);
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
        args: data.args as Prisma.InputJsonValue,
        status: data.status.toUpperCase() as 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED',
      },
    });
    return mapExecution(execution);
  },

  get: async (id: string): Promise<Execution | undefined> => {
    const execution = await prisma.execution.findUnique({ where: { id } });
    return execution ? mapExecution(execution) : undefined;
  },

  listBySession: async (sessionId: string): Promise<Execution[]> => {
    const executions = await prisma.execution.findMany({
      where: { sessionId },
      orderBy: { startedAt: 'desc' },
    });
    return executions.map(mapExecution);
  },

  update: async (id: string, updates: Partial<Execution>): Promise<Execution | undefined> => {
    try {
      const execution = await prisma.execution.update({
        where: { id },
        data: {
          ...(updates.status && { status: updates.status.toUpperCase() as 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' }),
          ...(updates.durationMs !== undefined && { durationMs: updates.durationMs }),
          ...(updates.cost !== undefined && { cost: updates.cost }),
          ...(updates.result !== undefined && { result: updates.result as Prisma.InputJsonValue }),
          ...(updates.error !== undefined && { error: updates.error }),
          ...(updates.endedAt && { endedAt: updates.endedAt }),
        },
      });
      return mapExecution(execution);
    } catch {
      return undefined;
    }
  },
};

// ============ SEED DATA ============

export async function seedDemoData() {
  // Check if already seeded
  const existingProvider = await prisma.provider.findFirst();
  if (existingProvider) {
    console.log('Demo data already exists');
    return;
  }

  // Create demo agent
  await prisma.agent.create({
    data: {
      id: 'agent-demo-1',
      name: 'Demo Agent',
      walletAddress: '0xabcd1234567890abcdef1234567890abcdef1234',
    },
  });

  // Create demo provider
  await prisma.provider.create({
    data: {
      id: 'provider-demo-1',
      name: 'Design Mac Studio',
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      status: 'ONLINE',
      pricePerMinute: 50,
      tools: {
        create: [
          {
            id: 'tool-figma-export',
            name: 'figma_export',
            description: 'Export Figma designs to various formats',
            command: 'figma-cli export',
            argsSchema: {
              file_url: { type: 'string', required: true },
              format: { type: 'string', required: true },
            },
            maxDurationSeconds: 120,
          },
          {
            id: 'tool-blender-render',
            name: 'blender_render',
            description: 'Render 3D scenes with Blender',
            command: 'blender -b',
            argsSchema: {
              scene_file: { type: 'string', required: true },
              output: { type: 'string', required: true },
            },
            maxDurationSeconds: 600,
          },
        ],
      },
      reputation: {
        create: {
          uptime: 99.5,
          completedSessions: 47,
          disputes: 0,
        },
      },
    },
  });

  console.log('✅ Demo data seeded');
}

// ============ MAPPERS ============

type PrismaProvider = Awaited<ReturnType<typeof prisma.provider.findUnique>> & {
  tools: Awaited<ReturnType<typeof prisma.tool.findMany>>;
  reputation: Awaited<ReturnType<typeof prisma.providerReputation.findUnique>> | null;
};

function mapProvider(p: NonNullable<PrismaProvider>): Provider {
  return {
    id: p.id,
    name: p.name,
    walletAddress: p.walletAddress,
    status: p.status.toLowerCase() as 'online' | 'offline' | 'busy',
    pricePerMinute: p.pricePerMinute,
    tools: p.tools.map(t => {
      const schema = t.argsSchema as Record<string, unknown>;
      const args = Object.entries(schema).map(([name, def]) => ({
        name,
        type: ((def as Record<string, unknown>)?.type as 'string' | 'number' | 'boolean') || 'string',
        required: ((def as Record<string, unknown>)?.required as boolean) || false,
        description: name,
      }));
      return {
        id: t.id,
        name: t.name,
        description: t.description,
        command: t.command,
        args,
        timeLimit: t.maxDurationSeconds,
      };
    }),
    reputation: p.reputation ? {
      uptime: p.reputation.uptime,
      completedSessions: p.reputation.completedSessions,
      disputes: p.reputation.disputes,
    } : { uptime: 100, completedSessions: 0, disputes: 0 },
    createdAt: p.createdAt,
  };
}

type PrismaSession = Awaited<ReturnType<typeof prisma.session.findUnique>> & {
  executions: Awaited<ReturnType<typeof prisma.execution.findMany>>;
};

function mapSession(s: NonNullable<PrismaSession>): Session {
  return {
    id: s.id,
    agentId: s.agentId,
    providerId: s.providerId,
    status: s.status.toLowerCase() as 'pending' | 'active' | 'completed' | 'failed' | 'settled',
    budgetAllowance: s.budgetAllowance,
    consumed: s.consumed,
    effectiveTimeMs: s.effectiveTimeMs,
    executions: s.executions.map(mapExecution),
    createdAt: s.createdAt,
    endedAt: s.endedAt || undefined,
    settledAt: s.settledAt || undefined,
  };
}

type PrismaAgent = Awaited<ReturnType<typeof prisma.agent.findUnique>>;

function mapAgent(a: NonNullable<PrismaAgent>): Agent {
  return {
    id: a.id,
    name: a.name,
    walletAddress: a.walletAddress,
    createdAt: a.createdAt,
  };
}

type PrismaExecution = Awaited<ReturnType<typeof prisma.execution.findUnique>>;

function mapExecution(e: NonNullable<PrismaExecution>): Execution {
  return {
    id: e.id,
    sessionId: e.sessionId,
    toolId: e.toolId,
    args: e.args as Record<string, unknown>,
    status: e.status.toLowerCase() as 'pending' | 'running' | 'completed' | 'failed',
    startedAt: e.startedAt,
    endedAt: e.endedAt || undefined,
    durationMs: e.durationMs || undefined,
    cost: e.cost || undefined,
    result: e.result || undefined,
    error: e.error || undefined,
  };
}

// Export prisma client for direct access
export { prisma };
