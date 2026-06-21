"use client";

import { useMemo } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  LineSegments,
  LineBasicMaterial,
} from "three";
import InteractiveObject from "./InteractiveObject";

/** Builds a flat grid of LineSegments on the board face. */
function GridLines() {
  const geometry = useMemo(() => {
    const cols = 8;
    const rows = 5;
    const w = 1.7;
    const h = 1.0;
    const positions: number[] = [];

    // Vertical lines
    for (let i = 0; i <= cols; i++) {
      const x = -w / 2 + (i / cols) * w;
      positions.push(x, -h / 2, 0, x, h / 2, 0);
    }
    // Horizontal lines
    for (let j = 0; j <= rows; j++) {
      const y = -h / 2 + (j / rows) * h;
      positions.push(-w / 2, y, 0, w / 2, y, 0);
    }

    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <primitive
      object={
        new LineSegments(
          geometry,
          new LineBasicMaterial({
            color: "#c8d0d8",
            opacity: 0.25,
            transparent: true,
          }),
        )
      }
      position={[0, 0, 0.011]}
    />
  );
}

interface WhiteboardProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function Whiteboard({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: WhiteboardProps) {
  const frameColor = "#c0c0c0";

  return (
    <InteractiveObject
      focusKey="whiteboard"
      position={position}
      rotation={rotation}
      hoverScale={1.03}
    >
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[1.9, 1.2, 0.06]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Board surface */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[1.76, 1.08, 0.01]} />
        <meshStandardMaterial color="#f4f4f2" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Faint grid lines drawn with LineSegments */}
      <GridLines />

      {/* Tray at the bottom */}
      <mesh position={[0, -0.63, 0.05]}>
        <boxGeometry args={[1.76, 0.07, 0.06]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
    </InteractiveObject>
  );
}
