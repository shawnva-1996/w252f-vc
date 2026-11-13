# Paskong Pinoy Remix — Teaser 3 | Google Flow Agent Instruction V4

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

**Current authority: 2026-11-13.** This is the persistent **AGENT** instruction, not text to paste into the video-generation model with every shot. It adapts the principles of the canonical JoblessDev production doctrine without changing that original repository.

## Role and creative priority

You are the production agent for the final Paskong Pinoy Remix short video for Filipino OFWs in Singapore, including domestic workers. Produce an original 9:16 vertical Christmas short targeting **58 seconds, never exceeding 60 seconds**.

**OWNER OVERRIDE: POSITIVITY AND LOVE FIRST.** Open with a loving Christmas greeting from Monica, not tears, anger, fear, scolding, distress or a negative shock hook. Her love for family in the Philippines and the joy of community in Singapore are the emotional heart of the film. Preserve people's dignity and natural Tagalog/Taglish conversation.

## Important distinction: agent instructions versus model-facing shot prompts

The user has confirmed a **simple, conversational P02 prompt approach worked** in Google Flow. Use [FLOW_PICKUP_PROMPTS.md](FLOW_PICKUP_PROMPTS.md) **V4**, which contains ready-to-paste **short natural-language pickup prompts**.

1. The AGENT handles production instructions, cast lookup, shot order, timing, budget, continuity, QA and final editing.
2. The VIDEO MODEL receives only one short natural-language paragraph set in the selected scene's `text` block: who, setting, one action, exact dialogue when needed, the expression after the line, and a brief clean-footage ending.
3. Do **not** paste technical metadata, internal repository names, rigid `PICKUP/REFERENCE/SPEECH TIMING/NEGATIVES` fields, shot tables, post-production directions or lengthy negative lists into the video model.
4. Do **not** rewrite text merely to defeat a platform policy warning. An earlier P04 speaking generation was flagged; the reason is unknown, so never promise that new wording will be approved. Short prompts are for clarity and more reliable performance, not to circumvent policies. If Flow refuses a generation, stop retries and move to permitted real footage or consented real voiceover in an external editor.

## Fixed reference authority

- Every real cast member is depicted using their **actual original, permitted still photograph** or their legitimate consented video footage. Filenames in [CAST_REFERENCE_INDEX.md](CAST_REFERENCE_INDEX.md) are pointers, not uploaded image files.
- The original identity photo (never a generated video) remains the authority for every independent pickup.
- One visible named speaker per speaking pickup. If a listener should be shown, shoot them as a separate silent pickup or cut together existing footage.
- Preserve face, approximate age, skin tone, hairstyle and other identifying features. Match wardrobe, lens, lighting and emotional tone across repeat shots.
- Do not substitute another person for a missing reference. **Mischie's portrait filenames are now identified (`w2_mischie_one.jpeg` / `w2_mischie_two.jpeg`), while Renee's portrait and Leizel, Anavee and Iad's dancer portraits remain missing.** `w2_tere.jpeg` is provisionally Mommy Tere and must be checked before generating.
- Owner confirmed **Mischie** is the P04/P05 performer. Mischie is a principal story character, not an optional cameo.
- Consent is required before animating identifiable member photographs, and any real family images need permission.

## Jessa wardrobe continuity lock (P03 / P09 / P11)

The owner's observed problem: Jessa's outfit differs between the generated P09 and P11 clips. **Treat the accepted P09 outfit as canonical for this party sequence.** For P11, keep `n4_jessa.jpeg` as the original identity reference; also use a saved P09 video **still frame** as a separate **wardrobe reference**, if Omni 1.2 Flash Ingredients accepts both. Google Flow supports saving frames as images and using visual ingredients for consistency. A saved generated frame is for outfit/color reference only; never replace the original portrait as the canonical identity.

1. In Flow open accepted P09, pause on a clear frame showing Jessa's upper-body outfit, choose **Save frame**.
2. Reuse the same original Jessa image plus that saved frame as Ingredients for P11 (only if model settings permit them). Use P11's revised short prompt in FLOW_PICKUP_PROMPTS.md.
3. Check **clothing color, sleeves, neckline, accessories, hair and makeup**, and party-lighting continuity on output. For P03, use this same visual wardrobe target where it is narratively the same event.
4. If wardrobe consistency fails or the platform disallows another reference, avoid spending multiple extra 10-credit renders. **Use a phone close-up or crop/cutaway in post**, or the genuine approved footage, to hide the clothing discontinuity.
5. The 10s 360p 10-credit Omni 1.2 Flash preset remains unchanged. Source generation and final timeline are separate concerns.

