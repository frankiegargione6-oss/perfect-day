# Perfect Day Prototype v0.10

## New in v0.8

1. Feels Like now uses NWS heat index / wind chill directly:
   - `NWS Heat Index`
   - `NWS Wind Chill`
   - `Actual Temp`

2. Shareable final card:
   - Visual card inside the build panel
   - Copy build text
   - Download card button

3. Weather icons:
   - Icons on attributes
   - Main icon on the weather card and share card

4. One re-spin per game:
   - One Region Re-spin
   - One City Re-spin
   - Once used, you have to take what the wheel gives

## How to run

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

Do not double-click `index.html`; the local server has to be running.


## v0.10 changes

- Fixed NWS wind speed/gust conversion from km/h to mph.
- Final card now pops up centered when the build is complete.
- Added a generated share link using the URL hash.
- Added modal buttons for copying the link, copying build text, and downloading the card.
