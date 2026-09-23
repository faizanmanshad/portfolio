/**
 * ExploreScene.tsx
 * Editorial Engineer × Spatial Blueprint × Digital Model
 *
 * Complete rebuild. No GridHelper. No fat BoxGeometry columns.
 *
 * Scene components:
 *  - ArchitecturalGrid   → fine LineSegments module grid (fading)
 *  - StructuralFragment  → 3 slender TubeGeometry members + beams + bracing
 *  - WireframeOverlay    → same structure wireframe, offset
 *  - SectionPlane        → translucent horizontal cut plane
 *  - NodePoints          → Points at structural intersections
 *  - DimensionSystem     → thin Line segments with tick marks
 *  - CoordinateOrigin    → accent-color spatial anchor cross
 *
 * Animation: 5-stage reveal over ~2s
 * Camera: eye-level architectural framing, no OrbitControls, subtle drift
 * Lighting: key directional + warm fill + ambient
 */

import React, {
  useRef,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

/* ── Constants ──────────────────────────────────────────── */
const C = {
  BG:          new THREE.Color(0x101214),
  MEMBER:      new THREE.Color(0x8A8E95),
  MEMBER_DARK: new THREE.Color(0x4A5060),
  NODE:        new THREE.Color(0xEDE8E1),
  DIM_LINE:    new THREE.Color(0x4A5060),
  PLANE:       new THREE.Color(0x2A3040),
  GRID_MAJ:    new THREE.Color(0xffffff),
  GRID_MIN:    new THREE.Color(0xffffff),
  ACCENT:      new THREE.Color(0xE85C1A),
} as const;

/* Stage timing (ms) */
const STAGES = {
  nodes:    0,
  lines:    380,
  members:  850,
  plane:    1380,
  labels:   1800,
  total:    2200,
} as const;

/* ── Hooks ───────────────────────────────────────────────── */

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function useRevealProgress(reduced: boolean): number {
  const [progress, setProgress] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) { setProgress(1); return; }
    const start = performance.now();
    let rAF: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / STAGES.total, 1);
      setProgress(p);
      if (p < 1) rAF = requestAnimationFrame(tick);
    };
    rAF = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rAF);
  }, [reduced]);

  return progress;
}

/* Easing */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

/* Map global progress 0–1 to a per-stage 0–1 value */
function stageProgress(
  globalProgress: number,
  stageStart: number,
  stageEnd: number
): number {
  const start = stageStart / STAGES.total;
  const end   = stageEnd   / STAGES.total;
  return Math.max(0, Math.min(1, (globalProgress - start) / (end - start)));
}

