# DG Personal Knowledge Graph

An Astro portfolio with a React knowledge graph, expandable branches, project previews, and a static AirBox Bootcamp case study.

## Run locally

On the Mac where this project was built, open Terminal and run:

```sh
cd "/Users/dragosgeica/Documents/My Website"
export PATH="$PWD/.local-tools/node-v24.16.0-darwin-arm64/bin:$PATH"
npm run dev
```

Open [http://127.0.0.1:4321/](http://127.0.0.1:4321/) or use the address Astro prints if that port is busy. Keep Terminal open during the preview. Press **Control-C** to stop the server.

For a fresh checkout, install Node.js 24 LTS (or 22.12+) with npm and run `npm ci` from the project folder. The bundled local runtime and dependencies are Git-ignored.

## Verify and preview the production build

```sh
npm test
npm run check
npm run build
npm run preview
```

Open the address printed by `npm run preview`. The build output is in `dist/`.

## Edit content

- `src/data/projects.ts` is the source for project titles, summaries, images, metrics, case-study sections, and links. Keep project slugs stable so shared URLs continue to work. Remove `placeholder: true` after replacing a placeholder entry with verified content.
- AirBox uses the facts in the Stage 3 brief. Its photo is a labeled placeholder. Add the public dataset URL to `links` once you have the verified address.
- To add an image, put a locally optimized WebP or AVIF file under `public/` and replace the image placeholder with its site-relative `src`, descriptive `alt`, and intrinsic `width` and `height`. The preview lazy-loads the image below the graph. Keep actual project photos out of the reference folder.
- `src/data/graph.ts` holds graph positions, relationship labels, and the non-project child labels. Project child labels come from the project data.
- `src/pages/[section].astro` holds the Projects directory and the Research, About, and CV placeholders. The current placeholders carry a `noindex` directive.
- Select a category to focus its branch, then choose a child to open its section. Use **Preview mode** in a branch for the original inline content panel. Browser Back and Forward restore the previous route and graph level.
- `src/scripts/node-navigation.ts` handles the SVG outline and label shared by the graph and section heading. Existing Astro URLs remain directly addressable.
- Opening and closing a category follows the same sequence for clicks and browser history. Reduced motion skips the graph sweep and title morph while keeping navigation and focus working.

## Deployment guidance

When the site is ready to publish, set `site` in `astro.config.mjs` to your chosen public origin to emit canonical URLs. Run `npm run build` and use `dist/` as the static host's output directory. Check the nested project URLs, direct links to graph selections, and placeholder indexing before making the site public.
