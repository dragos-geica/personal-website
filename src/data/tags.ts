import { site } from '../content/site.ts';
import type { CategoryId, ContentItem } from '../content/types.ts';

/** Every tag used by a project, most used first. These become the Projects page filters. */
export const projectTags: readonly string[] = (() => {
  const counts = new Map<string, number>();
  for (const { tags = [] } of site.categories.projects.items) {
    for (const tag of tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts].sort(([a, x], [b, y]) => y - x || a.localeCompare(b)).map(([tag]) => tag);
})();

/** The Projects page, filtered to one tag; only for tags some project uses. */
export function tagHref(tag: string) {
  return projectTags.includes(tag) ? `/projects/?tag=${encodeURIComponent(tag)}` : undefined;
}

/** Items from any category carrying a tag, e.g. everything tagged 'Research'. */
export function itemsTagged(tag: string): { category: CategoryId; item: ContentItem }[] {
  return (Object.keys(site.categories) as CategoryId[]).flatMap((category) =>
    site.categories[category].items.filter(({ tags = [], draft }) => !draft && tags.includes(tag))
      .map((item) => ({ category, item })));
}
