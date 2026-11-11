import { projects } from './projects.ts';

export const graphCanvas = { width: 1080, height: 815 };
export const centerNode = { x: 531, y: 411, size: 212, label: 'Dragos' };

type Point = readonly [x: number, y: number];

export interface GraphNode {
  id: string;
  label: string;
  verb: string;
  position: Point;
  size: number;
  pill: Point;
  curve: string;
  children: readonly string[];
  tone: string;
  href?: string;
}

export const graphNodes = [
  {
    id: 'academics',
    label: 'Academics',
    verb: 'studies',
    position: [243, 131],
    size: 156,
    pill: [383, 185],
    curve: 'M 316 146 C 350 153 352 180 383 185 S 426 275 472 334',
    children: ['Coursework placeholder', 'Academic notes placeholder'],
    tone: '#9aabeb',
  },
  {
    id: 'research',
    label: 'Research',
    verb: 'investigates',
    position: [830, 131],
    size: 152,
    pill: [690, 185],
    curve: 'M 756 146 C 719 155 719 181 690 185 S 644 276 594 334',
    children: ['Research topic placeholder', 'Reading notes placeholder'],
    tone: '#b398ed',
    href: '/research/',
  },
  {
    id: 'projects',
    label: 'Projects',
    verb: 'works_on',
    position: [974, 319],
    size: 152,
    pill: [800, 327],
    curve: 'M 901 318 C 866 319 841 337 800 327 S 698 375 631 392',
    children: projects.map(({ title }) => title),
    tone: '#8eb8e9',
    href: '/projects/',
  },
  {
    id: 'data-tools',
    label: 'Data & Tools',
    verb: 'uses',
    position: [972, 522],
    size: 152,
    pill: [788, 495],
    curve: 'M 898 521 C 861 516 849 495 788 495 S 686 449 632 437',
    children: ['Tool placeholder', 'Dataset placeholder'],
    tone: '#82c9c4',
  },
  {
    id: 'music',
    label: 'Music Taste',
    verb: 'listens_to',
    position: [820, 690],
    size: 152,
    pill: [675, 618],
    curve: 'M 748 676 C 708 664 704 635 675 618 S 618 556 586 502',
    children: ['Artist placeholder', 'Playlist placeholder'],
    tone: '#d99ccf',
  },
  {
    id: 'reading',
    label: 'Reading',
    verb: 'reads',
    position: [247, 686],
    size: 146,
    pill: [384, 614],
    curve: 'M 316 674 C 353 662 360 629 384 614 S 435 551 479 501',
    children: ['Book placeholder', 'Article placeholder'],
    tone: '#deb6a0',
  },
  {
    id: 'travel',
    label: 'Travel',
    verb: 'explores',
    position: [100, 518],
    size: 146,
    pill: [284, 493],
    curve: 'M 170 518 C 213 510 234 480 284 493 S 373 453 430 438',
    children: ['Destination placeholder', 'Travel notes placeholder'],
    tone: '#81c9da',
  },
  {
    id: 'interests',
    label: 'Other Interests',
    verb: 'curious_about',
    position: [109, 316],
    size: 145,
    pill: [285, 330],
    curve: 'M 178 317 C 224 323 231 337 285 330 S 384 371 431 388',
    children: ['Interest placeholder', 'Activity placeholder'],
    tone: '#b79ce9',
  },
] as const satisfies readonly GraphNode[];
