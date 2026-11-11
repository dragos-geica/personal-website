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
  children: readonly string[];
}

// Layout only: names, line labels and items come from src/content/site.ts.
const layout = [
  {
    id: 'academics',
    position: [243, 131],
    size: 156,
    pill: [383, 185],
    curve: 'M 316 146 C 350 153 352 180 383 185 S 426 275 472 334',
  },
  {
    id: 'research',
    position: [830, 131],
    size: 152,
    pill: [690, 185],
    curve: 'M 756 146 C 719 155 719 181 690 185 S 644 276 594 334',
  },
  {
    id: 'projects',
    position: [974, 319],
    size: 152,
    pill: [800, 327],
    curve: 'M 901 318 C 866 319 841 337 800 327 S 698 375 631 392',
  },
  {
    id: 'data-tools',
    position: [972, 522],
    size: 152,
    pill: [788, 495],
    curve: 'M 898 521 C 861 516 849 495 788 495 S 686 449 632 437',
  },
  {
    id: 'music',
    position: [820, 690],
    size: 152,
    pill: [675, 618],
    curve: 'M 748 676 C 708 664 704 635 675 618 S 618 556 586 502',
  },
  {
    id: 'reading',
    position: [247, 686],
    size: 146,
    pill: [384, 614],
    curve: 'M 316 674 C 353 662 360 629 384 614 S 435 551 479 501',
  },
  {
    id: 'travel',
    position: [100, 518],
    size: 146,
    pill: [284, 493],
    curve: 'M 170 518 C 213 510 234 480 284 493 S 373 453 430 438',
  },
  {
    id: 'interests',
    position: [109, 316],
    size: 145,
    pill: [285, 330],
    curve: 'M 178 317 C 224 323 231 337 285 330 S 384 371 431 388',
  },
] as const;

export const graphNodes: readonly GraphNode[] = layout.map((node) => {
  const content = site.categories[node.id];
  return { ...node, label: content.label, verb: content.verb, children: content.items.map(({ title }) => title) };
});
