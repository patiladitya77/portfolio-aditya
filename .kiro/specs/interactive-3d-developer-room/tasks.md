# Implementation Plan: Interactive 3D Developer Room

## Overview

Build the Interactive 3D Developer Room on top of the existing Next.js 15 portfolio. The implementation proceeds bottom-up: dependencies → state → camera → objects → scene → overlays → panels → integration → page refactor → tests → optimizations. Each task is self-contained and builds directly on the previous one.

## Tasks

- [x] 1. Install dependencies
  - Run `npm install @react-three/fiber @react-three/drei three gsap zustand fast-check`
  - Run `npm install --save-dev @types/three jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom ts-jest`
  - Verify TypeScript recognizes `three` types (`@types/three`)
  - _Requirements: 15.1_

- [x] 2. Core state and hooks
  - [x] 2.1 Implement `useRoomStore.ts` (Zustand store)
    - Define `FocusTarget` union type and `CameraPreset` interface
    - Implement `RoomStore` with `focusTarget`, `isAnimating`, `setFocus`, `clearFocus`, `setAnimating`
    - `setFocus` must be a no-op when `isAnimating === true`
    - Export `FOCUS_TARGETS` array (all valid `FocusTarget` string values)
    - _Requirements: 3.3, 10.3, 15.4_

  - [x] 2.2 Write unit tests for `useRoomStore`
    - File: `src/app/components/3d/__tests__/useRoomStore.test.ts`
    - Test `setFocus` sets `focusTarget`; test `clearFocus` resets to null; test `setAnimating` sets flag; test that `setFocus` is blocked when `isAnimating === true`
    - _Requirements: 3.3, 10.3_

  - [x] 2.3 Implement `useMediaQuery.ts`
    - SSR-safe hook: returns `false` on the server (no `window`), reads `window.innerWidth` on the client
    - Accepts a `breakpoint: number` parameter; returns `true` when `window.innerWidth >= breakpoint`
    - Export a pure helper `isMobileViewport(width: number): boolean` (returns `true` when `width < 768`)
    - _Requirements: 12.1, 12.2_

  - [x] 2.4 Write unit tests for `useMediaQuery`
    - File: `src/app/components/3d/__tests__/useMediaQuery.test.ts`
    - Test boundary values: 767 px → `false`, 768 px → `true`, 769 px → `true`
    - _Requirements: 12.1_

- [x] 3. Camera presets and CameraController
  - [x] 3.1 Implement `CameraController.tsx`
    - Define and export `CAMERA_PRESETS` record covering all `FocusTarget` values plus `"overview"`
    - On `focusTarget` change, fire `gsap.to(camera.position, { x, y, z, duration: 1.2, ease: "power2.inOut", onStart: setAnimating(true), onComplete: setAnimating(false) })`
    - Simultaneously tween a `lookAtTarget` Vector3 and call `camera.lookAt(lookAtTarget)` in `onUpdate`
    - On `focusTarget === null`, tween back to `CAMERA_PRESETS.overview`
    - Kill any in-flight tween in a `useEffect` cleanup to prevent stale state
    - Use `useThree` to access the R3F camera
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 10.2_

- [x] 4. Base InteractiveObject component
  - [x] 4.1 Implement `InteractiveObject.tsx`
    - Accept props: `focusKey`, `children`, `position`, `rotation`, `scale`, `hoverColor`, `hoverScale`, `onHoverEnter`, `onHoverLeave`
    - Track `hovered` state via `onPointerEnter` / `onPointerLeave`
    - Set `document.body.style.cursor` to `"pointer"` on enter, `"default"` on leave
    - Call `store.setFocus(focusKey)` on click only when `!isAnimating`
    - Expose `hovered` to children via a React context (`InteractiveObjectContext`)
    - Apply `hoverScale` as a uniform scale multiplier on the group when hovered
    - _Requirements: 2.1, 2.2, 2.5, 2.6, 3.3, 15.3_

