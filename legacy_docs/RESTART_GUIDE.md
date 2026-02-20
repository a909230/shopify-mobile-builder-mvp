# 🚀 Reliable Restart Guide (USB Method)

This is the **most robust way** to run the project. It uses USB to connect your phone directly to your computer's localhost, avoiding all Wi-Fi and network firewall issues.

## Prerequisites
1.  **Android Phone** connected via USB.
2.  **USB Debugging** enabled on the phone.
3.  **ADB** installed and running (`adb devices` should show your phone).
4.  **Ngrok** installed and authenticated.

---

## 1. Start the Tunnel (Important!)
Since we use a custom domain to keep the app connection stable, you must start ngrok manually first.

1.  Open a terminal.
2.  Run:
    ```bash
    ngrok http 8081
    ```
3.  Keep this terminal open!
4.  Copy the `Forwarding` URL (e.g., `https://lutose-joyously-jasmine.ngrok-free.dev`).

---

## 2. Start the Backend (Port 8081)
The backend manages the Shopify connection.

1.  Open a **new** terminal.
2.  Run:
    ```bash
    cd mobile-builder-backend
    # Replace the URL below with YOUR ngrok URL from Step 1
    npm run dev -- --tunnel-url=https://lutose-joyously-jasmine.ngrok-free.dev:8081
    ```
3.  Wait until you see: `✅ Ready, watching for changes`.

**IMPORTANT**: If your ngrok URL changes (or you are using a new random one):
1.  You do **NOT** need to edit the code anymore.
2.  On the Mobile App Login Screen, tap **"Server Settings"**.
3.  Enter the new backend URL.

---

## 3. Connect Mobile to Localhost (The Magic Step)
We need to map the ports so your phone can "see" the computer's ports 8081 and 8083.

1.  Open a **new terminal**.
2.  Run these commands to route the ports:
    ```bash
    adb reverse tcp:8081 tcp:8081  # For Backend API
    adb reverse tcp:8083 tcp:8083  # For Expo Metro Bundler
    ```
    *(If `adb` is not found, you may need to install platform-tools or use the full path).*

---

## 4. Start the Mobile App (Port 8083)
We run the mobile app on port **8083** to ensure it doesn't conflict with the backend (which claims 8081).

1.  In the same terminal (or a new one), run:
    ```bash
    cd mobile-app
    npx expo start --localhost --port 8083 --reset-cache
    ```

---

## 5. Launch on Phone
1.  Open **Expo Go** on your phone.
2.  In the "Enter URL manually" field (or search bar), type:
    ```
    exp://localhost:8083
    ```
3.  Tap Connect.

**Success!** You should see the app load with the **Orange Header** ("Shop Products").

---

## Troubleshooting
*   **"Network Error" when logging in?**
    *   Check if backend is running on 8081.
    *   Run `adb reverse tcp:8081 tcp:8081` again.
    *   Verify the URL in "Server Settings" on the login screen matches your backend URL.
*   **"Failed to load profile" / Login Errors?**
    *   Go to your Shopify Admin > Apps > Mobile App Builder.
    *   Click **"Regenerate Token"** to ensure your token has the latest permissions (Customer Read/Write).
