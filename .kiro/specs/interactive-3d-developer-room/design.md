# Design Document: Interactive 3D Developer Room

## Overview

This design transforms the existing Next.js 15 portfolio into an immersive Interactive 3D Developer Room. The root page becomes a client component that detects viewport width: on desktop (≥ 768 px) it renders a React Three Fiber canvas scene (`RoomView`); on mobile (< 768 px) it renders the existing `MobileView` layout. All existing API routes, admin panel, and MongoDB models remain completely untouched.

The 3D scene is a developer's workspace built entirely from procedural Three.js geometry (no GLTF files). Visitors click physical objects in the room — a Laptop, Bookshelf, Whiteboard, RoomWindow, Smartphone, etc. — and the camera animates to a predefined focus position, then reveals a 2D HTML content panel as an overlay. A back button or the Escape key returns the camera to the room overview.

### Key Design Decisions

- **Procedural geometry only**: No GLTF assets required, eliminating asset pipeline complexity and keeping initial bundle lean.
- **`frameloop="demand"`**: R3F only renders a frame when state changes (pointer events, camera animation ticks), conserving GPU on idle.
- **Zustand for FocusState**: Lightweight global store shared between the 3D canvas (R3F) and the 2D overlay DOM (ContentPanels).
- **GSAP for camera**: Smooth ease-in-out tweens with a completion callback that unlocks interaction; decoupled from React's render cycle.
- **HTML overlay for ContentPanels**: `@react-three/drei`'s `<Html>` component renders ContentPanels inside the canvas coordinate space as a DOM portal, simplifying z-index and positioning.
- **Page stays a Server Component facade**: `page.tsx` is replaced by a thin client wrapper that gates on viewport; no server-side DB fetch is removed (the mobile path still shows data fetched client-side for parity).

---

## Architecture

```
src/app/page.tsx  (thin client wrapper — "use client")
├── useMediaQuery(768)
├── <MobileView />   (viewport < 768px)  — renders existing 2D sections
└── <RoomView />     (viewport ≥ 768px)  — full 3D experience
    ├── <LoadingScreen />               DOM overlay, Suspense fallback
    ├── <HintOverlay />                 DOM overlay, session-storage gated
    ├── <BackButton />                  DOM overlay, visible when FocusState ≠ null
    ├── <ContentPanelHost />            DOM overlay, renders active ContentPanel
    └── <Canvas>                        @react-three/fiber
        └── <RoomScene />
            ├── <CameraController />    GSAP tween driver, reads from store
            ├── Lights                  AmbientLight, PointLight, SpotLight
            ├── <Desk />
            ├── <Laptop />              InteractiveObject
            ├── <Monitor />             InteractiveObject
            ├── <Bookshelf />           InteractiveObject
            ├── <Whiteboard />          InteractiveObject
            ├── <RoomWindow />          InteractiveObject
            ├── <Smartphone />          InteractiveObject
            ├── <CoffeeMug />           InteractiveObject
            └── <StickyNotes />         InteractiveObject (multiple)
```

### Data Flow

```
API Layer (unchanged)
  GET /api/projects       ──►  ProjectsPanel (fetched client-side via useEffect)
  GET /api/experiences    ──►  ExperiencePanel (fetched client-side via useEffect)

useRoomStore (Zustand)
  focusTarget: FocusTarget | null
  isAnimating: boolean
  ─────────────────────────────────────────
  RoomScene reads isAnimating → gates click handlers
  CameraController reads focusTarget → triggers GSAP tween
  ContentPanelHost reads focusTarget → renders correct panel
  BackButton reads focusTarget → shows/hides itself
```

### Integration with Existing App

`src/app/page.tsx` currently is a React Server Component that fetches DB data directly. It must become a `"use client"` component. The DB fetch is removed from `page.tsx`; instead, each ContentPanel fetches its own data client-side from the existing API routes. The existing 2D components (`Hero`, `SkillsSection`, `ExperienceSection`, `ProjectCard`, `ContactSection`, `EducationSection`) are wrapped in `MobileView` unchanged.

---

## Directory Structure

