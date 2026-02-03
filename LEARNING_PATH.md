# 🎓 Learning Path: Master Your Project

To fully master this "Shopify Mobile Builder" project and develop it independently, you don't need to know *everything* about programming. You just need to master the specific stack used here.

Here is your curriculum. Search these titles on YouTube or Google.

---

## 📱 1. Mobile Development (The "Face")
**Tech Stack**: React Native (via Expo)

### A. The Basics of UI
*   **Search Terms**: `"React Native Crash Course for Beginners"`, `"React Native Flexbox Tutorial"`
*   **Territory (What to learn)**:
    *   **Core Components**: `View`, `Text`, `Image`, `TouchableOpacity` (Buttons), `FlatList` (Scrolling lists).
    *   **Styling**: How `flex: 1`, `flexDirection: 'row'`, and `justifyContent` work. (This is 90% of making apps look good).
*   **Ignore for now**: Class Components, Native Modules (Java/Swift), Animations.

### B. State Management (The "Memory")
*   **Search Terms**: `"React Context API Tutorial"`, `"React Hooks useState useEffect"`
*   **Territory (What to learn)**:
    *   **useState**: How to save simple data (e.g., `isLoading`).
    *   **useEffect**: How to fetch data when the screen loads.
    *   **Context API**: This is how `CartContext.js` works. Learn how to pass data (like cart items) to the whole app without passing props manually.
*   **Ignore for now**: Redux, MobX, Zustand (Context is enough for this app).

### C. Navigation (Moving Screens)
*   **Search Terms**: `"React Navigation v6 Native Stack Tutorial"`, `"React Navigation Bottom Tabs"`
*   **Territory (What to learn)**:
    *   How to push a new screen (`navigation.navigate`).
    *   How to pass data to the next screen (e.g., `productId`).
    *   How to set up the Bottom Tabs.

---

## 🧠 2. Backend Development (The "Brain")
**Tech Stack**: Remix (React Framework) & Node.js

### A. The Framework
*   **Search Terms**: `"Remix Run Crash Course"`, `"Remix Loaders and Actions"`
*   **Territory (What to learn)**:
    *   **Loaders**: How to *get* data from the database when the page loads.
    *   **Actions**: How to *save* data when a form is submitted.
    *   **Routing**: How files in `app/routes/` become URLs automatically.
*   **Ignore for now**: Complex server rendering optimization, HTTP streaming.

### B. Shopify Integration
*   **Search Terms**: `"Shopify App Development with Remix"`, `"Shopify Polaris Tutorial"`
*   **Territory (What to learn)**:
    *   **Polaris**: Shopify's UI library (Cards, TextFields, Buttons). Learn to copy-paste their components.
    *   **Shopify Authentication**: Conceptually understand that `authenticate.admin(request)` checks if the user is a real merchant.

---

## 🗄️ 3. Data & API (The "Connection")
**Tech Stack**: Prisma (Database) & GraphQL (Shopify API)

### A. The Database
*   **Search Terms**: `"Prisma ORM Crash Course"`, `"Prisma Schema and Migrations"`
*   **Territory (What to learn)**:
    *   **schema.prisma**: How to define a new table (e.g., `model StoreConfig`).
    *   **Migrations**: Why you need to run `npx prisma migrate dev` when you change the schema.
    *   **Client**: How to use `db.storeConfig.findUnique()` and `.update()`.
*   **Ignore for now**: Raw SQL queries, complex database relations.

### B. Fetching Products
*   **Search Terms**: `"GraphQL vs REST for beginners"`, `"Shopify Storefront API GraphQL"`
*   **Territory (What to learn)**:
    *   **The Shape**: Understand that you ask for *exactly* what you want (e.g., `title`, `price`).
    *   **Authentication**: `X-Shopify-Storefront-Access-Token` is the key that opens the door.

---

## 🚀 4. Deployment (The "Launch")
**Tech Stack**: EAS (Expo Application Services)

*   **Search Terms**: `"Expo EAS Build Tutorial"`, `"Publish React Native App to Google Play Store"`
*   **Territory (What to learn)**:
    *   **app.json / app.config.js**: Where the App Name and Icon are defined.
    *   **EAS CLI**: Using `eas build` to create the file.
    *   **Signing**: Understanding that Android needs a "Keystore" and iOS needs a "Certificate" (EAS handles this, but good to know it exists).

---

## 💡 Top Tip for Self-Learning
Start small. Don't try to build a new feature immediately.
1.  **Break it**: Comment out a line of code and see what stops working.
2.  **Trace it**: Follow data. If you see a product title on screen, find where it came from in the code (`ProductListScreen` -> `fetchProducts` -> `api/shopify.js`).
