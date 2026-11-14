## LATEST WORKFLOW OVERRIDE — 2026-11-14
Use **Teaser 3 P02-style short one-person reference-photo prompts** for an authorized celebrant where the user has consent and the Flow mode accepts this use. The more elaborate P05 attempt was rejected for unknown reasons. Do not assume the reference photo itself is prohibited or that a revised prompt is guaranteed to succeed. If Flow rejects the revised request for policy reasons, stop and use genuine footage or original photo animation in post. See [Agent Instruction V5](GOOGLE_FLOW_AGENT_INSTRUCTION_POC.md) and [Pickup bank V3](FLOW_PICKUP_PROMPTS.md).

# MISSION PASKO — Google Flow Continuity + Credit Workflow V3 (V4 safety override)

**Latest clarification (2026-11-14):** Teaser 3 P02 successfully used an original member photo. The birthday project now uses that concise approved-photo reference style where member consent and Flow's current mode permit it. A more elaborate P05 prompt was refused for unknown reasons; no success guarantee and no persistent attempts to bypass a refusal. See [FLOW_POLICY_REVIEW_P05.md](FLOW_POLICY_REVIEW_P05.md).

**Owner override: 2026-11-14.** Applies to the **November December birthday teaser** project only. The adjacent 58-second Teaser 3 retains its own separate owner-locked settings.

## Locked working preset for this project
- **Model:** Google Flow **Omni Flash 1.2** (verify actual displayed model before charge).
- **Aspect ratio:** **9:16 vertical** throughout Flow pickups and the birthday film final (replaces old 16:9 birthday plan).
- **Resolution:** **360p** for first-pass generation; optional owner-approved upgrade or compositor upscale later, if available.
- **Pickup duration:** **10 seconds per Flow generation** for planned video shots; edit down to final 4–5 seconds where appropriate.
- **Number of outputs:** **one per request**. Never request multiple variations without explicit approval.
- **Cost assumption:** Google's 2026-11 support page states **1 credit per second for 360p Omni Flash 1.2**, hence **10 credits per 10-second shot**; actual displayed UI quote always wins.
- **Per-account balance:** owner reports 50 credits per account and ~8 accounts. Accounts are separate, credits are **not pooled or transferred**. No extra spending, upgrades, account creation or retries without permission. Comply with Google's service terms, account limits and eligibility, and never use account changes to bypass a service restriction. Each credential stays private.
- **Budget capacity, nominal only:** 50 / 10 = 5 standard 10s pickups per eligible, fully funded account, before any retries; ~8 × 5 = ~40 nominal successful/charged 10s jobs *only if each account has its own available legitimate 50 credits*. Do not treat as promised capacity or a target.

Official docs checked 2026-11-14:
- Flow models / Frames to Video: https://support.google.com/flow/answer/16352836
- Flow extending, saving frames and Scenebuilder: https://support.google.com/flow/answer/16935718
- Omni 1.2 Flash credits: https://support.google.com/flow/answer/16526234

## Mandatory continuity routing: choose mode by scene

**A. Same action, same person, same environment, continuous time:** use **CONTINUATION**, not an unrelated text-to-video pickup.

1. Render **PxxA** using a **consented original member photo** for named members where Flow supports it, or an object reference for anonymous shots. Check original-photo identity, face, clothing, props, lighting, framing and a natural ending.
2. Choose an **intentional clean final frame** in the actual clip: same pose/camera/light, no mid-blink, motion blur, mangled hands or face. Pause at that frame and choose **Save frame** in Flow. Name `PxxA_LAST_FRAME.png`; log which source clip and timestamp it came from.
3. **Preferred, only when eligible:** select the PxxA video in Flow and **Extend** with Omni Flash 1.2. Official help indicates **Extend requires Google AI Plus, Pro or Ultra**. Prompt **only what happens next**. Extension itself remains a new charge; confirm duration and cost. When extending a same-person scene, attach the approved original member photo as identity reference where supported; generic scenes need no member photos. Do not interpret **Extend** as a free action.
4. **Free-tier/web fallback:** create **PxxB** in **Frames to Video**, 9:16 360p, using the SAVED FINAL FRAME of PxxA as the **start frame**. For a same-person continuation, attach the original consented person portrait as an additional reference where supported; never use somebody else's image. Prompt only the next action without reintroducing the person/location. **Frames to Video** in both aspect ratios is listed for non-subscribers; verify the account's actual UI.
5. Use saved last frame as **time/action/camera continuity**, not as the person's sole identity authority. Keep the original approved photo for identity where supported.
6. Check first frame of PxxB vs final frame of PxxA for object/prop continuity, lighting, camera direction and background. This birthday Flow workflow uses **no identifiable-member faces**. Trim at a clean edit point or use a hidden match cut in Remotion; seamlessness isn't guaranteed.
7. Save/output both independent original MP4s plus the frame asset and log exactly how they link. Never overwrite the accepted previous video with a retry without owner review.

