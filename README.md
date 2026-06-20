# Perfect Day Prototype v0.16

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

## v0.14 changes

- Clean fix from the last working build.
- Game now actually uses 7 draft slots.
- Temperature card includes Feels Like underneath.
- Dew Point card includes RH underneath.
- Removed Feels Like, Humidity, and Sunset from the playable draft board.

## v0.15 changes

- Removed Wind Direction from the playable draft.
- Draft now has 6 variables.
- Added Everyday scoring out of 100.
- Added score tier to the final share card.

## v0.16 changes

- If the final remaining variable is missing and both player re-spins are already used, the game automatically re-rolls so the game can be completed.
- Picked attributes now show the city name instead of the abbreviation / airport station code.
- Leaderboard/accounts are not included yet; those require a database/auth backend.


## v0.19 changes

- Removed the large account box from the game page.
- Added a standard top navigation bar.
- Added separate pages for Sign Up, Log In, Leaderboard, Past Games, and Profile.
- Leaderboard link uses a chart icon. Past Games link uses a clock/history icon.
- Logged-in users see their username in the top-right profile button.


## v0.19.2
- Fixed login hang caused by Supabase auth state callback awaiting profile/database calls during sign-in.


## v0.19 changes

- Added XP and leveling based on lifetime score XP.
- Added mode-specific leaderboard dropdown.
- Leaderboard now shows top 20 first, highlights your row, and shows your position if below top 20.
- Added dark mode toggle saved locally.
- Added Achievements page.
- Final missing-variable auto-reroll now triggers whenever the final slot is missing.


## v0.24 changes

- Expanded to 142 city/METAR locations.
- Added new weighted scoring formulas for Everyday, Summer, Winter, Beach, Golf, Tailgate, Severe Weather, and Worst Day.
- Updated all mode dropdowns to the new mode list.
- No new Supabase SQL required.
