# Paskong Pinoy Remix — Teaser 3 | Google Flow Episode Agent Prompt V4

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

**Use this as the ONE-TIME story brief in Flow Agent mode, after loading the [Agent Instruction](GOOGLE_FLOW_AGENT_INSTRUCTION.md). It is NOT a single video-generation prompt.** The individual model-facing prompts are in [FLOW_PICKUP_PROMPTS.md](FLOW_PICKUP_PROMPTS.md).

## Copy/paste into Google Flow Agent

You are making an original 58-second vertical 9:16 Filipino Christmas short, **Paskong Pinoy Remix — Teaser 3**, for Filipino overseas workers in Singapore.

**Creative rule:** Start with positivity and love. Monica smiles and sends a loving Christmas greeting to family in the Philippines. She is not angry, crying, or being portrayed negatively. When she discovers a lively gathering, her happiness grows. Jessa welcomes her, Mischie brings her into the festivities, the whole community dances, Monica happily agrees to join, and Mommy Tere and Renee invite the viewers.

**Story and exact words:**
- 00–06 — Monica warmly looks at her phone, greeting loved ones: "Merry Christmas sa inyo… miss na miss ko na kayo."
- 06–11 — Monica sees the genuine festive gathering ad featuring Susie's real archival dancing clip: "Ang saya naman dito…"
- 11–15 — Jessa gently invites: "Gusto mo bang sumali?"
- 15–19 — Mischie arrives with joyful barkada energy: "Besh! Sumali na kayo!"
- 19–21 — Mischie reaches his hand toward the camera for a fun transition. Silent.
- 21–32 — Real dancing/celebration: Leizel, Susie, Margie, Flor, Riza, Anavee, Lilia, Usha, Iad, Willy, Adrian, Donna; real food/raffle/prizes only if actually confirmed.
- 32–35 — Jessa: "Gusto mo ba sumama?"
- 35–38 — Monica: "Of course, siyempre!"
- 38–43 — Jessa silently holds phone; exact real game-rules image added in post, not generated as text.
- 43–47 — Monica: "Walang problema, madali lang 'yan!"
- 47–52 — Mommy Tere: "Tara na sa Paskong Pinoy Remix!"
- 52–55 — Renee joins in a separately composited performance: "See you there!"
- 55–58 — End card with approved real flyer/event details.

**How to produce:** We know from an owner report that one **simple conversational P02 prompt** succeeded in Flow after a heavily structured prompt had been refused. Therefore send one short, human-readable individual shot prompt at a time, copied verbatim from the `text` block for that pickup in [FLOW_PICKUP_PROMPTS.md](FLOW_PICKUP_PROMPTS.md). **Do not embed the detailed planning instructions in the individual video prompt.** Real dancer and optional cameo one-person silent prompts live in [AVAILABLE_CAST_PROMPT_BANK.md](AVAILABLE_CAST_PROMPT_BANK.md).

**Reference-photo map:** Mischie `w2_mischie_one.jpeg` / `w2_mischie_two.jpeg`; Monica `sa_monica.jpeg`; Jessa `n4_jessa.jpeg`; Mommy Tere candidate `w2_tere.jpeg` (confirm identity); Susie `sa_susie.jpeg`; Margie `sa_margie.jpeg`; Flor `sa_flor.jpeg`; Riza `sa_riza.jpeg`; Lilia `sa_lilia.jpeg`; Usha `n4_usha_1.jpeg`; Willy `w2_willy.jpeg`; Adrian `w2_adrian.jpeg`; Donna `n4_donna.jpeg`. Alternative photo filenames are in the cast index.

**On hold (no filename in screenshot):** Renee, Leizel, Anavee, Iad. **Mischie is confirmed** as the P04/P05 character; her filename candidates are `w2_mischie_one.jpeg` and `w2_mischie_two.jpeg`. Actual images still need attaching. A screenshot of filenames is NOT an actual portrait; attach the original approved photo for each member and obtain likeness permission.

**Mischie's P04 voice issue:** Google Flow flagged a prior spoken version. The cause is not confirmed. Use the short V4 spoken prompt only if the model permits this kind of image-to-video generation. If refused, stop generating spoken variants; instead create a permitted SILENT festive visual (see P04 fallback) and add Mischie's consented real recorded line in post.

**Quality and safety:** A new scene generated from original still photos is different from asking Flow to edit the speech of an uploaded video. If Flow refuses a prompt, respect it; use legitimate real footage and a consenting human-recorded voice in editing if necessary. There is no guaranteed passing prompt. Listen to each generated line completely before approving the take. Check facial identity, natural Tagalog/Taglish voice, complete final words, one action, one camera and warm holiday mood.

**Final editor:** Combine independent performances and real member footage. Use original or properly licensed Christmas music, actual advertising and game rules, approved end card, and subtitles derived from audible final speech. Target 58s, hard maximum 60s.

## Production document map

- **Individual model-facing scene prompts**: [FLOW_PICKUP_PROMPTS.md](FLOW_PICKUP_PROMPTS.md) V4
- **Nine dancer and twelve optional cameo prompts**: [AVAILABLE_CAST_PROMPT_BANK.md](AVAILABLE_CAST_PROMPT_BANK.md) V4
- **Cast filenames and readiness**: [CAST_REFERENCE_INDEX.md](CAST_REFERENCE_INDEX.md)
- **58-second edit slots and exact dialogue**: [PICKUP_TIMING_MANIFEST.json](PICKUP_TIMING_MANIFEST.json)
- **Safety, voice and identity validation**: [PICKUP_PREFLIGHT.md](PICKUP_PREFLIGHT.md)

**No render is claimed in this document.** P02 prompt style worked according to the owner; all other V4 prompts are prepared and remain untested until actual Flow generation.
