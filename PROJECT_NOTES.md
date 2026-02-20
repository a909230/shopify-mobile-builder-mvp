## Status
- Project folder: `/Users/rbr/Desktop/Shopify`

## MVP flow
1. Merchant installs Shopify app
2. Merchant configures branding + featured collections
3. App shows store **code + QR**
4. Customer uses mobile app, enters code or scans QR
5. Customer browses products and checks out via Shopify checkout (webview)
6. **New**: Native Shopping Cart & Checkout Flow implemented.
7. **New**: Native Account Screen (Login & Order History) implemented.
8. **New**: Dynamic Theming (Primary Color) implemented.
9. **New**: Dynamic Homepage (Banner, Title) configured via Admin.
12. **New**: API Version synchronized to `2026-01` and Scopes handling improved.

## Documentation
- See `PUBLISHING.md` for the complete guide on building and submitting apps to Google Play and the App Store.

## White Label Build Process
1. Run `npm run configure <STORE_CODE>` in `mobile-app/`.
2. This fetches config from backend and updates `src/config/customer.json`.
3. Run `eas build` to generate the standalone app for that customer.
- Shopify Partner org:
- Shopify App name:
- App URL:
- Allowed redirect URLs:
- Privacy policy URL:
- Support email:
