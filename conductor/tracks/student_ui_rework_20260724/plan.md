# Implementation Plan: Student UI Rework (`student_ui_rework_20260724`)

## Phase 1: Core Design System & Color Tokens [checkpoint: c8e0d30]
- [x] Task: Update CSS Theme & Tokens (`src/index.css`)
  - [x] Define Slate & Indigo/Teal color variables (`--background`, `--card`, `--primary`, `--secondary`, `--accent`, `--border`)
  - [x] Replace glass glow utility classes with clean 1px border elevation cards
  - [x] Add soft ambient background glow radial gradients (`ambient-glow`)
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Navigation, Layout & Buttons Rework [checkpoint: 2a5b33f]
- [x] Task: Refactor Navigation & Layout (`src/components/Layout.tsx`)
  - [x] Rework sidebar navigation with clean active tab pills and crisp icons
  - [x] Redesign header user avatar, status badges, and quick controls
  - [x] Update primary and secondary action button styles across app
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Landing Page & Dashboard Widgets Redesign [checkpoint: 98a9b8d]
- [x] Task: Rework Landing Page (`src/pages/LandingPage.tsx`)
  - [x] Update hero heading to "Master Your Semester without the Chaos"
  - [x] Rework hero live preview widget, feature cards, and CTA buttons
- [x] Task: Rework Dashboard & Core Widgets (`src/pages/Dashboard.tsx`, `ClassCard.tsx`, `TodoWidget.tsx`, `StatsWidget.tsx`)
  - [x] Update `ClassCard` status indicators, time badges, and action menus
  - [x] Refactor `TodoWidget` and `StatsWidget` card surfaces and progress bars
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 4: Focus Mode UI & Final Quality Audit
- [ ] Task: Redesign Focus Mode UI (`src/pages/FocusMode.tsx`)
  - [ ] Update Pomodoro timer ring, mode selector pills, and session control buttons
- [ ] Task: Quality Audit & Verification
  - [ ] Run `npx impeccable detect src/` to verify zero anti-patterns
  - [ ] Run `npm run lint` and `npm run build` to confirm zero errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
