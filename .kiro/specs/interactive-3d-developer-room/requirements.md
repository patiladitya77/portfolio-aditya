# Requirements Document

## Introduction

Transform the existing Next.js 15 portfolio website into an immersive Interactive 3D Developer Room experience. The portfolio is a fully modeled 3D workspace where each physical object represents a portfolio section. Visitors navigate by clicking objects in the room, triggering smooth cinematic camera animations that zoom into the object and reveal the associated content. The existing admin panel, API routes, and MongoDB-backed data layer remain untouched. The experience must feel premium and professional — suitable for software engineering recruiters — while being visually impressive.

## Glossary

- **Room**: The primary 3D scene rendered via React Three Fiber, representing a developer's workspace.
- **Scene**: The React Three Fiber canvas and its full set of 3D objects, lights, and camera.
- **Camera**: The Three.js perspective camera that navigates the Room via animated transitions.
- **InteractiveObject**: A 3D mesh or group within the Room that responds to pointer events and triggers a section focus.
- **FocusState**: The application state describing which InteractiveObject (if any) is currently focused; determines which content panel is visible.
- **ContentPanel**: A 2D HTML overlay rendered on top of the Scene when a FocusState is active, displaying portfolio content.
- **CameraController**: The module responsible for animating camera position and look-at target using GSAP tweens.
- **Laptop**: The InteractiveObject on the desk representing the Projects section.
- **Bookshelf**: The InteractiveObject beside the desk representing the Skills section.
- **Whiteboard**: The InteractiveObject on the wall representing the Experience & Journey section.
- **RoomWindow**: The InteractiveObject (large window) representing the About Me section.
- **Smartphone**: The InteractiveObject on the desk representing the Contact section.
- **CoffeeMug**: A decorative InteractiveObject displaying the developer's current status.
- **Monitor**: An InteractiveObject displaying GitHub stats and tech activity.
- **StickyNotes**: Decorative InteractiveObjects displaying random developer facts.
- **MobileView**: The simplified portfolio layout rendered on viewports narrower than 768 px where 3D rendering is disabled.
- **LoadingScreen**: A full-screen overlay shown while the 3D assets and scene initialize.
- **HintOverlay**: A brief on-screen prompt guiding first-time visitors on how to interact with the Room.
- **BackButton**: A UI element rendered over the Scene that returns the Camera to the default room-overview position and clears FocusState.

---

## Requirements

### Requirement 1: 3D Room Scene Initialization

**User Story:** As a portfolio visitor, I want to see a fully rendered 3D developer room when I open the portfolio, so that I immediately understand the immersive navigation concept.

#### Acceptance Criteria

1. THE Scene SHALL render a 3D developer workspace containing at minimum: a desk, Laptop, Bookshelf, Whiteboard, RoomWindow, Smartphone, CoffeeMug, Monitor, and StickyNotes.
2. WHEN the page first loads, THE LoadingScreen SHALL be displayed until all 3D assets have finished loading.
3. WHEN 3D asset loading is complete, THE LoadingScreen SHALL transition out with a fade animation of 600 ms or less.
4. THE Scene SHALL render at a target frame rate of 60 FPS on modern desktop hardware.
5. THE Scene SHALL use warm desk lighting combined with RGB ambient lighting to produce a dark-mode aesthetic with electric-blue and purple accent colors.
6. THE Scene SHALL apply a perspective camera with a field-of-view between 50° and 75° for the default room-overview position.
7. WHEN the scene is mounted, THE CameraController SHALL position the Camera at the default room-overview position showing the full Room layout.

---

### Requirement 2: Interactive Object Hover Effects

**User Story:** As a portfolio visitor, I want visual feedback when I hover over interactive objects, so that I can discover which objects are clickable.

#### Acceptance Criteria

1. WHEN a pointer enters the bounding area of an InteractiveObject, THE Scene SHALL apply a subtle glow or highlight effect to that object within 100 ms.
2. WHEN a pointer leaves the bounding area of an InteractiveObject, THE Scene SHALL remove the glow or highlight effect within 100 ms.
3. WHEN a pointer hovers over the Bookshelf, THE Bookshelf SHALL animate individual books by moving them 0.05–0.15 units outward along their local axis.
4. WHEN a pointer hovers over the Laptop, THE Laptop SHALL emit a soft blue glow.
5. WHEN a pointer enters any InteractiveObject, THE Scene SHALL change the cursor style to "pointer".
6. WHEN a pointer leaves all InteractiveObjects, THE Scene SHALL restore the cursor style to "default".

---

### Requirement 3: Camera Focus Animation

**User Story:** As a portfolio visitor, I want the camera to smoothly zoom into an object when I click it, so that the transition feels cinematic and intentional.

#### Acceptance Criteria

1. WHEN a visitor clicks an InteractiveObject, THE CameraController SHALL animate the Camera to a predefined focus position for that object using a GSAP tween.
2. THE CameraController SHALL complete each focus-zoom animation in 1200 ms or less using an ease-in-out curve.
3. WHEN a Camera focus animation is in progress, THE Scene SHALL ignore additional InteractiveObject click events until the animation completes.
4. WHEN the Camera reaches a focus position, THE Scene SHALL trigger the display of the corresponding ContentPanel.
5. THE CameraController SHALL animate camera position and look-at target simultaneously so the transition appears smooth and cinematic.

