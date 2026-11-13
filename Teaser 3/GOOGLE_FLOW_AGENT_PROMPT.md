# TEASER 3 — CURRENT GOOGLE FLOW AGENT PROMPT (v2, 2026-11-13)

## Production reliability override — 2026-11-13 (V3)

**The definitive model-facing instructions for every shot are in [FLOW_PICKUP_PROMPTS.md](FLOW_PICKUP_PROMPTS.md), and numeric timings in [PICKUP_TIMING_MANIFEST.json](PICKUP_TIMING_MANIFEST.json).** Earlier prose timings/prompts in this file are narrative background only where different. Use [PICKUP_PREFLIGHT.md](PICKUP_PREFLIGHT.md) before every generation; static checks: `node "Teaser 3/PICKUP_PREFLIGHT.mjs"`.

**Never try to add/change speech by editing a previously generated or uploaded video in Flow.** Every speaking pickup is a new generation referencing the original permitted portrait image; one speaker, one line, all speech finished before edit point, 8-second draft source when available, and 2+ seconds silent tail. If Flow refuses a policy-sensitive generation, stop retries and use real recorded dialogue in the editor. Google Flow policy outcomes cannot be guaranteed. This directive applies to **all** performers (Monica, Jessa, Mitch, Mommy Tere, Renee) and any additional voice pickup.

Latest exact 58-second time windows: Monica P01 00–06; Monica P02 06–11; Jessa P03 11–15; Mitch P04 15–19; transition P05 19–21; party P06–P08 21–32; Jessa P09 32–35; Monica P10 35–38; rules P11 38–43; Monica P12 43–47; Tere P13 47–52; Renee P14 52–55; end card 55–58.

**Paste this as the episode-level agent prompt AFTER loading [GOOGLE_FLOW_AGENT_INSTRUCTION.md](GOOGLE_FLOW_AGENT_INSTRUCTION.md).** The agent instruction is stable across all accounts, while this episode prompt describes the editable production plan. For actual video-generation model calls, use only the atomic prompt for that pickup from [FLOW_PICKUP_PROMPTS.md](FLOW_PICKUP_PROMPTS.md) or the canonical one-person cameo prompt below; do not dump the entire brief into Veo.

## Agent prompt — ready to paste

Produce **Paskong Pinoy Remix — Teaser 3**, a 58-second maximum-target / strictly-under-60-second original vertical 9:16 Filipino OFW Christmas short for W2/N4. Creative rule that SUPERSEDES JoblessDev's negative/shock hook: **OPEN ON POSITIVITY AND LOVE.** First frame must already show warm Christmas affection. The film may gently acknowledge Monica misses her family; never lead with despair, crying, anger or a gloomy stereotype. The story celebrates people who make Christmas in Singapore feel like home.

Use the actual, full-resolution uploaded selfie for every named person; this screenshot is a filename index ONLY, not face-reference media. Cast reference filenames are in CAST_REFERENCE_INDEX.md. Attach only the relevant original photos to each generation and keep face, hair, skin tone, approximate age and wardrobe recognisable. With multiple candidate photos, inspect the originals and choose the clearest, logging which was used. Never substitute another named person, never invent a missing face and never use previously generated videos as new identity anchors.

PROVISIONALLY READY TO PREPARE because filenames were identified:
- `sa_monica.jpeg`: MONICA, warm opening and joyful responses.
- `n4_jessa.jpeg`: JESSA, friendly invitation and rules phone plate.
- `w2_tere.jpeg`: MOMMY TERE outro ONLY after confirming subject is Mommy Tere.
- `sa_susie.jpeg` / `sa_susie_2.JPG`: SUSIE, phone-ad anchor / festive dance.
- `sa_margie.jpeg`: MARGIE dance.
- `sa_flor.jpeg`: FLOR dance.
- `sa_riza.jpeg` / `sa_riza_two.jpeg`: RIZA dance.
- `sa_lilia.jpeg`: LILIA dance.
- `n4_usha_1.jpeg` / `n4_usha_2.jpeg`: USHA dance.
- `w2_willy.jpeg`: WILLY dance.
- `w2_adrian.jpeg` / `w2_adrian_two.jpeg`: ADRIAN dance.
- `n4_donna.jpeg`: DONNA dance.

MISSING FROM SCREENSHOT: MITCH, RENEE, LEIZEL, ANAVEE, IAD. Hold their speaking/dance pickups until a valid original selfie or genuine usable footage is provided. `w2_mischie_one.jpeg` is NOT automatically Mitch. Also identified 12 OPTIONAL non-speaking cameo names: Ally, Charie, Christy, Dok Bing, Malyn, Rex, Shiela, Anna, Cheska, Kathleen, Mischie, Rowena Wheng. These do NOT replace promised original dancers; include only if timing and approval permit.

**Audio correction (2026-11-13):** The fully required line is "Merry Christmas sa inyo… miss na miss ko na kayo." The original four-second script cut it off. Give Monica a six-second final window (source generation eight seconds, final two seconds a silent tail); reduce the dance montage by two seconds for a 58-second final edit. If needed, render P01B as only "Miss na miss ko na kayo." from her still photo or add a consensually recorded human voiceover in post. If Flow reports a policy warning, distinguish editing speech in uploaded video (unsupported) from producing new footage from a still image; do not force repeated retries.

