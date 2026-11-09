import assert from 'node:assert/strict';
import { test } from 'node:test';
import { branchPath, readBranch } from '../src/data/branch-location.ts';
import { projects } from '../src/data/projects.ts';

test('each project preview can be restored from its stable slug', () => {
  for (const { slug, title } of projects) {
    const state = { parent: 'projects', selected: title };
    const path = branchPath(state);
    assert.equal(path, `/?branch=projects&item=${slug}`);
    assert.deepEqual(readBranch(path.slice(1)), state);
  }
});

test('placeholder branches round-trip and invalid input falls back safely', () => {
  const state = { parent: 'academics', selected: 'Coursework placeholder' };
  assert.deepEqual(readBranch(branchPath(state).slice(1)), state);
  assert.deepEqual(readBranch('?branch=projects&item=missing'), { parent: 'projects', selected: null });
  assert.equal(readBranch('?branch=unknown&item=airbox-bootcamp'), null);
  assert.equal(branchPath(null), '/');
});

test('AirBox metrics preserve the participation distinctions', () => {
  const airbox = projects.find(({ slug }) => slug === 'airbox-bootcamp');
  assert.deepEqual(Object.fromEntries(airbox.metrics.map(({ label, value }) => [label, value])), {
    'Projects for Peace grant': '$10,000',
    Registrants: '120+',
    'Online-phase completers': '60',
    Finalists: '12',
    'Air-quality dataset': 'Public',
  });
});
