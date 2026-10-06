# Combined Requirements: Universal Multimodal Human Input Architecture (UMHIA)

**Status:** Requirements baseline. No implementation is authorized by this document alone.
**Version:** 0.1.0-requirements
**Date:** 2026-10-06
**Name (working):** UMHIA — Universal Multimodal Human Input Architecture
**Subsystem name for the keyboard embodiment:** Keyboard Lab

This document merges three successive specifications:

1. Universal Multiscript Keyboard Optimization and Corpus Analysis Toolkit
2. Linguistic + Computational + Biomechanical Keyboard Optimization Engine
3. Modality-independent Human Input Spine (keyboard as one embodiment)

Where the three conflict, the later architectural principle wins, and the earlier requirements become constraints on a subsystem.

---

## 0. What this is, and what it is not

### 0.1 Principal question

> What interface architecture minimizes the total human cost of expressing a particular linguistic + computational workload, given the modalities, body, and hardware actually available to this user?

The answer is derived from:

linguistic data + computational data + mathematical data + physical geometry + anthropometry + biomechanics + motor control + error models + fatigue + modality allocation + reconfiguration cost + manufacturing constraints

not from character frequency alone, and not from keyboards alone.

### 0.2 Architectural principle (non-negotiable)

The system is a **modality-independent human-to-computing input spine**. Keyboard optimization is one realization of that spine, not the owner of it.

```
HUMAN INTENT
    │
    ├── speech / audio
    ├── gesture / body / EMG
    ├── gaze
    ├── brain / EEG / BCI
    ├── touch / switch
    └── keyboard (physical, virtual, subset, reconfigurable)
            │
            ▼
     MODALITY ADAPTERS          (peers; none owns semantics)
            │
            ▼
     TEMPORAL + MULTIMODAL FUSION
            │
            ▼
     HUMAN INPUT IR (HIR)       (canonical, versioned)
            │
            ├── linguistic interpreter
            ├── computational / programming interpreter
            └── command interpreter
                    │
                    ▼
             APPLICATION API
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   physical kb   virtual kb   speech / other output
        │
   ┌────┴────┐
 static    reconfigurable
 QWERTY    movable keys / dynamic clusters
 stickers
```

No downstream application may need to know whether an event came from a key, a voice command, a gaze dwell, or a BCI selection, unless it explicitly requests modality metadata.

### 0.3 Non-goals

- Not an Indic-keyboard generator. Indic languages are test cases only.
- Not a claim that a browser PWA is a universal Bluetooth HID keyboard.
- Not a clinical device. Do not claim prevention of RSI or any medical outcome.
- Not a fabricated physiology engine. Unknown parameters are configurable and labeled, not invented as constants.
- Not a silent redistributor of copyrighted corpora.
- Not a single scalar “best keyboard.”
- Not a requirement that every user adopt modular or moving hardware.

### 0.4 Embodiments that must all be first-class

Modularity is a capability, not a mandate. The same HIR and the same layout schema must be able to terminate in:

| Embodiment | Requirement |
|---|---|
| Ordinary fixed keyboard | Logical mapping only; hardware unchanged |
| Sticker / legend overlay | Printable labels, SVG, PDF, keycap legend |
| Reassigned fixed keyboard | New symbol map on existing geometry |
| Full soft keyboard / PWA | Generated from the canonical schema |
| Adaptive soft keyboard | K(t) may change; switching cost counted |
| Partial / exception keyboard | Smallest complement to a dominant modality |
| Reconfigurable physical keyboard | Actuator-neutral key API |
| Voice-primary + exception surface | Speech emits text; keyboard emits rare symbols |
| Gaze, gesture, switch, EMG, EEG/BCI | Adapters emit HIR; decoders are plugins |
| Any combination | Fusion, not a special case |

A researcher must be able to add a modality without rewriting the semantic core.

---

## 1. Distinctions the model must not collapse

These are separate types. The schema and the code must not treat them as aliases.

