# Paskong Pinoy Remix — Teaser 3 | Flow pickup prompts V4

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

**Updated 2026-11-13.** These are **short, plain-language video-generation prompts**, modeled on the exact P02 wording the owner reported working in Google Flow. This is a clarity/usability improvement; **it does not guarantee Flow policy approval**. If a prompt is refused, respect the refusal and use real, permitted footage or a consented human-recorded voiceover in the editor.

**Creative priority:** POSITIVITY AND LOVE FIRST. Filipino OFW community, warm Christmas family affection, natural Tagalog/Taglish, original member likeness with consent. **Iad** is the correct dancer's name.

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

**Editor / QA:** OWNER-REPORTED SUCCESSFUL PROMPT. Do not change its wording. The real Paskong Pinoy Remix ad and real Susie archival clip are inserted later in editing. Speech must be fully audible before the final cut.

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

**Editor / QA:** If a visible shoulder tap is desired, build it as a separate silent insert. This pickup contains only Jessa. Speech must be fully audible before the final cut.

### P04 — Mischie's cheerful invitation (final 15–19s)

**Reference:** Attach ONE original approved Mischie photo: `w2_mischie_one.jpeg` or `w2_mischie_two.jpeg`. The screenshot listing the filenames is not itself a portrait reference.

**Try the concise spoken version once, provided Flow permits this type of generation. Copy only this block:**

```text
Create a warm Christmas-themed vertical 9:16 video of Mischie using the attached reference photo.

Mischie is at a cheerful Christmas gathering with glowing golden lights. She notices friends nearby and gives them a bright, welcoming smile.

Mischie says naturally in Tagalog:

"Besh! Sumali na kayo!"

After speaking, she keeps smiling happily.

Keep it as a single continuous shot, with only Mischie visible. No subtitles, no logos, and no on-screen text.
```

**If Flow flags the speaking shot again, do not keep rewriting it to defeat a restriction.** Use this **silent performance** alternative and add Mischie's own consented recording of the line during editing:

```text
Create a warm Christmas-themed vertical 9:16 video of Mischie using the attached reference photo.

Mischie is at a cheerful Christmas gathering with glowing golden lights. She smiles excitedly and gives friends just outside the frame a friendly welcoming wave.

She does not speak. The moment is joyful and natural.

Keep it as a single continuous shot, with only Mischie visible. No subtitles, no logos, and no on-screen text.
```

**Editor / QA:** Final slot 15–19s. The words **"Besh! Sumali na kayo!"** must be clearly audible in the finished edit, either from a successful approved Flow generation or a genuine consented recording mixed separately. Do not change someone's speech in an uploaded video inside Flow. For silent footage, do not fake lip-sync; cut to the welcoming smile/gesture while the line plays.

### P05 — Mischie's hand transition (final 19–21s)

**Reference:** Attach ONE original approved Mischie photo: `w2_mischie_one.jpeg` or `w2_mischie_two.jpeg`.

```text
Create a warm Christmas-themed vertical 9:16 video of Mischie using the attached reference photo.

Mischie is at a cheerful Christmas party with glowing golden lights. She happily reaches one hand toward the camera as a friendly invitation. Her hand moves gently closer to the lens.

Mischie does not speak and keeps a cheerful smile.

Keep it as a single continuous shot, with only Mischie visible. No subtitles, no logos, and no on-screen text.
```

**Editor / QA:** Final 19–21s. Complete the magical transition with a match cut and party footage in post. Do not ask Flow to generate a complicated multi-person transformation.

### P09 — Jessa renews the invitation (final 32–35s)

**Reference:** `n4_jessa.jpeg`

```text
Create a warm Christmas-themed vertical 9:16 video of Jessa using the attached reference photo.

Jessa is now in a lively Christmas party setting with warm golden lights. She looks toward Monica just outside the frame and smiles as she warmly invites her.

She says naturally in Tagalog:

"Gusto mo ba sumama?"

After saying the line, she remains smiling quietly for the rest of the clip.

Use a natural conversational Filipino tone. Keep it as a single continuous shot, with only Jessa visible. No subtitles, no logos, and no on-screen text.
```

**Editor / QA:** Use same original Jessa photo as P03 for identity continuity. Speech must be fully audible before the final cut.

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

### P11 — Jessa displays the actual rules image (final 38–43s)

**References / continuity:** Use `n4_jessa.jpeg` as Jessa's **original identity image** and a clean **saved still frame from the approved P09 clip** as her **wardrobe reference**, if the selected model supports two image ingredients. Choose a P09 frame showing her outfit clearly and without distracting characters. Save the frame in Flow using **Save frame**, then add it through Ingredients. If only one image is supported, prioritize an identity-accurate still with the approved P09 outfit visible, subject to permission and Flow support. Never treat a prior generated video as the canonical identity asset.

**Copy only this text into the video prompt:**

```text
Create a warm Christmas-themed vertical 9:16 video of Jessa using the attached reference images.

Jessa is at a cheerful Christmas party with soft golden lights.

She wears exactly the same outfit shown in the reference frame from the previous Christmas party scene, including the same colors, neckline, sleeves, and accessories.

Jessa smiles warmly and gently raises her phone toward the camera, holding it steady.

She does not speak.

Keep it as a single continuous shot, with only Jessa visible. No subtitles, no logos, and no on-screen text.
```

**Editor / QA:** P11 final 38–43s. Approve only when Jessa's **face and clothing match the P09 approved visual**. If retake would waste 10 credits or Flow refuses the reference, reuse the existing scene and cut to a close-up of the phone/rules graphic in post; do not repeatedly retry prohibited generations. Compositing adds the actual owner-approved rules image on the phone. Do not generate the rules text with Flow.

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

**Editor / QA:** Confirm that w2_tere.jpeg actually depicts the intended Mommy Tere before generating. Renee will be composited separately. Speech must be fully audible before the final cut.

### P14 — Renee joins the outro (final 52–55s)

**Reference:** Not available yet — HOLD this scene.

```text
Create a warm Christmas-themed vertical 9:16 video of Renee using the attached reference photo.

Renee is in a joyful Christmas party setting with warm golden lighting. Renee leans gently into the frame with a cheerful smile and looks toward the camera.

Renee says naturally in English:

"See you there!"

After saying the line, Renee keeps smiling quietly for the rest of the clip.

Use a natural conversational Filipino tone. Keep it as a single continuous shot, with only Renee visible. No subtitles, no logos, and no on-screen text.
```

**Editor / QA:** ON HOLD until Renee's approved original photo is provided. Compose with Mommy Tere in post. Speech must be fully audible before the final cut.

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

- Phone discovery insert: actual Paskong Pinoy Remix flyer plus genuine Susie archive.
- Game rules: use the exact owner-supplied image as a composited phone screen; do not ask Flow to generate text.
- Mischie reaches toward camera; composite edit creates the scene change; no requirement for multi-person model generation.
- Mommy Tere + Renee: separate reference still generations, combine in post.
- Finish with the verified event end card. Licensed/original Christmas music. Subtitles from actual final spoken audio at a social-safe raised lower-third.
- Exact master is **58 seconds**, with shot timings from the manifest. No single Flow output is the completed film.
