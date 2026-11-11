import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  branchRevealDuration, cubicBezier, durations, easings, isLayoutResize, motionProperties, moveCurve, sweepTimeAt,
} from '../src/scripts/motion.ts';

test('mobile toolbar resizes do not count as layout changes', () => {
  const phone = { width: 390, height: 844 };
  // Safari's address bar sliding away or back.
  assert.equal(isLayoutResize(phone, { width: 390, height: 763 }), false);
  assert.equal(isLayoutResize(phone, { width: 390, height: 900 }), false);
  // Rotation, a resized window, or a much larger height change.
  assert.equal(isLayoutResize(phone, { width: 844, height: 390 }), true);
  assert.equal(isLayoutResize(phone, { width: 391, height: 844 }), true);
  assert.equal(isLayoutResize(phone, { width: 390, height: 500 }), true);
});

test('the ring reaches a radius when its ease-out curve says so', () => {
  assert.equal(sweepTimeAt(10, 10, 110, 400), 0);
  assert.equal(sweepTimeAt(110, 10, 110, 400), 400);
  assert.equal(sweepTimeAt(500, 10, 110, 400), 400);
  assert.equal(sweepTimeAt(-50, 10, 110, 400), 0);
  // Ease-out cubic: half the distance is covered after ~20.6% of the time.
  assert.ok(Math.abs(sweepTimeAt(60, 10, 110, 400) - 400 * (1 - Math.cbrt(.5))) < 1e-9);
  // Later radii are always reached later.
  const times = [20, 40, 60, 80, 100].map((radius) => sweepTimeAt(radius, 10, 110, 400));
  assert.deepEqual(times, [...times].sort((a, b) => a - b));
});

test('scripted easing matches the CSS curve end points and stays monotonic', () => {
  const move = cubicBezier(...moveCurve);
  assert.equal(move(0), 0);
  assert.equal(move(1), 1);
  let previous = 0;
  for (let step = 1; step <= 100; step++) {
    const value = move(step / 100);
    assert.ok(value >= previous - 1e-9, `not monotonic at ${step}`);
    previous = value;
  }
  // Linear control points reproduce linear timing.
  const linear = cubicBezier(0, 0, 1, 1);
  assert.ok(Math.abs(linear(.37) - .37) < 1e-5);
  // A known ease-out cubic value.
  assert.ok(Math.abs(cubicBezier(.33, 1, .68, 1)(.5) - .875) < .02);
});

test('motion tokens become CSS custom properties', () => {
  const properties = motionProperties();
  assert.equal(properties['--motion-sweep'], `${durations.sweep}ms`);
  assert.equal(properties['--motion-morph-leave'], `${durations.morphLeave}ms`);
  assert.equal(properties['--ease-move'], easings.move);
  assert.equal(easings.move, `cubic-bezier(${moveCurve.join(',')})`);
  assert.match(properties['--motion-reveal-start'], /^\d+ms$/);
});

test('opening a category stays within the motion budget', () => {
  // Sweep, then hub travel and the staggered reveal of five children and Back.
  const total = durations.sweep + branchRevealDuration(5);
  assert.ok(total <= 1300, `category open takes ${total}ms`);
  assert.ok(durations.panel <= 300);
});
