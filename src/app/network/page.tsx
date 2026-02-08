'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Points, PointMaterial, OrbitControls, Float } from '@react-three/drei';
import { DEMO_PROVIDERS, DEMO_SESSIONS, CATEGORY_INFO } from '@/lib/demo-data';
import { ConnectButton } from '@rainbow-me/rainbowkit';

type ProviderStatus = 'online' | 'busy' | 'offline';

type NetworkProvider = {
  id: string;
  name: string;
  status: ProviderStatus;
  pricePerMinute: number;
  category?: string;
};

type NetworkSession = {
  id: string;
  providerId: string;
  status: 'active' | 'completed';
  effectiveTimeMs: number;
  consumed: number;
};

function statusColor(status: ProviderStatus) {
  if (status === 'online') return '#00F5FF';
  if (status === 'busy') return '#FFB800';
  return '#334155';
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// Cosmic particle field
function CosmicField() {
  const count = 2500;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = randomBetween(8, 25);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00F5FF"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Central hub (Agent Core)
function AgentCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    if (glowRef.current) {
      const scale = 1.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#00F5FF" transparent opacity={0.1} />
      </mesh>
      {/* Core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00F5FF"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Inner core */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#00F5FF" />
      </mesh>
    </group>
  );
}

// Provider node with pulsing effect
function ProviderNode({ position, color, size = 0.5, active }: { position: THREE.Vector3; color: string; size?: number; active?: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.scale.setScalar(size * (1 + Math.sin(t * 2 + position.x) * 0.1));
    
    if (ringRef.current && active) {
      ringRef.current.rotation.z = t * 2;
      const ringScale = 1 + Math.sin(t * 3) * 0.3;
      ringRef.current.scale.setScalar(ringScale);
    }
  });

  return (
    <group position={position}>
      {active && (
        <mesh ref={ringRef}>
          <ringGeometry args={[0.8, 1.0, 32]} />
          <meshBasicMaterial color="#00F5FF" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}
      <mesh ref={ref}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.8 : 0.4}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

// Data pulse traveling along connection
function DataPulse({ from, to, speed = 0.5, delay = 0 }: { from: THREE.Vector3; to: THREE.Vector3; speed?: number; delay?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = ((state.clock.elapsedTime - delay) * speed) % 1;
    if (t < 0) return;
    ref.current.position.lerpVectors(from, to, t);
    ref.current.scale.setScalar(0.15 * (1 - Math.abs(t - 0.5) * 0.5));
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshBasicMaterial color="#00F5FF" transparent opacity={0.9} />
    </mesh>
  );
}

// Connection line with optional data flow
function Connection({ from, to, active }: { from: THREE.Vector3; to: THREE.Vector3; active: boolean }) {
  const points = useMemo(() => [from, to], [from, to]);

  return (
    <group>
      <Line
        points={points}
        color={active ? '#00F5FF' : '#1E3A5F'}
        lineWidth={active ? 2 : 1}
        transparent
        opacity={active ? 0.7 : 0.2}
      />
      {active && (
        <>
          <DataPulse from={from} to={to} speed={0.6} delay={0} />
          <DataPulse from={to} to={from} speed={0.4} delay={0.5} />
        </>
      )}
    </group>
  );
}

function NetworkScene({ providers, sessions }: { providers: NetworkProvider[]; sessions: NetworkSession[] }) {
  const center = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  const providerPositions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    const n = providers.length;
    providers.forEach((p, i) => {
      const a = (i / Math.max(1, n)) * Math.PI * 2;
      const r = 10 + Math.sin(i * 0.5) * 2;
      const y = Math.sin(a * 2) * 3;
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
    <Canvas camera={{ position: [0, 8, 22], fov: 55 }} gl={{ alpha: true, antialias: true }}>
      <color attach="background" args={['#0A1128']} />
      <fog attach="fog" args={['#0A1128', 20, 50]} />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[15, 15, 15]} intensity={1} color="#00F5FF" />
      <pointLight position={[-15, -10, -15]} intensity={0.5} color="#ffffff" />
      <spotLight position={[0, 20, 0]} intensity={0.8} angle={0.5} penumbra={1} color="#00F5FF" />

      <CosmicField />
      
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <AgentCore />
      </Float>

      {/* Connections */}
      {providers.map((p) => {
        const pos = providerPositions.get(p.id) ?? new THREE.Vector3(0, 0, 0);
        const active = activeProviderIds.has(p.id);
        return <Connection key={`c-${p.id}`} from={center} to={pos} active={active} />;
      })}

      {/* Provider nodes */}
      {providers.map((p) => {
        const pos = providerPositions.get(p.id) ?? new THREE.Vector3(0, 0, 0);
        const active = activeProviderIds.has(p.id);
        return (
          <ProviderNode
            key={`n-${p.id}`}
            position={pos}
            color={statusColor(p.status)}
            size={active ? 0.6 : 0.45}
            active={active}
          />
        );
      })}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxDistance={35}
        minDistance={12}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}

export default function NetworkPage() {
  const providers = (DEMO_PROVIDERS as any[]).map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status as ProviderStatus,
    pricePerMinute: p.pricePerMinute,
    category: p.category,
  }));

  const baseSessions = (DEMO_SESSIONS as any[]).map((s) => ({
    id: s.id,
    providerId: s.providerId,
    status: s.status as 'active' | 'completed',
    effectiveTimeMs: s.effectiveTimeMs,
    consumed: s.consumed,
  }));

  const [sessions, setSessions] = useState<NetworkSession[]>(baseSessions);

  // Simulate network activity
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions((prev) => {
        const next = prev.map((x) => ({ ...x }));
        
        // Random toggle
        const activeIdxs = next.map((x, i) => (x.status === 'active' ? i : -1)).filter(i => i >= 0);
        if (activeIdxs.length > 0 && Math.random() > 0.5) {
          const idx = activeIdxs[Math.floor(Math.random() * activeIdxs.length)];
          next[idx].status = 'completed';
        }

        const providerIds = providers.map(p => p.id);
        const randomProvider = providerIds[Math.floor(Math.random() * providerIds.length)];

        const existing = next.find((s) => s.providerId === randomProvider);
        if (existing) {
          existing.status = 'active';
        } else {
          next.push({
            id: `ses-${Date.now()}`,
            providerId: randomProvider,
            status: 'active',
            effectiveTimeMs: 0,
            consumed: 0,
          });
        }

        return next.slice(-10);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [providers]);

  const activeCount = sessions.filter((s) => s.status === 'active').length;
  const online = providers.filter(p => p.status === 'online').length;
  const busy = providers.filter(p => p.status === 'busy').length;

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

      {/* Hero Section */}
      <div className="relative pt-20">
        {/* 3D Scene - Full Width */}
        <div className="h-[70vh] relative">
          <NetworkScene providers={providers} sessions={sessions} />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                The <span className="text-[#00F5FF]">Network</span>
              </h1>
              <p className="text-[#A2AAAD]">Live compute topology • Drag to explore</p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-[#0A1128]/90 backdrop-blur-md border-y border-[#00F5FF]/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00F5FF]">{providers.length}</div>
                <div className="text-xs text-[#A2AAAD] uppercase tracking-wider mt-1">Providers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{online}</div>
                <div className="text-xs text-[#A2AAAD] uppercase tracking-wider mt-1">Online</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{busy}</div>
                <div className="text-xs text-[#A2AAAD] uppercase tracking-wider mt-1">Busy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00F5FF]">{activeCount}</div>
                <div className="text-xs text-[#A2AAAD] uppercase tracking-wider mt-1">Active Sessions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Feed */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Activity Feed */}
            <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#A2AAAD]/10 flex items-center justify-between">
                <h2 className="font-semibold text-white">Live Activity</h2>
                <span className="flex items-center gap-2 text-xs text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Streaming
                </span>
              </div>
              <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                {sessions.slice().reverse().map((s) => {
                  const p = providers.find((x) => x.id === s.providerId);
                  const catInfo = p?.category ? CATEGORY_INFO[p.category as keyof typeof CATEGORY_INFO] : null;
                  return (
                    <div key={s.id} className="flex items-center justify-between p-3 bg-[#0A1128]/40 rounded-lg">
                      <div className="flex items-center gap-3">
                        {catInfo && <span>{catInfo.icon}</span>}
                        <div>
                          <div className="text-sm text-white">{p?.name ?? s.providerId}</div>
                          <div className="text-xs text-[#A2AAAD]/60 font-mono">{s.id.slice(0, 12)}...</div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        s.status === 'active' 
                          ? 'bg-[#00F5FF]/20 text-[#00F5FF]' 
                          : 'bg-[#A2AAAD]/20 text-[#A2AAAD]'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend & Info */}
            <div className="space-y-6">
              <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 p-6">
                <h2 className="font-semibold text-white mb-4">Understanding the Network</h2>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-white mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">Agent Core</div>
                      <div className="text-[#A2AAAD]">Central hub where agents request compute resources</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#00F5FF] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">Online Providers</div>
                      <div className="text-[#A2AAAD]">Hardware ready to accept execution requests</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">Busy Providers</div>
                      <div className="text-[#A2AAAD]">Currently processing tasks</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#00F5FF] mt-1.5 flex-shrink-0 animate-pulse" />
                    <div>
                      <div className="text-white font-medium">Data Pulses</div>
                      <div className="text-[#A2AAAD]">Real-time execution traffic between agents and providers</div>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/marketplace">
                <div className="bg-gradient-to-r from-[#00F5FF]/10 to-purple-500/10 rounded-xl border border-[#00F5FF]/20 p-6 hover:border-[#00F5FF]/40 transition-all cursor-pointer">
                  <h3 className="font-semibold text-white mb-2">Join the Network</h3>
                  <p className="text-sm text-[#A2AAAD] mb-4">
                    Browse available compute or register your hardware to start earning.
                  </p>
                  <span className="text-[#00F5FF] text-sm font-medium">
                    Explore Marketplace →
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
