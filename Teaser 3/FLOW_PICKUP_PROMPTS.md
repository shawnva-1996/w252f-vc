# Paskong Pinoy Remix — Teaser 3 | Flow pickup prompts V5

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

**Updated 2026-11-15 (V5: V3 cast and line changes — owner, 15 Nov 2026).** These are **short, plain-language video-generation prompts**, modeled on the exact P02 wording the owner reported working in Google Flow. This is a clarity/usability improvement; **it does not guarantee Flow policy approval**. If a prompt is refused, respect the refusal and use real, permitted footage or a consented human-recorded voiceover in the editor.

**Creative priority:** POSITIVITY AND LOVE FIRST. Filipino OFW community, warm Christmas family affection, natural Tagalog/Taglish, original member likeness with consent. **Iad** is the correct dancer's name.

**V3 changes in this version:** P04 Ate Susie line is now "Mga Pangga, sumali na kayo!"; P09 is Ate Margie (`ate_margie.jpeg`); P11 is Ate Leizel (photo TBC — HOLD) with the program poster on the phone screen; P14 is ONE group shot of Kuya Rene, Ate Ana and Ate Joy together (52–55s), saying "See you there!" together — via Google Flow (multi-reference) or a self-recorded group clip. Solo generations are alternates only (Ana + Joy verified 15 Nov 2026; Rene solo generation failed — do NOT retry). The 09–11s invitation poster and the 39.5–43s Contest Rules poster are real supplied images, not generations.

## One-time setup (agent), then one pickup at a time (video model)
1. In Google Flow Agent mode, provide [Agent Instruction](GOOGLE_FLOW_AGENT_INSTRUCTION.md) once, then the [Episode Agent Prompt](GOOGLE_FLOW_AGENT_PROMPT.md) once.
2. For each scene below, **attach the actual original, permitted photograph** listed under **Reference**. The screenshot of filenames is not a substitute. When an actor is missing, leave their scene on hold.
3. In the VIDEO-generation interface, select 9:16, Omni 1.2 Flash, 360p, 10 seconds, one output, and confirm 10 credits per charge. Do not generate if any setting differs; respect the five-charged-generation budget per 50-credit account. The timing is an editor/agent setting, **not** part of the short model-facing prompt.
4. **Copy only the text inside that pickup's `text` code block** into the video model. Do not paste the editorial notes, JSON, tables, large negative lists, or production metadata.
5. Listen to the generated audio. Verify the whole sentence, particularly its final words. Accept only a shot that matches the reference person, expression and dialogue. Use the [preflight checklist](PICKUP_PREFLIGHT.md); numbers in [timing manifest](PICKUP_TIMING_MANIFEST.json) govern the final 58-second cut.
6. Do not ask Flow to change what an existing uploaded/generated video says. If an audio version is refused or unsupported, use an approved real voice recording over a silent scene in post; never try to circumvent a safety refusal.

## Dialogue pickups — one reference, one speaker, one simple action

### P01 — Monica sends love home (final 00–06s)

**Reference:** `sa_monica.jpeg`

```text
Create a warm Christmas-themed vertical 9:16 video of Monica using the attached reference photo.

Monica is in a cozy, warmly lit Singapore room with soft golden Christmas lights in the background. She is holding her phone and smiling lovingly, as if sending a Christmas greeting to her family.

She says naturally in Tagalog:

"Merry Christmas sa inyo… miss na miss ko na kayo."

After saying the complete sentence, she keeps a soft loving smile and looks at the phone quietly for the rest of the clip.

Use a natural conversational Filipino tone. Keep it as a single continuous shot, with only Monica visible. No subtitles, no logos, and no on-screen text.
```

**Editor / QA:** Previously clipped in a 4-second target; keep the entire 10-second source, review every word, then trim to 6s in final edit. Speech must be fully audible before the final cut.

### P02 — Monica discovers the celebration (final 06–11s)

**Reference:** `sa_monica.jpeg`

```text
Create a warm Christmas-themed vertical 9:16 video of Monica using the attached reference photo.

Monica is in a cozy warmly lit room with soft golden Christmas lights in the background. She is holding and looking at her phone. She notices something joyful on the screen, and her face brightens with happy curiosity.

She says naturally in Tagalog:

"Ang saya naman dito…"

After saying the line, she keeps a gentle happy smile and continues looking at the phone quietly for the rest of the clip.

Use a natural conversational Filipino tone. Keep it as a single continuous shot, with only Monica visible. No subtitles, no logos, and no on-screen text.
```

