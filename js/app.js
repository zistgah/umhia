/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
import { COPYRIGHT, VERSION } from "../src/version.js";
import { FIXTURES, wikipediaSearch } from "../src/corpus.js";
import { runExperiment } from "../src/pipeline.js";
import { demoPair } from "../src/fusion.js";
import { createAuth } from "../src/auth.js";

const sections = ["Corpus", "Analysis", "Optimize", "Keyboard", "Compare", "Export", "HIR"];
const nav = document.querySelector("#nav");
const main = document.querySelector("#main");
let state = { section: "Corpus", language: "english", result: null, typed: "" };
const auth = createAuth();

for (const name of sections) {
  const b = document.createElement("button");
  b.textContent = name;
  b.onclick = () => { state.section = name; draw(); };
  nav.append(b);
}

function draw() {
  [...nav.children].forEach((b) => b.classList.toggle("active", b.textContent === state.section));
  main.innerHTML = "";
  const panel = document.createElement("section");
  panel.className = "panel";
  panel.innerHTML = `<p>${COPYRIGHT}. Version ${VERSION}.</p>`;
  if (state.section === "Corpus") corpus(panel);
  if (state.section === "Analysis") analysis(panel);
  if (state.section === "Optimize") optimize(panel);
  if (state.section === "Keyboard") keyboard(panel);
  if (state.section === "Compare") compare(panel);
  if (state.section === "Export") exp(panel);
  if (state.section === "HIR") hir(panel);
  main.append(panel);
}

function languageSelect() {
  const sel = document.createElement("select");
  for (const name of Object.keys(FIXTURES)) {
    const o = document.createElement("option");
    o.value = name;
    o.textContent = `${name} (${FIXTURES[name].language}/${FIXTURES[name].script})`;
    if (name === state.language) o.selected = true;
    sel.append(o);
  }
  sel.onchange = () => { state.language = sel.value; state.result = null; };
  return sel;
}

function corpus(panel) {
  panel.insertAdjacentHTML("beforeend", "<h2>Corpus</h2><p>Phase 1 ships the fixture provider and a Wikipedia provider. Other catalogs are named plugins, not required integrations. Snippets are not corpus data. Wikipedia text is not stored in this repository.</p>");
  const row = document.createElement("div");
  row.append(languageSelect());
  const run = document.createElement("button");
  run.textContent = "Load fixture";
  run.onclick = () => { ensure(); draw(); };
  const search = document.createElement("button");
  search.textContent = "Search Wikipedia";
  const log = document.createElement("pre");
  log.id = "log";
  search.onclick = async () => {
    log.textContent = "searching…";
    try {
      const hits = await wikipediaSearch(FIXTURES[state.language].language, state.language);
      log.textContent = JSON.stringify(hits, null, 2);
    } catch (err) {
      log.textContent = String(err);
    }
  };
  row.append(run, search);
  panel.append(row, log);
}

function ensure() {
  if (!state.result) state.result = runExperiment({ language: state.language, seed: 7, iterations: 180 });
  return state.result;
}

