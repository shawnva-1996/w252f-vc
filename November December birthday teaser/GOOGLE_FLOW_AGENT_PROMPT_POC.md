# Google Flow Agent Prompt — MISSION PASKO P05 V3 (2026-11-14)

**Agent project brief, not a raw model prompt.** Read [GOOGLE_FLOW_AGENT_INSTRUCTION_POC.md](GOOGLE_FLOW_AGENT_INSTRUCTION_POC.md) and [FLOW_CONTINUITY_CREDITS_V3.md](FLOW_CONTINUITY_CREDITS_V3.md) once. The actual Flow VIDEO input receives *only one* short natural-language prompt below.

## Approved planning context, not generation approval
Film *Mission Pasko: The Birthday Housemates*, 90s final, **9:16 vertical**. Test only **P05A**, an approximately 10-second **360p Omni Flash 1.2** Flow source featuring Ate Joy (W2), ultimately trimmed to **5 seconds** at 00:19–00:24. One output, one account charge only; verify cost and ask owner before running. Original identity from [`ate_joy_dec_4_2.jpg`](https://drive.google.com/file/d/1OpcRef1T70YPZQkUKVEwq8i8pPMazcta/view); her secondary original full-body image is [`ate_joy_dec_4_1.jpg`](https://drive.google.com/file/d/1_dNOb91bqaeC-DadZsZqO3tB2_eojcbu/view). **Photograph consent required.**

## P05A — COPY ONLY THIS SHORT BLOCK INTO FLOW VIDEO MODEL
```text
Create a cheerful, cinematic 9:16 vertical Christmas party video using the attached original photograph of Ate Joy as the face reference.

Ate Joy is at a warm Filipino Christmas celebration in Singapore, surrounded by golden fairy lights and colorful red, green and gold wrapped presents. She is already holding a comically tall but harmless tower of gift boxes. The tower starts to wobble, and she catches it with an amused, surprised expression. A small ribbon bow slips off the stack. She laughs with relief.

Use one smooth medium shot with a gentle push-in. Keep Ate Joy's face clearly visible and recognizable, and keep the gifts within the vertical frame. End on a steady, natural smiling moment with the gift stack still visible, suitable to continue into another shot. Only Ate Joy is visible, and she does not speak. No subtitles, logos, music or on-screen text.
```

**Expected source performance:** 0–2s gift stack already visible → 2–5s begins wobbling → 5–7s funny reaction → 7–9s bow slips/laugh → 9–10s stable smiling last frame. **No hard cut, scene change or disappearing person/prop.**

## P05B — OPTIONAL CONTINUATION; DO NOT RUN without separate owner approval

### How to choose the continuation method
- **Eligible paid account:** choose P05A video → **Extend** under Omni Flash 1.2, choose additional 10s at 360p if supported, attach real photo where permitted, check cost.
- **No eligible subscription / no Extend:** choose Flow web **Frames to Video**, set saved **`P05A_LAST_FRAME.png` as START FRAME**, add real original Ate Joy photo as extra reference if supported, choose 9:16, 360p, 10s, one output, check cost.
- A saved video final frame maintains motion/camera continuity; original real photo maintains face identity. This is not a guarantee of identical faces or wardrobes. Review every generated shot.

### Only after attaching the last frame, copy this single short model prompt
```text
Continue the exact same Christmas party moment with the same woman, same outfit, gift stack, camera position and warm lighting shown in the starting image. The gift tower is now balanced. A small wrapped present on top slowly opens, and harmless colorful ribbon curls pop out. She reacts with a delighted smile and laughs quietly. Keep the same person, face, framing, wardrobe and room. One smooth continuous vertical 9:16 shot, no dialogue, logos, subtitles or on-screen text.
```

For native **Extend**, you can omit repeated set-up and describe only the continuation action if Flow gives better continuity. Do not paste the account/budget/workflow instructions into the video model.

## Separate Gemini TTS narrator, outside Flow
**Kuya script — provisional until sound check:**
```text
W2! Ilabas ang mga regalo! Ate Joy… excess baggage na ’yan!
```

Direction: Original, mature Filipino male narrator, naturally conversational Taglish, humorous but kind; smile through the punchline; **do not imitate the actual PBB narrator**. Gemini TTS audio is assembled with the Flow source using Remotion/FFmpeg, not injected into Flow. If speech doesn't fit five seconds, re-time in the edit or ask for a shorter approved line; don't truncate words.

## Result handoff
- Original 10-second P05A MP4 at 9:16 360p, ideally retaining 5s usable comedy.
- For possible continuation: still `P05A_LAST_FRAME.png` and exact source timestamp.
- Actual model, aspect ratio, resolution, generated duration, output count, cost and current-account remaining credits (no private credential details).
- Face-match / framing / hands / gift continuity / safe last frame acceptance notes.
- **No P05B generation or additional shots unless separately approved.**
