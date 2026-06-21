"use client";

import { useRef, useEffect } from "react";
import { type Mesh } from "three";
import gsap from "gsap";
import InteractiveObject, { useInteractiveObject } from "./InteractiveObject";
import { useRoomStore } from "../hooks/useRoomStore";

function SmartphoneMeshes() {
  const { hovered } = useInteractiveObject();
  const focusTarget = useRoomStore((s) => s.focusTarget);
  const screenRef = useRef<Mesh>(null);

  // Unlock animation when smartphone is focused
  useEffect(() => {
    if (!screenRef.current) return;
    const mat = screenRef.current.material as THREE.MeshStandardMaterial;
    gsap.to(mat, {
      emissiveIntensity: focusTarget === "smartphone" ? 1 : 0,
      duration: 0.5,
      ease: "power2.inOut",
    });
  }, [focusTarget]);

  const bodyColor = "#1c1c1e";

  return (
    <>
      {/* Phone body */}
      <mesh castShadow>
        <boxGeometry args={[0.38, 0.78, 0.05]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0, 0.028]}>
        <boxGeometry args={[0.32, 0.65, 0.005]} />
        <meshStandardMaterial
          color="#111"
          emissive="#00aaff"
          emissiveIntensity={hovered ? 0.35 : 0}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Home indicator bar */}
      <mesh position={[0, -0.29, 0.031]}>
        <boxGeometry args={[0.12, 0.015, 0.002]} />
        <meshStandardMaterial color="#555" roughness={0.5} />
      </mesh>
    </>
  );
}

interface SmartphoneProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function Smartphone({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: SmartphoneProps) {
  return (
    <InteractiveObject
      focusKey="smartphone"
      position={position}
      rotation={rotation}
      hoverScale={1.06}
    >
      <SmartphoneMeshes />
    </InteractiveObject>
  );
}
