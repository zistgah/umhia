/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
import { VERSION } from "./version.js";
import { fixtureRecord } from "./corpus.js";
import { analyzeText } from "./analyze.js";
import { ansiGeometry } from "./geometry.js";
import { placeInventory, stockLayout } from "./layouts.js";
import { evaluate, compare } from "./evaluate.js";
import { optimize, population } from "./optimize.js";
import { experimentRecord, layoutSvg } from "./export.js";
import { identifierPatterns, sampleIdentifiers } from "./workload.js";

export function runExperiment({ language = "english", seed = 7, iterations = 250, algorithm = "annealing" } = {}) {
  const corpus = fixtureRecord(language);
  const analysis = analyzeText(corpus.text, { language: corpus.language, script: corpus.script, normalization: "NFC" });
  const geometry = ansiGeometry();
  const qwerty = stockLayout("qwerty", geometry);
  const dvorak = stockLayout("dvorak", geometry);
  const colemak = stockLayout("colemak", geometry);
  const seeded = {
    ...qwerty,
    name: `${language}-seeded`,
    layers: placeInventory(geometry, analysis.inventory)
  };
  seeded.lineage = { ...qwerty.lineage, parentLayoutId: qwerty.lineage.layoutId, generator: "frequency-seed" };
  const experimentId = `exp-${language}-${seed}`;
  const optimized = optimize({ layout: seeded, geometry, analysis, seed, iterations, algorithm, experimentId });
  const baselines = [qwerty, dvorak, colemak].map((layout) => ({
    name: layout.name,
    evaluation: evaluate(layout, geometry, analysis)
  }));
  const candidateEval = optimized.evaluation;
  return {
    software: VERSION,
    corpus,
    analysis,
    geometry,
    layouts: { qwerty, dvorak, colemak, seeded, optimized: optimized.layout },
    evaluation: candidateEval,
    baselines,
    comparison: compare(candidateEval, baselines),
    population: population(optimized.layout, geometry, analysis),
    identifiers: identifierPatterns(sampleIdentifiers()),
    svg: layoutSvg(optimized.layout, geometry),
    experiment: experimentRecord({
      seed,
      language: corpus.language,
      script: corpus.script,
      corpus: [corpus],
      optimizer: { algorithm, iterations, seed },
      layout: optimized.layout,
      evaluation: candidateEval
    }),
    optimizerTrace: optimized.trace,
    note: "Predicted costs under a labeled heuristic hand model. Not a medical outcome."
  };
}
