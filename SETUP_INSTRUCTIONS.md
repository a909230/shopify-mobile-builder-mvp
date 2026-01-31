# Shopify Mobile App Builder MVP - Setup Instructions

## 1. Scaffold the Shopify App (Backend)

Because this requires logging into your Shopify Partner account, please run the following command in your terminal:

```bash
npm init @shopify/app@latest -- --name=shopify-backend --template=remix --path=.
```

- When asked, select your **Shopify Partner Organization**.
- If asked to create a new app, say **Yes** and give it a name (e.g., "Mobile App Builder").

## 2. Database Setup (Prisma + Postgres)

Once the Shopify app is scaffolded, navigate into the directory and set up Prisma.

1.  **Navigate to the backend folder:**
    ```bash
    cd shopify-backend
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
    cd shopify-backend
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