```
src/app/components/3d/
├── RoomView.tsx              — top-level 3D entry, Canvas + overlays
├── RoomScene.tsx             — all 3D objects, lights, camera
├── CameraController.tsx      — GSAP-driven camera tween component
├── LoadingScreen.tsx         — Suspense fallback overlay
├── HintOverlay.tsx           — first-visit instruction overlay
├── BackButton.tsx            — DOM overlay back/escape button
├── MobileView.tsx            — wraps existing 2D sections
├── hooks/
│   ├── useRoomStore.ts       — Zustand store for FocusState
│   └── useMediaQuery.ts      — SSR-safe viewport width hook
├── objects/
│   ├── InteractiveObject.tsx — base wrapper for clickable 3D objects
│   ├── Desk.tsx
│   ├── Laptop.tsx
│   ├── Monitor.tsx
│   ├── Bookshelf.tsx
│   ├── Whiteboard.tsx
│   ├── RoomWindow.tsx
│   ├── Smartphone.tsx
│   ├── CoffeeMug.tsx
│   └── StickyNotes.tsx
└── panels/
    ├── ContentPanelHost.tsx  — routes focusTarget → correct panel
    ├── ProjectsPanel.tsx
    ├── SkillsPanel.tsx
    ├── ExperiencePanel.tsx
    ├── AboutPanel.tsx
    ├── ContactPanel.tsx
    └── MonitorPanel.tsx
```

---

## Components and Interfaces

### Types (`src/app/components/3d/hooks/useRoomStore.ts`)

```typescript
export type FocusTarget =
  | "laptop"
  | "bookshelf"
  | "whiteboard"
  | "window"
  | "smartphone"
  | "monitor"
  | "coffee"
  | "sticky";

export interface CameraPreset {
  position: [number, number, number];
  lookAt: [number, number, number];
}

export interface RoomStore {
  focusTarget: FocusTarget | null;
  isAnimating: boolean;
  setFocus: (target: FocusTarget) => void;
  clearFocus: () => void;
  setAnimating: (v: boolean) => void;
}
```

### Camera Presets (`src/app/components/3d/CameraController.tsx`)

```typescript
export const CAMERA_PRESETS: Record<FocusTarget | "overview", CameraPreset> = {
  overview: { position: [0, 4, 10], lookAt: [0, 1, 0] },
  laptop: { position: [0, 2.5, 3], lookAt: [0, 1.5, 0] },
  bookshelf: { position: [-4, 2, 4], lookAt: [-4, 2, 0] },
  whiteboard: { position: [0, 2.5, -1], lookAt: [0, 2.5, -5] },
  window: { position: [4, 3, 2], lookAt: [4, 2, -3] },
  smartphone: { position: [1.5, 1.8, 3], lookAt: [1.5, 1.5, 0] },
  monitor: { position: [-1, 2.5, 3], lookAt: [-1, 2, 0] },
  coffee: { position: [0.5, 1.8, 3], lookAt: [0.5, 1.5, 0] },
  sticky: { position: [2, 3, 2], lookAt: [2, 2.5, -1] },
};
```

### InteractiveObject (`src/app/components/3d/objects/InteractiveObject.tsx`)

```typescript
interface InteractiveObjectProps {
  focusKey: FocusTarget;
  children: React.ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  hoverColor?: string; // emissive color on hover
  hoverScale?: number; // uniform scale multiplier on hover
  onHoverEnter?: () => void; // additional hover callback (e.g. book animation)
  onHoverLeave?: () => void;
}
```

The component:

1. Tracks `hovered` state via `onPointerEnter` / `onPointerLeave`
2. Sets `document.body.style.cursor` to `"pointer"` / `"default"`
3. Calls `store.setFocus(focusKey)` on click if `!isAnimating`
4. Passes `hovered` down to children via React context or direct props for material overrides

### CameraController (`src/app/components/3d/CameraController.tsx`)

```typescript
interface CameraControllerProps {
  // No external props — reads directly from useRoomStore
}
```

Internals:

- `useFrame` is NOT used; GSAP drives the camera directly via `camera.position` and a custom `lookAt` target object
- On `focusTarget` change, fires `gsap.to(camera.position, { x, y, z, duration: 1.2, ease: "power2.inOut", onStart: () => setAnimating(true), onComplete: () => setAnimating(false) })`
- Simultaneously tweens a `lookAtTarget` vector and calls `camera.lookAt(lookAtTarget)` in the GSAP `onUpdate`
- On `focusTarget === null`, tweens back to `CAMERA_PRESETS.overview`
- Uses `useThree` to access the R3F camera instance

