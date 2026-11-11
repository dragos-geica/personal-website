import { site } from '../content/site.ts';
import type { CategoryId } from '../content/types.ts';

export const graphCanvas = { width: 1080, height: 815 };
export const centerNode = { x: 531, y: 411, size: 212 };

type Point = readonly [x: number, y: number];

export interface GraphNode {
  id: CategoryId;
  label: string;
  verb: string;
  position: Point;
  size: number;
  pill: Point;
  curve: string;
  /** Item titles shown as circles when the category opens. */
  children: readonly string[];
}

// Layout only: names, line labels and items come from src/content/site.ts.
// Three categories sit in a loose triangle around the portrait.
const layout: readonly { id: CategoryId; position: Point; size: number; bow: number }[] = [
  { id: 'experience', position: [226, 292], size: 192, bow: -34 },
  { id: 'projects', position: [856, 300], size: 192, bow: 34 },
  { id: 'interests', position: [582, 680], size: 178, bow: 30 },
];

/** Canvas units are wider than they are tall on screen; see branch-layout.ts. */
const ASPECT = 1.35;
/** Most circles shown when a category opens; the rest stay on the category's page. */
export const MAX_GRAPH_ITEMS = 6;

// A gently bowed line from the category's rim to the portrait's outer orbit,
// with the relationship pill at its midpoint.
function connect([x, y]: Point, size: number, bow: number) {
  const [cx, cy] = [centerNode.x, centerNode.y];
  const dx = cx - x;
  const dy = (cy - y) * ASPECT;
  const length = Math.hypot(dx, dy);
  const [ux, uy] = [dx / length, dy / length];
  const start = [x + ux * size * .46, y + uy * size * .46 / ASPECT];
  const end = [cx - ux * centerNode.size * .68, cy - uy * centerNode.size * .68 / ASPECT];
  const control = [(start[0] + end[0]) / 2 - uy * bow, (start[1] + end[1]) / 2 + ux * bow / ASPECT];
  const pill: Point = [
    Math.round(.25 * start[0] + .5 * control[0] + .25 * end[0]),
    Math.round(.25 * start[1] + .5 * control[1] + .25 * end[1]),
  ];
  const round = (point: readonly number[]) => point.map((value) => value.toFixed(1)).join(' ');
  return { pill, curve: `M ${round(start)} Q ${round(control)} ${round(end)}` };
}

export const graphNodes: readonly GraphNode[] = layout.map(({ id, position, size, bow }) => {
  const content = site.categories[id];
  const children = content.items.filter(({ inGraph }) => inGraph !== false).slice(0, MAX_GRAPH_ITEMS);
  return {
    id, position, size, ...connect(position, size, bow),
    label: content.label, verb: content.verb, children: children.map(({ title }) => title),
  };
});
