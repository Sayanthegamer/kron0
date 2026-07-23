# Technology Stack: Kron0

## Core Application Architecture
- **Language**: TypeScript (`~5.9.3`) - Strict mode enabled with `tsconfig.app.json` and `tsconfig.node.json`.
- **UI Library**: React (`^19.2.0`) & React DOM (`^19.2.0`).
- **Build System**: Vite (`^7.3.1`) with `@vitejs/plugin-react` (`^5.1.2`).
- **Routing**: React Router DOM (`^7.10.1`).

## Styling & Animations
- **CSS Framework**: Tailwind CSS (`^3.4.19` & `@tailwindcss/postcss ^4.1.18`).
- **Utility Libraries**: `clsx` (`^2.1.1`), `tailwind-merge` (`^3.4.0`).
- **Animation Framework**: Framer Motion (`^12.23.26`).
- **Iconography**: Lucide React (`^0.561.0`).

## Cloud Services & State Management
- **Authentication & Database**: Firebase JS SDK (`^12.7.0`) - Google Auth & Firestore real-time collections.
- **Date Operations**: `date-fns` (`^4.1.0`).
- **PWA Capabilities**: `vite-plugin-pwa` (`^1.2.0`).

## Code Quality & Dev Tooling
- **Linter**: ESLint 9 (`^9.39.1`) with `typescript-eslint` (`^8.46.4`), `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.
- **Hosting Targets**: Configured for Vercel (`vercel.json`) and Firebase Hosting (`firebase.json`).
