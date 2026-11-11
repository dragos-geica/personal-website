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
  const slugs = projects.map(({ slug }) => slug);
  for (const slug of ['airbox-bootcamp', 'ecocrafting', 'neo4j-demo', 'data-visualizations']) assert.ok(slugs.includes(slug), slug);
});

test('AirBox keeps registrants, online completers and finalists as separate figures', () => {
  const airbox = projects.find(({ slug }) => slug === 'airbox-bootcamp');
  const facts = Object.fromEntries(airbox.facts.map(({ label, value }) => [label, value]));
  assert.equal(facts['Projects for Peace grant'], '$10,000');
  assert.equal(facts.Registrants, '120+');
  assert.equal(facts['Online-phase completers'], '60');
  assert.equal(facts['In-person finalists'], '12');
});
