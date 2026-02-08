'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Points, PointMaterial, OrbitControls } from '@react-three/drei';
import { DEMO_PROVIDERS, DEMO_SESSIONS } from '@/lib/demo-data';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type ProviderStatus = 'online' | 'busy' | 'offline';

type NetworkProvider = {
  id: string;
  name: string;
  status: ProviderStatus;
  pricePerMinute: number;
  walletAddress: string;
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
  if (status === 'busy') return '#A2AAAD';
  return '#334155';
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function ParticleHalo() {
  const count = 1800;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // donut-ish distribution
      const r = randomBetween(6, 18);
      const theta = Math.random() * Math.PI * 2;
      const y = randomBetween(-6, 6);
      arr[i * 3 + 0] = Math.cos(theta) * r;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(theta) * r;
    }
    return arr;
  }, []);

  useFrame((state) => {
    state.scene.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00F5FF"
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function Node({ position, color, size = 0.55 }: { position: THREE.Vector3; color: string; size?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.scale.setScalar(size * (1 + Math.sin(t * 1.2 + position.x * 0.2) * 0.08));
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 18, 18]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
    </mesh>
  );
}

function Pulse({ from, to, speed = 0.6 }: { from: THREE.Vector3; to: THREE.Vector3; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const u = (t * speed) % 1;
    ref.current.position.lerpVectors(from, to, u);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.12, 12, 12]} />
      <meshBasicMaterial color="#00F5FF" transparent opacity={0.85} />
    </mesh>
  );
}

function Connection({ from, to, active }: { from: THREE.Vector3; to: THREE.Vector3; active: boolean }) {
  const points = useMemo(() => [from, to], [from, to]);

  return (
    <group>
      <Line
        points={points}
        color={active ? '#00F5FF' : '#1f2a44'}
        lineWidth={active ? 2 : 1}
        transparent
        opacity={active ? 0.55 : 0.25}
      />
      {active ? <Pulse from={from} to={to} /> : null}
    </group>
  );
}

function NetworkScene({ providers, sessions }: { providers: NetworkProvider[]; sessions: NetworkSession[] }) {
  const center = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  const providerPositions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    const n = providers.length;
    const radius = 12;
    providers.forEach((p, i) => {
      const a = (i / Math.max(1, n)) * Math.PI * 2;
      map.set(p.id, new THREE.Vector3(Math.cos(a) * radius, Math.sin(a * 1.3) * 2.2, Math.sin(a) * radius));
    });
    return map;
  }, [providers]);

  const activeProviderIds = useMemo(() => {
    const s = new Set<string>();
    sessions.filter(x => x.status === 'active').forEach(x => s.add(x.providerId));
    return s;
  }, [sessions]);

  return (
    <Canvas camera={{ position: [0, 6, 24], fov: 60 }} gl={{ alpha: true, antialias: true }}>
      <color attach="background" args={['#0A1128']} />
      <ambientLight intensity={0.35} />
      <pointLight position={[18, 20, 18]} intensity={0.9} color="#00F5FF" />
      <pointLight position={[-18, -10, -18]} intensity={0.4} color="#ffffff" />

      <ParticleHalo />

      {/* Agent hub */}
      <mesh position={center}>
        <icosahedronGeometry args={[1.0, 1]} />
        <meshStandardMaterial color="#ffffff" emissive="#00F5FF" emissiveIntensity={0.25} />
      </mesh>

      {/* Connections */}
      {providers.map((p) => {
        const pos = providerPositions.get(p.id) ?? new THREE.Vector3(0, 0, 0);
        const active = activeProviderIds.has(p.id);
        return <Connection key={`c-${p.id}`} from={center} to={pos} active={active} />;
      })}

      {/* Provider nodes */}
      {providers.map((p) => {
        const pos = providerPositions.get(p.id) ?? new THREE.Vector3(0, 0, 0);
        return <Node key={`n-${p.id}`} position={pos} color={statusColor(p.status)} size={p.status === 'busy' ? 0.65 : 0.55} />;
      })}

      <OrbitControls enablePan={false} enableZoom={true} maxDistance={40} minDistance={14} />
    </Canvas>
  );
}

