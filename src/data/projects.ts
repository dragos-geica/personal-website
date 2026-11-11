import { site } from '../content/site.ts';
import type { ContentItem } from '../content/types.ts';

// Projects come from src/content/site.ts; this adds the stable URL slug.
export interface Project extends ContentItem {
  slug: string;
}

export const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const projects: readonly Project[] = site.categories.projects.items.map((item) => ({ ...item, slug: slugify(item.title) }));

export function projectPath(slug: string) {
  return `/projects/${slug}/`;
}
