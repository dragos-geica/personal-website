import assert from 'node:assert/strict';
import { test } from 'node:test';
import { branchReducer } from '../src/data/branch-state.ts';
import { graphNodes } from '../src/data/graph.ts';

const toggle = (parent) => ({ type: 'toggle', parent });

test('all eight categories provide children and Projects uses the Stage 2 labels', () => {
  assert.equal(graphNodes.length, 8);
  for (const node of graphNodes) {
    assert.ok(node.children.length > 0);
    assert.equal(new Set(node.children).size, node.children.length);
  }
  assert.deepEqual(graphNodes.find(({ id }) => id === 'projects').children,
    ['AirBox Bootcamp', 'EcoCrafting', 'Neo4j Demo', 'Data Visualizations']);
});

test('close and reopening reset the branch', () => {
  const open = branchReducer(null, toggle('projects'));
  assert.deepEqual(open, { parent: 'projects' });
  const closed = branchReducer(open, { type: 'close' });
  assert.equal(closed, null);
  assert.deepEqual(branchReducer(closed, toggle('projects')), open);
});

test('rapid toggles and category switches settle on one branch', () => {
  const projects = toggle('projects');
  assert.equal([projects, projects].reduce(branchReducer, null), null);
  assert.deepEqual([projects, toggle('research')].reduce(branchReducer, null), { parent: 'research' });
});
