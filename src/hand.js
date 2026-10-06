/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
import { FINGER_HOME, fingerForColumn } from "./geometry.js";

/** Heuristic reach model. Evidence label: heuristic. Not a clinical measure. */
export const HANDS = {
  small: { scale: 0.85, label: "P25-proxy", evidence: "heuristic" },
  median: { scale: 1, label: "P50-proxy", evidence: "heuristic" },
  large: { scale: 1.2, label: "P75-proxy", evidence: "heuristic" }
};

export function reachClass(distance, hand = "median") {
  const scale = HANDS[hand].scale;
  const d = distance / scale;
  if (d < 1.15) return "comfortable";
  if (d < 2.1) return "reachable";
  if (d < 3.1) return "marginal";
  if (d < 4.2) return "strained";
  return "unreachable";
}

export function keyDistance(key, finger) {
  const home = FINGER_HOME[finger] || FINGER_HOME.LI;
  const dx = key.x - home.x;
  const dy = (key.y - home.y) * 1.15;
  return Math.hypot(dx, dy);
}

export function annotate(geometry, hand = "median") {
  return geometry.keys.map((key) => {
    const finger = key.id === "k-space" ? "RT" : fingerForColumn(key.x);
    const distance = keyDistance(key, finger);
    return { ...key, finger, distance, reachClass: reachClass(distance, hand), evidence: "heuristic" };
  });
}
