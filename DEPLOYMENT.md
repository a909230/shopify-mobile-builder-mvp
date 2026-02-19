# VM Deployment Guide

This guide explains how to deploy the **Mobile Builder Backend** to a Linux VM using Docker and Cloudflare Tunnel. This architecture allows for a stable, always-on backend URL for Shopify development.

## Prerequisites

*   A Linux VM (Ubuntu/Debian recommended) with public internet access.
*   `docker` and `docker-compose` installed on the VM.
*   SSH access to the VM.
*   **Shopify Partner Dashboard** access (to update App URL).

## Setup Instructions

### 1. Prepare the VM

SSH into your VM and clone the repository:

```bash
# Create a directory
mkdir -p ~/shopify
cd ~/shopify

# Clone the repo (replace with your repo URL)
git clone https://github.com/a909230/shopify-mobile-builder-mvp.git .

# Switch to the deployment branch
git checkout deploy/vm
```

### 2. Configure Environment Variables

Navigate to the backend directory and create the `.env` file:

```bash
cd mobile-builder-backend
nano .env
```

Paste the following configuration (get secrets from Shopify Partner Dashboard):

```env
NODE_ENV=production
PORT=3000
SHOPIFY_API_KEY=d44eecace7cd02de1912c3e434e270c9  # Client ID
SHOPIFY_API_SECRET=your_client_secret_here      # Client Secret
SCOPES=write_products,read_products,unauthenticated_read_product_listings
HOST=http://localhost  # Will be updated by Cloudflare Tunnel
```

### 3. Start the Application

Run the application using Docker Compose. This will start the Remix app and a Cloudflare Tunnel.

```bash
sudo docker compose up -d --build
```

*Note: The initial build might take 5-10 minutes depending on VM resources.*

### 4. Get the Public URL

Once the containers are running, retrieve the generated public URL from the tunnel logs:

```bash
sudo docker compose logs tunnel | grep "trycloudflare.com"
```

Copy the URL (e.g., `https://random-name.trycloudflare.com`).

### 5. Update Shopify Configuration

1.  Go to your **Shopify Partner Dashboard** -> **Apps** -> **mobile-builder-backend-2**.
2.  Go to **Configuration** (or **App setup**).
3.  Update the **App URL** to the tunnel URL you copied.
4.  Update **Allowed redirection URL(s)**:
    *   `https://[YOUR-URL]/auth/callback`
    *   `https://[YOUR-URL]/auth/shopify/callback`
    *   `https://[YOUR-URL]/api/auth/callback`
5.  Click **Save**.

## Troubleshooting

### Build is too slow?
If `npm install` hangs on the VM:
1.  Build the image locally on your Mac:
    ```bash
    docker build --platform linux/amd64 -t mobile-backend-vm .
    docker save mobile-backend-vm | gzip > mobile-backend.tar.gz
    scp mobile-backend.tar.gz user@vm-ip:~/shopify/mobile-builder-backend/
    ```
2.  Load it on the VM:
    ```bash
    docker load < mobile-backend.tar.gz
    ```
3.  Update `docker-compose.yml` to use `image: mobile-backend-vm` instead of `build: .`.

### Updates
To deploy code changes:
```bash
git pull
sudo docker compose up -d --build
```
