import assert from 'node:assert/strict';
import {
  BOARD_CATEGORY_LABELS,
  type BoardBankCategory,
  computeConfigTotalMarks,
  DEFAULT_PUNJAB_BOARD_CONFIG,
} from './boardExamConfig';
import {
  BOARD_LONG_BANK,
  BOARD_MCQ_BANK,
  BOARD_SHORT_BANK,
  generateBoardPaper,
} from './boardQuestionBank';

// 1. Verify default 75-mark paper math
const totals = computeConfigTotalMarks(DEFAULT_PUNJAB_BOARD_CONFIG);
assert.equal(totals.objectiveMarks, 15);
assert.equal(totals.shortMarks, 36);
assert.equal(totals.longMarks, 24);
assert.equal(totals.totalMarks, 75);

// 2. Verify all 10 categories are represented across the bank
const allCategories = Object.keys(BOARD_CATEGORY_LABELS) as BoardBankCategory[];
const covered = new Set<BoardBankCategory>([
  ...BOARD_MCQ_BANK.map((q) => q.bankCategory),
  ...BOARD_SHORT_BANK.map((q) => q.bankCategory),
  ...BOARD_LONG_BANK.map((q) => q.bankCategory),
  ...BOARD_LONG_BANK.map((q) => q.partA.bankCategory),
  ...BOARD_LONG_BANK.map((q) => q.partB.bankCategory),
]);
for (const cat of allCategories) {
  assert.ok(covered.has(cat), `Missing bank coverage for category: ${cat}`);
}

// 3. Verify bank sizes and integrity
assert.ok(BOARD_MCQ_BANK.length >= 15, 'Need at least 15 MCQs');
assert.ok(BOARD_SHORT_BANK.length >= 27, 'Need at least 27 Short Questions');
assert.ok(BOARD_LONG_BANK.length >= 5, 'Need at least 5 Long Questions');

for (const mcq of BOARD_MCQ_BANK) {
  assert.equal(mcq.options.length, 4);
  assert.equal(new Set(mcq.options).size, 4, `${mcq.id} duplicate options`);
  assert.ok(mcq.correctIndex >= 0 && mcq.correctIndex <= 3);
  assert.notEqual(mcq.sourceLabel, 'Past-paper question');
}

for (const lq of BOARD_LONG_BANK) {
  const sumA = lq.partA.rubricSteps.reduce((s, r) => s + r.marks, 0);
  const sumB = lq.partB.rubricSteps.reduce((s, r) => s + r.marks, 0);
  assert.equal(sumA, 4, `${lq.id} Part A rubric must sum to 4`);
  assert.equal(sumB, 4, `${lq.id} Part B rubric must sum to 4`);
}

// 4. Verify generated paper structure
const paper = generateBoardPaper(DEFAULT_PUNJAB_BOARD_CONFIG, 42);
assert.equal(paper.objectiveMcqs.length, 15);
assert.equal(paper.shortGroups.length, 3);
paper.shortGroups.forEach((g) => assert.equal(g.questions.length, 9));
assert.equal(paper.longQuestions.length, 5);

console.log('VERIFIED PUNJAB BOARD 75-MARK QUESTION BANK & PAPER GENERATOR');
