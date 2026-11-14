# P05A Proof of Concept — Ate Joy Christmas Gift Mission (Teaser 3-style V5)

**Current production choice: 2026-11-14.** The user clarified that the **Teaser 3 P02 Monica reference-photo workflow succeeded in Google Flow**, so the birthday project should use that same short natural-language prompt shape with approved member photos. A prior, longer P05A prompt was refused for reasons not yet confirmed; this simpler version has **not** been tested. **Do not attempt to bypass any further safety refusal.**

## Source / reference
- Cast: **Ate Joy**, W2 birthday Dec 4.
- Preferred permitted original photo: [`ate_joy_dec_4_2.jpg`](https://drive.google.com/file/d/1OpcRef1T70YPZQkUKVEwq8i8pPMazcta/view); optional [`ate_joy_dec_4_1.jpg`](https://drive.google.com/file/d/1_dNOb91bqaeC-DadZsZqO3tB2_eojcbu/view).
- Confirm member consent to the photo/video transformation and correct source image before generation. The original photo remains the identity authority.

## Flow preset and final edit
- User-selected **Omni Flash 1.2 / 360p / 9:16 vertical / 10s source / one output**. Confirm these settings and live cost before generating. Owner-reported 50 credits/account and ~8 accounts, balances separate; respect Google limits.
- Final birthday film **90 seconds portrait**; P05 occupies 00:19–00:24 (~5 seconds edited from the source).
- **Kuya** narration is bodiless and separately synthesized using Gemini Filipino TTS. Ate Joy's Flow clip is silent/non-speaking. Remotion adds labels, music, SFX and any needed edits.

## Copy only this pickup into the Flow video model
```text
Create a warm Christmas-themed vertical 9:16 video of Ate Joy using the attached reference photo.

Ate Joy is at a cheerful Christmas gathering with warm golden lights and colorful wrapped presents. She is holding a stack of Christmas gifts. The gifts wobble gently, and she reacts with a funny surprised expression before smiling and laughing naturally.

After that, she holds the gifts and keeps a happy smile for the rest of the clip.

Keep it as a single continuous shot, with only Ate Joy visible. She does not speak. No subtitles, no logos, and no on-screen text.
```

**Why simplified:** same pattern as the owner-verified successful **Teaser 3 P02** — one reference portrait, one setting, one simple action, one expression, hold. Avoid unnecessarily complex object physics, multiple visible changes and technical identity-lock wording. This is for clear filming, **not a guarantee of safety approval**.

## QA and handoff
- Face correctly corresponds to Ate Joy, age/general appearance and hands/props remain reasonable, positive body language, background consistent, ~5 usable seconds in a 10-second source.
- Save the whole MP4 as `P05A_W2_JOY_360p_9x16_10s.mp4`.
- If accepted, optionally select a stable last frame and **Save frame** as `P05A_LAST_FRAME.png` for **separately approved** continuation P05B (Frames to Video start frame or native Extend where eligible).
- If Flow refuses another request based on the same real-person image, **stop** this generation route, record exact error, use genuine photo animation or real authorized footage in Remotion; don't repeatedly reword or move accounts to bypass safety restrictions.
- Voiceover suggestion (Gemini TTS, separate): **“W2! Ilabas ang mga regalo! Ate Joy… excess baggage na ’yan!”** May need timing adjustment because final slot is 5s.
- Music is independent/licensed; original PBB soundtrack needs proper rights.

## Related source-of-truth
[Full filming plan](FILMING_PLAN_V2.md) · [Agent Instruction](GOOGLE_FLOW_AGENT_INSTRUCTION_POC.md) · [Agent Prompt](GOOGLE_FLOW_AGENT_PROMPT_POC.md) · [Pickup bank P01–P15](FLOW_PICKUP_PROMPTS.md) · [Historic policy refusal](FLOW_POLICY_REVIEW_P05.md).
