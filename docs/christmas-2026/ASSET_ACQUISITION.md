# Sunday Screens — asset acquisition and license checklist

**Last verified:** 2026-11-10
**Instagram reference:** https://www.instagram.com/p/Dfhkm87ljps/
**Catalogue:** https://sundayscreens.com/worship-backgrounds
**Terms:** https://sundayscreens.com/terms
**Access query token:** deliberately NOT saved or committed. Treat it as a bearer-style credential. Never paste it into GitHub Actions workflow inputs, issues, repository contents, source logs, or public web pages.

## Status

- [x] Original Instagram carousel visually inspected (all nine slides; 14 styles).
- [x] Official provider and catalogue discovered.
- [x] AI design prompts and collection-candidate links documented.
- [ ] Confirm whether the recipient church has the proper Sunday Screens membership/license and permitted physical site(s).
- [ ] Sign in on the provider website and confirm which exact collections/files the church account may download.
- [ ] Download authorized HD/4K MP4/JPEG files from the account's own download controls; do not bypass any gated purchase or license check.
- [ ] Inspect downloaded file inventory (paths, filename, size, format, SHA-256), and separately document license proof.
- [ ] Confirm the vendor permits placing asset binaries inside the exact private GitHub repo with its existing collaborator and backup access controls before committing originals.
- [ ] If license does not permit GitHub storage, keep proprietary binaries solely in approved church-controlled storage; store only manifest entries and authorized private pointers here.

## Verified provider facts

Sunday Screens catalogue contains >2,100 worship loops. Individual collections include many variants, not one big free ZIP. The website identifies **Christmas Hymnal** as 15 loops and includes a **Free Download** on one style, but the site also displays sign-in prompts and membership restrictions for full collections. The public catalogue is not a grant to download the entire collection.

The public license (updated July 31, 2026) says files remain the provider's intellectual property. It allows authorized church-services and online-stream use through membership but restricts distributing/sublicensing or sharing assets beyond the subscribing organization. Standard license applies to a single physical location; Pro+ to multiple sites of the SAME church entity. It forbids redistributing clips or still frames as stock/template assets. Check vendor approval before repository mirroring or derivative uses.

## Direct official collection pages (navigation, not verified file downloads)

- SS01 Cool silver-blue refractive glass — https://sundayscreens.com/worship-backgrounds/lightrefractions
- SS02 Archive hymnal engraving — https://sundayscreens.com/worship-backgrounds/christmashymnal
- SS03 Warm gold bokeh tunnel — https://sundayscreens.com/worship-backgrounds/starfall
- SS04 Silhouette of a backlit cross — https://sundayscreens.com/worship-backgrounds/thecross
- SS05 Emerald-gold raining filaments — https://sundayscreens.com/worship-backgrounds/motionlines
- SS06 Deep-blue cosmic radial trails — https://sundayscreens.com/worship-backgrounds/startrails
- SS07 Violet-pink crystalline frost — https://sundayscreens.com/worship-backgrounds/winterfrost
- SS08 Monumental layered JESUS lettering — https://sundayscreens.com/worship-backgrounds/declarations
- SS09 Retro Christmas icon checkerboard — https://sundayscreens.com/worship-backgrounds/christmasgrid
- SS10 Faceted suspended ornaments with tiny angel — https://sundayscreens.com/worship-backgrounds/christmasornaments
- SS11 Bethlehem ridge under radiant star — https://sundayscreens.com/worship-backgrounds/kingstar
- SS12 Twin golden trumpet angels on vermilion — https://sundayscreens.com/worship-backgrounds/renaissance
- SS13 Soft iridescent light wash — https://sundayscreens.com/worship-backgrounds/iridescent
- SS14 Amber candlelight bokeh — https://sundayscreens.com/worship-backgrounds/candlelight

## What "all" must mean

The Instagram post is nine carousel frames, with fourteen distinct style looks. The provider's site advertises a separate catalogue of thousands of loops. **Do not conflate the Instagram showcase with a right to copy/download the entire provider library.** The creator's original reply links to the general catalogue; access to a download file is not verified.

## Suggested long-term storage layout after licensing review

- `docs/christmas-2026/instagram-sundayscreens-visual-spec.md` — prose/spec prompts, Git-tracked.
- `docs/christmas-2026/ASSET_ACQUISITION.md` — rights and progress, Git-tracked.
- `docs/christmas-2026/manifest.csv` — source titles, author, local filenames, SHA-256, license notes, entitlement (Git-tracked; no signed download URLs).
- `private-media/christmas-2026/` — ONLY if exact license permits it and repo members are in the same licensed organization; never for selling or template redistribution. Prefer access-controlled media storage over Git blobs for heavy video.

## Steps to obtain authorized source media

1. Open https://sundayscreens.com/worship-backgrounds within your own browser/session and sign in using the membership, or use the official free download button for an eligible sample.
2. Choose the collection and variant you are entitled to, then use its original **Download** control; use HD MP4 for regular screens; ProRes/4K only where included in your account plan.
3. Download to a dedicated local folder; don't share the creator's short-lived token. Record source URL without session parameters.
4. Inspect the exact format, file count, dimensions, video duration and total size with `ffprobe`.
5. For any permitted library asset, confirm usage rights for the exact church entity / site / service, and verify whether GitHub or Cloudflare storage is authorized before upload.
6. When rights are restricted, maintain only these source links and independent AI alternative prompts in the GitHub source of truth.

## CLI for local inventory (no network access required)

```bash
find ./authorized-downloads -type f -print0 | xargs -0 shasum -a 256 > assets.sha256
find ./authorized-downloads -type f -exec ls -lh {} \;
# Inspect videos individually, example:
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height,r_frame_rate -of json "example.mp4"
```

## AI recreation workflow

For each `SS01..SS14`, take its prompt from the visual specification, render an independently composed 16:9 still, inspect, then animate a seamless short loop with a source-independent image-to-video model. Record resulting tool and model provenance. Do not upload provider screenshots as training assets unless permitted by the provider.

## Open questions (not assumed)

- Does the special Instagram-generated catalogue link confer any additional authenticated download entitlement? **Not verified.** Opening its signed URL was blocked by the browsing system. The query token is not safely reusable as a file download URL.
- Which individual original Sunday Screens files exactly match the Instagram preview? **Not verified.** The names in the visual-spec document are candidate catalogue pages, not authenticated matches.
- Which formats and file counts are accessible to this specific account? **Not verified; account-specific.**
