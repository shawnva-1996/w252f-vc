# Paskong Pinoy Remix — Teaser 3: "Malayo sa Pamilya, Pero Hindi Nag-iisa"

## LOCKED GOOGLE FLOW GENERATION PRESET — OWNER REQUIREMENT (2026-11-13)

For **every Teaser 3 Flow video generation**, including speaking pickups, silent gestures, dancers, cameos, and charged retries, select in Flow's UI:

- **Model:** Omni 1.2 Flash
- **Resolution:** 360p
- **Clip duration:** 10 seconds (source footage; trim down in the final editor)
- **Cost assumption provided by owner:** 10 credits for each generated video
- **Per-account budget:** 50 credits → **at most 5 charged generations per account** at that price
- **Aspect ratio:** 9:16

**Do not automatically choose 8s, another Omni model, 720p/1080p, an upscale, or multiple outputs.** If the selected preset isn't available or the displayed price differs, stop and check rather than spending credits under different settings. Count every *charged* attempt, including retries, against that account's budget. Settings/balances are user-provided expectations and must be confirmed in the live Flow UI before each generation. Never treat credits from different accounts as pooled. This choice is locked for this Teaser 3 workflow until the owner changes it.

**Important:** 10 seconds refers to each generated source pickup, **not** the final edit. The completed teaser remains **58 seconds**. Model-facing prompts remain brief natural language; preset and credit controls belong in Flow UI / agent preflight, not the video text prompt.

## Jessa outfit continuity — P09 → P11 (2026-11-13)

The owner observed Jessa changes outfits between P09 and P11. **P09 is the wardrobe authority for both party shots.** In Google Flow, **Save frame** from the approved P09 clip where clothing is clearly visible. In the new P11 generation, attach original `n4_jessa.jpeg` for identity and the saved P09 still **only as outfit reference**, when the locked Omni 1.2 Flash settings support Ingredients with both images. The **P11 copy-ready prompt** specifies identical sleeves, colors, neckline and accessories. Confirm visually before approving a new 10-credit take.

Do not use the generated P09 video as a replacement identity source. If the model cannot reliably preserve clothing or refuses a reference, keep the existing video, crop to Jessa's phone and overlay the real rules image in post rather than paying for many retries. For P03 use the P09 outfit target if the storyline implies the same wardrobe. The master remains 58 seconds; preset remains Omni 1.2 Flash · 360p · 10s · 10 credits.

## CURRENT PRODUCTION DOCTRINE — V4 (2026-11-13)

**Current model-facing prompts:** [FLOW_PICKUP_PROMPTS.md](FLOW_PICKUP_PROMPTS.md) V4 and [AVAILABLE_CAST_PROMPT_BANK.md](AVAILABLE_CAST_PROMPT_BANK.md) V4. A **short, natural-language P02 prompt style** worked in Google Flow according to the owner. The older densely structured `PICKUP / REFERENCE / SPEECH TIMING / NEGATIVES` text is internal planning format only and **must not be pasted into the video model**.

**Persistent agent setup:** [GOOGLE_FLOW_AGENT_INSTRUCTION.md](GOOGLE_FLOW_AGENT_INSTRUCTION.md) V4, followed by [GOOGLE_FLOW_AGENT_PROMPT.md](GOOGLE_FLOW_AGENT_PROMPT.md) V4, once per new agent conversation. Then choose one scene and paste only its `text` model prompt, attaching the original approved member photograph.

**Timing/QA remain unchanged:** [PICKUP_TIMING_MANIFEST.json](PICKUP_TIMING_MANIFEST.json) defines the 58s final cut. [PICKUP_PREFLIGHT.md](PICKUP_PREFLIGHT.md) describes reference checks, audio completion and platform restrictions; [PICKUP_PREFLIGHT.mjs](PICKUP_PREFLIGHT.mjs) validates structural timing. Voice deadlines and retries are agent/editor decisions, not long commands in the video-model text.

