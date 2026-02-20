# 📘 Master Guide: Shopify Mobile App Builder

This is the **comprehensive, integrated guide** for the Shopify Mobile App Builder. It covers architecture, setup, running, and deployment.

**Status**: MVP Complete
**Tech Stack**: Remix (Backend) + React Native Expo (Mobile)

---

## 1. Quick Start (The "Happy Path")

We recommend running the **Backend on Render (Cloud)** and the **Mobile App Locally**. This avoids complex firewall/tunneling issues.

### Prerequisites
1.  **Node.js** & **npm** installed.
2.  **Android Phone** connected via USB (with Debugging ON).
3.  **Render Account** (Free) with Backend deployed (see Section 3 if not done).

### Daily Run Instructions
1.  **Connect Phone**: Connect USB.
2.  **Terminal 1 (Mobile Networking)**:
    ```bash
    adb reverse tcp:8083 tcp:8083
    ```
3.  **Terminal 2 (Start Mobile App)**:
    ```bash
    cd mobile-app
    npx expo start --localhost --port 8083 --reset-cache
    ```
4.  **On Phone**:
    - Open **Expo Go**.
    - Connect to `exp://localhost:8083`.
    - On the **Login Screen**, tap **"Server Settings"**.
    - Enter your **Render Backend URL** (e.g., `https://your-app.onrender.com`).
    - Enter Invite Code to login.

---

## 2. Architecture Overview

This solution consists of two distinct parts that talk to each other.

### A. The Backend (`mobile-builder-backend/`)
- **What it is**: A Shopify Embedded App (Remix).
- **Where it lives**: Shopify Admin Dashboard.
- **Responsibilities**:
  - managing `StoreConfig` (Logo, Colors, Home Screen settings).
  - Generating and storing the **Storefront Access Token**.
  - Providing an API (`/api/validate-code`) for the mobile app to fetch this config.
- **Database**: Prisma (SQLite for Local, Postgres for Render).

### B. The Mobile App (`mobile-app/`)
- **What it is**: A React Native (Expo) app.
- **Where it lives**: Shopper's phone.
- **Responsibilities**:
  - **Login**: Connects to Backend to get `StoreConfig` (Branding + Token).
  - **Shopping**: Connects **directly** to Shopify Storefront API (using the Token) to fetch products/cart.
  - **Branding**: Applies colors/logos dynamically based on `StoreConfig`.

---

## 3. Backend Setup: Cloud (Render) vs. Local

Choose ONE path. **Cloud (Render)** is recommended for stability.

### Path A: Cloud (Render) - RECOMMENDED
See [RENDER_DEPLOY.md](legacy_docs/RENDER_DEPLOY.md) for granular details, but in summary:
1.  Push code to GitHub.
2.  Create **New Blueprint** on Render.com linked to your repo.
3.  Set Environment Variables:
    - `SHOPIFY_API_KEY` / `SECRET` (From Shopify Partners).
    - `SHOPIFY_APP_URL` (Your Render URL).
4.  Update Shopify Partner Dashboard with the new Render URL.
5.  **Pros**: No Ngrok, no timeouts, accessible from anywhere.

### Path B: Local (Ngrok) - DEV ONLY
Use this if you are actively editing backend code and need hot-reloading.
1.  **Start Tunnel**:
    ```bash
    ngrok http 8081
    ```
    *Copy the forwarding URL (e.g., `https://xyz.ngrok-free.app`).*
2.  **Start Backend**:
    ```bash
    cd mobile-builder-backend
    npm run dev -- --tunnel-url=https://xyz.ngrok-free.app
    ```
3.  **Networking**:
    ```bash
    adb reverse tcp:8081 tcp:8081  # Required so phone can see backend
    ```

---

## 4. Mobile App Development

Located in `mobile-app/`.

### Key Files
- `src/screens/LoginScreen.js`:
  - Handles the initial connection.
  - **Important**: This is where you set the Backend URL.
- `src/api/shopify.js`:
  - Contains all GraphQL queries (Products, Collections, Cart).
  - Reads `storeConfig` from AsyncStorage to get the Access Token.
- `src/config/customer.json`:
  - Used *only* for White-Label builds (ignored in Expo Go / Preview Mode).

### Troubleshooting
- **"Network request failed"**:
  - If Local Backend: Did you run `adb reverse tcp:8081 tcp:8081`?
  - If Cloud Backend: Is the URL correct in "Server Settings"? (No trailing slash).
- **"Unauthorized"**:
  - The Shopify Token might be stale. Go to **Shopify Admin > Apps > Mobile Builder** and click **"Regenerate Token"**.

---

## 5. White Label Publishing
To build a standalone APK/IPA for a client:
1.  Run `npm run configure <invite-code>` in `mobile-app/`.
    - This fetches the config and bakes it into `src/config/customer.json`.
2.  Run `eas build --platform android`.
3.  Submit to store.
*(See `legacy_docs/PUBLISHING.md` for full details).*
