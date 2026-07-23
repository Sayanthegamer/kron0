# Implementation Plan: Tech Stack Refactor, Performance & De-AI-Slopification

Systematic refactoring of Kron0 to eliminate AI UI anti-patterns, consolidate duplicate components, clean up dependencies, implement declarative routing, and optimize state performance.

## Phase 1: Tech Stack & Dependency Alignment [checkpoint: b5d41f8]
- [x] Task: Fix Tailwind CSS Dependency Conflicts
  - [x] Standardize `package.json` and PostCSS configuration on stable Tailwind CSS setup
  - [x] Verify build and styling integrity via `npm run build`
- [x] Task: Integrate Declarative React Router v7
  - [x] Replace `useState('dashboard' | 'week' | ...)` in `App.tsx` with React Router `<Routes>` & `<Route>` definitions
  - [x] Update `Layout.tsx` navigation links to use router navigation hooks/links
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Component & Context Consolidation (De-AI-Slopification Part 1) [checkpoint: a60fd69]
- [x] Task: Merge Duplicate Components
  - [x] Consolidate `EmptyStateEnhanced.tsx` into `EmptyState.tsx` and update imports
  - [x] Consolidate `LiveBadge.tsx` and `LiveIndicator.tsx` into `StatusIndicator.tsx` and update imports
  - [x] Remove deleted duplicate component files from project tree
- [x] Task: Prune Context Boilerplate & Dead Code
  - [x] Consolidate interface definitions from `src/context/definitions/` into `src/types/`
  - [x] Delete redundant `src/context/definitions/` folder
  - [x] Clean up commented-out code and unused imports across `src/`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Visual Quality & UI Anti-Pattern Cleanup (De-AI-Slopification Part 2)
- [ ] Task: Refactor CSS Animations & Easing Curves (`impeccable`)
  - [ ] Replace `bounce-float`, `micro-bounce`, `fab-bounce`, and spring bezier curves in `index.css` with exponential deceleration
  - [ ] Remove `codex-grid-background` hairline tiled background from `index.css`
  - [ ] Remove thick side-tab colored borders in `Layout.tsx` and `index.css`
- [ ] Task: Refactor Color Palette & Heading Typography
  - [ ] Replace generic purple/cyan/violet gradients in `CelebrationOverlay.tsx`, `FocusMode.tsx`, `Dashboard.tsx`, `LandingPage.tsx` with cohesive, intentional color system
  - [ ] Replace `bg-clip-text` gradient text on headings with clean solid typography
  - [ ] Run `npx impeccable detect src/` to verify zero anti-patterns remain
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 4: State Re-render & Performance Optimization
- [ ] Task: Decouple High-Frequency Focus Timer Ticks
  - [ ] Isolate Pomodoro timer interval updates to local component/subscriber hook to prevent whole-tree Context re-renders
  - [ ] Memoize expensive timetable rendering and stats calculations
- [ ] Task: Verification & Final Quality Pass
  - [ ] Run `npm run lint` and `npm run build` to confirm zero lint/type errors
  - [ ] Run `npx impeccable detect src/` to ensure clean audit report
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
