# UMHIA Requirements V2

**Status:** Requirements specification. This document authorizes no implementation by itself.
**Version:** 0.2.0-requirements
**Date:** 2026-10-06
**Supersedes:** REQUIREMENTS.md 0.1.0-requirements (V1)
**Name:** UMHIA — Universal Multimodal Human Input Architecture
**Principal current embodiment:** Keyboard Lab

V2 is a revision of V1. It does not replace the project. Difficult V1 requirements are retained. Phases sequence delivery. They do not delete scope.

Companion: `V1_TO_V2_CHANGELOG.md`.

---

## 1. Scope

### 1.1 What this specification is

UMHIA is a human-to-computing **input** architecture. Keyboard Lab is its principal current embodiment and research substrate.

The job of the system is to optimize and normalize this path:

```
HUMAN INTENT
    ↓
MODALITY
    ↓
INPUT EVENT
    ↓
TEMPORAL / MULTIMODAL FUSION
    ↓
HUMAN INPUT IR (HIR)
    ↓
APPLICATION / COMPUTING INTERFACE
```

The hierarchy is fixed:

| Thing | Role |
|---|---|
| UMHIA | The architecture |
| HIR | Canonical representation of human input and resolved input actions |
| Keyboard Lab | One embodiment and one optimizer |
| Corpus analysis | One source of workload evidence |
| Programming languages | Workloads: symbols, tokens, operators, delimiters, editing actions, notation |
| Biomechanics | One class of optimization model |
| Speech, gaze, gesture, touch, switch, EMG, EEG/BCI | Peer modalities |
| PWA, HID agent, stickers, reconfigurable hardware | Output embodiments |

No modality owns the semantic core. A new modality must be addable without rewriting that core.

### 1.2 What this specification is not

Out of scope, even as “context”:

- Implementing a programming language, lexer product, parser, compiler, compiler IR, code generator, or runtime.
- Implementing Hindawi, Romenagri, ILM, or any other external language or input product.
- Replacing an operating system, window system, or input stack.
- A clinical device, a diagnostic BCI, or a claim that any layout prevents RSI or other injury.
- A fabricated physiology engine. Unknown quantities stay configurable and labeled.
- Redistribution of copyrighted corpus text.
- A single universally optimal keyboard.
- A requirement that any user adopt modular, moving, or electronic hardware.
- An Indic-only keyboard generator. Indic languages are workload configurations.
- A browser-only universal Bluetooth HID implementation.
- A cognitive architecture, an agent, or an AGI design. Fusion resolves input. It does not model a mind.

If Hindawi, Romenagri, ILM, a compiler, or an OS is mentioned, it is only an external consumer, a workload example, an interoperability target, or architectural context. This project does not emit their internal representations and does not implement their semantics.

Programming languages appear only as human-input workloads. The system may consume externally supplied token or frequency data through a plugin. It does not construct those languages.

### 1.3 Principal question

> What interface architecture minimizes the total human cost of expressing a particular linguistic and computational workload, given the modalities, body, and hardware actually available to this user?

Evidence comes from linguistic data, computational-symbol workloads, mathematical notation workloads, geometry, anthropometry, biomechanics, motor-control models, error models, fatigue models, modality allocation, reconfiguration cost, and manufacturing constraints. Character frequency alone is not sufficient. Keyboards alone are not the search space.

### 1.4 Embodiments that remain first-class

Modularity is a capability, not a mandate. The same layout schema and the same HIR must be able to terminate in:

| Embodiment | Requirement |
|---|---|
| Ordinary fixed keyboard | Logical mapping only; hardware unchanged |
| Sticker / legend overlay | Printable labels, SVG, PDF, keycap legend |
| Reassigned fixed keyboard | New symbol map on an existing geometry |
| Full soft keyboard / PWA | Generated from the canonical schema |
| Adaptive soft keyboard | `K(t)` may change; switching cost is counted |
| Partial / exception keyboard | Smallest complement to a dominant modality |
| Reconfigurable physical keyboard | Actuator-neutral key API |
| Voice-primary + exception surface | Speech carries ordinary text; keyboard carries rare symbols |
| Gaze, gesture, switch, EMG, EEG/BCI | Adapters emit modality events; decoders are plugins |
| Any combination | Fusion, not a special case |

---

## 2. Four requirement classes

Every requirement in this document belongs to exactly one class. Implementation sequencing must not be misread as deletion.

| Class | Meaning |
|---|---|
| Architecture | The system must be capable of this. Interfaces and schemas exist even if a body is deferred. |
| Reference implementation | A named phase must actually run this. |
| Plugin interface | Replaceable. Core must not hard-code one provider. |
| Research extension | Required eventually. Interface in an earlier phase. Behavior may be simulated and must be labeled. |