**Editor / QA:** OWNER-REPORTED SUCCESSFUL PROMPT. Do not change its wording. The real invitation/program poster (09–11s) is inserted later in editing. Speech must be fully audible before the final cut.

### P03 — Jessa invites Monica (final 11–15s)

**Reference:** `n4_jessa.jpeg`

```text
Create a warm Christmas-themed vertical 9:16 video of Jessa using the attached reference photo.

Jessa is in a softly lit Christmas setting with warm golden lights. She looks toward a friend just outside the frame, offering a gentle and welcoming smile.

She says naturally in Tagalog:

"Gusto mo bang sumali?"

After saying the line, she keeps her friendly, encouraging smile for the rest of the clip.

Use a natural conversational Filipino tone. Keep it as a single continuous shot, with only Jessa visible. No subtitles, no logos, and no on-screen text.
```

**Editor / QA:** If a visible shoulder tap is desired, build it as a separate silent insert. This pickup contains only Jessa. Speech must be fully audible before the final cut. **P03 is now the only Jessa shot in V3** — P09 is Ate Margie and P11 is Ate Leizel.

### P04 — Ate Susie's cheerful invitation (final 15–19s)

**V3 LINE CHANGE — OWNER, 2026-11-15:** The line is now **"Mga Pangga, sumali na kayo!"** (warm, encouraging tone), replacing "Besh! Sumali na kayo!". **Reference:** attach ONE actual consented photo of Ate Susie, `sa_susie.jpeg` or `sa_susie_2.JPG`, not an earlier person's clip. The existing Drive `p04.mp4` shows the earlier Mischie performer and is **OBSOLETE for this scene**; the existing `p04_susie.mp4` audio says the OLD line and must NOT be used for the new line.

**New generation attempted 15 Nov 2026 (first-frame approach) — QA PENDING. Do not claim a result until the clip is listened to and verified.**

**Copy only this model-facing text into Google Flow:**

```text
Create a warm Christmas-themed vertical 9:16 video of Ate Susie using the attached reference photo.

Ate Susie is at a cheerful Christmas celebration with glowing golden lights. She sees her friends nearby, smiles brightly, and welcomes them with a friendly gesture.

She says naturally in Tagalog, in a warm encouraging tone:

"Mga Pangga, sumali na kayo!"

After speaking, she keeps smiling happily.

Keep it as a single continuous shot, with only Ate Susie visible. No subtitles, no logos, and no on-screen text.
```

**If a platform safety refusal occurs, respect it.** Use a real permitted silent Susie clip with an actual consented voice recording in the editor, rather than repeated prompts to defeat a refusal.

**Editor / QA:** 15–19s. Confirm actual person is Ate Susie using approved reference media. The entire Tagalog line must be audibly complete before the cut. Her role in P04/P05 is separate from, but complementary to, her already-planned dance montage and real historical dance insert.

### P05 — Ate Susie's friendly wave (final 19–21s)

**Reference:** Attach one original approved Ate Susie photo, `sa_susie.jpeg` or `sa_susie_2.JPG`. **Latest update:** the former hand-reaching-toward-the-camera prompt triggered a Google Flow policy warning according to the owner. The cause is unknown. The short waving prompt below is **UNTESTED**, not a policy-approval guarantee.

```text
Create a cheerful vertical 9:16 Christmas video of Ate Susie using the attached reference photo.

Ate Susie is surrounded by warm golden Christmas lights. She smiles happily at the camera and gives a small, friendly wave.

She holds her smile naturally for the rest of the video.

A single continuous shot. No dialogue or on-screen text.
```

**Editor / QA:** Final 19–21s. Add a quick push-in / festive light-flash transition into the genuine dance rehearsal **in the editor**, not through Flow's hand-to-lens motion. The current Drive `p05.mp4` is a legacy **Mischie** clip and must NOT be labeled as Ate Susie. Reuse genuine permitted footage if available rather than spending 10 credits on repeated refused generations. If Flow refuses this image-based generation too, stop retrying and use a still-image Ken Burns animation or real approved Susie footage.

