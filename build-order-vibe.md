# Build Order Document – Relationship Vibe App (Phase 1 MVP, Next.js + Convex)

 **Purpose**: This task list outlines the step-by-step build order for the Relationship Vibe App MVP, based on the approved PRD.
Each main task includes subtasks to guide development, testing, and deployment.

---

## 1. Backend Setup (Convex)

* [x] Initialize Convex project: `npx convex dev`
* [x] Define schema in `schema.ts`:
  * [x] `users` table
  * [x] `relationships` table (with unique `code`)
  * [x] `relationshipUsers` pivot table
  * [x] `vibes` table (include `date` derived from `createdAt`)
* [x] Set up indexes:
  * [x] Index on `vibes` by `date, relationshipId`
  * [x] Index on `relationships.code`
* [x] Decide and document auth method: email/password OR magic link (align with PRD decision)
* [x] Implement Convex Auth using chosen method
* [x] Write Convex functions:

  * [x] `registerUser`
  * [x] `loginUser`
  * [x] `logoutUser`
  * [x] `createRelationship` (generate invite code)
  * [x] `joinRelationship` (via invite code)
  * [x] `submitVibe` (mood + note, enforce one per day)
  * [x] `getVibes` (today + last 7 days, grouped by date)

---

## 2. API & Convex Function Development

* [x] Define Convex functions in `/convex` directory
* [x] Use Convex queries and mutations for all operations

### Subtask: Authentication

* [x] `registerUser()` – Register user and start session
* [x] `loginUser()` – Log in and return session
* [x] `logoutUser()` – End session cleanly

### Subtask: Relationship Management

* [x] `createRelationship()` – Creates relationship, generates unique invite code
* [x] `joinRelationship(code)` – User joins via invite code, links pivot record

### Subtask: Vibe Submission & Retrieval

* [x] `submitVibe(mood, note)` – Submit daily vibe, enforce one per day
* [x] `getVibes(relationshipId)` – Return today's vibe + past 7 days grouped by date

  * [x] Format response as `{ date: "2025-04-05", userA: { mood, note }, userB: { mood, note } }`

---

## 3. Frontend Project Setup (Next.js)

* [x] Create Next.js app with TypeScript: `npx create-next-app@latest frontend --ts`
* [x] Install dependencies:

  * [x] `tailwindcss`, `postcss`, `autoprefixer`
  * [x] `@convex-dev/react`
  * [x] `recharts`
  * [x] `shadcn/ui`
  * [x] `next-pwa`
* [x] Initialize Tailwind: `npx tailwindcss init -p`
* [x] Set up shadcn/ui (Button, Card, Input, Label, etc.)
* [x] Configure `next.config.js` with PWA support
* [x] Create `lib/convex.ts` for Convex client integration

---

## 4. PWA Integration

* [x] Configure `next-pwa` in `next.config.js`:

  * [x] App name, short name, theme color
  * [x] Icons (192x192, 512x512) in `/public/icons/`
  * [x] Generate `manifest.json` and service worker
* [ ] Verify PWA install prompt appears in browser
* [ ] Test offline caching of core assets (HTML, CSS, JS)

---

## 5. Frontend Pages & Components

### Subtask: Authentication Flow

* [x] Create `Signup` page (name, email, password)
* [x] Create `Login` page
* [x] Connect forms to Convex Auth hooks
* [x] Implement Logout functionality

### Subtask: Vibe Check Page

* [x] Create `VibeCheck` component
* [x] Implement emoji slider (1–5: 😩 → 😊)
* [x] Add optional text input (max 140 characters)
* [x] Disable submit if entry already exists for today
* [x] Show success confirmation

### Subtask: Dashboard

* [x] Create `Dashboard` page
* [x] Fetch and display today's vibes side by side
* [ ] Render 7-day mood line chart using Recharts
* [ ] Display static insight (e.g., "You're both feeling balanced this week.")

## 7. API & Frontend Integration

* [x] Set up Convex client with `useMutation` and `useQuery`
* [x] Implement API service functions:

  * [x] `registerUser()`
  * [x] `loginUser()`
  * [x] `logoutUser()`
  * [x] `createRelationship()`
  * [x] `joinRelationship(code)`
  * [x] `submitVibe(mood, note)`
  * [x] `getVibes(relationshipId)`
* [x] Handle loading and error states in UI
* [ ] Test all queries and mutations end-to-end

---

## 6. Offline Sync Functionality

* [ ] On vibe submit:

  * [ ] Check network status
  * [ ] If online → send to Convex mutation
  * [ ] If offline → save to `localStorage` with timestamp and relationship ID
* [ ] On app load:

  * [ ] Check `localStorage` for unsent vibes
  * [ ] Attempt to sync pending entries to Convex
  * [ ] Remove from `localStorage` after successful sync
* [ ] Show user feedback: “Vibe saved offline. Will sync when online.”

---

## 7. API & Frontend Integration

* [ ] Set up Convex client with `useMutation` and `useQuery`
* [ ] Implement API service functions:

  * [ ] `registerUser()`
  * [ ] `loginUser()`
  * [ ] `logoutUser()`
  * [ ] `createRelationship()`
  * [ ] `joinRelationship(code)`
  * [ ] `submitVibe(mood, note)`
  * [ ] `getVibes(relationshipId)`
* [ ] Handle loading and error states in UI
* [ ] Test all queries and mutations end-to-end

---

## 8. Deployment

### Subtask: Convex Backend

* [ ] Deploy Convex project via CLI: `npx convex deploy`
* [ ] Configure environment variables
* [ ] Verify deployed functions accessible from Next.js

### Subtask: Frontend Deployment

* [ ] Deploy Next.js frontend on Vercel
* [ ] Connect Convex backend to Vercel deployment
* [ ] Set up custom domain and HTTPS
* [ ] Verify PWA manifest and installability on iOS and Android

---

## 9. Closed Beta Testing

* [ ] Recruit 5–10 real couples
* [ ] Provide onboarding instructions
* [ ] Monitor key metrics:

  * [ ] Activation rate (joined relationships)
  * [ ] Daily check-in rate
  * [ ] Retention at day 30
* [ ] Collect qualitative feedback:

  * [ ] Is the vibe check easy and fast?
  * [ ] Do partners feel more connected?
  * [ ] Any bugs or UX issues?
* [ ] Review Convex logs for errors

---

## 10. Post-MVP Evaluation

* [ ] Analyze success metrics:

  * [ ] Activation ≥70%?
  * [ ] Engagement ≥60%?
  * [ ] Retention ≥40%?
* [ ] Decide: Proceed to Phase 2 or iterate?
* [ ] Document learnings and user feedback

---

🚀 **Next Steps (If MVP Succeeds)**

* Push notifications for daily reminders
* AI-generated weekly reflections
* Deep talk prompts
* Streaks & gamification

> This build order ensures a focused, testable, and user-centered MVP. Let’s ship it.