export default function NetworkPage() {
  const providers = (DEMO_PROVIDERS as unknown as NetworkProvider[]).map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status,
    pricePerMinute: p.pricePerMinute,
    walletAddress: p.walletAddress,
  }));

  const baseSessions = (DEMO_SESSIONS as unknown as NetworkSession[]).map((s) => ({
    id: s.id,
    providerId: s.providerId,
    status: s.status,
    effectiveTimeMs: s.effectiveTimeMs,
    consumed: s.consumed,
  }));

  const [sessions, setSessions] = useState<NetworkSession[]>(baseSessions);

  // Simulate real-time network activity (demo-only): flip one random provider to active every few seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions((prev) => {
        const next = prev.map((x) => ({ ...x }));
        // Ensure we have at least one active session
        const activeIdxs = next.map((x, i) => (x.status === 'active' ? i : -1)).filter(i => i >= 0);
        const flipToCompleted = activeIdxs.length ? activeIdxs[Math.floor(Math.random() * activeIdxs.length)] : -1;
        if (flipToCompleted >= 0) next[flipToCompleted].status = 'completed';

        const providerIds = providers.map(p => p.id);
        const randomProvider = providerIds[Math.floor(Math.random() * providerIds.length)];

        // If there is already a session for that provider, flip it to active; else create one.
        const existing = next.find((s) => s.providerId === randomProvider);
        if (existing) {
          existing.status = 'active';
        } else {
          next.push({
            id: `session-sim-${Date.now()}`,
            providerId: randomProvider,
            status: 'active',
            effectiveTimeMs: 0,
            consumed: 0,
          });
        }

        // Trim simulated sessions to keep UI stable
        return next.slice(-8);
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [providers]);

  const activeCount = sessions.filter((s) => s.status === 'active').length;
  const totalProviders = providers.length;
  const online = providers.filter(p => p.status === 'online').length;
  const busy = providers.filter(p => p.status === 'busy').length;

  return (
    <div className="min-h-screen bg-navy text-white">
      <header className="border-b border-gray/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="ORIEN" className="w-10 h-10" />
            <div>
              <div className="text-xl font-bold leading-tight">The Network</div>
              <div className="text-xs text-gray/70">Live topology (demo simulation)</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/marketplace"><Button variant="ghost">Marketplace</Button></Link>
            <Link href="/sessions"><Button variant="ghost">Sessions</Button></Link>
            <Link href="/"><Button variant="ghost">Home</Button></Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray/20 overflow-hidden bg-navy">
            <div className="h-[520px]">
              <NetworkScene providers={providers} sessions={sessions} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-5 border-gray/20">
            <div className="text-sm text-gray/70">Status</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray/80">Providers</span>
                <span className="font-mono text-white">{totalProviders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray/80">Online</span>
                <span className="font-mono text-cyan">{online}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray/80">Busy</span>
                <span className="font-mono text-gray">{busy}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray/20">
                <span className="text-gray/80">Active sessions</span>
                <span className="font-mono text-cyan">{activeCount}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-gray/20">
            <div className="text-sm text-gray/70">Live feed (simulated)</div>
            <div className="mt-3 space-y-2">
              {sessions
                .slice()
                .reverse()
                .map((s) => {
                  const p = providers.find((x) => x.id === s.providerId);
                  return (
                    <div key={s.id} className="flex items-center justify-between text-sm">
                      <div className="truncate">
                        <span className="text-white">{p?.name ?? s.providerId}</span>
                        <span className="text-gray/60"> — </span>
                        <span className={s.status === 'active' ? 'text-cyan' : 'text-gray/70'}>
                          {s.status}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-gray/60">{s.id.slice(0, 10)}…</span>
                    </div>
                  );
                })}
            </div>
          </Card>

          <Card className="p-5 border-gray/20">
            <div className="text-sm text-gray/70">Legend</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan inline-block" /> Online</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray inline-block" /> Busy</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-600 inline-block" /> Offline</div>
              <div className="pt-2 text-xs text-gray/60">Pulses represent agent execution traffic.</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