### ContentPanelHost (`src/app/components/3d/panels/ContentPanelHost.tsx`)

```typescript
// Rendered outside the Canvas as a DOM overlay
// Reads focusTarget from store and renders the appropriate panel
const PANEL_MAP: Record<FocusTarget, React.ComponentType> = {
  laptop: ProjectsPanel,
  bookshelf: SkillsPanel,
  whiteboard: ExperiencePanel,
  window: AboutPanel,
  smartphone: ContactPanel,
  monitor: MonitorPanel,
  coffee: CoffeePanel, // inline tooltip/mini-panel
  sticky: StickyPanel, // inline tooltip
};
```

The host renders the panel only after `isAnimating` becomes `false` (camera has arrived), ensuring the content fades in after the cinematic transition. Uses `framer-motion`'s `AnimatePresence` for enter/exit fade.

### Individual Object Props Pattern

All room objects follow this structure:

```typescript
interface DeskProps {
  position?: [number, number, number];
}
// Built from BoxGeometry primitives, no external assets
// Desk is non-interactive (no focusKey)

interface LaptopProps {
  position?: [number, number, number];
  hovered?: boolean; // passed from InteractiveObject context
}
// Screen mesh gets emissive blue (#00aaff) on hover
// Screen power-on animation: emissiveIntensity tweened 0→1 on focus
```

### Panel Props Pattern

```typescript
// ProjectsPanel — self-fetching
interface ProjectsPanel {} // no props; fetches /api/projects internally

// ExperiencePanel — self-fetching
interface ExperiencePanel {} // no props; fetches /api/experiences internally

// SkillsPanel — static data
interface SkillsPanel {} // no props; uses static skills config

// AboutPanel — static data
interface AboutPanel {} // no props; static content

// ContactPanel — stateful form
interface ContactPanel {} // manages form state internally

// MonitorPanel — static/mocked GitHub stats
interface MonitorPanel {} // no props; displays static activity data
```

---

## Data Models

No new data models are introduced. The feature reuses:

```typescript
// From /api/projects response
interface ProjectDTO {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  live?: string;
  thumbnail: string;
}

// From /api/experiences response
interface ExperienceDTO {
  _id: string;
  role: string;
  company: string;
  workLocation: string;
  startDate: string; // "YYYY-MM" format
  endDate: string | null;
  description: string[];
  isCurrent: boolean;
  skills: string[];
}
```

The ContactPanel manages local form state only:

```typescript
interface ContactFormState {
  name: string;
  email: string;
  message: string;
  errors: Partial<Record<"name" | "email" | "message", string>>;
  submitted: boolean;
}
```

Skills data is static inside `SkillsPanel`:

```typescript
interface SkillCategory {
  label: string;
  skills: string[];
}
const SKILL_CATEGORIES: SkillCategory[] = [
  {
    label: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  { label: "Backend", skills: ["Node.js", "Express", "Spring Boot"] },
  { label: "Databases", skills: ["MongoDB", "PostgreSQL"] },
  { label: "DevOps", skills: ["Docker", "AWS", "Terraform"] },
  { label: "AI/ML", skills: ["LangChain", "OpenAI API"] },
  { label: "Tools", skills: ["Git", "Postman", "Figma"] },
];
```

---

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Click produces deterministic FocusState

_For any_ InteractiveObject with a known `focusKey`, clicking it (when `isAnimating` is false) shall always produce exactly that `focusKey` as the new `focusTarget` in the store, regardless of prior state.

**Validates: Requirements 3.1, 4.1, 5.1, 6.1, 7.1, 8.1**

### Property 2: Animation lock prevents concurrent focus transitions

_For any_ sequence of clicks where the first click sets `isAnimating = true`, all subsequent clicks shall be no-ops (i.e., `focusTarget` in the store shall not change) until `isAnimating` returns to `false`.

**Validates: Requirements 3.3**

### Property 3: FocusTarget maps to exactly one ContentPanel

_For any_ non-null `focusTarget` value in the store, the `ContentPanelHost` shall render exactly one matching panel component and zero panels for all other target keys.

