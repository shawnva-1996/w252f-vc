# November–December Birthday Teaser — Mission Pasko (2026)

## CURRENT APPROVED DIRECTION / DRAFT PACKAGE (2026-11-14)
- **Gemini TTS** selected for the bodiless Kuya narrator; an ElevenLabs free-tier API key exists but **will not be used for this prototype**. Do not request or commit keys.
- Full director pickup plan: [FILMING_PLAN_V2.md](FILMING_PLAN_V2.md) — 15 segments P01–P15, 90-second horizontal cut, precise timings, person coverage, voice/music cues.
- First practical test: **P05 — Ate Joy, W2 Christmas gift tower** ([POC_P05_W2_GIFTS.md](POC_P05_W2_GIFTS.md)). Shoot **one** 10-second clean Flow video in 16:9 to yield ~5s in final edit.
- Agent handoff: [Google Flow Agent Instruction POC](GOOGLE_FLOW_AGENT_INSTRUCTION_POC.md) and [Google Flow Agent Prompt POC](GOOGLE_FLOW_AGENT_PROMPT_POC.md), both drafts pending owner creative approval. Paste only the short individual pickup prompt in Flow's video generator.
- Existing Teaser 3 uses 9:16 / 58s but this **birthday video is a different 16:9 / 90s project**. Source-image/production process can be reused, not aspect ratio.
- No Flow output, Gemini TTS WAV/MP3 or mixed prototype has yet been generated. User runs Flow in their own account, then uploads MP4 for post.
- Source portraits stay in Google Drive; we never commit personal images.

**Status:** PREPRODUCTION / CREATIVE V1 (not rendered or published)  
**Last reviewed:** 2026-11-14 (Singapore)  
**Owner brief:** W2 × N4 × Sunday Group birthday celebration, **Paskong Pinoy Remix**.  
**Final deliverable:** one **90-second, 16:9 landscape (1920×1080) MP4** for PowerPoint/event playback. This birthday film is separate from the 58-second vertical *Teaser 3*.

## Creative decision
Working title: **MISSION PASKO: THE BIRTHDAY HOUSEMATES**.

Premise: An unseen, disembodied **Kuya-style Filipino narrator** gives the housemates a Christmas birthday mission. Funny tasks and quick reveals introduce **every December celebrant**. An unexpected, heartfelt transition brings genuine messages from family/friends. Land with a joyous all-ten mosaic.

Tonality: **warm, positive, funny, Taglish, Singapore-Filipino/OFW relatable, affectionate**. All jokes should be with the celebrants, not at their expense; no invented intimate facts, caricatured accents, or overly sentimental guilt. The December roster is complete, November is pending.

**Narrator:** **audio-only/bodiless**. No actor or face representing Kuya. Do not reproduce/clone the actual television host/Big Brother voice. Consider licensed, original Filipino TTS via ElevenLabs or Gemini TTS. See [PRODUCTION.md](PRODUCTION.md).

**Music reference:** user requests the recognizable **Pinoy Big Brother** music. The season's iconic theme is `Pinoy Ako`, performed by Orange and Lemons (2026 GMA reporting). This track and the show's actual audio are copyrighted; **rights/permission must be checked before including an exact recording or derivative**. Do not assume a royalty-free licence because playback is in a church or small event. Audio fallback is an **original, independently composed Filipino house-party / festive reality-show-style instrumental**, not copied from PBB melody or samples. See [MUSIC_VOICE.md](MUSIC_VOICE.md).

## Canonical source materials
- User-supplied one-page **November & December Birthday** PDF (photo in conversation). It calls for landscape, Paskong Pinoy Remix, cheerful Christmas birthday music and a short clip. It appears to contain a conflicting `90mins` transcription; **owner clearly specified 90 seconds** and that explicit instruction controls.
- December source roster: **N4:** Doc Bing (Dec 20), Ally (Dec 6); **W2:** Ate Joy (Dec 4), Kuya John (Dec 27); **Sunday Love:** Catherine (Dec 18), Susie (Dec 24); **Sunday Hope:** Sheinna May (Dec 2), Rea (Dec 4), Juvelyn (Dec 17), Hanny (Dec 27).
- **Sunday Faith:** no birthday celebrants in supplied document.
- **November:** not yet supplied; source document displays headings but no named celebrants. **Pending, do not invent.**
- December portrait collection (owner-uploaded): https://drive.google.com/drive/folders/1TOi8K_7LHbyw4rhBp-8chj791yDhtdYU
- [CAST_ASSET_MANIFEST.md](CAST_ASSET_MANIFEST.md): 12 verified photos covering all 10 December members.
- [STORYBOARD_V1.md](STORYBOARD_V1.md): 90-second creative beat sheet, draft narrator cues and coverage map.
- [PRODUCTION.md](PRODUCTION.md): Flow / real footage / Remotion / HyperFrames / TTS / audio / QA, approval gates.
- [MUSIC_VOICE.md](MUSIC_VOICE.md): music and narrator decision log.

## Current facts and uncertainties
1. **12 photographs** currently appear directly in the Google Drive folder and map by filename to **all ten** December celebrants. Ate Joy and Kuya John have 2 photos each.
2. **Catherine date conflict:** PDF roster says **Dec 18**; Drive filename is **`catherine_dec_16.JPG`**. Display **Dec 18 provisionally from the source PDF**, flag for owner confirmation; do not silently change to Dec 16.
3. Birthdays and image-to-person identity are inferred from filenames and the supplied list; validate matching faces/persons and use permission/consent before animation.
4. Family testimony footage, rehearsal footage, spoken script, music licence and final use/distribution scope are **not yet confirmed**.
5. The Google Drive folder was observed on 2026-11-14 with an **anyone-with-link writer** permission. This is an asset-safety concern; owner should restrict to editors rather than broad edit access. **We have not changed its permissions.**
6. **Do not commit private portraits, raw videos, family messages or copyrighted music into GitHub.** Keep media in approved storage and reference them in docs; commit only planning metadata/scripts.

## Production direction inherited from project sources
- Same-family methodology from [Teaser 3](../Teaser%203/README.md): identity always from the original user-provided photograph, stable wardrobe/visual continuity, consent, simple model-facing prompts, cost-aware independent pickups.
- The **Teaser 3** locked 9:16 / 58s generation and final export constraints are **not** automatically inherited by this new 16:9 / 90s film. We may borrow the draft-first 360p and 10s-pickup strategy as a proposal; confirm Flow model, costs, aspect ratio and per-account budget before any paid generation.
- No rendering without owner-approved screenplay/storyboard, per related repository production rules.

## Next actions
1. Confirm Catherine's date (Dec 18 roster vs Dec 16 filename).
2. Approve or revise [STORYBOARD_V1.md](STORYBOARD_V1.md), the first draft of Mission Pasko.
3. Select original licensed **narrator voice** and approved music route; test one 5–8s Tagalog/Taglish sample.
4. Ask family/friends for voluntary 5–8s genuine birthday voice/video submissions, if feasible, with consent for event screening.
5. Review image quality, face matches and permission; create an identity-reference list before Flow prompts.
6. Generate only the essential, approved comedic pickups; use Remotion for name/date reveals (avoid ten expensive portrait animations by default).
7. Assemble, QC, then play in PowerPoint; November material remains pending and can be added later if owner requests a combined cut.

**No rendered video, purchased music, generated audio, or uploaded assets are claimed by this planning commit.**
