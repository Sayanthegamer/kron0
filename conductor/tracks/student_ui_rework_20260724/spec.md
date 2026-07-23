# Specification: Student UI Rework (`student_ui_rework_20260724`)

## Overview
Completely rework Kron0's user interface layout, typography, color palette, buttons, and backgrounds to replace AI-generated design slop with a professional, clean, yet casual student-centric experience.

## Goals & Objectives
- **Color System**: Establish a Slate & Indigo/Teal color hierarchy (`#0f172a` deep background, `#1e293b` card surfaces, indigo primary actions `#6366f1`, teal accents `#14b8a6`, zero AI purple/cyan gradients).
- **Typography & Rhythm**: Use clean Inter system typography, crisp weights (600/700 headers), solid text colors (no `bg-clip-text` gradients), and balanced spacing.
- **Components & Layout**:
  - Rework **Landing Page**: Add student tagline ("Master Your Semester without the Chaos"), interactive preview card, clean CTA buttons, and soft radial background ambient light.
  - Rework **Layout & Navigation**: Sleek sidebar and header navigation, subtle 1px border cards, and polished active state indicators.
  - Rework **Buttons & Controls**: 200ms `ease-out` hover scale & shadow transitions, crisp border radiuses (`rounded-xl` / `rounded-full`), clear focus rings.
  - Rework **Widgets & Cards**: `ClassCard`, `WeekOverview`, `TodoWidget`, `StatsWidget`, and `FocusMode` controls.

## Acceptance Criteria
1. Zero AI design slop (no hairline dot-grid backgrounds, no thick 4px colored side borders, no tacky gradient text headers).
2. Clean student aesthetic: Slate/Indigo/Teal palette, crisp buttons, intuitive interactive feedback.
3. Clean build (`npm run build`) and clean linter (`npm run lint`).
4. Impeccable audit passes with 0 anti-patterns (`npx impeccable detect src/`).
