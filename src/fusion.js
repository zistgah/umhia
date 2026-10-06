/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
import { candidateFrom, confidence, confidencesComparable, modalityEvent, resolvedAction } from "./hir.js";

/**
 * Deterministic fusion. Confidence kinds are not treated as probabilities
 * unless both are calibrated-probability or a policy map is supplied.
 * Clock uncertainty is retained; it does not invent a shared physiological clock.
 */
export function fuse(events, { windowMs = 400, policy = "late-v1", confidencePolicy = null } = {}) {
  const candidates = events.map((ev) => {
    if (ev.stage === "candidate") return ev;
    return candidateFrom({
      parent: ev,
      intent: ev.intent || "INSERT",
      unit: ev.unit || "symbol",
      content: ev.intent === "INSERT" ? ev.value : null,
      action: ev.intent && ev.intent !== "INSERT" ? ev.value : null,
      target: ev.target || null,
      conf: ev.confidence || confidence(0.5, "heuristic"),
      decoder: "passthrough"
    });
  });
  candidates.sort((a, b) => a.clock.synchronizedTimestamp - b.clock.synchronizedTimestamp || a.clock.sequence - b.clock.sequence);
  const groups = [];
  for (const cand of candidates) {
    const last = groups[groups.length - 1];
    const uncertainty = Math.max(cand.clock.syncUncertaintyMs || 0, last ? last[0].clock.syncUncertaintyMs || 0 : 0);
    if (!last || cand.clock.synchronizedTimestamp - last[0].clock.synchronizedTimestamp > windowMs + uncertainty) groups.push([cand]);
    else last.push(cand);
  }
  return groups.map((group) => {
    const comparable = group.every((g, i) => i === 0 || confidencesComparable(group[0].confidence, g.confidence, confidencePolicy));
    const ranked = [...group].sort((a, b) => b.confidence.value - a.confidence.value);
    const winner = ranked[0];
    const insert = group.find((g) => g.intent === "INSERT");
    const select = group.find((g) => g.intent === "SELECT") || group.find((g) => g.intent === "DELETE");
    const intent = select && insert ? select.intent : winner.intent;
    const action = resolvedAction({
      parents: group,
      intent,
      content: insert?.content || insert?.value || null,
      target: select?.target || select?.action || null,
      action: winner.action,
      unit: insert?.unit || winner.unit,
      policy
    });
    action.alternatives = ranked.slice(1).map((g) => ({ id: g.id, intent: g.intent, value: g.value }));
    action.fusion = {
      policy,
      comparableConfidences: comparable,
      syncUncertaintyMs: Math.max(...group.map((g) => g.clock.syncUncertaintyMs || 0)),
      warning: comparable ? null : "confidences not fused as probabilities; kinds differ"
    };
    action.composition.state = "committed";
    return { composedParents: group.map((g) => g.id), resolved: action };
  });
}

export function demoPair() {
  const speech = modalityEvent({
    modality: "speech",
    adapter: "speech-mock",
    value: "delete this",
    intent: "DELETE",
    unit: "command",
    prov: { simulator: true, testMode: true, physicalSource: null },
    clock: { eventTimestamp: 1000, sourceClock: "speech-mock", syncUncertaintyMs: 40 }
  });
  const gaze = modalityEvent({
    modality: "gaze",
    adapter: "gaze-mock",
    value: "object-17",
    intent: "SELECT",
    unit: "selection",
    prov: { simulator: true, testMode: true },
    clock: { eventTimestamp: 1030, sourceClock: "gaze-mock", clockOffsetMs: 5, syncUncertaintyMs: 15 }
  });
  speech.target = null;
  gaze.target = "object-17";
  return fuse([speech, gaze]);
}