**B. Different person/group, environment, or time jump:** use **INDEPENDENT NEW PICKUP** with that person's **original authorized photograph** or anonymous/real footage. Do NOT feed the previous actor's last frame into a different member's scene because that can contaminate identity. Link scenes with Remotion transitions and musical/visual motifs instead.

**C. Graphic name reveals / montages / counters:** use **Remotion / optional HyperFrames** with original photographs. Do not burn credits to synthesize unnecessary video footage.

## Example: P05 W2 gift tower — possible continuous P05A→P05B
- **P05A (current proof of concept):** use approved original Ate Joy photo. In one warm Christmas room she holds a stack of gifts; it gently wobbles; she shows a simple surprised reaction, laughs, then smiles steadily. One 10s silent Flow source, 9:16, 360p, using the concise Teaser 3 P02 style.
- **P05B (OPTIONAL; NOT approved to render automatically):** only if a follow-on joke is needed and owner approves spending. Use P05A's **last usable frame** via native Extend (paid eligible account) or Frames to Video start-frame (web/free-tier fallback). Action could be “Ate Joy notices a little ribbon slip and smiles gently in the same room (only if continuation separately approved).” No additional people, set change or speech.
- **In the current 90-second cut**, P05's allocated final screen time remains **00:19–00:24 (5 seconds)**; the second source can provide options or replace shots if explicitly recut. Do **not** automatically increase the 90s runtime.

## Account credits: separate accounting only
A machine-readable ledger lives in [ACCOUNT_CREDIT_LEDGER.csv](ACCOUNT_CREDIT_LEDGER.csv). Record:
- An anonymized account alias **A–H**, initial balance confirmed by user, present balance shown in Flow, model, resolution, aspect ratio, duration, number of outputs, displayed credit price, actual credits charged (including failed charged attempts), saved result ID, pickup ID, and acceptance status.
- **Before each generation:** if actual balance is unknown, not enough for the quoted charge, or the selected model/aspect/pricing differs, **stop** and obtain owner direction. **After generation:** update balance and record the credit charge; never assume charges from estimated pricing.
- No account email address, password, API key, cookie, MFA code or access token is allowed in the ledger or GitHub. Don't share sign-in access across accounts or circumvent eligibility/limits.
- **Do not rotate to sidestep a restriction**, content refusal or account limit; account budgeting is only for permitted credits/accounts.

## Agent / model / post division
- **Agent-level instruction**: identity/consent, continuity routing, credit preflight, file naming, QA, handoff.
- **Single Flow model prompt**: short natural-language “person + same room + next action + emotion + camera”; no meta workflow/cost text.
- **Post**: Gemini TTS **off-screen Kuya**, music/SFX, captions, readable names/dates, countdown, pacing, final export. Separate audio allows changing dialogue without regenerating video.
- **Music**: requested PBB theme is a reference only until licensing; no copyrighted track sampled or automatically added by Flow.

## Filenames and logging convention
`P05A_W2_JOY_360p_9x16_10s.mp4`  
`P05A_LAST_FRAME.png` (chosen stable frame + source timestamp)  
`P05B_W2_JOY_CONTINUE_360p_9x16_10s.mp4` (only after separate approval)

## Quality gates
- Flow real-member shot has member consent, references their genuine original photo, and is verified against it.
- Continuations preserve cast, props, set, direction and framing; no automatic face replacement.
- 9:16 portrait safe-zone crop, 360p draft accepted before optional upscale.
- Source pickup duration 10s, final film exactly 90s; on-screen names/dates readable and complete.
- Off-screen narration via Gemini TTS in Filipino, not actual TV presenter impersonation.
- Real family greetings only; no fabricated loved-one voices/quotes.
- Confirm the user's current Google Flow access and permitted features before running.

## If a project must be continued in a different authorized account
- **Native Extend** acts on the source video in the same accessible Flow project/account; do not assume the original clip or its project will appear in a different login.
- If permitted under Google's terms and both accounts have the feature, **download/export the approved PxxA video and saved last-frame image** (Flow asset More → Download where available). If the frame itself cannot be downloaded, extract a PNG from the locally saved authorized MP4 at the verified clean frame/timestamp using an ordinary offline editor/FFmpeg; avoid taking a blurred final frame.
- In the destination account, start a **new Frames to Video** project. Upload **PxxA_LAST_FRAME.png** as start frame and the **same original member portrait** as an extra reference if the product mode permits. Use the identical short continuation prompt. This yields a **new** clip and may incur credits; it is not native Extend, and continuity is only a target, not guaranteed.
- Move only user-authorized photos/video assets across accounts. Do not share login credentials or change accounts to evade content refusals, subscription eligibility or usage limits. Preserve per-account balance and access rules.
- Keep **PxxA MP4, saved PNG, PxxB MP4 and continuity metadata together in approved storage** so Remotion can join them regardless of which valid Flow project created each.
