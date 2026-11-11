import assert from 'node:assert/strict';
import { test } from 'node:test';
import { branchReducer } from '../src/data/branch-state.ts';
import { graphNodes } from '../src/data/graph.ts';

const toggle = (parent) => ({ type: 'toggle', parent });

test('three categories provide children and Projects keeps its original items', () => {
  assert.equal(graphNodes.length, 3);
  for (const node of graphNodes) {
    assert.ok(node.children.length > 0);
    assert.equal(new Set(node.children).size, node.children.length);
  }
  assert.deepEqual(graphNodes.map(({ id }) => id), ['experience', 'projects', 'interests']);
  for (const node of graphNodes) assert.ok(node.children.length <= 6, `${node.id} shows too many circles`);
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