/* ── Architectural Grid ──────────────────────────────────── */
function ArchitecturalGrid() {
  const geometry = useMemo(() => {
    const positions: number[] = [];

    const size     = 9;    // ±4.5 units
    const majorInt = 1.5;  // major line every 1.5u
    const minorInt = 0.5;  // minor line every 0.5u

    // Helper: add a line segment
    const addLine = (x1: number, z1: number, x2: number, z2: number) => {
      positions.push(x1, 0, z1, x2, 0, z2);
    };

    for (let i = -size / 2; i <= size / 2; i += minorInt) {
      addLine(i, -size / 2, i,  size / 2);
      addLine(-size / 2, i,  size / 2, i);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  // Major and minor as separate meshes with different opacity
  const majorGeometry = useMemo(() => {
    const positions: number[] = [];
    const size     = 9;
    const majorInt = 1.5;
    for (let i = -size / 2; i <= size / 2; i += majorInt) {
      positions.push(i, 0, -size / 2, i, 0, size / 2);
      positions.push(-size / 2, 0, i, size / 2, 0, i);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  const minorGeometry = useMemo(() => {
    const positions: number[] = [];
    const size     = 9;
    const majorInt = 1.5;
    const minorInt = 0.5;
    for (let i = -size / 2; i <= size / 2 + 0.01; i += minorInt) {
      // skip major positions
      const isMajor = Math.abs(Math.round(i / majorInt) * majorInt - i) < 0.01;
      if (!isMajor) {
        positions.push(i, 0, -size / 2, i, 0, size / 2);
        positions.push(-size / 2, 0, i, size / 2, 0, i);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <group position={[0, -0.01, 0]}>
      <lineSegments geometry={majorGeometry}>
        <lineBasicMaterial color={C.GRID_MAJ} transparent opacity={0.06} depthWrite={false} />
      </lineSegments>
      <lineSegments geometry={minorGeometry}>
        <lineBasicMaterial color={C.GRID_MIN} transparent opacity={0.025} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

/* ── Structural Fragment ─────────────────────────────────── */

type MemberProps = {
  start: THREE.Vector3;
  end:   THREE.Vector3;
  radius: number;
  material: THREE.MeshStandardMaterial;
  scaleY: number;
};

function StructuralMember({ start, end, radius, material, scaleY }: MemberProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { path, length } = useMemo(() => {
    const mid = start.clone().lerp(end, 0.5);
    const curve = new THREE.LineCurve3(start, end);
    return { path: curve, length: start.distanceTo(end) };
  }, [start, end]);

  const geometry = useMemo(
    () => new THREE.TubeGeometry(path, 1, radius, 6, false),
    [path, radius]
  );

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.y = scaleY;
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

/* ── Node Points ─────────────────────────────────────────── */
function NodePoints({ opacity }: { opacity: number }) {
  // Key structural intersections
  const nodePositions = useMemo(() => {
    const pts: number[] = [];
    const xs = [-1.2, 0, 1.2];
    const ys = [0, 1.2, 2.4, 3.6, 4.5];
    xs.forEach(x => ys.forEach(y => pts.push(x, y, 0)));
    // Add offset depth layer
    xs.forEach(x => ys.slice(1, 4).forEach(y => pts.push(x, y, -0.6)));
    return new Float32Array(pts);
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    return geo;
  }, [nodePositions]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color={C.NODE}
        size={0.035}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ── Dimension System ────────────────────────────────────── */
function DimensionLines({ opacity }: { opacity: number }) {
  // Vertical height dimension (left side)
  const vertStart: [number, number, number] = [-1.7, 0,   0.1];
  const vertEnd:   [number, number, number] = [-1.7, 4.5, 0.1];
  const tickL:     [number, number, number] = [-1.85, 0, 0.1];
  const tickR:     [number, number, number] = [-1.55, 0, 0.1];
  const tickTL:    [number, number, number] = [-1.85, 4.5, 0.1];
  const tickTR:    [number, number, number] = [-1.55, 4.5, 0.1];

  // Horizontal width dimension (below bottom chord)
  const horizStart: [number, number, number] = [-1.2, -0.5, 0.1];
  const horizEnd:   [number, number, number] = [ 1.2, -0.5, 0.1];
  const tickH1L:    [number, number, number] = [-1.2, -0.6, 0.1];
  const tickH1R:    [number, number, number] = [-1.2, -0.4, 0.1];
  const tickH2L:    [number, number, number] = [ 1.2, -0.6, 0.1];
  const tickH2R:    [number, number, number] = [ 1.2, -0.4, 0.1];

  // Section reference line
  const secStart: [number, number, number] = [-2.0, 2.25, 0];
  const secEnd:   [number, number, number] = [ 2.0, 2.25, 0];

  const mat = useMemo(() => new THREE.LineBasicMaterial({
    color: C.DIM_LINE,
    transparent: true,
    opacity: opacity * 0.55,
    depthWrite: false,
  }), [opacity]);

  return (
    <group>
      {/* Vertical dimension */}
      <Line points={[vertStart, vertEnd]} color={C.DIM_LINE} lineWidth={0.8}
        transparent opacity={opacity * 0.4} />
      <Line points={[tickL, tickR]} color={C.DIM_LINE} lineWidth={0.8}
        transparent opacity={opacity * 0.4} />
      <Line points={[tickTL, tickTR]} color={C.DIM_LINE} lineWidth={0.8}
        transparent opacity={opacity * 0.4} />
      {/* Horizontal dimension */}
      <Line points={[horizStart, horizEnd]} color={C.DIM_LINE} lineWidth={0.8}
        transparent opacity={opacity * 0.4} />
      <Line points={[tickH1L, tickH1R]} color={C.DIM_LINE} lineWidth={0.8}
        transparent opacity={opacity * 0.4} />
      <Line points={[tickH2L, tickH2R]} color={C.DIM_LINE} lineWidth={0.8}
        transparent opacity={opacity * 0.4} />
      {/* Section reference */}
      <Line points={[secStart, secEnd]} color={C.DIM_LINE} lineWidth={0.5}
        transparent opacity={opacity * 0.25}
        dashed dashSize={0.12} gapSize={0.08}
      />
    </group>
  );
}

/* ── Section Plane ───────────────────────────────────────── */
function SectionPlane({ opacity }: { opacity: number }) {
  return (
    <mesh position={[0, 2.25, -0.3]} rotation={[0, 0, 0]}>
      <planeGeometry args={[3.2, 1.6]} />
      <meshBasicMaterial
        color={C.PLANE}
        transparent
        opacity={opacity * 0.12}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Coordinate Origin ───────────────────────────────────── */
function CoordinateOrigin({ opacity }: { opacity: number }) {
  const s = 0.18; // arm length
  return (
    <group position={[0, 0, 0.1]}>
      <Line
        points={[[-s, 0, 0], [s, 0, 0]]}
        color={C.ACCENT}
        lineWidth={1.5}
        transparent
        opacity={opacity}
      />
      <Line
        points={[[0, -s, 0], [0, s, 0]]}
        color={C.ACCENT}
        lineWidth={1.5}
        transparent
        opacity={opacity}
      />
      {/* Center dot */}
      <mesh>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={C.ACCENT} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

/* ── Main structural scene group ─────────────────────────── */
function StructuralScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const pointerRef = useRef({ x: 0, y: 0 });
  const reduced    = useReducedMotion();
  const progress   = useRevealProgress(reduced);

  // Per-stage opacities
  const nodeOpacity    = easeOutCubic(stageProgress(progress, 0, STAGES.lines));
  const dimOpacity     = easeOutCubic(stageProgress(progress, STAGES.lines, STAGES.members));
  const memberScale    = easeOutQuint(stageProgress(progress, STAGES.members, STAGES.plane));
  const planeOpacity   = easeOutCubic(stageProgress(progress, STAGES.plane, STAGES.labels));
  const accentOpacity  = easeOutCubic(stageProgress(progress, STAGES.plane, STAGES.total));

  // Material refs for member color
  const mainMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:     C.MEMBER,
    metalness: 0.55,
    roughness: 0.45,
  }), []);

  const wireMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:      C.MEMBER,
    metalness:  0.3,
    roughness:  0.7,
    wireframe:  true,
    transparent: true,
    opacity:    0.18,
  }), []);

  const beamMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:     C.MEMBER_DARK,
    metalness: 0.4,
    roughness: 0.6,
  }), []);

  // Structural member definitions
  const verticals = useMemo(() => [
    { start: new THREE.Vector3(-1.2, 0, 0),    end: new THREE.Vector3(-1.2, 4.5, 0),    r: 0.018 },
    { start: new THREE.Vector3(0,   0, 0),     end: new THREE.Vector3(0,   4.5, 0),     r: 0.022 },
    { start: new THREE.Vector3(1.2, 0, 0),     end: new THREE.Vector3(1.2, 4.5, 0),     r: 0.018 },
    // Depth layer (slight Z offset)
    { start: new THREE.Vector3(-1.2, 0, -0.6), end: new THREE.Vector3(-1.2, 3.8, -0.6), r: 0.012 },
    { start: new THREE.Vector3(1.2,  0, -0.6), end: new THREE.Vector3(1.2,  3.8, -0.6), r: 0.012 },
  ], []);

  const horizontals = useMemo(() => [
    { start: new THREE.Vector3(-1.2, 0,   0), end: new THREE.Vector3(1.2, 0,   0) },
    { start: new THREE.Vector3(-1.2, 1.2, 0), end: new THREE.Vector3(1.2, 1.2, 0) },
    { start: new THREE.Vector3(-1.2, 2.4, 0), end: new THREE.Vector3(1.2, 2.4, 0) },
    { start: new THREE.Vector3(-1.2, 3.6, 0), end: new THREE.Vector3(1.2, 3.6, 0) },
    { start: new THREE.Vector3(-1.2, 4.5, 0), end: new THREE.Vector3(1.2, 4.5, 0) },
  ], []);

  const diagonals = useMemo(() => [
    { start: new THREE.Vector3(-1.2, 0,   0), end: new THREE.Vector3(0,   1.2, 0) },
    { start: new THREE.Vector3(0,    1.2, 0), end: new THREE.Vector3(1.2, 2.4, 0) },
    { start: new THREE.Vector3(-1.2, 2.4, 0), end: new THREE.Vector3(0,  3.6, 0) },
    { start: new THREE.Vector3(0,    3.6, 0), end: new THREE.Vector3(1.2, 4.5, 0) },
  ], []);

  // Pointer tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointerRef.current = {
        x: (e.clientX / window.innerWidth)  * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Camera drift + pointer parallax
  const driftRef = useRef(0);
  const camBaseRef = useRef(new THREE.Vector3(4, 2.5, 11));
  const camTargetRef = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (reduced) return;

    driftRef.current += delta;

    // Very slow architectural drift
    const drift = Math.sin(driftRef.current * 0.07) * 0.12;

    // Pointer parallax — maximum ±0.28 units
    const px = pointerRef.current.x * 0.28;
    const py = pointerRef.current.y * 0.15;

    camTargetRef.current.set(
      camBaseRef.current.x + px + drift,
      camBaseRef.current.y + py,
      camBaseRef.current.z,
    );

    camera.position.lerp(camTargetRef.current, delta * 1.2);
    camera.lookAt(0.4, 2.2, 0);
  });

  return (
    <group ref={groupRef} position={[0.5, -0.3, 0]}>

      {/* Architectural grid */}
      <ArchitecturalGrid />

      {/* Structural members — vertical */}
      {verticals.map((v, i) => (
        <StructuralMember
          key={`vert-${i}`}
          start={v.start}
          end={v.end}
          radius={v.r}
          material={i < 3 ? mainMat : beamMat}
          scaleY={memberScale}
        />
      ))}

      {/* Wireframe overlay (slight Z offset for depth) */}
      {verticals.slice(0, 3).map((v, i) => (
        <StructuralMember
          key={`wire-${i}`}
          start={new THREE.Vector3(v.start.x, v.start.y, v.start.z - 0.05)}
          end={new THREE.Vector3(v.end.x, v.end.y, v.end.z - 0.05)}
          radius={v.r * 1.3}
          material={wireMat}
          scaleY={memberScale}
        />
      ))}

      {/* Horizontal beams (as thin tubes) */}
      {horizontals.map((h, i) => (
        <StructuralMember
          key={`horiz-${i}`}
          start={h.start}
          end={h.end}
          radius={0.010}
          material={beamMat}
          scaleY={memberScale}
        />
      ))}

      {/* Diagonal bracing */}
      {diagonals.map((d, i) => (
        <StructuralMember
          key={`diag-${i}`}
          start={d.start}
          end={d.end}
          radius={0.007}
          material={beamMat}
          scaleY={memberScale}
        />
      ))}

      {/* Section plane */}
      <SectionPlane opacity={planeOpacity} />

      {/* Node points */}
      <NodePoints opacity={nodeOpacity} />

      {/* Dimension lines */}
      <DimensionLines opacity={dimOpacity} />

      {/* Coordinate origin (accent) */}
      <CoordinateOrigin opacity={accentOpacity} />
    </group>
  );
}

/* ── Scene Lighting ─────────────────────────────────────── */
function SceneLighting() {
  return (
    <>
      {/* Ambient — very low, prevents full shadow */}
      <ambientLight intensity={0.22} />

      {/* Key light — soft directional from upper right front */}
      <directionalLight
        position={[6, 9, 5]}
        intensity={1.4}
        color="#FFF8F0"
      />

      {/* Fill light — opposite side, warm, low intensity */}
      <directionalLight
        position={[-4, 3, -3]}
        intensity={0.35}
        color="#E8DDD0"
      />

      {/* Rim light — subtle from below/behind */}
      <directionalLight
        position={[0, -2, -5]}
        intensity={0.12}
        color="#C8CDD8"
      />
    </>
  );
}

/* ── Root canvas component ──────────────────────────────── */
export default function ExploreScene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      style={{
        position: 'fixed',
        inset:    0,
        zIndex:   0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{
          position: [4, 2.5, 11],
          fov:      38,
          near:     0.1,
          far:      100,
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias:        true,
          alpha:            false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(C.BG, 1);
        }}
      >
        <SceneLighting />
        <StructuralScene />
      </Canvas>
    </div>
  );
}