- [-] 5. Room objects
  - [x] 5.1 Implement `Desk.tsx`
    - Non-interactive; built entirely from `BoxGeometry` primitives
    - Includes desktop surface, four legs, and a drawer block
    - Accept `position?: [number, number, number]` prop
    - _Requirements: 1.1_

  - [x] 5.2 Implement `Laptop.tsx`
    - Wrap in `<InteractiveObject focusKey="laptop">`
    - Lid + base from `BoxGeometry`; screen mesh gets `emissiveIntensity` 0 at rest, blue glow (`#00aaff`) on hover
    - Expose screen power-on animation: tween `emissiveIntensity` 0 → 1 when `focusTarget === "laptop"` via `useEffect` watching store
    - _Requirements: 2.4, 4.1, 4.2_

  - [x] 5.3 Implement `Bookshelf.tsx`
    - Wrap in `<InteractiveObject focusKey="bookshelf">`
    - Frame from `BoxGeometry`; populate with ~8 book meshes of varying heights and colors
    - On hover, tween individual books 0.05–0.15 units outward along their local Z axis using GSAP
    - On hover leave, tween books back to resting position
    - _Requirements: 2.3, 5.1_

  - [x] 5.4 Implement `Monitor.tsx`
    - Wrap in `<InteractiveObject focusKey="monitor">`
    - Screen + stand + base from `BoxGeometry`; subtle emissive glow on hover
    - _Requirements: 9.2, 9.4_

  - [x] 5.5 Implement `Whiteboard.tsx`
    - Wrap in `<InteractiveObject focusKey="whiteboard">`
    - Board surface + frame from `BoxGeometry`; faint grid lines drawn with `LineSegments`
    - _Requirements: 6.1_

  - [x] 5.6 Implement `RoomWindow.tsx`
    - Wrap in `<InteractiveObject focusKey="window">`
    - Window frame from `BoxGeometry`; glass pane as a semi-transparent `MeshStandardMaterial` with `transparent: true`
    - _Requirements: 7.1_

  - [x] 5.7 Implement `Smartphone.tsx`
    - Wrap in `<InteractiveObject focusKey="smartphone">`
    - Body + screen from `BoxGeometry`; screen emissive glow on hover
    - On focus (`focusTarget === "smartphone"`), play unlock animation: tween screen `emissiveIntensity` 0 → 1
    - _Requirements: 8.1, 8.2_

  - [x] 5.8 Implement `CoffeeMug.tsx`
    - Wrap in `<InteractiveObject focusKey="coffee">`
    - Mug body from `CylinderGeometry`; handle from a torus segment
    - Subtle scale glow on hover consistent with other objects
    - _Requirements: 9.1, 9.4_

  - [x] 5.9 Implement `StickyNotes.tsx`
    - Renders 2–3 sticky note meshes (`PlaneGeometry`) at distinct positions on desk/wall
    - Each note wraps its own `<InteractiveObject focusKey="sticky">`
    - Subtle scale on hover
    - _Requirements: 9.3, 9.4_

- [x] 6. Scene assembly
  - [x] 6.1 Implement `RoomScene.tsx`
    - Mount `<CameraController />`
    - Add lights: `AmbientLight` (warm, low intensity), `PointLight` (desk lamp, warm), `SpotLight` (ceiling, cool/purple accent)
    - Place `<Desk />`, `<Laptop />`, `<Monitor />`, `<Bookshelf />`, `<Whiteboard />`, `<RoomWindow />`, `<Smartphone />`, `<CoffeeMug />`, `<StickyNotes />` at their world positions
    - _Requirements: 1.1, 1.5, 1.6, 1.7_

- [x] 7. UI overlays
  - [x] 7.1 Implement `LoadingScreen.tsx`
    - Full-screen DOM overlay rendered as the `<Suspense>` fallback inside `RoomView`
    - Shows a spinner/progress text; on Suspense resolution, fades out in ≤ 600 ms via framer-motion `AnimatePresence`
    - _Requirements: 1.2, 1.3_

  - [x] 7.2 Implement `HintOverlay.tsx`
    - On mount, check `sessionStorage.getItem('hint-dismissed')`; if set, render nothing
    - Otherwise render overlay with instruction text: "Click objects in the room to explore"
    - Dismiss on click anywhere in the scene or after 5-second timeout; on dismiss, write `sessionStorage.setItem('hint-dismissed', 'true')` and fade out in 400 ms
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [x] 7.3 Write unit tests for `HintOverlay`
    - File: `src/app/components/3d/__tests__/HintOverlay.test.tsx`
    - Test renders on first mount; test does NOT render when `sessionStorage` flag is set; test writes flag on dismiss
    - _Requirements: 11.3, 11.4_

  - [x] 7.4 Implement `BackButton.tsx`
    - Renders a DOM button overlay (positioned fixed, top-left or similar)
    - Visible only when `focusTarget !== null` (read from store)
    - On click, calls `store.clearFocus()`
    - Registers `keydown` listener for `Escape` key that also calls `store.clearFocus()`
    - _Requirements: 10.1, 10.2, 10.4_

  - [x] 7.5 Write unit tests for `BackButton`
    - File: `src/app/components/3d/__tests__/BackButton.test.tsx`
    - Test visible when `focusTarget !== null`; hidden when null; calls `clearFocus` on click; calls `clearFocus` on Escape keydown
    - _Requirements: 10.1, 10.4_

