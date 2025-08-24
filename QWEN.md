# Qwen Code Context for `vibes-app`

## Project Overview

This project is a Next.js-based Progressive Web App (PWA) called the "Relationship Vibe App". Its primary purpose, as defined in the MVP (Phase 1), is to allow couples to perform daily check-ins by submitting their mood ("vibe") on a 1-5 scale, optionally with a short note. The app provides a shared dashboard to view both partners' daily vibes side-by-side and a 7-day mood history chart.

The core technical stack includes:
- **Frontend:** Next.js (App Router), React, TypeScript.
- **Backend:** Convex (serverless backend, database, and functions).
- **Authentication:** Convex Auth.
- **Styling:** Tailwind CSS, shadcn/ui components.
- **Charting:** Recharts.
- **PWA:** Implemented using `next-pwa`.
- **Deployment:** Vercel.

The project structure suggests a standard Next.js application with specific directories for `convex` functions and `src/app` for the frontend pages.

## Building and Running

### Prerequisites

- Node.js (version not specified, but implied by `package.json` dependencies like React 19).
- Package manager (npm, yarn, pnpm, or bun).

### Key Commands

These commands are derived from `package.json` scripts and standard Next.js/Convex practices.

1.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```
2.  **Development Server (Frontend & Convex dev mode):**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```
    This command, defined as `next dev`, starts the Next.js development server. It likely requires a local Convex development environment to be running simultaneously (e.g., `npx convex dev` in a separate terminal) for backend functionality, although the standard `create-next-app` setup integrates this.

3.  **Build for Production:**
    ```bash
    npm run build
    # or
    yarn build
    # or
    pnpm build
    # or
    bun build
    ```
    This command, defined as `next build`, creates an optimized production build of the Next.js application.

4.  **Start Production Server (Locally):**
    ```bash
    npm run start
    # or
    yarn start
    # or
    pnpm start
    # or
    bun start
    ```
    This command, defined as `next start`, starts the Next.js production server using the build output. This is typically used after `npm run build`.

5.  **Linting:**
    ```bash
    npm run lint
    # or
    yarn lint
    # or
    pnpm lint
    # or
    bun lint
    ```
    This command runs the configured linter (`eslint`).

6.  **Convex CLI:**
    ```bash
    npx convex dev # Starts Convex development server
    npx convex deploy # Deploys Convex functions
    npx convex docs # Opens Convex documentation
    ```
    These are standard Convex CLI commands for development and deployment, as indicated in `convex/README.md`.

### Deployment

The standard deployment method for this stack is to Vercel. Convex functions are deployed separately using the Convex CLI (`npx convex deploy`) or integrated via Vercel's Convex integration.

## Development Conventions

Based on the files analyzed, the following conventions and technologies are used:

- **Framework:** Next.js (App Router) for the frontend.
- **Language:** TypeScript.
- **Backend:** Convex for serverless functions and database interactions. Functions are defined in the `convex/` directory with specific exports for queries and mutations.
- **Styling:** Tailwind CSS for utility-first styling, configured with `postcss.config.mjs` and likely a `tailwind.config.js` (not shown but implied).
- **UI Components:** shadcn/ui components, which are customizable and built on top of Radix UI primitives. Aliases like `@/components/ui` are configured (see `components.json`).
- **State Management & Data Fetching:** Convex's `useQuery` and `useMutation` hooks within React components.
- **PWA:** Implemented using the `next-pwa` plugin.
- **Linting:** ESLint is configured (see `eslint.config.mjs`).
- **Type Checking:** TypeScript configuration via `tsconfig.json`.
- **File Structure:** Follows Next.js App Router conventions within `src/app/` for pages and layouts. Convex functions reside in `convex/`.