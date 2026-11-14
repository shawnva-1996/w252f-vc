# Google Flow Agent Instruction — MISSION PASKO V3 (2026-11-14)

**Status:** owner-requested workflow revision, production planning / P05 proof of concept. This agent-level document is **NOT** the short text pasted into Flow's video-generation prompt box.

## Mission
Create warm and funny Google Flow source clips for the Filipino W2/N4/Sunday Group 90-second birthday celebration *Mission Pasko: The Birthday Housemates*. Make a **9:16 vertical video**, first generating **P05 — Ate Joy's W2 gift-tower scene**, and only later producing further pickups when the owner approves them. A bodiless, original Filipino male **Kuya** narrator is created **separately in Gemini TTS** and composited in post. No cloned TV voice.

**Single source of truth:** [FLOW_CONTINUITY_CREDITS_V3.md](FLOW_CONTINUITY_CREDITS_V3.md), [FILMING_PLAN_V2.md](FILMING_PLAN_V2.md) (updated with V3 overrides), [POC_P05_W2_GIFTS.md](POC_P05_W2_GIFTS.md), [GOOGLE_FLOW_AGENT_PROMPT_POC.md](GOOGLE_FLOW_AGENT_PROMPT_POC.md), [ACCOUNT_CREDIT_LEDGER.csv](ACCOUNT_CREDIT_LEDGER.csv).

## Always use this video preset
1. **Model:** Omni Flash 1.2, if the account offers it. Verify selected model in Flow UI.
2. **360p draft** video, **9:16 portrait**, **10 seconds source clip**, **ONE output**.
3. User-reported account budget: **50 credits per account**, approximately **8 separate accounts**, **not pooled**. Current published Omni Flash 1.2 360p price is **1 credit per generated second = 10 credits for a 10-second clip**, but the Flow UI quote takes priority.
4. If one account really has 50 eligible credits and each generation really costs 10, plan **at most five charged ten-second outputs on that account**, INCLUDING paid failed or rejected attempts. Don't promise the full ~40 theoretical outputs across ~8 accounts; credits/eligibility may vary, and respecting service terms and any account limits is mandatory.
5. **Before a charged operation:** check actual available balance, account eligibility, model, duration, orientation, resolution, single-output setting, cost; obtain explicit owner approval if different. No paid upsells, automatic retakes, retries or account changes to circumvent limits.
6. Record sanitized account alias (A–H), actual cost and remaining balance in the credit ledger after user reports/agent directly verifies it. **Never store login IDs, passwords, cookies, keys or tokens**.

## Critical continuity rule: real continuation vs a new scene

### Same subject, location, wardrobe, action and continuous time = CONTINUE
1. Film initial pickup **PxxA** from **original real photo** with subject permission and review the actual video.
2. Pick a clean usable final frame (not mid-blink, face distortion, sudden jump or moving crop). **Pause video → Save frame**, use saved still as **first/start frame** for new clip **PxxB**.
3. **If Flow account has eligible Google AI Plus/Pro/Ultra extension:** select the actual clip → **Extend**, choose duration and prompt only what happens next. Native Extend on Omni Flash 1.2 is a separate credited operation, not free. Original cast photos may be attached as references if UI permits. Do not assume feature exists for free accounts.
4. **For free-tier / cross-project work:** use **Frames to Video** on web with the saved last-frame image as **start frame**, 9:16, 360p, 10s, one output, with original member portrait as additional ingredient if supported. Prompt only continuous action; don't reintroduce a different room/costume/person. It is a **new generation with its own credit charge**, not a free extension.
5. Prior generated last frame is **timing/wardrobe/camera continuity**, **NOT the authority for identity**. Always check the generated face against the user's original approved photograph; attach that original where supported. If mode cannot use both, judge identity closely and choose an external edit/match-cut alternative rather than spending endless retries.
6. Perform scene match QA: first frame of B vs last frame of A, face, hair, clothing, props, gift arrangement, camera axis, lighting, time of day, frame crop, hand count, and expression. If it drifts, use an edited cut or original photo — don't silently accept a stranger's face.

