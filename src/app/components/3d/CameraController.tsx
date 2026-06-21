"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import gsap from "gsap";
import {
  useRoomStore,
  type CameraPreset,
  type FocusTarget,
} from "./hooks/useRoomStore";

// Camera presets account for the 2.5x object group scale applied in RoomScene.
export const CAMERA_PRESETS: Record<FocusTarget | "overview", CameraPreset> = {
  overview: { position: [0, 5, 12], lookAt: [0, 2.5, 0] },
  laptop: { position: [0, 4.5, 6], lookAt: [0, 3.5, 0] },
  bookshelf: { position: [-9, 4.5, 7], lookAt: [-9, 4, 0] },
  whiteboard: { position: [0, 5, 0], lookAt: [0, 5.5, -10] },
  window: { position: [8, 6, 4], lookAt: [8, 5, -7] },
  smartphone: { position: [3.5, 4, 6], lookAt: [3.5, 3.5, 0] },
  monitor: { position: [-2, 5, 6], lookAt: [-2, 4.5, 0] },
  coffee: { position: [1, 3.5, 6], lookAt: [1, 3, 0] },
  sticky: { position: [4, 6, 4], lookAt: [4, 5.5, -2] },
};

/**
 * CameraController reads focusTarget from the global store and drives
 * smooth GSAP camera transitions. It renders nothing — it's a pure
 * logic component mounted inside the R3F Canvas.
 */
export default function CameraController() {
  const { camera } = useThree();
  const focusTarget = useRoomStore((s) => s.focusTarget);
  const setAnimating = useRoomStore((s) => s.setAnimating);

  // Mutable refs so GSAP callbacks always close over the latest values
  const positionTweenRef = useRef<gsap.core.Tween | null>(null);
  const lookAtTweenRef = useRef<gsap.core.Tween | null>(null);
  const lookAtTarget = useRef(new Vector3(0, 1, 0));

  useEffect(() => {
    const preset = focusTarget
      ? CAMERA_PRESETS[focusTarget]
      : CAMERA_PRESETS.overview;

    const [px, py, pz] = preset.position;
    const [lx, ly, lz] = preset.lookAt;

    // Kill any in-flight tweens before starting new ones
    positionTweenRef.current?.kill();
    lookAtTweenRef.current?.kill();

    // Tween camera position
    positionTweenRef.current = gsap.to(camera.position, {
      x: px,
      y: py,
      z: pz,
      duration: 1.2,
      ease: "power2.inOut",
      onStart: () => setAnimating(true),
      onComplete: () => setAnimating(false),
    });

    // Simultaneously tween look-at target, updating camera.lookAt on each tick
    lookAtTweenRef.current = gsap.to(lookAtTarget.current, {
      x: lx,
      y: ly,
      z: lz,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(lookAtTarget.current);
      },
    });

    // Cleanup: kill tweens and reset animating flag on unmount / dep change
    return () => {
      positionTweenRef.current?.kill();
      lookAtTweenRef.current?.kill();
      setAnimating(false);
    };
  }, [focusTarget, camera, setAnimating]);

  return null;
}
