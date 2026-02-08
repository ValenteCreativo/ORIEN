'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, Points, PointMaterial, OrbitControls, Sphere, Ring } from '@react-three/drei';
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

// Smooth camera animation
function CameraController({ animate }: { animate: boolean }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 5, 18));
  
  useFrame((state) => {
    if (animate) {
      const t = state.clock.elapsedTime * 0.1;
      targetPos.current.x = Math.sin(t) * 3;
      targetPos.current.y = 5 + Math.sin(t * 0.5) * 1;
      targetPos.current.z = 18 + Math.cos(t) * 2;
    }
    camera.position.lerp(targetPos.current, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Ethereal background particles
function CosmicDust({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const count = 1500;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 15 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      sizes[i] = Math.random() * 0.5 + 0.5;
    }
    return [pos, sizes];
  }, []);

  useFrame((state) => {
    if (ref.current && animate) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00F5FF"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={animate ? 0.4 : 0.15}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Central Agent Core with orbital rings
function AgentCore({ animate }: { animate: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (coreRef.current && animate) {
      coreRef.current.rotation.x = t * 0.3;
      coreRef.current.rotation.y = t * 0.5;
    }
    
    // Orbital rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 2;
      if (animate) ring1Ref.current.rotation.z = t * 0.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 3;
      ring2Ref.current.rotation.y = Math.PI / 4;
      if (animate) ring2Ref.current.rotation.z = -t * 0.3;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.PI / 2.5;
      ring3Ref.current.rotation.y = -Math.PI / 3;
      if (animate) ring3Ref.current.rotation.z = t * 0.4;
    }
    
    // Pulsing glow
    if (glowRef.current && animate) {
      const scale = 2.5 + Math.sin(t * 2) * 0.3;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#00F5FF" transparent opacity={0.05} />
      </mesh>
      
      {/* Orbital rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.2, 0.015, 16, 100]} />
        <meshBasicMaterial color="#00F5FF" transparent opacity={animate ? 0.6 : 0.2} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.8, 0.01, 16, 80]} />
        <meshBasicMaterial color="#00F5FF" transparent opacity={animate ? 0.4 : 0.15} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[1.4, 0.008, 16, 60]} />
        <meshBasicMaterial color="#00F5FF" transparent opacity={animate ? 0.3 : 0.1} />
      </mesh>
      
      {/* Core geometry */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color="#0A1128"
          emissive="#00F5FF"
          emissiveIntensity={animate ? 0.8 : 0.3}
          wireframe
        />
      </mesh>
      
      {/* Inner sphere */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#00F5FF" />
      </mesh>
    </group>
  );
}

// Provider node with glow effect
function ProviderNode({ 
  position, 
  status, 
  active,
  animate,
  index
}: { 
  position: THREE.Vector3; 
  status: string;
  active: boolean;
  animate: boolean;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  
  const color = status === 'online' ? '#00F5FF' : status === 'busy' ? '#FFB800' : '#1E3A5F';

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current && animate) {
      // Gentle float
      groupRef.current.position.y = position.y + Math.sin(t + index) * 0.15;
    }
    
    if (meshRef.current && animate && active) {
      meshRef.current.rotation.y = t * 0.8;
      meshRef.current.rotation.x = t * 0.4;
    }
    
    // Glow pulse for active nodes
    if (glowRef.current && active) {
      const scale = animate ? 1.5 + Math.sin(t * 3 + index) * 0.3 : 1.2;
      glowRef.current.scale.setScalar(scale);
    }
    
    // Ripple effect
    if (pulseRef.current && active && animate) {
      const scale = 1 + ((t * 0.5 + index) % 1) * 2;
      const opacity = 1 - ((t * 0.5 + index) % 1);
      pulseRef.current.scale.setScalar(scale);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Ripple effect */}
      {active && animate && (
        <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.45, 32]} />
          <meshBasicMaterial color="#00F5FF" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}
      
      {/* Glow */}
      {active && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={animate ? 0.15 : 0.08} />
        </mesh>
      )}
      
      {/* Node */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? (animate ? 0.8 : 0.4) : 0.2}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

// Energy beam connection
function EnergyBeam({ from, to, active, animate }: { from: THREE.Vector3; to: THREE.Vector3; active: boolean; animate: boolean }) {
  const beamRef = useRef<THREE.Mesh>(null);
  const particleRef = useRef<THREE.Mesh>(null);
  const particle2Ref = useRef<THREE.Mesh>(null);
  
  const direction = useMemo(() => to.clone().sub(from), [from, to]);
  const length = direction.length();
  const center = from.clone().add(to).multiplyScalar(0.5);
  
  useFrame((state) => {
    if (!animate || !active) return;
    
    const t = state.clock.elapsedTime;
    
    // Flowing particles
    if (particleRef.current) {
      const progress = (t * 0.6) % 1;
      particleRef.current.position.lerpVectors(from, to, progress);
      const scale = 0.12 * (1 - Math.abs(progress - 0.5) * 0.5);
      particleRef.current.scale.setScalar(scale);
    }
    
    if (particle2Ref.current) {
      const progress = ((t * 0.6) + 0.5) % 1;
      particle2Ref.current.position.lerpVectors(from, to, progress);
      const scale = 0.08 * (1 - Math.abs(progress - 0.5) * 0.5);
      particle2Ref.current.scale.setScalar(scale);
    }
  });

  const points = useMemo(() => [from, to], [from, to]);
  const opacity = active ? (animate ? 0.5 : 0.25) : 0.08;

  return (
    <group>
      {/* Base line */}
      <Line
        points={points}
        color={active ? '#00F5FF' : '#0A2540'}
        lineWidth={active ? 1.5 : 0.5}
        transparent
        opacity={opacity}
      />
      
      {/* Glow line */}
      {active && (
        <Line
          points={points}
          color="#00F5FF"
          lineWidth={3}
          transparent
          opacity={animate ? 0.1 : 0.05}
        />
      )}
      
      {/* Flowing particles */}
      {active && animate && (
        <>
          <mesh ref={particleRef}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
          </mesh>
          <mesh ref={particle2Ref}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#00F5FF" transparent opacity={0.7} />
          </mesh>
        </>
      )}
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
      const a = (i / Math.max(1, n)) * Math.PI * 2 - Math.PI / 2;
      const r = 7 + Math.sin(i * 1.5) * 1.5;
      const y = Math.cos(a * 1.5) * 2;
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
      <fog attach="fog" args={['#0A1128', 25, 50]} />
      
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#00F5FF" />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color="#ffffff" />
      <spotLight position={[0, 15, 0]} intensity={0.4} angle={0.6} penumbra={1} color="#00F5FF" />

      <CameraController animate={animate} />
      <CosmicDust animate={animate} />
      <AgentCore animate={animate} />

      {/* Energy beams */}
      {providers.map((p) => {
        const pos = providerPositions.get(p.id) ?? new THREE.Vector3(0, 0, 0);
        const active = activeProviderIds.has(p.id);
        return <EnergyBeam key={`beam-${p.id}`} from={center} to={pos} active={active} animate={animate} />;
      })}

      {/* Provider nodes */}
      {providers.map((p, i) => {
        const pos = providerPositions.get(p.id) ?? new THREE.Vector3(0, 0, 0);
        const active = activeProviderIds.has(p.id);
        return (
          <ProviderNode
            key={`node-${p.id}`}
            position={pos}
            status={p.status}
            active={active}
            animate={animate}
            index={i}
          />
        );
      })}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxDistance={28}
        minDistance={10}
        enableDamping
        dampingFactor={0.05}
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
    return (DEMO_SESSIONS as any[]).slice(0, 3).map((s, i) => ({
      id: s.id,
      providerId: s.providerId,
      agentId: `agent_${Math.random().toString(36).slice(2, 6)}`,
      status: 'active' as const,
      toolName: DEMO_MISSIONS[i % DEMO_MISSIONS.length].tool,
      mission: DEMO_MISSIONS[i % DEMO_MISSIONS.length].mission,
    }));
  });

  // Smoother simulation with useCallback
  const updateSessions = useCallback(() => {
    if (!demoActive) return;

    setSessions((prev) => {
      const next = [...prev];
      
      // Smoothly complete one (30% chance)
      const activeIdxs = next.map((x, i) => (x.status === 'active' ? i : -1)).filter(i => i >= 0);
      if (activeIdxs.length > 2 && Math.random() > 0.7) {
        const idx = activeIdxs[Math.floor(Math.random() * activeIdxs.length)];
        next[idx] = { ...next[idx], status: 'completed' };
      }

      // Start new (60% chance)
      if (Math.random() > 0.4) {
        const providerIds = providers.filter(p => p.status !== 'offline').map(p => p.id);
        const randomProvider = providerIds[Math.floor(Math.random() * providerIds.length)];
        const missionIdx = Math.floor(Math.random() * DEMO_MISSIONS.length);

        const existingIdx = next.findIndex((s) => s.providerId === randomProvider);
        if (existingIdx >= 0 && next[existingIdx].status === 'completed') {
          next[existingIdx] = {
            ...next[existingIdx],
            id: `ses_${Date.now()}`,
            status: 'active',
            toolName: DEMO_MISSIONS[missionIdx].tool,
            mission: DEMO_MISSIONS[missionIdx].mission,
            agentId: `agent_${Math.random().toString(36).slice(2, 6)}`,
          };
        } else if (existingIdx < 0) {
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

      return next.slice(-10);
    });
  }, [demoActive, providers]);

  useEffect(() => {
    if (!demoActive) return;
    const interval = setInterval(updateSessions, 3000); // Slower, smoother updates
    return () => clearInterval(interval);
  }, [demoActive, updateSessions]);

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
          
          {/* Overlay */}
          <div className="absolute top-6 left-6">
            <h1 className="text-2xl font-bold text-white mb-1">Network</h1>
            <p className="text-sm text-[#A2AAAD]">
              {demoActive ? 'Live • Drag to explore' : 'Paused'}
            </p>
          </div>

          {/* Demo Toggle */}
          <div className="absolute top-6 right-6">
            <button
              onClick={() => setDemoActive(!demoActive)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                demoActive
                  ? 'bg-[#00F5FF] text-[#0A1128] shadow-[0_0_20px_rgba(0,245,255,0.5)]'
                  : 'bg-[#0A1128]/80 border border-[#A2AAAD]/30 text-[#A2AAAD] hover:border-[#00F5FF]/30'
              }`}
            >
              {demoActive ? '● Live' : '○ Paused'}
            </button>
          </div>

          {/* Stats */}
          <div className="absolute bottom-6 left-6 flex gap-8">
            <div>
              <div className="text-2xl font-bold text-[#00F5FF]">{providers.length}</div>
              <div className="text-[10px] text-[#A2AAAD] uppercase tracking-wider">Nodes</div>
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

        {/* Mission Control */}
        <div className="lg:w-[400px] bg-[#0A1128]/95 backdrop-blur-xl border-l border-[#00F5FF]/10 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Mission Control</h2>
              {demoActive && (
                <span className="flex items-center gap-2 text-xs text-green-400">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Streaming
                </span>
              )}
            </div>

            {/* Active */}
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
                      <div key={s.id} className="p-4 bg-[#00F5FF]/5 border border-[#00F5FF]/20 rounded-xl transition-all duration-500">
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
              <div className="space-y-2">
                {sessions.filter(s => s.status === 'completed').slice(-4).reverse().map((s) => {
                  const p = providers.find(x => x.id === s.providerId);
                  return (
                    <div key={s.id} className="flex items-center justify-between p-3 bg-[#0A1128]/60 border border-[#A2AAAD]/5 rounded-lg transition-all duration-500">
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
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00F5FF] rounded-full" />
                  <span className="text-[#A2AAAD]">Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FFB800] rounded-full" />
                  <span className="text-[#A2AAAD]">Busy</span>
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
  );
}
