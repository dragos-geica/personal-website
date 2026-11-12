import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CANVAS_ASPECT, CHILD_SPACING, HUB_CLEARANCE, constellation } from '../src/data/branch-layout.ts';
import { branchSide, graphCanvas, graphNodes } from '../src/data/graph.ts';

const { width, height } = graphCanvas;
const distance = (a, b) => Math.hypot(a.x - b.x, (a.y - b.y) * CANVAS_ASPECT);

// Mirrors the areas GraphBranch passes in.
function layout(id, count, side = 'right', hubX = side === 'left' ? 460 : 620) {
  if (side === 'down') {
    const hub = { x: 540, y: 150 };
    const area = { left: 125, right: width - 125, top: hub.y + 160, bottom: height - 70,
      keepClear: { left: Infinity, right: -Infinity, top: 0, bottom: 0 } };
    return { hub, area, points: constellation(id, count, hub, side, area) };
  }
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
    side: branchSide(node),
    hubX: node.id === 'projects' ? 480 : undefined,
  })),
  // Room to grow: up to five children on the narrower left side, six on the right (Projects).
  ...[1, 3, 5].map((count) => ({ id: `extra-${count}-left`, count, side: 'left' })),
  ...[1, 3, 5, 6].map((count) => ({ id: `extra-${count}-right`, count, side: 'right', hubX: 480 })),
  // Other Interests opens downwards; it has room for up to five.
  ...[1, 3, 5].map((count) => ({ id: `extra-${count}-down`, count, side: 'down' })),
];

test('Other Interests opens downwards; the others open sideways', () => {
  assert.deepEqual(graphNodes.map((node) => [node.id, branchSide(node)]),
    [['experience', 'left'], ['projects', 'right'], ['interests', 'down']]);
});

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
      const ahead = side === 'down' ? point.y - hub.y : (point.x - hub.x) * (side === 'left' ? -1 : 1);
      assert.ok(ahead > 0, `${label} is behind the hub`);
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
