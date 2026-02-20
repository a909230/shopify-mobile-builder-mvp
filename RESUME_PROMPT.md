# AI Resume Prompt & Project Context

**User Goal:** Build a Shopify Mobile App Builder (MVP).
**Current State:** Fully functional MVP. Backend on Render (preferred) or Local (Ngrok). Mobile App on Expo (Local).

## 1. Project Architecture
- **Root**: `Shopify/`
- **Backend** (`mobile-builder-backend/`):
  - **Stack**: Remix (Node.js), Prisma (Postgres/SQLite), Shopify App Remix package.
  - **Role**: Handles Shopify OAuth, generates Access Tokens, stores App Config (Branding, Colors).
  - **Deployment**: Render.com (Docker) or Local (Ngrok).
  - **Database**: `StoreConfig` table holds the `shop`, `storefrontAccessToken`, and `branding`.
- **Mobile** (`mobile-app/`):
  - **Stack**: React Native (Expo), React Navigation.
  - **Role**: Consumer-facing app. Connects to Backend to get Config, then connects directly to Shopify Storefront API.
  - **Key Files**:
    - `src/screens/LoginScreen.js`: Entry point. User enters "Invite Code". Fetches Config from Backend.
    - `src/api/shopify.js`: Handles Shopify GraphQL reqs using `storefrontAccessToken`.
    - `src/context/ThemeContext.js`: Applies branding dynamically.

## 2. Critical Workflows

### A. The "Render (Cloud)" Workflow (Recommended)
1.  **Backend**: Deployed on Render. URL: `https://mobile-builder-backend.onrender.com` (or similar).
2.  **Mobile**:
    - Runs locally: `npx expo start --localhost --port 8083`.
    - Connects to Render Backend via `LoginScreen.js` (User must enter Render URL in "Server Settings").
    - **ADB**: `adb reverse tcp:8083 tcp:8083` (Only for Expo, not Backend).

### B. The "Local (Ngrok)" Workflow (Legacy/Dev)
1.  **Backend**: Runs locally on port 8081.
    - `ngrok http 8081` -> Get URL.
    - `npm run dev -- --tunnel-url=YOUR_NGROK_URL`.
2.  **Mobile**:
    - Runs locally on port 8083.
    - **ADB**: `adb reverse tcp:8081 tcp:8081` AND `adb reverse tcp:8083 tcp:8083`.

## 3. Common Pitfalls & Fixes
- **"Network Error" on Mobile**:
  - If using Render: Check internet. Check if Render app is waking up (cold start).
  - If using Local: Check `adb reverse`. Check Ngrok URL expiration.
- **"Unauthorized" / Token Issues**:
  - Go to Shopify Admin > Apps > Mobile Builder > **Regenerate Token**.
- **Database Schema**:
  - `dev.sqlite` for Local.
  - Postgres for Render.
  - **Always** run `npx prisma generate` after schema changes.

## 4. Documentation Map
- **`MASTER_GUIDE.md`**: The comprehensive manual for setup and running.
- **`README.md`**: High-level overview.
- **`legacy_docs/`**: Old/Fragmented guides (Ignore these).

## 5. Instructions for AI
- When asked to "run the project", **always check `MASTER_GUIDE.md` first**.
- **Prefer the Render workflow** unless the user specifically asks for local offline dev.
- Do not hallucinate `api.js` in `mobile-app/src/config/`; the API URL is handled in `LoginScreen.js` state or `AsyncStorage`.
