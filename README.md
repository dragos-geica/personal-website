# DG Personal Knowledge Graph

An Astro portfolio with a React knowledge graph, expandable branches, and a page for every item.

**To edit text and photos, use the editor at `/admin` (Pages CMS); see [CONTENT_GUIDE.md](CONTENT_GUIDE.md).** Everything you write lives in the JSON files in `src/content/`.

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

- `src/content/*.json` hold every word and photo (home, about, research, cv, and one file per category); `src/content/site.ts` puts them together and drops blank fields. `.pages.yml` describes them to the editor. `src/data/projects.ts` adds URL slugs (made from titles) for project pages.
- AirBox uses the facts in the Stage 3 brief. Its photo is a labeled placeholder. Add the public dataset URL to `links` once you have the verified address.
- Photos go in `public/images/` and are referenced from the content files as `/images/…`. `npm test` checks that every referenced photo exists.
- `src/data/graph.ts` holds graph positions and line shapes only; labels come from the content files.
- `src/pages/[section].astro` holds the Projects directory and the Research, About, and CV placeholders. The current placeholders carry a `noindex` directive.
- Select a category to focus its branch, then choose a child to open its page. Browser Back and Forward restore the previous route and graph level.
- `src/scripts/node-navigation.ts` handles the SVG outline and label shared by the graph and section heading. Existing Astro URLs remain directly addressable.
- Opening and closing a category follows the same sequence for clicks and browser history. Reduced motion skips the graph sweep and title morph while keeping navigation and focus working.
- Motion durations and easing curves live in `src/scripts/motion.ts`, which also publishes them as `--motion-*` and `--ease-*` CSS custom properties for the stylesheet.

## Deployment guidance

When the site is ready to publish, set `site` in `astro.config.mjs` to your chosen public origin to emit canonical URLs. Run `npm run build` and use `dist/` as the static host's output directory. Check the nested project URLs, direct links to graph selections, and placeholder indexing before making the site public.
