# Paskong Pinoy Remix — Teaser 3 | Google Flow Generation Budget

**Owner-locked operating preset (2026-11-13): Omni 1.2 Flash · 360p · 10s source clip · 10 credits per generation · 9:16 · one output.**

## Per-account generation budget

For an account with **50 available credits** at the owner-reported 10-credit cost:

| Charged generation slot | Credit cost | Cumulative charge | Remaining of 50 |
|---|---:|---:|---:|
| 1 | 10 | 10 | 40 |
| 2 | 10 | 20 | 30 |
| 3 | 10 | 30 | 20 |
| 4 | 10 | 40 | 10 |
| 5 | 10 | 50 | 0 |

**Five is a maximum, not a guaranteed allowance:** check the real available account balance and actual cost in Google Flow before each generation. If the account starts with fewer than 50 credits, the number of affordable generations is lower. Count any generation that actually consumes credits, including an unsuccessful charged retry. Stop when the available credit balance is insufficient, the account's five slots have been charged, or Flow refuses a prompt. Never assume credits pool, transfer, or can be redeemed from other accounts. Follow platform rules for account usage.

## Checklist before each generation

- [ ] In Flow UI choose **Omni 1.2 Flash**.
- [ ] Select **360p**.
- [ ] Select **10 seconds**.
- [ ] Select **9:16**, only **one** video.
- [ ] Confirm Flow displays **10 credits** for the intended operation; if not, stop rather than change model/resolution without the owner's approval.
- [ ] Confirm this account has enough credits and fewer than five charged attempts already counted for this 50-credit budget.
- [ ] Attach the original approved photo of the correct person and paste ONLY that scene's concise model prompt from [FLOW_PICKUP_PROMPTS.md](FLOW_PICKUP_PROMPTS.md) or [AVAILABLE_CAST_PROMPT_BANK.md](AVAILABLE_CAST_PROMPT_BANK.md).
- [ ] After submission, record actual credits spent, scene ID and resulting file in the ledger.
- [ ] After receiving the source clip, review dialogue, identity and framing before approving for the final edit.

## Generation record — copy a blank row for each actual attempt

| Account alias (not email) | Slot 1–5 | Pickup ID | Actual cost | Status | Saved output | Notes |
|---|---|---|---:|---|---|---|
| *Unassigned* | *—* | *—* | *—* | *No generations recorded here yet* | *—* | *Do not claim credits spent without checking account* |

## Production boundary

**10 seconds is the source video duration, not the final scene length.** All generated 10-second clips are trimmed to the [58-second final edit timetable](PICKUP_TIMING_MANIFEST.json). Each account's budget must be considered independently. Use real event footage for dance montages where available; this saves paid Flow attempts and preserves genuine member performances.

**Config source of truth:** `PICKUP_TIMING_MANIFEST.json` → `generationPreset`. Validator: `node "Teaser 3/PICKUP_PREFLIGHT.mjs"`.