### P09 — Ate Margie renews the invitation (final 32–35s)

**V3 RECAST — OWNER, 2026-11-15:** P09 is now **Ate Margie** (was Jessa). **Reference:** `ate_margie.jpeg` (Drive refs folder).

**New generation attempted 15 Nov 2026 — QA PENDING. Do not claim a result until the clip is listened to and verified.** The old Flow `p09.mp4` shows Jessa and must NOT be used for this slot.

```text
Create a warm Christmas-themed vertical 9:16 video of Ate Margie using the attached reference photo.

Ate Margie is now in a lively Christmas party setting with warm golden lights. She looks toward Monica just outside the frame and smiles as she warmly invites her.

She says naturally in Tagalog:

"Gusto mo ba sumama?"

After saying the line, she remains smiling quietly for the rest of the clip.

Use a natural conversational Filipino tone. Keep it as a single continuous shot, with only Ate Margie visible. No subtitles, no logos, and no on-screen text.
```

**Editor / QA:** Speech must be fully audible before the final cut. Confirm the performer is Ate Margie using the approved reference photo.

### P10 — Monica says yes (final 35–38s)

**Reference:** `sa_monica.jpeg`

```text
Create a warm Christmas-themed vertical 9:16 video of Monica using the attached reference photo.

Monica is in the happy Christmas party setting with warm festive lights. She looks toward someone just outside the frame and reacts with delight, smiling brightly.

She says naturally in conversational Taglish:

"Of course, siyempre!"

After saying the line, she keeps her happy, excited smile for the rest of the clip.

Use a natural conversational Filipino tone. Keep it as a single continuous shot, with only Monica visible. No subtitles, no logos, and no on-screen text.
```

**Editor / QA:** The final cut gives this short reply 3 seconds; preserve the full phrase. Speech must be fully audible before the final cut.

### P11 — Ate Leizel presents her phone SCREEN to the camera (final 38–43s)

**V3 RECAST — OWNER, 2026-11-15:** P11 is now **Ate Leizel** (was Jessa). **Reference: NOT available yet — HOLD this scene until Ate Leizel's approved original photo is supplied.** Do not generate with a substitute photo.

**References / continuity:** Attach original approved Ate Leizel photo for identity when it arrives. Keep the locked preset **Omni 1.2 Flash · 360p · 10 seconds · 10 credits · 9:16 · one output**. This is a new generation from still images, not an edit to a video.

**Copy only this short prompt into Flow (once the photo arrives):**

```text
Create a warm Christmas-themed vertical 9:16 video of Ate Leizel using the attached reference images.

Ate Leizel is smiling at a cheerful Christmas party with soft golden lights.

She is already holding her smartphone vertically at chest level, next to her face. The phone's FRONT GLASS DISPLAY faces straight toward the camera from the first frame, like someone showing the viewer a photo. The BACK of the phone faces Ate Leizel. The screen is completely visible, flat toward the lens, with a plain light-grey display.

Ate Leizel holds this pose naturally and smiles. She does not speak.

One steady shot, with only Ate Leizel visible. No subtitles or on-screen text.
```

**Critical framing QA:** The viewer MUST see the **front screen/glass**, NOT the back of the handset and NOT a screen turned toward Ate Leizel. The display must stay near-front-on, upright portrait orientation, unobstructed and large enough to composite the real program poster. Avoid the previous **"raises phone toward camera"** action because it encouraged the model to show the screen facing her. Starting in the final screen-forward pose is safer than generating a rotation. The screen itself is **blank / neutral** in Flow; the editor composites the exact owner-approved program poster (`paskong_pinoy_remix_program.jpeg`) onto it later. Do not ask Flow to generate poster text. The old Flow `p11.mp4` shows Jessa and must NOT be used for this slot.

**If already rendered and otherwise usable:** You may avoid spending another 10 credits by using a phone-screen cutaway / an editorial insert showing the program poster, rather than forcing a new model generation. Do not retry repeatedly after policy refusal.

### P12 — Monica says the rules are easy (final 43–47s)

**Reference:** `sa_monica.jpeg`