**Creative lock:** POSITIVITY AND LOVE FIRST. Monica's full opening is **"Merry Christmas sa inyo… miss na miss ko na kayo."** Iad is the correct spelling. Mischie is owner-confirmed and has two candidate portrait filenames. Still-missing names are Renee, Leizel, Anavee and Iad; no replacements are fabricated. Reuse the actual original photos for each new pickup. If a particular Flow generation is refused, respect the platform decision and edit permitted footage plus a consented human recording externally. A successful P02 attempt does not prove every other V4 shot will work.

**Current Mischie P04:** Previous spoken Flow attempt was flagged (specific cause unknown); V4 simplified spoken prompt and silent alternative with consented real voiceover are recorded. **Status:** GitHub text prompts updated; **other V4 generations remain untested**. No final video is claimed rendered.

## Historical production reliability notes — V3 (superseded by V4 above)

**The current simplified model-facing prompts are in [FLOW_PICKUP_PROMPTS.md](FLOW_PICKUP_PROMPTS.md) V4, and numeric timings in [PICKUP_TIMING_MANIFEST.json](PICKUP_TIMING_MANIFEST.json).** Earlier prose timings/prompts in this file are narrative background only where different. Use [PICKUP_PREFLIGHT.md](PICKUP_PREFLIGHT.md) before every generation; static checks: `node "Teaser 3/PICKUP_PREFLIGHT.mjs"`.

**Never try to add/change speech by editing a previously generated or uploaded video in Flow.** Every speaking pickup is a new generation referencing the original permitted portrait image; one speaker, one line, all speech finished before edit point, 10-second source clip with the locked preset, and 2+ seconds silent tail. If Flow refuses a policy-sensitive generation, stop retries and use real recorded dialogue in the editor. Google Flow policy outcomes cannot be guaranteed. This directive applies to **all** performers (Monica, Jessa, Mischie, Mommy Tere, Renee) and any additional voice pickup.

Latest exact 58-second time windows: Monica P01 00–06; Monica P02 06–11; Jessa P03 11–15; Mischie P04 15–19; transition P05 19–21; party P06–P08 21–32; Jessa P09 32–35; Monica P10 35–38; rules P11 38–43; Monica P12 43–47; Tere P13 47–52; Renee P14 52–55; end card 55–58.

Created: 2026-11-10 (Asia/Singapore); revised 2026-11-13
> **LATEST OWNER OVERRIDE — 2026-11-13: POSITIVITY AND LOVE FIRST.** This version supersedes the previously drafted tearful/negative opening. First frame: Monica lovingly sends a Christmas greeting or smiles at her family's memory. Loneliness stays a tender subtext, not a negative lead. See the current [Agent Instruction](GOOGLE_FLOW_AGENT_INSTRUCTION.md), [Episode Agent Prompt](GOOGLE_FLOW_AGENT_PROMPT.md), [Available Cast Prompt Bank](AVAILABLE_CAST_PROMPT_BANK.md) and [screenshot filename index](CAST_REFERENCE_INDEX.md).

Status: PRE-PRODUCTION / SCRIPT PROPOSED / NOT RENDERED. Reference photos, real dance footage, rules image and approved event details pending.
Source of truth: W252F-VC. V3 dialogue-safe plan dated 2026-11-13. Google Flow production methodology adapted from the canonical shawnva-1996/JoblessDev repository, SOURCE_OF_TRUTH.md, project-instructions/doctrines/Stable-Agent-Instruction.txt, production/ACTIVE.json and prompts/OMNI_VIDEO_BASELINE_V2.md.

