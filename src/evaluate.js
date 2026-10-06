/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
import { annotate } from "./hand.js";
import { accessOk, PROTECTED } from "./workload.js";

const REACH_RANK = { comfortable: 0, reachable: 1, marginal: 2, strained: 3, unreachable: 4 };

export function indexLayout(layout, geometry, hand = "median") {
  const keys = annotate(geometry, hand);
  const byId = Object.fromEntries(keys.map((k) => [k.id, k]));
  const locate = new Map();
  for (const [layer, map] of Object.entries(layout.layers)) {
    const depth = layer === "base" ? 0 : 1;
    for (const [id, symbol] of Object.entries(map)) {
      if (!locate.has(symbol)) {
        const key = byId[id];
        if (!key) continue;
        locate.set(symbol, {
          keyId: id,
          layer,
          layerDepth: depth,
          chordCost: depth,
          reachClass: key.reachClass,
          distance: key.distance,
          finger: key.finger,
          x: key.x,
          y: key.y
        });
      }
    }
  }
  return { keys, byId, locate };
}

export function evaluate(layout, geometry, analysis, hand = "median") {
  const idx = indexLayout(layout, geometry, hand);
  const items = analysis.inventory.filter((i) => i.class === "LINGUISTIC").slice(0, 40);
  let travel = 0, missing = 0, modifier = 0, mass = 0;
  const fingerLoad = {};
  const handLoad = { L: 0, R: 0 };
  for (const item of items) {
    const place = idx.locate.get(item.unit);
    const w = item.weightedFrequency || item.frequency;
    mass += w;
    if (!place) {
      missing += w;
      continue;
    }
    travel += place.distance * w;
    modifier += place.layerDepth * w;
    fingerLoad[place.finger] = (fingerLoad[place.finger] || 0) + w;
    handLoad[place.finger.startsWith("L") ? "L" : "R"] += w;
  }
  let sameFinger = 0;
  for (const bg of analysis.bigrams || []) {
    const a = idx.locate.get(bg.a);
    const b = idx.locate.get(bg.b);
    if (a && b && a.finger === b.finger) sameFinger += bg.frequency;
  }
  const violations = [];
  for (const sym of PROTECTED) {
    const place = idx.locate.get(sym);
    if (!place) {
      violations.push({ symbol: sym, reason: "missing" });
      continue;
    }
    if (!accessOk(place)) violations.push({ symbol: sym, reason: "below-floor", place });
  }
  const denom = mass || 1;
  const imbalance = Math.abs(handLoad.L - handLoad.R) / denom;
  const vector = {
    linguisticTravel: travel / denom,
    programmingAccess: violations.length,
    mathematicalAccess: 0,
    physicalTravel: travel / denom,
    jointMovement: null,
    fingerLoadSpread: spread(fingerLoad),
    handImbalance: imbalance,
    wristDeviation: null,
    modifierCost: modifier / denom,
    layerCost: modifier / denom,
    error: null,
    fatigue: null,
    populationRobustness: null,
    manufacturability: 0,
    keyboardSize: geometry.keys.length,
    coverage: 1 - missing / denom,
    deadKeyCost: 0,
    sequenceCost: sameFinger / denom,
    modalitySwitchCost: 0,
    reconfigurationCost: 0,
    learningCost: null
  };
  return {
    hand,
    evidence: "heuristic",
    valid: violations.length === 0,
    violations,
    vector,
    fingerLoad,
    handLoad,
    note: "Under the heuristic reach model, these are predicted costs, not medical outcomes."
  };
}

function spread(load) {
  const vals = Object.values(load);
  if (!vals.length) return 0;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  return vals.reduce((a, b) => a + Math.abs(b - mean), 0) / vals.length;
}

export function scalar(vector, weights) {
  if (!weights) return null;
  let s = 0;
  for (const [k, w] of Object.entries(weights)) s += (vector[k] || 0) * w;
  return s;
}

export function compare(candidate, baselines) {
  return baselines.map((row) => {
    const deltas = {};
    for (const key of Object.keys(candidate.vector)) {
      const a = candidate.vector[key];
      const b = row.evaluation.vector[key];
      if (typeof a === "number" && typeof b === "number") {
        deltas[key] = { baseline: b, candidate: a, absolute: a - b, relative: b === 0 ? null : (a - b) / Math.abs(b) };
      }
    }
    return { name: row.name, valid: row.evaluation.valid, deltas };
  });
}
