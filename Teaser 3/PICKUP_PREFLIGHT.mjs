/**
 * W252F-VC Teaser 3: static structural production preflight.
 * Run from repo root: node "Teaser 3/PICKUP_PREFLIGHT.mjs"
 * This checks metadata/timing AND that each V4 short prompt matches the manifest. It does NOT access Google Flow,
 * verify consent, inspect images, hear audio or guarantee policy acceptance.
 */
import { readFileSync } from "node:fs";
const path = new URL("./PICKUP_TIMING_MANIFEST.json", import.meta.url);
const plan = JSON.parse(readFileSync(path, "utf8"));
const faults = [];
const all = [...plan.shots, ...plan.montage, plan.endCard].sort(
  (a,b) => a.finalStartSec - b.finalStartSec
);
const fault = message => faults.push(message);
if (plan.generationPreset?.model !== "Omni 1.2 Flash")
 fault("Wrong model: expected Omni 1.2 Flash");
if (plan.generationPreset?.resolution !== "360p")
 fault("Wrong resolution: expected 360p");
if (plan.generationPreset?.sourceGenerationSeconds !== 10)
 fault("Wrong source length: expected 10 seconds");
if (plan.generationPreset?.creditsPerGeneration !== 10)
 fault("Wrong per-generation cost: expected 10 credits");
if (plan.generationPreset?.budgetCreditsPerAccount !== 50)
 fault("Wrong per-account planning budget: expected 50 credits");
if (plan.generationPreset?.maxGenerationsPerAccount !== 5)
 fault("Wrong per-account cap: expected 5 charged generations");
if (plan.generationPreset?.aspectRatio !== "9:16")
 fault("Wrong aspect ratio: expected 9:16");
if (plan.generationPreset?.creditsPerGeneration * plan.generationPreset?.maxGenerationsPerAccount > plan.generationPreset?.budgetCreditsPerAccount)
 fault("Per-account credit budget overrun");
if (plan.durationSeconds !== 58) fault("Expected 58s total duration");
if (all[0].finalStartSec !== 0 || all.at(-1).finalEndSec !== 58) fault("Timeline endpoints wrong");
for (let i = 0; i < all.length; i++) {
 const c = all[i];
 if (!c.id || !(c.finalStartSec < c.finalEndSec)) fault("Invalid time or ID: " + c.id);
 if (i && c.finalStartSec !== all[i-1].finalEndSec) fault("Gap/overlap: " + all[i-1].id + " to " + c.id);
}
if (plan.creativeLock !== "POSITIVITY AND LOVE FIRST") fault("Owner creative lock missing");
const exact = "Merry Christmas sa inyo… miss na miss ko na kayo.";
const opening = plan.shots.find(s => s.id === "P01");
if (!opening || opening.spokenLine !== exact) fault("Monica P01 exact owner words not preserved");
const mInv = plan.shots.find(s => s.id === "P04");
const mReach = plan.shots.find(s => s.id === "P05");
for (const shot of [mInv, mReach]) {
 if (!shot) { fault("Missing Mischie scene P04/P05"); continue; }
 if (!shot.title.includes("Mischie")) fault("Cast name mismatch " + shot.id);
 if (!shot.originalStillFilename.startsWith("w2_mischie_")) fault("Wrong Mischie reference " + shot.id);
}
if (mInv?.speaker !== "Mischie" || mInv?.spokenLine !== "Besh! Sumali na kayo!") fault("P04 speaker/dialogue drift");
if (mReach?.speaker !== null || mReach?.spokenLine !== null) fault("P05 must remain silent");
const missing = [];
for (const shot of plan.shots) {
 if (shot.type !== "NEW_VIDEO_FROM_ORIGINAL_STILL") fault("Found a non-still speaking clip " + shot.id);
 if (shot.sourceGenerationSeconds !== 10) fault("Wrong source duration (must be 10s) " + shot.id);
 if (shot.creditsPerGeneration !== 10) fault("Wrong per-shot credit cost (must be 10 credits) " + shot.id);
 if (shot.originalStillFilename === "UNAVAILABLE" || /confirm/i.test(shot.notes || "")) missing.push(shot.id);
 if (shot.spokenLine !== null) {
   if (!shot.speaker || !shot.spokenLine?.trim()) fault("Speaker or words missing " + shot.id);
   const finalLength = shot.finalEndSec - shot.finalStartSec;
   if (!(shot.speechCompleteBySeconds > 0 && shot.speechCompleteBySeconds <= finalLength - 0.2)) fault("Dialogue may clip in edit " + shot.id);
   if (!(shot.silentTailAtLeastSeconds >= 2 && shot.speechCompleteBySeconds + shot.silentTailAtLeastSeconds <= shot.sourceGenerationSeconds + 0.01)) fault("Missing silent tail " + shot.id);
 } else if (shot.speaker !== null) {
   fault("Silent pickup has speaker " + shot.id);
 }
}
const named = plan.montage.flatMap(s=>s.requiredPeople);
for (const person of ["Leizel","Susie","Margie","Flor","Riza","Anavee","Lilia","Usha","Iad","Willy","Adrian","Donna"]) {
 if (!named.includes(person)) fault("Missing dancer " + person);
}
if (named.includes("Eyad")) fault("Obsolete transcription Eyad");

if (plan.version !== "4.0") fault("Expected V4 manifest");
const prompts = readFileSync(new URL("./FLOW_PICKUP_PROMPTS.md", import.meta.url), "utf8");
if (!prompts.includes("V4")) fault("V4 prompt bank not found");
for (const shot of plan.shots) {
 const start = prompts.indexOf("### " + shot.id + " —");
 if (start === -1) {
   fault("Missing atomic prompt " + shot.id);
   continue;
 }
 const next = prompts.indexOf("\n### ", start + 5);
 const section = prompts.slice(start, next >= 0 ? next : undefined);
 const match = section.match(/```text\n([\s\S]*?)\n```/);
 if (!match) {
   fault("Missing copy-only text block " + shot.id);
   continue;
 }
 const modelPrompt = match[1];
 if (!modelPrompt.includes("using the attached reference photo"))
   fault("Missing photo reference instruction " + shot.id);
 if (/^(PICKUP|REFERENCE|VISIBLE PEOPLE|SPEECH TIMING|NEGATIVES):/m.test(modelPrompt))
   fault("Structured model-facing metadata has returned " + shot.id);
 if (shot.spokenLine !== null && !modelPrompt.includes('"' + shot.spokenLine + '"'))
   fault("Dialogue mismatch " + shot.id);
 if (shot.spokenLine === null && !/does not speak/i.test(modelPrompt))
   fault("Silent pickup lacks silent instruction " + shot.id);
 if (!modelPrompt.includes("No subtitles, no logos, and no on-screen text."))
   fault("Missing clean-footage phrase " + shot.id);
}

if (faults.length) {
 console.error("PRE-FLIGHT FAILED");
 faults.forEach(e => console.error("  ✗ " + e));
 process.exitCode = 1;
} else {
 console.log("V4.1 STATIC TIMING/PRESET/PROMPTS: PASS (58-second edit; Omni 1.2 Flash 360p, 10s, 10 credits; " + all.length + " events).");
 console.log("BUDGET: 5 charged generations per account only if that account has 50 available credits.");
 console.log("SCENE CAST/ASSET READINESS: PENDING — still photos are NOT validated by this script.");
 console.log("Unresolved original photo/identity shots:", missing.join(", ") || "none in manifest; still confirm attachments in Flow");
 console.log("SPEECH & GOOGLE POLICY STATUS: NOT TESTED — listen to actual generated clip and inspect Flow response.");
}
