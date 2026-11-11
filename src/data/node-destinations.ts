import { site } from '../content/site.ts';
import { branchPath, childSlug } from './branch-location.ts';
import { graphNodes } from './graph.ts';
import { projectPath, projects } from './projects.ts';

export function nodeDestination(parent: string, child: string) {
  const project = parent === 'projects' && projects.find(({ title }) => title === child);
  if (project) return projectPath(project.slug);
  const slug = childSlug(parent, child);
  return `/graph/${parent}/${slug}/`;
}

export const graphDestinations = graphNodes.flatMap((node) => node.id === 'projects' ? [] :
  site.categories[node.id].items.map((item) => ({ parent: node.label, child: item.title, item,
    path: nodeDestination(node.id, item.title), back: branchPath({ parent: node.id }) })));
