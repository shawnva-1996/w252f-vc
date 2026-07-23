// Port of Scripts/app.py's parsing/formatting logic — pure functions, no DOM.
(function () {

const LABELS = [
  "verse", "chorus", "pre-chorus", "pre chorus", "bridge",
  "intro", "outro", "tag", "ending", "end",
  "v1", "v2", "v3", "c1", "c2", "b1", "b2",
];

const PAUSE_WORDS = new Set([
  "and", "but", "or", "so", "cause", "because", "for",
  "with", "to", "in", "on", "at", "by", "from", "of",
  "as", "when", "where", "while", "that", "which", "who", "just",
]);

function parseBlocksForLabels(text) {
  const lines = text.split("\n");
  const blocks = [];
  let currentSlide = [];

  for (const line of lines) {
    const stripped = line.trim();

    if (!stripped) {
      if (currentSlide.length) {
        blocks.push(currentSlide.join("\n"));
        currentSlide = [];
      }
      continue;
    }

    const lowerLine = stripped.toLowerCase();
    let isLabel = false;

    for (const label of LABELS) {
      if (lowerLine.startsWith(label)) {
        const remaining = lowerLine.slice(label.length).trim();
        if (remaining === "" || /^\d+$/.test(remaining)) {
          isLabel = true;
          const newLabel = `[${stripped.toUpperCase()}]`;

          if (currentSlide.length) {
            blocks.push(currentSlide.join("\n"));
            currentSlide = [];
          }

          blocks.push(newLabel);
          break;
        }
      }
    }

    if (!isLabel) {
      if (stripped.startsWith("[") && stripped.endsWith("]")) {
        if (currentSlide.length) {
          blocks.push(currentSlide.join("\n"));
          currentSlide = [];
        }
        blocks.push(stripped.toUpperCase());
      } else {
        currentSlide.push(stripped);
      }
    }
  }

  if (currentSlide.length) {
    blocks.push(currentSlide.join("\n"));
  }

  return blocks;
}

function splitLongLine(line, maxLength = 35) {
  if (line.length <= maxLength) return line;

  const middle = Math.floor(line.length / 2);
  let bestSpace = -1;
  let bestScore = -Infinity;

  for (let i = 0; i < line.length; i++) {
    if (line[i] !== " ") continue;

    const distance = Math.abs(i - middle);
    let score = -(distance * 2);

    if (i > 0 && ",.;:?!".includes(line[i - 1])) {
      score += 50;
    }

    const rest = line.slice(i + 1).toLowerCase();
    const nextWordRaw = rest.includes(" ") ? rest.slice(0, rest.indexOf(" ")) : rest;
    const nextWord = nextWordRaw.replace(/[^a-z]/g, "");

    if (PAUSE_WORDS.has(nextWord)) {
      score += 20;
    }

    if (score > bestScore) {
      bestScore = score;
      bestSpace = i;
    }
  }

  if (bestSpace === -1) return line;

  return line.slice(0, bestSpace) + "\n" + line.slice(bestSpace + 1);
}

function isHeaderBlock(block) {
  return block.startsWith("[") && block.endsWith("]") && !block.includes("\n");
}

function applyFormatting(blocks, isPptx = false) {
  const formatted = [];

  for (let block of blocks) {
    const header = isHeaderBlock(block);
    block = block.toUpperCase();

    if (header) {
      formatted.push(block);
    } else if (isPptx) {
      const slideLines = block.split("\n").filter((l) => l.trim());
      const newSlideLines = slideLines.map((l) => splitLongLine(l));
      if (newSlideLines.length) {
        formatted.push(newSlideLines.join("\n"));
      }
    } else {
      const lines = block.split("\n").filter((l) => l.trim());
      for (const line of lines) {
        formatted.push(splitLongLine(line));
      }
    }
  }

  return formatted;
}

function formatFreeshowText(blocks) {
  const output = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    output.push(block);

    if (i < blocks.length - 1) {
      if (isHeaderBlock(block)) {
        output.push("\n");
      } else {
        output.push("\n\n");
      }
    }
  }

  return output.join("");
}

function convertLyricsText(text) {
  const blocks = applyFormatting(parseBlocksForLabels(text), false);
  return formatFreeshowText(blocks);
}

window.FreeshowParser = {
  parseBlocksForLabels,
  splitLongLine,
  applyFormatting,
  formatFreeshowText,
  convertLyricsText,
};

})();
