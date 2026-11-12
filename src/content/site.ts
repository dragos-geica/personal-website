// Puts the site's content together from the JSON files in this folder.
// Edit the content at /admin (Pages CMS), or edit the .json files directly; see CONTENT_GUIDE.md.
// The type below checks every file: `npm run check` names the file and field if one is off.
import type { SiteContent } from './types.ts';
import home from './home.json' with { type: 'json' };
import about from './about.json' with { type: 'json' };
import research from './research.json' with { type: 'json' };
import cv from './cv.json' with { type: 'json' };
import experience from './experience.json' with { type: 'json' };
import projects from './projects.json' with { type: 'json' };
import interests from './interests.json' with { type: 'json' };

/**
 * The editor can save fields left blank as empty text, empty lists or null. Drop those, and
 * a photo with no file, so a blank field behaves exactly as if it were not there.
 */
export function tidy<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(tidy).filter((entry) => entry !== undefined && entry !== null && entry !== ''
      && !(typeof entry === 'object' && Object.keys(entry).length === 0)) as T;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([key, entry]) => [key, tidy(entry)] as const)
      .filter(([, entry]) => entry !== undefined && entry !== null && entry !== ''
        && !(Array.isArray(entry) && entry.length === 0));
    const result = Object.fromEntries(entries);
    if ('src' in value && !result.src) return undefined as T;
    return result as T;
  }
  return (typeof value === 'string' ? value.trim() : value) as T;
}

const content: SiteContent = {
  ...home,
  pages: { about, research, cv },
  categories: { experience, projects, interests },
};

export const site: SiteContent = tidy(content);
