# Editing the website's content

All the words and photos on the site live in **one file**: [`src/content/site.ts`](src/content/site.ts).
You can change it without touching any other code.

## Quick start

1. Start the site: `PATH="$PWD/.local-tools/node-v24.16.0-darwin-arm64/bin:$PATH" npm run dev`
2. Open http://127.0.0.1:4321/
3. Edit `src/content/site.ts` and save. The browser updates by itself.
4. When you are done, run `npm test` and `npm run check` (with the same `PATH=…` prefix).
   They tell you if a photo is missing or something is mistyped, and on which line.

## What you can change

| What | Where in `site.ts` |
|---|---|
| Your name, the tagline, the intro sentence | `name`, `tagline`, `intro` at the top |
| The photo in the centre circle | `portrait` |
| The message after clicking your photo, and your email | `easterEgg` |
| About and Research pages | `pages` → `about`, `research` |
| The CV | `pages` → `cv` → `sections` (see below) |
| A category's name or the small word on its line | `categories` → `experience`, `projects` or `interests` → `label`, `verb` |
| The circles that appear when a category opens | that category's `items` |

Each **item** becomes a circle in its category and its own page:

```ts
{
  title: 'AirBox Bootcamp',                       // circle label and page heading (required, keep it short)
  subtitle: 'Project lead · 2026',               // small line under the heading
  summary: 'One or two sentences about it.',     // first paragraph on the page (required)
  image: { src: '/images/airbox.jpg', alt: 'Students assembling an air monitor' },
  facts: [
    { value: '120+', label: 'Registrants' },
  ],
  sections: [
    { title: 'What we built', text: 'A paragraph of detail.' },
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/…' },
  ],
  tags: ['Stata', 'R', 'Python'],                // data, tools and methods
  inGraph: false,                                 // keep it off the home graph
},
```

Only `title` and `summary` are required; leave out anything you don't need.

**Tags** list the data, tools and methods behind an item. Every tag used by a project becomes a filter
on the Projects page, and tags on any page link to the projects that use them. Spell a tool the same way
everywhere (`'Stata'`, not `'stata'`) so it groups together. Tag research work `'Research'` to list it on
the Research page.

**The graph shows up to six circles per category**, in the order they appear in the file. Put `inGraph: false`
on items you want only on the Projects page; it still has its own page.
Add `draft: true` to mark an item as a placeholder (search engines will skip its page).

## Editing the CV

The CV is a list of `sections`, each with a `heading` and `entries`. An entry looks like:

```ts
{
  title: 'Student General Manager',
  org: 'Instructional Media Services, Wesleyan University',
  dates: 'September 2025–present',
  points: ['One bullet point.', 'Another bullet point.'],
  href: '/projects/airbox-bootcamp/',   // optional: makes the title a link
},
```

Only `title` is required. To add a role, copy an entry and edit it; to add a section, copy a whole
`{ heading: …, entries: [ … ] },` block. `npm test` checks that links to item pages still exist.

## Adding a photo

1. Put the file in `public/images/`, e.g. `public/images/airbox.jpg`.
   Keep photos reasonably small (about 1600 px wide at most; JPEG or WebP).
2. Refer to it **without** `public`: `image: { src: '/images/airbox.jpg', alt: '…' }`.
3. Always write a short `alt` describing the photo. It is read aloud to blind visitors.

To change your portrait, replace `public/images/portrait.jpg` with a square photo of the same name.

## Adding or removing an item

Copy an existing item, from `{` to its closing `},`, paste it into the list and edit it.
To remove one, delete it from `{` to `},`. A category needs at least one item.

The item's web address is made from its title (for example "Neo4j Demo" becomes `/projects/neo4j-demo/`),
so renaming an item also changes its address.

## Common mistakes

- **An apostrophe inside text** ends the text early: write `'Dragos\'s notes'` or use a curly `’`.
- **A missing comma** after `}` or `'…'` between entries.
- **A photo path with `public` in it**: use `/images/…`, not `public/images/…`.

If the page turns blank or shows an error, the terminal running `npm run dev` names the file and line.
Undo your last change, or fix that line, and save again.

## What this file does not control

The positions of the eight categories, colours, and animations are part of the design code.
The three categories (Experience, Projects, Other Interests) are fixed; you can rename them, but adding one needs a code change.
