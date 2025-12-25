import { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
}

const ParticleSystem = ({
  count = 300,
  magnetRadius = 3,
  ringRadius = 8,
  waveSpeed = 0.5,
  waveAmplitude = 0.8,
  particleSize = 0.05,
  lerpSpeed = 0.05,
  color = '#FF9FFC',
  autoAnimate = true
}: ParticleSystemProps) => {
  const meshRef = useRef<THREE.Points>(null);
  const { size, mouse } = useThree();
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    const initialPos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = ringRadius + (Math.random() - 0.5) * 2;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 10;
      const z = Math.sin(angle) * radius;
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      initialPos[i * 3] = x;
      initialPos[i * 3 + 1] = y;
      initialPos[i * 3 + 2] = z;
    }
    
    return { current: pos, initial: initialPos };
  });

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    const geometry = meshRef.current.geometry;
    const positions = geometry.attributes.position.array as Float32Array;
    const time = clock.getElapsedTime();
    
    // Mouse position in 3D space
    const mouseX = (mouse.x * size.width) / 100;
    const mouseY = (mouse.y * size.height) / 100;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Original position
      const originalX = positions[i3];
      const originalY = positions[i3 + 1];
      const originalZ = positions[i3 + 2];
      
      // Wave motion
      let targetX = originalX;
      let targetY = originalY;
      let targetZ = originalZ;
      
      if (autoAnimate) {
        targetX += Math.sin(time * waveSpeed + i * 0.1) * waveAmplitude;
        targetY += Math.cos(time * waveSpeed * 0.7 + i * 0.15) * waveAmplitude * 0.5;
        targetZ += Math.sin(time * waveSpeed * 0.5 + i * 0.2) * waveAmplitude;
      }
      
      // Magnetic attraction to mouse
      const dx = mouseX - targetX;
      const dy = mouseY - targetY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < magnetRadius) {
        const force = (1 - distance / magnetRadius) * 2;
        targetX += dx * force;
        targetY += dy * force;
      }
      
      // Smooth interpolation
      positions[i3] += (targetX - positions[i3]) * lerpSpeed;
      positions[i3 + 1] += (targetY - positions[i3 + 1]) * lerpSpeed;
      positions[i3 + 2] += (targetZ - positions[i3 + 2]) * lerpSpeed;
    }
    
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleSize}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

interface AntigravityProps {
  particleCount?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  className?: string;
}

const Antigravity = ({
  particleCount = 300,
  magnetRadius = 3,
  ringRadius = 8,
  waveSpeed = 0.5,
  waveAmplitude = 0.8,
  particleSize = 0.05,
  lerpSpeed = 0.05,
  color = '#FF9FFC',
  autoAnimate = true,
  className = ''
}: AntigravityProps) => {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ParticleSystem
          count={particleCount}
          magnetRadius={magnetRadius}
          ringRadius={ringRadius}
          waveSpeed={waveSpeed}
          waveAmplitude={waveAmplitude}
          particleSize={particleSize}
          lerpSpeed={lerpSpeed}
          color={color}
          autoAnimate={autoAnimate}
        />
      </Canvas>
    </div>
  );
};

export default Antigravity;
