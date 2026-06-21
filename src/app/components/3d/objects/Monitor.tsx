"use client";

import InteractiveObject, { useInteractiveObject } from "./InteractiveObject";

function MonitorMeshes() {
  const { hovered } = useInteractiveObject();
  const bodyColor = "#1a1a1a";
  const accentColor = "#2d2d2d";

  return (
    <>
      {/* Screen bezel */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[1.6, 0.95, 0.07]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Screen face */}
      <mesh position={[0, 1.1, 0.04]}>
        <boxGeometry args={[1.46, 0.82, 0.01]} />
        <meshStandardMaterial
          color="#0d1117"
          emissive="#3a6ea8"
          emissiveIntensity={hovered ? 0.5 : 0.15}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Neck / stand arm */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.1, 0.55, 0.1]} />
        <meshStandardMaterial
          color={accentColor}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[0.55, 0.06, 0.35]} />
        <meshStandardMaterial
          color={accentColor}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
    </>
  );
}

interface MonitorProps {
  position?: [number, number, number];
}

export default function Monitor({ position = [0, 0, 0] }: MonitorProps) {
  return (
    <InteractiveObject focusKey="monitor" position={position} hoverScale={1.04}>
      <MonitorMeshes />
    </InteractiveObject>
  );
}
