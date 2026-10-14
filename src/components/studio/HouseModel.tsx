import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Point = [number, number, number];
const C = {
  cream: "#d6aa6b",
  coral: "#c84c36",
  teal: "#008f83",
  dark: "#142b45",
  gold: "#ffba36",
  water: "#087999",
};
function Box({
  p,
  s,
  c = C.cream,
  r = [0, 0, 0],
}: {
  p: Point;
  s: Point;
  c?: string;
  r?: Point;
}) {
  return (
    <mesh position={p} rotation={r} castShadow receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={0.72} />
    </mesh>
  );
}
function Cylinder({
  p,
  radius,
  h,
  c,
  top = radius,
}: {
  p: Point;
  radius: number;
  h: number;
  c: string;
  top?: number;
}) {
  return (
    <mesh position={p} castShadow receiveShadow>
      <cylinderGeometry args={[top, radius, h, 32]} />
      <meshStandardMaterial color={c} roughness={0.65} />
    </mesh>
  );
}
function Orb({ p, r, c }: { p: Point; r: number; c: string }) {
  return (
    <mesh position={p} castShadow>
      <sphereGeometry args={[r, 16, 12]} />
      <meshStandardMaterial color={c} roughness={0.65} />
    </mesh>
  );
}
function Ring({
  p,
  r,
  c,
  rotation = [Math.PI / 2, 0, 0],
}: {
  p: Point;
  r: number;
  c: string;
  rotation?: Point;
}) {
  return (
    <mesh position={p} rotation={rotation} castShadow>
      <torusGeometry args={[r, 0.045, 12, 64]} />
      <meshStandardMaterial color={c} metalness={0.25} roughness={0.4} />
    </mesh>
  );
}
function Window({ p, rotation = 0 }: { p: Point; rotation?: number }) {
  return (
    <group position={p} rotation={[0, rotation, 0]}>
      <Box p={[0, 0, 0]} s={[0.44, 0.72, 0.08]} c={C.dark} />
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[0.32, 0.6]} />
        <meshStandardMaterial
          color="#ffe5a0"
          emissive="#ffc34f"
          emissiveIntensity={1.6}
        />
      </mesh>
      <Box p={[0, 0, 0.07]} s={[0.035, 0.65, 0.025]} c={C.coral} />
      <Box p={[0, -0.1, 0.07]} s={[0.37, 0.035, 0.025]} c={C.coral} />
      <Box p={[0, -0.4, 0.04]} s={[0.58, 0.09, 0.22]} c={C.gold} />
    </group>
  );
}
function Lamp({ p }: { p: Point }) {
  return (
    <group position={p}>
      <pointLight
        position={[0, 0.78, 0]}
        color="#ffb654"
        intensity={2.2}
        distance={2.4}
        decay={2}
      />
      <Cylinder p={[0, 0.38, 0]} radius={0.035} h={0.76} c={C.dark} />
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.1, 12, 8]} />
        <meshStandardMaterial
          color="#fff0b0"
          emissive="#ffc35b"
          emissiveIntensity={2}
        />
      </mesh>
      <Cylinder
        p={[0, 0.92, 0]}
        radius={0.15}
        top={0.04}
        h={0.12}
        c={C.coral}
      />
    </group>
  );
}

