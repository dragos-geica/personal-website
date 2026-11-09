export const graphCanvas = { width: 1672, height: 784 };
export const centerNode = { x: 834, y: 320, size: 270, label: 'Me' };

type Point = readonly [x: number, y: number];

export interface GraphNode {
  id: string;
  label: string;
  verb: string;
  position: Point;
  size: number;
  pill: Point;
  curve: string;
  highlights: readonly Point[];
  tone: string;
  href?: string;
}

export const graphNodes = [
  {
    id: 'academics',
    label: 'Academics',
    verb: 'studies',
    position: [472, 94],
    size: 166,
    pill: [660, 133],
    curve: 'M 546 102 C 595 103 607 132 651 145 S 722 199 750 252',
    highlights: [[584, 111], [705, 180]],
    tone: '#9aabeb',
  },
  {
    id: 'research',
    label: 'Research',
    verb: 'investigates',
    position: [1201, 95],
    size: 166,
    pill: [1017, 133],
    curve: 'M 1125 104 C 1084 103 1068 131 1023 144 S 944 190 919 242',
    highlights: [[1093, 111], [965, 175]],
    tone: '#b398ed',
    href: '/research/',
  },
  {
    id: 'projects',
    label: 'Projects',
    verb: 'works_on',
    position: [1387, 233],
    size: 158,
    pill: [1159, 250],
    curve: 'M 1316 232 C 1259 226 1242 254 1200 253 S 1107 243 1071 260 S 1009 305 962 306',
    highlights: [[1269, 235], [1050, 271]],
    tone: '#8eb8e9',
    href: '/projects/',
  },
  {
    id: 'data-tools',
    label: 'Data & Tools',
    verb: 'uses',
    position: [1407, 411],
    size: 158,
    pill: [1176, 380],
    curve: 'M 1336 409 C 1287 402 1265 385 1220 381 S 1125 390 1090 374 S 1017 335 964 342',
    highlights: [[1285, 396], [1068, 363]],
    tone: '#82c9c4',
  },
  {
    id: 'music',
    label: 'Music Taste',
    verb: 'listens_to',
    position: [1224, 533],
    size: 164,
    pill: [1034, 493],
    curve: 'M 1149 531 C 1110 523 1098 498 1063 494 S 1008 489 987 476 S 947 429 924 419',
    highlights: [[1109, 514], [972, 465]],
    tone: '#d99ccf',
  },
  {
    id: 'reading',
    label: 'Reading',
    verb: 'reads',
    position: [445, 533],
    size: 163,
    pill: [630, 492],
    curve: 'M 522 532 C 560 521 572 500 608 495 S 661 489 677 466 S 706 420 738 408',
    highlights: [[559, 515], [689, 446]],
    tone: '#deb6a0',
  },
  {
    id: 'travel',
    label: 'Travel',
    verb: 'explores',
    position: [264, 411],
    size: 158,
    pill: [493, 380],
    curve: 'M 333 409 C 390 397 423 380 477 379 S 555 382 592 365 S 662 334 705 341',
    highlights: [[385, 396], [606, 357]],
    tone: '#81c9da',
  },
  {
    id: 'interests',
    label: 'Other Interests',
    verb: 'curious_about',
    position: [286, 233],
    size: 158,
    pill: [523, 249],
    curve: 'M 356 234 C 409 226 429 253 482 252 S 580 242 620 259 S 675 301 704 304',
    highlights: [[406, 236], [629, 263]],
    tone: '#b79ce9',
  },
] as const satisfies readonly GraphNode[];
