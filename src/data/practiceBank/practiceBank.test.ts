import assert from 'node:assert/strict';
import type { TopicId } from '../../types/curriculum';
import {
  addMatrices,
  classifyMatrix,
  compute2x2Inverse,
  multiplyMatrices,
  solve2x2System,
  transposeMatrix,
  verifySystemSubstitution,
} from '../../utils/matrixMath';
import { ALL_PRACTICE_QUESTIONS } from './index';

const TOPICS: TopicId[] = [
  'order-equality',
  'types-transpose',
  'add-sub',
  'multiplication',
  'determinant-inverse',
  'linear-systems',
];

// 1. Total count & uniqueness
assert.ok(
  ALL_PRACTICE_QUESTIONS.length >= 150,
  `Expected >= 150 questions, found ${ALL_PRACTICE_QUESTIONS.length}`
);

const seenIds = new Set<string>();
for (const q of ALL_PRACTICE_QUESTIONS) {
  assert.ok(!seenIds.has(q.id), `Duplicate question id: ${q.id}`);
  seenIds.add(q.id);
}

// 2. Per-module quotas
for (const tid of TOPICS) {
  const qs = ALL_PRACTICE_QUESTIONS.filter((q) => q.topicId === tid);
  const mcqs = qs.filter((q) => q.type === 'mcq');
  const tfs = qs.filter((q) => q.type === 'true-false');
  const fbs = qs.filter((q) => q.type === 'fill-blank');
  const fes = qs.filter((q) => q.type === 'find-error');
  const sps = qs.filter((q) => q.type === 'solve-problem');

  assert.ok(mcqs.length >= 10, `${tid}: MCQs ${mcqs.length} < 10`);
  assert.ok(tfs.length >= 5, `${tid}: True/False ${tfs.length} < 5`);
  assert.ok(fbs.length >= 5, `${tid}: Fill Blank ${fbs.length} < 5`);
  assert.ok(sps.length >= 5, `${tid}: Solve Problem ${sps.length} < 5`);
  assert.ok(fes.length >= 3, `${tid}: Find Error ${fes.length} < 3`);

  for (const m of mcqs) {
    assert.equal(m.options.length, 4, `${m.id} must have 4 options`);
    assert.equal(new Set(m.options).size, 4, `${m.id} options must be distinct`);
    assert.ok(m.correctIndex >= 0 && m.correctIndex < 4, `${m.id} invalid correctIndex`);
  }
  for (const f of fes) {
    assert.equal(f.options.length, 4, `${f.id} must have 4 options`);
    assert.equal(new Set(f.options).size, 4, `${f.id} options must be distinct`);
    assert.ok(f.correctIndex >= 0 && f.correctIndex < 4, `${f.id} invalid correctIndex`);
  }
  for (const b of fbs) {
    assert.ok(b.acceptedAnswers.length >= 1, `${b.id} missing acceptedAnswers`);
  }
}

// 3. Cross-check computational Solve-the-Problem keys with matrixMath engine
const getSolve = (id: string) => {
  const q = ALL_PRACTICE_QUESTIONS.find((x) => x.id === id);
  assert.ok(q && q.type === 'solve-problem', `Missing solve-problem ${id}`);
  return q.expectedNumeric;
};

// Module 1
assert.equal(getSolve('m1-sp-1'), 3 * 5);
assert.equal(getSolve('m1-sp-2'), 4 + 3);
assert.equal(getSolve('m1-sp-3'), (8 + 2) / 2);
assert.equal(getSolve('m1-sp-4'), -5 + -6);
assert.equal(getSolve('m1-sp-5'), 12 / 3 + (10 - 4) / 2);

// Module 2
const m2sp1 = transposeMatrix([
  [2, -5, 7],
  [3, 1, -4],
]);
assert.equal(getSolve('m2-sp-1'), m2sp1[2][1]);
assert.equal(classifyMatrix([[9, 0], [0, 9]]).isScalar, true);
assert.equal(getSolve('m2-sp-4'), 9);
assert.equal(getSolve('m2-sp-5'), 3);

// Module 3
const m3sp1 = addMatrices(
  [
    [3, -2],
    [5, 1],
  ],
  [
    [4, 7],
    [-1, 6],
  ]
)!;
assert.equal(getSolve('m3-sp-1'), m3sp1[0][1]);
assert.equal(getSolve('m3-sp-2'), 2 * -3 - 3 * -2);
assert.equal(getSolve('m3-sp-3'), 11 - 5);
assert.equal(getSolve('m3-sp-4'), 3 + 0 + 0 + 3);
assert.equal(getSolve('m3-sp-5'), -5);

// Module 4
const m4sp1 = multiplyMatrices(
  [
    [3, -2],
    [1, 4],
  ],
  [[2], [5]]
)!;
assert.equal(getSolve('m4-sp-1'), m4sp1[0][0]);
const m4sp2 = multiplyMatrices([[1, 2, -1]], [[4], [0], [3]])!;
assert.equal(getSolve('m4-sp-2'), m4sp2[0][0]);
assert.equal(getSolve('m4-sp-3'), (18 - 6) / 4);
const m4sp4 = multiplyMatrices(
  [
    [2, 1],
    [3, -1],
  ],
  [
    [1, 4],
    [-2, 5],
  ]
)!;
assert.equal(getSolve('m4-sp-4'), m4sp4[1][1]);
assert.equal(getSolve('m4-sp-5'), 2 * 5);

// Module 5
assert.equal(
  getSolve('m5-sp-1'),
  compute2x2Inverse([
    [5, -2],
    [3, 4],
  ]).determinant
);
assert.equal(
  compute2x2Inverse([
    [8, getSolve('m5-sp-2')],
    [2, 3],
  ]).isSingular,
  true
);
assert.equal(
  getSolve('m5-sp-3'),
  compute2x2Inverse([
    [4, -7],
    [2, 9],
  ]).adjoint[0][1]
);
assert.equal(
  getSolve('m5-sp-4'),
  compute2x2Inverse([
    [5, 2],
    [3, 2],
  ]).inverseNumeric![0][0]
);
assert.equal(
  getSolve('m5-sp-5'),
  compute2x2Inverse([
    [-2, -3],
    [4, 1],
  ]).determinant
);

// Module 6
const m6s1 = solve2x2System(2, 3, 7, 4, -1, 7);
assert.equal(getSolve('m6-sp-1'), m6s1.detA);
assert.equal(getSolve('m6-sp-2'), m6s1.detAx);
assert.equal(getSolve('m6-sp-3'), m6s1.x!);
const m6s4 = solve2x2System(3, -2, 4, 1, 2, 8);
assert.equal(getSolve('m6-sp-4'), m6s4.y!);
const m6s5 = solve2x2System(1, 1, 180, 1, -1, 40);
assert.equal(getSolve('m6-sp-5'), m6s5.x!);
const m6v5 = verifySystemSubstitution(1, 1, 180, 1, -1, 40, m6s5.x!, m6s5.y!);
assert.equal(m6v5.eq1Verified && m6v5.eq2Verified, true);

console.log(`VERIFIED ${ALL_PRACTICE_QUESTIONS.length} PRACTICE QUESTIONS ACROSS ALL 6 MODULES`);
