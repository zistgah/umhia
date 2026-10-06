# UMHIA Keyboard Lab

Copyright © 2026 Abhishek Choudhary.

Universal Multimodal Human Input Architecture. Keyboard Lab is the principal embodiment, not the owner of the semantic core.

License: GNU GPL v3 or later. See `LICENSE`.

## What this repository is

A JavaScript system for human-to-computing input. Phase 1 runs without a build step, so GitHub Pages can host it.

```
human intent → modality event → candidate → fusion → resolved action → application binding
```

Programming languages are workloads. This project does not implement a compiler, Hindawi, Romenagri, ILM, or an operating-system input stack.

## GitHub Pages

1. Push this directory as the repository root.
2. Settings → Pages → Deploy from branch → `/` (root), not `/docs`.
3. Open the published URL. The soft keyboard, fixture analysis, and export work offline after the first load.
4. Wikipedia search needs network and is optional. Article text is not stored in the repo.

No server is required. `npm start` is only a local static server.

## Commands

```
npm test
node cli/keyboardlab.js optimize --language kannada --seed 7
node cli/keyboardlab.js export --language greek --format svg
```

## Phase 1 surface

- Fixture corpora for the workload configurations named in the requirements, original text, CC0.
- Wikipedia provider. Other corpus catalogs are named plugins, not implied implementations.
- Grapheme analysis, raw and weighted frequency.
- QWERTY, Dvorak, Colemak baselines and objective-vector comparison.
- Annealing and Monte Carlo assignment. Protected symbols are a hard access floor.
- Heuristic hand model, small/median/large. Labeled heuristic. Not a medical claim.
- Canonical layout hash and lineage (`layoutId`, parent, experiment, seed).
- HIR 2.0.1: intent, content, target, action; confidence kind; clock uncertainty; provenance roles.
- Fusion demo, revocable motion authorization, sticker SVG.

## Docs

- `docs/REQUIREMENTS_V2.md`
- `docs/V1_TO_V2_CHANGELOG.md`
- `docs/V2_0_1_CORRECTIONS.md`
