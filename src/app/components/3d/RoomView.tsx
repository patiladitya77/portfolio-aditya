"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import LoadingScreen from "./LoadingScreen";
import RoomScene from "./RoomScene";
import HintOverlay from "./HintOverlay";
import BackButton from "./BackButton";
import ContentPanelHost from "./panels/ContentPanelHost";

/**
 * RoomView — full-screen wrapper for the interactive 3D developer room.
 *
 * - Renders an R3F <Canvas> that fills the entire viewport.
 * - <RoomScene> is loaded lazily inside <Suspense>; <LoadingScreen> is shown
 *   while the scene assets are being fetched.
 * - DOM overlay components (HintOverlay, BackButton, ContentPanelHost) are
 *   rendered outside the Canvas so they sit on top of the WebGL surface
 *   without interfering with Three.js rendering.
 *
 * Requirements: 1.4, 1.6, 1.7, 13.3
 */
export default function RoomView() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
      data-testid="room-view"
    >
      {/* ── WebGL canvas ──────────────────────────────────────── */}
      <Canvas
        frameloop="demand"
        camera={{ fov: 50, position: [0, 5, 12] }}
        style={{ width: "100%", height: "100%" }}
        shadows
      >
        <Suspense fallback={<LoadingScreen />}>
          <RoomScene />
        </Suspense>
      </Canvas>

      {/* ── DOM overlays (outside Canvas, stacked over the scene) ── */}
      <HintOverlay />
      <BackButton />
      <ContentPanelHost />
    </div>
  );
}
