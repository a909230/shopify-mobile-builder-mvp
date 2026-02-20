# Shopify Mobile App Builder

A solution to let Shopify merchants build their own native mobile app.

- **Backend**: Remix app (Node.js) embedded in Shopify Admin.
- **Mobile**: React Native (Expo) app for shoppers.

## 🚀 Quick Start (Development)

**See [FLY_DEPLOY.md](./FLY_DEPLOY.md) for the Cloud-First setup guide.**

### Summary
1.  **Backend**: `npm run dev`
2.  **Mobile App**:
    ```bash
    cd mobile-app
    npx expo start --localhost --port 8083 --reset-cache
    ```

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
