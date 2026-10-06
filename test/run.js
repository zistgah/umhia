/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
import assert from "node:assert/strict";
import { graphemes } from "../src/unicode.js";
import { ADVERSARIAL } from "../src/unicode.js";
import { analyzeText } from "../src/analyze.js";
import { ansiGeometry } from "../src/geometry.js";
import { equivalent, stockLayout } from "../src/layouts.js";
import { evaluate } from "../src/evaluate.js";
import { optimize } from "../src/optimize.js";
import { runExperiment } from "../src/pipeline.js";
import { confidencesComparable, confidence } from "../src/hir.js";
import { demoPair } from "../src/fusion.js";
import { createAuth, acquisitionGate } from "../src/auth.js";
import { reachClass } from "../src/hand.js";
import { fixtureRecord } from "../src/corpus.js";

let failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`ok  ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL ${name}`);
    console.error(err);
  }
}

test("grapheme cluster is not a single code point for combining mark", () => {
  const g = graphemes(ADVERSARIAL.combining);
  assert.equal(g.length, 1);
  assert.equal([...ADVERSARIAL.combining].length, 2);
});

test("emoji family is one grapheme", () => {
  assert.equal(graphemes(ADVERSARIAL.emoji).length, 1);
});

test("protected symbol burial is invalid", () => {
  const geometry = ansiGeometry();
  const layout = stockLayout("qwerty", geometry);
  delete layout.layers.shift[Object.keys(layout.layers.shift).find((id) => layout.layers.shift[id] === "{")];
  const analysis = analyzeText("the cat sat on the mat " + "{".repeat(3));
  const ev = evaluate(layout, geometry, analysis);
  assert.equal(ev.valid, false);
  assert.ok(ev.violations.some((v) => v.symbol === "{"));
});

test("same seed reproduces layout hash", () => {
  const a = runExperiment({ language: "english", seed: 3, iterations: 40 });
  const b = runExperiment({ language: "english", seed: 3, iterations: 40 });
  assert.equal(a.layouts.optimized.lineage.layoutId, b.layouts.optimized.lineage.layoutId);
});

test("key order does not change canonical identity", () => {
  const geometry = ansiGeometry();
  const a = stockLayout("qwerty", geometry);
  const b = structuredClone(a);
  b.layers.base = Object.fromEntries(Object.entries(b.layers.base).reverse());
  assert.equal(equivalent(a, b), true);
});

test("confidence kinds are not silently commensurate", () => {
  const key = confidence(1, "heuristic");
  const eeg = confidence(0.72, "calibrated-probability");
  assert.equal(confidencesComparable(key, eeg), false);
});

test("fusion keeps both parents", () => {
  const [group] = demoPair();
  assert.equal(group.composedParents.length, 2);
  assert.equal(group.resolved.intent, "DELETE");
  assert.equal(group.resolved.target, "object-17");
});

test("authorization is revocable and stop wins", () => {
  const auth = createAuth();
  auth.grant({ deviceId: "board-1", sessionId: "s", now: 1000, ms: 50 });
  assert.equal(auth.canMove("board-1", "s", 1020).ok, true);
  auth.revoke("board-1");
  assert.equal(auth.canMove("board-1", "s", 1020).ok, false);
  auth.grant({ deviceId: "board-2", sessionId: "s", now: 1000, ms: 5000 });
  auth.stop("board-2");
  assert.equal(auth.canMove("board-2", "s", 1100).reason, "manual-stop");
});

test("test mode does not require biometric consent", () => {
  assert.equal(acquisitionGate({ testMode: true, live: false }).open, true);
  assert.equal(acquisitionGate({ live: true, consent: false }).open, false);
});

test("hand size changes reach class", () => {
  assert.notEqual(reachClass(2.4, "small"), reachClass(2.4, "large"));
});

test("fixture corpus is original and licensed", () => {
  const row = fixtureRecord("kannada");
  assert.equal(row.license, "CC0-1.0");
  assert.equal(row.redistribution, "allowed");
  assert.ok(row.text.includes("ಕ"));
});

test("optimizer rejects nothing when protected keys stay", () => {
  const geometry = ansiGeometry();
  const layout = stockLayout("qwerty", geometry);
  const analysis = analyzeText(fixtureRecord("english").text);
  const out = optimize({ layout, geometry, analysis, seed: 1, iterations: 20, algorithm: "monte-carlo" });
  assert.equal(out.evaluation.valid, true);
});

if (failed) {
  console.error(`${failed} failed`);
  process.exit(1);
}
console.log("all tests passed");
