# Proof of Concept — P05 W2 Christmas Gift Tower

**Status:** preflight / ready for user-approval.  
**Purpose:** validate **one source shot** with real December celebrant identity, natural physical comedy, 16:9 Flow cinematography and separate **Gemini TTS** narrator in a draft 5-second composition.

### Source photo
- Cast: **Ate Joy (W2), Dec 4**, from provided birthday PDF.
- **Preferred original identity file (visually inspected):** [ate_joy_dec_4_2.jpg](https://drive.google.com/file/d/1OpcRef1T70YPZQkUKVEwq8i8pPMazcta/view). This is a closer, clearer face photo; the person wears a black baseball cap.
- **Secondary, full-body/hairstyle reference (visually inspected):** [ate_joy_dec_4_1.jpg](https://drive.google.com/file/d/1_dNOb91bqaeC-DadZsZqO3tB2_eojcbu/view). This photo has a distant face, a date stamp and distracting signage; don't use those background graphics.
- Start with **one** preferred original image to minimize complexity; add the second only if Flow accepts multiple ingredient images and it materially improves identity/body continuity.
- Google Drive: https://drive.google.com/drive/folders/1TOi8K_7LHbyw4rhBp-8chj791yDhtdYU
- Confirm photo depicts Ate Joy and that she consents to this fictional, comedic motion portrayal.

### Final visual / precise performance target
- **Final slot:** 00:19–00:24 in the 90-second film (5 seconds).
- **Generated source:** 10 seconds, clean silent footage, intended to be trimmed in the editor.
- **Aspect ratio:** horizontal 16:9; 360p draft is proposed, not an inflexible constraint if unsupported in Flow's live controls.
- **Cast:** one real member only: Ate Joy.
- **Setting:** cheerfully decorated Singapore Filipino church Christmas party; warm glowing parols, gold fairy lights, red/green wrapped gifts and festive bokeh. No fake logos/people.
- **Camera:** start medium-wide, soft gradual push-in, face always visible and unobstructed.
- **Action timeline in 10-second source:** 0–2s Ate Joy already balancing a tall pile of gift boxes; 2–5s gift tower sways in a ridiculous but harmless way; 5–7s she freezes and raises eyebrows; 7–9s laughs as one small bow pops off; 9–10s holds smile. **No crashing, injury, fall or angry humiliation.**
- **Silent performance:** she does not speak or move her lips as if addressing the camera. No audio from Flow required for final.
- **No generated subtitles, title cards, names or dates.** Added later with Remotion.

### Separate Gemini TTS line (provisional until approval and timing test)
> “W2! Ilabas ang mga regalo! Ate Joy… excess baggage na ’yan!”

**Delivery:** adult male Filipino / conversational Taglish, a comic deadpan with a small beat after “Ate Joy”, natural smiling energy, not voice cloning or actual PBB narrator imitation. Name and pun pronounced clearly. If this takes more than the usable 5s final shot, shorten before rendering or carry first words over previous P04 transition.

### Sound design for 5s composite
- Original festive bouncy instrumental under narration (licensed/independently composed).
- Two soft wobble percussion/boing hits when the gift tower tilts, one bright chime as bow flies.
- Auto-duck music under Kuya's line.
- Avoid actual PBB soundtrack for prototype until rights cleared.

### How user runs the shot in Google Flow
1. Open [Google Flow](https://labs.google/flow/about/) in browser; add a new birthday video project.
2. Choose **video / image reference (Frames to Video or supported Ingredients)**; attach the **original Ate Joy** portrait above from Drive (with consent).
3. Set **16:9 landscape**, **Omni Flash 1.2** if offered, **360p draft**, **10 seconds**, **one output**. Confirm exact current credits and balance in the UI before generating; do not substitute 9:16 from Teaser 3.
4. Put the full [POC agent instruction](GOOGLE_FLOW_AGENT_INSTRUCTION_POC.md) in the agent instruction space and [episode prompt](GOOGLE_FLOW_AGENT_PROMPT_POC.md) in agent prompt space. The **video-generator text box** receives **ONLY** the single concise pickup prompt within [GOOGLE_FLOW_AGENT_PROMPT_POC.md](GOOGLE_FLOW_AGENT_PROMPT_POC.md), not the long instruction files.
5. Generate **one** candidate. Do not spend retries automatically; review face match, natural smile, composition, hand count, safe gifts and whether at least 5s are usable.
6. Download MP4. Place it in the existing Drive folder (prefer a dedicated `POC` subfolder if the owner chooses to create one) or attach here.
7. When usable clip received, render the final 5-second visual with Gemini TTS + an original music/SFX bed in Remotion; review for projector readability.

### Scorecard to approve/correct
| Category | Must pass |
|---|---|
| Identity | Original face clearly resembles Ate Joy |
| Framing | Correct 16:9, face visible, no hands/boxes hiding face |
| Comedy | Obvious, positive gift-tower wobble and natural reaction |
| Continuity | Warm Christmas setting, clothing not shifting mid-shot |
| Timing | 5 seconds worth of usable action inside 10-second output |
| Safety/permission | Consented depiction, no physical harm or humiliating action |
| Audio plan | Separate Gemini TTS and post audio, not baked into generated video |
| Credits | Model, resolution and actual charge verified in user account |

**No completed Flow render or synthesized voice is implied by this document.**
