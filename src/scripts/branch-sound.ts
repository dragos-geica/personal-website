// Sounds: a short sweep when a category opens, the same sweep reversed when it closes,
// and the portrait's burst (see portrait-burst.ts).
// Browsers only allow sound after the visitor has interacted with the page, so the audio
// is set up on the first pointer or key press and the clips are decoded once, up front.
import type { TransitionBeforePreparationEvent } from 'astro:transitions/client';
import { readBranch } from '../data/branch-location';

const clips = {
  open: '/sounds/branch-open.m4a',
  close: '/sounds/branch-close.m4a',
  burst: '/sounds/portrait-burst.m4a',
} as const;
export type SoundName = keyof typeof clips;
const VOLUME = .5;

let context: AudioContext | undefined;
const buffers = new Map<SoundName, Promise<AudioBuffer | undefined>>();
// The files are small: download them once the page is idle, and decode them on the first
// interaction, so even the first click has its sound ready.
let files: Promise<Map<SoundName, ArrayBuffer>> | undefined;

function download() {
  files ??= Promise.all((Object.entries(clips) as [SoundName, string][]).map(([name, src]) =>
    fetch(src).then((response) => response.arrayBuffer()).then((data) => [name, data] as const, () => [name, undefined] as const)))
    .then((entries) => new Map(entries.filter((entry): entry is readonly [SoundName, ArrayBuffer] => Boolean(entry[1]))));
  return files;
}

function unlock() {
  if (context || typeof AudioContext === 'undefined') return;
  context = new AudioContext();
  const audio = context;
  const downloaded = download();
  for (const name of Object.keys(clips) as SoundName[]) {
    buffers.set(name, downloaded.then((all) => {
      const data = all.get(name);
      return data ? audio.decodeAudioData(data.slice(0)) : undefined;
    }).catch(() => undefined));
  }
}

/**
 * Plays a clip; resolves true once it has started, false if sound is unavailable or was
 * not ready within `wait` milliseconds (a late sound would be out of step with its motion).
 */
export async function playSound(name: SoundName, { volume = VOLUME, wait = 150 } = {}) {
  const requested = performance.now();
  const buffer = await buffers.get(name);
  if (!context || !buffer || performance.now() - requested > wait) return false;
  if (context.state === 'suspended') void context.resume();
  const source = context.createBufferSource();
  const gain = context.createGain();
  gain.gain.value = volume;
  source.buffer = buffer;
  source.connect(gain).connect(context.destination);
  source.start();
  return true;
}

// Imported during server rendering too (via portrait-burst.ts), where there is no window.
if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) requestIdleCallback(() => void download(), { timeout: 4000 });
  else setTimeout(() => void download(), 1500);

  for (const type of ['pointerdown', 'keydown'] as const) {
    addEventListener(type, unlock, { capture: true, passive: true });
  }

  document.addEventListener('astro:before-preparation', (raw) => {
    const event = raw as TransitionBeforePreparationEvent;
    if (event.from.pathname !== '/' || event.to.pathname !== '/') return;
    const from = readBranch(event.from.search);
    const to = readBranch(event.to.search);
    if (!from && to) void playSound('open');
    else if (from && !to) void playSound('close');
  });
}
