# Product Requirements Document (PRD) – Relationship Vibe App (Phase 1 MVP, Next.js + Convex Backend)

---

## 1. Overview

The **Relationship Vibe App** is a lightweight **Progressive Web App (PWA)** designed for couples to track and share their daily moods — referred to as “vibes.”

The primary goal of **Phase 1 (MVP)** is to validate whether couples will engage in **consistent daily check-ins**.

Future features such as deep conversation prompts, AI-driven insights, and gamification will **only be developed if Phase 1 meets key engagement metrics**.

---

## 1.1 Hypothesis

Couples will consistently use a lightweight daily mood check-in tool if it is:

* Private and shared only between partners
* Quick to use (<30 seconds per check-in)
* Visually simple and emotionally intuitive (emojis, minimal text)
* Accessible on mobile via a PWA (no app store friction)

---

## 2. Problem Statement

* Couples often fail to notice subtle emotional shifts in each other.
* Minor frustrations or stressors accumulate over time due to lack of emotional visibility.
* Existing relationship apps are either too clinical (therapy-focused) or overly playful (game-based), leaving a gap for a **simple, daily emotional sync tool**.

---

## 3. Solution (MVP Scope)

Phase 1 delivers **one core experience**: the *Daily Vibe Check*, paired with a shared dashboard.

Key functionality includes:

* Each partner selects a mood on a **1–5 scale with emojis**.
* Option to add a **short text note (max 140 characters)**.
* Both partners’ daily vibes are displayed **side by side** on a shared dashboard.
* A **7-day mood history chart** visualizes emotional trends.
* Fully functional as a **PWA** — installable, responsive, and supports offline input with sync-on-connect.

---

## 4. Core Features (Phase 1 Only)

### 1. **Auth & Relationship Linking**

* Authentication using **Convex Auth**.
* User A creates a new relationship → system generates a unique **invite code**.
* User B signs up and uses the invite code to join the relationship.
* Relationship is established via a pivot structure linking two users.
* Optional logout endpoint provided for clean session handling.

### 2. **Daily Vibe Check**

* Mood selection via **emoji slider or numeric scale (1–5)**.
* Optional note field (**max 140 characters**).
* One submission allowed per user per day.
* Prevents duplicate entries after submission.

### 3. **Shared Dashboard**

* Displays **today’s vibes** for both partners side by side.
* Shows a **7-day mood chart** (line graph using Recharts).
* Includes a **static one-liner insight** (e.g., “You’re both feeling balanced this week.”) — no AI involved.

### 4. **PWA Support**

* Installable on **iOS and Android** via browser (via Web App Manifest).
* Service worker caches core assets for **offline access**.
* Offline capability: users can submit a vibe while offline; data stored in `localStorage` and synced when back online.

---

## 5. Out of Scope (Phase 1)

These features will **not** be included in Phase 1:

* ❌ AI-generated insights or sentiment analysis
* ❌ Deep talk prompts or guided conversations
* ❌ Gamification (streaks, badges, rewards)
* ❌ Push notifications or reminders
* ❌ Monetization, subscriptions, or in-app purchases
* ❌ Social sharing or multi-user groups

> These may be considered in future phases based on MVP engagement data.

---

## 6. Success Metrics

To determine whether to proceed to Phase 2, we must achieve the following within the first 30 days of launch:

| Metric               | Target                                                               |
| -------------------- | -------------------------------------------------------------------- |
| **Activation Rate**  | ≥70% of invited partners successfully join a relationship            |
| **Daily Engagement** | ≥60% daily check-in rate across couples over first 14 days           |
| **30-Day Retention** | ≥40% of couples remain active (at least one check-in in last 7 days) |

> **Definition of "Active Couple"**: A couple is considered *active* if at least one partner submitted a vibe in the last 7 days.

---

## 7. Tech Stack

### Backend

* **Platform**: Convex (serverless backend)
* **Authentication**: Convex Auth
* **Database**: Convex Database (schema in TypeScript)
* **API Layer**: Convex Functions (auto-generated client for frontend)
* **Security**: Built-in Convex Auth + Row-level security

### Frontend

