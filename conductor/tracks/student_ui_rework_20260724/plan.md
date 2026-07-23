# Implementation Plan: Student UI Rework (`student_ui_rework_20260724`)

## Phase 1: Core Design System & Color Tokens
- [ ] Task: Update CSS Theme & Tokens (`src/index.css`)
  - [ ] Define Slate & Indigo/Teal color variables (`--background`, `--card`, `--primary`, `--secondary`, `--accent`, `--border`)
  - [ ] Replace glass glow utility classes with clean 1px border elevation cards
  - [ ] Add soft ambient background glow radial gradients (`ambient-glow`)
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Navigation, Layout & Buttons Rework
- [ ] Task: Refactor Navigation & Layout (`src/components/Layout.tsx`)
  - [ ] Rework sidebar navigation with clean active tab pills and crisp icons
  - [ ] Redesign header user avatar, status badges, and quick controls
  - [ ] Update primary and secondary action button styles across app
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Landing Page & Dashboard Widgets Redesign
- [ ] Task: Rework Landing Page (`src/pages/LandingPage.tsx`)
  - [ ] Update hero heading to "Master Your Semester without the Chaos"
  - [ ] Rework hero live preview widget, feature cards, and CTA buttons
- [ ] Task: Rework Dashboard & Core Widgets (`src/pages/Dashboard.tsx`, `ClassCard.tsx`, `TodoWidget.tsx`, `StatsWidget.tsx`)
  - [ ] Update `ClassCard` status indicators, time badges, and action menus
  - [ ] Refactor `TodoWidget` and `StatsWidget` card surfaces and progress bars
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 4: Focus Mode UI & Final Quality Audit
- [ ] Task: Redesign Focus Mode UI (`src/pages/FocusMode.tsx`)
  - [ ] Update Pomodoro timer ring, mode selector pills, and session control buttons
- [ ] Task: Quality Audit & Verification
  - [ ] Run `npx impeccable detect src/` to verify zero anti-patterns
  - [ ] Run `npm run lint` and `npm run build` to confirm zero errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
