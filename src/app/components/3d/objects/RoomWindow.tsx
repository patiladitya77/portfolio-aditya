"use client";

import InteractiveObject from "./InteractiveObject";

interface RoomWindowProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function RoomWindow({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: RoomWindowProps) {
  const frameColor = "#e8e0d0";
  const frameThick = 0.1;

  return (
    <InteractiveObject
      focusKey="window"
      position={position}
      rotation={rotation}
      hoverScale={1.02}
    >
      {/* Outer frame — top */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[2.4, frameThick, 0.14]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>

      {/* Outer frame — bottom */}
      <mesh position={[0, -1.1, 0]} castShadow>
        <boxGeometry args={[2.4, frameThick, 0.14]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>

      {/* Outer frame — left */}
      <mesh position={[-1.15, 0, 0]} castShadow>
        <boxGeometry args={[frameThick, 2.2, 0.14]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>

      {/* Outer frame — right */}
      <mesh position={[1.15, 0, 0]} castShadow>
        <boxGeometry args={[frameThick, 2.2, 0.14]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>

      {/* Centre mullion — vertical */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[frameThick * 0.6, 2.0, 0.08]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>

      {/* Centre mullion — horizontal */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, frameThick * 0.6, 0.08]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>

      {/* Glass pane — semi-transparent */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[2.1, 2.0, 0.02]} />
        <meshStandardMaterial
          color="#88c8ff"
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Subtle sky gradient behind glass (simple colored plane) */}
      <mesh position={[0, 0, -0.3]}>
        <boxGeometry args={[2.0, 1.9, 0.01]} />
        <meshStandardMaterial
          color="#1a2a4a"
          emissive="#1a2a4a"
          emissiveIntensity={0.6}
          roughness={1}
        />
      </mesh>
    </InteractiveObject>
  );
}
