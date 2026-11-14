# Google Flow Agent Instruction — MISSION PASKO V5 (2026-11-14)

**Current version.** This instruction is for the **Google Flow agent**, not the short text entered into the video generator.

## Goal and workflow
Make a 90-second, 9:16 Filipino birthday mini-film, **Mission Pasko: The Birthday Housemates**, with comedy, individual birthday reveals, and genuine family messages. Follow the method that worked for W252F-VC **Teaser 3 P02**: a brief, warm, natural-language model-facing prompt with one original approved reference photograph, one person, one action, a natural expression, and a quiet ending.

**Source of truth:** [Full pickup bank](FLOW_PICKUP_PROMPTS.md), [Filming Plan](FILMING_PLAN_V2.md), [Episode Agent Prompt](GOOGLE_FLOW_AGENT_PROMPT_POC.md), [Flow continuity and credits](FLOW_CONTINUITY_CREDITS_V3.md), [P05 refusal diagnostic](FLOW_POLICY_REVIEW_P05.md).

### Preset and budget
- Google Flow **Omni 1.2 Flash** (verify availability in the UI), **360p**, **vertical 9:16**, **10 seconds per source pickup**, **one output**.
- User reports **50 credits per account, roughly 8 accounts**. Record balances separately. At 10 credits/10 seconds where quoted, a full 50-credit balance provides *at most five charged attempts*. Verify live charge and balance before every generation, including extensions. Never pool balances or use account changes to evade restrictions/refusals.
- Start with **one P05A** source clip for the birthday-film proof of concept. P05B optional only after separate approval.

### User-uploaded real-member references
- **Reference portraits are allowed as source ingredients only if the owner/member has permitted their use and the active Flow mode accepts them**. This worked for the user's Teaser 3 P02 reference-photo workflow.
- For **P05A**, use original `ate_joy_dec_4_2.jpg` as the preferred member photograph, with explicit permission. The original photograph is the authority for identity; do not substitute a generated video as an independent identity source.
- Preserve the person's recognizable appearance and dignity. Depict affectionate, positive, ordinary comedy; no fabricated testimonials, harmful events or claims about the person's real life.
- Do not send portraits into other apps or publish private photos without permission.

### Important lessons from Teaser 3 P02
- Keep **one short natural-language paragraph group** for the actual video model: who, warm Christmas setting, **one simple action**, natural reaction, smile/hold.
- No long lists of camera instructions, split-scene sequencing, internal file names, budget details, edit timing or "identity lock" technical statements inside the model-facing prompt.
- Prefer the **same one-person, one-setting format** over elaborate gift physics and multiple visual effects. The successful P02 example asked for a person looking at a phone and smiling.
- No generated subtitles, text, logos or soundtrack. All editable labels, dates, music and voiceovers belong in post.

### Safety/rejection handling (no workaround attempts)
- The user reports a prior P05 prompt was rejected; **the exact filter reason was not supplied**, so no cause is confirmed. The current P05 wording is a **normal simplified scene brief modeled on a previously successful format**, not a guarantee of acceptance or a method to defeat a filter.
- If Google Flow rejects the new request under its safety policy, **stop and record the exact message/model/mode/reference**, including whether credits were charged. Do not keep rephrasing the blocked request, switch accounts to bypass the refusal, or imply approval is guaranteed.
- Fallback: genuine photo in Remotion with animation/cutaways, real consented member footage, or separate non-identifying holiday footage.

### Continuous-scene method
1. For **same person, same location, same action**, finish PxxA, QA the entire clip, pause at a clear stable last frame and choose **Save frame**.
2. To continue PxxB where eligible, use native **Extend** on the accepted clip, or **Frames to Video** with the saved frame as the next shot's start frame. Use the original person portrait as additional identity reference where supported.
3. Keep the same wardrobe, face, camera axis and setting; verify that the first frame of B connects with the last frame of A. Flow does **not** guarantee seamlessness.
4. When switching to another celebrant, begin an **independent pickup with that celebrant's own original photo**; never transfer another person's generated face.
5. P05B is **not required for the P05A proof of concept** and cannot be auto-generated. Continuation is separately charged.

### Audio and compositing
- **Kuya** is a bodiless, original Filipino male narrator created **separately via Gemini TTS**, not a copy of the PBB TV announcer. Don't make Ate Joy speak for the P05A source shot.
- Remotion/FFmpeg handles Gemini voiceover, music/SFX, photo reveals, names, exact birthday dates and final 90-second timing.
- Original PBB music remains a reference only unless the proper music rights are in place. Real family testimony remains genuine recorded audio.

### Operating sequence
1. Agent Instruction (this file).
2. First [Agent Prompt](GOOGLE_FLOW_AGENT_PROMPT_POC.md).
3. One **individual text block** from the [P01–P15 pickup bank](FLOW_PICKUP_PROMPTS.md), starting at **P05A**, with its user-approved original portrait attached.
4. Generate one 360p 9:16 10-second Flow source; review identity, face visibility, natural reaction, hands and gift continuity.
5. Save video and optional stable last frame, record real credit charge and model/settings, ask owner to review before any other paid pickup.
