'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThreeBackground } from '@/components/ui/ThreeBackground';
import { DEMO_PROVIDERS, CATEGORY_INFO } from '@/lib/demo-data';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Types
type NetworkProvider = {
  id: string;
  name: string;
  status: 'online' | 'busy' | 'offline';
  category?: string;
};

type NetworkSession = {
  id: string;
  providerId: string;
  agentId: string;
  status: 'active' | 'completed';
  toolName: string;
  mission: string;
};

// Demo missions
const DEMO_MISSIONS = [
  { tool: 'Blender 4.2', mission: 'Rendering 4K product visualization' },
  { tool: 'PyTorch A100', mission: 'Fine-tuning LLaMA-7B on custom dataset' },
  { tool: 'FFmpeg GPU', mission: 'Transcoding 8K HDR footage' },
  { tool: 'Adobe CC', mission: 'Batch processing 500 product images' },
  { tool: 'CUDA Compute', mission: 'Training Stable Diffusion XL' },
  { tool: 'Logic Pro X', mission: 'AI-assisted audio mastering' },
  { tool: 'Docker Build', mission: 'Building multi-arch containers' },
  { tool: 'Houdini FX', mission: 'Simulating ocean dynamics' },
];

// Simple SVG Network Graph
function NetworkGraph({ 
  providers, 
  sessions, 
  animate 
}: { 
  providers: NetworkProvider[]; 
  sessions: NetworkSession[];
  animate: boolean;
}) {
  const activeProviderIds = useMemo(() => {
    const s = new Set<string>();
    sessions.filter(x => x.status === 'active').forEach(x => s.add(x.providerId));
    return s;
  }, [sessions]);

  // Position nodes in a circle around center
  const nodePositions = useMemo(() => {
    const positions: { id: string; x: number; y: number; status: string }[] = [];
    const n = providers.length;
    const radius = 140;
    const cx = 200;
    const cy = 200;

    providers.forEach((p, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      positions.push({
        id: p.id,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        status: p.status,
      });
    });

    return positions;
  }, [providers]);

  return (
    <svg 
      viewBox="0 0 400 400" 
      className="w-full h-full max-w-[500px] max-h-[500px]"
    >
      <defs>
        {/* Gradient for active connections */}
        <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#00F5FF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00F5FF" stopOpacity="0.1" />
        </linearGradient>
        
        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Pulse animation */}
        <style>
          {`
            @keyframes pulse-ring {
              0% { transform: scale(1); opacity: 0.6; }
              100% { transform: scale(2); opacity: 0; }
            }
            @keyframes data-flow {
              0% { stroke-dashoffset: 20; }
              100% { stroke-dashoffset: 0; }
            }
            .pulse-ring { 
              transform-origin: center;
              animation: ${animate ? 'pulse-ring 2s ease-out infinite' : 'none'};
            }
            .data-flow {
              stroke-dasharray: 4 16;
              animation: ${animate ? 'data-flow 1s linear infinite' : 'none'};
            }
          `}
        </style>
      </defs>

      {/* Connections from center to each node */}
      {nodePositions.map((node) => {
        const isActive = activeProviderIds.has(node.id);
        return (
          <g key={`conn-${node.id}`}>
            {/* Base connection line */}
            <line
              x1={200}
              y1={200}
              x2={node.x}
              y2={node.y}
              stroke={isActive ? '#00F5FF' : '#1E3A5F'}
              strokeWidth={isActive ? 1.5 : 0.5}
              opacity={isActive ? 0.4 : 0.2}
            />
            {/* Data flow animation for active connections */}
            {isActive && animate && (
              <line
                x1={200}
                y1={200}
                x2={node.x}
                y2={node.y}
                stroke="#00F5FF"
                strokeWidth={2}
                className="data-flow"
                opacity={0.8}
              />
            )}
          </g>
        );
      })}

      {/* Inter-node connections (mesh topology) */}
      {nodePositions.map((node, i) => {
        // Connect to 2 nearest neighbors
        const next1 = nodePositions[(i + 1) % nodePositions.length];
        const next2 = nodePositions[(i + 2) % nodePositions.length];
        return (
          <g key={`mesh-${node.id}`}>
            <line
              x1={node.x}
              y1={node.y}
              x2={next1.x}
              y2={next1.y}
              stroke="#1E3A5F"
              strokeWidth={0.5}
              opacity={0.3}
            />
            <line
              x1={node.x}
              y1={node.y}
              x2={next2.x}
              y2={next2.y}
              stroke="#1E3A5F"
              strokeWidth={0.3}
              opacity={0.15}
            />
          </g>
        );
      })}

      {/* Center node (Agent Core) */}
      <g filter="url(#glow)">
        {/* Outer ring pulse */}
        {animate && (
          <circle
            cx={200}
            cy={200}
            r={20}
            fill="none"
            stroke="#00F5FF"
            strokeWidth={1}
            className="pulse-ring"
          />
        )}
        {/* Core hexagon */}
        <polygon
          points="200,180 217,190 217,210 200,220 183,210 183,190"
          fill="#0A1128"
          stroke="#00F5FF"
          strokeWidth={2}
        />
        {/* Inner dot */}
        <circle cx={200} cy={200} r={4} fill="#00F5FF" />
      </g>

      {/* Provider nodes */}
      {nodePositions.map((node, i) => {
        const isActive = activeProviderIds.has(node.id);
        const color = node.status === 'online' ? '#00F5FF' : node.status === 'busy' ? '#FFB800' : '#334155';
        
        return (
          <g key={`node-${node.id}`} filter={isActive ? 'url(#glow)' : undefined}>
            {/* Pulse ring for active */}
            {isActive && animate && (
              <circle
                cx={node.x}
                cy={node.y}
                r={12}
                fill="none"
                stroke={color}
                strokeWidth={1}
                className="pulse-ring"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            )}
            {/* Node diamond shape */}
            <polygon
              points={`${node.x},${node.y - 10} ${node.x + 8},${node.y} ${node.x},${node.y + 10} ${node.x - 8},${node.y}`}
              fill="#0A1128"
              stroke={color}
              strokeWidth={isActive ? 2 : 1}
            />
            {/* Center dot */}
            <circle
              cx={node.x}
              cy={node.y}
              r={isActive ? 3 : 2}
              fill={color}
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function NetworkPage() {
  const [demoActive, setDemoActive] = useState(true);

  const providers: NetworkProvider[] = (DEMO_PROVIDERS as any[]).map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status,
    category: p.category,
  }));

  const [sessions, setSessions] = useState<NetworkSession[]>(() => {
    return [
      {
        id: 'ses_init_1',
        providerId: providers[0]?.id || '',
        agentId: 'agent_7k2m',
        status: 'active' as const,
        toolName: DEMO_MISSIONS[0].tool,
        mission: DEMO_MISSIONS[0].mission,
      },
      {
        id: 'ses_init_2',
        providerId: providers[2]?.id || '',
        agentId: 'agent_9x4p',
        status: 'active' as const,
        toolName: DEMO_MISSIONS[1].tool,
        mission: DEMO_MISSIONS[1].mission,
      },
    ];
  });

  // Smoother simulation
  const updateSessions = useCallback(() => {
    if (!demoActive) return;

    setSessions((prev) => {
      const next = [...prev];
      
      // Complete one (20% chance)
      const activeIdxs = next.map((x, i) => (x.status === 'active' ? i : -1)).filter(i => i >= 0);
      if (activeIdxs.length > 1 && Math.random() > 0.8) {
        const idx = activeIdxs[Math.floor(Math.random() * activeIdxs.length)];
        next[idx] = { ...next[idx], status: 'completed' };
      }

      // Start new (40% chance)
      if (Math.random() > 0.6 && activeIdxs.length < 4) {
        const providerIds = providers.filter(p => p.status !== 'offline').map(p => p.id);
        const usedIds = new Set(next.filter(s => s.status === 'active').map(s => s.providerId));
        const available = providerIds.filter(id => !usedIds.has(id));
        
        if (available.length > 0) {
          const randomProvider = available[Math.floor(Math.random() * available.length)];
          const missionIdx = Math.floor(Math.random() * DEMO_MISSIONS.length);

          next.push({
            id: `ses_${Date.now()}`,
            providerId: randomProvider,
            agentId: `agent_${Math.random().toString(36).slice(2, 6)}`,
            status: 'active',
            toolName: DEMO_MISSIONS[missionIdx].tool,
            mission: DEMO_MISSIONS[missionIdx].mission,
          });
        }
      }

      return next.slice(-8);
    });
  }, [demoActive, providers]);

  useEffect(() => {
    if (!demoActive) return;
    const interval = setInterval(updateSessions, 4000);
    return () => clearInterval(interval);
  }, [demoActive, updateSessions]);

  const activeSessions = sessions.filter(s => s.status === 'active');
  const online = providers.filter(p => p.status === 'online').length;

  return (
    <div className="min-h-screen bg-[#0A1128] relative">
      {/* Same background as landing */}
      <ThreeBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A1128]/80 border-b border-[#00F5FF]/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="ORIEN" width={32} height={32} />
            <span className="text-lg font-semibold text-white">ORIEN</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/marketplace" className="text-[#A2AAAD] hover:text-[#00F5FF] transition-colors">Marketplace</Link>
            <Link href="/network" className="text-[#00F5FF]">Network</Link>
            <Link href="/sessions" className="text-[#A2AAAD] hover:text-[#00F5FF] transition-colors">Sessions</Link>
            <Link href="/earnings" className="text-[#A2AAAD] hover:text-[#00F5FF] transition-colors">Earnings</Link>
          </div>
          <ConnectButton.Custom>
            {({ openConnectModal, account, mounted }) => (
              <button
                onClick={openConnectModal}
                className="px-5 py-2 text-sm font-medium bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] rounded-full hover:bg-[#00F5FF]/20 transition-all"
              >
                {mounted && account ? account.displayName : 'Connect'}
              </button>
            )}
          </ConnectButton.Custom>
        </div>
      </nav>

      <div className="pt-24 px-6 pb-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Network Topology</h1>
            <p className="text-[#A2AAAD]">
              {demoActive ? 'Live network activity' : 'Paused'}
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-[1fr,380px] gap-8">
            {/* Network Visualization */}
            <div className="flex flex-col items-center">
              {/* Graph Container */}
              <div className="relative w-full max-w-[500px] aspect-square">
                <div className="absolute inset-0 bg-[#0A1128]/60 backdrop-blur-sm rounded-2xl border border-[#00F5FF]/10" />
                <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                  <NetworkGraph 
                    providers={providers} 
                    sessions={sessions} 
                    animate={demoActive} 
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex gap-12 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#00F5FF]">{providers.length}</div>
                  <div className="text-xs text-[#A2AAAD] uppercase tracking-wider">Nodes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{online}</div>
                  <div className="text-xs text-[#A2AAAD] uppercase tracking-wider">Online</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#00F5FF]">{activeSessions.length}</div>
                  <div className="text-xs text-[#A2AAAD] uppercase tracking-wider">Active</div>
                </div>
              </div>

              {/* Toggle */}
              <button
                onClick={() => setDemoActive(!demoActive)}
                className={`mt-6 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  demoActive
                    ? 'bg-[#00F5FF] text-[#0A1128] shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                    : 'bg-[#0A1128]/80 border border-[#A2AAAD]/30 text-[#A2AAAD] hover:border-[#00F5FF]/30'
                }`}
              >
                {demoActive ? '● Live' : '○ Paused'}
              </button>
            </div>

            {/* Mission Control Panel */}
            <div className="bg-[#0A1128]/80 backdrop-blur-xl border border-[#00F5FF]/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Mission Control</h2>
                {demoActive && (
                  <span className="flex items-center gap-2 text-xs text-green-400">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Streaming
                  </span>
                )}
              </div>

              {/* Active Missions */}
              <div className="mb-6">
                <div className="text-xs text-[#A2AAAD] uppercase tracking-wider mb-3">Active Missions</div>
                {activeSessions.length === 0 ? (
                  <div className="text-center py-6 text-[#A2AAAD]/50 text-sm">
                    {demoActive ? 'Initializing...' : 'Enable live mode'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeSessions.map((s) => {
                      const p = providers.find(x => x.id === s.providerId);
                      const catInfo = p?.category ? CATEGORY_INFO[p.category as keyof typeof CATEGORY_INFO] : null;
                      
                      return (
                        <div key={s.id} className="p-4 bg-[#00F5FF]/5 border border-[#00F5FF]/20 rounded-xl">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {catInfo && <span className="text-lg">{catInfo.icon}</span>}
                              <div>
                                <div className="text-sm font-medium text-white">{s.toolName}</div>
                                <div className="text-xs text-[#A2AAAD]">{p?.name}</div>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 bg-[#00F5FF]/20 text-[#00F5FF] text-[10px] rounded-full animate-pulse">
                              LIVE
                            </span>
                          </div>
                          <div className="text-xs text-[#A2AAAD]/80 mb-2">{s.mission}</div>
                          <div className="flex items-center justify-between text-[10px] text-[#A2AAAD]/50 font-mono">
                            <span>{s.agentId}</span>
                            <span>{s.id.slice(0, 10)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Completed */}
              <div className="mb-6">
                <div className="text-xs text-[#A2AAAD] uppercase tracking-wider mb-3">Completed</div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {sessions.filter(s => s.status === 'completed').slice(-3).reverse().map((s) => {
                    const p = providers.find(x => x.id === s.providerId);
                    return (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-[#0A1128]/60 border border-[#A2AAAD]/5 rounded-lg">
                        <div>
                          <div className="text-sm text-[#A2AAAD]">{s.toolName}</div>
                          <div className="text-xs text-[#A2AAAD]/50">{p?.name}</div>
                        </div>
                        <span className="text-green-400 text-xs">✓</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="pt-4 border-t border-[#A2AAAD]/10">
                <div className="text-xs text-[#A2AAAD] uppercase tracking-wider mb-3">Legend</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00F5FF] rounded-full" />
                    <span className="text-[#A2AAAD]">Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FFB800] rounded-full" />
                    <span className="text-[#A2AAAD]">Busy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#334155] rounded-full" />
                    <span className="text-[#A2AAAD]">Offline</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6">
                <Link href="/marketplace">
                  <button className="w-full py-3 text-sm font-medium bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all">
                    Explore Providers →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
