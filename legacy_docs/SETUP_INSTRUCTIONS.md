# Shopify Mobile App Builder MVP - Setup Instructions

## 1. Scaffold the Shopify App (Backend)

The backend is located in `mobile-builder-backend`.

## 2. Database Setup (Prisma + Postgres)

1.  **Navigate to the backend folder:**
    ```bash
    cd mobile-builder-backend
    ```


2.  **Install Prisma:**
    ```bash
    npm install prisma --save-dev
    npm install @prisma/client
    ```

3.  **Initialize Prisma:**
    ```bash
    npx prisma init
    ```

4.  **Configure Database URL:**
    Open `shopify-backend/.env` and set your `DATABASE_URL`.
    Example: `DATABASE_URL="postgresql://user:password@localhost:5432/shopify_app?schema=public"`

5.  **Define Schema:**
    Edit `shopify-backend/prisma/schema.prisma` to add your models (Store, User, etc.).

## 3. Mobile App (Consumer App)

The mobile app has been scaffolded for you in the `mobile-app` directory.

To run it:
```bash
cd mobile-app
npx expo start
```

## 4. Connecting Mobile App to Backend

You will need to expose your local backend to the internet (Shopify CLI does this automatically with Cloudflare tunnels) and use that URL in your mobile app.

1.  **Start Shopify App:**
    ```bash
    cd mobile-builder-backend
    npm run dev
    ```
    Copy the URL provided (e.g., `https://random-name.trycloudflare.com`).

2.  **Update Mobile App Config:**
    Create a `config.js` or `.env` in `mobile-app` with the `API_URL`.

## Next Steps for Development

1.  **Implement Invite Logic:**
    - Create a `Store` model in Prisma with a `shortCode` field.
    - Create an API route in Remix to validate the code.

2.  **Implement Mobile App Login:**
    - Build a screen in React Native to input the code.
    - Fetch store details from the backend.
