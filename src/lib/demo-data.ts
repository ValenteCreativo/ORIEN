// Demo Data for ORIEN Demo Mode

export const DEMO_PROVIDERS = [
  {
    id: 'provider-demo-1',
    name: 'Silicon Valley Studio',
    walletAddress: '0x1234...5678',
    status: 'online' as const,
    pricePerMinute: 50, // $0.50
    tools: [
      {
        id: 'adobe-suite',
        name: 'Adobe Creative Cloud',
        description: 'Photoshop, Illustrator, After Effects',
        command: 'adobe',
        args: [],
        timeLimit: 600,
        resourceLimit: { maxCpu: 80, maxMemory: 8192 },
      },
      {
        id: 'blender-render',
        name: 'Blender 4.0',
        description: '3D modeling and rendering',
        command: 'blender',
        args: [],
        timeLimit: 1800,
        resourceLimit: { maxCpu: 100, maxMemory: 16384 },
      },
      {
        id: 'final-cut',
        name: 'Final Cut Pro',
        description: 'Video editing',
        command: 'fcp',
        args: [],
        timeLimit: 900,
        resourceLimit: { maxCpu: 90, maxMemory: 12288 },
      },
    ],
    reputation: {
      uptime: 99.8,
      completedSessions: 1247,
      disputes: 0,
    },
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'provider-demo-2',
    name: 'Tokyo AI Lab',
    walletAddress: '0xabcd...ef90',
    status: 'online' as const,
    pricePerMinute: 120, // $1.20
    tools: [
      {
        id: 'pytorch-gpu',
        name: 'PyTorch + CUDA',
        description: 'ML training on A100',
        command: 'python',
        args: [],
        timeLimit: 3600,
        resourceLimit: { maxCpu: 100, maxMemory: 81920 },
      },
      {
        id: 'tensorflow',
        name: 'TensorFlow',
        description: 'Deep learning framework',
        command: 'python',
        args: [],
        timeLimit: 3600,
        resourceLimit: { maxCpu: 100, maxMemory: 81920 },
      },
    ],
    reputation: {
      uptime: 99.2,
      completedSessions: 892,
      disputes: 1,
    },
    createdAt: new Date('2025-02-01'),
  },
  {
    id: 'provider-demo-3',
    name: 'Berlin DevOps Hub',
    walletAddress: '0x9876...5432',
    status: 'busy' as const,
    pricePerMinute: 30, // $0.30
    tools: [
      {
        id: 'docker-build',
        name: 'Docker Builder',
        description: 'Multi-arch container builds',
        command: 'docker',
        args: [],
        timeLimit: 300,
        resourceLimit: { maxCpu: 80, maxMemory: 8192 },
      },
      {
        id: 'k8s-test',
        name: 'Kubernetes Test Cluster',
        description: 'Integration testing',
        command: 'kubectl',
        args: [],
        timeLimit: 600,
        resourceLimit: { maxCpu: 60, maxMemory: 4096 },
      },
    ],
    reputation: {
      uptime: 97.5,
      completedSessions: 3421,
      disputes: 2,
    },
    createdAt: new Date('2024-11-20'),
  },
  {
    id: 'provider-demo-4',
    name: 'Austin Audio Pro',
    walletAddress: '0xfedc...ba98',
    status: 'online' as const,
    pricePerMinute: 80, // $0.80
    tools: [
      {
        id: 'logic-pro',
        name: 'Logic Pro X',
        description: 'Music production',
        command: 'logic',
        args: [],
        timeLimit: 1200,
        resourceLimit: { maxCpu: 70, maxMemory: 16384 },
      },
      {
        id: 'ableton',
        name: 'Ableton Live',
        description: 'Electronic music production',
        command: 'ableton',
        args: [],
        timeLimit: 1200,
        resourceLimit: { maxCpu: 70, maxMemory: 16384 },
      },
    ],
    reputation: {
      uptime: 98.9,
      completedSessions: 567,
      disputes: 0,
    },
    createdAt: new Date('2025-01-10'),
  },
];

export const DEMO_SESSIONS = [
  {
    id: 'session-demo-1',
    agentId: 'agent-demo',
    providerId: 'provider-demo-1',
    status: 'active' as const,
    budgetAllowance: 5000, // $50
    consumed: 1250, // $12.50
    effectiveTimeMs: 1500000, // 25 min
    executions: [
      {
        id: 'exec-1',
        sessionId: 'session-demo-1',
        toolId: 'blender-render',
        args: { scene: 'product-render.blend' },
        status: 'completed' as const,
        startedAt: new Date(Date.now() - 3600000),
        endedAt: new Date(Date.now() - 2100000),
        durationMs: 1500000,
        cost: 1250,
        result: 'Render completed successfully',
      },
    ],
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'session-demo-2',
    agentId: 'agent-demo',
    providerId: 'provider-demo-2',
    status: 'completed' as const,
    budgetAllowance: 10000, // $100
    consumed: 7200, // $72
    effectiveTimeMs: 3600000, // 60 min
    executions: [
      {
        id: 'exec-2',
        sessionId: 'session-demo-2',
        toolId: 'pytorch-gpu',
        args: { model: 'resnet50', epochs: 100 },
        status: 'completed' as const,
        startedAt: new Date(Date.now() - 7200000),
        endedAt: new Date(Date.now() - 3600000),
        durationMs: 3600000,
        cost: 7200,
        result: 'Training completed - accuracy: 94.2%',
      },
    ],
    createdAt: new Date(Date.now() - 7200000),
    endedAt: new Date(Date.now() - 3600000),
  },
];

export const DEMO_SETTLEMENTS = [
  {
    id: 'settlement-demo-1',
    sessionId: 'session-demo-2',
    totalAmount: 7200,
    providerPayout: 6480, // 90%
    platformFee: 504, // 7%
    reserveAmount: 216, // 3%
    txHash: '0x1234567890abcdef',
    settledAt: new Date(Date.now() - 3000000),
  },
  {
    id: 'settlement-demo-2',
    sessionId: 'session-old-1',
    totalAmount: 3500,
    providerPayout: 3150,
    platformFee: 245,
    reserveAmount: 105,
    txHash: '0xabcdef1234567890',
    settledAt: new Date(Date.now() - 86400000),
  },
];