```text
Create a warm Christmas-themed vertical 9:16 video of Monica using the attached reference photo.

Monica is at the Christmas party with warm colorful festive lights behind her. She glances up from a phone and responds with a confident, cheerful smile.

She says naturally in Tagalog:

"Walang problema, madali lang 'yan!"

After saying the complete line, she keeps a friendly confident smile for the rest of the clip.

Use a natural conversational Filipino tone. Keep it as a single continuous shot, with only Monica visible. No subtitles, no logos, and no on-screen text.
```

**Editor / QA:** Preserve the entire ending 'yan!' before cut. Speech must be fully audible before the final cut.

### P13 — Mommy Tere invites everyone (final 47–52s)

**Reference:** `w2_tere.jpeg`

```text
Create a warm Christmas-themed vertical 9:16 video of Mommy Tere using the attached reference photo.

Mommy Tere is at a bright, welcoming Christmas gathering decorated with warm festive lights. She looks toward the camera with an open, cheerful expression and warmly invites everyone.

She says naturally in Tagalog:

"Tara na sa Paskong Pinoy Remix!"

After saying the line, she keeps a warm welcoming smile for the rest of the clip.

Use a natural conversational Filipino tone. Keep it as a single continuous shot, with only Mommy Tere visible. No subtitles, no logos, and no on-screen text.
```

**Editor / QA:** Confirm that w2_tere.jpeg actually depicts the intended Mommy Tere before generating. Kuya Rene, Ate Ana and Ate Joy appear together in the P14 group shot. Speech must be fully audible before the final cut.

### P14 — Kuya Rene, Ate Ana and Ate Joy together in one group shot (final 52–55s)

**V3 CORRECTION — OWNER, 2026-11-15 (evening):** P14 is three people — **Kuya Rene (male), Ate Ana (spelled "Ana"), Ate Joy** — NOT "Ate Renee, Ate Joy, Ate Anna" as first recorded in V3. **CORRECTED ~21:35: P14 is ONE group shot (52–55s, 3 seconds) — all three together, saying "See you there!" together — NOT three ~1-second cuts.** **References: supplied — `kuya_rene.jpeg`, `ate_ana.jpeg`, `ate_joy.jpeg` (Drive refs folder).** The old Flow `p14.mp4` (single René) must NOT be used for this slot.

**Planned routes for the group shot: Google Flow (multi-reference — attach all three photos) or a self-recorded group clip.**

**Copy only this model-facing text into Google Flow (multi-reference):**

```text
Create a warm Christmas-themed vertical 9:16 video of Kuya Rene, Ate Ana and Ate Joy together using the attached reference photos.

Kuya Rene, Ate Ana and Ate Joy are together in a joyful Christmas party setting with warm golden lighting. They lean gently into the frame with cheerful smiles and look toward the camera.

They say naturally in English, together:

"See you there!"

After saying the line, they keep smiling quietly for the rest of the clip.

Use a natural conversational Filipino tone. Keep it as a single continuous shot, with only Kuya Rene, Ate Ana and Ate Joy visible. No subtitles, no logos, and no on-screen text.
```

**Note on Joy's photo:** `ate_joy.jpeg` is a studio cut-out on a checkerboard background. The generation places her in a Christmas scene instead of using that background.

**Editor / QA:** One 3-second group shot (52–55s), all three together, saying "See you there!" together. Compose with Mommy Tere in post. Speech must be fully audible before the final cut. The group clip is still needed (Flow multi-reference or self-recorded).

### P14 solo alternates (fallback only — NOT the final P14 structure)

The solo generations below are **alternates only**. Do not cut P14 as three solo shots.

#### P14a — Kuya Rene (solo alternate)

**Reference:** `kuya_rene.jpeg`

**Generation FAILED 15 Nov 2026 (integrity check) — do NOT retry this route. Use the group shot (Flow multi-reference or self-recorded) instead.**

```text
Create a warm Christmas-themed vertical 9:16 video of Kuya Rene using the attached reference photo.

Kuya Rene is in a joyful Christmas party setting with warm golden lighting. He looks toward the camera with a cheerful smile.

He says naturally in English:

"See you there!"

After saying the line, he keeps smiling quietly for the rest of the clip.

Use a natural conversational Filipino tone. Keep it as a single continuous shot, with only Kuya Rene visible. No subtitles, no logos, and no on-screen text.
```

#### P14b — Ate Ana (solo alternate)

