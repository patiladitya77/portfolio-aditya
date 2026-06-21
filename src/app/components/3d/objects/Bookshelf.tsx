"use client";

import { useRef, useEffect } from "react";
import { type Mesh } from "three";
import gsap from "gsap";
import InteractiveObject, { useInteractiveObject } from "./InteractiveObject";

interface BookConfig {
  x: number;
  height: number;
  color: string;
  thickness: number;
}

const BOOKS: BookConfig[] = [
  { x: -0.48, height: 0.55, color: "#e74c3c", thickness: 0.1 },
  { x: -0.35, height: 0.62, color: "#3498db", thickness: 0.09 },
  { x: -0.23, height: 0.58, color: "#2ecc71", thickness: 0.1 },
  { x: -0.1, height: 0.65, color: "#f39c12", thickness: 0.08 },
  { x: 0.02, height: 0.52, color: "#9b59b6", thickness: 0.1 },
  { x: 0.15, height: 0.6, color: "#1abc9c", thickness: 0.09 },
  { x: 0.27, height: 0.57, color: "#e67e22", thickness: 0.1 },
  { x: 0.4, height: 0.63, color: "#e91e63", thickness: 0.09 },
];

/** A row of books that animate outward on hover. */
function BookRow({ yBase, hovered }: { yBase: number; hovered: boolean }) {
  const bookRefs = useRef<(Mesh | null)[]>([]);

  useEffect(() => {
    bookRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const pushZ = 0.05 + (i % 4) * 0.025; // 0.05–0.125 range
      gsap.to(mesh.position, {
        z: hovered ? pushZ : 0,
        duration: 0.25 + i * 0.02,
        ease: "power2.out",
      });
    });
  }, [hovered]);

  return (
    <>
      {BOOKS.map((book, i) => (
        <mesh
          key={i}
          ref={(el) => {
            bookRefs.current[i] = el;
          }}
          position={[book.x, yBase + book.height / 2, 0]}
          castShadow
        >
          <boxGeometry args={[book.thickness, book.height, 0.22]} />
          <meshStandardMaterial color={book.color} roughness={0.8} />
        </mesh>
      ))}
    </>
  );
}

/** Reads hover state from InteractiveObject context and renders all shelf meshes. */
function BookshelfMeshes() {
  const { hovered } = useInteractiveObject();
  const shelfColor = "#7B5E3A";
  const shelfDark = "#5C4020";

  return (
    <>
      {/* Back panel */}
      <mesh position={[0, 1.0, -0.13]} castShadow>
        <boxGeometry args={[1.3, 2.0, 0.04]} />
        <meshStandardMaterial color={shelfDark} roughness={0.7} />
      </mesh>

      {/* Left side */}
      <mesh position={[-0.63, 1.0, 0]} castShadow>
        <boxGeometry args={[0.04, 2.0, 0.3]} />
        <meshStandardMaterial color={shelfColor} roughness={0.7} />
      </mesh>

      {/* Right side */}
      <mesh position={[0.63, 1.0, 0]} castShadow>
        <boxGeometry args={[0.04, 2.0, 0.3]} />
        <meshStandardMaterial color={shelfColor} roughness={0.7} />
      </mesh>

      {/* Bottom board */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[1.3, 0.04, 0.3]} />
        <meshStandardMaterial color={shelfColor} roughness={0.7} />
      </mesh>

      {/* Middle shelf */}
      <mesh position={[0, 1.02, 0]} receiveShadow>
        <boxGeometry args={[1.3, 0.04, 0.3]} />
        <meshStandardMaterial color={shelfColor} roughness={0.7} />
      </mesh>

      {/* Top board */}
      <mesh position={[0, 2.0, 0]} receiveShadow>
        <boxGeometry args={[1.3, 0.04, 0.3]} />
        <meshStandardMaterial color={shelfColor} roughness={0.7} />
      </mesh>

      {/* Bottom row of books */}
      <BookRow yBase={0.06} hovered={hovered} />

      {/* Top row of books */}
      <group position={[0, 1.06, 0]}>
        <BookRow yBase={0} hovered={hovered} />
      </group>
    </>
  );
}

interface BookshelfProps {
  position?: [number, number, number];
}

export default function Bookshelf({ position = [0, 0, 0] }: BookshelfProps) {
  return (
    <InteractiveObject
      focusKey="bookshelf"
      position={position}
      hoverScale={1.02}
    >
      <BookshelfMeshes />
    </InteractiveObject>
  );
}
