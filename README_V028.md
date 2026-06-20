# v0.28 — Installable App / PWA Update

Added Progressive Web App support so Perfect Day can be installed from a mobile browser.

## Added
- `manifest.json`
- app icons for Android/iOS home screen
- `sw.js` service worker
- `pwa.js` registration/install helper
- homepage install banner on supported browsers
- Apple mobile web app tags
- theme color / standalone display

## How to test
1. Deploy to Render.
2. Open the site on your phone.
3. On iPhone Safari: Share → Add to Home Screen.
4. On Android Chrome: Install app / Add to Home screen.

No Supabase SQL required.
