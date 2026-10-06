/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
/** Programming languages are input workloads, not implementations. */
export const PROTECTED = Array.from("()[]{}<>:;,.\"'`_+-=*/%&|^~!?@#$\\");

export const PROFILES = {
  c: { operators: ["+", "-", "*", "/", "%", "=", "==", "!=", "&&", "||"], delimiters: ["(", ")", "{", "}", ";", ","] },
  cpp: { operators: ["+", "-", "*", "/", "=", "==", "->", "::", "&&", "||"], delimiters: ["(", ")", "{", "}", "<", ">", ";", ","] },
  rust: { operators: ["+", "-", "*", "/", "=", "==", "->", "=>", "&&", "||"], delimiters: ["(", ")", "{", "}", ";", ","] },
  java: { operators: ["+", "-", "*", "/", "=", "==", "&&", "||"], delimiters: ["(", ")", "{", "}", ";", ","] },
  javascript: { operators: ["+", "-", "*", "/", "=", "==", "===", "=>", "&&", "||"], delimiters: ["(", ")", "{", "}", "[", "]", ";", ",", "."] },
  typescript: { operators: ["+", "-", "=", "=>", "&&", "||"], delimiters: ["(", ")", "{", "}", "<", ">", ":", ";"] },
  python: { operators: ["+", "-", "*", "/", "=", "==", "**"], delimiters: ["(", ")", "[", "]", ":", ",", "."] },
  go: { operators: [":=", "=", "==", "&&", "||"], delimiters: ["(", ")", "{", "}", ";"] },
  bash: { operators: ["|", ">", "<", "&&", "||"], delimiters: ["$", "{", "}", "(", ")", ";"] },
  assembly: { operators: [",", ":", "#"], delimiters: ["[", "]", "(", ")"] },
  sql: { operators: ["=", "<", ">"], delimiters: ["(", ")", ",", ";", "*"] },
  lisp: { operators: ["'", "`"], delimiters: ["(", ")"] },
  prolog: { operators: [":-", ",", ";"], delimiters: ["(", ")", "."] }
};

/** Reference floor. Users may tighten maxReachClass to "reachable". Missing symbols still fail. */
export const ACCESS_FLOOR = {
  maxLayerDepth: 1,
  maxReachClass: "strained",
  maxChordCost: 1
};

const REACH_RANK = { comfortable: 0, reachable: 1, marginal: 2, strained: 3, unreachable: 4 };

export function accessOk(placement, floor = ACCESS_FLOOR) {
  return placement.layerDepth <= floor.maxLayerDepth
    && REACH_RANK[placement.reachClass] <= REACH_RANK[floor.maxReachClass]
    && placement.chordCost <= floor.maxChordCost;
}

/** Identifier-character pattern family. Not a naming-convention enforcer. */
export function identifierPatterns(identifiers) {
  const rows = identifiers.filter(Boolean);
  const n = rows.length || 1;
  let camel = 0, snake = 0, digits = 0, len = 0;
  const grams = new Map();
  for (const id of rows) {
    len += id.length;
    if (/_/.test(id)) snake += 1;
    if (/[a-z][A-Z]/.test(id)) camel += 1;
    if (/\d/.test(id)) digits += 1;
    for (let i = 0; i < id.length - 1; i++) {
      const g = id.slice(i, i + 2);
      grams.set(g, (grams.get(g) || 0) + 1);
    }
  }
  return {
    family: "identifier-character-patterns",
    metrics: {
      meanLength: len / n,
      camelCaseTransitionRate: camel / n,
      snakeCaseRate: snake / n,
      digitRate: digits / n,
      internalBigrams: [...grams.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)
    }
  };
}

export function sampleIdentifiers() {
  return ["readFile", "write_file", "layoutId", "parse2", "handModel", "key_code"];
}
