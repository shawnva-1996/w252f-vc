# Executor handoff — Christmas 2026 backgrounds (W252F-VC)

## Objective
Create a maintainable inventory of the 14 visually distinct Christmas worship styles from the Instagram carousel, secure **licensed** originals where actually available, and (as an alternative) produce newly generated media matching the described design grammar.

## Source-of-truth and rights
- Repo: `shawnva-1996/w252f-vc`
- Canonical design guide: `docs/christmas-2026/instagram-sundayscreens-visual-spec.md`
- Rights checklist: `docs/christmas-2026/ASSET_ACQUISITION.md`
- Public collection directory: https://sundayscreens.com/worship-backgrounds
- Vendor terms: https://sundayscreens.com/terms
- Instagram reference: https://www.instagram.com/p/Dfhkm87ljps/
- **Never** put any mcp_token, access key, magic link, browser cookie, authenticated download link, or user information in GitHub files/logs.

## Phase A — Determine whether an authorized download is possible
1. Inspect provider terms and the actual entitlement of the **church account**, including church entity, campus/site count and plan.
2. Ask for human-assisted login only when needed; never bypass gates or try random CDN URLs.
3. Confirm whether the source is an actual downloadable file rather than a preview. Record collection and style ID for each download.
4. Respect copyright and membership scope. Do not mirror the entire commercial catalogue into GitHub.
5. If no account/license or unclear permission, stop acquisition and proceed with independent original content generation, clearly labeled as such.

## Phase B — Download only entitled originals
1. Retrieve only files explicitly offered by the signed-in account / public free-download feature.
2. Use provider-supplied download URLs as ephemeral local URLs; don't persist query parameters.
3. Inventory exact filenames, file sizes, HD/4K resolution, MP4/ProRes/still format, duration, provider product URL, acquisition date, SHA256.
4. Store originals in GitHub **only** if vendor authorizes this repository's contributor/storage/access context. Otherwise leave binaries offline or in provider-authorized church private storage and track non-sensitive filenames/metadata here.
5. GitHub source-of-truth should link to the authorized storage folder through relative metadata / internal references; avoid copying paid files into public issues, PRs, CI artifacts or logs.

## Phase C — Generate 14 original alternatives (approved rights approach)
1. Read all individual SS01–SS14 prompt recipes from `instagram-sundayscreens-visual-spec.md`.
2. Use Gemini/image generation to make 16:9 4K high-quality first frames **without copying the provider's artwork frame-for-frame**.
3. Have an operator review first frames. For generative typography SS08, render the exact word JESUS as editable overlay rather than trusting video text rendering.
4. Animate approved stills into 8–12-second subtle 30 fps seamless motion using the repo's existing GitHub Actions and/or available Cloudflare image-video resources; inspect existing scripts first instead of inventing pipeline commands.
5. FFmpeg checks: ffprobe width/height/fps/duration, detect excessive brightness and flicker, compare first and last frame (SSIM), create low-size preview MP4 and poster images.
6. Capture prompt, negative prompt, seed, model, prompt-version and date in a machine-readable manifest. Track independent AI outputs clearly; do not label them originals.
7. Preserve lyrics-safe negative space; test contrast in the live W252F-VC presenter.
8. Never bulk upload output assets without checking size limits, storage charges and rights, and obtaining approval before publication/distribution.

## Agent deliverables
- `manifest.csv`: one line per source or generated asset, status + rights, no secrets.
- `generated/`: ONLY independently generated and approved, repo-appropriate media; larger clips in approved object storage.
- Repo docs updated with exact final paths, valid media dimensions, visual review evidence and source licensing.
- A concise completion report distinguishing ORIGINAL SOURCE / LICENSED / AI-ORIGINAL / PREVIEW-ONLY / NOT AVAILABLE.