function analysis(panel) {
  const result = ensure();
  panel.insertAdjacentHTML("beforeend", `<h2>Analysis</h2><p>${result.corpus.title}. License ${result.corpus.license}. Normalization ${result.analysis.normalization.form}, changed=${result.analysis.normalization.changed}.</p>`);
  const table = document.createElement("table");
  table.innerHTML = "<tr><th>rank</th><th>unit</th><th>class</th><th>raw</th><th>per million</th></tr>";
  for (const item of result.analysis.inventory.slice(0, 12)) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${item.rank}</td><td></td><td>${item.class}</td><td>${item.frequency}</td><td>${item.frequencyPerMillion.toFixed(0)}</td>`;
    tr.children[1].textContent = item.unit;
    table.append(tr);
  }
  panel.append(table);
}

function optimize(panel) {
  panel.insertAdjacentHTML("beforeend", "<h2>Optimize</h2><p>Monte Carlo and annealing swap linguistic units only. Protected symbols that fall below the access floor invalidate a candidate. The objective vector is kept; a single score is not the report.</p>");
  const row = document.createElement("div");
  row.append(languageSelect());
  const go = document.createElement("button");
  go.className = "primary";
  go.textContent = "Optimize";
  go.onclick = () => { state.result = null; ensure(); state.section = "Compare"; draw(); };
  row.append(go);
  panel.append(row);
}

function compare(panel) {
  const result = ensure();
  panel.insertAdjacentHTML("beforeend", `<h2>Comparison</h2><p>${result.note}</p><p>Lineage ${result.layouts.optimized.lineage.layoutId}, parent ${result.layouts.optimized.lineage.parentLayoutId}, seed ${result.experiment.seed}.</p>`);
  const table = document.createElement("table");
  table.innerHTML = "<tr><th>baseline</th><th>valid</th><th>travel delta</th><th>coverage delta</th></tr>";
  for (const row of result.comparison) {
    const tr = document.createElement("tr");
    const travel = row.deltas.linguisticTravel;
    const cov = row.deltas.coverage;
    tr.innerHTML = `<td>${row.name}</td><td>${row.valid}</td><td>${travel ? travel.absolute.toFixed(3) : "n/a"}</td><td>${cov ? cov.absolute.toFixed(3) : "n/a"}</td>`;
    table.append(tr);
  }
  const pop = document.createElement("p");
  pop.textContent = "Population: " + result.population.map((p) => `${p.hand} travel ${p.evaluation.vector.linguisticTravel.toFixed(3)}`).join("; ");
  panel.append(table, pop);
}

function keyboard(panel) {
  const result = ensure();
  panel.insertAdjacentHTML("beforeend", "<h2>Soft keyboard</h2><p>Generated from the same layout document as the optimizer. Touch grip is a separate model: one-thumb, two-thumb, or index, portrait or landscape.</p>");
  const grip = document.createElement("select");
  for (const g of ["two-thumb", "one-thumb", "index"]) {
    const o = document.createElement("option");
    o.textContent = g;
    grip.append(o);
  }
  const board = document.createElement("div");
  board.className = "kb";
  const area = document.createElement("textarea");
  area.value = state.typed;
  area.rows = 3;
  area.style.width = "100%";
  const layers = result.layouts.optimized.layers.base;
  const geometry = result.geometry;
  const rows = {};
  for (const key of geometry.keys) {
    rows[key.row] = rows[key.row] || [];
    rows[key.row].push(key);
  }
  for (const row of Object.values(rows)) {
    const line = document.createElement("div");
    line.className = "kbrow";
    for (const key of row) {
      const b = document.createElement("button");
      b.className = "key" + (key.id === "k-space" ? " space" : "");
      b.textContent = layers[key.id] || key.legendHint;
      b.onclick = () => {
        state.typed += layers[key.id] || key.legendHint || "";
        area.value = state.typed;
      };
      line.append(b);
    }
    board.append(line);
  }
  panel.append(grip, area, board);
}

function exp(panel) {
  const result = ensure();
  panel.insertAdjacentHTML("beforeend", "<h2>Export</h2>");
  const pre = document.createElement("pre");
  pre.textContent = JSON.stringify(result.layouts.optimized.lineage, null, 2);
  const svg = document.createElement("pre");
  svg.textContent = result.svg.slice(0, 500) + "…";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(result.layouts.optimized, null, 2)], { type: "application/json" }));
  a.download = "layout.json";
  a.textContent = "Download layout JSON";
  const b = document.createElement("a");
  b.href = URL.createObjectURL(new Blob([result.svg], { type: "image/svg+xml" }));
  b.download = "keyboard.svg";
  b.textContent = "Download sticker SVG";
  b.style.marginLeft = "1rem";
  panel.append(pre, a, b, svg);
}

function hir(panel) {
  const fused = demoPair();
  panel.insertAdjacentHTML("beforeend", "<h2>HIR fusion demo</h2><p>Speech mock plus gaze mock. Confidences are heuristic, not calibrated probabilities. Test mode does not open a microphone.</p>");
  const pre = document.createElement("pre");
  pre.textContent = JSON.stringify(fused, null, 2);
  const gate = document.createElement("p");
  auth.grant({ deviceId: "sim-board", sessionId: "pages", ms: 1000 });
  gate.textContent = "Simulated actuator: " + JSON.stringify(auth.canMove("sim-board", "pages"));
  panel.append(pre, gate);
}

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
draw();
