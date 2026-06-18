# Perfect Day Prototype v0.12

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

## v0.11 changes

- Removed Feels Like as a standalone draft slot.
- Removed Humidity as a standalone draft slot.
- Removed Sunset as a standalone draft slot.
- Temperature now shows Feels Like as a paired detail.
- Dew Point now shows Relative Humidity as a paired detail.
- Draft now has 7 slots instead of 10.

## v0.12 changes

- Fixed final card download using a canvas-generated PNG.
- On mobile, the download button uses the native share sheet when supported, which can save to Photos/Camera Roll.
- If a city returns broken/missing NWS data, the game automatically re-spins without using the player's region/city re-spin.