---

### Requirement 4: Laptop — Projects Section

**User Story:** As a recruiter, I want to view the developer's projects by clicking the laptop, so that I can evaluate their work in context.

#### Acceptance Criteria

1. WHEN a visitor clicks the Laptop, THE CameraController SHALL animate the Camera to focus on the Laptop screen.
2. WHEN the Camera reaches the Laptop focus position, THE Laptop SHALL play a screen power-on animation before the ContentPanel appears.
3. WHEN the Laptop ContentPanel is visible, THE ContentPanel SHALL display project cards fetched from the existing `/api/projects` endpoint.
4. THE Laptop ContentPanel SHALL render each project card with: project name, description, tech stack badges, GitHub link, and Live Demo link.
5. WHEN the Laptop ContentPanel is displayed, project cards SHALL slide into view with a staggered entrance animation of 150 ms delay between cards.
6. THE Laptop ContentPanel SHALL display at minimum the following projects: Prep-AI, Submyt, DevTinder, Netflix-GPT.

---

### Requirement 5: Bookshelf — Skills Section

**User Story:** As a recruiter, I want to browse the developer's skills by clicking the bookshelf, so that I can quickly assess technical breadth.

#### Acceptance Criteria

1. WHEN a visitor clicks the Bookshelf, THE CameraController SHALL animate the Camera to focus on the Bookshelf.
2. WHEN the Bookshelf ContentPanel is visible, THE ContentPanel SHALL display skills grouped into categories: Frontend, Backend, Databases, DevOps, AI/ML, and Tools.
3. THE Bookshelf ContentPanel SHALL include at minimum: React, Next.js, TypeScript, Tailwind CSS (Frontend); Node.js, Express, Spring Boot (Backend); MongoDB, PostgreSQL (Databases); Docker, AWS, Terraform (DevOps).
4. WHEN the Bookshelf ContentPanel appears, skill items SHALL animate by floating out and arranging in a grid with a staggered entrance animation.

---

### Requirement 6: Whiteboard — Experience & Journey Section

**User Story:** As a recruiter, I want to read the developer's experience timeline on the whiteboard, so that I can understand their professional growth.

#### Acceptance Criteria

1. WHEN a visitor clicks the Whiteboard, THE CameraController SHALL animate the Camera to focus on the Whiteboard.
2. WHEN the Whiteboard ContentPanel is visible, THE ContentPanel SHALL display a vertical timeline of experience milestones fetched from the existing `/api/experiences` endpoint.
3. THE Whiteboard ContentPanel SHALL display timeline entries in chronological order with role, company, date range, and description for each entry.
4. WHEN the Whiteboard ContentPanel appears, THE ContentPanel SHALL animate each timeline entry with a hand-drawn SVG path drawing effect that completes within 2000 ms.

---

### Requirement 7: RoomWindow — About Me Section

**User Story:** As a recruiter, I want to learn about the developer by clicking the window, so that I understand their background and goals.

#### Acceptance Criteria

1. WHEN a visitor clicks the RoomWindow, THE CameraController SHALL animate the Camera to face the RoomWindow.
2. WHEN the Camera reaches the RoomWindow focus position, THE ContentPanel SHALL overlay the window view with the About Me content.
3. THE RoomWindow ContentPanel SHALL display: full name, current education status, short professional introduction, career goals, and interests.
4. WHILE the RoomWindow ContentPanel is visible, THE Scene SHALL animate subtle movement in the city scenery visible through the window (e.g., floating lights or slow particle drift).
5. THE RoomWindow SHALL support an ambient day-to-night lighting transition animation that cycles with a period of 60 seconds or more.

---

### Requirement 8: Smartphone — Contact Section

**User Story:** As a recruiter, I want to contact the developer by clicking the smartphone, so that I can reach out directly from the portfolio.

#### Acceptance Criteria

1. WHEN a visitor clicks the Smartphone, THE CameraController SHALL animate the Camera to focus on the Smartphone screen.
2. WHEN the Camera reaches the Smartphone focus position, THE Smartphone SHALL play an unlock animation before the ContentPanel appears.
3. WHEN the Smartphone ContentPanel is visible, THE ContentPanel SHALL display: email address, GitHub profile link, LinkedIn profile link, resume download button, and a contact form.
4. WHEN a visitor submits the contact form with a valid name, email, and message, THE ContentPanel SHALL display a submission confirmation message.
5. IF the contact form is submitted with a missing required field, THEN THE ContentPanel SHALL display an inline validation error for each missing field without clearing other fields.
6. THE ContentPanel SHALL animate contact app icons with a staggered entrance animation of 100 ms delay between items.

---

### Requirement 9: Decorative Interactive Objects

**User Story:** As a portfolio visitor, I want to interact with small objects in the room, so that I can discover personality and status details about the developer.

#### Acceptance Criteria

