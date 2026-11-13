# Editing the website's content

All the words and photos on the site are edited in a form-based editor, **Pages CMS**. There is no code to touch.
Behind the scenes the content lives in small files in [`src/content/`](src/content/), one per part of the site.

## Editing with the editor

1. Go to **yoursite/admin** and click **Open the editor**, or go straight to https://app.pagescms.org.
2. Sign in with GitHub. The first time, Pages CMS asks to install its GitHub app: allow it for the
   `personal-website` repository.
3. Open **dragos-geica/personal-website**. The sidebar lists the parts of the site:

| In the editor | What it changes |
|---|---|
| Home page | Your name, the line under it, the introduction, the portrait, and the message after clicking the portrait (with your email) |
| About page, Research page | The page title, its paragraphs and links |
| CV | Sections and entries |
| Experience, Projects, Other Interests | The category's name, and its items (each item is a card on the home graph and its own page) |

4. Change what you like and click **Save**. That publishes it: Cloudflare rebuilds the site, and the change is
   live about a minute later.

Only people with access to the GitHub repository can sign in, which right now is only you.

## Items

Each item becomes a card in its category and its own page. Only **Title** and **Summary** are required; leave the
rest blank if you don't need them. Blank fields are simply not shown.

- **Short description:** the one line under the title on the card (about 60 characters). Left blank, the card
  uses the first sentence of the summary.
- **Title:** the card's title and page heading. Keep it short. The page's web address is made from it
  ("Neo4j Demo" becomes `/projects/neo4j-demo/`), so renaming an item changes its address.
- **Tags:** the data, tools and methods behind the item. Every tag used by a project becomes a filter on the
  Projects page. Spell a tool the same way everywhere (`Stata`, not `stata`) so it groups together.
  Tag research work `Research` to list it on the Research page.
- **Hide from the home graph:** the graph shows up to six cards per category, in the order of the list.
  Tick this to keep an item off the graph; it still has its page and appears on the Projects page.
- **Work in progress:** marks the item "in progress" and hides its page from search engines.

To reorder items, drag them in the list. To add one, use the add button under the list.

## Photos

Use any photo field's upload button. Photos are stored in `public/images/`. Keep them reasonably small (about
1600 px wide at most; JPEG or WebP), and always fill in the **description**: it is read aloud to blind visitors.
The portrait should be square.

## The CV

The CV is a list of sections, each with entries. An entry's **Link** is optional: to link a role to its page,
use the page's address, for example `/projects/airbox-bootcamp/` or `/graph/experience/unicef-romania/`.
The automatic checks (below) tell you if a link points at a page that doesn't exist.

## If something looks wrong

Every save runs through GitHub, so nothing is lost: each change is a commit you can undo there
(the repository's history, then **Revert**). If a save makes the site fail to build, Cloudflare keeps
showing the last working version, and its deployment log says what went wrong.

## Editing the files directly (optional)

You can also edit the `.json` files in `src/content/` by hand. Text goes between double quotes, entries are
separated by commas, and the last entry in a list has no comma. Then run `npm test` and `npm run check`
(with `PATH="$PWD/.local-tools/node-v24.16.0-darwin-arm64/bin:$PATH"` in front): they name the file and field
if something is off.

The editor's forms are described in [`.pages.yml`](.pages.yml). Adding a new field to the site needs a code change
there and in [`src/content/types.ts`](src/content/types.ts).

## What the editor does not control

Positions on the graph, colours, animations and sounds are part of the design code. The three categories
(Experience, Projects, Other Interests) are fixed; you can rename them, but adding one needs a code change.
