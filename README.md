# DG Personal Knowledge Graph

A Stage 1 Astro site with a light, responsive homepage, a React graph island, and placeholder pages for Projects, Research, About, and CV.

## Open the local preview

In Terminal, open the project folder. On the Mac where Stage 1 was built, use the Node.js and npm installed in the project:

```sh
cd "/Users/dragosgeica/Documents/My Website"
export PATH="$PWD/.local-tools/node-v24.16.0-darwin-arm64/bin:$PATH"
npm run dev
```

When Astro prints its local address, open [http://127.0.0.1:4321/](http://127.0.0.1:4321/) in your browser. If port 4321 is busy, use the address Astro prints. Keep Terminal running while you preview. Press **Control-C** there to stop the server.

For a fresh copy on another machine, install Node.js 24 LTS (or Node.js 22.12+) with npm, then run `npm ci` from the project folder before starting the server. Installing dependencies requires network access to the npm registry.

## Verify or build

```sh
npm run check
npm run build
npm run preview
```

The build writes the five pages to `dist/`. The preview command serves that build on the local address printed in Terminal.

## Edit the foundation

- `src/data/graph.ts` holds the category labels, relationship verbs, positions, colors, and SVG connector paths.
- `src/components/KnowledgeGraph.tsx` renders the graph. `GraphIcon.tsx` contains the original SVG icons.
- `src/styles/global.css` contains the desktop composition, visual styles, and mobile layout.
- `src/pages/[section].astro` contains the copy for the four placeholder pages.
- `CODEX_TASK.md` and `references/01-home-light.png` contain the original brief and visual target.
