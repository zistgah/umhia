# V1 → V2 changelog

**From:** REQUIREMENTS.md 0.1.0-requirements
**To:** REQUIREMENTS_V2.md 0.2.0-requirements
**Date:** 2026-10-06

V2 revises V1. It does not replace the project. Nothing below was dropped because it was difficult.

Classes: Retain, Clarify, Strengthen, Correct, Merge, Move, Defer, Remove.

---

## 1. Scope boundary

| | |
|---|---|
| Section | V1 §0.3 non-goals; V1 §1 “compiler token”; V1 §2.1 “interpreters” |
| V1 | Non-goals covered Indic-only design, browser HID, clinical claims, fake physiology, corpus redistribution, single optimum, mandatory moving hardware. A table row distinguished “compiler token” from “programming token.” Downstream of HIR was a “computational / programming interpreter.” |
| V2 | Those non-goals stay. Added exclusions: no language implementation, no compiler, no compiler IR, no Hindawi, no Romenagri, no ILM, no OS input-stack replacement, no cognitive architecture. “Compiler token” removed. Programming units are workload tokens from a plugin or external data. The downstream stage is an application binding that delivers resolved actions. Command strings are opaque. |
| Reason | V1 wording could be read as authorization to specify parsers and language runtimes. The attached review forbade that drift. |
| Impact | Optimizer still consumes operator, delimiter, and token frequencies. It does not grow a compiler. |
| Behavior | Changed at the specification boundary. No V1 keyboard or corpus obligation removed. |

## 2. HIR stages

| | |
|---|---|
| Section | V1 §2 |
| V1 | One event shape. Adapters “emit HIR.” Applications consume HIR. |
| V2 | Four stages: modality event, candidate, composed event, resolved action. Envelope version `hir` 2.0.0. Applications consume resolved actions and may subscribe earlier for debug. |
| Reason | V1 contradicted itself: adapters emitted the canonical IR, while fusion was also supposed to create it. Split stages make conflict, cancel, and commit representable. |
| Impact | Schema is stricter. Keyboard, speech, gaze, and BCI examples from V1 still fit. |
| Behavior | Changed representation. Obligation to carry the V1 payload list is retained and extended with evidence and composition state. |

## 3. Fusion

| | |
|---|---|
| Section | V1 §2.2–2.3 |
| V1 | Timestamps, windows, early/late/intermediate fusion, four examples. |
| V2 | Adds ordering tie-break, clock-offset assumption, evidence pointers, conflict policy (no silent drop), correction, cancellation, commit, and replay from log + policy + seed. States that fusion is not a cognitive architecture. |
| Reason | V1 examples were not a deterministic resolution procedure. |
| Impact | Fusion plugins have a conformance target. |
| Behavior | Strengthened. Examples retained. |

## 4. Protected symbols

| | |
|---|---|
| Section | V1 §5 and §8 (computational preservation) |
| V1 | Hard constraints and soft penalties mentioned. Floor described as “inaccessible or excessively expensive.” |
| V2 | Access floor is layer depth, reach class, and chord cost. Violators are invalid and unranked. Soft penalties, objectives, and user preferences are separate roles. |
| Reason | “Excessively expensive” was not testable. |
| Impact | Acceptance A2 can fail a build. Prose-score improvement cannot buy a buried `{`. |
| Behavior | Strengthened. Symbol list retained. |

## 5. Cost ontology

| | |
|---|---|
| Section | Absent as a named section in V1. Pieces lived in the objective and constraint prose. |
| V1 | Objectives, penalties, and parameters were used without a type system. |
| V2 | New §4: objective, metric, hard constraint, soft constraint, penalty, preference, model parameter, uncertainty, observation, prediction. |
| Reason | Plugins could return incomparable numbers under one name. |
| Impact | Reports and plugin results must tag role and evidence label. |
| Behavior | Added. Does not replace the objective vector. |

## 6. Objective vector and Pareto

| | |
|---|---|
| Section | V1 §8 / optimization objectives |
| V1 | Vector listed. Pareto supported. Scalar available with weights. |
| V2 | Retained. Scalar is explicitly optional and must not be the only stored result. Learning/cognitive cost stays conditional on a labeled model. |
| Reason | Review asked that the vector not collapse. |
| Impact | None removed. |
| Behavior | Unchanged obligation. Clarified storage rule. |

## 7. Baseline comparison

| | |
|---|---|
| Section | V1 mentioned QWERTY, Dvorak, Colemak as validation. |
| V1 | Validation allowed disagreement with published findings. |
| V2 | New §12. Serious runs compare QWERTY, Dvorak, Colemak, touch where applicable, and user layouts. Report absolute and relative deltas, trade-offs, uncertainty, population rank. A lone score is a failed report. |
| Reason | V1 did not make the comparison table mandatory. |
| Impact | Experiment output schema grows. |
| Behavior | Strengthened. |

## 8. Human model

| | |
|---|---|
| Section | V1 §7 |
| V1 | Independent hands, joints, percentiles, reach classes, free finger assignment, force, fatigue, error, no RSI claim, evidence labels. |
| V2 | Retained. Euclidean distance demoted to a selectable metric in the same sentence as the joint model. Phase 1 kinematic approximation must be labeled heuristic. Sensitivity instability rule retained. |
| Reason | Review asked not to reduce biomechanics to distance and not to invent constants. |
| Impact | No parameter was given a fake clinical value. |
| Behavior | Unchanged obligation. Clarified labeling. |

