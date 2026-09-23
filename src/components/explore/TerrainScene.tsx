/**
 * TerrainScene.tsx
 * Interactive 3D Architectural Wireframe with 3D Typography
 */

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Font configuration
// Using a standard monospace font URL for technical look, or falling back to default.
const FONT_URL = "https://fonts.gstatic.com/s/ibmplexmono/v19/-F63fjptAgt5VM-kVkqdyU8n1iIq129k.woff"; 

function ArchitecturalWireframe() {
  const groupRef = useRef<THREE.Group>(null);
  
  const { linesGeometry, material } = useMemo(() => {
    const geometries: THREE.BufferGeometry[] = [];
    
    for (let i = 0; i < 40; i++) {
      const w = Math.random() * 2 + 0.5;
      const h = Math.random() * 5 + 0.5;
      const d = Math.random() * 2 + 0.5;
      
      const boxGeo = new THREE.BoxGeometry(w, h, d);
      
      const tx = (Math.random() - 0.5) * 12;
      const ty = (Math.random() - 0.5) * 12;
      const tz = (Math.random() - 0.5) * 12;
      
      boxGeo.translate(tx, ty, tz);
      
      const edges = new THREE.EdgesGeometry(boxGeo);
      geometries.push(edges);
    }
    
    const positions: number[] = [];
    geometries.forEach(geo => {
      const posAttr = geo.getAttribute('position');
      for (let i = 0; i < posAttr.count; i++) {
        positions.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      }
    });
    
    const mergedGeo = new THREE.BufferGeometry();
    mergedGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    const mat = new THREE.LineBasicMaterial({
      color: '#8A8E95',
      transparent: true,
      opacity: 0.15, // Made slightly more subtle
      linewidth: 1
    });
    
    return { linesGeometry: mergedGeo, material: mat };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.05;
    groupRef.current.rotation.z += delta * 0.02;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={linesGeometry} material={material} />
    </group>
  );
}

// Handles initial camera fly-in and mouse parallax
function CameraRig({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRotation.current.x = (e.clientY / window.innerHeight) * 0.4 - 0.2;
      targetRotation.current.y = (e.clientX / window.innerWidth) * 0.4 - 0.2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((state, delta) => {
    if (!wrapperRef.current) return;
    
    // Smooth initial fly-in (starts from z=30, settles at z=0 relative to parent)
    const t = state.clock.elapsedTime;
    if (t < 2.5) {
      // Ease out cubic
      const progress = 1 - Math.pow(1 - (t / 2.5), 3); 
      state.camera.position.z = THREE.MathUtils.lerp(30, 16, progress);
    }

    // Parallax mouse interaction
    wrapperRef.current.rotation.y = THREE.MathUtils.lerp(
      wrapperRef.current.rotation.y,
      targetRotation.current.y,
      delta * 3
    );
    wrapperRef.current.rotation.x = THREE.MathUtils.lerp(
      wrapperRef.current.rotation.x,
      targetRotation.current.x,
      delta * 3
    );
  });

  return <group ref={wrapperRef}>{children}</group>;
}

export default function TerrainScene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <div
      id="canvas-hero"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <Canvas
        frameloop={reduced ? 'demand' : 'always'}
        camera={{ position: [0, 0, 30], fov: 45 }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={['#101214', 10, 25]} />
        <CameraRig>
           <ArchitecturalWireframe />
        </CameraRig>
      </Canvas>
    </div>
  );
}
