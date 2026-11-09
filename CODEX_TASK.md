# Stage 2 — Pulses, pop animation, and expandable branches

# Non-negotiable design constraints

The images in `references/` are **visual targets**, not page backgrounds. Rebuild using real HTML, CSS, SVG and components. Respect the original light near-white/lavender theme and spare pastel highlights, editorial serif titles, restrained sans-serif UI, central `Me` node, eight main category nodes, connection verb pills, subtle fine curved edges, and ample negative space. No dark starfields or intense neon. Never invent personal photos or achievements; use unmistakable editable placeholders.

Use Astro + TypeScript + Tailwind CSS and a small React island for the graph, unless an existing repository has a clear established alternative. Use editable typed graph data. Do not deploy, purchase services, or publish personal data. Prefer deterministic responsive layouts over randomized physics. Use accessible buttons, keyboard actions, focus indicators, `prefers-reduced-motion`, and mobile fallbacks.

## Prerequisite
Stage 1 must already be complete in this repo. Inspect existing code first, **preserve working page structure and theme**.

## Objective
Implement the actual **graph interactions** shown in screenshot 2, WITHOUT building project detail content or full project routes in this stage.

## Must deliver
- Subtle center-to-node light pulse traveling over SVG edges every ~3–6 s with at most 1–2 sparks per edge. Never flashy.
- Gentle node breathing (~1.00 to 1.015), hover and focus emphasis (~1.03).
- Click `Projects`: bright traveling pulse, 1.06–1.10 scale anticipation, damped 1–3 px jitter, single quick pop/halo with small particles, staggered reveal of four children (AirBox Bootcamp, EcoCrafting, Neo4j Demo, Data Visualizations). Keep Projects visible as the parent hub.
- Use timing guidelines: onset 0–100ms; anticipation 100–300ms; burst 300–550ms; children appear 450–950ms. Treat these as tunable.
- Support equivalent expanding/collapsing behavior for the other seven categories using **clearly labeled editable placeholder children**, not invented facts.
- Click child gives a visible `selected` state and an **honest temporary selected-label UI** only. Do not implement detail panels or content routes yet; this comes in Stage 3.
- Collapse via parent click, close control, and Escape; avoid stuck animation state when clicking rapidly. Sensible ARIA expanded states and keyboard operation.
- Reduced-motion mode disables sparks, shakes, and particles but keeps immediate functional expansion.
- State transitions are unit/testable and animation not used as sole signal.

## Verification / stop point
Build/lint/typecheck and manually test: idle -> expand Projects -> select AirBox -> collapse -> repeat; expand another category; mobile; keyboard; reduced motion; rapid double click. Visually compare expanded state to `references/02-projects-burst-light.png`, keeping Stage 1 styling. **Stop after Stage 2. Do not build detail panels, case-study pages, or deploy.**

## Final report
Summarize behavior implemented, test results, visual differences, any known bugs, and Git checkpoint.

## How to start Codex

Open your **existing website repository** (for Stage 1, an empty folder is fine). Place this task file and its `references/` images in the project, then tell Codex:

> Read `CODEX_TASK.md` and inspect every image in `references/`. Complete **only this stage**. Run the checks specified, report results, and stop. Preserve all previous stages.
