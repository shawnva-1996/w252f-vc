# Google Flow Agent Prompt — Mission Pasko P05 (DRAFT V1)

**Use after reviewing [FILMING_PLAN_V2.md](FILMING_PLAN_V2.md) and [GOOGLE_FLOW_AGENT_INSTRUCTION_POC.md](GOOGLE_FLOW_AGENT_INSTRUCTION_POC.md).**

## Agent episode brief (not for the raw generation text box)
Film: *Mission Pasko: The Birthday Housemates*. One pre-approved 10-second source video for five-second final slot P05 00:19–00:24. It features **Ate Joy**, one December celebrant, in a warm, fun Christmas gift-delivery mission. The narrator “Kuya” is **offscreen and generated separately using Gemini TTS**. Retain her genuine identity from the single attached approved photo; no speaking or on-screen typography. The agent should check 16:9, model, 360p draft, 10 seconds, one output and credits in Flow settings. Do not generate other shots or audio automatically.

**Identity reference:** `ate_joy_dec_4_1.jpg` from owner Drive. [View original file](https://drive.google.com/file/d/1_dNOb91bqaeC-DadZsZqO3tB2_eojcbu/view); owner may select `ate_joy_dec_4_2.jpg` instead.

## Copy ONLY the paragraph below into the VIDEO generator

```text
Create a cheerful cinematic Christmas party video in horizontal 16:9 using the attached original photograph of Ate Joy as the person reference.

Ate Joy is at a warmly lit Filipino Christmas gathering in Singapore, surrounded by glowing fairy lights and beautiful colorful wrapped Christmas gifts. She is already holding a ridiculously tall but harmless stack of wrapped gift boxes. The pile starts to wobble gently. Her eyes widen with a funny, delighted expression, and she tries to balance it. One small ribbon bow floats off the stack and she laughs naturally with relief. Keep her face visible and recognizable throughout.

Film this as one smooth medium-wide shot with a gentle camera push-in, warm festive lighting and natural human expressions. Only Ate Joy is visible. She does not speak. No subtitles, logos or on-screen text.
```

## Separate Gemini TTS narration (NOT part of the Flow video prompt)

**Provisional script:**
```text
W2! Ilabas ang mga regalo! Ate Joy… excess baggage na ’yan!
```

Suggested Gemini TTS direction:
```text
Speak in natural Filipino/Taglish, like a warm mature Filipino man announcing a funny Christmas game mission. Start playfully authoritative, then pause briefly after “Ate Joy” and deliver “excess baggage na ’yan!” with smiling deadpan humour. Keep it short and natural. Do not imitate any actual celebrity or television host.
```

Suggested current product: **Gemini 3.8 Flash TTS** (`gemini-3.8-flash-tts`) through Google AI Studio or the Gemini API; it currently has a documented free tier subject to actual account availability. Try **Gacrux** (mature) and **Charon** (informative) as initial voices; audition natural Tagalog pronunciation before choosing. Use only a Gemini TTS key privately in approved secrets configuration; **do not post the key into GitHub or chat**.

Current docs:
- https://ai.google.dev/gemini-api/docs/speech-generation
- https://ai.google.dev/gemini-api/docs/pricing

## Editing preview (5s)
- 0–1s: already wobbling gift tower; narrator starts “W2!”
- 1–3s: wobble, Ate Joy amused surprise; narrator “Ilabas ang mga regalo!”
- 3–5s: ribbon bow flies, laughing reaction; narrator says punchline with speech spanning adjacent cut if needed.
- SFX: cartoony festive wobble + sparkling bow chime.
- Voiceover, any names/date overlays and cleared music placed in post-production.
- If the separate narration exceeds this final slot, redistribute it across the previous pickup transition or shorten **after owner approval** instead of cutting off speech.

## What to return to the owner
- One 10-second MP4 original Flow output.
- Actual selected model, aspect ratio, resolution, output duration, credits spent.
- A short note saying whether image identity, gifts, visible face, emotional expression and usable 5s pass.
- Do not promise a finished 90-second render from this one pickup.