* **Framework**: Next.js (latest) + React + TypeScript
* **UI Library**: TailwindCSS + [shadcn/ui](https://ui.shadcn.com/)
* **Charts**: Recharts (lightweight, React-compatible)
* **State & API**: Convex auto-generated client hooks, localStorage for offline queue

### PWA Tools

* **Next PWA Plugin**: `next-pwa` for manifest and service worker
* **Manifest**: `manifest.json` with icons, name, theme colors
* **Service Worker**: Caches static assets and enables offline use

### Deployment

* **Hosting**: Vercel (Next.js + Convex)

---

## 8. Database Schema (Convex Schema in TypeScript)

```ts
// Users
users: {
  id: string,
  name: string,
  email: string,
  createdAt: Date,
  updatedAt: Date,
}

// Relationships
relationships: {
  id: string,
  code: string, // invite code
  createdAt: Date,
  updatedAt: Date,
}

// Relationship ↔ Users
relationshipUsers: {
  id: string,
  relationshipId: string,
  userId: string,
  createdAt: Date,
  updatedAt: Date,
}

// Vibes
vibes: {
  id: string,
  relationshipId: string,
  userId: string,
  mood: number, // 1–5
  note?: string,
  date: string, // YYYY-MM-DD
  createdAt: Date,
  updatedAt: Date,
}
```

---

## 9. Project Structure

```
relationship-vibe-app/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Login, Signup
│   ├── dashboard/              # Shared dashboard
│   ├── vibe-check/             # Daily vibe input
│   └── layout.tsx              # Global layout
│
├── convex/                     # Convex Functions
│   ├── schema.ts               # Convex schema (users, relationships, vibes)
│   ├── auth.ts                 # Convex Auth setup
│   └── functions/              # Business logic
│
├── public/
│   ├── manifest.json           # PWA Manifest
│   ├── icons/                  # App icons
│   └── sw.js                   # Service worker
│
├── components/                 # Reusable UI (shadcn)
├── lib/                        # Convex client, helpers
├── styles/                     # Tailwind styles
└── package.json
```

---

## 10. Step-by-Step Implementation Plan

**Step 1: Backend Setup (Convex)**

* Initialize Convex project
* Define schema: users, relationships, relationshipUsers, vibes
* Set up Convex Auth (email/password, or magic link)
* Implement Convex functions:

  * `registerUser`
  * `createRelationship`
  * `joinRelationship`
  * `submitVibe`
  * `getVibes`

**Step 2: Next.js Frontend Scaffolding**

* Create Next.js app (App Router, TypeScript)
* Install dependencies:

  ```bash
  npm install tailwindcss postcss autoprefixer recharts @convex-dev/react shadcn/ui next-pwa
  ```
* Configure Tailwind + shadcn
* Add `next-pwa` plugin + manifest.json

**Step 3: Auth Pages**

* Build Signup/Login using Convex Auth
* Session persistence through Convex hooks

**Step 4: Core Features**

* Vibe Check Page:

  * Emoji slider (1–5)
  * Text input (140 char limit)
  * Submit disabled after daily entry
* Dashboard:

  * Show today’s vibes side by side
  * 7-day chart using Recharts
  * Static text insight

**Step 5: Offline Support**

* Store unsent vibes in localStorage when offline
* Sync to Convex when online

**Step 6: Deployment**

* Deploy to Vercel (Next.js + Convex integration)
* Configure environment variables in Vercel dashboard

**Step 7: Closed Beta Testing**

* Recruit 5–10 real couples
* Gather feedback on usability, clarity, and engagement
* Monitor Convex logs and metrics

✅ **Next Steps After MVP:**

* Push notifications
* AI-generated weekly reflections
* Conversation prompts
* Streaks & gamification

---

## 11. Risks & Mitigations

* **Low Engagement Risk**: Couples may not return daily → Mitigation: Flow under 30 seconds, soft reminders in future.
* **Technical Risk**: First-time Convex setup → Mitigation: Use official Convex examples and docs.
* **Offline Sync Edge Cases**: LocalStorage clears → Mitigation: Prompt users when offline submissions are saved.
* **Privacy Concerns**: Relationship data is sensitive → Mitigation: HTTPS enforced by Vercel, Convex Auth security.

---

This PRD defines a focused, testable hypothesis: Will couples consistently share daily moods in a simple, private space? Let’s build to find out. 🚀
