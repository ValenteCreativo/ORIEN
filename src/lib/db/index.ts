// ORIEN Mock Database
// For MVP: in-memory storage. Replace with real DB later.

import { Provider, Session, Agent, Execution } from '@/types';

// ============ IN-MEMORY STORES ============

const providers: Map<string, Provider> = new Map();
const sessions: Map<string, Session> = new Map();
const agents: Map<string, Agent> = new Map();
const executions: Map<string, Execution> = new Map();

// ============ PROVIDER OPERATIONS ============

export const providerDb = {
  create: (provider: Provider): Provider => {
    providers.set(provider.id, provider);
    return provider;
  },

  get: (id: string): Provider | undefined => {
    return providers.get(id);
  },

  list: (): Provider[] => {
    return Array.from(providers.values());
  },

  listAvailable: (): Provider[] => {
    return Array.from(providers.values()).filter(p => p.status === 'online');
  },

  update: (id: string, updates: Partial<Provider>): Provider | undefined => {
    const provider = providers.get(id);
    if (!provider) return undefined;
    const updated = { ...provider, ...updates };
    providers.set(id, updated);
    return updated;
  },

  delete: (id: string): boolean => {
    return providers.delete(id);
  },
};

// ============ SESSION OPERATIONS ============

export const sessionDb = {
  create: (session: Session): Session => {
    sessions.set(session.id, session);
    return session;
  },

  get: (id: string): Session | undefined => {
    return sessions.get(id);
  },

  list: (): Session[] => {
    return Array.from(sessions.values());
  },

  listByAgent: (agentId: string): Session[] => {
    return Array.from(sessions.values()).filter(s => s.agentId === agentId);
  },

  listByProvider: (providerId: string): Session[] => {
    return Array.from(sessions.values()).filter(s => s.providerId === providerId);
  },

  update: (id: string, updates: Partial<Session>): Session | undefined => {
    const session = sessions.get(id);
    if (!session) return undefined;
    const updated = { ...session, ...updates };
    sessions.set(id, updated);
    return updated;
  },
};

// ============ AGENT OPERATIONS ============

export const agentDb = {
  create: (agent: Agent): Agent => {
    agents.set(agent.id, agent);
    return agent;
  },

  get: (id: string): Agent | undefined => {
    return agents.get(id);
  },

  getByWallet: (walletAddress: string): Agent | undefined => {
    return Array.from(agents.values()).find(a => a.walletAddress === walletAddress);
  },

  list: (): Agent[] => {
    return Array.from(agents.values());
  },
};

// ============ EXECUTION OPERATIONS ============

export const executionDb = {
  create: (execution: Execution): Execution => {
    executions.set(execution.id, execution);
    return execution;
  },

  get: (id: string): Execution | undefined => {
    return executions.get(id);
  },

  listBySession: (sessionId: string): Execution[] => {
    return Array.from(executions.values()).filter(e => e.sessionId === sessionId);
  },

  update: (id: string, updates: Partial<Execution>): Execution | undefined => {
    const execution = executions.get(id);
    if (!execution) return undefined;
    const updated = { ...execution, ...updates };
    executions.set(id, updated);
    return updated;
  },
};

// ============ SEED DATA (for demo) ============

export function seedDemoData() {
  // Demo provider with design tools
  const demoProvider: Provider = {
    id: 'provider-demo-1',
    name: 'Design Mac Studio',
    walletAddress: '0x1234...demo',
    status: 'online',
    pricePerMinute: 50, // $0.50 per minute
    tools: [
      {
        id: 'tool-figma-export',
        name: 'figma_export',
        description: 'Export Figma designs to various formats',
        command: 'figma-cli export',
        args: [
          { name: 'file_url', type: 'string', required: true, description: 'Figma file URL' },
          { name: 'format', type: 'string', required: true, description: 'Export format (png, svg, pdf)' },
        ],
        timeLimit: 120,
      },
      {
        id: 'tool-blender-render',
        name: 'blender_render',
        description: 'Render 3D scenes with Blender',
        command: 'blender -b',
        args: [
          { name: 'scene_file', type: 'string', required: true, description: 'Path to .blend file' },
          { name: 'output', type: 'string', required: true, description: 'Output path' },
        ],
        timeLimit: 600,
      },
    ],
    reputation: {
      uptime: 99.5,
      completedSessions: 47,
      disputes: 0,
    },
    createdAt: new Date(),
  };

  providerDb.create(demoProvider);

  // Demo agent
  const demoAgent: Agent = {
    id: 'agent-demo-1',
    name: 'Demo Agent',
    walletAddress: '0xabcd...agent',
    createdAt: new Date(),
  };

  agentDb.create(demoAgent);
}