- [x] 8. Content panels
  - [x] 8.1 Implement `ContentPanelHost.tsx`
    - Rendered as a DOM overlay outside the Canvas (inside `RoomView`)
    - Reads `focusTarget` and `isAnimating` from store
    - Renders the matching panel only after `isAnimating === false`; renders nothing when `focusTarget === null`
    - Wraps panel render in framer-motion `AnimatePresence` for fade-in/fade-out
    - Each panel root element has `data-panel={focusKey}` attribute for testability
    - Define `PANEL_MAP` mapping all `FocusTarget` values to their panel components
    - _Requirements: 3.4, 15.1_

  - [x] 8.2 Write unit tests for `ContentPanelHost`
    - File: `src/app/components/3d/__tests__/ContentPanelHost.test.tsx`
    - Test renders correct panel for each `FocusTarget`; renders nothing when `focusTarget === null`; renders nothing while `isAnimating === true`
    - _Requirements: 3.4_

  - [x] 8.3 Implement `ProjectsPanel.tsx`
    - Fetches `/api/projects` in `useEffect`; renders loading/error/data states
    - Each project renders a card with: title, description, tech stack badges, GitHub link, Live Demo link
    - Cards use `data-testid="project-card"` for testability
    - Staggered entrance animation: 150 ms delay between cards using framer-motion
    - _Requirements: 4.3, 4.4, 4.5, 14.4_

  - [x] 8.4 Implement `ExperiencePanel.tsx`
    - Fetches `/api/experiences` in `useEffect`; renders loading/error/data states
    - Vertical timeline; each entry: role, company, date range, description list
    - SVG path drawing entrance animation completing within 2000 ms
    - _Requirements: 6.2, 6.3, 6.4_

  - [x] 8.5 Implement `SkillsPanel.tsx`
    - Static data from `SKILL_CATEGORIES` constant defined in the component
    - Groups: Frontend, Backend, Databases, DevOps, AI/ML, Tools
    - Skill items animate into a grid with staggered entrance (framer-motion)
    - _Requirements: 5.2, 5.3, 5.4_

  - [x] 8.6 Implement `AboutPanel.tsx`
    - Static content: full name, education status, professional introduction, career goals, interests
    - _Requirements: 7.2, 7.3_

  - [x] 8.7 Implement `ContactPanel.tsx`
    - Manages `ContactFormState`: `{ name, email, message, errors, submitted }`
    - Extract and export a pure `validateContactForm(fields)` function for testability
    - Display: email address, GitHub link, LinkedIn link, resume download button, contact form
    - On valid submit: show confirmation; on invalid submit: show inline per-field errors without clearing other fields
    - Staggered entrance animation for contact icons (100 ms delay)
    - _Requirements: 8.3, 8.4, 8.5, 8.6_

  - [x] 8.8 Write unit tests for `ContactPanel`
    - File: `src/app/components/3d/__tests__/ContactPanel.test.tsx`
    - Test valid submit shows confirmation; test missing fields show per-field errors; test other field values preserved on invalid submit
    - _Requirements: 8.4, 8.5_

  - [x] 8.9 Implement `MonitorPanel.tsx`
    - Static/mocked GitHub contribution stats and tech activity data
    - _Requirements: 9.2_

