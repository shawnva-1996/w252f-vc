(function () {

const { convertLyricsText } = window.FreeshowParser;
const { extractFromPptx, extractFromDocx } = window.FreeshowExtract;

/* ---------------- Tabs ---------------- */
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.toggle("is-active", t === tab);
      t.setAttribute("aria-selected", t === tab ? "true" : "false");
    });
    panels.forEach((p) => {
      p.hidden = p.dataset.panel !== tab.dataset.tab;
    });
  });
});

/* ---------------- Paste tab ---------------- */
const pasteInput = document.getElementById("pasteInput");
const pasteOutput = document.getElementById("pasteOutput");
const pasteOutputWrap = document.getElementById("pasteOutputWrap");
const pasteDownload = document.getElementById("pasteDownload");

let pasteResult = "";

function runPasteConversion() {
  const text = pasteInput.value;
  if (!text.trim()) {
    pasteOutputWrap.hidden = true;
    pasteDownload.disabled = true;
    pasteResult = "";
    return;
  }
  try {
    pasteResult = convertLyricsText(text);
    pasteOutput.textContent = pasteResult;
    pasteOutputWrap.hidden = false;
    pasteDownload.disabled = false;
  } catch (err) {
    pasteOutput.textContent = `Error converting text: ${err.message}`;
    pasteOutputWrap.hidden = false;
    pasteDownload.disabled = true;
  }
}

let pasteDebounce;
pasteInput.addEventListener("input", () => {
  clearTimeout(pasteDebounce);
  pasteDebounce = setTimeout(runPasteConversion, 150);
});

pasteDownload.addEventListener("click", () => {
  downloadText("pasted_lyrics_freeshow.txt", pasteResult);
});

/* ---------------- Upload tab ---------------- */
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileResults = document.getElementById("fileResults");

dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

["dragenter", "dragover"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add("is-dragover");
  })
);
["dragleave", "drop"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove("is-dragover");
  })
);
dropzone.addEventListener("drop", (e) => {
  handleFiles(e.dataTransfer.files);
});
fileInput.addEventListener("change", (e) => {
  handleFiles(e.target.files);
  fileInput.value = "";
});

async function handleFiles(fileList) {
  for (const file of Array.from(fileList)) {
    await handleOneFile(file);
  }
}

async function handleOneFile(file) {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (![".pptx", ".docx", ".txt"].includes(ext)) return;

  const card = renderFileCard(file.name);

  try {
    let blocks;
    const isPptx = ext === ".pptx";

    if (ext === ".pptx") {
      blocks = await extractFromPptx(await file.arrayBuffer());
    } else if (ext === ".docx") {
      blocks = await extractFromDocx(await file.arrayBuffer());
    } else {
      const text = await file.text();
      blocks = window.FreeshowParser.parseBlocksForLabels(text);
    }

    const formatted = window.FreeshowParser.applyFormatting(blocks, isPptx);
    const result = window.FreeshowParser.formatFreeshowText(formatted);
    const outName = file.name.replace(/\.[^.]+$/, "") + "_freeshow.txt";

    fillFileCard(card, outName, result);
  } catch (err) {
    fillFileCardError(card, err.message);
  }
}

function renderFileCard(name) {
  const card = document.createElement("div");
  card.className = "file-card";
  card.innerHTML = `
    <div class="file-card__head">
      <span class="file-card__name">${escapeHtml(name)}</span>
      <span class="file-card__status">converting&hellip;</span>
    </div>
  `;
  fileResults.prepend(card);
  return card;
}

function fillFileCard(card, outName, result) {
  card.querySelector(".file-card__status").remove();
  const head = card.querySelector(".file-card__head");

  const btn = document.createElement("button");
  btn.className = "btn btn--small";
  btn.textContent = `Download ${outName}`;
  btn.addEventListener("click", () => downloadText(outName, result));
  head.appendChild(btn);

  const details = document.createElement("details");
  details.className = "file-card__preview";
  details.innerHTML = `<summary>Preview extracted text</summary><pre class="output__text"></pre>`;
  details.querySelector("pre").textContent = result || "(no lyric text found)";
  card.appendChild(details);
}

function fillFileCardError(card, message) {
  const status = card.querySelector(".file-card__status");
  status.textContent = `error: ${message}`;
  status.classList.add("file-card__status--error");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function downloadText(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ---------------- Hero live demo ---------------- */
const DEMO_SOURCE = `Verse 1
Amazing grace how sweet the sound that saved a wretch like me
I once was lost but now am found was blind but now I see

Chorus
My chains are gone I've been set free
My God my Savior ransomed me`;

const demoBefore = document.getElementById("demoBefore");
const demoAfter = document.getElementById("demoAfter");
const demoResult = convertLyricsText(DEMO_SOURCE);

function typewriterLoop() {
  let i = 0;
  demoBefore.textContent = "";
  demoAfter.textContent = "";

  const typeIn = setInterval(() => {
    i++;
    demoBefore.textContent = DEMO_SOURCE.slice(0, i);
    if (i >= DEMO_SOURCE.length) {
      clearInterval(typeIn);
      setTimeout(revealOut, 350);
    }
  }, 14);

  function revealOut() {
    let j = 0;
    const typeOut = setInterval(() => {
      j++;
      demoAfter.textContent = demoResult.slice(0, j);
      if (j >= demoResult.length) {
        clearInterval(typeOut);
        setTimeout(typewriterLoop, 3200);
      }
    }, 10);
  }
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  typewriterLoop();
} else {
  demoBefore.textContent = DEMO_SOURCE;
  demoAfter.textContent = demoResult;
}

})();
