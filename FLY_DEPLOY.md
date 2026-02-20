# 🚀 Deploying to Fly.io (Free & Fast)

This guide explains how to deploy the **Mobile Builder Backend** to Fly.io using a persistent volume for the SQLite database. This ensures:
1.  **Zero Cost**: Uses Fly's free tier.
2.  **No Cold Starts**: Keeps the machine running (unlike Render).
3.  **Persistence**: Your database survives restarts.

## Prerequisites

1.  **Install Fly CLI**:
    *   **Mac**: `brew install flyctl`
    *   **Windows**: `iwr https://fly.io/install.ps1 -useb | iex`
    *   **Linux**: `curl -L https://fly.io/install.sh | sh`
2.  **Login**:
    ```bash
    fly auth login
    ```
    *(Follow the browser prompt to sign up/login)*

## Deployment Steps

### 1. Navigate to Backend Folder
```bash
cd mobile-builder-backend
```

### 2. Launch the App (First Time Only)
Run this command to create the app on Fly. When prompted:
*   **Do NOT** set up a Postgres database (we use SQLite).
*   **Do NOT** set up Redis.
*   **Select "N"** (No) if asked to deploy immediately.

```bash
fly launch --no-deploy
```

### 3. Create the Persistent Volume
Create a 1GB volume named `sqlite_data` in your region (e.g., `iad` for US East, `lhr` for London). Match the region in `fly.toml`.

```bash
fly volumes create sqlite_data --region iad --size 1
```

### 4. Set Secrets
Set your Shopify API credentials as secrets (never commit these to Git!).

```bash
fly secrets set SHOPIFY_API_KEY=YOUR_CLIENT_ID SHOPIFY_API_SECRET=YOUR_CLIENT_SECRET SCOPES=write_products,read_products,unauthenticated_read_product_listings
```

### 5. Deploy
Now deploy the application. This will build the Docker image and start the server with the volume attached.

```bash
fly deploy
```

### 6. Get Your URL
Once deployed, get the public URL:

```bash
fly info
```
Copy the `Hostname` (e.g., `https://mobile-builder-backend.fly.dev`).

### 7. Update Shopify & Mobile App
1.  **Shopify Partner Dashboard**: Update App URL & Redirect URLs to your new `https://...fly.dev` address.
2.  **Mobile App**: Update `src/config/api.js` (or wherever your API URL is defined) to point to the new backend.
