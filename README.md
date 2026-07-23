# FreeShow Lyrics Converter

Turns lyric sheets (`.pptx`, `.docx`, `.txt`, or pasted text) into
[FreeShow](https://freeshow.app)-ready slide text — verses, choruses and
bridges wrapped in `[BRACKET]` headers, long lines split at a natural pause.

Static site, no backend, no build step. `.pptx`/`.docx` files are unzipped
and parsed client-side with [JSZip](https://stuk.github.io/jszip/); nothing
is ever uploaded anywhere.

This is a browser port of the original Streamlit tool at `Scripts/app.py`
in the `vc_ai` repo — same parsing/formatting logic, ported to
`js/parser.js` and `js/extract.js`.

## Run locally

Any static file server works, e.g.:

```
npx serve .
```

## Deploy

Deploys as-is to Vercel, Netlify, GitHub Pages, or any static host — there's
nothing to build.
