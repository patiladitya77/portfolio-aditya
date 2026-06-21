"use client";

import { useRef } from "react";
import { type Mesh } from "three";
import { useInteractiveObject } from "./InteractiveObject";
import InteractiveObject from "./InteractiveObject";

// ─── Individual Note ────────────────────────────────────────────────────────

interface NoteProps {
  color: string;
}

function StickyNote({ color }: NoteProps) {
  const meshRef = useRef<Mesh>(null);
  const { hovered } = useInteractiveObject();

  return (
    <mesh ref={meshRef} castShadow>
      <planeGeometry args={[0.28, 0.28]} />
      <meshStandardMaterial
        color={color}
        roughness={0.85}
        emissive={color}
        emissiveIntensity={hovered ? 0.25 : 0.05}
      />
    </mesh>
  );
}

// ─── Note configs ───────────────────────────────────────────────────────────

const NOTES = [
  // On the desk surface, leaning slightly
  {
    position: [0.9, 0.88, -0.3] as [number, number, number],
    rotation: [-Math.PI / 2 + 0.15, 0, 0.2] as [number, number, number],
    color: "#ffe066",
  },
  // On the wall above the desk
  {
    position: [-0.5, 2.6, -2.45] as [number, number, number],
    rotation: [0, 0, -0.08] as [number, number, number],
    color: "#a8e6cf",
  },
  // On the wall, slightly to the right
  {
    position: [0.6, 2.45, -2.45] as [number, number, number],
    rotation: [0, 0, 0.1] as [number, number, number],
    color: "#ffb3ba",
  },
] as const;

// ─── StickyNotes ────────────────────────────────────────────────────────────

interface StickyNotesProps {
  position?: [number, number, number];
}

export default function StickyNotes({
  position = [0, 0, 0],
}: StickyNotesProps) {
  return (
    <group position={position}>
      {NOTES.map((note, i) => (
        <InteractiveObject
          key={i}
          focusKey="sticky"
          position={note.position}
          rotation={note.rotation}
          hoverScale={1.1}
        >
          <StickyNote color={note.color} />
        </InteractiveObject>
      ))}
    </group>
  );
}
