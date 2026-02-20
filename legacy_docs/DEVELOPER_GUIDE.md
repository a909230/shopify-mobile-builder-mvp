# 📘 The Complete Developer's Guide to Shopify Mobile Builder

Welcome! This guide is designed to take you from "knowing a little code" to fully mastering this specific codebase. It breaks down every component, why it exists, how it works, and how to modify it.

---

## 🏗️ 1. Architecture Overview

This project is a **Hybrid App**:
1.  **Backend (`mobile-builder-backend/`)**:
    *   **Role**: The "Brain". It lives inside the Shopify Admin.
    *   **Tech Stack**: Remix (React framework), Node.js, Prisma (Database), SQLite.
    *   **Job**: It lets merchants configure their app (colors, home screen) and generates the Access Tokens needed for the mobile app to talk to Shopify.

2.  **Mobile App (`mobile-app/`)**:
    *   **Role**: The "Face". This is what customers install on their phones.
    *   **Tech Stack**: React Native (Expo).
    *   **Job**: It fetches products from Shopify, handles the cart, and lets users check out.

---

## 📱 2. The Mobile App (React Native)

Located in `mobile-app/`. This is where the magic happens for the shopper.

### A. How it Starts (`App.js`)
*   **What it is**: The entry point.
*   **Key Logic**:
    1.  Checks `src/config/build.js`: Is this a White Label app? (Baked-in config)
    2.  If NO (Preview Mode): Checks `AsyncStorage` (Saved login).
    3.  If neither: Shows `LoginScreen`.
    4.  Once configured: Wraps the app in `ThemeProvider` and `CartProvider`.

### B. Navigation (`src/navigation/MainNavigator.js`)
*   **What it is**: The "Router". It defines the tabs at the bottom (Home, Cart, Account).
*   **How to change**: Want a "Search" tab? Add a `<Tab.Screen name="Search" ... />` here.

### C. Screens (`src/screens/`)
*   `ProductListScreen.js`: Fetches products. Uses a `FlatList` to scroll. Renders the **Dynamic Header** (Banner/Title) based on the theme.
*   `ProductDetailsScreen.js`: Shows big image, price, and "Add to Cart" button.
*   `CartScreen.js`: Lists items in `CartContext`. The "Checkout" button calls the API to get a web URL.
*   `AccountScreen.js`: Handles Customer Login. Fetches order history using the `customerAccessToken`.

### D. Data & API (`src/api/shopify.js`)
*   **What it is**: The bridge to Shopify.
*   **How it works**: It sends GraphQL queries to `https://{shop}/api/2024-01/graphql.json`.
*   **Crucial**: It needs `X-Shopify-Storefront-Access-Token` in the header. If this token is wrong, nothing loads.

### E. Configuration (`src/config/`)
*   `customer.json`: The "Source of Truth" for white-label builds.
*   `build.js`: The file the app *actually* imports. It's either null (Preview) or the content of `customer.json` (White Label).
*   `app.config.js`: Expo's configuration file. It reads `customer.json` to dynamically set the App Name and Bundle ID during build.

---

## 🛠️ 3. The Backend (Remix)

Located in `mobile-builder-backend/`. This is the admin panel.

### A. The Database (`prisma/schema.prisma`)
*   **What it is**: The blueprint for your data.
*   **Key Model**: `StoreConfig`. This table stores the settings for each shop (Logo, Colors, Banner, Token).
*   **How to change**:
    1.  Edit `schema.prisma` (e.g., add `instagramUrl String?`).
    2.  Run `npx prisma migrate dev --name add_instagram`.
    3.  This updates the actual `dev.sqlite` database file.

### B. The Admin UI (`app/routes/app._index.jsx`)
*   **What it is**: The dashboard page merchants see in Shopify Admin.
*   **Tech**: Uses **Polaris** (Shopify's UI library).
*   **Logic**:
    *   `loader`: Fetches current config from the DB.
    *   `action`: Saves form submissions back to the DB.
    *   **Tip**: If you add a new field to the DB, you must add a `<TextField>` here and update the `action` to save it.

### C. The API (`app/routes/api.validate-code.jsx`)
*   **What it is**: The endpoint the mobile app calls to log in.
*   **Job**: Takes a `code` (e.g., "123456") -> Finds the shop in DB -> Returns the `StoreConfig` (including the secret Token).

---

## 🚀 4. Workflow: From Scratch to Publish

### Step 1: Development
1.  **Start Backend**: `npm run dev` (in backend folder). *Remember `ngrok http 8081` first!*
2.  **Start Mobile**: `npx expo start` (in mobile folder).
3.  **Connect**: Enter code in mobile app.
4.  **Edit**: Change `ProductListScreen.js`, save, and watch it update instantly on your phone.

### Step 2: Adding a Feature (Example: "Dark Mode")
1.  **Backend**: Add `darkMode Boolean` to `schema.prisma`. Migrate DB. Add checkbox to Admin UI.
2.  **Mobile**: Update `ThemeContext.js` to read `darkMode`. Update styles to use black background if true.

### Step 3: White Label Build
1.  **Configure**: `npm run configure 123456` (Fetches merchant data).
2.  **Build**: `eas build` (Compiles the binary).
3.  **Submit**: `eas submit` (Uploads to App Store).

---

## 📚 5. Glossary / Concepts

*   **GraphQL**: The language used to talk to Shopify. Instead of "Get all data", you say "Get exactly the title and price".
*   **Storefront Access Token**: A public key that allows reading products. Safe to store in the mobile app.
*   **Admin Access Token**: A private key the Backend uses. NEVER put this in the mobile app.
*   **AsyncStorage**: The mobile app's "Local Storage". Used to remember the user's login.
*   **Context (React)**: A way to share data (like the Cart or Theme) to every screen without passing it down manually.

---

## 🆘 Troubleshooting

*   **"Network Error"**: Did you start ngrok? Is the URL in `LoginScreen` correct?
*   **"Unauthorized"**: Did you Regenerate the Token in the Admin Dashboard?
*   **"App crash on launch"**: Did you leave `isWhiteLabel: true` in `customer.json` while trying to run in Expo Go? (Reset it to false).
