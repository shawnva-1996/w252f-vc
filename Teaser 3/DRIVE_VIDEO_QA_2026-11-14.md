# Teaser 3 — Google Drive video review / editing handoff (2026-11-14)

**Source location:** connected Google Drive → `W252F Media Team / flow-vids`. This repository records **only filenames and visual/technical observations**; do **not** commit participant video files, thumbnails, member images or private Drive download URLs to a public repository.

## Method and verification boundary

On 2026-11-14 the reviewer listed **all 11 directly contained MP4s**, fetched each **actual binary** from the connected Google Drive, inspected 4 frames per clip (approximately 0.5, 2, 4.5, 7.5 sec; P04 ends before 8 sec), and read technical metadata through FFprobe. All 11 have an AAC audio stream, but **spoken words and voice authenticity have NOT been transcribed or independently listened to in this review.** A named file is not proof of a person's identity. Performer consent and on-screen identities must be checked by the owner.

**Uploaded video inventory:** `p01.mp4, p02.mp4, p03.mp4, p04.mp4, p05.mp4, p09.mp4, p10.mp4, p11.mp4, p12.mp4, p13.mp4, p14.mp4`. No `p06`, `p07`, `p08` (these are meant to be assembled principally from *real* dancing/practice footage, not necessarily Flow generations). The real rules image, approved flyer/end card and historical dance source were not in this `flow-vids` folder.

## Per-clip review (VISUAL only)

| File | Story role per manifest | Technical | Observed frames | Review |
|---|---|---|---|---|
| p01.mp4 | Monica Christmas greeting 00–06 | 360×640; 10.03s; AAC | Person in red/white top, glasses, holding phone, affectionate expression; clothing matches other Monica clips | Visual continuity **OK**; exact Tagalog/audio completion **TO CHECK** |
| p02.mp4 | Monica discovers ad 06–11 | 360×640; 10.03s; AAC | Same red/white top and glasses, phone reaction and smile | Visual continuity **OK**; exact poster and archival Susie shot remain **POST WORK** |
| p03.mp4 | Jessa first invitation 11–15 | 360×640; 10.03s; AAC | Person in white shirt, purple/green patterned scarf, glasses, warm Christmas lights | Wardrobe matches P09/P11 **OK**; spoken line **TO CHECK** |
| p04.mp4 | Mischie invitation 15–19 | **720×1280; 7.93s**; AAC | Person in teal/navy-blue dress, smiling/gesturing; other people visible behind/beside her in multiple sampled frames | Visual cast/gesture plausible but **CROP/CUT REVIEW** for additional people and continuity; spoken words **TO CHECK**. Shorter than nominal 10s generation but enough for four-second edit if words complete |
| p05.mp4 | Mischie transition reach 19–21 | **720×1280; 10.03s**; AAC | Person in the same style of blue dress reaches hand directly toward lens around middle of clip | Strong candidate for editorial match-cut **OK**; actual desired 2-second segment select carefully |
| p09.mp4 | Jessa invites again 32–35 | 360×640; 10.03s; AAC | White blouse, purple/green scarf and glasses; consistent with P03/P11 | Wardrobe **OK**; final accepted spoken line (original or shorter alternative) **TO VERIFY BY LISTENING** |
| p10.mp4 | Monica says yes 35–38 | 360×640; 10.03s; AAC | Same red/white outfit and glasses; delighted facial expression | Visual continuity **OK**; spoken line **TO CHECK** |
| p11.mp4 | Jessa displays rules phone 38–43 | 360×640; 10.03s; AAC | Same Jessa blouse/scarf; phone held upright next to face with a plain light screen facing **the camera** in sampled frames | Phone-orientation and wardrobe issue appear **FIXED visually**; actual game-rules screen replacement required; verify no spoken words |
| p12.mp4 | Monica rules reaction 43–47 | 360×640; 10.03s; AAC | Same Monica red/white outfit, phone and smiling expression | Visual continuity **OK**; spoken line **TO CHECK** |
| p13.mp4 | Mommy Tere invite 47–52 | 360×640; 10.03s; AAC | Older-presenting woman with short brown hair, black sparkly top, welcoming to-camera gesture | Visual usable, but identity **NOT VERIFIED**; ensure intended Mommy Tere and exact spoken line |
| p14.mp4 | Renee final 'See you there!' 52–55 | 360×640; 10.03s; AAC | Man with glasses and light-coloured baseball cap and patterned dark shirt, smiling toward camera | **IDENTITY/CAST GATE**: visually different performer than expected reference description. Confirm whether this is the intended Renee, a different person, or an intentional casting change; do not silently label/merge until owner confirms |