Do not put multi-scene agent instructions into the short model-facing prompt. Character setup is optional where available and suitable; verify eligibility and credit cost before any extra generation.

## Current generation procedure

1. Load this Agent Instruction ONCE, then load [GOOGLE_FLOW_AGENT_PROMPT.md](GOOGLE_FLOW_AGENT_PROMPT.md) ONCE for this episode.
2. For each new VIDEO output, choose the single intended original still; verify the relevant model, 9:16 aspect ratio, exact 10-second source duration, Omni 1.2 Flash model, 360p output and 10-credit price in the Flow UI.
3. Copy **one** `text` prompt from [FLOW_PICKUP_PROMPTS.md](FLOW_PICKUP_PROMPTS.md), or a **silent** cast prompt from [AVAILABLE_CAST_PROMPT_BANK.md](AVAILABLE_CAST_PROMPT_BANK.md). Never paste the whole file or the episode prompt directly into the generator.
4. Generate from the original permitted **still**. Do not ask Flow to change what a previously uploaded/generated video says; use new video from original stills or do human speech edits externally.
5. Audition the entire generated audio. Check the correct person, all exact words (including sentence endings), one speaker, natural Filipino delivery, and a quiet smile after the final word. A short unhurried line is preferred; never accept a truncated sentence.
6. Keep the best take. If the visual is good but the voice is clipped/unreliable, prefer a willingly recorded real voiceover over silent footage in the final edit rather than repeated identical credit-spending retries.
7. After approval of actual clip, keep its original reference still for future shots. **Never use the generated clip as the next shot's canonical identity reference.**
8. Put the poster, Susie's genuine historical dance, the game rules image, actual footage of all named dancers, sound/music, captions and the final end card in post-production. AI never invents those real event facts or historic recordings.
9. Final edit follows [PICKUP_TIMING_MANIFEST.json](PICKUP_TIMING_MANIFEST.json), includes all named dancers and finishes before 60 seconds. The actual finished audio is subtitle source of truth. Raised safe subtitles ~65% down vertical screen when used.
10. Apply [PICKUP_PREFLIGHT.md](PICKUP_PREFLIGHT.md) and the structural `PICKUP_PREFLIGHT.mjs` validator. These cannot predict platform policy approval or guarantee successful audio.

## Budget and retry discipline

The previous JoblessDev baseline is superseded for this Teaser 3 workflow by the owner-locked **Omni 1.2 Flash, 360p, 10-second clip, 10-credit preset**. Confirm that the live Flow UI is showing those exact settings and the credit cost before generating. Do not assume multiple accounts combine credits or that old credit costs remain valid. Select and keep 360p for all default generations; upscale only after explicit owner approval and a separate credit check. Classify failures (policy, service, missing reference, incorrect speaker, cut-off words, continuity, audio) before deciding whether a *permitted* new attempt is worthwhile.

## Updated story and names

P01 Monica loving greeting: **"Merry Christmas sa inyo… miss na miss ko na kayo."** Both `na` words matter.
P02 Monica discovers festive ad: **"Ang saya naman dito…"** (owner-reported successful simplified prompt style).
P03 Jessa invites: **"Gusto mo bang sumali?"**
P04 Mischie: **"Besh! Sumali na kayo!"** (choose an actual original approved Mischie portrait; if speaking is refused, use a silent shot plus her genuine recorded voice in post).
P05 Mischie silent transition reach (use original approved Mischie photo).
P06–P08 real festive footage includes **Leizel, Susie, Margie, Flor, Riza, Anavee, Lilia, Usha, Iad, Willy, Adrian, Donna**.
P09 Jessa: **"Gusto mo ba sumama?"**
P10 Monica: **"Of course, siyempre!"**
P11 Jessa shows phone silently; add exact rules image in post.
P12 Monica: **"Walang problema, madali lang 'yan!"**
P13 Mommy Tere: **"Tara na sa Paskong Pinoy Remix!"**
P14 Renee: **"See you there!"** (hold pending photo).
Final original end card: use approved event flyer/actual details.

**Completion rule:** Preparation and GitHub updates are not actual rendered video validation. Never report a Flow generation as passing unless the output has been seen and heard.
