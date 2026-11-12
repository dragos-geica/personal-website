import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  branchRevealDuration, cubicBezier, cubicBezierInverse, durations, easings, isLayoutResize, motionProperties, moveCurve,
  sweepCurve, sweepTimeAt, childrenStart, revealStart,
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

test('the ring reaches a radius when its sweep curve says so', () => {
  assert.equal(sweepTimeAt(10, 10, 110, 400), 0);
  assert.equal(sweepTimeAt(110, 10, 110, 400), 400);
  assert.equal(sweepTimeAt(500, 10, 110, 400), 400);
  assert.equal(sweepTimeAt(-50, 10, 110, 400), 0);
  // The ring's CSS curve, evaluated at that time, gives back the requested distance.
  const sweep = cubicBezier(...sweepCurve);
  for (const radius of [25, 60, 95]) {
    assert.ok(Math.abs(sweep(sweepTimeAt(radius, 10, 110, 400) / 400) - (radius - 10) / 100) < 1e-4);
  }
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

test('the ring leaves the node gently instead of jumping', () => {
  const sweep = cubicBezier(...sweepCurve);
  // After one 60 Hz frame the ring has covered only a few percent of its distance.
  assert.ok(sweep(16.7 / durations.sweep) < .06);
  // No single frame moves the ring by more than ~8% of its distance.
  for (let time = 0; time < durations.sweep; time += 16.7) {
    const step = sweep(Math.min(1, (time + 16.7) / durations.sweep)) - sweep(time / durations.sweep);
    assert.ok(step < .08, `frame at ${Math.round(time)}ms moves ${step.toFixed(3)}`);
  }
  assert.ok(Math.abs(cubicBezierInverse(...sweepCurve)(sweep(.4)) - .4) < 1e-4);
});

test('opening a category stays within the motion budget', () => {
  // Worst case: the full sweep, then hub travel and the sequenced reveal of four children.
  const total = durations.sweep + branchRevealDuration(4);
  assert.ok(total <= 2400, `category open takes ${total}ms`);
});

test('child lines set off from the hub as the reveal starts', () => {
  assert.equal(childrenStart(), revealStart());
  assert.equal(motionProperties()['--motion-children-start'], `${childrenStart()}ms`);
  // Each child's line takes long enough to read as travelling light.
  assert.ok(durations.edge >= 300);
});
