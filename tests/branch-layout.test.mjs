import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CANVAS_ASPECT, CHILD_SPACING, HUB_CLEARANCE, constellation } from '../src/data/branch-layout.ts';
import { graphCanvas, graphNodes } from '../src/data/graph.ts';

const { width, height } = graphCanvas;
const distance = (a, b) => Math.hypot(a.x - b.x, (a.y - b.y) * CANVAS_ASPECT);

// Mirrors the areas GraphBranch passes in.
function layout(id, count, side = 'right', hubX = side === 'left' ? 460 : 620) {
  const hub = { x: hubX, y: height / 2 };
  const area = side === 'left'
    ? { left: -215, right: hubX - 200, top: 80, bottom: height - 80,
        keepClear: { left: -Infinity, right: 60, top: -Infinity, bottom: 150 } }
    : { left: hubX + 200, right: width + 215, top: 80, bottom: height - 80,
        keepClear: { left: width - 40, right: Infinity, top: -Infinity, bottom: 150 } };
  return { hub, area, points: constellation(id, count, hub, side, area) };
}

const cases = [
  ...graphNodes.map((node) => ({
    id: node.id, count: node.children.length,
    side: node.position[0] < width / 2 ? 'left' : 'right',
    hubX: node.id === 'projects' ? 480 : undefined,
  })),
  // Room to grow: up to five children on the narrower left side, six on the right (Projects).
  ...[1, 3, 5].map((count) => ({ id: `extra-${count}-left`, count, side: 'left' })),
  ...[1, 3, 5, 6].map((count) => ({ id: `extra-${count}-right`, count, side: 'right', hubX: 480 })),
];

test('children never crowd each other, the hub or the branch actions', () => {
  for (const { id, count, side, hubX } of cases) {
    const { hub, area, points } = layout(id, count, side, hubX);
    assert.equal(points.length, count);
    points.forEach((point, index) => {
      const label = `${id} child ${index}`;
      assert.ok(distance(point, hub) >= HUB_CLEARANCE - 2, `${label} is too close to the hub`);
      assert.ok(point.x >= area.left - 1 && point.x <= area.right + 1, `${label} x ${point.x} is outside`);
      assert.ok(point.y >= area.top - 1 && point.y <= area.bottom + 1, `${label} y ${point.y} is outside`);
      const clear = area.keepClear;
      assert.ok(!(point.x > clear.left && point.x < clear.right && point.y < clear.bottom), `${label} covers the actions`);
      assert.ok((point.x - hub.x) * (side === 'left' ? -1 : 1) > 0, `${label} is behind the hub`);
      points.slice(index + 1).forEach((other) => {
        assert.ok(distance(point, other) >= CHILD_SPACING - 2, `${id}: children are ${Math.round(distance(point, other))} apart`);
      });
    });
  }
});

test('each category keeps the same constellation, and categories differ', () => {
  assert.deepEqual(layout('projects', 4).points, layout('projects', 4).points);
  assert.notDeepEqual(layout('research', 2).points, layout('music', 2).points);
});

test('children are scattered rather than lined up', () => {
  for (const { id, count, side, hubX } of cases.filter(({ count }) => count >= 2)) {
    const { points } = layout(id, count, side, hubX);
    const xs = points.map(({ x }) => x);
    assert.ok(Math.max(...xs) - Math.min(...xs) > 60, `${id} children share one column`);
  }
});

test('six children on the narrower left side still keep clear of each other', () => {
  const { points } = layout('experience', 6, 'left');
  points.forEach((point, index) => points.slice(index + 1).forEach((other) => {
    assert.ok(distance(point, other) >= 195, `children are ${Math.round(distance(point, other))} apart`);
  }));
});
