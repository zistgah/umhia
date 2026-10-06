/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
import { canonicalJson, fnv1a } from "./hash.js";
import { ansiGeometry, keyByHint } from "./geometry.js";

const QWERTY = "qwertyuiopasdfghjkl;zxcvbnm,./";
const DVORAK = "',.pyfgcrlaoeuidhtns;qjkxbmwvz";
const COLEMAK = "qwfpgjluy;arstdhneiozxcvbkm,./";

function assignment(order, geometry) {
  const layers = { base: {}, shift: {} };
  for (let i = 0; i < QWERTY.length; i++) {
    const key = keyByHint(geometry, QWERTY[i]);
    if (!key) continue;
    layers.base[key.id] = order[i];
    const upper = order[i].length === 1 ? order[i].toUpperCase() : order[i];
    layers.shift[key.id] = upper === order[i] ? order[i] : upper;
  }
  const symbols = {
    "`": "`", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5",
    "6": "6", "7": "7", "8": "8", "9": "9", "0": "0", "-": "-", "=": "=",
    "[": "[", "]": "]", "\\": "\\", "'": "'"
  };
  const shifted = {
    "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%",
    "6": "^", "7": "&", "8": "*", "9": "(", "0": ")", "-": "_", "=": "+",
    "[": "{", "]": "}", "\\": "|", "'": "\"",
    ",": "<", ".": ">", "/": "?", ";": ":"
  };
  for (const [hint, sym] of Object.entries(symbols)) {
    const key = keyByHint(geometry, hint);
    if (!key) continue;
    layers.base[key.id] = sym;
    layers.shift[key.id] = shifted[hint];
  }
  for (const hint of [",", ".", "/", ";"]) {
    const key = keyByHint(geometry, hint);
    if (!key) continue;
    layers.base[key.id] = hint;
    layers.shift[key.id] = shifted[hint];
  }
  return layers;
}

export function stockLayout(name, geometry = ansiGeometry()) {
  const orders = { qwerty: QWERTY, dvorak: DVORAK, colemak: COLEMAK };
  const order = orders[name];
  if (!order) throw new Error(`unknown layout: ${name}`);
  return layoutDocument({
    name,
    geometryId: geometry.id,
    layers: assignment(order, geometry),
    generator: "baseline",
    seed: 0,
    parentLayoutId: null
  });
}

export function layoutDocument({ name, geometryId, layers, generator, seed, parentLayoutId, experimentId }) {
  const doc = {
    schema: "umhia.layout",
    schemaVersion: "1.0.0",
    name,
    geometry: geometryId,
    layers,
    protectedSymbols: Array.from("()[]{}<>:;,.\"'`_+-=*/%&|^~!?@#$\\"),
    lineage: {}
  };
  doc.lineage = lineageFor(doc, { generator, seed, parentLayoutId, experimentId });
  return doc;
}

export function canonicalLayout(layout) {
  const layers = {};
  for (const name of Object.keys(layout.layers).sort()) {
    layers[name] = {};
    for (const key of Object.keys(layout.layers[name]).sort()) {
      layers[name][key] = layout.layers[name][key];
    }
  }
  return {
    schema: layout.schema,
    schemaVersion: layout.schemaVersion,
    geometry: layout.geometry,
    layers
  };
}

export function layoutHash(layout) {
  return fnv1a(canonicalJson(canonicalLayout(layout)));
}

export function equivalent(a, b) {
  return layoutHash(a) === layoutHash(b);
}

export function lineageFor(layout, meta) {
  const id = layoutHash(layout);
  return {
    layoutId: id,
    layoutVersion: 1,
    experimentId: meta.experimentId || null,
    parentLayoutId: meta.parentLayoutId || null,
    generator: meta.generator || "manual",
    seed: meta.seed ?? null
  };
}

export function placeInventory(geometry, inventory, reservedHints = QWERTY) {
  const layers = { base: {}, shift: {} };
  const letterKeys = reservedHints.split("").map((h) => keyByHint(geometry, h)).filter(Boolean);
  const linguistic = inventory.filter((i) => i.class === "LINGUISTIC").slice(0, letterKeys.length);
  linguistic.forEach((item, i) => {
    layers.base[letterKeys[i].id] = item.unit;
  });
  const symbols = stockLayout("qwerty", geometry).layers;
  for (const [key, sym] of Object.entries(symbols.shift)) {
    if ("!@#$%^&*()_+{}|:\"<>?".includes(sym) || "{}[]\\|".includes(sym)) layers.shift[key] = sym;
  }
  for (const hint of ["[", "]", "\\", "-", "=", "'"]) {
    const key = keyByHint(geometry, hint);
    if (!key) continue;
    layers.base[key.id] = symbols.base[key.id];
    layers.shift[key.id] = symbols.shift[key.id];
  }
  return layers;
}
