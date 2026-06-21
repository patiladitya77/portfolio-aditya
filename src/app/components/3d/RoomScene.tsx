"use client";

import CameraController from "./CameraController";
import Desk from "./objects/Desk";
import Laptop from "./objects/Laptop";
import Monitor from "./objects/Monitor";
import Bookshelf from "./objects/Bookshelf";
import Whiteboard from "./objects/Whiteboard";
import RoomWindow from "./objects/RoomWindow";
import Smartphone from "./objects/Smartphone";
import CoffeeMug from "./objects/CoffeeMug";
import StickyNotes from "./objects/StickyNotes";

/**
 * RoomScene assembles all 3D objects, lights, and the CameraController
 * inside the R3F Canvas. Three.js default frustum culling is relied upon
 * for performance — no object sets frustumCulled={false} here.
 */
// All objects are rendered inside a group scaled 2.5x so the room fills
// the viewport without touching any individual component's internal geometry.
const SCALE = 2.5;

export default function RoomScene() {
  return (
    <>
      {/* ── Camera ─────────────────────────────────────────────── */}
      <CameraController />

      {/* ── Depth fog — subtle, improves depth perception ─────── */}
      <fog attach="fog" args={["#0d1117", 18, 55]} />

      {/* ── Lighting ───────────────────────────────────────────── */}

      {/* Boosted ambient — warm room baseline */}
      <ambientLight color="#ffe8c0" intensity={0.7} />

      {/* Warm orange desk lamp — key light over the work surface */}
      <pointLight
        color="#ff8c30"
        intensity={4.0}
        distance={14}
        decay={2}
        position={[1.2, 5.5, 0.5]}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />

      {/* Secondary warm fill from the lamp shade direction */}
      <pointLight
        color="#ffaa55"
        intensity={2.0}
        distance={10}
        decay={2}
        position={[0, 4.5, 1.5]}
      />

      {/* Blue moonlight streaming through the window */}
      <spotLight
        color="#4488cc"
        intensity={3.5}
        distance={30}
        angle={0.35}
        penumbra={0.8}
        decay={1.5}
        position={[-7, 9, -4]}
        target-position={[0, 0, 0]}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />

      {/* Cool purple ceiling accent */}
      <spotLight
        color="#9966ff"
        intensity={1.8}
        distance={22}
        angle={0.5}
        penumbra={0.7}
        decay={2}
        position={[0, 14, 2]}
        target-position={[0, 0, 0]}
      />

      {/* ── Room geometry (unscaled — sized to wrap the 2.5x objects) ── */}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 24]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 7.5, -7.5]} receiveShadow>
        <boxGeometry args={[28, 15, 0.15]} />
        <meshStandardMaterial color="#16213e" roughness={0.9} />
      </mesh>

      {/* Left wall */}
      <mesh
        position={[-12, 7.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[24, 15, 0.15]} />
        <meshStandardMaterial color="#16213e" roughness={0.9} />
      </mesh>

      {/* Right wall */}
      <mesh
        position={[12, 7.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[24, 15, 0.15]} />
        <meshStandardMaterial color="#141428" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 15, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 24]} />
        <meshStandardMaterial color="#0f0f1e" roughness={0.95} />
      </mesh>

      {/* ── Scaled object group ────────────────────────────────── */}
      <group scale={[SCALE, SCALE, SCALE]}>
        {/* Desk — centred in front of the back wall */}
        <Desk position={[0, 0, 0]} />

        {/* Laptop — on the desk surface, slightly left of centre */}
        <Laptop position={[-0.3, 1.05, 0]} />

        {/* Monitor — on the desk, left of the laptop */}
        <Monitor position={[-1.0, 1.05, -0.25]} />

        {/* Smartphone — on the desk, right of the laptop */}
        <Smartphone position={[1.1, 1.05, 0.15]} rotation={[0, -0.3, 0]} />

        {/* Coffee mug — front-right corner of the desk */}
        <CoffeeMug position={[1.35, 1.05, 0.45]} />

        {/* Bookshelf — against the left wall */}
        <Bookshelf position={[-4.5, 0, -1.5]} />

        {/* Whiteboard — mounted on the back wall, above and behind the desk */}
        <Whiteboard position={[0.5, 2.6, -2.92]} />

        {/* Room window — on the back wall, left section */}
        <RoomWindow position={[-2.8, 2.2, -2.92]} />

        {/* Sticky notes — world-space group origin; note positions inside */}
        <StickyNotes position={[0, 0, 0]} />
      </group>
    </>
  );
}
