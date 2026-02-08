'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Points, PointMaterial, OrbitControls, Text } from '@react-three/drei';
import { DEMO_PROVIDERS, DEMO_SESSIONS, CATEGORY_INFO } from '@/lib/demo-data';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Types
type NetworkProvider = {
  id: string;
  name: string;
  status: 'online' | 'busy' | 'offline';
  category?: string;
  hardware?: string;
};

type NetworkSession = {
  id: string;
  providerId: string;
  agentId: string;
  status: 'active' | 'completed';
  toolName: string;
  mission: string;
};

// Demo missions for visual impact
const DEMO_MISSIONS = [
  { tool: 'Blender 4.2', mission: 'Rendering 4K product shots' },
  { tool: 'PyTorch A100', mission: 'Fine-tuning LLaMA-7B' },
  { tool: 'FFmpeg GPU', mission: 'Transcoding 8K footage' },
  { tool: 'Adobe CC', mission: 'Batch processing 500 images' },
  { tool: 'CUDA Compute', mission: 'Training diffusion model' },
  { tool: 'Logic Pro X', mission: 'Mastering album tracks' },
  { tool: 'Docker Build', mission: 'Multi-arch container build' },
  { tool: 'Houdini FX', mission: 'Fluid simulation render' },
];

// Minimalist grid floor
function GridFloor({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.GridHelper>(null);
  
  useFrame((state) => {
    if (ref.current && animate) {
      ref.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
    }
  });

  return (
    <gridHelper
      ref={ref}
      args={[60, 60, '#0A2540', '#0A2540']}
      position={[0, -8, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

// Floating particles - more sparse and elegant
function AmbientParticles({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const count = animate ? 800 : 400;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 50;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current && animate) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00F5FF"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={animate ? 0.5 : 0.2}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Central Agent Hub - minimalist geometric
function AgentHub({ animate }: { animate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current && animate) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
    if (innerRef.current) {
      const scale = animate ? 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1 : 1;
      innerRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00F5FF" transparent opacity={0.6} />
      </mesh>
      {/* Inner core */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00F5FF"
          emissiveIntensity={animate ? 0.5 : 0.2}
          wireframe
        />
      </mesh>
      {/* Center point */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#00F5FF" />
      </mesh>
    </group>
  );
}

// Provider Node - clean geometric
function ProviderNode({ 
  position, 
  status, 
  active,
  animate 
}: { 
  position: THREE.Vector3; 
  status: string;
  active: boolean;
  animate: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const color = status === 'online' ? '#00F5FF' : status === 'busy' ? '#FFB800' : '#334155';

  useFrame((state) => {
    if (!ref.current) return;
    if (animate && active) {
      ref.current.rotation.y = state.clock.elapsedTime;
      ref.current.rotation.x = state.clock.elapsedTime * 0.5;
    }
    if (ringRef.current && active && animate) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 2;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      ringRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      {/* Activity ring */}
      {active && animate && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.65, 32]} />
          <meshBasicMaterial color="#00F5FF" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Node */}
      <mesh ref={ref}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.6 : 0.2}
        />
      </mesh>
    </group>
  );
}

// Data stream - flowing particles along connection
function DataStream({ from, to, animate }: { from: THREE.Vector3; to: THREE.Vector3; animate: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const ref2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!animate) return;
    
    if (ref.current) {
      const t = (state.clock.elapsedTime * 0.8) % 1;
      ref.current.position.lerpVectors(from, to, t);
    }
    if (ref2.current) {
      const t = ((state.clock.elapsedTime * 0.8) + 0.5) % 1;
      ref2.current.position.lerpVectors(from, to, t);
    }
  });

  if (!animate) return null;

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#00F5FF" transparent opacity={0.9} />
      </mesh>
      <mesh ref={ref2}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#00F5FF" transparent opacity={0.6} />
      </mesh>
    </>
  );
}

// Connection line
function Connection({ from, to, active, animate }: { from: THREE.Vector3; to: THREE.Vector3; active: boolean; animate: boolean }) {
  const points = useMemo(() => [from, to], [from, to]);

  return (
    <group>
      <Line
        points={points}
        color={active && animate ? '#00F5FF' : '#1E3A5F'}
        lineWidth={active ? 1.5 : 0.5}
        transparent
        opacity={active ? 0.6 : 0.15}
      />
      {active && <DataStream from={from} to={to} animate={animate} />}
    </group>
  );
}

// Main 3D Scene
function NetworkScene({ providers, sessions, animate }: { 
  providers: NetworkProvider[]; 
  sessions: NetworkSession[];
  animate: boolean;
}) {
  const center = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  const providerPositions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    const n = providers.length;
    providers.forEach((p, i) => {
      const a = (i / Math.max(1, n)) * Math.PI * 2;
      const r = 8;
      const y = Math.sin(a * 2) * 1.5;
      map.set(p.id, new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    });
    return map;
  }, [providers]);

  const activeProviderIds = useMemo(() => {
    const s = new Set<string>();
    sessions.filter(x => x.status === 'active').forEach(x => s.add(x.providerId));
    return s;
  }, [sessions]);

  return (
    <Canvas camera={{ position: [0, 5, 18], fov: 50 }} gl={{ alpha: true, antialias: true }}>
      <color attach="background" args={['#0A1128']} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#00F5FF" />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color="#ffffff" />

      <AmbientParticles animate={animate} />
      <GridFloor animate={animate} />
      <AgentHub animate={animate} />

      {/* Connections */}
      {providers.map((p) => {
        const pos = providerPositions.get(p.id) ?? new THREE.Vector3(0, 0, 0);
        const active = activeProviderIds.has(p.id);
        return <Connection key={`c-${p.id}`} from={center} to={pos} active={active} animate={animate} />;
      })}

      {/* Provider nodes */}
      {providers.map((p) => {
        const pos = providerPositions.get(p.id) ?? new THREE.Vector3(0, 0, 0);
        const active = activeProviderIds.has(p.id);
        return (
          <ProviderNode
            key={`n-${p.id}`}
            position={pos}
            status={p.status}
            active={active}
            animate={animate}
          />
        );
      })}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxDistance={30}
        minDistance={10}
        autoRotate={animate}
        autoRotateSpeed={0.3}
        enableDamping
      />
    </Canvas>
  );
}

export default function NetworkPage() {
  const [demoActive, setDemoActive] = useState(true);

  const providers: NetworkProvider[] = (DEMO_PROVIDERS as any[]).map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status,
    category: p.category,
    hardware: p.hardware,
  }));

  const [sessions, setSessions] = useState<NetworkSession[]>(() => {
    return (DEMO_SESSIONS as any[]).map((s, i) => ({
      id: s.id,
      providerId: s.providerId,
      agentId: s.agentId || `agent_${i}`,
      status: s.status,
      toolName: DEMO_MISSIONS[i % DEMO_MISSIONS.length].tool,
      mission: DEMO_MISSIONS[i % DEMO_MISSIONS.length].mission,
    }));
  });

  // Simulate network activity when demo is active
  useEffect(() => {
    if (!demoActive) return;

    const interval = setInterval(() => {
      setSessions((prev) => {
        const next = [...prev];
        
        // Randomly complete one
        const activeIdxs = next.map((x, i) => (x.status === 'active' ? i : -1)).filter(i => i >= 0);
        if (activeIdxs.length > 1 && Math.random() > 0.4) {
          const idx = activeIdxs[Math.floor(Math.random() * activeIdxs.length)];
          next[idx] = { ...next[idx], status: 'completed' };
        }

        // Start a new one
        const providerIds = providers.filter(p => p.status !== 'offline').map(p => p.id);
        const randomProvider = providerIds[Math.floor(Math.random() * providerIds.length)];
        const missionIdx = Math.floor(Math.random() * DEMO_MISSIONS.length);

        const existing = next.findIndex((s) => s.providerId === randomProvider);
        if (existing >= 0) {
          next[existing] = {
            ...next[existing],
            status: 'active',
            toolName: DEMO_MISSIONS[missionIdx].tool,
            mission: DEMO_MISSIONS[missionIdx].mission,
          };
        } else {
          next.push({
            id: `ses_${Date.now()}`,
            providerId: randomProvider,
            agentId: `agent_${Math.random().toString(36).slice(2, 6)}`,
            status: 'active',
            toolName: DEMO_MISSIONS[missionIdx].tool,
            mission: DEMO_MISSIONS[missionIdx].mission,
          });
        }

        return next.slice(-12);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [demoActive, providers]);

  const activeSessions = sessions.filter(s => s.status === 'active');
  const online = providers.filter(p => p.status === 'online').length;

  return (
    <div className="min-h-screen bg-[#0A1128]">
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

      <div className="pt-20 flex flex-col lg:flex-row min-h-screen">
        {/* 3D Visualization */}
        <div className="flex-1 relative">
          <div className="h-[60vh] lg:h-full">
            <NetworkScene providers={providers} sessions={sessions} animate={demoActive} />
          </div>
          
          {/* Overlay Title */}
          <div className="absolute top-6 left-6">
            <h1 className="text-2xl font-bold text-white mb-1">Network Topology</h1>
            <p className="text-sm text-[#A2AAAD]">
              {demoActive ? 'Live simulation • Drag to explore' : 'Static view • Enable demo to animate'}
            </p>
          </div>

          {/* Demo Toggle */}
          <div className="absolute top-6 right-6">
            <button
              onClick={() => setDemoActive(!demoActive)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                demoActive
                  ? 'bg-[#00F5FF] text-[#0A1128] shadow-[0_0_20px_rgba(0,245,255,0.5)]'
                  : 'bg-[#0A1128]/80 border border-[#A2AAAD]/30 text-[#A2AAAD]'
              }`}
            >
              {demoActive ? '● Live' : '○ Static'}
            </button>
          </div>

          {/* Stats Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-[#00F5FF]">{providers.length}</div>
                <div className="text-[10px] text-[#A2AAAD] uppercase tracking-wider">Providers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{online}</div>
                <div className="text-[10px] text-[#A2AAAD] uppercase tracking-wider">Online</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#00F5FF]">{activeSessions.length}</div>
                <div className="text-[10px] text-[#A2AAAD] uppercase tracking-wider">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Control Panel */}
        <div className="lg:w-[420px] bg-[#0A1128]/90 backdrop-blur-md border-l border-[#00F5FF]/10 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Mission Control</h2>
              {demoActive && (
                <span className="flex items-center gap-2 text-xs text-green-400">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Live
                </span>
              )}
            </div>

            {/* Active Missions */}
            <div className="space-y-3 mb-8">
              <div className="text-xs text-[#A2AAAD] uppercase tracking-wider mb-3">Active Missions</div>
              {activeSessions.length === 0 ? (
                <div className="text-center py-8 text-[#A2AAAD]/60">
                  {demoActive ? 'Waiting for activity...' : 'Enable demo to see activity'}
                </div>
              ) : (
                activeSessions.map((s) => {
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
                        <span className="px-2 py-0.5 bg-[#00F5FF]/20 text-[#00F5FF] text-[10px] rounded-full">
                          RUNNING
                        </span>
                      </div>
                      <div className="text-xs text-[#A2AAAD]/80 mb-2">{s.mission}</div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#A2AAAD]/60 font-mono">{s.agentId}</span>
                        <span className="text-[#A2AAAD]/60 font-mono">{s.id.slice(0, 12)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Recent Completed */}
            <div className="space-y-2">
              <div className="text-xs text-[#A2AAAD] uppercase tracking-wider mb-3">Recently Completed</div>
              {sessions.filter(s => s.status === 'completed').slice(-5).reverse().map((s) => {
                const p = providers.find(x => x.id === s.providerId);
                return (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-[#0A1128]/60 border border-[#A2AAAD]/10 rounded-lg">
                    <div>
                      <div className="text-sm text-[#A2AAAD]">{s.toolName}</div>
                      <div className="text-xs text-[#A2AAAD]/60">{p?.name}</div>
                    </div>
                    <span className="text-xs text-green-400">✓</span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-8 pt-6 border-t border-[#A2AAAD]/10">
              <div className="text-xs text-[#A2AAAD] uppercase tracking-wider mb-4">Legend</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#00F5FF] rounded-sm" />
                  <span className="text-[#A2AAAD]">Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#FFB800] rounded-sm" />
                  <span className="text-[#A2AAAD]">Busy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-[#A2AAAD]/30 rounded-sm" />
                  <span className="text-[#A2AAAD]">Offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white rounded-full" />
                  <span className="text-[#A2AAAD]">Agent Hub</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Link href="/marketplace">
                <button className="w-full py-3 text-sm font-medium bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all">
                  Join the Network →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
