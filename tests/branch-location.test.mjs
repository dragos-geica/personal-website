import assert from 'node:assert/strict';
import { test } from 'node:test';
import { branchPath, readBranch } from '../src/data/branch-location.ts';
import { projects } from '../src/data/projects.ts';

test('each branch round-trips through its URL and old or invalid input falls back safely', () => {
  for (const parent of ['projects', 'academics', 'data-tools']) {
    const path = branchPath({ parent });
    assert.equal(path, `/?branch=${parent}`);
    assert.deepEqual(readBranch(path.slice(1)), { parent });
  }
  // Links saved from the removed preview mode still open the right branch.
  assert.deepEqual(readBranch('?branch=projects&item=airbox-bootcamp'), { parent: 'projects' });
  assert.equal(readBranch('?branch=unknown'), null);
  assert.equal(branchPath(null), '/');
});

test('every project keeps its existing URL slug', () => {
  assert.deepEqual(projects.map(({ slug }) => slug), ['airbox-bootcamp', 'ecocrafting', 'neo4j-demo', 'data-visualizations']);
});

test('AirBox metrics preserve the participation distinctions', () => {
  const airbox = projects.find(({ slug }) => slug === 'airbox-bootcamp');
  assert.deepEqual(Object.fromEntries(airbox.facts.map(({ label, value }) => [label, value])), {
    'Projects for Peace grant': '$10,000',
    Registrants: '120+',
    'Online-phase completers': '60',
    Finalists: '12',
    'Air-quality dataset': 'Public',
  });
});
