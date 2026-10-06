/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
/**
 * Human Input Representation 2.0.1
 * Stages: modality → candidate → composed → resolved.
 * intent is a semantic category. content is inserted material.
 * target is what is acted on. action is an opaque command name.
 * Confidence is not probability unless kind says calibrated-probability.
 */
export const INTENTS = ["INSERT", "DELETE", "NAVIGATE", "SELECT", "CONFIRM", "CANCEL", "CORRECT", "COMPOSE", "COMMAND"];
export const CONFIDENCE_KINDS = [
  "calibrated-probability",
  "model-confidence",
  "heuristic",
  "likelihood",
  "normalized-score"
];

let seq = 1;
export function nextId(prefix) {
  seq += 1;
  return `${prefix}-${seq.toString(16)}`;
}

export function clockStamp(partial = {}) {
  const eventTimestamp = partial.eventTimestamp ?? Date.now();
  return {
    eventTimestamp,
    sourceClock: partial.sourceClock ?? "adapter",
    synchronizedTimestamp: partial.synchronizedTimestamp ?? eventTimestamp + (partial.clockOffsetMs ?? 0),
    clockOffsetMs: partial.clockOffsetMs ?? 0,
    syncUncertaintyMs: partial.syncUncertaintyMs ?? 0,
    sequence: partial.sequence ?? seq
  };
}

export function provenance(partial = {}) {
  return {
    physicalSource: partial.physicalSource ?? null,
    acquisitionDevice: partial.acquisitionDevice ?? null,
    adapter: partial.adapter ?? "unknown",
    decoder: partial.decoder ?? null,
    simulator: partial.simulator ?? false,
    fusionEngine: partial.fusionEngine ?? null,
    testMode: partial.testMode ?? false
  };
}

export function confidence(value, kind = "heuristic") {
  if (!CONFIDENCE_KINDS.includes(kind)) throw new Error(`unknown confidence kind: ${kind}`);
  const n = Number(value);
  if (!(n >= 0 && n <= 1)) throw new Error("confidence value must be in [0,1]");
  return { value: n, kind, comparable: kind === "calibrated-probability" };
}

/** Two confidences may be fused as probabilities only if both are calibrated, or a policy maps them. */
export function confidencesComparable(a, b, policyMap = null) {
  if (a.kind === b.kind && a.kind === "calibrated-probability") return true;
  if (policyMap && policyMap[a.kind] && policyMap[b.kind]) return true;
  return false;
}

export function modalityEvent({ modality, adapter, value, intent = null, unit = "none", clock, prov, raw = null }) {
  return {
    hir: "2.0.1",
    stage: "modality",
    id: nextId("mod"),
    clock: clockStamp(clock),
    source: { modality, adapter, decoder: null },
    provenance: provenance({ ...prov, adapter }),
    confidence: confidence(1, "heuristic"),
    intent,
    unit,
    content: null,
    target: null,
    action: null,
    value,
    alternatives: [],
    modifiers: [],
    evidence: [],
    composition: { parents: [], policy: null, state: "open" }
  };
}

export function candidateFrom({ parent, intent, unit, content = null, target = null, action = null, conf, decoder }) {
  return {
    hir: "2.0.1",
    stage: "candidate",
    id: nextId("cand"),
    clock: parent.clock,
    source: { modality: parent.source.modality, adapter: parent.source.adapter, decoder },
    provenance: { ...parent.provenance, decoder },
    confidence: conf,
    intent,
    unit,
    content,
    target,
    action,
    value: content ?? action ?? target ?? "",
    alternatives: [],
    modifiers: parent.modifiers || [],
    evidence: [parent.id],
    composition: { parents: [parent.id], policy: null, state: "open" }
  };
}

export function resolvedAction({ parents, intent, content = null, target = null, action = null, unit = "none", policy }) {
  return {
    hir: "2.0.1",
    stage: "resolved",
    id: nextId("act"),
    clock: clockStamp(),
    source: { modality: "fusion", adapter: "fusion", decoder: null },
    provenance: provenance({ adapter: "fusion", fusionEngine: policy }),
    confidence: confidence(1, "heuristic"),
    intent,
    unit,
    content,
    target,
    action,
    value: content ?? action ?? "",
    alternatives: [],
    modifiers: [],
    evidence: parents.map((p) => p.id),
    composition: { parents: parents.map((p) => p.id), policy, state: "committed" }
  };
}
