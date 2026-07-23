# Track Specification: Tech Stack Refactor, Performance & De-AI-Slopification

## Overview
This track modernizes Kron0's codebase by resolving dependency conflicts, refactoring redundant AI-generated boilerplate ("slop"), eliminating UI anti-patterns detected by `impeccable`, and optimizing state re-render performance across the application.

## Objectives & Scope

### 1. UI De-AI-Slopification (`impeccable` design fixes)
- **Eliminate AI Color Palette**: Replace generic purple/cyan/violet gradients (`from-violet-600`, `from-indigo-500`, `from-purple-500`) with a cohesive color system.
- **Remove Decorative Hairline Grids**: Strip `codex-grid-background` hairline linear gradients in `index.css`.
- **Replace Tacky Bounce Easings**: Replace elastic/bounce easing curves (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`, `micro-bounce`, `bounce-float`, `fab-bounce`) with smooth exponential deceleration curves (`ease-out-quart/quint`).
- **Remove AI Side-Tab Accents**: Eliminate thick 3px/4px border-left/border-right accents on cards and layout containers.
- **Solid Headings over Gradient Text**: Replace `bg-clip-text` gradient text on headings and metric displays with clean solid typography.

### 2. Code Consolidation & Architecture Refactoring
- **Component Merging**:
  - Merge `EmptyStateEnhanced.tsx` into a single versatile `EmptyState.tsx`.
  - Consolidate `LiveBadge.tsx` and `LiveIndicator.tsx` into a unified `StatusIndicator.tsx`.
- **Boilerplate Pruning**:
  - Remove redundant `src/context/definitions/` directory and inline interface definitions directly or leverage `src/types/`.
  - Purge dead code, commented-out imports, and legacy scaffolding.

### 3. Tech Stack & Performance Modernization
- **Tailwind Dependency Resolution**: Resolve conflicting `@tailwindcss/postcss` v4 and `tailwindcss` v3 configurations in `package.json` and `tailwind.config.js`.
- **Declarative React Router Integration**: Replace custom `useState('dashboard' | 'week' | ...)` in `App.tsx` with proper React Router v7 routes (`/`, `/week`, `/focus`, `/stats`).
- **State Re-render Optimization**: Decouple high-frequency Pomodoro timer ticks from top-level Context providers to prevent whole-tree re-renders on every second interval.

## Out of Scope
- Backend Firestore schema or security rules changes.
- Adding major new user features outside of refactoring and performance fixes.

## Acceptance Criteria
- All 19 `impeccable detect src/` anti-patterns resolved cleanly.
- `npm run build` succeeds without TypeScript or Vite errors.
- `npm run lint` passes cleanly without warnings or errors.
- React Router v7 driving page navigation with working URLs.
- App rendering and state transitions verified smooth without whole-app re-render thrashing.
