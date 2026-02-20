# 🚀 Deploying to Render (Free & No Card Required)

This guide explains how to deploy the **Mobile Builder Backend** to Render.com using their free tier. This is a great option if you cannot add a credit card.

## Limitations of Free Tier
1.  **Cold Starts**: The server will spin down after 15 minutes of inactivity. The first request after that will take ~50 seconds to load.
2.  **Database Expiry**: The free PostgreSQL database expires after 90 days (you can upgrade or migrate later).

## Deployment Steps

### 1. Push Code to GitHub
Ensure you have pushed this branch (`deploy/render`) to your GitHub repository.

### 2. Create Render Account
Go to [render.com](https://render.com) and sign up (GitHub login recommended). No credit card is required.

### 3. Create a Blueprint Instance
Render uses "Blueprints" (`render.yaml`) to deploy both the backend and database automatically.

1.  In the Render Dashboard, click **New +** -> **Blueprint**.
2.  Connect your GitHub repository (`shopify-mobile-builder-mvp`).
3.  Give the blueprint a name (e.g., `mobile-builder`).
4.  Click **Apply**.

### 4. Configure Environment Variables
Render will detect the `render.yaml` file and ask for the missing environment variables (marked as `sync: false`):

*   `SHOPIFY_API_KEY`: Your Client ID (`d44eecace7cd02de1912c3e434e270c9`).
*   `SHOPIFY_API_SECRET`: Your Client Secret (from Shopify Partner Dashboard).
*   `SHOPIFY_APP_URL`: Leave blank for now (we'll update it after deployment).

Click **Apply Changes**. Render will start creating your database and web service.

### 5. Get Your URL
Once the deployment finishes (green checkmarks):
1.  Go to the **Dashboard**.
2.  Click on the **Web Service** (e.g., `mobile-builder-backend`).
3.  Copy the URL at the top (e.g., `https://mobile-builder-backend-xyz.onrender.com`).

### 6. Update Configuration
1.  **Shopify Partner Dashboard**: Update App URL & Redirect URLs to your new Render URL.
2.  **Mobile App**: Update `src/config/api.js` (or wherever your API URL is defined) to point to the new backend.
3.  **Render Env Var**: Go back to Render -> Web Service -> Environment -> Edit `SHOPIFY_APP_URL` and paste your Render URL. Save.

### 7. Done!
Your app is now live. Remember the 50-second delay if you haven't used it in a while!
