// Demo Data for ORIEN Demo Mode

export type ProviderCategory = 'creative' | 'ai-ml' | 'devops' | 'media' | 'gaming' | 'research';

export interface DemoProvider {
  id: string;
  name: string;
  tagline: string;
  category: ProviderCategory;
  walletAddress: string;
  status: 'online' | 'offline' | 'busy';
  pricePerMinute: number;
  tools: {
    id: string;
    name: string;
    description: string;
    command: string;
    args: { name: string; type: string; required: boolean; description: string }[];
    timeLimit: number;
    resourceLimit?: { maxCpu: number; maxMemory: number };
  }[];
  reputation: {
    uptime: number;
    completedSessions: number;
    disputes: number;
  };
  hardware: string;
  location: string;
  createdAt: Date;
}

export const DEMO_PROVIDERS: DemoProvider[] = [
  // === CREATIVE ===
  {
    id: 'provider-neon-canvas',
    name: 'Neon Canvas',
    tagline: 'Where pixels become reality',
    category: 'creative',
    walletAddress: '0x1a2b...3c4d',
    status: 'online',
    pricePerMinute: 45,
    tools: [
      {
        id: 'adobe-suite',
        name: 'Adobe Creative Cloud',
        description: 'Full suite: Photoshop, Illustrator, After Effects, Premiere',
        command: 'adobe',
        args: [],
        timeLimit: 600,
        resourceLimit: { maxCpu: 80, maxMemory: 16384 },
      },
      {
        id: 'figma-export',
        name: 'Figma Renderer',
        description: 'High-res exports and prototypes',
        command: 'figma',
        args: [],
        timeLimit: 300,
        resourceLimit: { maxCpu: 60, maxMemory: 8192 },
      },
    ],
    reputation: { uptime: 99.7, completedSessions: 2847, disputes: 1 },
    hardware: 'Mac Studio M2 Ultra',
    location: 'Los Angeles, CA',
    createdAt: new Date('2025-06-15'),
  },
  {
    id: 'provider-pixel-forge',
    name: 'Pixel Forge',
    tagline: '3D rendering at lightspeed',
    category: 'creative',
    walletAddress: '0x5e6f...7g8h',
    status: 'online',
    pricePerMinute: 85,
    tools: [
      {
        id: 'blender-render',
        name: 'Blender 4.2',
        description: 'Cycles and EEVEE rendering with GPU acceleration',
        command: 'blender',
        args: [],
        timeLimit: 3600,
        resourceLimit: { maxCpu: 100, maxMemory: 32768 },
      },
      {
        id: 'cinema4d',
        name: 'Cinema 4D',
        description: 'Professional 3D motion graphics',
        command: 'c4d',
        args: [],
        timeLimit: 1800,
        resourceLimit: { maxCpu: 100, maxMemory: 32768 },
      },
      {
        id: 'houdini',
        name: 'Houdini FX',
        description: 'Procedural VFX and simulations',
        command: 'houdini',
        args: [],
        timeLimit: 3600,
        resourceLimit: { maxCpu: 100, maxMemory: 65536 },
      },
    ],
    reputation: { uptime: 99.9, completedSessions: 1523, disputes: 0 },
    hardware: 'Dual RTX 4090 + 128GB RAM',
    location: 'Vancouver, BC',
    createdAt: new Date('2025-04-20'),
  },

  // === AI/ML ===
  {
    id: 'provider-neural-nexus',
    name: 'Neural Nexus',
    tagline: 'Train faster. Deploy smarter.',
    category: 'ai-ml',
    walletAddress: '0x9i0j...1k2l',
    status: 'online',
    pricePerMinute: 150,
    tools: [
      {
        id: 'pytorch-a100',
        name: 'PyTorch + CUDA 12',
        description: 'ML training on NVIDIA A100 80GB',
        command: 'python',
        args: [],
        timeLimit: 7200,
        resourceLimit: { maxCpu: 100, maxMemory: 81920 },
      },
      {
        id: 'vllm-inference',
        name: 'vLLM Inference',
        description: 'High-throughput LLM serving',
        command: 'vllm',
        args: [],
        timeLimit: 3600,
        resourceLimit: { maxCpu: 100, maxMemory: 81920 },
      },
      {
        id: 'huggingface',
        name: 'HuggingFace Hub',
        description: 'Model downloads and fine-tuning',
        command: 'hf',
        args: [],
        timeLimit: 3600,
        resourceLimit: { maxCpu: 80, maxMemory: 32768 },
      },
    ],
    reputation: { uptime: 99.5, completedSessions: 4291, disputes: 3 },
    hardware: 'NVIDIA A100 80GB × 8',
    location: 'Singapore',
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 'provider-tensor-tribe',
    name: 'Tensor Tribe',
    tagline: 'Your models, our muscle',
    category: 'ai-ml',
    walletAddress: '0x3m4n...5o6p',
    status: 'busy',
    pricePerMinute: 95,
    tools: [
      {
        id: 'tensorflow',
        name: 'TensorFlow 2.x',
        description: 'Deep learning with TPU support',
        command: 'python',
        args: [],
        timeLimit: 7200,
        resourceLimit: { maxCpu: 100, maxMemory: 65536 },
      },
      {
        id: 'jax-tpu',
        name: 'JAX + TPU',
        description: 'XLA-accelerated ML',
        command: 'python',
        args: [],
        timeLimit: 7200,
        resourceLimit: { maxCpu: 100, maxMemory: 65536 },
      },
    ],
    reputation: { uptime: 98.8, completedSessions: 2156, disputes: 2 },
    hardware: 'Google TPU v4 Pod',
    location: 'Tokyo, Japan',
    createdAt: new Date('2025-03-05'),
  },

  // === DEVOPS ===
  {
    id: 'provider-deploy-dock',
    name: 'Deploy Dock',
    tagline: 'Ship it. Now.',
    category: 'devops',
    walletAddress: '0x7q8r...9s0t',
    status: 'online',
    pricePerMinute: 25,
    tools: [
      {
        id: 'docker-build',
        name: 'Docker Builder',
        description: 'Multi-arch container builds (amd64, arm64)',
        command: 'docker',
        args: [],
        timeLimit: 600,
        resourceLimit: { maxCpu: 90, maxMemory: 16384 },
      },
      {
        id: 'k8s-cluster',
        name: 'Kubernetes Cluster',
        description: 'Ephemeral k8s for testing and staging',
        command: 'kubectl',
        args: [],
        timeLimit: 1800,
        resourceLimit: { maxCpu: 80, maxMemory: 32768 },
      },
      {
        id: 'terraform',
        name: 'Terraform Runner',
        description: 'Infrastructure as Code execution',
        command: 'terraform',
        args: [],
        timeLimit: 900,
        resourceLimit: { maxCpu: 50, maxMemory: 8192 },
      },
    ],
    reputation: { uptime: 99.2, completedSessions: 8934, disputes: 5 },
    hardware: 'Dedicated Bare Metal',
    location: 'Frankfurt, DE',
    createdAt: new Date('2024-11-01'),
  },
  {
    id: 'provider-ci-storm',
    name: 'CI Storm',
    tagline: 'Tests that never sleep',
    category: 'devops',
    walletAddress: '0x1u2v...3w4x',
    status: 'online',
    pricePerMinute: 35,
    tools: [
      {
        id: 'github-actions',
        name: 'GitHub Actions Runner',
        description: 'Self-hosted runners with GPU access',
        command: 'gh-runner',
        args: [],
        timeLimit: 3600,
        resourceLimit: { maxCpu: 100, maxMemory: 32768 },
      },
      {
        id: 'playwright',
        name: 'Playwright Tests',
        description: 'E2E testing with browser automation',
        command: 'playwright',
        args: [],
        timeLimit: 1800,
        resourceLimit: { maxCpu: 70, maxMemory: 16384 },
      },
    ],
    reputation: { uptime: 99.6, completedSessions: 12847, disputes: 2 },
    hardware: '64-core AMD EPYC',
    location: 'Amsterdam, NL',
    createdAt: new Date('2025-02-14'),
  },

  // === MEDIA ===
  {
    id: 'provider-sound-wave',
    name: 'Sound Wave',
    tagline: 'Audio perfection, automated',
    category: 'media',
    walletAddress: '0x5y6z...7a8b',
    status: 'online',
    pricePerMinute: 60,
    tools: [
      {
        id: 'logic-pro',
        name: 'Logic Pro X',
        description: 'Professional music production',
        command: 'logic',
        args: [],
        timeLimit: 1800,
        resourceLimit: { maxCpu: 80, maxMemory: 32768 },
      },
      {
        id: 'ableton',
        name: 'Ableton Live 12',
        description: 'Electronic music and live performance',
        command: 'ableton',
        args: [],
        timeLimit: 1800,
        resourceLimit: { maxCpu: 80, maxMemory: 32768 },
      },
      {
        id: 'izotope',
        name: 'iZotope Suite',
        description: 'Mastering, restoration, and mixing',
        command: 'izotope',
        args: [],
        timeLimit: 900,
        resourceLimit: { maxCpu: 60, maxMemory: 16384 },
      },
    ],
    reputation: { uptime: 99.4, completedSessions: 1876, disputes: 0 },
    hardware: 'Mac Pro M2 Ultra + Pro Tools HDX',
    location: 'Nashville, TN',
    createdAt: new Date('2025-05-01'),
  },
  {
    id: 'provider-frame-flow',
    name: 'Frame Flow',
    tagline: 'Video at scale',
    category: 'media',
    walletAddress: '0x9c0d...1e2f',
    status: 'online',
    pricePerMinute: 70,
    tools: [
      {
        id: 'davinci',
        name: 'DaVinci Resolve',
        description: 'Color grading and editing',
        command: 'davinci',
        args: [],
        timeLimit: 3600,
        resourceLimit: { maxCpu: 100, maxMemory: 65536 },
      },
      {
        id: 'ffmpeg-gpu',
        name: 'FFmpeg GPU',
        description: 'Hardware-accelerated transcoding',
        command: 'ffmpeg',
        args: [],
        timeLimit: 1800,
        resourceLimit: { maxCpu: 90, maxMemory: 32768 },
      },
    ],
    reputation: { uptime: 98.9, completedSessions: 3421, disputes: 1 },
    hardware: 'RTX 4090 × 4 + NVMe RAID',
    location: 'London, UK',
    createdAt: new Date('2025-03-22'),
  },

  // === RESEARCH ===
  {
    id: 'provider-quantum-lab',
    name: 'Quantum Lab',
    tagline: 'Compute beyond classical',
    category: 'research',
    walletAddress: '0x3g4h...5i6j',
    status: 'online',
    pricePerMinute: 200,
    tools: [
      {
        id: 'qiskit',
        name: 'Qiskit Runtime',
        description: 'Quantum circuit simulation and execution',
        command: 'qiskit',
        args: [],
        timeLimit: 7200,
        resourceLimit: { maxCpu: 100, maxMemory: 131072 },
      },
      {
        id: 'molecular-sim',
        name: 'GROMACS',
        description: 'Molecular dynamics simulation',
        command: 'gromacs',
        args: [],
        timeLimit: 7200,
        resourceLimit: { maxCpu: 100, maxMemory: 131072 },
      },
    ],
    reputation: { uptime: 99.1, completedSessions: 892, disputes: 0 },
    hardware: 'HPC Cluster (1024 cores)',
    location: 'Zurich, CH',
    createdAt: new Date('2025-01-28'),
  },
];

