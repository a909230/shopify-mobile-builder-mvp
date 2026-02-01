# How to Restart Your Development Environment

Since you are using `ngrok` (which changes URLs every time you restart) and a local backend, you need to follow this specific order to get everything running again.

## 1. Start the Tunnel (ngrok)
Open a terminal and run:
```bash
ngrok http 8081
```
**Copy the HTTPS URL** it generates (e.g., `https://a1b2-c3d4.ngrok-free.app`).
*Keep this terminal open.*

## 2. Start the Backend
Open a **new terminal tab** (`Cmd+T`), navigate to the backend, and start it using your **new** ngrok URL:
```bash
cd ~/Desktop/Shopify/mobile-builder-backend
npm run dev -- --tunnel-url=PASTE_YOUR_NGROK_URL_HERE:8081
```
*(Example: `npm run dev -- --tunnel-url=https://a1b2-c3d4.ngrok-free.app:8081`)*
*Keep this terminal open.*

## 3. Update the Mobile App
Open the file `mobile-app/src/screens/LoginScreen.js` in your editor.
Update line 6 with your new URL:
```javascript
const API_URL = 'https://YOUR-NEW-NGROK-URL.ngrok-free.app';
```
*(Save the file).*

## 4. Start the Mobile App (USB Recommended)
Since WiFi connection was unstable, **use a USB cable** for your Android phone.
1. Connect Android phone to Mac via USB.
2. Enable "USB Debugging" on phone (Settings > Developer Options).
3. Run this command in a new terminal tab:
```bash
cd ~/Desktop/Shopify/mobile-app
npx expo start
```
4. Press **`a`** in the terminal to launch on Android.

## 5. Test
- If you are logged out, enter the Invite Code again.
- If you are logged in, it should load the store.

---
**Troubleshooting:**
- If the backend says "Invalid Tunnel URL", make sure you added `:8081` at the end of the URL in the `npm run dev` command.
- If the mobile app says "Network Error", double-check you pasted the correct URL in `LoginScreen.js`.
