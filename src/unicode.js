/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
/** Unicode boundary helpers. Visible character ≠ code point ≠ key. */
export const NORMALIZATION_FORMS = ["NFC", "NFD", "NFKC", "NFKD"];

export function normalize(text, form = "NFC") {
  if (!NORMALIZATION_FORMS.includes(form)) throw new Error(`unknown normalization: ${form}`);
  const input = String(text);
  const output = input.normalize(form);
  return {
    form,
    changed: output !== input,
    inputLength: input.length,
    outputLength: output.length,
    text: output
  };
}

export function codePoints(text) {
  return Array.from(text);
}

export function graphemes(text, locale = "und") {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const seg = new Intl.Segmenter(locale, { granularity: "grapheme" });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

export function isCombining(ch) {
  if (!ch) return false;
  const cp = ch.codePointAt(0);
  return /\p{M}/u.test(String.fromCodePoint(cp));
}

export function scriptsIn(text) {
  const found = new Set();
  for (const g of graphemes(text)) {
    const cp = g.codePointAt(0);
    if (cp <= 0x7f) found.add("Latn");
    else if (cp >= 0x0370 && cp <= 0x03ff) found.add("Grek");
    else if (cp >= 0x0400 && cp <= 0x04ff) found.add("Cyrl");
    else if (cp >= 0x0590 && cp <= 0x05ff) found.add("Hebr");
    else if (cp >= 0x0600 && cp <= 0x06ff) found.add("Arab");
    else if (cp >= 0x0900 && cp <= 0x097f) found.add("Deva");
    else if (cp >= 0x0980 && cp <= 0x09ff) found.add("Beng");
    else if (cp >= 0x0a00 && cp <= 0x0a7f) found.add("Guru");
    else if (cp >= 0x0a80 && cp <= 0x0aff) found.add("Gujr");
    else if (cp >= 0x0b80 && cp <= 0x0bff) found.add("Taml");
    else if (cp >= 0x0c00 && cp <= 0x0c7f) found.add("Telu");
    else if (cp >= 0x0c80 && cp <= 0x0cff) found.add("Knda");
    else if (cp >= 0x0d00 && cp <= 0x0d7f) found.add("Mlym");
    else found.add("Zyyy");
  }
  return [...found];
}

export const ADVERSARIAL = {
  combining: "e\u0301",
  zwj: "\u0915\u094d\u0937",
  zwnj: "\u0915\u200c\u094d",
  variation: "\u2764\ufe0f",
  emoji: "👨‍👩‍👧‍👦",
  rtl: "\u05e9\u05dc\u05d5\u05dd",
  mixed: "Aअक"
};