**Validates: Requirements 3.4, 4.3, 5.2, 6.2**

### Property 4: Back navigation always clears FocusState

_For any_ non-null `focusTarget`, calling `clearFocus()` (triggered by BackButton click or Escape key) shall always set `focusTarget` to `null` and `isAnimating` to `false` after the tween completes.

**Validates: Requirements 10.2, 10.3, 10.4**

### Property 5: BackButton renders iff FocusState is active

_For any_ store state, the BackButton is visible in the DOM if and only if `focusTarget !== null`.

**Validates: Requirements 10.1**

### Property 6: Contact form valid submission produces success state

_For any_ form state where `name`, `email`, and `message` are all non-empty non-whitespace strings, calling the submit handler shall set `submitted = true` and `errors` shall be empty.

**Validates: Requirements 8.4**

### Property 7: Contact form invalid submission preserves other field values

_For any_ form state where at least one required field is empty/whitespace, calling the submit handler shall set a non-empty error for each missing field, and the values of all other (non-missing) fields shall remain unchanged.

**Validates: Requirements 8.5**

### Property 8: Mobile viewport gates 3D rendering

_For any_ viewport width below 768 px, `useMediaQuery(768)` returns `false`, and `RoomView` renders `MobileView` (containing all 2D section components) rather than the R3F Canvas.

**Validates: Requirements 12.1, 12.2, 12.3**

### Property 9: ContentPanel renders all required fields for every data item

_For any_ array of `ProjectDTO` values, `ProjectsPanel` renders a card for each item containing the project title, description, at least one technology badge, and (when present) GitHub and Live links. Similarly, for any array of `ExperienceDTO` values, `ExperiencePanel` renders a timeline entry containing role, company, date range, and description for each item.

**Validates: Requirements 4.3, 4.4, 6.2, 6.3**

### Property 10: HintOverlay dismissed state persists in sessionStorage

_For any_ dismissal event (click or timeout), the HintOverlay component shall write a flag to `sessionStorage`, and on subsequent mounts within the same session, the component shall read that flag and not render the overlay.

**Validates: Requirements 11.3, 11.4**

### Property 11: Page visibility change pauses and resumes render loop

_For any_ sequence of `visibilitychange` events, transitioning to `hidden` shall invalidate/pause the R3F render loop, and transitioning back to `visible` shall resume it — such that the render state after a hide-then-show cycle is equivalent to continuous visibility.

**Validates: Requirements 13.4, 13.5**

### Property 12: Cursor reflects InteractiveObject hover state

_For any_ InteractiveObject, when a pointer enter event fires, `document.body.style.cursor` shall be `"pointer"`, and when the corresponding pointer leave event fires, it shall be `"default"`.

**Validates: Requirements 2.5, 2.6**

---

## Error Handling

### Data Fetching Failures

- `ProjectsPanel` and `ExperiencePanel` each maintain a `{ data, loading, error }` local state via `useEffect + fetch`.
- On fetch error, the panel displays a neutral fallback message ("Couldn't load projects — please try again.") rather than crashing.
- No retry logic is required; a manual re-open (back → re-click) suffices.

### R3F / WebGL Unavailable

- Wrap `<Canvas>` in an error boundary that catches WebGL context creation failures.
- On error, fall back to `<MobileView />` with an optional banner ("3D not supported on this device").

### Contact Form Submission

- The contact form in `ContactPanel` is a purely client-side form (mailto link or a future API call).
- Validation runs before submission; the submit handler never fires with invalid state.
- If a future email API call fails, display an inline error without clearing the form fields.

### GSAP / Camera Errors

- If a GSAP tween is interrupted (component unmount), it is killed via `tween.kill()` in a `useEffect` cleanup to prevent stale camera state.
- The `isAnimating` flag is reset to `false` in the tween's `onComplete` and in the cleanup to avoid permanent lock.

---

## Testing Strategy

### Dual Testing Approach

Both unit tests and property-based tests are required. Unit tests validate specific examples and integration points; property-based tests validate universal correctness across all inputs.

### Unit Tests (Jest + React Testing Library)

Focus areas:

