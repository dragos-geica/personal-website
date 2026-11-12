// A short sweep sound when a category opens, and the same sound reversed when it closes.
// Browsers only allow sound after the visitor has interacted with the page, so the audio
// is set up on the first pointer or key press and the clips are decoded once, up front.
import type { TransitionBeforePreparationEvent } from 'astro:transitions/client';
import { readBranch } from '../data/branch-location';

const clips = { open: '/sounds/branch-open.m4a', close: '/sounds/branch-close.m4a' } as const;
const VOLUME = .5;

let context: AudioContext | undefined;
const buffers = new Map<keyof typeof clips, Promise<AudioBuffer | undefined>>();

function unlock() {
  if (context || typeof AudioContext === 'undefined') return;
  context = new AudioContext();
  const audio = context;
  for (const [name, src] of Object.entries(clips) as [keyof typeof clips, string][]) {
    buffers.set(name, fetch(src)
      .then((response) => response.arrayBuffer())
      .then((data) => audio.decodeAudioData(data))
      .catch(() => undefined));
  }
}

async function play(name: keyof typeof clips) {
  const requested = performance.now();
  const buffer = await buffers.get(name);
  // The very first click may still be decoding; play only if it is ready almost at once.
  if (!context || !buffer || performance.now() - requested > 150) return;
  if (context.state === 'suspended') void context.resume();
  const source = context.createBufferSource();
  const gain = context.createGain();
  gain.gain.value = VOLUME;
  source.buffer = buffer;
  source.connect(gain).connect(context.destination);
  source.start();
}

for (const type of ['pointerdown', 'keydown'] as const) {
  addEventListener(type, unlock, { capture: true, passive: true });
}

document.addEventListener('astro:before-preparation', (raw) => {
  const event = raw as TransitionBeforePreparationEvent;
  if (event.from.pathname !== '/' || event.to.pathname !== '/') return;
  const from = readBranch(event.from.search);
  const to = readBranch(event.to.search);
  if (!from && to) void play('open');
  else if (from && !to) void play('close');
});
