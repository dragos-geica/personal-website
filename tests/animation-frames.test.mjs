import assert from 'node:assert/strict';
import { test } from 'node:test';
import { animateFrames } from '../src/scripts/animation-frames.ts';

function frameQueue(t) {
  const frames = new Map();
  let id = 0;
  globalThis.requestAnimationFrame = (draw) => { frames.set(++id, draw); return id; };
  globalThis.cancelAnimationFrame = (key) => frames.delete(key);
  t.after(() => {
    delete globalThis.requestAnimationFrame;
    delete globalThis.cancelAnimationFrame;
  });
  return frames;
}

test('interrupted motion unblocks navigation without another browser frame', async (t) => {
  const frames = frameQueue(t);
  const controller = new AbortController();
  const draws = [];
  const finished = animateFrames(controller.signal, 440, (progress) => draws.push(progress));
  const [pending] = frames.values();

  controller.abort();
  assert.equal(await finished, false);
  assert.equal(frames.size, 0);
  pending(performance.now() + 500);
  assert.deepEqual(draws, [0]);
});

test('a late frame settles at the final pose without scheduling more work', async (t) => {
  const frames = frameQueue(t);
  const draws = [];
  const finished = animateFrames(new AbortController().signal, 440, (progress) => draws.push(progress));
  const [[id, draw]] = frames;
  frames.delete(id);
  draw(performance.now() + 500);

  assert.equal(await finished, true);
  assert.deepEqual(draws, [0, 1]);
  assert.equal(frames.size, 0);
});
