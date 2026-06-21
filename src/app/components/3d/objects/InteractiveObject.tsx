"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import { type ThreeEvent } from "@react-three/fiber";
import { type Group } from "three";
import { useRoomStore, type FocusTarget } from "../hooks/useRoomStore";

// ─── Context ───────────────────────────────────────────────────────────────

interface InteractiveObjectContextValue {
  hovered: boolean;
  hoverColor: string;
}

export const InteractiveObjectContext =
  createContext<InteractiveObjectContextValue>({
    hovered: false,
    hoverColor: "#ffffff",
  });

export function useInteractiveObject() {
  return useContext(InteractiveObjectContext);
}

// ─── Props ─────────────────────────────────────────────────────────────────

interface InteractiveObjectProps {
  focusKey: FocusTarget;
  children: React.ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  hoverColor?: string;
  /** Uniform scale multiplier applied to the group while hovered (default: 1.05) */
  hoverScale?: number;
  onHoverEnter?: () => void;
  onHoverLeave?: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function InteractiveObject({
  focusKey,
  children,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  hoverColor = "#ffffff",
  hoverScale = 1.05,
  onHoverEnter,
  onHoverLeave,
}: InteractiveObjectProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  const setFocus = useRoomStore((s) => s.setFocus);
  const isAnimating = useRoomStore((s) => s.isAnimating);

  // Compute the effective scale, incorporating hoverScale when hovered
  const effectiveScale = (() => {
    const multiplier = hovered ? hoverScale : 1;
    if (typeof scale === "number") return scale * multiplier;
    return scale.map((v) => v * multiplier) as [number, number, number];
  })();

  const handlePointerEnter = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(true);
      document.body.style.cursor = "pointer";
      onHoverEnter?.();
    },
    [onHoverEnter],
  );

  const handlePointerLeave = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(false);
      document.body.style.cursor = "default";
      onHoverLeave?.();
    },
    [onHoverLeave],
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (!isAnimating) {
        setFocus(focusKey);
      }
    },
    [isAnimating, setFocus, focusKey],
  );

  return (
    <InteractiveObjectContext.Provider value={{ hovered, hoverColor }}>
      <group
        ref={groupRef}
        position={position}
        rotation={rotation}
        scale={effectiveScale}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        {children}
      </group>
    </InteractiveObjectContext.Provider>
  );
}