| Concept | Meaning |
|---|---|
| Language | A linguistic system; may use several scripts and orthographies |
| Script | A writing system (Unicode script property is evidence, not identity) |
| Orthography | A conventional spelling system for a language in a script |
| Character | An abstract linguistic unit; not necessarily one key or one code point |
| Grapheme cluster | A user-perceived character (Unicode UAX #29 or a plugin) |
| Unicode scalar / code point | An encoding unit |
| Combining mark | A code point that combines; may or may not be its own key |
| Keyboard key | A physical or virtual control with geometry |
| Modifier state | Shift, Alt, AltGr, Ctrl, Meta, Fn, and platform equivalents |
| Keyboard layout | Assignment of outputs to (key, modifier, platform, geometry) |
| Keyboard geometry | Positions, sizes, stagger, split, tenting; independent of symbols |
| Programming token | A lexical unit of a programming language |
| Compiler token | A parser token; not assumed identical to the lexical token |
| Mathematical symbol | An operator, relation, letter, or notation atom |
| Intent | A semantic act (SELECT, DELETE_WORD, compile) that may not be a character |
| HIR event | The canonical intermediate representation of any of the above |

Hard-coded assumptions that are forbidden:

- one language = one script
- left-to-right
- alphabetic order as a layout order
- fixed inventory size
- one Unicode scalar = one visible character = one key
- QWERTY finger map as the only legal finger assignment
- 104 keys as the definition of “a keyboard”
- Euclidean key-center distance as a sufficient human model

---

## 2. Canonical intermediate representation (HIR)

Versioned JSON Schema. Every adapter emits HIR. Applications consume HIR.

Conceptual event:

```json
{
  "hir": "1.0.0",
  "event": {
    "id": "uuid",
    "timestamp": 0,
    "window": { "start": 0, "end": 0 },
    "source": "keyboard|speech|gesture|gaze|eeg|emg|switch|touch|fusion|system",
    "confidence": 0.0,
    "intent": "INSERT|DELETE|NAVIGATE|SELECT|CONFIRM|COMMAND|COMPOSE|CORRECT",
    "unit": "codepoint|grapheme|character|word|token|command|gesture|selection|none",
    "value": "",
    "alternatives": [],
    "modifiers": [],
    "composition": {},
    "context": {
      "language": null,
      "script": null,
      "application": null,
      "programmingLanguage": null
    },
    "provenance": {
      "adapter": "",
      "decoder": "",
      "rawRef": null
    }
  }
}
```

HIR must be able to carry characters, graphemes, words, programming tokens, mathematical symbols, commands, gestures, navigation, selection, deletion, correction, composition, modifier state, confidence, alternatives, and time.

A voice system may emit `value: "compile this"`. A BCI may emit `intent: SELECT_NEXT`. A gesture may emit `intent: DELETE_WORD`. A keyboard may emit `value: "{"`. All are valid.

### 2.1 Event bus

```
adapter → modality event bus → temporal fusion → multimodal fusion → HIR → interpreters → application API
```

Also implement **output fission**: one semantic result may drive text, a virtual-key highlight, a physical key command, and optional speech confirmation.

### 2.2 Temporal fusion

Every modality event has a timestamp. Support synchronization, temporal windows, alignment, confidence weighting, early fusion, late fusion, and intermediate fusion. Modalities are asynchronous. An EEG event at t, a gaze event at t+30 ms, and a speech event at t+100 ms may be one composite action.

### 2.3 Fusion examples that must be representable

- Speech “delete this” + gaze on object 17 → `DELETE(object 17)`
- Speech “function” + key `{` → programming construct
- EEG confirmation + gaze on a key candidate → selected key
- Speech content + EEG correction/confirmation

Do not assume each modality contains the whole message.

---

## 3. Modality adapters

Adapters are peers and plugins. The reference implementation ships working baseline adapters plus simulation interfaces. Acquisition hardware is not pretended to live inside the browser.

| Adapter | Reference baseline | External acquisition |
|---|---|---|
| Keyboard | DOM / soft keyboard / recorded key stream → HIR | HID agent protocol |
| Speech | Replaceable engine interface; a deterministic mock/plugin for tests; optional Web Speech where the browser provides it | Vendor ASR behind the same interface |
| Gesture | Event schema + simulator | Camera, IMU, EMG via agent |
| Gaze | Screen-coordinate + dwell schema + simulator | Eye tracker via agent |
| EEG / BCI | Normalized neural-event schema + simulated decoder | WebSocket, WebRTC, serial, Bluetooth, local agent, vendor SDK, OSC-like bridge |
| EMG | Same pattern as EEG | Agent |
| Touch | Pointer / touch events | — |
| Switch | Discrete switch events, dwell optional | Agent |

### 3.1 EEG / BCI contract

The browser is not assumed to acquire EEG. The core receives normalized neural events.

Pipeline, each stage replaceable:

```
acquisition → preprocessing → features → decoder → intent/symbol probabilities → HIR
```

Paradigms that the schema must be able to name, without implementing clinical decoders in v1: P300, SSVEP, motor imagery, ERP, imagined speech, user-defined.

Brain-to-text has two legal modes:

- direct: signal → character/token probabilities
- intent: signal → NEXT, PREVIOUS, SELECT, DELETE, CONFIRM, SPEAK, TYPE

Low-bandwidth BCI may drive a reduced command surface. That is a supported optimization mode, not a failure.

### 3.2 Speech

Spoken language and written script stay separate. The spine must not depend on one ASR vendor. Support phoneme, word, and command streams.

### 3.3 Voice-first is a primary mode, not an edge case

If speech carries ordinary linguistic production, the optimizer must be allowed to discover a tiny exception surface — for example `{ } [ ] ( ) < > ; : _ \ | @ #` plus whatever the math/programming workload actually demands — rather than assuming 104 keys.

---

## 4. Linguistic and corpus subsystem

Retained in full from prompt 1, as a plugin family. The analyzer never assumes an Indic language.

### 4.1 Discovery

Input: language, script, optional region, period, domain, size bounds, preferred license.

Search and record candidate sources. Snippets are not corpus data. Candidate catalogs include, where legally and technically accessible: Wikimedia/Wikipedia and Wikisource, Project Gutenberg, Internet Archive, OPUS, Leipzig, Universal Dependencies, OSCAR, Common Voice metadata, Hugging Face datasets, appropriately licensed GitHub corpora, CLDR/Unicode linguistic data, university and national repositories, public-domain books, government publications.

Every source record: URL, repository, title, language, script, date accessed, license, size, document count, domain, provenance, checksum if downloaded, transformations.

Flag or reject sources whose license does not permit the intended use. If redistribution is forbidden: local analysis only, no corpus text in the repository, derived statistics only where legally appropriate.

### 4.2 Cache and manifest

Key by URL, ETag, Last-Modified, checksum, retrieval date. Do not redownload unchanged corpora. Manifest is part of every experiment.

### 4.3 Aggregation and weighting

Combine corpora with uniform, document-balanced, source-balanced, domain-balanced, and custom weights. Domain exclusion: social, technical, news, literature, legal, religious, scientific, conversational, web. Always expose raw frequency and weighted frequency separately.

### 4.4 Normalization

Configurable NFC, NFD, NFKC, NFKD. Never silent. The report states exactly which transformation ran. Analysis levels, all preserved:

1. Unicode code points
2. grapheme clusters (`Intl.Segmenter` where applicable, plus plugins)
3. combining marks
4. orthographic syllables
5. language-specific units when a tokenizer plugin exists

### 4.5 Statistics

For each analysis level: absolute, relative, cumulative frequency, rank, per-million; unigram/bigram/trigram/configurable n-gram; conditional probability; transition and adjacency; left/right context; clusters. JSON and a human-readable report.

### 4.6 Inventory

```json
{
  "unit": "ಕ",
  "type": "grapheme",
  "unicode": ["U+0C95"],
  "frequency": 0,
  "frequencyPerMillion": 0,
  "rank": 0,
  "contexts": [],
  "script": "Knda",
  "language": "kn",
  "combining": false,
  "required": true,
  "class": "LINGUISTIC"
}
```

Classes, configurable: LINGUISTIC, PROGRAMMING, MATHEMATICAL, PUNCTUATION, STRUCTURAL, CONTROL, DIGIT, CURRENCY, SCIENTIFIC, TYPOGRAPHIC, PLATFORM, OTHER.

### 4.7 Multilingual mode

Several languages/scripts at once. Report combined and per-language frequency. Strategies: one universal layout, family layout, per-language layout, shared base plus language layers. Do not assume each script needs its own physical keyboard.

Example configurations that must ship (configs, not hard-coded optimizers): Kannada, Sanskrit/Devanagari, Hindi/Devanagari, Bengali, Tamil, Telugu, Malayalam, Gujarati, Gurmukhi, Arabic, Persian, Urdu, English, plus Cyrillic, Greek, and Hebrew.

---

## 5. Computational and mathematical workload

Programming is a first-class corpus, not “punctuation from prose.”

Languages with profiles: C, C++, Rust, Java, JavaScript, TypeScript, Python, Go, Bash, Assembly, SQL, Lisp, Prolog, and user-defined. A lexer plugin tokenizes legally obtained source, and the system counts character, token, operator, delimiter, and sequence frequencies. Those frequencies are not assumed equal to prose punctuation.

Protected computational alphabet, minimum, user-extensible:

```
( ) [ ] { } < >
: ; , . ' " `
_ - + = * / %
& | ^ ~ ! ?
@ # $ \
```

Plus arithmetic, comparison, logical, and set operators, relations, arrows, Greek mathematical letters, and common scientific symbols as a configurable mathematical profile.

**Hard constraint:** a candidate is invalid if language score improves by pushing protected symbols below a configured accessibility floor (layer depth, reach class, or chord cost). Hard constraints and soft penalties are separate. The optimizer cannot “win” by sacrificing them.

A run may combine prose + in-language identifiers/comments + one or more programming languages + mathematics.

---

## 6. Keyboard model

### 6.1 Geometry is independent of assignment

Geometries: ANSI-104, ISO-105, JIS, ortholinear, column-staggered, split, curved/tented, mobile grid, custom. Assignments: QWERTY, Dvorak, Colemak, Colemak-DH, Workman, Programmer Dvorak (only if the definition may be shipped), AZERTY, QWERTZ, optimized, manual.

Existing layouts are baselines, not the search-space limit.

Key record:

```json
{
  "id": "k-q",
  "x": 0, "y": 0, "z": 0,
  "width": 1, "height": 1,
  "rotation": 0,
  "profile": "oem",
  "switch": { "actuation": 0.45, "bottomOut": 0.60, "travel": 3.6 },
  "fingerHint": null
}
```

Support rectangular, rotated, variable-size, split, curved, tented, column and row stagger, thumb clusters, and non-planar arrangements. The keyboard is also a graph: nodes are keys; edges are physical adjacency, finger transition, and reachable transition.

### 6.2 Output is not `key → character`

```
physical key + modifier state + platform + geometry + layer → output symbol | token | intent
```

Layers: unmodified, Shift, Ctrl, Alt, AltGr, Option, Command, Meta, Fn where representable, dead keys, compose, multi-key sequences, tap/hold. Modifier semantics are abstract, then compiled per platform (Windows, Linux, macOS, Android, iOS/iPadOS where permitted).

### 6.3 Three optimization layers

| Layer | Fixed | Free |
|---|---|---|
| A. Symbol assignment | geometry, and optionally fingers | symbol-to-key-and-layer map |
| B. Physical geometry | workload | x, y, rotation, size, stagger, curvature, spacing, thumb cluster, modifiers, split angle, tenting |
| C. Integrated | manufacturing bounds only | symbols + fingers + geometry + modifiers + posture |

Layer C is the principal research mode. Every serious comparison emits four results:

- A. existing keyboard (geometry + stock assignment)
- B. optimized assignment on that geometry
- C. new geometry + new assignment
- D. population-robust geometry + assignment

### 6.4 Dynamic keyboards

Represent `K(t)`. `K(t+1)` may differ by language, application, programming language, syntax context, fatigue, posture, available hand, available modality, or next-symbol prediction.

Reconfiguration may move one key, one cluster, one row, a thumb cluster, a programming module, or a language module. Mechanisms are not hard-coded. Actuator API:

```
position() move(x,y) rotate(angle) setLabel(symbol)
setLayer(layer) lock() unlock() status()
```

Modes: manual, automatic, suggest-only. Never silently move a physical keyboard.

Switching cost is in the objective: layout transition, physical movement, visual reacquisition, learning, memory. A statistically optimal layout that changes constantly can lose.

### 6.5 Subset objective

Separate objective: smallest key set that complements the dominant modality for this task (voice + 12 symbols, EEG + 8 commands, gaze + 20 symbols, and so on).

### 6.6 One schema, many exports

The same document generates keycap labels, SVG, PDF sticker sheet, HTML/CSS, soft keyboard, PWA, HID mapping, and reconfigurable-hardware commands. JSON Schema validated. Versioned.

Import/export: JSON, CSV, SVG, HTML, CSS, JavaScript, Unicode keyboard definitions where feasible, OS exporters as plugins. The optimizer does not depend on one OS.

---

## 7. Human model

This is an engineering model. Every parameter is labeled:

`measured | empirically supported | model-derived | heuristic | assumption`

Missing evidence becomes a configurable parameter with a stated default and a limitation, not a fake constant.

### 7.1 Hand

Left and right separately. No symmetry assumption.

```
hand → wrist, palm, thumb, index, middle, ring, little
```

Configurable segment lengths, joint limits (wrist flexion/extension, radial/ulnar deviation; thumb flexion, abduction, opposition; finger MCP/PIP/DIP), finger width, rest pose, hand breadth, palm size.

### 7.2 Anthropometry

Distributions, not one average hand. At least small / median / large, both sides, optional sex-linked tables, arbitrary measured dimensions. Plugin datasets. Percentiles P05, P25, P50, P75, P95 where data exists. A layout that wins only at P50 must not automatically win.

### 7.3 Reach

Per-finger 3D reach from segment lengths, joint limits, posture, neighbor constraints, wrist and palm. Not a circle radius. Classify each key: comfortable, reachable, marginal, strained, effectively unreachable.

Inverse kinematics is an allowed method behind a plugin. The v1 baseline may be a transparent kinematic approximation if it is labeled heuristic.

### 7.4 Finger assignment is free

The QWERTY home-row map is one candidate, not a constant. The optimizer may reassign fingers subject to joint and collision constraints. Score travel, independence, lateral displacement, extension, flexion, abduction/adduction, crossing, and simultaneous-key conflicts.

### 7.5 Motion, force, fatigue, error

Motion cost plugins may use joint displacement, angular displacement, path length, velocity, acceleration, jerk, extension, abduction, wrist displacement. Default metric is selectable: Euclidean, Manhattan, weighted physical, finger-specific.

Force: actuation, travel, bottom-out, release, repeat. Workload may be presses × force × travel, with nonlinear fatigue optional.

Fatigue is an exposed function of repetition, force, displacement, posture, duration, and recovery. Multiple models. Not presented as physiologically definitive.

Motor models (Fitts, Hick–Hyman, steering, repeat) may be plugins. Each records domain, assumptions, parameters, evidence, limitations. Do not apply them blindly.

Error model estimates neighbor misses, same-finger confusion, overreach, modifier errors, chord errors, accidental chording, repeats, layer-switch errors. Empirical datasets may replace the estimates. Objective includes expected workload and expected error cost.

### 7.6 Chords

For each modifier chord: hands, fingers, simultaneous reach, timing, awkwardness, collision probability. Platform-specific.

### 7.7 Touch is a different body model

Touch targets, thumb arcs, and grip are not physical-keyboard biomechanics. Touch layouts are optimized separately, from the same schema.

### 7.8 Population, sensitivity, uncertainty

Serious runs evaluate mean, median, worst percentile, and variance across the hand population. Sensitivity: ±10/20/30% on important parameters. If the layout flips, report `OPTIMIZATION INSTABILITY`. Validation against QWERTY, Dvorak, and Colemak must be allowed to disagree with published ergonomic findings; disagreements are reported.

No output may say “this keyboard prevents RSI.” Allowed form: “Under model X and assumptions Y, predicted wrist deviation / finger workload is Z.”

---

## 8. Optimization

Algorithms are plugins. Minimum set: Monte Carlo, simulated annealing (temperature, cooling, mutation, swap, multi-symbol move, restart), hill climbing, genetic/evolutionary. Architecture must allow tabu, beam, and hybrids (for example genetic search, then annealing, then local biomechanical polish). Every run has a seed and is reproducible from config + seed.

### 8.1 Objectives (do not collapse by default)

Independent scores:

- linguistic efficiency
- programming efficiency
- mathematical efficiency
- physical travel
- joint movement
- finger load
- hand load and imbalance
- wrist deviation
- modifier and layer cost
- error probability
- fatigue
- population robustness
- manufacturability
- keyboard size
- coverage / missing characters
- dead-key and sequence cost
- n-gram / awkward bigram and trigram cost
- modality-switch cost
- reconfiguration cost
- cognitive / learning cost where a model exists

Provide both weighted scalar optimization and a Pareto frontier. A prose optimum need not equal a programming, mathematics, firmware, shell, or office optimum.

### 8.2 Manufacturability

For generated hardware, report key size, spacing, switch footprint, PCB feasibility, wiring complexity, enclosure, thumb-cluster feasibility, standard keycap compatibility. Experimental layouts may violate constraints; violations are reported, not hidden. Configurable bounds: minimum spacing, maximum width and depth, manufacturing grid, standard keycap sizes.

---

## 9. User model and adaptation

Optional profile: preferred modalities, dominant hand, measured hand, language and script, programming languages, applications, speech/BCI/gesture/gaze accuracy, accessibility constraints.

Learning from keystrokes, corrections, speech corrections, gaze, BCI confidence, completion time, and fatigue proxies is allowed only if transparent and reversible. Personalization is never required.

Context recognition (prose vs C++ vs mathematics vs shell) may suggest a surface. Suggestion is the default. Automatic physical change requires explicit opt-in.

---

## 10. Presentation, PWA, HID

### 10.1 Soft keyboard

Generated only from the canonical layout. Responsive desktop, tablet, mobile. Touch targets. Accessibility. Layer highlight. Language and script switch. Long-press alternatives. Dead-key/compose. Copy/paste. Test area. Typing statistics. URL may encode a layout, for example `/pwa?language=kn&layout=optimized-001`.

### 10.2 PWA

Installable, offline, service worker, local corpus-statistic cache, local layout storage, import/export, no mandatory server, usable on Android.

### 10.3 HID

Three layers, honestly separated:

```
PWA virtual keyboard → local/mobile agent → Bluetooth HID / OS input → host
```

Define the PWA↔agent protocol. Do not claim browser-only universal HID. Reference agent stubs for Android, Linux, Windows, macOS, and iOS/iPadOS document platform limits instead of pretending to cross them.

### 10.4 Visualization

In JavaScript (SVG/Canvas): frequency histogram, cumulative curve, character heatmap, keyboard heatmap, finger load, hand load, key distance, modifier usage, programming-symbol accessibility, before/after, existing vs optimized, Pareto frontier.

Where practical, a browser 3D view: geometry, hand, reach envelope, press, path, joint motion, playback of representative sequences. A numeric score is not a sufficient ergonomic report.

### 10.5 Interactive designer

Drag symbols between keys, evaluate the manual layout, compare with the optimized one. Expert constraints the statistics cannot see are in scope.

---

## 11. Reproducibility and experiments

Every run records: seed, corpus sources and hashes, normalization, languages, scripts, geometry, initial layout, optimizer and parameters, weights, constraints, hand model and percentiles, modality mix, software version, timestamp.

An experiment is the stored tuple:

`corpus + population + geometry + optimizer + weights + constraints + seed + modality policy`

Machine-readable results. A run must replay from that record.

---

## 12. Plugin boundaries

Must be plugins, not core conditionals:

- corpus provider
- language tokenizer
- script segmenter
- programming lexer
- keyboard geometry
- keyboard layout
- objective
- optimizer
- hand / anthropometry dataset
- reach and kinematics
- fatigue
- error model
- motor model
- modality adapter and decoder
- fusion strategy
- platform exporter
- visualization

Adding a language, script, layout, or modality must not require editing the core.

---

## 13. Security, licensing, medical boundary

- Provenance and license on every corpus. No silent redistribution.
- No third-party corpus text committed for convenience.
- Biomechanical outputs carry assumption labels.
- BCI and EMG adapters do not claim diagnostic or therapeutic use.
- Network corpus fetch is explicit and cached; the PWA must function offline on already-cached statistics.

---

## 14. Tests

Automated:

- Unicode and grapheme segmentation, including combining marks, ZWJ, ZWNJ, variation selectors, surrogate pairs, emoji, RTL, mixed script, complex shaping
- normalization diffs
- corpus parse, license flag, cache
- frequency math (raw vs weighted)
- layout schema validation
- modifier layers
- protected-symbol hard constraint (a candidate that buries `{` is rejected)
- optimizer reproducibility from seed
- HIR round-trip from each baseline adapter
- fusion window alignment
- import/export
- sticker SVG contains the assigned legends
- PWA manifest and service worker registration shape
- keyboard event generation from the schema

---

## 15. Documentation set

- README
- ARCHITECTURE.md
- REQUIREMENTS.md (this document)
- CORPUS.md
- OPTIMIZATION.md (objective and algorithms, with formulas)
- KEYBOARD_SCHEMA.md
- HIR.md
- BIOMECHANICS.md (models, labels, limitations)
- PROGRAMMING_MODE.md
- MODALITIES.md
- PWA.md
- BLUETOOTH_AGENT.md
- RECONFIGURATION.md
- PLUGINS.md
- LICENSE.md
- CONTRIBUTING.md

---

## 16. Technology constraints

- TypeScript, Node.js, browser, PWA, Web Workers.
- WebAssembly and GPU optional behind adapters.
- No Python runtime dependency.
- Native code only through optional adapters.
- Reference path stays JS/TS.

Suggested package split (folders, not a promise of a published monorepo graph on day one):

`core  corpus  unicode  language  programming  math  keyboard  geometry  anthropometry  biomechanics  kinematics  motor  fatigue  error  optimizer  multiobjective  modalities  fusion  hir  visualization  pwa  hid-agent  exporters  datasets  experiments  tests`

---

## 17. Delivery phases

The prompts demand a working system, not an essay. They also demand EEG, population biomechanics, and moving keys. Those are not the same amount of work. Phases below are the combined requirement. Phase 1 is the minimum end-to-end spine. Later phases are required extension points with working interfaces, not deleted scope.

### Phase 1 — spine and keyboard baseline (first implementation)

Must actually run:

1. Corpus discovery against at least Wikipedia/Wikimedia API and one other public source, with license metadata.
2. Fetch, cache, normalize, grapheme analysis, n-grams, inventory, classification.
3. Programming-symbol profile and protected-set hard constraint (bundled sample or fetched open-source snippet; no redistributed corpus).
4. Geometry library and stock layouts, geometry separated from assignment.
5. Hand model with configurable anthropometry and a labeled reach classification.
6. Evaluate an existing layout.
7. Layer A optimizer: Monte Carlo and simulated annealing, seeded, reproducible.
8. Layer B: a bounded geometry mutation (spacing, stagger, thumb-key position) with manufacturability report.
9. Pareto or at least multi-objective vector, not only a scalar.
10. Population pass over small/median/large.
11. Soft keyboard and PWA generated from the schema.
12. Sticker/SVG export.
13. HIR, event bus, keyboard adapter, speech mock adapter, fusion window.
14. HID agent protocol and a non-claiming stub.
15. CLI and a web UI that can analyze, optimize, compare, and export.
16. Tests listed in section 14 for the phase-1 surface.
17. Example configs for the languages in section 4.7.

### Phase 2 — research depth

Genetic optimizer, sensitivity analysis, 3D hand playback, richer IK plugin, programming-corpus fetch, multilingual combined optimization, interactive designer, OS exporters.

### Phase 3 — multimodal and reconfigurable

Gaze and gesture simulators backed by the real schemas, EEG normalized-event adapter and a toy decoder clearly labeled as non-clinical, subset-keyboard optimizer for voice-primary, `K(t)` reconfiguration policy with switching cost, actuator API and a simulated moving-key board.

---

## 18. Conflict resolutions (so implementation does not relitigate them)

| Tension | Resolution |
|---|---|
| Prompt 1 centers the keyboard; prompt 3 forbids that | HIR is the core. Keyboard Lab is a subsystem. |
| “Do not build a toy” vs “ship an end-to-end baseline” | Phase 1 must run the pipeline. Unimplemented physiology is an interface plus a labeled heuristic, never a fake clinical number. |
| Euclidean distance vs joint model | Both exist. Distance is a selectable metric. Joint cost is a separate objective. Neither replaces the other. |
| One score vs Pareto | Store the vector always. Scalar only when the user supplies weights. |
| 104-key assumption vs voice-first | Key count is an output of subset optimization, not an input constant. |
| Dynamic hardware vs sticker user | Both are endpoints of one schema. |
| Browser HID optimism | Protocol yes. Universal browser HID no. |
| Indic examples vs global architecture | Examples are data. Core has no script switch. |

---

## 19. Acceptance for the requirements themselves

This document is accepted as the build contract when:

- a keyboard-only reading is impossible without deleting section 2
- a frequency-only reading is impossible without deleting sections 5 and 7
- a moving-key-only reading is impossible without deleting the sticker and fixed-keyboard endpoints
- phase 1 can be implemented without claiming phase 3 is done

Implementation starts only after this contract is confirmed.
