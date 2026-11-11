// ─────────────────────────────────────────────────────────────────────────────
//  SITE CONTENT: edit this file to change the words and photos on the website.
//  See CONTENT_GUIDE.md (in the project folder) for step-by-step instructions.
//
//  Rules of thumb
//  • Text goes between quotes: 'like this'. To use an apostrophe inside, write \'
//    (for example 'Dragos\'s notes') or use the curly ’ instead.
//  • Every item and list entry ends with a comma.
//  • Photos go in the  public/images/  folder. Refer to them as '/images/file-name.jpg'.
//  • Run  npm run check  after editing: it points at the exact line if something is off.
// ─────────────────────────────────────────────────────────────────────────────

import type { SiteContent } from './types.ts';

export const site: SiteContent = {
  // Shown at the top of the home page.
  name: 'Dragos Geica',
  tagline: 'My world, connected.',
  intro: 'A living map of what I study, build, research, and enjoy.',

  // The photo in the centre of the graph. Clicking it opens the About page.
  portrait: { src: '/images/portrait.jpg', alt: 'Portrait of Dragos Geica' },

  // Simple pages. Each paragraph is its own entry in the list.
  pages: {
    about: {
      title: 'About',
      paragraphs: ['A short biography will go here.'],
    },
    research: {
      title: 'Research',
      paragraphs: ['Research interests, notes, and publications will go here.'],
    },
    cv: {
      title: 'CV',
      paragraphs: ['Education, experience, and a downloadable CV will go here.'],
    },
  },

  // The eight circles around the portrait. Their order and positions are fixed by the
  // design; here you change their names, the small word on their line, and their items.
  //
  // Each item becomes a circle when its category is opened, and a page of its own.
  // An item can have:
  //   title     (required) the name on the circle and the page heading
  //   summary   (required) the first paragraph on the page
  //   image     optional photo: { src: '/images/….jpg', alt: 'what the photo shows' }
  //   facts     optional figures shown as small cards: { value: '120+', label: 'Registrants' }
  //   sections  optional extra paragraphs with headings: { title: '…', text: '…' }
  //   links     optional links: { label: 'GitHub', href: 'https://…' }
  //   draft     true hides the page from search engines and marks it as a placeholder
  categories: {
    academics: {
      label: 'Academics',
      verb: 'studies',
      items: [
        { title: 'Coursework placeholder', summary: 'Content placeholder. Notes and links for this item can be added here once they are available.', draft: true },
        { title: 'Academic notes placeholder', summary: 'Content placeholder. Notes and links for this item can be added here once they are available.', draft: true },
      ],
    },
    research: {
      label: 'Research',
      verb: 'investigates',
      items: [
        { title: 'Research topic placeholder', summary: 'Content placeholder. Notes and links for this item can be added here once they are available.', draft: true },
        { title: 'Reading notes placeholder', summary: 'Content placeholder. Notes and links for this item can be added here once they are available.', draft: true },
      ],
    },
    projects: {
      label: 'Projects',
      verb: 'works_on',
      items: [
        {
          title: 'AirBox Bootcamp',
          summary: 'A hands-on bootcamp on building air-quality monitors and working with environmental data. Twelve finalists built and deployed monitors, and the project produced a public air-quality dataset.',
          facts: [
            { value: '$10,000', label: 'Projects for Peace grant' },
            { value: '120+', label: 'Registrants' },
            { value: '60', label: 'Online-phase completers' },
            { value: '12', label: 'Finalists' },
            { value: 'Public', label: 'Air-quality dataset' },
          ],
          sections: [
            { title: 'Funding and participation', text: 'A $10,000 Projects for Peace grant supported the bootcamp. 120+ people registered, and 60 completed the online phase.' },
            { title: 'Building and deploying monitors', text: 'Twelve finalists built and deployed air-quality monitors. The project produced a public air-quality dataset.' },
          ],
        },
        {
          title: 'EcoCrafting',
          summary: 'Project placeholder. Add a verified description, images, and relevant links when they are available.',
          draft: true,
        },
        {
          title: 'Neo4j Demo',
          summary: 'Project placeholder. Add a verified demo overview, screenshots, and a demo link when they are available.',
          draft: true,
        },
        {
          title: 'Data Visualizations',
          summary: 'Project placeholder. Add verified visualization examples, datasets, and links when they are available.',
          draft: true,
        },
      ],
    },
    'data-tools': {
      label: 'Data & Tools',
      verb: 'uses',
      items: [
        { title: 'Tool placeholder', summary: 'Content placeholder. Notes and links for this item can be added here once they are available.', draft: true },
        { title: 'Dataset placeholder', summary: 'Content placeholder. Notes and links for this item can be added here once they are available.', draft: true },
      ],
    },
    music: {
      label: 'Music Taste',
      verb: 'listens_to',
      items: [
        { title: 'Artist placeholder', summary: 'Content placeholder. Notes and links for this item can be added here once they are available.', draft: true },
        { title: 'Playlist placeholder', summary: 'Content placeholder. Notes and links for this item can be added here once they are available.', draft: true },
      ],
    },
    reading: {
      label: 'Reading',
      verb: 'reads',
      items: [
        { title: 'Book placeholder', summary: 'Content placeholder. Notes and links for this item can be added here once they are available.', draft: true },
        { title: 'Article placeholder', summary: 'Content placeholder. Notes and links for this item can be added here once they are available.', draft: true },
      ],
    },
    travel: {
      label: 'Travel',
      verb: 'explores',
      items: [
        { title: 'Destination placeholder', summary: 'Content placeholder. Notes and links for this item can be added here once they are available.', draft: true },
        { title: 'Travel notes placeholder', summary: 'Content placeholder. Notes and links for this item can be added here once they are available.', draft: true },
      ],
    },
    interests: {
      label: 'Other Interests',
      verb: 'curious_about',
      items: [
        { title: 'Interest placeholder', summary: 'Content placeholder. Notes and links for this item can be added here once they are available.', draft: true },
        { title: 'Activity placeholder', summary: 'Content placeholder. Notes and links for this item can be added here once they are available.', draft: true },
      ],
    },
  },
};
