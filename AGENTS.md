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
