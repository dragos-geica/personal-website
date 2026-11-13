import { site } from '../content/site.ts';
import type { CategoryId } from '../content/types.ts';
import type { BranchSide } from './branch-layout.ts';

export const graphCanvas = { width: 1080, height: 815 };
export const centerNode = { x: 531, y: 318, size: 212 };

type Point = readonly [x: number, y: number];

export interface GraphNode {
  id: CategoryId;
  label: string;
  verb: string;
  position: Point;
  size: number;
  pill: Point;
  curve: string;
  /** Item titles shown as cards when the category opens. */
  children: readonly string[];
  /** One short line per child, shown under its title on the card. */
  blurbs: readonly string[];
  /** Faint lines that leave the node and fade out, hinting that it opens onto more. */
  hints: readonly { d: string; from: Point; to: Point }[];
}

// Layout only: names, line labels and items come from src/content/site.ts.
// Three categories sit in a loose triangle around the portrait, high in the canvas so the
// graph sits close under the name. An open category's hub is placed by the branch, not here.
const layout: readonly { id: CategoryId; position: Point; size: number; bow: number }[] = [
  { id: 'experience', position: [226, 199], size: 192, bow: -34 },
  { id: 'projects', position: [856, 207], size: 192, bow: 34 },
  { id: 'interests', position: [582, 587], size: 178, bow: 30 },
];

/** Hint lines per category: angle from the outward direction (degrees), length and bow, in canvas units. */
const HINTS = [
  { turn: -42, length: 150, bow: -18 },
  { turn: 6, length: 205, bow: 14 },
  { turn: 50, length: 128, bow: 20 },
] as const;

/** Canvas units are wider than they are tall on screen; see branch-layout.ts. */
const ASPECT = 1.35;
/** Most cards shown when a category opens; the rest stay on the category's page. */
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

// Short curved lines leaving the node on the side away from the portrait. They are drawn
// with a gradient that fades to nothing, so they read as paths to things not yet shown.
function hintLines([x, y]: Point, size: number) {
  // Lean towards the sides, where an open category spreads, and away from the name above.
  const outward = Math.atan2((y - centerNode.y) * ASPECT * .35, x - centerNode.x);
  return HINTS.map(({ turn, length, bow }) => {
    const angle = outward + turn * Math.PI / 180;
    const [ux, uy] = [Math.cos(angle), Math.sin(angle)];
    const rim = size * .5 + 10;
    const from: Point = [x + ux * rim, y + uy * rim / ASPECT];
    // Keep the far end inside the canvas, which clips its overflow.
    const room = Math.min(
      ux > 0 ? (graphCanvas.width - 24 - from[0]) / ux : ux < 0 ? (24 - from[0]) / ux : Infinity,
      uy > 0 ? (graphCanvas.height - 24 - from[1]) * ASPECT / uy : uy < 0 ? (24 - from[1]) * ASPECT / uy : Infinity,
    );
    const reach = Math.max(40, Math.min(length, room));
    const to: Point = [from[0] + ux * reach, from[1] + uy * reach / ASPECT];
    const control = [(from[0] + to[0]) / 2 - uy * bow, (from[1] + to[1]) / 2 + ux * bow / ASPECT];
    const round = (point: readonly number[]) => point.map((value) => value.toFixed(1)).join(' ');
    // Rounded so the server and the browser render identical numbers.
    const fixed = (point: readonly number[]) => point.map((value) => Math.round(value * 10) / 10) as unknown as Point;
    return { d: `M ${round(from)} Q ${round(control)} ${round(to)}`, from: fixed(from), to: fixed(to) };
  });
}

/** A card's fallback description: the summary's first sentence, cut at a word if it runs long. */
export function firstSentence(text: string, limit = 90) {
  const sentence = text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;
  if (sentence.length <= limit) return sentence;
  return `${sentence.slice(0, limit).replace(/\s+\S*$/, '')}…`;
}

export const graphNodes: readonly GraphNode[] = layout.map(({ id, position, size, bow }) => {
  const content = site.categories[id];
  const children = content.items.filter(({ hideFromGraph }) => !hideFromGraph).slice(0, MAX_GRAPH_ITEMS);
  return {
    id, position, size, ...connect(position, size, bow), hints: hintLines(position, size),
    label: content.label, verb: content.verb, children: children.map(({ title }) => title),
    blurbs: children.map(({ blurb, summary }) => blurb ?? firstSentence(summary)),
  };
});

/**
 * Which way a category opens, keeping its place from the home graph: categories beside the
 * portrait spread sideways, one below it spreads downwards.
 */
export function branchSide({ position: [x, y] }: GraphNode): BranchSide {
  if (y > centerNode.y + 120) return 'down';
  return x < graphCanvas.width / 2 ? 'left' : 'right';
}
