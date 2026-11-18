# Working rules for AI assistants

## Gemini API: check every model, never get stuck on one (owner rule, 17 Nov 2026)

Applies to **every AI assistant or agent working in this repo** (Claude, Codex, Gemini, Cursor or any other model) and to any
code here that calls the Gemini API.

- Free-tier Gemini quotas are **per API key and per model**. `gemini-2.5-flash` allows only **20 requests per key per day**,
  so a job that only uses one model stalls for a whole day when it runs out.
- **Before a batch job,** list the models the keys can use (`GET https://generativelanguage.googleapis.com/v1beta/models`) and
  test each with a tiny request. Don't assume a model name exists or still has quota; Google adds and retires models often.
- **Spread work across models and fall back automatically.** When a key returns HTTP 429 with a *per-day* `quotaId`, mark that
  key + model as exhausted and move to the next model (for example `gemini-3-flash-preview` → `gemini-2.5-flash` →
  `gemini-3.1-flash-lite` → `gemini-2.5-flash-lite`). Never keep retrying a per-day 429; it won't clear until the next day.
- In code, take model names from a list or config with fallback, not from a single hard-coded constant.
- Never turn on billing or use paid keys to get past a quota without the owner's OK. Never print, log or commit key values.
- Reference implementation: `shawnva-1996/shawnlemuel.ai` → `pipeline/ep03_scroll_movie/tools/gemini_pool.py` (`models` command +
  automatic model fallback).
- **`limit: 0` means never, not "later" (18 Nov 2026).** A 429 whose message says `limit: 0` is a model the free tier does not
  allow at all, so it will not clear tomorrow. On the owner's free-tier keys that is every **image** model (`gemini-3-pro-image`,
  `nano-banana-pro-preview`, `gemini-nano-banana-2.1`, `gemini-3.1-flash-image`, `gemini-2.5-flash-image` and their previews)
  and `gemini-4-argon` / `gemini-4-carbon`. Skip such a model at once instead of rotating keys on it. Image generation needs a
  billed key: ask the owner first.
- **Test the whole list, not only Flash, and rank strongest first.** On 18 Nov 2026 `gemini-4-hydrogen` answered on 4 of 6 keys
  and `gemini-3-flash-preview` on 6 of 6, while `gemini-3.5`–`3.8-flash` and `gemini-flash-latest` returned 503 or timed out.
  Use the strongest model that answers today (4.x > 3.x pro > flash > lite), never lite first.
- **Every call gets a timeout (60–150 s).** A call that runs longer has probably stalled: abandon it and rotate to the next key
  or model instead of waiting.
- **Check what a model claims.** Gemini said it was "100% confident" a praise song was CityAlight's "What a Friend"; a web
  search showed it was Elevation Worship's "Been So Good". Confirm identifications (songs, people, quotes, facts) with a second
  source before using them.
