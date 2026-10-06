/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
import { annotate } from "./hand.js";

export function layoutSvg(layout, geometry, hand = "median") {
  const keys = annotate(geometry, hand);
  const width = 720;
  const height = 280;
  const u = 42;
  const rects = keys.map((key) => {
    const label = (layout.layers.base && layout.layers.base[key.id]) || key.legendHint || "";
    const x = 16 + key.x * u;
    const y = 16 + key.y * u;
    const fill = key.reachClass === "comfortable" ? "#e7f5ee" : key.reachClass === "reachable" ? "#f4f1e8" : "#f8e8e4";
    return `<g><rect x="${x}" y="${y}" width="${key.width * u - 4}" height="${u - 6}" rx="5" fill="${fill}" stroke="#243126"/><text x="${x + 8}" y="${y + 24}" font-size="14" font-family="sans-serif">${escapeXml(label)}</text></g>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${rects}</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
}

export function experimentRecord({ seed, language, script, corpus, optimizer, layout, evaluation }) {
  return {
    schema: "umhia.experiment",
    schemaVersion: "1.0.0",
    experimentId: layout.lineage.experimentId,
    seed,
    language,
    script,
    corpus: corpus.map((c) => ({ url: c.url, license: c.license, title: c.title, redistribution: c.redistribution })),
    optimizer,
    layoutLineage: layout.lineage,
    objectiveVector: evaluation.vector,
    valid: evaluation.valid,
    evidence: evaluation.evidence,
    software: "0.2.1",
    timestamp: new Date().toISOString()
  };
}
