// Reads .pptx / .docx (both are zip archives of XML) directly in the browser
// via JSZip + DOMParser, then feeds slide/paragraph text through the same
// parseBlocksForLabels logic used for .txt input.
(function () {

const { parseBlocksForLabels } = window.FreeshowParser;

function textOfEl(el, tag) {
  let out = "";
  const nodes = el.getElementsByTagName(tag);
  for (const n of nodes) out += n.textContent;
  return out;
}

async function extractFromPptx(arrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const parser = new DOMParser();

  const presentationXml = await zip.file("ppt/presentation.xml").async("string");
  const presentationDoc = parser.parseFromString(presentationXml, "application/xml");
  const relsFile = zip.file("ppt/_rels/presentation.xml.rels");
  const relsXml = relsFile ? await relsFile.async("string") : "";
  const relsDoc = relsXml ? parser.parseFromString(relsXml, "application/xml") : null;

  const idToTarget = {};
  if (relsDoc) {
    for (const rel of relsDoc.getElementsByTagName("Relationship")) {
      idToTarget[rel.getAttribute("Id")] = rel.getAttribute("Target");
    }
  }

  const slideRefs = [];
  const sldIdList = presentationDoc.getElementsByTagName("p:sldIdLst")[0];
  if (sldIdList) {
    for (const sld of sldIdList.getElementsByTagName("p:sld")) {
      const rId = sld.getAttribute("r:id");
      const target = idToTarget[rId];
      if (target) slideRefs.push(`ppt/${target.replace(/^\.?\//, "")}`);
    }
  }

  // Fallback: no presentation.xml/rels info — sort slide files numerically.
  if (!slideRefs.length) {
    const names = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n));
    names.sort((a, b) => {
      const na = parseInt(a.match(/(\d+)/)[1], 10);
      const nb = parseInt(b.match(/(\d+)/)[1], 10);
      return na - nb;
    });
    slideRefs.push(...names);
  }

  const outputBlocks = [];

  for (const path of slideRefs) {
    const file = zip.file(path);
    if (!file) continue;
    const xml = await file.async("string");
    const slideDoc = parser.parseFromString(xml, "application/xml");

    const slideLines = [];
    for (const shape of slideDoc.getElementsByTagName("p:sp")) {
      const txBodies = shape.getElementsByTagName("p:txBody");
      if (!txBodies.length) continue;

      const paragraphs = txBodies[0].getElementsByTagName("a:p");
      const paraTexts = [];
      for (const p of paragraphs) {
        paraTexts.push(textOfEl(p, "a:t"));
      }
      const text = paraTexts.join("\n").trim();
      if (text) slideLines.push(text);
    }

    if (slideLines.length) {
      const textBlock = slideLines.join("\n");
      outputBlocks.push(...parseBlocksForLabels(textBlock));
    }
  }

  return outputBlocks;
}

async function extractFromDocx(arrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const parser = new DOMParser();

  const docXml = await zip.file("word/document.xml").async("string");
  const doc = parser.parseFromString(docXml, "application/xml");

  const outputBlocks = [];
  let currentBlock = [];

  for (const para of doc.getElementsByTagName("w:p")) {
    const text = textOfEl(para, "w:t").trim();
    if (text) {
      currentBlock.push(text);
    } else if (currentBlock.length) {
      outputBlocks.push(...parseBlocksForLabels(currentBlock.join("\n")));
      currentBlock = [];
    }
  }

  if (currentBlock.length) {
    outputBlocks.push(...parseBlocksForLabels(currentBlock.join("\n")));
  }

  return outputBlocks;
}

window.FreeshowExtract = { extractFromPptx, extractFromDocx };

})();
