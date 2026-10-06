#!/usr/bin/env node
/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
import { FIXTURES } from "../src/corpus.js";
import { runExperiment } from "../src/pipeline.js";
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const cmd = args[0] || "help";
function flag(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
}

if (cmd === "languages") {
  console.log(Object.keys(FIXTURES).join("\n"));
} else if (cmd === "analyze" || cmd === "optimize") {
  const language = flag("language", "english");
  const seed = Number(flag("seed", "7"));
  const iterations = Number(flag("iterations", cmd === "analyze" ? "1" : "200"));
  const result = runExperiment({ language, seed, iterations, algorithm: flag("algorithm", "annealing") });
  const out = {
    language: result.corpus.language,
    script: result.corpus.script,
    top: result.analysis.inventory.slice(0, 8),
    valid: result.evaluation.valid,
    vector: result.evaluation.vector,
    comparison: result.comparison.map((c) => c.name),
    lineage: result.layouts.optimized.lineage,
    population: result.population.map((p) => ({ hand: p.hand, travel: p.evaluation.vector.linguisticTravel, reachNote: p.evaluation.evidence }))
  };
  const dest = flag("out", "");
  const text = JSON.stringify(out, null, 2);
  if (dest) writeFileSync(dest, text);
  console.log(text);
} else if (cmd === "export") {
  const result = runExperiment({ language: flag("language", "english"), seed: Number(flag("seed", "7")) });
  const format = flag("format", "json");
  if (format === "svg") console.log(result.svg);
  else console.log(JSON.stringify(result.layouts.optimized, null, 2));
} else {
  console.log(`umhia ${process.env.npm_package_version || "0.2.1"}
Copyright © 2026 Abhishek Choudhary
GPL-3.0-or-later

  node cli/keyboardlab.js languages
  node cli/keyboardlab.js analyze --language kannada
  node cli/keyboardlab.js optimize --language english --seed 7 --iterations 200
  node cli/keyboardlab.js export --language greek --format svg
`);
}
