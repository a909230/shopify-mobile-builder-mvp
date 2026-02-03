# Shopify Mobile App Builder

A solution to let Shopify merchants build their own native mobile app.

- **Backend**: Remix app (Node.js) embedded in Shopify Admin.
- **Mobile**: React Native (Expo) app for shoppers.

## 🚀 Quick Start (Development)

**See [RESTART_GUIDE.md](./RESTART_GUIDE.md) for the detailed, error-proof setup guide.**

### Summary
1.  **Tunnel**: `ngrok http 8081` (Copy the https URL).
2.  **Backend**:
    ```bash
    cd mobile-builder-backend
    npm run dev -- --tunnel-url=YOUR_NGROK_URL:8081
    ```
3.  **USB Connection**:
    ```bash
    adb reverse tcp:8081 tcp:8081
    adb reverse tcp:8083 tcp:8083
    ```
4.  **Mobile App**:
    ```bash
    cd mobile-app
    npx expo start --localhost --port 8083 --reset-cache
    ```

4.  **Phone**: Open Expo Go and connect to `exp://localhost:8083`.

## MVP Flow
1.  Merchant installs Shopify app.
2.  Merchant configures branding (Logo, Color).
3.  App generates a **Store Code** (e.g., `123456`).
4.  Shopper downloads the generic "Mobile Builder" app.
5.  Shopper enters the Store Code.
6.  App re-skins itself to match the merchant's branding and loads their products natively.

## Documentation
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md): **Start Here!** Comprehensive guide to understanding and mastering the codebase.
- [RESTART_GUIDE.md](./RESTART_GUIDE.md): How to run the dev environment locally.
- [PUBLISHING.md](./PUBLISHING.md): How to build & publish white-label apps for clients.
- [PROJECT_NOTES.md](./PROJECT_NOTES.md): Current project status and roadmap.
