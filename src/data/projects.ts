export interface Project {
  slug: string;
  title: string;
  summary: string;
  placeholder?: true;
  image: { placeholder: string } | { src: string; alt: string; width: number; height: number };
  metrics: readonly { value: string; label: string }[];
  sections: readonly { title: string; text: string }[];
  links: readonly { label: string; href: string }[];
}

export const projects: readonly Project[] = [
  {
    slug: 'airbox-bootcamp',
    title: 'AirBox Bootcamp',
    summary: 'A hands-on bootcamp on building air-quality monitors and working with environmental data. Twelve finalists built and deployed monitors, and the project produced a public air-quality dataset.',
    image: { placeholder: 'AirBox monitor photo placeholder' },
    metrics: [
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
    links: [],
  },
  {
    slug: 'ecocrafting',
    title: 'EcoCrafting',
    summary: 'Project placeholder. Add a verified description, images, and relevant links when they are available.',
    placeholder: true,
    image: { placeholder: 'EcoCrafting image placeholder' },
    metrics: [], sections: [], links: [],
  },
  {
    slug: 'neo4j-demo',
    title: 'Neo4j Demo',
    summary: 'Project placeholder. Add a verified demo overview, screenshots, and a demo link when they are available.',
    placeholder: true,
    image: { placeholder: 'Neo4j Demo image placeholder' },
    metrics: [], sections: [], links: [],
  },
  {
    slug: 'data-visualizations',
    title: 'Data Visualizations',
    summary: 'Project placeholder. Add verified visualization examples, datasets, and links when they are available.',
    placeholder: true,
    image: { placeholder: 'Data Visualizations image placeholder' },
    metrics: [], sections: [], links: [],
  },
];

export function projectPath(slug: string) {
  return `/projects/${slug}/`;
}
