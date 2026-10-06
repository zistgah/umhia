# V2.0.1 corrections

**Status:** Precision patch on REQUIREMENTS_V2.md 0.2.0. Not a new architecture.
**Date:** 2026-10-06
**Copyright:** © 2026 Abhishek Choudhary

These eight edits, plus three smaller clarifications from the same review, are normative. They do not reopen scope.

## 1. Intent, content, target, action

`intent` is only the semantic category: INSERT, DELETE, NAVIGATE, SELECT, CONFIRM, CANCEL, CORRECT, COMPOSE, COMMAND.

`content` is inserted linguistic or computational material.

`target` is the object or reference acted on.

`action` is an opaque command name such as `DELETE_WORD` or `NEXT`. It is not a second intent, and UMHIA does not execute it.

`value` remains a legacy display field equal to content, action, or target. Adapters must not encode the same act only in `value`.

## 2. Provenance roles

A provenance record distinguishes physical source, acquisition device, adapter, decoder, simulator flag, and fusion engine. `source` on the envelope remains modality plus adapter plus decoder. Provenance holds the rest, so an EEG headset is not stored as if it were the decoder.

## 3. Confidence

`confidence` is `{ value, kind, comparable }`. Kinds: calibrated-probability, model-confidence, heuristic, likelihood, normalized-score. A value in 0..1 is not a probability unless kind is calibrated-probability. Fusion may treat two confidences as commensurate only when both are calibrated, or when the policy supplies an explicit map. Otherwise it keeps them and records a warning.

## 4. Clock domains

Each event has event timestamp, source clock name, synchronized timestamp, clock offset, sync uncertainty in milliseconds, and a sequence number. Window membership adds the uncertainty. ±30 ms is not treated as ±5 ms.

## 5. Corpus providers in Phase 1

Phase 1 requires the provider interface, the fixture provider, and one live provider (Wikipedia). The catalog list is the set of allowed plugin names. It is not a requirement to implement every catalog.

## 6. Platform exporters

Modifier semantics are abstract, then translated by platform-specific layout exporters. The word compiler is not used for that step.

## 7. Canonical layout normal form

Layout identity ignores key order and layer-object order. `canonicalLayout` plus a deterministic hash is the identity. Equivalent encodings must not be treated as different candidates. The hash is an identity hash, not a cryptographic commitment.

## 8. Lineage and motion authorization

Every generated layout stores `layoutId`, `layoutVersion`, `experimentId`, `parentLayoutId`, `generator`, and `seed`.

Physical authorization is per device and per session, expires, and is revocable. A manual stop overrides an automatic command immediately.

## Also clarified

- Identifier-character patterns are a metric family: mean length, camelCase transition rate, snake_case rate, digit rate, internal bigrams.
- Touch model includes grip (one-thumb, two-thumb, index), orientation, device width, and holding hand. It is not the physical-key biomechanical model.
- Consent applies to live sensitive acquisition. Test mode and fixtures do not open a device and do not require biometric consent.
- Unicode processing is its own module: normalization, grapheme segmentation, combining marks, direction, ZWJ, ZWNJ, variation selectors.

No V2 obligation was removed.