**Reference:** `ate_ana.jpeg`

**Generated + verified 15 Nov 2026 — `clips/p14-ana.mp4` (720×1280, 10s, "See you there!" confirmed, likeness holds).**

```text
Create a warm Christmas-themed vertical 9:16 video of Ate Ana using the attached reference photo.

Ate Ana is in a joyful Christmas party setting with warm golden lighting. She looks toward the camera with a cheerful smile.

She says naturally in English:

"See you there!"

After saying the line, she keeps smiling quietly for the rest of the clip.

Use a natural conversational Filipino tone. Keep it as a single continuous shot, with only Ate Ana visible. No subtitles, no logos, and no on-screen text.
```

#### P14c — Ate Joy (solo alternate)

**Reference:** `ate_joy.jpeg` — note: Joy's photo is a studio cut-out on a checkerboard background. The generation places her in a Christmas scene instead of using that background.

**Generated + verified 15 Nov 2026 — `clips/p14-joy.mp4` (720×1280, 10s, "See you there!" confirmed, likeness holds).**

```text
Create a warm Christmas-themed vertical 9:16 video of Ate Joy using the attached reference photo.

Ate Joy is in a joyful Christmas party setting with warm golden lighting. She looks toward the camera with a cheerful smile.

She says naturally in English:

"See you there!"

After saying the line, she keeps smiling quietly for the rest of the clip.

Use a natural conversational Filipino tone. Keep it as a single continuous shot, with only Ate Joy visible. No subtitles, no logos, and no on-screen text.
```

## Real-footage montage (P06–P08) — final 21–32 seconds

This section is predominantly **post-production**, not one AI video prompt. Use genuine consented dance/practice footage and give every required named dancer a recognisable moment. No invented historical videos.

| Scene | Final seconds | People to show |
|---|---|---|
| P06 | 21–24 | Leizel, Susie, Margie, Flor |
| P07 | 24–27 | Riza, Anavee, Lilia, Usha |
| P08 | 27–32 | Iad, Willy, Adrian, Donna |

If genuine footage is unavailable for an individual, use that person's original approved portrait and a **single-person silent dancer prompt** from [Available Cast Prompt Bank](AVAILABLE_CAST_PROMPT_BANK.md). Missing photos for Leizel, Anavee, and Iad remain on hold. Prefer existing real video for Susie's past performance; do not invent a historical clip.

## Optional P01B voice recovery

Monica's owner-corrected full line is **"Merry Christmas sa inyo… miss na miss ko na kayo."** If any actual generation cuts the ending, keep good image footage and record the complete line with an approved willing human speaker in post. If the model accepts a separate fresh still-based dialogue pickup, this shorter line is an alternative (it is **not** a request to edit an uploaded clip):

```text
Create a warm Christmas-themed vertical 9:16 video of Monica using the attached reference photo.

Monica is in a cozy Christmas setting with soft golden lights. She looks at her phone and smiles lovingly.

She says naturally in Tagalog:

"Miss na miss ko na kayo."

After speaking, she keeps smiling softly and stays quiet.

Use a natural conversational Filipino tone. Keep it as a single continuous shot, with only Monica visible. No subtitles, no logos, and no on-screen text.
```

Do not continue generating alternate prompts after a Flow safety refusal.

## Finishing notes (editor only, not model-facing)

- Invitation poster (09–11s): actual Paskong Pinoy Remix program poster (`paskong_pinoy_remix_program.jpeg`) — or a filmed real person's iPhone showing it.
- Phone discovery insert: the program poster composited onto the P11 phone screen; do not ask Flow to generate poster text.
- Game rules: use the exact owner-supplied Contest Rules poster (`contest_rules_poster.jpeg`) as the full-screen insert; do not ask Flow to generate text.
- Ate Susie gives a small wave; the editor creates the zoom / Christmas-light-flash transition. No model-generated hand-to-lens move required.
- Mommy Tere + the P14 group shot (Kuya Rene, Ate Ana, Ate Joy together): Google Flow multi-reference or a self-recorded group clip; solo clips are alternates only.
- Finish with the verified event end card. Licensed/original Christmas music. Subtitles from actual final spoken audio at a social-safe raised lower-third.
- Exact master is **58 seconds**, with shot timings from the manifest. No single Flow output is the completed film.
