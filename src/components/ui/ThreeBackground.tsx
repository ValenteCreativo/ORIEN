'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    
    for (let i = 0; i < 3000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.03;
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00F5FF"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function LightningBolt() {
  const lineRef = useRef<THREE.Line>(null);
  
  const { points, colors } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const cols: number[] = [];
    
    // Create lightning path with more variation
    let currentX = -40;
    let currentY = 20;
    let currentZ = 0;
    
    for (let i = 0; i < 35; i++) {
      pts.push(new THREE.Vector3(currentX, currentY, currentZ));
      
      // White to cyan gradient with higher opacity
      const t = i / 35;
      cols.push(1, 1 - t * 0.3, 1, 0.5 + t * 0.3); // RGBA - brighter
      
      currentX += Math.random() * 3 + 1.5;
      currentY += (Math.random() - 0.5) * 5;
      currentZ += (Math.random() - 0.5) * 4;
    }
    
    return { points: pts, colors: new Float32Array(cols) };
  }, []);

  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.elapsedTime;
      lineRef.current.position.x = Math.sin(time * 0.4) * 12;
      lineRef.current.position.z = Math.cos(time * 0.3) * 18;
      lineRef.current.rotation.z = Math.sin(time * 0.2) * 0.2;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color="white"
      lineWidth={2}
      transparent
      opacity={0.6}
    />
  );
}

function WaveGrid() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current && mesh.current.geometry) {
      const time = state.clock.elapsedTime;
      const positionAttribute = mesh.current.geometry.getAttribute('position');
      
      if (positionAttribute) {
        for (let i = 0; i < positionAttribute.count; i++) {
          const x = positionAttribute.getX(i);
          const y = positionAttribute.getY(i);
          const wave = Math.sin(x * 0.3 + time * 0.7) * Math.cos(y * 0.3 + time * 0.5) * 1.5;
          positionAttribute.setZ(i, wave);
        }
        
        positionAttribute.needsUpdate = true;
      }
    }
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
      <planeGeometry args={[100, 100, 40, 40]} />
      <meshStandardMaterial
        color="#00F5FF"
        wireframe
        transparent
        opacity={0.15}
        emissive="#00F5FF"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function FloatingOrb({ position, speed }: { position: [number, number, number]; speed: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      const time = state.clock.elapsedTime;
      mesh.current.position.y = position[1] + Math.sin(time * speed) * 3;
      mesh.current.rotation.x = time * 0.3;
      mesh.current.rotation.y = time * 0.5;
      
      // Pulsing glow
      if (glowRef.current) {
        const scale = 1 + Math.sin(time * 2) * 0.2;
        glowRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  return (
    <group>
      {/* Glow sphere */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial
          color="#00F5FF"
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Core sphere */}
      <mesh ref={mesh} position={position}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#00F5FF"
          transparent
          opacity={0.6}
          emissive="#00F5FF"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

function FloatingOrbs() {
  const orbs = useMemo(() => [
    { position: [15, 10, -20] as [number, number, number], speed: 0.5 },
    { position: [-20, -5, 10] as [number, number, number], speed: 0.7 },
    { position: [10, -15, -10] as [number, number, number], speed: 0.6 },
  ], []);

  return (
    <>
      {orbs.map((orb, i) => (
        <FloatingOrb key={i} position={orb.position} speed={orb.speed} />
      ))}
    </>
  );
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-navy">
      <Canvas 
        camera={{ position: [0, 0, 35], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={['#0A1128']} />
        <ambientLight intensity={0.3} />
        <pointLight position={[20, 20, 20]} intensity={0.8} color="#00F5FF" />
        <pointLight position={[-20, -20, -20]} intensity={0.5} color="#ffffff" />
        <spotLight position={[0, 40, 0]} intensity={0.5} angle={0.6} penumbra={1} color="#00F5FF" />
        
        <ParticleField />
        <WaveGrid />
        <LightningBolt />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
}