## Owner intent (do not erase)
- This is the **third and final** Paskong Pinoy Remix teaser for Singapore-based Filipinos, particularly overseas Filipino workers and domestic workers.
- Story: Monica warmly expresses love for her family in the Philippines while spending Christmas in Singapore; she gently misses them, but the very first beat is positive; she discovers the event via festive advertisement featuring Susie's dancing in archival footage; Jessa invites her; Mischie exuberantly brings them into the celebration; 12 named dancers appear; food, raffle and prizes; Jessa shows the real game rules on a phone without reading them aloud; Monica happily agrees; Mommy Tere and Renee share the outro.
- Tonal curve: immediate loving warmth -> curious hope -> friendly Filipino humour -> magical transition -> warmth, dancing and belonging -> human CTA.
- Narrative truth: a community celebration does not replace family back home; it makes Christmas abroad feel less lonely. Portray domestic workers with dignity, warmth, agency, and authenticity. Do not invent individual life circumstances.
- Maximum final duration 60 seconds HARD. Recommended 58-second vertical 9:16 master. Produce a shorter ~30-35s cut only by trimming without changing the meaning.
- A screenshot showed 33 portrait filenames on 2026-11-13 but NO actual original portrait files. The media-owner will provide the clearly visible original selfie for each named member; archival practice/dance videos; exact image of game rules; and the event title/date/venue/time details. Never invent these assets or claim delivery before they are supplied.
- The owner's accounts may have different Flow credit balances; do not assume credits can be pooled or auto-transferred.

