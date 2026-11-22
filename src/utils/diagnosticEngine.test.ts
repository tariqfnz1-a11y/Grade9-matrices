import assert from 'node:assert/strict';
import { ALL_PRACTICE_QUESTIONS } from '../data/practiceBank';
import { DIAGNOSTIC_QUESTIONS } from '../data/unit1Content';
import type { TopicId } from '../types/curriculum';
import {
  classifyPerformanceBand,
  computeAttemptComparison,
  evaluateDiagnosticAttempt,
} from './diagnosticEngine';

// 1. Verify diagnostic questions cover all 6 modules evenly (3 per module = 18)
assert.equal(DIAGNOSTIC_QUESTIONS.length, 18, 'Diagnostic should contain 18 questions');
const countsByTopic: Record<TopicId, number> = {
  'order-equality': 0,
  'types-transpose': 0,
  'add-sub': 0,
  multiplication: 0,
  'determinant-inverse': 0,
  'linear-systems': 0,
};
const qIds = new Set<string>();
for (const q of DIAGNOSTIC_QUESTIONS) {
  assert.ok(!qIds.has(q.id), `Duplicate diagnostic question ID: ${q.id}`);
  qIds.add(q.id);
  assert.ok(q.conceptTag && q.conceptTag.length > 0, `Missing conceptTag on ${q.id}`);
  assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length, `Invalid correctIndex on ${q.id}`);
  countsByTopic[q.topicId] += 1;
}
for (const [tid, cnt] of Object.entries(countsByTopic)) {
  assert.equal(cnt, 3, `Module ${tid} should have exactly 3 diagnostic questions`);
}

// 2. Verify all 5 performance category boundaries
assert.equal(classifyPerformanceBand(0).label, 'Needs foundational support');
assert.equal(classifyPerformanceBand(39).label, 'Needs foundational support');
assert.equal(classifyPerformanceBand(40).label, 'Developing understanding');
assert.equal(classifyPerformanceBand(59).label, 'Developing understanding');
assert.equal(classifyPerformanceBand(60).label, 'Satisfactory understanding');
assert.equal(classifyPerformanceBand(79).label, 'Satisfactory understanding');
assert.equal(classifyPerformanceBand(80).label, 'Strong understanding');
assert.equal(classifyPerformanceBand(89).label, 'Strong understanding');
assert.equal(classifyPerformanceBand(90).label, 'Excellent understanding');
assert.equal(classifyPerformanceBand(100).label, 'Excellent understanding');

// 3. Simulate Attempt 1: Strong on modules 1-3, weak on modules 4-6
const attempt1Answers: Record<string, number> = {};
for (const q of DIAGNOSTIC_QUESTIONS) {
  if (
    q.topicId === 'order-equality' ||
    q.topicId === 'types-transpose' ||
    q.topicId === 'add-sub'
  ) {
    attempt1Answers[q.id] = q.correctIndex;
  } else if (q.topicId === 'multiplication') {
    attempt1Answers[q.id] = q.id === 'diag-10' ? q.correctIndex : (q.correctIndex + 1) % 4;
  } else {
    attempt1Answers[q.id] = (q.correctIndex + 1) % 4;
  }
}

const eval1 = evaluateDiagnosticAttempt(attempt1Answers, 1);
assert.equal(eval1.score, 10);
assert.equal(eval1.total, 18);
assert.equal(eval1.percentage, 56);
assert.equal(eval1.performanceBand, 'developing');
assert.equal(eval1.strongConcepts?.length, 3);
assert.equal(eval1.weakConcepts?.length, 3);
assert.equal(eval1.recommendedLessons?.length, 3);
assert.ok((eval1.personalisedPracticePlan?.length ?? 0) > 0);

// Ensure every recommended practice ID exists and has no duplicates
const practiceIds = new Set(ALL_PRACTICE_QUESTIONS.map((p) => p.id));
const planIds = new Set<string>();
for (const item of eval1.personalisedPracticePlan ?? []) {
  assert.ok(practiceIds.has(item.questionId), `Unknown practice ID: ${item.questionId}`);
  assert.ok(!planIds.has(item.questionId), `Duplicate practice ID in plan: ${item.questionId}`);
  planIds.add(item.questionId);
}

// 4. Simulate Attempt 2 (Retake improvement): all correct except 1
const attempt2Answers: Record<string, number> = {};
for (const q of DIAGNOSTIC_QUESTIONS) {
  attempt2Answers[q.id] = q.id === 'diag-18' ? (q.correctIndex + 1) % 4 : q.correctIndex;
}
const eval2 = evaluateDiagnosticAttempt(attempt2Answers, 2);
assert.equal(eval2.score, 17);
assert.equal(eval2.percentage, 94);
assert.equal(eval2.performanceBand, 'excellent');
assert.equal(eval2.strongConcepts?.length, 5);
assert.equal(eval2.weakConcepts?.length, 1);
assert.equal(eval2.weakConcepts?.[0].topicId, 'linear-systems');

const comp = computeAttemptComparison([eval1, eval2]);
assert.ok(comp !== null);
assert.equal(comp.totalAttempts, 2);
assert.equal(comp.firstAttemptPct, 56);
assert.equal(comp.latestAttemptPct, 94);
assert.equal(comp.deltaFromFirst, 38);

console.log('VERIFIED RULE-BASED DIAGNOSTIC & REMEDIATION ENGINE');
