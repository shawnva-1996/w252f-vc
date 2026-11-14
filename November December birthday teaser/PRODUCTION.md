# Mission Pasko — Practical Production and Delivery Plan (V3 2026-11-14)

**Status:** preproduction only; no Flow clips/audio/render completed yet.  
**Final master:** H.264 MP4, **1080×1920 final edit canvas, 9:16 portrait, 30fps**, exactly **90 seconds**, high-quality audio appropriate for church hall + PowerPoint.

## Inputs
- Primary original photographs: 12 listed in [CAST_ASSET_MANIFEST.md](CAST_ASSET_MANIFEST.md), stored in owner Google Drive.
- Existing event footage: optional rehearsal/community clips (with appropriate consent). Prefer candid real group reactions for emotional trust.
- Short family messages: optional 5–8s per family video/voice recording, **actual voices**, clearly approved for event use. The 90s version selects roughly 16s total; preserve the rest in a separate extended asset rather than pretending all ten can have long individual greetings.
- Music and narration: [MUSIC_VOICE.md](MUSIC_VOICE.md); don't ingest copyrighted PBB theme without permission.

## Pipeline
```text
Birthdays PDF + verified portraits + owner script approval
     | 
Identity and consent check -> selective Google Flow comedy pickups
     |                          (independent original-photo references)
     +-------> real messages/rehearsal clips
                |
        Remotion (primary editorial timeline)
        optional HyperFrames for advanced animated compositions
                |
       FFmpeg audio mix, export, strict runtime QA
                |
       90s PowerPoint-ready 16:9 birthday film
```

## Applied learnings from source repositories
- **Teaser 3**: Google Flow original-photo identity authority, independent pickups, simple natural-language model-facing prompts, clean footage without generated on-screen titles, review all actual speech and shots before edit, preserve consent.
- **JoblessDev**: draft cheapest workable resolution first, select/correct one shot rather than paying for repeated unproductive generations. Exact model/credits checked in Flow UI; do not assume Teaser 3's 9:16 format carries over.
- **Faceless Channels**: hook immediately, keep movement, visual change and SFX active every few seconds, no needless intro card, hold audience with small payoffs and a mystery reveal.
- **LTSG**: use real footage as source of emotional credibility; select clean usable segments and compose fresh edits.
- **Remotion**: deterministic 16:9 edit, readable name/date typography, pair-split birthday reveals, numbered 10/10 progression, virtual game-show overlays, confetti and subtitles.
- **HyperFrames**: optional source-driven motion design layer; confirm environment/package compatibility before use.

## Flow generation plan (proposal, NOT a locked preset for this new film)
- **Use 3–4 short original fantasy-comedy shots maximum in first pass** for group missions, rather than 10 expensive individual portrait animations.
- **Owner-locked new preset:** Omni Flash 1.2 / **360p** / **9:16 portrait** / **10 seconds per Flow source** / one output. Birthday uses 9:16 by independent explicit instruction; the related Teaser 3 has a different 58s runtime.
- Official current Omni Flash 1.2 pricing is **1 credit per generated second at 360p**, so **10 credits for each 10s generation** when offered. Confirm actual UI before spending. User reports 50 credits each for ~8 separate accounts; use [ACCOUNT_CREDIT_LEDGER.csv](ACCOUNT_CREDIT_LEDGER.csv) and follow Google's terms/limits.
- Face/identity reference = uploaded original approved portrait, not generated previous clip.
- Narrator audio generated separately (or acted by real volunteer) for exact timing and reliable Taglish.
- Most reveal shots require **static photos + motion graphics**, not lipsync.
- Keep final labels, names, birthdays, sound and music in post-production (not hallucinated into video by Flow).
- Stop and use consented original footage if Flow rejects a real-person generation; do not circumvent filters.

## QA / event playback
- [ ] Every December person is visible and legibly labeled **at least once** in final video.
- [ ] Exact date and name verification; **Catherine Dec 18 vs filename Dec 16** cleared.
- [ ] 9:16 1080×1920 final canvas at exactly 90.0 seconds.
- [ ] On a portrait playback or a portrait-safe landscape PowerPoint frame, all texts and faces are visible at a distance; keep title safe areas.
- [ ] Filipino dialogue intelligible and natural; VO ends before video cuts.
- [ ] User-approved music licence and family footage consent.
- [ ] No TV PBB logo/stolen master audio unless permission obtained.
- [ ] Intro immediately grabs attention; real voice messages get enough emotional breathing room.
- [ ] Confirm playback on actual event computer/projector; keep a backup MP4 independent of PowerPoint codec/embedding issues.
- [ ] Final video rendered and reviewed **after** owner script/storyboard approval.
- [ ] November celebrants remain pending and are not fabricated/retroactively added to this 90s December cut without recutting.

## Immediate next work
1. Owner review storyboard V1 and Catherine birthday discrepancy.
2. Select 1–2 voice samples and music source; obtain licensing information for actual PBB track.
3. Create cast portrait contact sheet / verify face matching and consent.
4. Produce one low-cost comedic proof-of-concept pickup **only after approved script + generation budget**.
5. Build deterministic Remotion name/date montage and motion-graphic sample.
6. Collect voluntary genuine messages, replace provisional emotional edit with approved real recordings.
7. Render, review, finalise and deliver.

## V3 continuous-scene Flow procedure (MANDATORY)
- For any **continuing action with the same cast, environment and wardrobe**, inspect accepted PxxA video; **save a clear last frame**. For an eligible paid account choose Omni Flash 1.2 **Extend** (additional charge). Otherwise use web **Frames to Video** with that saved image as PxxB **start frame** (additional generation). Include original portrait as identity reference where available; generated frame is for temporal continuity, not person identification.
- **Do not chain unrelated group/celebrant scenes**; each starts from its own original photo or other consented footage. Never auto-generate P05B/extra clips without owner approval; source duration 10s and final selected edit is ~5s.
- Check **model 1.2 Flash, 9:16, 360p, 10s, one output, live credit quote** before every attempt. 50 owner-reported credits per account, ~8 accounts; log actual charges (including unsuccessful attempts) separately, never store credentials or treat accounts as pooled/bypasses.
- Save source MP4s, last-frame stills, exact source timecode and per-pickup QA; Remotion assembles a **9:16 vertical 90s** result using only licensed audio and real messages. For landscape PowerPoint display, use side art/pillarbox rather than stretching portrait film. See [FLOW_CONTINUITY_CREDITS_V3.md](FLOW_CONTINUITY_CREDITS_V3.md).
