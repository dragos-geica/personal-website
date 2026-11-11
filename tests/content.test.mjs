import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { site } from '../src/content/site.ts';
import { slugify } from '../src/data/projects.ts';

const publicFile = (src) => new URL(`../public${src}`, import.meta.url);

test('every photo in the content file exists in public/', () => {
  const images = [site.portrait, ...Object.values(site.categories).flatMap(({ items }) => items.map(({ image }) => image))]
    .filter(Boolean);
  for (const { src, alt } of images) {
    assert.ok(src.startsWith('/'), `${src} should start with / (for example /images/photo.jpg)`);
    assert.ok(existsSync(publicFile(src)), `${src} is missing: put the file in public${src}`);
    assert.ok(alt.trim(), `${src} needs a short alt description`);
  }
});

test('every category has items with a title and summary, and no two items share a page', () => {
  for (const [id, { label, items }] of Object.entries(site.categories)) {
    assert.ok(label.trim(), `${id} needs a label`);
    assert.ok(items.length > 0, `${id} needs at least one item`);
    const slugs = items.map(({ title }) => slugify(title));
    assert.equal(new Set(slugs).size, slugs.length, `${id} has two items with the same title`);
    for (const item of items) {
      assert.ok(item.title.trim() && item.summary.trim(), `an item in ${id} is missing its title or summary`);
      for (const link of item.links ?? []) assert.match(link.href, /^(https?:|mailto:|\/)/, `${item.title}: link "${link.label}" needs a full address`);
    }
  }
});

test('every internal CV link points at a page that exists', async () => {
  const { nodeDestination } = await import('../src/data/node-destinations.ts');
  const pages = new Set(Object.entries(site.categories).flatMap(([id, { items }]) => items.map(({ title }) => nodeDestination(id, title))));
  for (const { entries } of site.pages.cv.sections) {
    for (const { title, href } of entries) {
      if (href?.startsWith('/')) assert.ok(pages.has(href), `CV entry "${title}" links to ${href}, which is not an item page`);
    }
  }
});