- [x] 9. Checkpoint — wire overlays into RoomView
  - [x] 9.1 Implement `RoomView.tsx`
    - Full-screen wrapper; renders `<Canvas frameloop="demand">` containing `<Suspense fallback={<LoadingScreen />}><RoomScene /></Suspense>`
    - Outside the Canvas: `<HintOverlay />`, `<BackButton />`, `<ContentPanelHost />`
    - Canvas `camera` prop: `{ fov: 60, position: [0, 4, 10] }`
    - _Requirements: 1.4, 1.6, 1.7, 13.3_
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. MobileView and page.tsx refactor
  - [x] 10.1 Implement `MobileView.tsx`
    - Import and render existing section components in order: `<Navbar />`, `<Hero />`, About section, `<SkillsSection />`, `<ExperienceSection />`, Projects section with `<ProjectCard />`, `<EducationSection />`, `<ContactSection />`
    - Fetches `/api/projects` and `/api/experiences` client-side via `useEffect`
    - _Requirements: 12.2, 12.3, 12.4, 14.4_

  - [x] 10.2 Refactor `src/app/page.tsx` to client component
    - Add `"use client"` directive
    - Remove `async getData()` and all direct DB imports (`connectDB`, `Project`, `ExperienceModel`)
    - Use `useMediaQuery(768)` to gate rendering: `< 768` → `<MobileView />`, `≥ 768` → `<RoomView />`
    - _Requirements: 12.1, 12.2, 14.1_

- [ ] 11. Unit test suite completion
  - [ ] 11.1 Write unit tests for `CameraController`
    - File: `src/app/components/3d/__tests__/CameraController.test.ts`
    - Test `CAMERA_PRESETS` contains entries for all `FocusTarget` values plus `"overview"`
    - _Requirements: 3.1, 3.2_

  - [ ] 11.2 Write unit tests for `ProjectsPanel`
    - File: `src/app/components/3d/__tests__/panels/ProjectsPanel.test.tsx`
    - Test renders a card for each project; test renders loading state; test renders error fallback on fetch failure
    - _Requirements: 4.3, 4.4_

  - [ ] 11.3 Write unit tests for `ExperiencePanel`
    - File: `src/app/components/3d/__tests__/panels/ExperiencePanel.test.tsx`
    - Test renders a timeline entry for each experience with role, company, date range, and description
    - _Requirements: 6.2, 6.3_