## 9. Population robustness

| | |
|---|---|
| Section | V1 §7.8 |
| V1 | P05–P95, mean, median, worst percentile, variance. P50-only winner must not auto-win. |
| V2 | Retained and tied to acceptance A3 and to the baseline report. |
| Reason | Review asked to strengthen, not replace. |
| Impact | A single-hand result cannot be reported as the optimum. |
| Behavior | Strengthened reporting duty. Model itself unchanged. |

## 10. Dynamic keyboards

| | |
|---|---|
| Section | V1 §6.4 |
| V1 | `K(t)`, suggest-only default, no silent physical change, switching cost. |
| V2 | Retained. Authorization must be a recorded opt-in. Disruption added to switching cost. Acceptance A8 requires a setting where stability beats churn. Acceptance A11 forbids unsolicited physical commands. |
| Reason | “No silent change” needed a testable gate. |
| Impact | Actuator API unchanged. Callers must check authorization. |
| Behavior | Strengthened. |

## 11. Voice-first and key count

| | |
|---|---|
| Section | V1 §3.2 and §6.5 |
| V1 | Voice-first is primary. Subset objective may return a small surface. 104 is not the definition of a keyboard. |
| V2 | Retained. Key count is a result only in subset mode, so full-keyboard experiments are not forced to shrink. |
| Reason | Unqualified “key count is a result” would have fought fixed-geometry Layer A. |
| Impact | Layer A on ANSI-104 still legal. |
| Behavior | Clarified. Obligation retained. |

## 12. Corpus, scripts, tests

| | |
|---|---|
| Section | V1 §4 and §14 tests |
| V1 | Discovery, license, cache, normalization, n-grams, weighting, multilingual configs, adversarial Unicode tests. |
| V2 | Retained, including the language/script config list and the adversarial set. |
| Reason | Review said not to reduce this to Indic support and not to drop difficult corpus rules. |
| Impact | None. |
| Behavior | Retained. |

## 13. PWA and HID

| | |
|---|---|
| Section | V1 §10 |
| V1 | Three-layer split. No universal browser HID. |
| V2 | Same split, with a responsibility table for PWA, agent, and HID/OS. Platform limits stay documented rather than implemented around. |
| Reason | Review asked for explicit responsibilities. |
| Impact | No new HID claim. |
| Behavior | Clarified. Delivery moved to Phase 4; interface not deleted. |

## 14. Visualization

| | |
|---|---|
| Section | V1 §10.4 |
| V1 | 2D set required. 3D “where practical.” |
| V2 | 2D set and reach class remain required. 3D is a research extension and is not a Phase 1 gate. |
| Reason | Review allowed 3D to yield if it would block the optimizer. |
| Impact | Phase 1 can ship without WebGL. The 3D obligation remains on the architecture. |
| Behavior | Moved, not removed. |

## 15. Phases

| | |
|---|---|
| Section | V1 §17 |
| V1 | Phase 1 included corpus, optimizer, geometry mutation, population, PWA, HIR, speech mock, HID stub, CLI, UI. Phases 2–3 held genetics, 3D, EEG, moving keys. |
| V2 | Phase 0 schemas and interfaces. Phase 1 keyboard research core. Phase 2 human-model depth. Phase 3 input spine and fusion. Phase 4 PWA, HID, voice-primary, touch. Phase 5 `K(t)` and actuators. |
| Reason | V1 Phase 1 was too wide to be a coherent increment, which invited a toy cut. Re-sequencing keeps every deliverable. |
| Impact | First build does not have to open a microphone or claim HID. It does have to leave those interfaces in the schema set. |
| Behavior | Sequencing changed. Scope not reduced. |

## 16. Privacy

| | |
|---|---|
| Section | Absent in V1 beyond corpus licensing. |
| V1 | License and provenance for text. |
| V2 | New §18: per-modality consent, local default, no default raw biometric retention, schema-validated adapters, experiment-log hash. Explicitly not a full security architecture. |
| Reason | Gaze, EEG, EMG, and typing are in scope. |
| Impact | Adapters cannot persist raw streams by default. |
| Behavior | Added. |

## 17. Acceptance criteria

| | |
|---|---|
| Section | V1 had a test list, not acceptance ids. |
| V1 | Unicode, frequency, protected symbols, seed replay, import/export, PWA shape. |
| V2 | A1–A12 map keyboard, protected symbols, population, replay, fusion, PWA, export, switching cost, extensibility, baseline report, authorization, and medical wording to phases. |
| Reason | Review required formal acceptance, not only a test wishlist. |
| Impact | A phase cannot claim completion without its rows. |
| Behavior | Added. |

## 18. Explicit retains

The following V1 obligations are unchanged in force:

- modality peers and add-without-rewriting-core
- sticker and fixed-keyboard endpoints
- geometry independent of assignment
- Layers A, B, and C, including four-way comparison
- Monte Carlo, annealing, hill climbing, genetic search; room for tabu, beam, hybrids
- full objective vector
- left and right hands, joint limits, reach classes, free finger assignment
- evidence labels and the RSI-claim ban
- corpus license rejection and non-redistribution
- one layout schema for labels, soft keyboard, HID map, and actuator commands
- experiment tuple and seed replay

## 19. Removals

Only one removal: the “compiler token” type. It implied parser and compiler scope. Workload tokens cover the input-optimization need. No keyboard, corpus, biomechanical, fusion, or embodiment requirement was removed.
