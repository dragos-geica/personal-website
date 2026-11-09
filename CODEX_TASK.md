# Stage 1 — Pixel-faithful static homepage

# Non-negotiable design constraints

The images in `references/` are **visual targets**, not page backgrounds. Rebuild using real HTML, CSS, SVG and components. Respect the original light near-white/lavender theme and spare pastel highlights, editorial serif titles, restrained sans-serif UI, central `Me` node, eight main category nodes, connection verb pills, subtle fine curved edges, and ample negative space. No dark starfields or intense neon. Never invent personal photos or achievements; use unmistakable editable placeholders.

Use Astro + TypeScript + Tailwind CSS and a small React island for the graph, unless an existing repository has a clear established alternative. Use editable typed graph data. Do not deploy, purchase services, or publish personal data. Prefer deterministic responsive layouts over randomized physics. Use accessible buttons, keyboard actions, focus indicators, `prefers-reduced-motion`, and mobile fallbacks.

## Objective
Build the real runnable foundation and **match the initial homepage screenshot**. The graph should look finished, but do NOT implement popping/branch expansions or detail panels in this stage.

## Must deliver
- Astro project, TypeScript, Tailwind, project scripts and README.
- Header with DG brand and navigation Home / Projects / Research / About / CV; no dead fake toggle.
- Near-white lavender layout, subtle bottom wave pattern, editorial type hierarchy.
- Central circular `Me` node with **obvious portrait placeholder** (not a fabricated likeness).
- Eight semantically labeled radial nodes: Academics, Research, Projects, Data & Tools, Music Taste, Reading, Travel, Other Interests.
- Eight SVG curved connectors and relationship pills: studies, investigates, works_on, uses, listens_to, reads, explores, curious_about.
- Typed `src/data/graph.ts`, reusable graph components, deterministic node positions.
- Responsive mobile design (do not scale the entire graph down); keyboard-readable accessible nodes.
- Establish `/`, and basic nonempty placeholder routes or reliable nav targets for Projects, Research, About, CV.
- Only minimal hover/focus transitions; **no pulses, shakes, bursts, or content expansions yet**.

## Verification / stop point
Run install, dev/build and available lint/type checks. If browser screenshots are possible compare desktop 1440×900 against `references/01-home-light.png` and check mobile 390×844; correct obvious differences. Ensure no overflow, errors, inaccessible controls or dead nav links. **Stop after Stage 1**. Do NOT start Stage 2 or Stage 3.

## Final report
Give files changed, commands run with results, screenshot comparison notes, unresolved design differences, and exact next-step command. Commit the changes in a named Git commit if Git is configured; otherwise tell me the exact commit command.

## How to start Codex

Open your **existing website repository** (for Stage 1, an empty folder is fine). Place this task file and its `references/` images in the project, then tell Codex:

> Read `CODEX_TASK.md` and inspect every image in `references/`. Complete **only this stage**. Run the checks specified, report results, and stop. Preserve all previous stages.