export const CATEGORY_INFO: Record<ProviderCategory, { label: string; icon: string; color: string }> = {
  'creative': { label: 'Creative', icon: '🎨', color: 'from-pink-500 to-purple-500' },
  'ai-ml': { label: 'AI/ML', icon: '🧠', color: 'from-blue-500 to-cyan-500' },
  'devops': { label: 'DevOps', icon: '🚀', color: 'from-orange-500 to-yellow-500' },
  'media': { label: 'Media', icon: '🎬', color: 'from-green-500 to-emerald-500' },
  'gaming': { label: 'Gaming', icon: '🎮', color: 'from-red-500 to-pink-500' },
  'research': { label: 'Research', icon: '🔬', color: 'from-violet-500 to-indigo-500' },
};

export const DEMO_SESSIONS = [
  {
    id: 'session-demo-1',
    agentId: 'agent-demo',
    providerId: 'provider-pixel-forge',
    status: 'active' as const,
    budgetAllowance: 5000,
    consumed: 1275,
    effectiveTimeMs: 900000, // 15 min
    executions: [
      {
        id: 'exec-1',
        sessionId: 'session-demo-1',
        toolId: 'blender-render',
        args: { scene: 'product-hero.blend', samples: 2048 },
        status: 'completed' as const,
        startedAt: new Date(Date.now() - 1200000),
        endedAt: new Date(Date.now() - 300000),
        durationMs: 900000,
        cost: 1275,
        result: 'Render completed: 4K output saved',
      },
    ],
    createdAt: new Date(Date.now() - 1200000),
  },
  {
    id: 'session-demo-2',
    agentId: 'agent-demo',
    providerId: 'provider-neural-nexus',
    status: 'completed' as const,
    budgetAllowance: 15000,
    consumed: 9000,
    effectiveTimeMs: 3600000, // 60 min
    executions: [
      {
        id: 'exec-2',
        sessionId: 'session-demo-2',
        toolId: 'pytorch-a100',
        args: { model: 'llama-7b-finetune', dataset: 'custom-instruct' },
        status: 'completed' as const,
        startedAt: new Date(Date.now() - 7200000),
        endedAt: new Date(Date.now() - 3600000),
        durationMs: 3600000,
        cost: 9000,
        result: 'Fine-tuning complete. Loss: 0.0023',
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
    totalAmount: 9000,
    providerPayout: 8100,
    platformFee: 630,
    reserveAmount: 270,
    txHash: '0x7a8b9c0d1e2f3g4h5i6j7k8l9m0n',
    settledAt: new Date(Date.now() - 3500000),
  },
  {
    id: 'settlement-demo-2',
    sessionId: 'session-old-1',
    totalAmount: 4250,
    providerPayout: 3825,
    platformFee: 297,
    reserveAmount: 128,
    txHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n',
    settledAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'settlement-demo-3',
    sessionId: 'session-old-2',
    totalAmount: 12750,
    providerPayout: 11475,
    platformFee: 893,
    reserveAmount: 382,
    txHash: '0x5o6p7q8r9s0t1u2v3w4x5y6z7a8b',
    settledAt: new Date(Date.now() - 172800000),
  },
];