// Local geometry, no model downloads or textures. Render only during interaction.
export default function HouseModel({
  exploded,
  reduced,
  sailing,
}: {
  exploded: boolean;
  reduced: boolean;
  sailing: boolean;
}) {
  const dome = useRef<THREE.Group>(null),
    scope = useRef<THREE.Group>(null),
    boat = useRef<THREE.Group>(null);
  const { invalidate } = useThree();
  useFrame((_, dt) => {
    const move = (obj: THREE.Group | null, key: "y" | "x", target: number) => {
      if (!obj) return;
      obj.position[key] = reduced
        ? target
        : THREE.MathUtils.damp(
            obj.position[key],
            target,
            5,
            Math.min(dt, 0.05),
          );
      if (Math.abs(obj.position[key] - target) > 0.001) invalidate();
    };
    move(dome.current, "y", exploded ? 1.7 : 0);
    move(boat.current, "x", sailing ? 0.8 : -1.8);
    if (scope.current) {
      const target = exploded ? -0.55 : 0.28;
      scope.current.rotation.y = reduced
        ? target
        : THREE.MathUtils.damp(
            scope.current.rotation.y,
            target,
            4,
            Math.min(dt, 0.05),
          );
      if (Math.abs(scope.current.rotation.y - target) > 0.001) invalidate();
    }
  });
  return (
    <group position={[0, -0.55, 0]}>
      {/* A small island of ideas, with a navigable canal along its front. */}
      <Box p={[0, -0.15, 0]} s={[5.7, 0.45, 4.5]} c="#101f36" />
      <Box p={[0, 0.1, -0.6]} s={[5.55, 0.12, 3.15]} c="#9b7959" />
      <Box p={[0, 0.03, 1.65]} s={[5.5, 0.09, 1.1]} c={C.water} />
      <Box p={[0, -0.02, 2.24]} s={[5.7, 0.16, 0.13]} c={C.teal} />
      {Array.from({ length: 12 }, (_, i) => (
        <Box
          key={i}
          p={[-2.5 + (i % 6), 0.17, -1.9 + Math.floor(i / 6) * 2.8]}
          s={[0.87, 0.035, 0.28]}
          c={i % 2 ? "#cca77b" : "#b48a5d"}
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <Box
          key={i}
          p={[-2.4 + i * 0.59, 0.085, 1.35 + (i % 3) * 0.28]}
          s={[0.19, 0.008, 0.024]}
          c="#41d8db"
        />
      ))}
      {/* Round masonry tower and illuminated windows. */}
      <Cylinder p={[-0.65, 0.3, -0.5]} radius={1.16} h={0.28} c={C.dark} />
      <Cylinder p={[-0.65, 1.55, -0.5]} radius={0.92} h={2.35} c={C.coral} />
      {[0.58, 1.13, 1.72, 2.3].map((y) => (
        <Cylinder
          key={y}
          p={[-0.65, y, -0.5]}
          radius={0.945}
          h={0.07}
          c="#ed9560"
        />
      ))}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a) => (
        <Window
          key={a}
          p={[-0.65 + Math.sin(a) * 0.935, 1.93, -0.5 + Math.cos(a) * 0.935]}
          rotation={a}
        />
      ))}
      <Box p={[-0.65, 0.77, 0.43]} s={[0.55, 1.05, 0.07]} c={C.dark} />
      <Box p={[-0.65, 0.72, 0.48]} s={[0.4, 0.88, 0.06]} c={C.teal} />
      <Orb p={[-0.5, 0.72, 0.54]} r={0.04} c={C.gold} />
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          p={[-0.65, 0.2 + i * 0.08, 0.95 - i * 0.15]}
          s={[0.85, 0.12, 0.3]}
          c={C.cream}
        />
      ))}
      <Cylinder p={[-0.65, 2.77, -0.5]} radius={1.2} h={0.18} c={C.gold} />
      {/* Telescope exposed when the dome lifts. */}
      <Cylinder p={[-0.65, 3.12, -0.5]} radius={0.12} h={0.7} c={C.dark} />
      <group ref={scope} position={[-0.65, 3.5, -0.5]} rotation={[0, 0.28, 0]}>
        <group rotation={[0, 0, -Math.PI / 3]}>
          <Cylinder p={[0, 0.35, 0]} radius={0.23} h={1.35} c={C.cream} />
          <Cylinder p={[0, 0.95, 0]} radius={0.31} h={0.15} c={C.gold} />
          <Cylinder p={[0, 1.04, 0]} radius={0.24} h={0.035} c="#133c64" />
          <Cylinder p={[0, -0.43, 0]} radius={0.14} h={0.18} c={C.gold} />
          <Cylinder p={[0, 0.25, 0]} radius={0.25} h={0.12} c={C.coral} />
        </group>
      </group>
      <group ref={dome}>
        <mesh position={[-0.65, 2.88, -0.5]} rotation={[0, -0.5, 0]} castShadow>
          <sphereGeometry
            args={[1.13, 32, 16, 0.65, Math.PI * 1.62, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            color={C.teal}
            roughness={0.32}
            metalness={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Ring p={[-0.65, 2.9, -0.5]} r={1.14} c={C.gold} />
        {[0.35, 0.7, 1.05].map((a) => (
          <Ring
            key={a}
            p={[-0.65, 2.88 + Math.sin(a) * 1.14, -0.5]}
            r={Math.cos(a) * 1.14}
            c="#2dd5b4"
          />
        ))}
        <Cylinder p={[-0.65, 4.12, -0.5]} radius={0.035} h={0.26} c={C.gold} />
        <Orb p={[-0.65, 4.3, -0.5]} r={0.1} c={C.gold} />
      </group>
      {/* Coral-roofed workshop: warm Venetian color and tiny architectural details. */}
      <Box p={[1.28, 0.87, -0.73]} s={[1.35, 1.38, 1.65]} c={C.cream} />
      <Box p={[1.28, 0.33, -0.73]} s={[1.48, 0.25, 1.78]} c="#b77243" />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Box
            p={[1.28 + side * 0.4, 1.73, -0.73]}
            s={[0.95, 0.12, 1.95]}
            c={C.coral}
            r={[0, 0, -side * 0.4]}
          />
          {Array.from({ length: 7 }, (_, i) => (
            <Box
              key={i}
              p={[1.28 + side * 0.4, 1.8, -1.55 + i * 0.27]}
              s={[0.94, 0.045, 0.045]}
              c="#e8803d"
              r={[0, 0, -side * 0.4]}
            />
          ))}
        </group>
      ))}
      <Box p={[1.28, 1.95, -0.73]} s={[0.1, 0.09, 2]} c={C.gold} />
      <Window p={[1.28, 0.95, 0.13]} />
      <Window p={[1.97, 0.95, -0.75]} rotation={Math.PI / 2} />
      <Box
        p={[1.28, 1.47, 0.34]}
        s={[0.85, 0.1, 0.5]}
        c={C.teal}
        r={[-0.15, 0, 0]}
      />
      {/* A short footbridge spans the water at the edge of the island. */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Box
          key={i}
          p={[1.75, 0.22 + Math.sin((i / 6) * Math.PI) * 0.19, 1.07 + i * 0.18]}
          s={[0.72, 0.09, 0.2]}
          c={C.cream}
        />
      ))}
      {[-1, 1].map((side) => (
        <group key={side}>
          {[0, 1, 2, 3].map((i) => (
            <Cylinder
              key={i}
              p={[1.75 + side * 0.36, 0.59, 1.1 + i * 0.35]}
              radius={0.025}
              h={0.5}
              c={C.dark}
            />
          ))}
          <Box
            p={[1.75 + side * 0.36, 0.85, 1.62]}
            s={[0.045, 0.045, 1.25]}
            c={C.gold}
          />
        </group>
      ))}
      <group ref={boat} position={[-1.8, 0, 0]}>
        <mesh position={[0, 0.19, 1.67]} scale={[0.5, 0.16, 0.2]} castShadow>
          <sphereGeometry args={[1, 16, 8]} />
          <meshStandardMaterial color={C.gold} />
        </mesh>
        <Box p={[0, 0.26, 1.67]} s={[0.55, 0.045, 0.25]} c={C.coral} />
        <Cylinder p={[0, 0.55, 1.67]} radius={0.018} h={0.7} c={C.cream} />
        <mesh position={[0.13, 0.64, 1.67]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([
                  -0.12, -0.2, 0, -0.12, 0.23, 0, 0.2, -0.2, 0,
                ]),
                3,
              ]}
            />
          </bufferGeometry>
          <meshStandardMaterial color="#fff3d3" side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* Lollipop trees and brass garden orrery. */}
      {[
        [2.3, 0.2, -1.7],
        [-2.2, 0.2, -1.4],
      ].map((p, i) => (
        <group key={i} position={p as Point}>
          <Cylinder p={[0, 0.5, 0]} radius={0.055} h={1} c="#b66c64" />
          <Orb p={[0, 1.1, 0]} r={0.4} c={i ? "#36985c" : "#087f69"} />
          <Orb p={[0.18, 0.88, 0.1]} r={0.25} c="#72bf63" />
          <Cylinder
            p={[0, 0.12, 0]}
            radius={0.26}
            top={0.32}
            h={0.25}
            c={C.coral}
          />
        </group>
      ))}
      <group position={[-2.02, 0.55, 0.5]}>
        <Cylinder p={[0, -0.17, 0]} radius={0.12} h={0.38} c={C.dark} />
        <Orb p={[0, 0.15, 0]} r={0.18} c={C.gold} />
        <Ring p={[0, 0.15, 0]} r={0.38} c={C.gold} rotation={[0.6, 0.2, 0.3]} />
        <Orb p={[0.33, 0.3, 0]} r={0.075} c={C.coral} />
      </group>
      <Lamp p={[-2.48, 0.18, 0.85]} />
      <Lamp p={[2.5, 0.18, 0.65]} />
    </group>
  );
}
