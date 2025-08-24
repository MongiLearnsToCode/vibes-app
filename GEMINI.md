# Project Overview

This is a Next.js project called "Relationship Vibe App". It's a Progressive Web App (PWA) designed for couples to track and share their daily moods. The backend is powered by Convex.

The primary goal of the MVP is to validate whether couples will consistently engage in daily check-ins.

## Key Technologies

*   **Frontend:** Next.js, React, TypeScript, TailwindCSS, shadcn/ui, Recharts
*   **Backend:** Convex (serverless backend, database, and authentication)
*   **PWA:** `next-pwa` for offline support and installability

# Building and Running

To get started with the development environment, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  **Run the Convex backend (in a separate terminal):**
    ```bash
    npx convex dev
    ```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Development Conventions

*   The project uses the Next.js App Router.
*   UI components are built with shadcn/ui.
*   The backend logic is handled by Convex functions, which are located in the `/convex` directory.
*   The database schema is defined in `/convex/schema.ts`.
*   The project follows the structure outlined in the `prd-vibe.md` file.
