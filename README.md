# Shopify Mobile Builder (MVP)

This repo will contain:

- A **Shopify embedded app** (merchant-facing) that lets a store configure branding/home layout and generates a **store code + QR**.
- A **consumer mobile app** (customer-facing) where customers **scan QR or enter a code** to shop that store and checkout in a webview.

## Product decisions (locked for MVP)

- Invite-only store access: **QR + short code**
- Mobile: **React Native (Expo)**
- Merchant app/backend: **Node.js (Remix)**
- DB: **PostgreSQL (via Prisma)**
- Checkout: **Shopify checkout in webview**
- Language: **English only**
- Pricing: **Free**

## Folder layout (planned)

- `shopify-app/` — embedded admin app + backend API
- `mobile-app/` — Expo app
- `assets/` — screenshots, listing assets, logos
- `docs/` — reviewer instructions, privacy policy drafts, etc.