### Different celebrant, different group or intentional jump in time = NEW INDEPENDENT PICKUP
- **Never** chain last frames between different people/groups. Begin from the next actual authorized portrait and an independent prompt.
- A shared Christmas set can be described consistently with text or a separate background still, but don't use previous actor's generated portrait as next actor's visual identity.
- Use **Remotion** to transition between N4 cake / W2 gift / Love karaoke / Hope dance.

### Titles and birthday reveals = EDITOR, not Flow
- All ten names/dates, 10/10 counter, confetti, reveal compositions and final collage come from original portraits in Remotion (optional HyperFrames). Avoid spending Flow credits for static graphics.
- Final is **90 seconds at 9:16**, intended for portrait delivery. If placed in a landscape PowerPoint slide, make a deliberate portrait-in-landscape presentation layout (side artwork/pillarboxing) instead of stretching or cropping.

## P05 test-specific setup
- Subject **Ate Joy**, only one real person. Use visually inspected original photo **`ate_joy_dec_4_2.jpg`** from [Drive](https://drive.google.com/file/d/1OpcRef1T70YPZQkUKVEwq8i8pPMazcta/view); optional `ate_joy_dec_4_1.jpg` secondary if supported. Photo 2 is a close-up with a black cap; preserve recognizable face and avoid prompting an invented different identity.
- Christmas gifts wobble affectionately while she catches them and laughs. One smooth **9:16 vertical mid-shot** and camera ease-in, full face visible, hands and gift tower inside vertical safe region.
- **No speaking/lip-sync** from Ate Joy. The male off-screen narrator will be added externally with **Gemini TTS**; do not ask Flow to speak, sing, write captions, add logos or copy copyrighted Pinoy Big Brother soundtrack.
- Generate ONE 10s source pickup P05A. **P05B extension is optional and NOT approved by this test**; save the last clean frame from P05A as a potential future reference after generation.

## Operation sequence
1. Load this agent instruction, then [GOOGLE_FLOW_AGENT_PROMPT_POC.md](GOOGLE_FLOW_AGENT_PROMPT_POC.md) as project context.
2. Read scene preflight; confirm owner consent, source photo, app actual preset/credits, and status.
3. For initial P05A generation, paste **only the short P05A VIDEO MODEL PROMPT** into Flow's video model input. Don't paste the lengthy agent instructions, technical workflow or metadata to the video model.
4. Generate one, inspect for identity/comedy/continuity, save MP4, log exact actual cost. Save last clean frame if usable.
5. Report status, source settings, approval issues, selected clip filename and last-frame filename; return video for owner review. No more charged generation without permission.
6. After owner review, video and Gemini TTS are mixed in Remotion/FFmpeg. Do not make the full film automatically.

## Copyright and person permissions
- Consent is required for animating recognizable W2/N4 members or using family footage.
- Real family speech, when collected, must remain real; no fabricated messages.
- User's desire to use original PBB theme is logged pending rights clearance. An independently licensed/original Christmas game-show-style track is the prototype fallback, **not a replica of the original song**.
- Respect refusals and platform restrictions; do not reword solely to evade them.

## Success criteria
One user-approved P05A 10s 9:16, 360p video source suitable for a ~5s final birthday scene. A stable last frame is saved *for possible approved P05B continuation*, and account credits are accounted for with no unauthorized extra charge.

## Cross-project or cross-account continuation (only where legitimately permitted)
Native **Extend** requires access to the source video in the same account/project and eligible paid subscription. Where only a new Frames to Video operation is available, export/download the approved source video and saved clean last-frame PNG, then upload the PNG as the **start frame** in the destination project. If needed, derive the PNG from the locally saved authorized MP4 at the QA-approved timestamp. Include the original source portrait as an additional ingredient where available, never as a generated-video substitute. This is a **new separately charged generation** and must meet the destination account's actual permitted credits/terms; do not change accounts to bypass refusals or limits.
