import assert from 'node:assert/strict';
import { test } from 'node:test';
import { graphNodes } from '../src/data/graph.ts';
import { graphDestinations, nodeDestination } from '../src/data/node-destinations.ts';
import { projectPath, projects } from '../src/data/projects.ts';

test('project nodes retain the existing case-study paths', () => {
  for (const project of projects) {
    assert.equal(nodeDestination('projects', project.title), projectPath(project.slug));
  }
});

test('each non-project child has a unique terminal route and a link back to its branch', () => {
  const expected = graphNodes.filter(({ id }) => id !== 'projects').flatMap(({ id, children }) =>
    children.map((child) => [nodeDestination(id, child), `/?branch=${id}`]));
  assert.deepEqual(graphDestinations.map(({ path, back }) => [path, back]), expected);
  assert.equal(new Set(graphDestinations.map(({ path }) => path)).size, expected.length);
});