**RENDERING RULE V3:** This episode-level document is for the AGENT's context, not the video model. Use one canonical pickup per generation from FLOW_PICKUP_PROMPTS.md after checking PICKUP_PREFLIGHT.md. The numeric timing manifest is authoritative if any older line here conflicts. One original still per speaking performance, source 8 seconds when offered, complete dialogue by the speech deadline then silent tail. Never edit uploaded video to alter speech. For policy warnings, stop and use real performer voiceover in post.

**STORY ORDER (58s):**
00–06s Monica smiles lovingly at family photo or neutral phone (real photo inserted in post if authorised): exact proposed line "Merry Christmas sa inyo… miss na miss ko na kayo." Warm golden festive bokeh. Not crying.
06–11s Monica sees the actual Christmas gathering advert, including genuine last-year clip of Susie dancing. "Ang saya naman dito…"
11–15s Jessa gently taps Monica's shoulder: "Gusto mo bang sumali?"
15–19s Mitch enters playfully: "Besh! Sumali na kayo!" (DO NOT render until Mitch selfie arrives.)
19–21s Mitch reaches/pulls them into magical match-cut transformation; create separately edited reaches / whip pan, not an unstable three-face one-take transformation.
21–32s energised real event dance footage preferred; each of the 12 nominated dancers gets a recognisable moment: Leizel, Susie, Margie, Flor; Riza, Anavee, Lilia, Usha; Iad, Willy, Adrian, Donna; with actual food, actual raffle and actual prizes only if confirmed, and a radiant Monica reaction. Use individual quiet dance pickups if real footage inadequate. Do not invent absent dancers.
32–35s Jessa: "Gusto mo ba sumama?"
35–38s Monica: "Of course, siyempre!"
38–43s Jessa displays phone with exact owner-supplied game-rules image inserted legibly in post. No spoken line.
43–47s Monica: "Walang problema, madali lang 'yan!"
47–52s Mommy Tere: "Tara na sa Paskong Pinoy Remix!"
52–55s Renee gently appears beside her, in separate composite: "See you there!" (DO NOT render until Renee portrait arrives.)
55–58s verified original event poster/title/details as end card, created in editor.

At each Flow run: one primary speaker OR one silent principal action, one camera angle, one continuous take; exact bounded dialogue and specific silent tail. Start useful action immediately. Neutral blank phone plates; actual adverts, rules and end card inserted in edit; DO NOT synthesize readable text. No model-generated subtitles, logos, platform UI or extra voices. Natural warm Filipino Taglish. Match colour and lights between repeated characters. Use 360p draft default if supported; verify current Flow credit price/model/permissions, do not assume multiple accounts combine credits or bypass provider limitations. Retry only failed pickups. User-provided actual video is the final edit authority. Finish with actual-audio-derived subtitles, music cleared for rights, and precise under-60s QC. **Do not report media rendered or delivered without actual generated source files.**

**OUTPUT NOW:** Only prepare prompts and asset mappings for names actually in the screenshot. No paid generation with missing full-resolution portrait. Return a readiness list, approved-script preview, staged one-person pickups, and optional silent cameo prompts for extras.

## One-person silent dancer prompt — fill one filename per generation

PICKUP ID: DANCE_<NAME>
REFERENCES: ATTACHED ORIGINAL `<EXACT_FILENAME>` = `<NAME>`; canonical identity authority.
VISIBLE PEOPLE: <NAME> ONLY.
SPEAKER: NONE.
SILENT CHARACTERS: NONE.
FRAMING: 9:16, locked medium shot. Warm gold/red holiday party with soft fairy lights. Keep face unobstructed.
PRINCIPAL ACTION: <NAME> performs two natural small dance steps, joyful and relaxed, no extravagant hand motions; camera remains fixed.
DIALOGUE: NONE.
PERFORMANCE: genuine friendly Filipino Christmas celebration, laughter conveyed through expression, not speech. No exaggeration.
ENDING/TAIL: finish the second step and hold a happy welcoming smile.
PACING: begins dancing on first frame; edit takes 0.7–1.5 seconds from the best beat.
NEGATIVES: no other people, no face/age changes, no new dialogue, no cuts, no subtitles, no signs, no text or logo, no watermark, no generic invented face.

## One-person optional guest/cameo prompt — fill one filename per generation

PICKUP ID: CAMEO_<NAME>
REFERENCES: ATTACHED ORIGINAL `<EXACT_FILENAME>` = `<NAME>`.
VISIBLE PEOPLE: <NAME> ONLY. SPEAKER: NONE.
FRAMING: vertical 9:16 static party medium close-up, matching festive amber lighting and background.
PRINCIPAL ACTION: <NAME> gives a friendly spontaneous holiday smile and light welcoming wave; eyes look just beside camera, natural unscripted feel.
DIALOGUE: NONE. ENDING/TAIL: hold warm smile.
PACING: begin gesture instantly. NEGATIVES: same identity/clean-footage rules as dancer prompt.
Use cameos only for optional names the owner wants on screen and only after primary 12-dancer roster is covered.
