# Worship Slides (chc-vc.vercel.app)

Turns our song library into lyric slides and shows them on a TV.
The laptop (or phone) runs the slides; the TV follows.

- `index.html`, `css/`, `js/` — the site (no build step)
- `data/songs.json` — song library, cleaned from the VizStage song folder
- `api/parse.js` — reads pasted words / files and sorts them into verse, chorus, bridge (Gemini)
- `api/admin.js` — admin: add people, reset passwords, switch off, remove
- `firestore.w252f.rules` — the database rules added for this app (the Firebase project is shared with other apps)

Vercel settings needed: `FIREBASE_SERVICE_ACCOUNT` (the service account JSON) and `GEMINI_KEYS` (comma separated).
Never commit key files. The old lyrics converter lives on the `archive/lyrics-converter` branch.