- `useRoomStore`: `setFocus`, `clearFocus`, `setAnimating` produce expected state transitions.
- `ContentPanelHost`: renders the correct panel for each `FocusTarget` value; renders nothing when `focusTarget` is null.
- `BackButton`: visible when `focusTarget !== null`; hidden when null; calls `clearFocus` on click.
- `HintOverlay`: renders on first mount; does not render if `sessionStorage` flag is set.
- `useMediaQuery`: returns correct boolean at boundary values (767 px → false, 768 px → true, 769 px → true).
- `ContactPanel` form validation: missing fields produce errors; valid fields produce success.
- Camera presets: `CAMERA_PRESETS` contains entries for all `FocusTarget` values plus `"overview"`.

Unit tests should NOT be written for every visual/animation detail. Keep unit test count proportional — focus on pure logic, state management, and rendering correctness.

### Property-Based Tests (fast-check)

Use [`fast-check`](https://github.com/dubzzz/fast-check) for TypeScript property-based testing.

Each property test must run a minimum of **100 iterations** and be tagged with the following comment format:

```
// Feature: interactive-3d-developer-room, Property N: <property text>
```

#### Property Test Implementations

**P1 — Click produces deterministic FocusState**

```
// Feature: interactive-3d-developer-room, Property 1: click produces deterministic FocusState
fc.assert(fc.property(
  fc.constantFrom(...FOCUS_TARGETS),           // arbitrary FocusTarget
  fc.constantFrom(...FOCUS_TARGETS, null),     // arbitrary prior state
  (target, priorTarget) => {
    const store = createStore({ focusTarget: priorTarget, isAnimating: false });
    store.setFocus(target);
    return store.getState().focusTarget === target;
  }
), { numRuns: 100 });
```

**P2 — Animation lock prevents concurrent focus transitions**

```
// Feature: interactive-3d-developer-room, Property 2: animation lock prevents concurrent transitions
fc.assert(fc.property(
  fc.constantFrom(...FOCUS_TARGETS),
  fc.constantFrom(...FOCUS_TARGETS),
  (first, second) => {
    const store = createStore({ focusTarget: null, isAnimating: false });
    store.setFocus(first);
    store.setAnimating(true);
    const lockedTarget = store.getState().focusTarget;
    store.setFocus(second);   // should be blocked
    return store.getState().focusTarget === lockedTarget;
  }
), { numRuns: 100 });
```

**P3 — FocusTarget maps to exactly one ContentPanel**

```
// Feature: interactive-3d-developer-room, Property 3: FocusTarget maps to exactly one ContentPanel
fc.assert(fc.property(
  fc.constantFrom(...FOCUS_TARGETS),
  (target) => {
    const { container } = render(<ContentPanelHost focusTarget={target} isAnimating={false} />);
    const panels = container.querySelectorAll('[data-panel]');
    return panels.length === 1;
  }
), { numRuns: 100 });
```

**P4 — Back navigation always clears FocusState**

```
// Feature: interactive-3d-developer-room, Property 4: back navigation always clears FocusState
fc.assert(fc.property(
  fc.constantFrom(...FOCUS_TARGETS),
  (target) => {
    const store = createStore({ focusTarget: target, isAnimating: false });
    store.clearFocus();
    return store.getState().focusTarget === null;
  }
), { numRuns: 100 });
```

**P5 — BackButton renders iff FocusState is active**

```
// Feature: interactive-3d-developer-room, Property 5: BackButton visible iff FocusState active
fc.assert(fc.property(
  fc.option(fc.constantFrom(...FOCUS_TARGETS), { nil: null }),
  (target) => {
    const { queryByRole } = render(<BackButton focusTarget={target} onBack={() => {}} />);
    const btn = queryByRole('button', { name: /back/i });
    return target !== null ? btn !== null : btn === null;
  }
), { numRuns: 100 });
```

**P6 — Valid contact form submission → success state**

```
// Feature: interactive-3d-developer-room, Property 6: valid form submission produces success state
fc.assert(fc.property(
  fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),  // name
  fc.emailAddress(),                                               // email
  fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),  // message
  (name, email, message) => {
    const result = validateContactForm({ name, email, message });
    return result.valid === true && Object.keys(result.errors).length === 0;
  }
), { numRuns: 100 });
```

**P7 — Invalid form preserves other field values**

```
// Feature: interactive-3d-developer-room, Property 7: invalid form preserves other fields
fc.assert(fc.property(
  fc.record({ name: fc.string(), email: fc.string(), message: fc.string() })
    .filter(f => [f.name, f.email, f.message].some(v => v.trim() === '')),
  (fields) => {
    const result = validateContactForm(fields);
    // all non-empty fields should have no error
    return Object.entries(fields).every(([key, val]) => {
      if (val.trim() !== '') return !result.errors[key as keyof typeof fields];
      return true; // missing fields may or may not have errors — checked separately
    });
  }
), { numRuns: 100 });
```

**P8 — Mobile viewport gates 3D rendering**

```
// Feature: interactive-3d-developer-room, Property 8: mobile viewport disables 3D
fc.assert(fc.property(
  fc.integer({ min: 320, max: 767 }),   // any mobile width
  (width) => {
    const result = isMobileViewport(width);
    return result === true;
  }
), { numRuns: 100 });
```

**P9 — ContentPanel renders all required fields per data item**

```
// Feature: interactive-3d-developer-room, Property 9: panels render all required fields
fc.assert(fc.property(
  fc.array(fc.record({
    _id: fc.uuid(),
    title: fc.string({ minLength: 1 }),
    description: fc.string({ minLength: 1 }),
    technologies: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
    github: fc.option(fc.webUrl(), { nil: undefined }),
    live: fc.option(fc.webUrl(), { nil: undefined }),
    thumbnail: fc.string(),
  }), { minLength: 1 }),
  (projects) => {
    const { getAllByTestId } = render(<ProjectsPanel projects={projects} />);
    const cards = getAllByTestId('project-card');
    return cards.length === projects.length;
  }
), { numRuns: 100 });
```

**P10 — HintOverlay dismissal persists to sessionStorage**

```
// Feature: interactive-3d-developer-room, Property 10: HintOverlay dismissal persists
fc.assert(fc.property(
  fc.boolean(),  // dismissed via click vs timeout — both paths
  (_) => {
    sessionStorage.clear();
    const store = createHintStore();
    store.dismiss();
    return sessionStorage.getItem('hint-dismissed') === 'true';
  }
), { numRuns: 100 });
```

**P11 — Page visibility pauses/resumes render loop**

```
// Feature: interactive-3d-developer-room, Property 11: visibility change pauses/resumes loop
fc.assert(fc.property(
  fc.array(fc.constantFrom('hidden', 'visible'), { minLength: 2, maxLength: 10 }),
  (events) => {
    const controller = createFrameloopController();
    events.forEach(e => controller.handleVisibilityChange(e));
    const lastEvent = events[events.length - 1];
    return lastEvent === 'visible'
      ? controller.isRunning() === true
      : controller.isRunning() === false;
  }
), { numRuns: 100 });
```

**P12 — Cursor reflects hover state**

```
// Feature: interactive-3d-developer-room, Property 12: cursor reflects hover state
fc.assert(fc.property(
  fc.constantFrom(...FOCUS_TARGETS),
  fc.boolean(),  // isHovered
  (_, isHovered) => {
    const cursor = getCursorForHoverState(isHovered);
    return isHovered ? cursor === 'pointer' : cursor === 'default';
  }
), { numRuns: 100 });
```

### Test File Layout

```
src/app/components/3d/__tests__/
├── useRoomStore.test.ts
├── CameraController.test.ts
├── ContentPanelHost.test.tsx
├── BackButton.test.tsx
├── HintOverlay.test.tsx
├── useMediaQuery.test.ts
├── ContactPanel.test.tsx
├── panels/
│   ├── ProjectsPanel.test.tsx
│   └── ExperiencePanel.test.tsx
└── pbt/
    ├── roomStore.pbt.test.ts        (P1, P2, P4)
    ├── contentPanels.pbt.test.tsx   (P3, P5, P9)
    ├── contactForm.pbt.test.ts      (P6, P7)
    ├── mobileDetection.pbt.test.ts  (P8)
    ├── hintOverlay.pbt.test.ts      (P10)
    ├── frameloop.pbt.test.ts        (P11)
    └── cursor.pbt.test.ts           (P12)
```