## Casting and canonical spelling
Story roles: Monica (sad protagonist), Jessa (gentle invitation), Mischie (spelled M-I-S-C-H-I-E, owner-confirmed P04/P05 speaking character, enthusiastic "Besh!"), Mommy Tere (outro), Renee (spelled R-E-N-E-E, joins Tere's outro).
Featured dancers, cover every member: Leizel, Susie, Margie, Flor, Riza, Anavee, Lilia, Usha, Iad, Willy, Adrian, Donna.
Source transcript contained approximate variants "Liza" vs "Leizel", "Floor" vs "Flor", "Anavi" vs "Anavee", "Suzy" vs "Susie"; use the established initial/project spellings **Leizel, Flor, Anavee, Susie** provisionally until the portrait filenames confirm. Do not silently collapse Riza and Leizel into one person.
Optional real video of Susie: only insert owner-supplied licensed/consented archival footage; do not fabricate a past event clip.

## Monica P01 audio fix — 2026-11-13
The owner corrected the exact spoken line to **"Merry Christmas sa inyo… miss na miss ko na kayo."** This includes the additional "na". Generate a 10-second clip from her original approved still. Finish all speech within approximately six seconds, then hold a silent loving smile for about four seconds. Final timeline gives P01 0–6 seconds (two extra seconds recovered from the dance montage), keeping the entire video 58 seconds.

If Flow drops the last words, preserve the successful opening footage; generate a separate, single-speaker P01B pickup with only **"Miss na miss ko na kayo."** using the original still image, or record a consenting person's real Tagalog voice to add in post. A policy error is not equivalent to clipped speech: do not repeatedly attempt to evade a safety refusal. Google Flow does not support changing what someone says in an uploaded video. If the photo-based generation is rejected again, use real human voice and edit it outside Flow.

## APPROVAL-DRAFT TAGLISH SCRIPT — exact on-screen timing for 58s
| Time | Picture / post | Spoken line / sound |
| --- | --- | --- |
| 00.0–06.0 | IN MEDIA RES: Monica already smiling tenderly at her phone/family image, warm fairy lights reflecting in her eyes; positive affection first, wistful love only as subtext. | MONICA (natural, tender smile): "Merry Christmas sa inyo… miss na miss ko na kayo." |
| 06.0–11.0 | Her phone scrolls onto an event ad; phone insert uses the REAL Paskong Pinoy Remix poster plus REAL clip of Susie dancing in last year's event. | MONICA, voice lifting: "Ang saya naman dito…" |
| 11.0–15.0 | Jessa taps her shoulder gently; Monica looks up. | JESSA: "Gusto mo bang sumali?" |
| 15.0–19.0 | Mischie pops into frame unexpectedly, exuberant but not screaming. | MISCHIE: "Besh! Sumali na kayo!" |
| 19.0–21.0 | Mischie offers a hand and playfully pulls Monica and Jessa forward; hand-swipe / whip-pan / Christmas-light match cut. Composite if necessary. | Festive musical whoosh; NO dialogue. |
| 22.0–25.0 | Magical arrival in vibrant decorated event space; dance montage group A: Leizel, Susie, Margie, Flor. | Festive music; live cheering. |
| 25.0–28.0 | Dance montage group B: Riza, Anavee, Lilia, Usha. | Music. |
| 28.0–31.0 | Dance montage group C: Iad, Willy, Adrian, Donna. | Music. |
| 31.0–33.0 | REAL dancing/practice crowd, smiles, food, raffle and prizes; meaningful Monica reaction (wide-eyed happy smile). Props and prizes only if genuinely planned. | Music dips slightly to make next line clear. |
| 32.0–35.0 | Jessa turns to Monica. | JESSA: "Gusto mo ba sumama?" |
| 35.0–38.0 | Monica responds immediately, delighted. | MONICA: "Of course, siyempre!" |
| 38.0–43.0 | Jessa raises phone toward Monica; screen is replaced in post with the EXACT owner-provided image of game rules, visible long enough to read. | Music under; NO dialogue; do not render or rewrite rules using AI. |
| 43.0–47.0 | Monica returns a confident little grin. | MONICA: "Walang problema, madali lang 'yan!" |
| 47.0–52.0 | Mommy Tere looks toward the camera in event lighting. | MOMMY TERE: "Tara na sa Paskong Pinoy Remix!" |
| 52.0–55.0 | Renee gently moves into the SAME final frame with Mommy Tere. Use separate Renee pickup and composite to avoid cross-speaker failure. | RENEE: "See you there!" |
| 55.0–58.0 | End card: exact approved event logo/title + date + venue + details/CTA from verified flyer only. | Musical sting. |

Editable line alternatives are creative proposals; keep user-approved lines locked once confirmed. Do not add new speakers or imply family reunion/travel.

## Emotional and cinematography rules
1. The first frame must already be emotionally legible: Monica gives a loving family greeting with a genuine smile and warm holiday glow; gentle longing may be felt, but no distress, crying or sorrow at the opening. Avoid a slow establishing shot.
2. Monica's love is warm and specific; her gentle homesickness is only an understated undertone, never melodramatic or humiliating. No stereotyping domestic workers.
3. Opening warm golden Christmas light -> vibrant festive red-and-gold party; use light / saturation / sound to encode emotional transition.
4. Real archival party footage is authenticity and identity authority for Susie's dancing and the twelve named dancers where possible.
5. The digital ad (phone poster and Susie footage), phone rules and final end card MUST be exact graphics edited in post. Flow makes blank-screen or replaceable-screen performance plates.
6. Transition: match hand extension + whip-pan or fabric / fairy-light occlusion; build effect in post instead of relying on Flow to keep three faces stable across a simulated portal.
7. Never send a model 12 different identities in a single generated dance pickup. Use real clips, three groups of four, or individual portrait motion loops plus editorial montage. Every dancer must be verifiably visible in final edit.
8. Music: licensed/original Filipino Christmas-esque instrumental; avoid third-party commercial audio and unlicensed hit recordings.
9. Vertical 9:16; subtitles in raised lower-middle safe area ~62–68% from top (target 65%), generated AFTER inspecting actual final audio; opening/middle/outro QC. Burned-in graphics come from post, not Flow.
10. If any asset is missing, use an explicitly marked placeholder in planning only; never represent placeholders as final footage.

## Comparable Filipino storytelling references (inspiration for high-level pacing, not shot-for-shot copying)
- Jollibee, "Kwentong Jollibee: Pamasko" (2017): OFW family longing / restraint; https://www.youtube.com/watch?v=j-MMiPZoxZc ; production background: https://www.adobomagazine.com/campaign-spotlight/campaign-spotlight-jollibee-and-mccann-worldgroup-philippines-pay-tribute-to-ofws-this-christmas/
- Jollibee, "Buo ang Saya ng Pasko" (2025): joy and togetherness; https://vimeo.com/1137582515
- Cadbury Philippines, "The Most Generous Ones in Our Lives" (2024): documentary natural emotion, real OFW reunion; https://dev.clapboard.studio/archive/cadbury-philippines-the-most-generous-ones-in-our-lives-confectionery-snacks
- Coca-Cola "Sound of Home" (2025 campaign): emotional sonic link to family for OFWs; https://www.ogilvy.com/ap/work/sound-home-fm
Do not use logos, exact camera setups, scripts, or audio of reference campaigns.

## Repository deliverables
- [GOOGLE_FLOW_AGENT_INSTRUCTION.md](GOOGLE_FLOW_AGENT_INSTRUCTION.md) — persistent cross-account agent operating instruction.
- [GOOGLE_FLOW_AGENT_PROMPT.md](GOOGLE_FLOW_AGENT_PROMPT.md) — separate current episode-level agent prompt.
- [FLOW_PICKUP_PROMPTS.md](FLOW_PICKUP_PROMPTS.md) — authoritative V3 atomic per-pickup prompts with dialogue-completion and policy-safe generation instructions.
- [PICKUP_TIMING_MANIFEST.json](PICKUP_TIMING_MANIFEST.json) — authoritative per-shot 58-second timetable, spoken lines and performance deadlines.
- [PICKUP_PREFLIGHT.md](PICKUP_PREFLIGHT.md) and [PICKUP_PREFLIGHT.mjs](PICKUP_PREFLIGHT.mjs) — scene preflight and deterministic structural validator.
- [CAST_REFERENCE_INDEX.md](CAST_REFERENCE_INDEX.md) — all 33 screenshot filenames mapped to 24 distinct people; no full-resolution images supplied yet.
- [AVAILABLE_CAST_PROMPT_BANK.md](AVAILABLE_CAST_PROMPT_BANK.md) — ready-to-fill dialogue, dancer and optional cameo pickups.
- [ASSET_MANIFEST.csv](ASSET_MANIFEST.csv) — identity / archival / graphic assets to collect.
- This README — story, timing, roster, cinematography, research and completion gates.

## 2026-11-13 readiness update
- Screenshot-only reference filenames are indexed in CAST_REFERENCE_INDEX.md; 33 files / 24 distinct people.
- 13 of 17 previously required cast names have filename matches (Tere identity provisional), including Mischie; missing names are Renee, Leizel, Anavee and Iad.
- Mischie is explicitly owner-confirmed as the invitation/transition performer, with `w2_mischie_one.jpeg` and `w2_mischie_two.jpeg` as candidate reference files. Eleven other names are optional silent cameos, not replacements.
- No named member can be used in Flow until an original reference image (or consented actual video) has been supplied.

## Next production gates
1. Receive portraits, obtain permission to use and AI-animate likenesses, fill manifest.
2. Receive approved real archive/dance clips including Susie; the exact rules PNG/JPG; final flyer with date/venue.
3. Confirm final script wording, card details, and shot order with owner.
4. In each Flow account: select Omni 1.2 Flash, 360p, 10-second duration, one 9:16 output and 10-credit price; confirm the available credit balance and count at most 5 charged generations per 50-credit account. Never use a generated video as the next pickup's identity reference.
5. Review all output identities, speech, blocking; assemble in Remotion/FFmpeg/editor with exact overlaid images and real clips; derive subtitles from actual audio.
6. Validate 9:16, 58s target / <60s hard, at least one recognisable shot for each dancer, readable image/rules, sound transitions, consent and final approval.
