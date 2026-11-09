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

test('selection, close, and reopening reset the branch', () => {
  const open = branchReducer(null, toggle('projects'));
  const selected = branchReducer(open, { type: 'select', parent: 'projects', child: 'AirBox Bootcamp' });
  assert.deepEqual(selected, { parent: 'projects', selected: 'AirBox Bootcamp' });
  const closed = branchReducer(selected, { type: 'close' });
  assert.equal(closed, null);
  assert.deepEqual(branchReducer(closed, toggle('projects')), open);
});

test('rapid toggles and category switches do not retain an old selection', () => {
  const projects = toggle('projects');
  assert.equal([projects, projects].reduce(branchReducer, null), null);
  const research = [projects, toggle('research')].reduce(branchReducer, null);
  assert.deepEqual(research, { parent: 'research', selected: null });
  assert.equal(branchReducer(research, { type: 'select', parent: 'projects', child: 'AirBox Bootcamp' }), research);
});
