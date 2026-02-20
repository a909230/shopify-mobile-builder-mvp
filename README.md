# Shopify Mobile App Builder

A solution to let Shopify merchants build their own native mobile app.

- **Backend**: Remix app (Node.js) embedded in Shopify Admin.
- **Mobile**: React Native (Expo) app for shoppers.

## 📚 Documentation
- **[MASTER_GUIDE.md](./MASTER_GUIDE.md)**: **Start Here!** The complete guide to setup, running, and architecture.
- **[RESUME_PROMPT.md](./RESUME_PROMPT.md)**: Context file for AI assistants to quickly understand the project.

## 🚀 Quick Summary
1.  **Backend**: We recommend deploying the backend to **Render** (Free Tier) for a stable API.
2.  **Mobile**: Run locally with Expo.
    ```bash
    # 1. Connect Android Phone via USB
    adb reverse tcp:8083 tcp:8083

    # 2. Start App
    cd mobile-app
    npx expo start --localhost --port 8083 --reset-cache
    ```
3.  **Connect**: Open Expo Go, enter your Render Backend URL in settings, and login.

*For detailed instructions, see the [MASTER_GUIDE.md](./MASTER_GUIDE.md).*