1. WHEN a visitor clicks the CoffeeMug, THE Scene SHALL display a tooltip or mini-panel showing the developer's current status (e.g., "Building Projects ☕" or "Open to Opportunities ☕").
2. WHEN a visitor clicks the Monitor, THE Scene SHALL display a ContentPanel with GitHub contribution stats and tech activity information.
3. WHEN a visitor clicks a StickyNote, THE Scene SHALL display a tooltip showing one of: favorite tech stack, current learning goal, or a fun developer fact.
4. THE CoffeeMug, Monitor, and StickyNotes SHALL respond to hover with a subtle scale or glow effect consistent with the other InteractiveObjects.

---

### Requirement 10: Back Navigation

**User Story:** As a portfolio visitor, I want to return to the full room view from any focused section, so that I can navigate freely between sections.

#### Acceptance Criteria

1. WHEN a FocusState is active, THE Scene SHALL render a visible BackButton in the UI overlay.
2. WHEN a visitor clicks the BackButton, THE CameraController SHALL animate the Camera back to the default room-overview position using a GSAP tween of 1000 ms or less.
3. WHEN the back animation completes, THE Scene SHALL remove the active ContentPanel and clear the FocusState.
4. WHEN a visitor presses the Escape key while a FocusState is active, THE Scene SHALL behave identically to clicking the BackButton.

---

### Requirement 11: First-Visit Guidance

**User Story:** As a first-time visitor, I want a brief hint about how to interact with the room, so that I understand the navigation without confusion.

#### Acceptance Criteria

1. WHEN the Room is first displayed after the LoadingScreen, THE Scene SHALL show the HintOverlay.
2. THE HintOverlay SHALL instruct the visitor to click objects in the room to explore portfolio sections.
3. WHEN a visitor clicks anywhere in the Scene or after 5 seconds, THE HintOverlay SHALL fade out with a 400 ms fade animation.
4. THE HintOverlay SHALL not be shown again during the same browser session after it has been dismissed.

---

### Requirement 12: Mobile Fallback Experience

**User Story:** As a mobile visitor, I want to access the portfolio content even without 3D rendering, so that I can view the developer's work on any device.

#### Acceptance Criteria

1. WHEN the viewport width is less than 768 px, THE Scene SHALL not render the 3D Room.
2. WHEN the viewport width is less than 768 px, THE Portfolio SHALL render the MobileView, which is a simplified 2D layout containing all portfolio sections: About, Skills, Experience, Projects, and Contact.
3. THE MobileView SHALL preserve all existing portfolio section components (Hero, SkillsSection, ExperienceSection, ProjectCard, ContactSection) to avoid regressions.
4. THE MobileView SHALL be navigable via a standard top navigation bar with smooth-scroll anchor links.

---

### Requirement 13: Performance and Optimization

**User Story:** As a portfolio visitor, I want the 3D experience to load and run smoothly, so that performance issues do not detract from the impression.

#### Acceptance Criteria

1. THE Scene SHALL lazy-load 3D model assets so that the initial page HTML and critical CSS are delivered before 3D assets begin downloading.
2. THE Scene SHALL use geometry instancing or merging where multiple identical objects exist to reduce draw calls.
3. THE Scene SHALL implement frustum culling so that objects outside the Camera's view frustum are not rendered.
4. WHEN the browser tab loses focus, THE Scene SHALL pause the render loop to conserve CPU and GPU resources.
5. WHEN the browser tab regains focus, THE Scene SHALL resume the render loop.
6. THE Scene SHALL target a Largest Contentful Paint (LCP) of 3 seconds or less on a standard broadband connection.

---

### Requirement 14: Existing Admin Panel Preservation

**User Story:** As the site admin, I want all existing admin functionality to remain intact after the 3D room is added, so that I can continue managing portfolio content without disruption.

#### Acceptance Criteria

1. THE Portfolio SHALL preserve all existing API routes under `/api/admin/*`, `/api/projects`, and `/api/experiences` without modification.
2. THE Portfolio SHALL preserve the admin dashboard accessible at `/{key}/admin` without modification.
3. THE Portfolio SHALL preserve the existing MongoDB models: Project, Experience, Admin, and MetaData.
4. WHEN the 3D Room fetches project or experience data, THE Room SHALL use the same existing API endpoints used by the 2D layout.

---

### Requirement 15: Code Architecture and Quality

**User Story:** As a developer maintaining this codebase, I want the 3D room code to be modular and follow clean architecture, so that individual components can be updated or replaced independently.

#### Acceptance Criteria

1. THE Portfolio SHALL organize 3D Room code under a dedicated directory (e.g., `src/app/components/3d/`) separate from 2D portfolio components.
2. THE CameraController SHALL be implemented as a reusable module that accepts target position and look-at parameters, decoupled from individual section components.
3. EACH InteractiveObject SHALL be implemented as an independent React component with clearly defined props for position, rotation, scale, and event callbacks.
4. THE Portfolio SHALL use TypeScript strict mode for all new 3D-related source files.
5. THE Portfolio SHALL not introduce duplicate data-fetching logic; all content data SHALL be sourced from the existing API endpoints.
