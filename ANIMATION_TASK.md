# Animation polish & bug fixes

You are working in an existing Astro 6 + React 19 + Tailwind 4 personal website (a "knowledge graph" homepage). **Do not rebuild or restructure the graph.** Keep all routes, data, history/Back/Forward behaviour, focus handling and `prefers-reduced-motion` support working. Respect the design brief in `CODEX_TASK.md` (light near-white/lavender theme, spare pastel highlights, restrained motion).

Relevant files:
- `src/scripts/branch-motion.ts` – sweep ring + hub travel when a category opens
- `src/scripts/branch-return-motion.ts` – closing a category (reverse)
- `src/scripts/node-navigation.ts` – node → page title morph and page fade
- `src/scripts/animation-frames.ts` – rAF helper
- `src/components/KnowledgeGraph.tsx`, `GraphBranch.tsx`, `ContentPanel.tsx`
- `src/styles/global.css` – keyframes, reveal timing variables, reduced-motion rules

The dev server is running at http://127.0.0.1:4321/ with hot reload; check every change there at 1440×900 and 390×844, in light and dark themes.

## 1. Bugs to fix first

1. **Sweep ring is hard-clipped and too loud.** `.branch-sweep-ring` is sized to the graph's bounding box, so the ring shows a straight cut edge where it meets the box (visible on desktop and in dark mode). It's also a saturated blue (`#2466ee` mix) that clashes with the pastel brief. Fix the clipping (soft-fade the ring at the edges with a mask, or let it extend past the graph box without covering the hero text), and make the band thinner and pastel, derived from theme tokens so it works in light and dark.
2. **Animations cancel on mobile browser chrome changes.** `sweepBranch` aborts on any `resize` and any `scroll`; `node-navigation.ts` calls `settleMorph` on every `resize`. On iOS Safari, the address bar showing/hiding fires resize events, so animations will cut off mid-way. Only cancel when the *width* changes (or the change exceeds a meaningful threshold), and ignore scroll changes that the animation itself caused.
3. **Mobile page jump when opening a category.** `moveBranchHub` does `window.scrollBy({ behavior: 'instant' })` under 880px, so the page snaps between the sweep and the reveal and briefly shows an empty branch box. Make this smooth (fold the scroll into the hub's travel, or scroll smoothly before/while the sweep runs) so there is no visible jump.
4. **Hover on category nodes snaps.** `.category-node:hover` sets `animation: none` + `scale: 1.03`, but `scale` has no transition, and on mouse-out the `node-breathe` animation restarts from 0%. Add a `scale` transition and avoid the restart snap (e.g. breathe on an inner element/wrapper, or use a CSS variable so hover composes with breathing).
5. **Hover state lands on the wrong node after opening.** After the hub travels to centre, a child node ends up under the cursor and shows its hover state immediately. Suppress hover styles on children until the reveal finishes (e.g. `pointer-events: none` during `[data-branch-reveal]`, then re-enable).
6. **Input is locked for too long during the reveal.** Back and child nodes are `visibility: hidden` for ~1.5 s and clicks fall through. After the shortening in section 2 this should mostly go away. Also make sure the Back node is clickable as soon as it is visible.
7. **Frame drops during the sweep.** I measured 15 frames over 20 ms (max 50 ms) while opening a category. Likely causes: the `mask-image: radial-gradient(...)` on the whole `.knowledge-graph` being repainted every frame, plus `filter: drop-shadow` on the `.edge-spark` paths. Pause/hide sparks during the sweep (already partly done), and consider animating a transform-scaled element instead of rewriting gradient stop variables every frame. Check performance in Chrome DevTools before and after.

## 2. Animation improvements

1. **Shorten category open.** It currently takes about 2.6 s to become usable (440 ms sweep + 620 ms hub travel + about 260 ms per child, one after another + 280 ms edges). Target ~1–1.2 s total: overlap the sweep and hub travel, and reveal children in parallel with a ~60–80 ms stagger.
2. **Fix the reveal order.** Edges are currently drawn *after* all nodes appear, so children float disconnected. Draw each edge from the hub first, then pop its node at the end of the line.
3. **Animate the preview panel.** `ContentPanel` appears instantly and disappears instantly. Add a short enter (fade + ~8px rise, ~250 ms) and a matching exit when the selection is cleared (via Back/close or browser history). Keep the smooth scroll-to-panel.
4. **Reduce the blank gap when opening a project page.** While the title morphs (~440 ms leave + ~850 ms travel), the screen is empty. Start fading in the destination content while the title is still settling (e.g. at ~60% of the morph), and tighten durations.
5. **Centralise timing.** Durations are scattered (440, 620, 145/115, 280, 850, 720, 240 in TS; 350 ms fade, 320 ms opacity in CSS — note the CSS fade is 350 ms but the JS waits 440 ms). Define them once (CSS custom properties read by the TS, or a shared `motion.ts` that also sets the CSS variables) along with shared easing curves.
6. **Mobile branch edges.** On ≤880px, the lines to the 4th/5th children loop around the outside of the branch box. Route them more cleanly (e.g. straight down from the hub with short bends).
7. Non-animation bug spotted along the way: at 1200px wide, the "Data Visualizations" child label breaks as "Visualization / s". Prevent mid-word breaks (`overflow-wrap: normal`, `hyphens: manual`, or slightly smaller text/wider node).

## Constraints
- Reduced motion: every new animation must be skipped or replaced with an instant change under `prefers-reduced-motion: reduce`, and switching the preference mid-animation must still clean up correctly.
- Keep the existing abort/cleanup guarantees: after any sequence (rapid double-clicks, Escape during reveal, Back node during reveal, browser Back/Forward mid-animation, resize mid-sweep), there must be no leftover `.branch-sweep-overlay`, no `data-branch-sweeping`/`data-branch-revealing`/`data-morph-*` attributes, no hidden category nodes, and focus must land on the expected element.
- No new dependencies unless clearly justified.

## Verification (report results)
- `npm test`, `npm run check`, `npm run build` all pass. Add/extend tests where logic changes (e.g. timing helpers, resize threshold).
- Walk through manually at 1440×900 and 390×844, light and dark: Home → Projects → Preview mode → AirBox → View Case Study → browser Back → Back → close; open/close each other category; Escape during reveal; double-click a category; reduced motion on.
- No console errors, no horizontal overflow.
- Report the before/after open duration and any frame-timing numbers.
- Commit with a clear message when done. Do not deploy.
