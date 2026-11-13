import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CARD_GAP, HUB_GAP, cardLayout } from '../src/data/branch-layout.ts';
import { branchSide, graphCanvas, graphNodes } from '../src/data/graph.ts';

const { width, height } = graphCanvas;

// Mirrors what GraphBranch measures, at a wide and at the narrowest desktop window.
const screens = [
  { name: 'wide', viewport: 1440, graph: { left: 313, width: 636, height: 668 }, card: { width: 232, height: 92 }, hubR: 55 },
  { name: 'narrow', viewport: 900, graph: { left: 160, width: 580, height: 600 }, card: { width: 196, height: 100 }, hubR: 50 },
];

function hubFor(id, side, graph, r) {
  const [x, y] = side === 'down' ? [540, 150] : [id === 'projects' ? 480 : side === 'left' ? 460 : 620, height / 2];
  return { x: x / width * graph.width, y: y / height * graph.height, r };
}

function layout(id, count, side, screen) {
  const hub = hubFor(id, side, screen.graph, screen.hubR);
  const area = { left: 24 - screen.graph.left, right: screen.viewport - 24 - screen.graph.left, top: 0, bottom: screen.graph.height };
  return { hub, area, cards: cardLayout(id, count, hub, side, area, screen.card) };
}

const cases = [
  ...graphNodes.map((node) => ({ id: node.id, count: node.children.length, side: branchSide(node) })),
  // Room to grow: every side holds up to six cards.
  ...['left', 'right', 'down'].flatMap((side) => [1, 2, 3, 5, 6].map((count) => ({ id: `extra-${count}-${side}`, count, side }))),
];

const overlap = (a, b, gap) => Math.abs(a.x - b.x) < (a.width + b.width) / 2 + gap && Math.abs(a.y - b.y) < (a.height + b.height) / 2 + gap;

test('Other Interests opens downwards; the others open sideways', () => {
  assert.deepEqual(graphNodes.map((node) => [node.id, branchSide(node)]),
    [['experience', 'left'], ['projects', 'right'], ['interests', 'down']]);
});

test('cards never overlap each other or the hub, and stay inside the window', () => {
  for (const screen of screens) {
    for (const { id, count, side } of cases) {
      const { hub, area, cards } = layout(id, count, side, screen);
      assert.equal(cards.length, count);
      cards.forEach((card, index) => {
        const label = `${screen.name} ${id} card ${index}`;
        assert.ok(card.x - card.width / 2 >= area.left - 1 && card.x + card.width / 2 <= area.right + 1, `${label} is outside sideways`);
        assert.ok(card.y - card.height / 2 >= area.top - 1 && card.y + card.height / 2 <= area.bottom + 1, `${label} is outside vertically`);
        // Distance from the hub's centre to the nearest point of the card.
        const dx = Math.max(0, Math.abs(card.x - hub.x) - card.width / 2);
        const dy = Math.max(0, Math.abs(card.y - hub.y) - card.height / 2);
        assert.ok(Math.hypot(dx, dy) >= hub.r + HUB_GAP / 3, `${label} crowds the hub`);
        cards.slice(index + 1).forEach((other, offset) => {
          assert.ok(!overlap(card, other, CARD_GAP / 2), `${label} overlaps card ${index + 1 + offset}`);
        });
      });
    }
  }
});

test('each category keeps the same layout, and categories differ', () => {
  const [screen] = screens;
  assert.deepEqual(layout('projects', 4, 'right', screen).cards, layout('projects', 4, 'right', screen).cards);
  assert.notDeepEqual(layout('research', 3, 'right', screen).cards, layout('music', 3, 'right', screen).cards);
});

test('cards are scattered rather than lined up in one column', () => {
  for (const { id, count, side } of cases.filter(({ count }) => count >= 2)) {
    const { cards } = layout(id, count, side, screens[0]);
    const xs = cards.map(({ x }) => x);
    assert.ok(Math.max(...xs) - Math.min(...xs) > 60, `${id} cards share one column`);
  }
});

test('with room, a branch of three or more puts a card behind its hub', () => {
  const { hub, cards } = layout('projects', 6, 'right', screens[0]);
  assert.ok(cards.some((card) => card.x < hub.x), 'no card behind the hub');
  assert.ok(cards.filter((card) => card.x > hub.x).length >= 4, 'most cards face the open side');
});