“Do not build a toy” means: a Phase 1 build may omit an advanced adapter body, but it may not collapse the architecture into an n-gram permuter of QWERTY, and it may not drop the interfaces those later bodies plug into.

---

## 3. Distinctions that must not collapse

| Concept | Meaning in this system |
|---|---|
| Language | A linguistic system. May use several scripts and orthographies. |
| Script | A writing system. Unicode script property is evidence, not identity. |
| Orthography | A spelling convention for a language in a script. |
| Character | An abstract written unit. Not necessarily one key or one code point. |
| Grapheme cluster | A user-perceived character (UAX #29 or a segmenter plugin). |
| Unicode scalar / code point | An encoding unit. |
| Combining mark | A code point that combines. It may or may not be its own key. |
| Keyboard key | A physical or virtual control with geometry. |
| Modifier state | Shift, Alt, AltGr, Ctrl, Meta, Fn, and platform equivalents. |
| Layer | A named modifier combination that selects an output map. |
| Keyboard layout | Assignment of outputs to (key, layer, platform) on a geometry. |
| Keyboard geometry | Positions, sizes, stagger, split, tenting. Independent of symbols. |
| Workload token | A lexical unit supplied by a programming-workload plugin or an external corpus. Not a compiler token. |
| Mathematical symbol | An operator, relation, letter, or notation atom used as input. |
| Intent | An input action such as insert, delete, select, confirm, navigate, or a named command string. Not a program to execute. |
| Modality event | Raw or normalized observation from one adapter. |
| HIR | Canonical human-input record after interpretation stages defined in §5. |

Forbidden hard-coded assumptions:

- one language = one script
- left-to-right as the only direction
- alphabetic order as layout order
- a fixed inventory size
- one Unicode scalar = one visible character = one key
- the QWERTY finger map as the only legal finger assignment
- 104 keys as the definition of a keyboard
- Euclidean key-center distance as a sufficient human model

---

## 4. Cost and constraint ontology

Plugins must not return incomparable quantities under the same name. Every numeric or categorical output used by the optimizer declares one of these roles.

| Role | Definition | May reject a candidate? | Example |
|---|---|---|---|
| Objective | A direction to improve, stored in the objective vector | No, by itself | linguistic travel cost |
| Metric | A measurement, possibly an input to an objective | No | bigram same-finger count |
| Hard constraint | A predicate that must hold | Yes. Candidate is invalid | `{` reachable within the configured access floor |
| Soft constraint | A preferred bound; violation is penalized, not fatal | No | home-row bias |
| Penalty | A term added when a soft constraint or awkwardness rule fires | No | layer-switch penalty |
| Preference | A user choice that selects weights, bounds, or a Pareto point | Only if the user marks it hard | “prefer thumb for space” |
| Model parameter | An input to a model, with an evidence label | No | finger segment length |
| Uncertainty | Spread or confidence on a parameter, metric, or prediction | No | P05–P95 hand breadth |
| Observation | A recorded event or corpus count | No | grapheme frequency |
| Prediction | A model output about effort, error, or fatigue | No | expected chord-error rate |

Evidence labels on every model parameter and every prediction:

`measured | empirically supported | model-derived | heuristic | assumption`

A report that gives only `optimized score = X` is non-conformant. See §16.

---

## 5. Human Input Representation

HIR is the canonical representation of human input events and of interpreted input actions. It is not a compiler IR, a language AST, or an OS input packet.

### 5.1 Four stages

V1 used one event shape for everything. V2 splits stages so fusion is deterministic and so raw observations are not confused with committed actions. All four stages are human-input records. None is a compiler representation.

| Stage | Name | Producer | Meaning |
|---|---|---|---|
| 0 | Modality event | One adapter | What the sensor or simulator observed |
| 1 | Candidate | Decoder or single-modality interpreter | A hypothesis: value, intent, confidence, alternatives |
| 2 | Composed event | Fusion | One hypothesis supported by one or more candidates in a time window |
| 3 | Resolved action | Commit step | The action handed to an application binding |

Applications consume resolved actions. They may also subscribe to earlier stages for debugging. They must not need modality metadata unless they request it.

### 5.2 Common envelope

Versioned JSON. Schema id `umhia.hir`.

```json
{
  "hir": "2.0.0",
  "stage": "modality|candidate|composed|resolved",
  "id": "uuid",
  "timestamp": 0,
  "window": { "start": 0, "end": 0 },
  "source": {
    "modality": "keyboard|speech|gesture|gaze|eeg|emg|switch|touch|fusion|system",
    "adapter": "",
    "decoder": null
  },
  "confidence": 0.0,
  "intent": "INSERT|DELETE|NAVIGATE|SELECT|CONFIRM|CANCEL|CORRECT|COMPOSE|COMMAND",
  "unit": "codepoint|grapheme|character|word|token|symbol|command|gesture|selection|none",
  "value": "",
  "alternatives": [],
  "modifiers": [],
  "evidence": [],
  "composition": {
    "parents": [],
    "policy": null,
    "state": "open|committed|cancelled|corrected"
  },
  "context": {
    "language": null,
    "script": null,
    "application": null,
    "workload": null
  },
  "provenance": {}
}
```

`workload` names a workload profile such as `cpp` or `math`. It does not identify a compiler.

The envelope must be able to carry: physical and virtual input, speech, gaze, gesture, touch, switch, EMG, EEG/BCI, fusion, characters, grapheme clusters, words, workload tokens, mathematical symbols, command strings, navigation, selection, deletion, correction, composition, modifier state, alternatives, confidence, provenance, and time.

Examples, all valid:

- keyboard candidate: `intent=INSERT`, `unit=symbol`, `value="{ "`
- speech candidate: `intent=INSERT`, `unit=word`, `value="function"`
- BCI candidate: `intent=SELECT`, `value="NEXT"`
- gesture candidate: `intent=DELETE`, `unit=command`, `value="DELETE_WORD"`
- composed: speech “delete this” + gaze on object 17 → resolved `DELETE` with target reference 17

A command string is opaque to UMHIA. Delivery to an external consumer is an application binding, not execution by this system.

### 5.3 Event bus

```
adapter
  → modality event
  → optional decoder (candidate)
  → temporal alignment
  → multimodal fusion (composed)
  → commit / cancel / correct (resolved)
  → application binding
```

Output fission remains: one resolved action may drive text insertion, a virtual-key highlight, a physical key command, and optional speech confirmation. Fission is presentation. It is not a second semantic core.

### 5.4 Fusion requirements

Fusion must be representable and replayable. It is not a cognitive architecture.

Required:

- Asynchronous events. No modality is assumed to share a clock with another beyond timestamps the adapter supplies.
- Temporal windows. A composed event names the window that admitted its parents.
- Ordering. Document the tie break when timestamps collide: explicit sequence number, then source id, then arrival order. The rule is part of the experiment record.
- Synchronization. Adapters may supply a clock offset. Unknown offset is an assumption, recorded as such.
- Candidate hypotheses and alternatives, each with confidence.
- Evidence lists. A composed event points at the modality events and candidates that support it.
- Conflict resolution. If two candidates in one window disagree, the policy must emit either one winner with the loser retained as an alternative, or an unresolved composed event. Silent drop is non-conformant.
- Early fusion: combine modality events before decoding, where a plugin does that.
- Intermediate fusion: combine candidates.
- Late fusion: combine already composed hypotheses.
- Correction: a later resolved action may reference an earlier one as `CORRECT`.
- Cancellation: an open composed event may become `cancelled` without a resolved action.
- Commit: the only transition that produces a resolved action.
- Replay and debugging: given the modality-event log, window parameters, fusion policy id, and seed, the same composed and resolved records are reproduced.

Normative examples that must round-trip in tests:

- speech + gaze → one delete-target action
- speech + keyboard symbol → one composed insert, both parents kept
- EEG confirmation + gaze on a key → one select
- speech content + a later EEG or keyboard correction → `CORRECT` linked to the earlier resolved id

Do not assume any modality contains the whole message.

### 5.5 EEG / BCI contract

The browser is not assumed to acquire EEG. The core receives normalized neural events.

```
acquisition → preprocessing → features → decoder → intent or symbol probabilities → candidate
```

Each stage is a plugin. Paradigms the schema must be able to name, without a clinical decoder in the reference build: P300, SSVEP, motor imagery, ERP, imagined speech, user-defined.

Two legal decoder output modes:

- direct: probabilities over characters or workload tokens
- intent: NEXT, PREVIOUS, SELECT, DELETE, CONFIRM, SPEAK, TYPE, user-defined command names

Low-bandwidth BCI may drive a reduced command surface. That is a supported optimization mode.

---

## 6. Modality adapters

Adapters are peers and plugins. Acquisition hardware is outside the browser unless a platform API actually exists. The reference build ships schemas, simulators, and the keyboard path. Other bodies land in later phases behind the same interfaces.

| Adapter | Reference baseline | External acquisition |
|---|---|---|
| Keyboard | DOM, soft keyboard, or recorded key stream → modality event | HID agent protocol |
| Speech | Replaceable engine interface; deterministic mock for tests; optional Web Speech where the browser already provides it | Vendor ASR behind the same interface |
| Gesture | Event schema + simulator | Camera, IMU, or EMG via agent |
| Gaze | Screen coordinate + dwell schema + simulator | Eye tracker via agent |
| EEG / BCI | Normalized neural-event schema + labeled simulated decoder | WebSocket, WebRTC, serial, Bluetooth, local agent, vendor SDK, OSC-like bridge |
| EMG | Same pattern as EEG | Agent |
| Touch | Pointer and touch events | — |
| Switch | Discrete switch events; dwell optional | Agent |

Spoken language and written script stay separate. The spine must not depend on one ASR vendor. Speech may emit phoneme, word, or command streams. Phoneme emission is a plugin capability, not a requirement that UMHIA implement a phonology.

Voice-first is a primary optimization mode. If speech carries ordinary linguistic production, the optimizer must be allowed to return a small exception surface rather than 104 keys.

---

## 7. Corpus subsystem

Architecture and reference implementation. Unchanged in ambition from V1.

### 7.1 Discovery

Input: language, script, optional region, period, domain, size bounds, preferred license.

Search and record candidate sources. Snippets are not corpus data. Catalogs include, where legally and technically accessible: Wikimedia and Wikisource, Project Gutenberg, Internet Archive, OPUS, Leipzig, Universal Dependencies, OSCAR, Common Voice metadata, Hugging Face dataset metadata, appropriately licensed GitHub corpora, CLDR and Unicode linguistic data, university and national repositories, public-domain books, government publications.

Each source record: URL, repository, title, language, script, date accessed, license, size, document count, domain, provenance, checksum if downloaded, transformations applied.

Flag or reject a source whose license does not permit the intended use. If redistribution is forbidden: local analysis only, no corpus text in the repository, derived statistics only where that is legally appropriate.

### 7.2 Cache

Key by URL, ETag, Last-Modified, checksum, retrieval date. Do not redownload unchanged corpora. The manifest is part of every experiment.

### 7.3 Aggregation

Weights: uniform, document-balanced, source-balanced, domain-balanced, custom. Excludable domains include social, technical, news, literature, legal, religious, scientific, conversational, and web. Always expose raw frequency and weighted frequency separately.

### 7.4 Normalization

Configurable NFC, NFD, NFKC, NFKD. Never silent. The report states the transformation. Preserve analysis at:

1. Unicode code points
2. grapheme clusters (`Intl.Segmenter` where applicable, plus a segmenter plugin)
3. combining marks
4. orthographic syllables, when a plugin defines them
5. language-specific units, when a tokenizer plugin exists

### 7.5 Statistics

Absolute, relative, and cumulative frequency, rank, per-million; unigram, bigram, trigram, configurable n-gram; conditional probability; transition and adjacency; left and right context; clusters. JSON and a human-readable report.

### 7.6 Inventory

```json
{
  "unit": "ಕ",
  "type": "grapheme",
  "unicode": ["U+0C95"],
  "frequency": 0,
  "weightedFrequency": 0,
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

### 7.7 Multilingual mode

Report combined and per-language frequency. Strategies: one universal layout, family layout, per-language layout, shared base plus language layers. Do not assume each script needs its own physical keyboard.

Workload configurations that must ship as data, not as core branches: Kannada, Sanskrit/Devanagari, Hindi/Devanagari, Bengali, Tamil, Telugu, Malayalam, Gujarati, Gurmukhi, Arabic, Persian, Urdu, English, Cyrillic, Greek, Hebrew.

Adversarial text that tests must include: combining marks, ZWJ, ZWNJ, variation selectors, surrogate pairs, emoji, right-to-left text, mixed scripts, complex shaping.

---

## 8. Computational and mathematical workload

Programming is a first-class **input workload**. This section does not require a lexer product or a compiler.

Profiles that must be representable: C, C++, Rust, Java, JavaScript, TypeScript, Python, Go, Bash, Assembly, SQL, Lisp, Prolog, and user-defined. A workload plugin may supply token and sequence frequencies, or the system may count them from legally obtained source using a replaceable counter. Those frequencies are not assumed equal to prose punctuation.

What is counted, when a plugin or corpus provides it: character frequency, token frequency, operator frequency, delimiter frequency, identifier-character patterns, common symbol sequences, modifier combinations required to produce those symbols.

A run may combine prose, in-language identifier and comment text, one or more programming workloads, and a mathematics workload.

Mathematics workload, configurable: arithmetic, comparison, logical, and set operators, relations, arrows, Greek mathematical letters, common scientific symbols. The optimizer must not sacrifice this profile for prose frequency.

### 8.1 Protected computational alphabet

Minimum set, user-extensible:

```
( ) [ ] { } < >
: ; , . ' " `
_ - + = * / %
& | ^ ~ ! ?
@ # $ \
```

Also protected, as configured: the active mathematics profile, and any user-supplied set.

Access is defined as a hard constraint, not as a hope inside the scalar score:

- each protected symbol has a maximum layer depth, a maximum reach class, and a maximum chord cost
- a candidate that violates any of these is invalid
- invalid candidates are not ranked
- soft penalties may still discourage legal but awkward placements
- user preferences may tighten a bound into a hard constraint or leave it soft
- objectives may reward easier access above the floor, but cannot trade below the floor

A layout that improves prose score by making a protected symbol inaccessible or more expensive than its floor is non-conformant.

---

## 9. Keyboard model

### 9.1 Geometry is independent of assignment

Geometries: ANSI-104, ISO-105, JIS, ortholinear, column-staggered, split, curved, tented, mobile grid, custom. Assignments: QWERTY, Dvorak, Colemak, Colemak-DH, Workman, Programmer Dvorak only if its definition may be shipped, AZERTY, QWERTZ, optimized, manual.

Existing layouts are baselines, not the limit of the search space.

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

Support rectangular, rotated, and variable-size keys, split boards, curved and tented surfaces, column and row stagger, thumb clusters, and non-planar arrangements. The keyboard is also a graph: nodes are keys; edges are physical adjacency, finger transition, and reachable transition.

`fingerHint` is an optional baseline annotation. It is not a fixed assignment.

### 9.2 Output mapping

```
physical or virtual key + layer + platform + geometry → symbol | workload token | command string
```

Layers: unmodified, Shift, Ctrl, Alt, AltGr, Option, Command, Meta, Fn where representable, dead keys, compose, multi-key sequences, tap/hold. Modifier semantics are abstract, then compiled per platform (Windows, Linux, macOS, Android, iOS/iPadOS where the platform permits). The compiler in that sentence is a layout exporter, not a programming-language compiler.

### 9.3 Three optimization layers

| Layer | Fixed | Free |
|---|---|---|
| A. Symbol assignment | geometry; fingers optional | symbol-to-key-and-layer map |
| B. Physical geometry | workload | x, y, rotation, size, stagger, curvature, spacing, thumb cluster, modifiers, split angle, tenting |
| C. Integrated | manufacturing bounds only, unless the user adds more | symbols, fingers, geometry, modifiers, posture |

Layer C is the principal research mode. Every serious comparison emits four results:

- A. existing geometry + stock assignment
- B. optimized assignment on that geometry
- C. new geometry + new assignment
- D. population-robust geometry + assignment

### 9.4 Dynamic keyboards, `K(t)`

`K(t+1)` may differ from `K(t)` by language, application, programming workload, syntax context supplied by an external editor, modality availability, posture, fatigue estimate, available hand, user preference, or next-symbol prediction.

Reconfiguration may concern one key, one cluster, one row, a thumb cluster, a programming-symbol module, or a language module. Mechanisms are not hard-coded.

Actuator API, hardware-neutral:

```
position()  move(x, y)  rotate(angle)  setLabel(symbol)
setLayer(layer)  lock()  unlock()  status()
```

Modes: manual, suggest-only, automatic. **No physical reconfiguration without explicit user authorization.** Suggest-only is the default. Automatic physical motion requires a recorded opt-in.

Switching cost is an objective, not a comment. It includes layout transition, physical movement, visual reacquisition, learning, memory, and disruption. A statistically cheaper layout that changes constantly can lose to a stable layout. A conformance test must demonstrate that case.

### 9.5 Subset objective

Separate objective: smallest key set that complements the dominant modality for a stated task. Examples: speech plus programming symbols, speech plus mathematical symbols, EEG plus command keys, gaze plus a confirmation surface. Key count is a result where this mode is selected, not an input constant.

### 9.6 One schema, many exports

The same layout document generates keycap labels, SVG, PDF sticker sheet, HTML/CSS, soft keyboard, PWA, HID mapping, and reconfigurable-hardware commands. JSON Schema validated. Versioned.

Import and export: JSON, CSV, SVG, HTML, CSS, JavaScript, Unicode keyboard definitions where feasible, OS exporters as plugins. The optimizer does not depend on one OS.

---

## 10. Human model

An engineering model. Not a clinical instrument. Every parameter and every prediction carries an evidence label from §4.

### 10.1 Hand

Left and right independently. No symmetry assumption.

```
hand → wrist, palm, thumb, index, middle, ring, little
```

Configurable: segment lengths, joint limits (wrist flexion and extension, radial and ulnar deviation; thumb flexion, abduction, opposition; finger MCP, PIP, DIP), finger width, rest pose, hand breadth, palm size.

### 10.2 Anthropometry

Distributions, not one average hand. At least small, median, and large, both sides; optional sex-linked tables; arbitrary measured dimensions. Percentiles P05, P25, P50, P75, P95 where a dataset supplies them. A layout that wins only at P50 must not automatically win. Dataset plugins record source, citation, license, population, measurement method, sample size, and uncertainty. Missing data is not invented.

### 10.3 Reach

Per-finger reach from segment lengths, joint limits, posture, neighbor constraints, wrist, and palm. Not a circle radius. Classify each key: comfortable, reachable, marginal, strained, effectively unreachable. Inverse kinematics is a plugin. A Phase 1 approximation is allowed only if labeled heuristic.

### 10.4 Finger assignment is free

The QWERTY home-row map is one candidate. The optimizer may reassign fingers subject to joint and collision constraints. Score travel, independence, lateral displacement, extension, flexion, abduction, adduction, crossing, and simultaneous-key conflicts.

### 10.5 Motion, force, fatigue, error, chords

Motion-cost plugins may use joint displacement, angular displacement, path length, velocity, acceleration, jerk, extension, abduction, and wrist displacement. Selectable metrics: Euclidean, Manhattan, weighted physical, finger-specific. Euclidean distance is a metric, not the human model.

Force: actuation, travel, bottom-out, release, repeat. Workload may be presses × force × travel. Nonlinear fatigue is optional and labeled.

Fatigue is an exposed function of repetition, force, displacement, posture, duration, and recovery. Multiple models. Not presented as physiologically definitive.

Motor-model plugins (Fitts, Hick–Hyman, steering, key-repeat) each record domain, assumptions, parameters, evidence, and limitations. Do not apply them outside the recorded domain.

Error estimates: neighbor misses, same-finger confusion, overreach, modifier errors, chord errors, accidental chording, repeats, layer-switch errors. Empirical datasets may replace the estimates. The objective vector includes expected effort and expected error cost.

For each chord: hands, fingers, simultaneous reach, timing, awkwardness, collision probability. Platform-specific modifier maps stay in the exporter.

### 10.6 Touch is a different body model

Touch targets, thumb arcs, and grip are not physical-keyboard biomechanics. Touch layouts are optimized with a touch model, from the same layout schema.

### 10.7 Population, sensitivity, uncertainty

Serious runs report mean, median, worst percentile, and variance across the configured hand population. Sensitivity at ±10%, ±20%, and ±30% on declared important parameters. If two layouts exchange rank under that sweep, report `OPTIMIZATION INSTABILITY` and do not declare a universal optimum.

Validation against QWERTY, Dvorak, and Colemak must be allowed to disagree with published ergonomic findings. Disagreements are reported.

Prohibited wording: “this keyboard prevents RSI.” Permitted wording: “Under model X and assumptions Y, predicted wrist deviation / finger workload is Z.”

---

## 11. Optimization

Algorithms are plugins. Required set: Monte Carlo, simulated annealing (temperature, cooling, mutation, swap, multi-symbol move, restart), hill climbing, genetic or evolutionary search. The architecture must allow tabu, beam, hybrids, and a user-defined optimizer. Every run stores seed, config, data provenance, model parameters, constraints, and weights, and replays from that record.

### 11.1 Objective vector

Stored on every run. Weighted scalar optimization is optional and runs only with user-supplied weights. Pareto analysis remains supported. There is no implicit universal optimum.

Minimum objectives:

- linguistic efficiency
- programming-workload efficiency
- mathematical-workload efficiency
- physical travel
- joint movement
- finger load
- hand load and imbalance
- wrist deviation
- modifier cost
- layer cost
- error
- fatigue
- population robustness
- manufacturability
- keyboard size
- coverage and missing characters
- dead-key cost
- sequence cost
- modality-switch cost
- reconfiguration cost
- learning or cognitive cost, where a model exists and is labeled

A prose optimum need not equal a programming, mathematics, shell, or office optimum.

### 11.2 Manufacturability

For generated hardware, report key size, spacing, switch footprint, PCB feasibility, wiring complexity, enclosure, thumb-cluster feasibility, and standard keycap compatibility. Experimental layouts may violate bounds. Violations are reported. Configurable bounds: minimum spacing, maximum width and depth, manufacturing grid, standard keycap sizes.

---

## 12. Baseline comparison

Every serious optimization experiment compares the candidate with at least:

- QWERTY on the chosen geometry
- Dvorak
- Colemak
- a conventional touch keyboard, when the embodiment is touch
- any user-supplied layout

The report shows, for each objective in the vector:

- baseline value
- candidate value
- absolute difference
- relative difference
- trade-off against other objectives
- uncertainty or evidence label
- population robustness, including whether rank changes across percentiles

`optimized layout score = X` alone is a failed report.

---

## 13. User model

Optional. Profile may include preferred modalities, dominant hand, measured hand, languages, scripts, workload profiles, applications, and adapter accuracy estimates. Learning from keystrokes, corrections, speech corrections, gaze, BCI confidence, completion time, and fatigue proxies is allowed only if transparent and reversible. Personalization is never required.

Context (prose vs a programming workload vs mathematics vs shell) may suggest a surface. Suggestion is the default.

---

## 14. PWA, soft keyboard, HID

Separation stays explicit:

```
PWA virtual keyboard → local or mobile agent → Bluetooth HID or OS input → host
```

| Layer | Responsibility | Non-responsibility |
|---|---|---|
| PWA | Render the canonical layout, touch targets, layers, offline cache of layouts and derived statistics, import/export, accessibility, test area | Claiming to be a HID device |
| Agent | Hold platform permission, speak the PWA protocol, inject input where the OS allows | Owning layout semantics |
| HID / OS | Transport to the host | Being available on every mobile browser |

Do not claim that a browser alone can universally implement Bluetooth HID. Platform limits for Android, Linux, Windows, macOS, and iOS/iPadOS are documented in the agent interface, not papered over.

Soft keyboard requirements: generated only from the canonical layout; responsive desktop, tablet, and phone; touch targets sized for the touch model; accessibility; layer highlight; language and script switch; long-press alternatives; dead-key and compose; copy and paste; test area; typing statistics. A URL may name a layout, for example `/pwa?language=kn&layout=optimized-001`.

PWA requirements: installable, offline, service worker, local layout storage, no mandatory server.

---

## 15. Visualization

Required, in JavaScript (SVG or Canvas): frequency histogram, cumulative curve, character heatmap, keyboard heatmap, finger load, hand load, distance, modifier use, programming-symbol accessibility, before/after, existing vs optimized, Pareto frontier, geometry, reach class.

Sequence playback is required once a timeline of resolved actions exists.

A browser 3D view (geometry, hand, reach, path, joint motion) is a research-extension requirement. It is not a gate on Phase 1. If absent, the 2D views above still are.

Interactive designer: drag symbols between keys, evaluate, compare with the optimized candidate. Expert constraints the statistics cannot see are in scope.

---

## 16. Experiments and reproducibility

An experiment is the stored tuple:

`corpus + population + geometry + optimizer + weights + constraints + seed + modality policy`

Every result replays from that tuple plus the recorded software version.

Record: corpus source, license, checksum, normalization, language, script, geometry, baseline, optimizer, parameters, full objective vector, constraints, population, model version, evidence labels, seed, software version, timestamp.

---

## 17. Plugin boundaries

Must be plugins, not core conditionals:

- corpus provider
- script segmenter
- workload counter
- keyboard geometry
- keyboard layout
- objective
- optimizer
- hand and anthropometry dataset
- reach and kinematics
- fatigue
- error model
- motor model
- modality adapter and decoder
- fusion policy
- platform exporter
- visualization

Adding a language, script, layout, workload profile, or modality must not require editing the semantic core.

---

## 18. Privacy and handling of sensitive input

Modest requirements. Not a full security architecture.

The system may observe microphone audio, gaze, EEG, EMG, typing, and body measurements. Therefore:

- acquisition requires an explicit, recorded consent step per modality before the adapter opens a device or stream
- local processing is the default; network upload of raw modality streams is off unless the user turns it on for a named destination
- raw biometric and raw audio are not persisted by default
- retention of any raw stream is configurable and defaults to off
- derived statistics and layout files are separable from raw streams
- provenance on exported events states adapter id and whether raw samples were retained
- the event log used for replay may store modality events and HIR, not raw samples, unless retention was enabled
- adapters are untrusted plugins: the core accepts them only through the modality-event schema, and a failed schema validation does not enter fusion
- event integrity for replay means the log is hashed into the experiment record; this is tamper-evidence for reproducibility, not a claim of end-to-end cryptographic protocol design

---

## 19. Acceptance criteria

These are properties of the finished architecture and of the phase that claims them. A later phase does not excuse a missing interface in an earlier one.

| Id | Criterion | Claiming phase |
|---|---|---|
| A1 | A real corpus is discovered or loaded, analyzed, and used to optimize a layout | 1 |
| A2 | A candidate that improves prose score by burying a protected symbol is rejected as invalid | 1 |
| A3 | Small, median, and large hand settings can change reach class or rank | 1 baseline; 2 full |
| A4 | Same config and seed reproduce the same candidate and the same objective vector | 1 |
| A5 | Two modalities fuse through HIR stages 0–3, replayably, with parents retained | 3 |
| A6 | The same layout document generates a functioning soft keyboard | 4 |
| A7 | The same layout generates JSON and a human-readable sticker or SVG | 1 for JSON and SVG; 4 for PWA packaging |
| A8 | A switching-cost setting exists under which a stable layout beats a constantly changing one | 5 |
| A9 | A new modality adapter can emit schema-valid events without a core change | 0 interface; 3 demonstration |
| A10 | A serious run reports baselines, deltas, trade-offs, and population notes, not a single score | 1 |
| A11 | Physical reconfiguration commands are not sent unless authorization is recorded | 5 |
| A12 | No report uses a medical-outcome claim | all |

---

## 20. Documentation set

README, ARCHITECTURE.md, REQUIREMENTS_V2.md, CORPUS.md, OPTIMIZATION.md, KEYBOARD_SCHEMA.md, HIR.md, BIOMECHANICS.md, PROGRAMMING_WORKLOAD.md, MODALITIES.md, PWA.md, BLUETOOTH_AGENT.md, RECONFIGURATION.md, PLUGINS.md, PRIVACY.md, LICENSE.md, CONTRIBUTING.md.

OPTIMIZATION.md documents the objective vector, hard constraints, and algorithms with formulas. BIOMECHANICS.md documents models, evidence labels, and limitations.

---

## 21. Technology constraints

TypeScript. Node.js, browser, PWA, Web Workers. WebAssembly and GPU only behind adapters. No Python runtime dependency. Native code only through optional adapters. The reference path stays JS/TS.

Package split, as folders rather than a promise of published packages on day one:

`core  corpus  unicode  workload  keyboard  geometry  anthropometry  biomechanics  kinematics  motor  fatigue  error  optimizer  multiobjective  modalities  fusion  hir  visualization  pwa  hid-agent  exporters  datasets  experiments  tests`

---

## 22. Implementation phases

Phases are sequence, not scope reduction. Each phase leaves the next phase’s interfaces in place.

### Phase 0 — Contract and schemas

HIR stages, layout schema, geometry schema, experiment schema, cost-ontology tags, plugin interfaces, fixture corpora, schema tests.

### Phase 1 — Keyboard research core

Corpus discovery, cache, Unicode and grapheme analysis, workload profiles and protected-symbol hard constraint, baseline layouts, geometry separated from assignment, heuristic hand model with evidence labels, Monte Carlo and simulated annealing, objective vector, baseline comparison report, reproducibility. JSON and SVG export. Example workload configs for the languages in §7.7.

### Phase 2 — Human model depth

Anthropometry distributions, reach classification beyond the heuristic, population analysis, fatigue and error models, sensitivity, Pareto, 2D reach views. 3D playback may land here if it does not block Phase 1.

### Phase 3 — Human input spine

Modality adapters and simulators, temporal fusion, multimodal fusion, commit and correction, speech mock, gaze, gesture, touch, switch. Acceptance A5 and A9.

### Phase 4 — Alternative embodiments

PWA, HID agent protocol and a non-claiming stub, partial keyboard, voice-primary exception surface, touch model, accessibility configurations, sticker PDF.

### Phase 5 — Dynamic embodiment

`K(t)`, switching-cost model, authorization gate, actuator-neutral API, simulated moving-key board, hardware integration interface. Acceptance A8 and A11.

Genetic search, OS exporters, and the interactive designer attach to Phase 1–2 without waiting for Phase 5.

---

## 23. Carried-forward resolutions

| Tension | Resolution |
|---|---|
| Keyboard-centric reading vs input spine | HIR is the core. Keyboard Lab is a subsystem. |
| “Do not build a toy” vs phased delivery | Interfaces for deferred bodies exist in Phase 0. Bodies land in the named phase. |
| Euclidean distance vs joint model | Distance is a selectable metric. Joint cost is a separate objective. |
| One score vs Pareto | The vector is always stored. A scalar exists only with user weights. |
| 104-key habit vs voice-first | In subset mode, key count is a result. |
| Moving keys vs sticker user | Both are endpoints of one schema. Physical motion requires opt-in. |
| Browser HID optimism | Protocol yes. Universal browser HID no. |
| Indic examples vs global core | Examples are data. The core has no script switch. |
| Workload tokens vs compiler IR | Tokens are input-workload data. This project does not implement languages. |

---

## 24. V1 → V2 change log

Substantive changes only. Detail and impact are in `V1_TO_V2_CHANGELOG.md`.

| V1 location | Class | V2 treatment |
|---|---|---|
| §0.3 non-goals | Strengthen | Added explicit exclusions for language implementation, compiler, Hindawi, Romenagri, ILM, OS replacement, cognitive architecture |
| §1 “compiler token” | Remove | Invalid for this scope. Replaced by “workload token” supplied externally or by a plugin |
| §1 “computational interpreter” | Correct | Renamed to application binding. UMHIA does not execute commands |
| §2 single HIR event | Strengthen | Four stages: modality, candidate, composed, resolved |
| §2.2 fusion paragraph | Strengthen | Windows, ordering, conflict, correction, cancel, commit, replay |
| §8 protected symbols | Strengthen | Hard constraint vs soft penalty vs objective vs preference |
| §14 objectives | Retain | Vector mandatory; scalar optional |
| §17 phases | Correct | Re-sequenced into Phases 0–5 without deleting deliverables |
| §3D visualization | Move | Research extension; not a Phase 1 gate |
| (absent) | Strengthen | Cost ontology §4; baseline comparison §12; privacy §18; acceptance table §19 |
| Difficult V1 requirements (population, Layer B/C, `K(t)`, BCI schema, sticker endpoint) | Retain | Unchanged in obligation |


Normative patch: see V2_0_1_CORRECTIONS.md (version 0.2.1).
