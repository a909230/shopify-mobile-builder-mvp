# 🚀 White Label Publishing Guide

This guide explains how to build and publish a standalone app for a specific merchant to the Google Play Store and Apple App Store.

## Prerequisites
1.  **Expo Account**: You need an account on [expo.dev](https://expo.dev).
2.  **EAS CLI**: Installed via `npm install -g eas-cli`.
3.  **Google Play Developer Account**: ($25 fee)
4.  **Apple Developer Account**: ($99/year fee)

---

## 1. Configure the App for a Merchant
Before building, you must "inject" the merchant's settings into the code.

1.  Open a terminal in `mobile-app/`.
2.  Run the builder script with the merchant's **Store Code**:
    ```bash
    npm run configure 123456
    ```
3.  This will:
    *   Fetch config from your backend.
    *   Update `app.config.js` with the App Name and Bundle ID (e.g., `com.mobilebuilder.mystore`).
    *   Update `src/config/build.js` with API keys and colors.

---

## 2. Build for Android

You have two options for building the Android app:

### Option A: Build APK (For Testing/Sideloading)
Use this if you want to install the app on your own device without using the Play Store.

1.  **Run the Build**:
    ```bash
    eas build --platform android --profile preview
    ```
2.  **Download & Install**:
    *   EAS will provide a link to download the `.apk` file.
    *   Download this file to your Android phone and install it.

### Option B: Build AAB (For Google Play Store)
Use this when you are ready to publish to the store.

1.  **Login to EAS** (if not already):
    ```bash
    eas login
    ```

2.  **Run the Build**:
    ```bash
    eas build --platform android --profile production
    ```

3.  **Keystore Handling**:
    *   **First time?** EAS will ask if you want to generate a new Keystore. Say **YES**.
    *   **Update?** EAS will automatically use the stored keystore for this Bundle ID.

4.  **Wait**:
    *   The build runs in the cloud. You will get a download link for an `.aab` (Android App Bundle) file when done.

---

## 3. Submit to Google Play

You can automate the upload process using `eas submit`.

1.  **One-Time Setup**:
    *   Go to Google Cloud Console -> IAM & Admin -> Service Accounts.
    *   Create a Service Account with "Service Account User" role.
    *   Create a JSON Key and download it as `google-service-account.json`.
    *   Go to Google Play Console -> Users & Permissions -> Invite New User.
    *   Invite the service account email with "Admin" permissions.

2.  **Submit**:
    ```bash
    eas submit -p android --latest --key /path/to/google-service-account.json
    ```

3.  **Release**:
    *   Go to Google Play Console.
    *   You will see the new release in the **Internal Testing** track.
    *   Promote it to Production when ready.

---

## 4. Build for iOS (App Store)

1.  **Run the Build**:
    ```bash
    eas build --platform ios --profile production
    ```

2.  **Credentials**:
    *   EAS will ask you to log in with your Apple ID.
    *   It will automatically generate the **Provisioning Profile** and **Distribution Certificate**.

3.  **Submit**:
    ```bash
    eas submit -p ios --latest
    ```
    *   This uploads the binary to **TestFlight** (App Store Connect).

---

## 5. Reset to Preview Mode
After you are done building for a client, reset the codebase so you can continue development.

1.  Open `src/config/customer.json` and set:
    ```json
    { "isWhiteLabel": false }
    ```
2.  The app will now revert to the generic "Mobile Builder" preview app.
