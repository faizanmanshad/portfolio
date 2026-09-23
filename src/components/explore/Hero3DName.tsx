import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import outlines from '../../assets/hero/name-outlines.json';

// Baked, kerned Pacifico outlines: no font fetch or parser at runtime.
function makeWord(commands: typeof outlines[number]['commands']) {
  const path = new THREE.ShapePath();
  for (const c of commands) {
    if (c.type === 'M') path.moveTo(c.x!, -c.y!);
    if (c.type === 'L') path.lineTo(c.x!, -c.y!);
    if (c.type === 'C') path.bezierCurveTo(c.x1!, -c.y1!, c.x2!, -c.y2!, c.x!, -c.y!);
    if (c.type === 'Q') path.quadraticCurveTo(c.x1!, -c.y1!, c.x!, -c.y!);
    if (c.type === 'Z') path.currentPath?.closePath();
  }
  const geometry = new THREE.ExtrudeGeometry(path.toShapes(false), {
    depth: 0.025, bevelEnabled: true, bevelSize: 0.07, bevelOffset: -0.045,
    bevelThickness: 0.11, bevelSegments: 8, steps: 1, curveSegments: 16,
  });
  geometry.center(); geometry.computeBoundingBox();
  return geometry;
}

function Name({ reduced, ready }: { reduced: boolean; ready: () => void }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, invalidate } = useThree();
  const progress = useRef(0);
  const target = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const geometries = useMemo(() => outlines.map(word => makeWord(word.commands)), []);
  const width = Math.max(...geometries.map(g => g.boundingBox!.max.x - g.boundingBox!.min.x));
  const fit = Math.min(viewport.width * 0.85 / width, viewport.height * 0.78 / 2.15);

  useEffect(() => {
    ready();
    const hero = document.querySelector('.section-hero');
    const scroll = () => {
      const rect = hero?.getBoundingClientRect();
      target.current = rect ? THREE.MathUtils.clamp(-rect.top / rect.height, 0, 1) : 0;
      invalidate();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      pointer.current = { x: event.clientX / innerWidth - 0.5, y: event.clientY / innerHeight - 0.5 };
      invalidate();
    };
    scroll();
    if (!reduced) {
      window.addEventListener('scroll', scroll, { passive: true });
      window.addEventListener('pointermove', move, { passive: true });
    }
    return () => {
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('pointermove', move);
    };
  }, [reduced, ready, invalidate]);
  useEffect(() => () => geometries.forEach(g => g.dispose()), [geometries]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const g = group.current;
    const dt = Math.min(delta, 0.05);
    progress.current = THREE.MathUtils.damp(progress.current, reduced ? 0 : target.current, 7, dt);
    const p = progress.current;
    // One reversible movement: a small turn and a measured retreat.
    const ry = -0.07 + p * 0.30 + (reduced ? 0 : pointer.current.x * 0.09 * (1 - p));
    const rx = -0.035 + p * 0.08 + (reduced ? 0 : pointer.current.y * 0.045 * (1 - p));
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ry, 6, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, rx, 6, dt);
    g.rotation.z = 0.025 - p * 0.035;
    g.position.set(p * viewport.width * 0.04, -p * 0.18, -p * 2.6);
    g.scale.setScalar(fit * (1 - p * 0.10));
    if ((!reduced && Math.abs(p - target.current) > 0.0001) || Math.abs(g.rotation.y - ry) > 0.0001 || Math.abs(g.rotation.x - rx) > 0.0001) invalidate();
  });

  return <>
    <ambientLight intensity={0.45} />
    <directionalLight position={[2, 4, 6]} intensity={2.2} color="#fff4e2" />
    <Environment resolution={128}>
      <Lightformer position={[-3, 3, 4]} scale={[1, 7, 1]} intensity={4} color="#ffffff" />
      <Lightformer position={[4, 1, 2]} scale={[2, 6, 1]} intensity={2} color="#e8d6ba" />
      <Lightformer position={[0, -4, 3]} scale={[6, 1, 1]} intensity={0.7} color="#E85C1A" />
    </Environment>
    <group ref={group} scale={fit}>
      {geometries.map((geometry, i) => <mesh key={i} geometry={geometry} position={[i === 0 ? -0.23 : 0.12, i === 0 ? 0.57 : -0.52, 0]}>
        <meshPhysicalMaterial color="#C8BEAF" metalness={0.32} roughness={0.23} clearcoat={1} clearcoatRoughness={0.16} envMapIntensity={1.15} />
      </mesh>)}
    </group>
  </>;
}

class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { document.querySelector('.section-hero')?.classList.remove('name-ready'); }
  render() { return this.state.failed ? null : this.props.children; }
}
const showName = () => document.querySelector('.section-hero')?.classList.add('name-ready');

export default function Hero3DName() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update(); query.addEventListener('change', update);
    return () => { query.removeEventListener('change', update); document.querySelector('.section-hero')?.classList.remove('name-ready'); };
  }, []);
  return <div id="hero-3d-name" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
    <CanvasBoundary>
      <Canvas camera={{ position: [0, 0, 7], fov: 36 }} dpr={[1, 1.5]} frameloop="demand" gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => gl.domElement.addEventListener('webglcontextlost', () => document.querySelector('.section-hero')?.classList.remove('name-ready'))}>
        <Suspense fallback={null}><Name reduced={reduced} ready={showName} /></Suspense>
      </Canvas>
    </CanvasBoundary>
  </div>;
}
