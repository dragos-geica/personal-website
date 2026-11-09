# Stage 3 — Content panel, project pages, and final polish

# Non-negotiable design constraints

The images in `references/` are **visual targets**, not page backgrounds. Rebuild using real HTML, CSS, SVG and components. Respect the original light near-white/lavender theme and spare pastel highlights, editorial serif titles, restrained sans-serif UI, central `Me` node, eight main category nodes, connection verb pills, subtle fine curved edges, and ample negative space. No dark starfields or intense neon. Never invent personal photos or achievements; use unmistakable editable placeholders.

Use Astro + TypeScript + Tailwind CSS and a small React island for the graph, unless an existing repository has a clear established alternative. Use editable typed graph data. Do not deploy, purchase services, or publish personal data. Prefer deterministic responsive layouts over randomized physics. Use accessible buttons, keyboard actions, focus indicators, `prefers-reduced-motion`, and mobile fallbacks.

## Prerequisite
Stages 1 and 2 are complete. Inspect the current repo; **do not rebuild or replace the graph**.

## Objective
Implement the content-reveal state from screenshot 3, finish internal routes and improve polish while retaining the graph and animations.

## Must deliver
- Selecting `AirBox Bootcamp` highlights that child and elegantly reveals a large rounded panel **below the graph**; maintain graph context above. Scroll smoothly when motion allowed.
- Panel follows mockup 3: image placeholder left (unless genuine provided), Project eyebrow + serif title + accurate summary right, metric cards, `View Case Study` CTA.
- Accurate AirBox facts: $10,000 Projects for Peace grant; 120+ **registrants**, 60 online-phase completers, 12 finalists who built and deployed monitors, public air-quality dataset. Do NOT imply 120+ graduated or participated in person.
- Click CTA -> real internal route `/projects/airbox-bootcamp` with meaningful factual content and clear return/back path.
- Add real, editable routes/placeholders for EcoCrafting, Neo4j Demo, Data Visualizations, Research, About, CV; never invent publications, outcomes, songs, favorite books, images or links.
- Other expanded categories should lead to honest informational previews or placeholder routes, not dead-end buttons.
- Handle browser back and forward so selected content and graph state behave sensibly; maintain focus.
- Add metadata/SEO, accessibility checks, small-screen responsive content layout, image optimization, performance review, project README documentation.
- Visual comparison at 1440×900 and 390×844 across all three mockup states; resolve noticeable spacing/colors/typography differences without placing screenshots on the page.

## Verification / stop point
Build/lint/typecheck; check all interactive paths including Home -> Projects -> AirBox -> detail -> back -> collapse; other categories, mobile, keyboard, reduced motion, empty placeholders, broken links, no horizontal overflow, and no console errors. **Stop after Stage 3 and do not deploy unless requested.**

## Final report
Provide exact commands, full completion checklist, actual versus placeholder content, remaining limitations, and deployment guidance only (no deployment). Commit changes if possible.

## How to start Codex

Open your **existing website repository** (for Stage 1, an empty folder is fine). Place this task file and its `references/` images in the project, then tell Codex:

> Read `CODEX_TASK.md` and inspect every image in `references/`. Complete **only this stage**. Run the checks specified, report results, and stop. Preserve all previous stages.
