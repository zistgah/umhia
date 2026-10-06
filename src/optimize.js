/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
import { mulberry32 } from "./rng.js";
import { evaluate } from "./evaluate.js";
import { layoutDocument, layoutHash } from "./layouts.js";
import { PROTECTED } from "./workload.js";

function cost(ev) {
  if (!ev.valid) return Number.POSITIVE_INFINITY;
  const v = ev.vector;
  return v.linguisticTravel + 0.35 * v.sequenceCost + 0.25 * v.modifierCost + 0.15 * v.handImbalance + (1 - v.coverage) * 5;
}

function letterKeyIds(layout) {
  const ids = Object.keys(layout.layers.base);
  return ids.filter((id) => {
    const sym = layout.layers.base[id];
    return sym && !PROTECTED.includes(sym) && sym !== " " && !/^[0-9]$/.test(sym);
  });
}

function swap(layers, a, b) {
  const next = { base: { ...layers.base }, shift: { ...layers.shift } };
  const tmp = next.base[a];
  next.base[a] = next.base[b];
  next.base[b] = tmp;
  return next;
}

export function optimize({ layout, geometry, analysis, seed = 1, iterations = 400, algorithm = "annealing", temperature = 1, cooling = 0.995, experimentId = null }) {
  const rand = mulberry32(seed);
  let currentLayers = { base: { ...layout.layers.base }, shift: { ...layout.layers.shift } };
  let current = layoutDocument({
    name: layout.name,
    geometryId: geometry.id,
    layers: currentLayers,
    generator: algorithm,
    seed,
    parentLayoutId: layout.lineage?.layoutId || null,
    experimentId
  });
  let currentEv = evaluate(current, geometry, analysis);
  let currentCost = cost(currentEv);
  let best = current;
  let bestEv = currentEv;
  let bestCost = currentCost;
  const keys = letterKeyIds(current);
  let temp = temperature;
  const trace = [];
  for (let i = 0; i < iterations; i++) {
    if (keys.length < 2) break;
    const a = keys[Math.floor(rand() * keys.length)];
    const b = keys[Math.floor(rand() * keys.length)];
    if (a === b) continue;
    const layers = swap(current.layers, a, b);
    const cand = layoutDocument({
      name: `${algorithm}-candidate`,
      geometryId: geometry.id,
      layers,
      generator: algorithm,
      seed,
      parentLayoutId: layout.lineage?.layoutId || null,
      experimentId
    });
    const ev = evaluate(cand, geometry, analysis);
    const c = cost(ev);
    let accept = c < currentCost;
    if (!accept && algorithm === "annealing" && Number.isFinite(c)) {
      accept = rand() < Math.exp((currentCost - c) / Math.max(temp, 1e-6));
    }
    if (algorithm === "monte-carlo") accept = c <= currentCost || rand() < 0.02;
    if (accept && ev.valid) {
      current = cand;
      currentEv = ev;
      currentCost = c;
    }
    if (ev.valid && c < bestCost) {
      best = cand;
      bestEv = ev;
      bestCost = c;
    }
    temp *= cooling;
    if (i % 50 === 0) trace.push({ i, bestCost, temp });
  }
  best = layoutDocument({
    name: `${layout.name}-${algorithm}`,
    geometryId: geometry.id,
    layers: best.layers,
    generator: algorithm,
    seed,
    parentLayoutId: layout.lineage?.layoutId || layoutHash(layout),
    experimentId
  });
  bestEv = evaluate(best, geometry, analysis);
  return { layout: best, evaluation: bestEv, cost: cost(bestEv), seed, algorithm, iterations, trace, reproducibleHash: layoutHash(best) };
}

export function population(layout, geometry, analysis) {
  return ["small", "median", "large"].map((hand) => ({ hand, evaluation: evaluate(layout, geometry, analysis, hand) }));
}
