import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Detect WebGL support safely
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// Low-poly, high-aesthetic floating iridescent geometric mesh
const AbstractShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Smooth, gentle rotation
    meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.3;
    meshRef.current.rotation.y += hovered ? 0.015 : 0.006;
    meshRef.current.rotation.z = Math.cos(t * 0.3) * 0.2;
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.08 : 1.0}
      >
        {/* Icosahedron with detail 2 is very lightweight (< 300 polys) */}
        <icosahedronGeometry args={[1.7, 2]} />
        <meshPhysicalMaterial
          color="#6C5CE7"
          emissive="#2A1B6D"
          emissiveIntensity={0.4}
          roughness={0.15}
          metalness={0.8}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          wireframe={false}
          flatShading={false}
        />
      </mesh>
    </Float>
  );
};

// Subtle background accent ring
const AccentRing = () => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.getElapsedTime();
    ringRef.current.rotation.x = 1.2 + Math.sin(t * 0.2) * 0.1;
    ringRef.current.rotation.y = t * 0.08;
  });

  return (
    <mesh ref={ringRef} scale={1.2}>
      <torusGeometry args={[2.5, 0.03, 16, 64]} />
      <meshStandardMaterial
        color="#38BDF8"
        emissive="#0284C7"
        emissiveIntensity={0.8}
        roughness={0.2}
        metalness={0.9}
      />
    </mesh>
  );
};

// CSS Fallback when WebGL is unavailable or fails
export const FallbackOrb: React.FC = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-[#6C5CE7] via-[#4338CA] to-[#38BDF8] blur-2xl opacity-60 animate-pulse-glow" />
    <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full border-2 border-white/20 bg-gradient-to-br from-white/10 to-[#6C5CE7]/30 backdrop-blur-xl shadow-2xl flex items-center justify-center animate-float-slow">
      <div className="w-36 h-36 rounded-full border border-cyan-400/40 bg-[#0B1020]/40 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#38BDF8] shadow-glow-violet" />
      </div>
    </div>
  </div>
);

// Error boundary wrapper for WebGL canvas
class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const Hero3D: React.FC = () => {
  const [canRenderWebGL, setCanRenderWebGL] = useState(false);

  useEffect(() => {
    setCanRenderWebGL(isWebGLAvailable());
  }, []);

  return (
    <div className="relative w-full h-[400px] sm:h-[460px] lg:h-[520px] flex items-center justify-center select-none">
      {/* Background ambient glow behind 3D */}
      <div className="absolute w-72 h-72 rounded-full bg-[#6C5CE7]/25 blur-3xl pointer-events-none" />
      <div className="absolute w-60 h-60 translate-x-20 translate-y-12 rounded-full bg-[#38BDF8]/20 blur-3xl pointer-events-none" />

      {/* 3D Canvas or Fallback */}
      {canRenderWebGL ? (
        <WebGLErrorBoundary fallback={<FallbackOrb />}>
          <Suspense fallback={<FallbackOrb />}>
            <Canvas
              camera={{ position: [0, 0, 5.2], fov: 45 }}
              dpr={[1, 1.5]} // Capped at 1.5 for performance on GTX 1050
              gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
              className="w-full h-full"
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 6, 4]} intensity={1.5} color="#FFFFFF" />
              <pointLight position={[-4, -3, -2]} intensity={2.0} color="#6C5CE7" />
              <pointLight position={[3, -2, 3]} intensity={1.8} color="#38BDF8" />

              <AbstractShape />
              <AccentRing />
            </Canvas>
          </Suspense>
        </WebGLErrorBoundary>
      ) : (
        <FallbackOrb />
      )}

      {/* Floating Decorative Preview Card 1: Senior Frontend Role */}
      <div className="absolute -left-2 sm:left-4 top-10 sm:top-14 glass-panel p-3.5 sm:p-4 rounded-2xl shadow-xl max-w-[210px] sm:max-w-[240px] border border-white/60 animate-float-slow transition-all duration-300 hover:scale-105">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#38BDF8] flex items-center justify-center text-white text-xs font-bold shadow-sm">
            JE
          </div>
          <div>
            <p className="text-xs font-bold text-neutral truncate">Senior Lead Architect</p>
            <p className="text-[10px] text-neutral-secondary">Stripe • Remote</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
          <span className="font-semibold text-emerald-600">$165k - $195k</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-[#6C5CE7]">
            Active
          </span>
        </div>
      </div>

      {/* Floating Decorative Preview Card 2: Match rate */}
      <div
        className="absolute -right-2 sm:right-6 bottom-16 sm:bottom-20 glass-panel p-3.5 sm:p-4 rounded-2xl shadow-xl max-w-[190px] sm:max-w-[220px] border border-white/60 transition-all duration-300 hover:scale-105"
        style={{ animation: 'float-slow 6s ease-in-out infinite 2s' }}
      >
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
            ✓
          </div>
          <div>
            <p className="text-xs font-bold text-neutral">Candidate Match</p>
            <p className="text-[10px] text-neutral-secondary">98% Skill Alignment</p>
          </div>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
          <div className="bg-gradient-to-r from-[#6C5CE7] to-[#38BDF8] h-full rounded-full w-[98%]" />
        </div>
      </div>

      {/* Floating Decorative Badge 3: Top Companies */}
      <div
        className="absolute left-10 sm:left-16 bottom-8 glass-panel px-3.5 py-2 rounded-full shadow-lg border border-white/60 flex items-center gap-2"
        style={{ animation: 'float-slow 6s ease-in-out infinite 3.5s' }}
      >
        <div className="flex -space-x-1.5">
          <div className="w-5 h-5 rounded-full bg-indigo-500 border-2 border-white text-[9px] text-white flex items-center justify-center font-bold">L</div>
          <div className="w-5 h-5 rounded-full bg-cyan-500 border-2 border-white text-[9px] text-white flex items-center justify-center font-bold">F</div>
          <div className="w-5 h-5 rounded-full bg-violet-500 border-2 border-white text-[9px] text-white flex items-center justify-center font-bold">V</div>
        </div>
        <span className="text-[11px] font-semibold text-neutral">500+ Verified Hiring</span>
      </div>
    </div>
  );
};
