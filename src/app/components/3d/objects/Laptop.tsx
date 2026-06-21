"use client";

import { useRef, useEffect } from "react";
import { type Mesh } from "three";
import gsap from "gsap";
import InteractiveObject, { useInteractiveObject } from "./InteractiveObject";
import { useRoomStore } from "../hooks/useRoomStore";

interface LaptopProps {
  position?: [number, number, number];
}

/** Inner mesh component — reads hover context and store focus state. */
function LaptopMeshes() {
  const { hovered } = useInteractiveObject();
  const focusTarget = useRoomStore((s) => s.focusTarget);
  const screenRef = useRef<Mesh>(null);

  // Screen power-on animation when laptop is focused
  useEffect(() => {
    if (!screenRef.current) return;
    const mat = screenRef.current.material as THREE.MeshStandardMaterial;
    gsap.to(mat, {
      emissiveIntensity: focusTarget === "laptop" ? 1 : 0,
      duration: 0.6,
      ease: "power2.inOut",
    });
  }, [focusTarget]);

  const bodyColor = "#2a2a2a";
  const screenEmissive = "#00aaff";

  return (
    <>
      {/* Base / keyboard deck */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 0.06, 0.8]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Lid (slightly open, ~110°) */}
      <group position={[0, 0.03, -0.4]} rotation={[-0.35, 0, 0]}>
        {/* Lid shell */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.2, 0.8, 0.05]} />
          <meshStandardMaterial
            color={bodyColor}
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>

        {/* Screen face */}
        <mesh ref={screenRef} position={[0, 0.4, 0.03]}>
          <boxGeometry args={[1.08, 0.68, 0.01]} />
          <meshStandardMaterial
            color="#111111"
            emissive={screenEmissive}
            emissiveIntensity={hovered ? 0.4 : 0}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
      </group>
    </>
  );
}

export default function Laptop({ position = [0, 0, 0] }: LaptopProps) {
  return (
    <InteractiveObject
      focusKey="laptop"
      position={position}
      hoverColor="#00aaff"
      hoverScale={1.04}
    >
      <LaptopMeshes />
    </InteractiveObject>
  );
}
