"use client";

import { useMemo } from "react";
import { TorusGeometry } from "three";
import InteractiveObject from "./InteractiveObject";

interface CoffeeMugProps {
  position?: [number, number, number];
}

export default function CoffeeMug({ position = [0, 0, 0] }: CoffeeMugProps) {
  const mugColor = "#e8e0d8";
  const coffeeColor = "#3b1e08";

  // Partial torus arc used as the handle
  const handleGeo = useMemo(
    () => new TorusGeometry(0.085, 0.018, 8, 12, Math.PI),
    [],
  );

  return (
    <InteractiveObject focusKey="coffee" position={position} hoverScale={1.08}>
      {/* Mug body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.09, 0.22, 16]} />
        <meshStandardMaterial color={mugColor} roughness={0.7} />
      </mesh>

      {/* Coffee surface inside */}
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.088, 0.088, 0.01, 16]} />
        <meshStandardMaterial color={coffeeColor} roughness={0.9} />
      </mesh>

      {/* Handle — partial torus arc, rotated to face outward */}
      <mesh
        geometry={handleGeo}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
        position={[0.12, 0, 0]}
        castShadow
      >
        <meshStandardMaterial color={mugColor} roughness={0.7} />
      </mesh>
    </InteractiveObject>
  );
}
