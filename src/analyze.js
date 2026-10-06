/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
import { graphemes, normalize, scriptsIn } from "./unicode.js";

const CLASSES = ["LINGUISTIC", "PROGRAMMING", "MATHEMATICAL", "PUNCTUATION", "STRUCTURAL", "CONTROL", "DIGIT", "CURRENCY", "SCIENTIFIC", "TYPOGRAPHIC", "PLATFORM", "OTHER"];

export function classifyUnit(unit) {
  if (/[0-9]/.test(unit) && unit.length === 1) return "DIGIT";
  if ("()[]{}<>:;,.'\"`_+-=*/%&|^~!?@#$\\".includes(unit)) return "PROGRAMMING";
  if (/[\u2200-\u22ff\u2190-\u21ff]/.test(unit)) return "MATHEMATICAL";
  if (/[\p{P}\p{S}]/u.test(unit) && unit.length === 1) return "PUNCTUATION";
  return "LINGUISTIC";
}

export function analyzeText(raw, options = {}) {
  const form = options.normalization || "NFC";
  const norm = normalize(raw, form);
  const units = graphemes(norm.text, options.locale || "und");
  const counts = new Map();
  const bigrams = new Map();
  const contexts = new Map();
  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    if (/\s/u.test(u)) continue;
    counts.set(u, (counts.get(u) || 0) + 1);
    const left = i > 0 ? units[i - 1] : null;
    const right = i + 1 < units.length ? units[i + 1] : null;
    if (!contexts.has(u)) contexts.set(u, { left: {}, right: {} });
    const ctx = contexts.get(u);
    if (left && !/\s/u.test(left)) ctx.left[left] = (ctx.left[left] || 0) + 1;
    if (right && !/\s/u.test(right)) ctx.right[right] = (ctx.right[right] || 0) + 1;
    if (right && !/\s/u.test(right)) {
      const bg = u + "\t" + right;
      bigrams.set(bg, (bigrams.get(bg) || 0) + 1);
    }
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  let cumulative = 0;
  const inventory = ranked.map(([unit, frequency], index) => {
    cumulative += frequency;
    const ctx = contexts.get(unit);
    return {
      unit,
      type: "grapheme",
      unicode: [...unit].map((ch) => "U+" + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")),
      frequency,
      weightedFrequency: frequency * (options.weight || 1),
      frequencyPerMillion: (frequency / total) * 1e6,
      relative: frequency / total,
      cumulative: cumulative / total,
      rank: index + 1,
      contexts: {
        left: topEntries(ctx.left),
        right: topEntries(ctx.right)
      },
      script: scriptsIn(unit)[0] || options.script || null,
      language: options.language || null,
      combining: /\p{M}/u.test(unit),
      required: index < (options.requiredRank || 40),
      class: classifyUnit(unit)
    };
  });
  const bigramList = [...bigrams.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, options.ngramLimit || 30)
    .map(([key, frequency]) => {
      const [a, b] = key.split("\t");
      return { a, b, frequency, relative: frequency / total };
    });
  return {
    normalization: { form, changed: norm.changed, inputLength: norm.inputLength, outputLength: norm.outputLength },
    scripts: scriptsIn(norm.text),
    total,
    classes: CLASSES,
    inventory,
    bigrams: bigramList,
    rawFrequency: Object.fromEntries(ranked),
    weightedFrequency: Object.fromEntries(ranked.map(([u, n]) => [u, n * (options.weight || 1)]))
  };
}

function topEntries(obj, n = 3) {
  return Object.entries(obj || {}).sort((a, b) => b[1] - a[1]).slice(0, n).map(([unit, n]) => ({ unit, n }));
}

export function mergeAnalyses(parts, mode = "source-balanced") {
  const acc = new Map();
  const weights = parts.map((p) => {
    if (mode === "uniform") return 1;
    if (mode === "source-balanced") return 1;
    if (mode === "document-balanced") return 1 / Math.max(1, p.total);
    return p.weight || 1;
  });
  parts.forEach((part, i) => {
    const w = weights[i];
    for (const item of part.inventory) {
      const prev = acc.get(item.unit) || { ...item, frequency: 0, weightedFrequency: 0 };
      prev.frequency += item.frequency;
      prev.weightedFrequency += item.frequency * w;
      acc.set(item.unit, prev);
    }
  });
  const inventory = [...acc.values()].sort((a, b) => b.weightedFrequency - a.weightedFrequency);
  inventory.forEach((item, i) => { item.rank = i + 1; });
  return { mode, inventory, sources: parts.length };
}