- [ ] 12. Property-based test suite
  - [ ] 12.1 Write PBT file `roomStore.pbt.test.ts` — Properties 1, 2, 4
    - File: `src/app/components/3d/__tests__/pbt/roomStore.pbt.test.ts`
    - **Property 1: Click produces deterministic FocusState** — `fc.constantFrom(...FOCUS_TARGETS)` × prior state → `store.setFocus(target)` → `focusTarget === target`
    - **Validates: Requirements 3.1, 4.1, 5.1, 6.1, 7.1, 8.1**
    - **Property 2: Animation lock prevents concurrent focus transitions** — set focus, set animating true, attempt second focus → `focusTarget` unchanged
    - **Validates: Requirements 3.3**
    - **Property 4: Back navigation always clears FocusState** — `fc.constantFrom(...FOCUS_TARGETS)` → `store.clearFocus()` → `focusTarget === null`
    - **Validates: Requirements 10.2, 10.3, 10.4**
    - Each property runs minimum 100 iterations with the tag comment `// Feature: interactive-3d-developer-room, Property N: <text>`

  - [ ] 12.2 Write PBT file `contentPanels.pbt.test.tsx` — Properties 3, 5, 9
    - File: `src/app/components/3d/__tests__/pbt/contentPanels.pbt.test.tsx`
    - **Property 3: FocusTarget maps to exactly one ContentPanel** — any `FocusTarget` → render `<ContentPanelHost>` → `[data-panel]` count === 1
    - **Validates: Requirements 3.4, 4.3, 5.2, 6.2**
    - **Property 5: BackButton renders iff FocusState is active** — `fc.option(fc.constantFrom(...FOCUS_TARGETS), { nil: null })` → button presence matches `target !== null`
    - **Validates: Requirements 10.1**
    - **Property 9: ContentPanel renders all required fields for every data item** — `fc.array(projectRecord, { minLength: 1 })` → render `<ProjectsPanel>` → card count === projects.length
    - **Validates: Requirements 4.3, 4.4, 6.2, 6.3**

  - [ ] 12.3 Write PBT file `contactForm.pbt.test.ts` — Properties 6, 7
    - File: `src/app/components/3d/__tests__/pbt/contactForm.pbt.test.ts`
    - **Property 6: Valid contact form submission produces success state** — `fc.string({ minLength: 1 }).filter(s => s.trim().length > 0)` × `fc.emailAddress()` × message → `validateContactForm` → `valid === true`, `errors` empty
    - **Validates: Requirements 8.4**
    - **Property 7: Invalid form preserves other field values** — record where at least one field is blank → `validateContactForm` → non-empty fields have no error
    - **Validates: Requirements 8.5**

  - [ ] 12.4 Write PBT file `mobileDetection.pbt.test.ts` — Property 8
    - File: `src/app/components/3d/__tests__/pbt/mobileDetection.pbt.test.ts`
    - **Property 8: Mobile viewport gates 3D rendering** — `fc.integer({ min: 320, max: 767 })` → `isMobileViewport(width) === true`
    - **Validates: Requirements 12.1, 12.2, 12.3**

  - [ ] 12.5 Write PBT file `hintOverlay.pbt.test.ts` — Property 10
    - File: `src/app/components/3d/__tests__/pbt/hintOverlay.pbt.test.ts`
    - **Property 10: HintOverlay dismissal persists to sessionStorage** — `fc.boolean()` (dismiss path) → `store.dismiss()` → `sessionStorage.getItem('hint-dismissed') === 'true'`
    - **Validates: Requirements 11.3, 11.4**

  - [ ] 12.6 Write PBT file `frameloop.pbt.test.ts` — Property 11
    - File: `src/app/components/3d/__tests__/pbt/frameloop.pbt.test.ts`
    - **Property 11: Page visibility change pauses and resumes render loop** — `fc.array(fc.constantFrom('hidden', 'visible'), { minLength: 2, maxLength: 10 })` → final event determines `controller.isRunning()`
    - **Validates: Requirements 13.4, 13.5**

  - [ ] 12.7 Write PBT file `cursor.pbt.test.ts` — Property 12
    - File: `src/app/components/3d/__tests__/pbt/cursor.pbt.test.ts`
    - **Property 12: Cursor reflects InteractiveObject hover state** — `fc.boolean()` (isHovered) → `getCursorForHoverState(isHovered)` → `"pointer"` iff `true`, `"default"` iff `false`
    - **Validates: Requirements 2.5, 2.6**

- [ ] 13. Performance optimizations
  - [ ] 13.1 Add Page Visibility API handler in `RoomView.tsx`
    - In a `useEffect`, listen for `document.visibilitychange`
    - On `hidden`: call R3F `invalidate` pause (set `frameloop` to `"never"` via `useThree` store or equivalent)
    - On `visible`: resume (`frameloop` back to `"demand"`, call `invalidate()`)
    - Extract the handler logic into a testable `createFrameloopController` factory function
    - _Requirements: 13.4, 13.5_

  - [ ] 13.2 Add geometry instancing for StickyNotes
    - Replace individual `PlaneGeometry` meshes in `StickyNotes.tsx` with `InstancedMesh` sharing a single geometry and material
    - Set distinct instance matrix per note via `instanceMatrix`
    - _Requirements: 13.2_

  - [ ] 13.3 Verify frustum culling is active
    - Confirm no objects set `frustumCulled={false}` unless intentional
    - Add a comment in `RoomScene.tsx` confirming Three.js default frustum culling is relied upon
    - _Requirements: 13.3_

- [ ] 14. Final checkpoint
  - Ensure all unit tests and PBT tests pass (`npx jest --testPathPattern="3d" --runInBand`)
  - Ensure TypeScript reports no errors in `src/app/components/3d/` (`npx tsc --noEmit`)
  - Ask the user if questions arise before marking complete.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP. No tasks here are marked optional — PBT is required per the design.
- Tasks 12.1–12.7 each reference the exact property number and requirements clause from the design document.
- The `validateContactForm` pure function (task 8.7) must be exported from `ContactPanel.tsx` so PBT tasks 12.3 can import it directly without rendering the component.
- The `isMobileViewport` helper (task 2.3) must be exported from `useMediaQuery.ts` for PBT task 12.4.
- The `createFrameloopController` factory (task 13.1) must be exported for PBT task 12.6.
- `data-panel` and `data-testid` attributes referenced in tests must be added during implementation of their respective components.
