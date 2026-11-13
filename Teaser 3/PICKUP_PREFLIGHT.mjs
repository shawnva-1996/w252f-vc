/**
 * W252F-VC Teaser 3: static structural production preflight.
 * Run from repo root: node "Teaser 3/PICKUP_PREFLIGHT.mjs"
 * This checks metadata/timing ONLY. It does NOT access Google Flow,
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
const missing = [];
for (const shot of plan.shots) {
 if (shot.type !== "NEW_VIDEO_FROM_ORIGINAL_STILL") fault("Found a non-still speaking clip " + shot.id);
 if (!Number.isFinite(shot.sourceGenerationSeconds) || shot.sourceGenerationSeconds < 5) fault("Bad source duration " + shot.id);
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
if (faults.length) {
 console.error("PRE-FLIGHT FAILED");
 faults.forEach(e => console.error("  ✗ " + e));
 process.exitCode = 1;
} else {
 console.log("STATIC TIMING AND TEXT: PASS (58 seconds, " + all.length + " events).");
 console.log("SCENE CAST/ASSET READINESS: PENDING — still photos are NOT validated by this script.");
 console.log("Unresolved original photo/identity shots:", missing.join(", ") || "none in manifest; still confirm attachments in Flow");
 console.log("SPEECH & GOOGLE POLICY STATUS: NOT TESTED — listen to actual generated clip and inspect Flow response.");
}
