"use client";

interface DeskProps {
  position?: [number, number, number];
}

/**
 * Non-interactive desk built entirely from BoxGeometry primitives.
 * Includes: desktop surface, four legs, and a drawer block.
 */
export default function Desk({ position = [0, 0, 0] }: DeskProps) {
  const wood = "#8B6343";
  const darkWood = "#6B4C30";

  return (
    <group position={position}>
      {/* Desktop surface */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.08, 1.4]} />
        <meshStandardMaterial color={wood} roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Front-left leg */}
      <mesh position={[-1.45, 0.5, 0.6]} castShadow>
        <boxGeometry args={[0.1, 1.0, 0.1]} />
        <meshStandardMaterial color={darkWood} roughness={0.7} />
      </mesh>

      {/* Front-right leg */}
      <mesh position={[1.45, 0.5, 0.6]} castShadow>
        <boxGeometry args={[0.1, 1.0, 0.1]} />
        <meshStandardMaterial color={darkWood} roughness={0.7} />
      </mesh>

      {/* Back-left leg */}
      <mesh position={[-1.45, 0.5, -0.6]} castShadow>
        <boxGeometry args={[0.1, 1.0, 0.1]} />
        <meshStandardMaterial color={darkWood} roughness={0.7} />
      </mesh>

      {/* Back-right leg */}
      <mesh position={[1.45, 0.5, -0.6]} castShadow>
        <boxGeometry args={[0.1, 1.0, 0.1]} />
        <meshStandardMaterial color={darkWood} roughness={0.7} />
      </mesh>

      {/* Drawer block (right side under the surface) */}
      <mesh position={[1.1, 0.55, 0]} castShadow>
        <boxGeometry args={[0.7, 0.9, 1.1]} />
        <meshStandardMaterial color={darkWood} roughness={0.65} />
      </mesh>

      {/* Drawer handle */}
      <mesh position={[0.77, 0.55, 0.56]}>
        <boxGeometry args={[0.25, 0.04, 0.04]} />
        <meshStandardMaterial color="#C0A060" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}
