# Teaser 3 — Mandatory generation preflight (2026-11-13)

## V4 operator note — simple model-facing prompts confirmed useful (2026-11-13)

**Owner observation:** A simplified P02 prompt generated successfully in Google Flow; the previously heavily structured version was flagged. The precise cause of that refusal is unknown. The lesson here is to send Flow a clear concise scene description, **not** to circumvent safety filters. This does NOT guarantee that other prompts will be accepted.

**The Agent does the hard work.** Keep the filename-to-person lookup, consent checks, clip settings, 58-second timeline, dialogue-completion checks, continuity and editor notes here and in `PICKUP_TIMING_MANIFEST.json`.

**The Video Model gets the small prompt.** Copy only the `text` section of one scene in `FLOW_PICKUP_PROMPTS.md` V4 or one silent dancer/cameo in `AVAILABLE_CAST_PROMPT_BANK.md`. Include the scene, actor, one action, exact dialogue, gentle post-dialogue hold and short clean-video line. No internal production labels or multi-scene instructions.

**Source video settings** (such as 8-second draft clip when available) are selected in the Flow UI, NOT injected into the model-facing prompt. Review the generated audible speech and trim later. If the complete sentence doesn't fit in its final slot, preserve words and reallocate timeline from silence or montage; do not cut off the last syllables.

**When a safety restriction actually appears**, stop repeating or rewriting prompts in pursuit of passing the filter. Check that the original media is consented and that you are not editing existing video speech. Use real footage, an approved human-recorded voiceover, or a different permitted workflow if necessary.

**Current known success:** only the owner-reported P02 attempt using the simpler prompting approach. P01 and the remaining V4 pickup rewrites have not been freshly tested by this update.

This checklist applies to EVERY P01–P14 pickup and any later silent dancer/cameo. **No prompt can guarantee Google Flow policy approval or perfect speech.** The purpose is fewer failures, earlier identification of issues, and a dependable editing fallback.

## Gate A: Reference and permissions BEFORE paying any credits
- [ ] Actual **original image file** attached as character ingredient, not the screenshot showing filenames, not a rendered video clip.
- [ ] The individual consented to appearing / having their likeness animated for this community video. For children or high-profile persons, check current Flow eligibility instead of assuming support.
- [ ] Filename matches CAST_REFERENCE_INDEX.md and the identity has been visually verified. `w2_tere.jpeg` is only provisionally Mommy Tere.
- [ ] Never assign `w2_mischie_*` to Mitch without explicit owner confirmation. Mitch and Renee are still missing portraits; Leizel, Anavee, Iad are missing for dancer shots.
- [ ] Model and current settings show Video mode, still-image ingredients or frames (not uploaded-video speech edit), 9:16, single output, source duration 8 seconds where supported; if not, choose duration that fits the full utterance **plus silent tail**. Verify visible credits before generating.

## Gate B: Audio-safe prompt BEFORE generating
- [ ] One primary named speaker only OR an explicitly silent shot.
- [ ] One brief natural spoken sentence, exact Taglish words; begin promptly.
- [ ] **Voice line has enough generated time to finish**: speech deadline is less than both source duration AND final edit slot duration (see manifest), leaving at least ~2 seconds of source silent tail.
- [ ] Dialogue completes at least ~0.2 seconds before the final hard cut; do not force too-fast Tagalog or omit repeated words.
- [ ] Monica P01 must say **"Merry Christmas sa inyo… miss na miss ko na kayo."** including second "na".
- [ ] No second voice, invented dialogue or extra narration. If silent pickup: NO SPEECH/LIP-SYNC.
- [ ] No preexisting **uploaded video** submitted with a prompt to change, extend or dub spoken words. Google Flow states this speech-edit behavior is unsupported. Original-still generation and real human-recorded audio in post are distinct.
- [ ] Blank phone plate only; source photo of family, actual past dance, real poster, game-rules image and final flyer inserted during editing, never invented by Flow.
- [ ] If language struggles, test the single short sentence with a permitted original still; after a genuine policy refusal, DO NOT attempt alternative wording to circumvent the block.

## Gate C: Approve generated clip ONLY if actual output passes
- [ ] Listen to source audio in entirety (including the last 3 words). If line ends prematurely, **FAIL** even if image looks good.
- [ ] The exact intended person speaks, their face is recognisable, mouth motion reasonably matches, and no other voice enters.
- [ ] No unasked words/sounds and no speech during the specified silent tail.
- [ ] Camera stays in one framing; clean 9:16 image, warm positive holiday mood.
- [ ] Mark each shot PASS/FAIL in a shot log with filename/reference, actual clip length, actual audible sentence, model/setting, credits spent and failure classification.
- [ ] Save passing original clips locally. **Generated videos are never the reference-parent for the next pickup.**

## Gate D: On failure, preserve credits and respect policy
- **Truncated line:** preserve the useful portion; if a clean independent shorter original-still pickup is allowed, generate just the missing sentence as P01B (or equivalent). Otherwise get a willing human to record the line and overlay it in post against a silent performance shot.
- **Policy warning:** stop paid retries and record exact error message and whether the input was an original still vs an uploaded/generated video. Never modify prompts for the purpose of evading the refusal. Escalate to real recording/editing and request permission for any likeness/voice.
- **Quota/model failure:** not a creative-prompt failure; verify balance and selected settings, do not repeatedly queue identical variants.
- **Wrong speaker/identity:** isolate source photo to single person, keep the same current photo (if permitted), or use actual portrait footage/post compositing. Do not mislabel someone else.
- **Extra voices or camera cuts:** split into independent pickups; final editing stitches them.
- **Missing member photo:** hold shot, use authentic consented footage if available, never create a substitute face.

## Final edit contract
Edit to [PICKUP_TIMING_MANIFEST.json](PICKUP_TIMING_MANIFEST.json): **58 seconds**, no gaps/overlaps. Single-speaker shots originate from separate 8-second source clips when supported, but are trimmed to their assigned final length. Silence can be trimmed; **speech cannot be cut off**. If actual dialogue is too long, adjust final edit timings (first shorten effects/montage) and revalidate manifest.

Do not shorten unreadable game-rules graphics or omit any required dancer. The party sequence comes from real archival or new consented content, not invented historical footage. Generate final subtitles from the audible final output; avoid obscuring phone screen. Keep the owner creative lock: **POSITIVITY AND LOVE FIRST**.

## Current screenshot readiness
**Filename-known but original photos not mounted in this conversation:** Monica, Jessa, Mommy Tere (person unverified), Susie, Margie, Flor, Riza, Lilia, Usha, Willy, Adrian, Donna. No actual new Flow clips have been tested or verified by this repository update. Missing portrait filenames for Mitch, Renee, Leizel, Anavee, Iad.

## Platform references (current lookup 2026-11-13)
- Google Flow create-video Help: https://support.google.com/flow/answer/16353334 (Video settings, ingredients/frames, references, clip length, best practices)
- Google Flow feature policy / unsupported workflows: https://support.google.com/flow/answer/16353544 (Changing speech in uploaded videos is unsupported)
- Google Flow clip editing Help: https://support.google.com/flow/answer/16935718 (Editors and clips vs new generation; support varies by model/plan)