All original files are retained in Google Drive; no footage/portrait uploaded into GitHub.

## Known production blockers in priority order

1. **P14 casting:** Ask owner to confirm whether person shown in `p14.mp4` (cap/glasses) is the intended Renee or another intended final speaker. Also independently confirm P13 is the intended Mommy Tere. Do not identify real people by visual recognition or assume character names from files.
2. **Dialogue QA:** Listen to actual clips end-to-end and verify complete exact spoken dialogue and natural Tagalog/Taglish. Check P01 ("Merry Christmas sa inyo… miss na miss ko na kayo."), P03, P04, P09 (owner may have tried alternate "Sama ka sa amin?"), P10, P12, P13, P14. For P05/P11, confirm intended silent performance (AAC track existing alone is not speech).
3. **Authentic montage P06–P08 (21–32s):** User to provide real consented footage or portrait pickups showing ALL 12 named dancers: P06 Leizel/Susie/Margie/Flor; P07 Riza/Anavee/Lilia/Usha; P08 Iad/Willy/Adrian/Donna. User may supply single authentic group clip and editor can cut 0.5–1.0s face inserts for each. Actual older performance of Susie is preferred for the P02 phone/poster insert; do not synthesize historical footage.
4. **P11 actual game rules** graphic (PNG/JPEG) must be provided; overlay on visible front-facing neutral phone screen or use a readable graphic insert.
5. **P02 real event poster/advertisement** and **final approved end flyer** (actual event date, venue/time/CTA), plus licensed/original upbeat Christmas soundtrack.
6. **Rough edit**: Assemble the already-available 11 visual clips using the 58-second scene layout in `PICKUP_TIMING_MANIFEST.json`, inserting placeholders for the three montage slots and end card until assets exist; normalize the mixed 720/360 resolution outputs, match color/volume and add music/subtitles from final verified dialogue. Review pacing, face continuity and close-ups.

## Scene timeline (keep final 58 seconds)

```text
00–06 P01 Monica greeting
06–11 P02 Monica sees event ad
11–15 P03 Jessa invites
15–19 P04 Mischie invites
19–21 P05 Mischie hand-reach transition
21–24 P06 authentic dancers A [missing in folder]
24–27 P07 authentic dancers B [missing in folder]
27–32 P08 authentic dancers C + joy/party cutaways [missing in folder]
32–35 P09 Jessa asks
35–38 P10 Monica says yes
38–43 P11 Jessa presents true rules-screen graphic
43–47 P12 Monica reply
47–52 P13 Mommy Tere
52–55 P14 final speaker [identity to confirm]
55–58 END verified flyer/end card [missing in folder]
```

**Keep existing good clips.** No need to spend more Google Flow credits just because original rendered clip is 720p or P04 7.93s when the needed edit segment fits. The locked new generation preset is **Omni 1.2 Flash · 360p · 10s · 10 credits**; max five charged generations per 50-credit account; account settings/cost must be verified live.

## Status summary

- 11/11 scripted Flow individual pickup IDs: **file present**
- 11/11 actual video binaries: **read and keyframes visually inspected**
- Technical stream verification: **11/11 valid vertical MP4 video with AAC stream**
- Complete spoken dialogue: **not verified**
- Identity/consent: **not verified**
- P11 phone front screen: **visually present and readable blank/neutral**
- Missing authentic montage source (P06–P08), rules image, poster, Susie archival insert, and final flyer: **still need to locate/supply**
- **No final video exported or approved** by this review.
