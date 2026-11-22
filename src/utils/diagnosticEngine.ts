import { ALL_PRACTICE_QUESTIONS } from '../data/practiceBank';
import { CONCEPT_LESSONS, DIAGNOSTIC_QUESTIONS, TOPIC_LABELS } from '../data/unit1Content';
import type {
  DiagnosticResult,
  LessonRecommendation,
  PerformanceBand,
  PerformanceBandId,
  PersonalisedPracticeItem,
  PracticeQuestion,
  QuizQuestion,
  TopicConceptDiagnosis,
  TopicId,
} from '../types/curriculum';

const TOPIC_ORDER: TopicId[] = [
  'order-equality',
  'types-transpose',
  'add-sub',
  'multiplication',
  'determinant-inverse',
  'linear-systems',
];

const TOPIC_LAB_RECOMMENDATIONS: Record<TopicId, string> = {
  'order-equality': '1. Matrix Builder',
  'types-transpose': '2. Transpose Simulator',
  'add-sub': '3. Addition & Subtraction',
  multiplication: '4. Multiplication Lab',
  'determinant-inverse': '5. Determinant & 6. Inverse Simulator',
  'linear-systems': "7. Cramer's Rule Explorer",
};

export const PERFORMANCE_BANDS: Record<PerformanceBandId, PerformanceBand> = {
  foundational: {
    id: 'foundational',
    label: 'Needs foundational support',
    rangeText: 'Below 40%',
    summary:
      'You are at the starting line for these concepts. Building clear definitions and step-by-step habits will raise your accuracy quickly.',
    encouragement:
      'This snapshot shows where to start—not a limit on what you can learn. Begin with the recommended Concept Lessons and Interactive Math Lab.',
  },
  developing: {
    id: 'developing',
    label: 'Developing understanding',
    rangeText: '40–59%',
    summary:
      'You recognise several core matrix ideas, while a few procedural rules need guided reinforcement.',
    encouragement:
      'Consistent practice on your focus concepts will turn partial ideas into reliable exam marks. Review the targeted lessons below and retry.',
  },
  satisfactory: {
    id: 'satisfactory',
    label: 'Satisfactory understanding',
    rangeText: '60–79%',
    summary:
      'You have a working grasp of most Unit 1 procedures and can sharpen specific weak spots to reach top marks.',
    encouragement:
      'You are building solid momentum. Work through the missed-concept practice sequence below to close the remaining gaps.',
  },
  strong: {
    id: 'strong',
    label: 'Strong understanding',
    rangeText: '80–89%',
    summary:
      'Your command of matrix algebra is strong across most syllabus exercises, with only minor details to polish.',
    encouragement:
      'Great work so far! Tackle the targeted drill items below and test yourself again to aim for full mastery.',
  },
  excellent: {
    id: 'excellent',
    label: 'Excellent understanding',
    rangeText: '90–100%',
    summary:
      'You demonstrate thorough accuracy across matrix definitions, operations, determinants, and equation solving.',
    encouragement:
      'Keep your skills sharp with board-level problem solving and the Final Unit Assessment.',
  },
};

export function classifyPerformanceBand(percentage: number): PerformanceBand {
  if (percentage < 40) return PERFORMANCE_BANDS.foundational;
  if (percentage < 60) return PERFORMANCE_BANDS.developing;
  if (percentage < 80) return PERFORMANCE_BANDS.satisfactory;
  if (percentage < 90) return PERFORMANCE_BANDS.strong;
  return PERFORMANCE_BANDS.excellent;
}

export function getBandBadgeColors(bandId: PerformanceBandId): {
  bg: string;
  border: string;
  text: string;
  bar: string;
} {
  switch (bandId) {
    case 'foundational':
      return {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        text: 'text-rose-800',
        bar: '#E11D48',
      };
    case 'developing':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        bar: '#D97706',
      };
    case 'satisfactory':
      return {
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        text: 'text-sky-800',
        bar: '#0284C7',
      };
    case 'strong':
      return {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        text: 'text-[#0F766E]',
        bar: '#0D9488',
      };
    case 'excellent':
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-800',
        bar: '#059669',
      };
  }
}

function buildDiagnosticDiagnosis(
  topicScores: Record<TopicId, { correct: number; total: number }>,
  answers: Record<string, number>,
  questions: QuizQuestion[],
  practiceBank: PracticeQuestion[]
): {
  strongConcepts: TopicConceptDiagnosis[];
  weakConcepts: TopicConceptDiagnosis[];
  recommendedLessons: LessonRecommendation[];
  personalisedPracticePlan: PersonalisedPracticeItem[];
  wrongQuestionIds: string[];
} {
  const wrongQuestions = questions.filter((q) => answers[q.id] !== q.correctIndex);
  const wrongQuestionIds = wrongQuestions.map((q) => q.id);

  const strongConcepts: TopicConceptDiagnosis[] = [];
  const weakConcepts: TopicConceptDiagnosis[] = [];

  for (const tid of TOPIC_ORDER) {
    const stat = topicScores[tid] ?? { correct: 0, total: 0 };
    const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    const band = classifyPerformanceBand(pct);

    const topicQuestions = questions.filter((q) => q.topicId === tid);
    const correctTags = topicQuestions
      .filter((q) => answers[q.id] === q.correctIndex)
      .map((q) => q.conceptTag ?? TOPIC_LABELS[tid].title);
    const missedTags = topicQuestions
      .filter((q) => answers[q.id] !== q.correctIndex)
      .map((q) => q.conceptTag ?? TOPIC_LABELS[tid].title);

    if (pct >= 80) {
      strongConcepts.push({
        topicId: tid,
        correct: stat.correct,
        total: stat.total,
        percentage: pct,
        bandId: band.id,
        concepts: correctTags.length > 0 ? correctTags : [TOPIC_LABELS[tid].title],
      });
    } else {
      weakConcepts.push({
        topicId: tid,
        correct: stat.correct,
        total: stat.total,
        percentage: pct,
        bandId: band.id,
        severity: pct < 60 ? 'High' : 'Medium',
        concepts: missedTags.length > 0 ? missedTags : [TOPIC_LABELS[tid].title],
      });
    }
  }

  // Sort weak topics by lowest accuracy first, then syllabus order
  const sortedWeak = [...weakConcepts].sort((a, b) => {
    if (a.percentage !== b.percentage) return a.percentage - b.percentage;
    return TOPIC_ORDER.indexOf(a.topicId) - TOPIC_ORDER.indexOf(b.topicId);
  });

  // Rule-based lesson recommendations
  const recommendedLessons: LessonRecommendation[] = sortedWeak.map((wt) => {
    const lesson = CONCEPT_LESSONS.find((l) => l.id === wt.topicId);
    const priority: 'High' | 'Medium' = wt.percentage < 60 ? 'High' : 'Medium';
    const focusList = wt.concepts.join(', ');
    return {
      topicId: wt.topicId,
      exerciseRef: lesson?.exerciseRef ?? TOPIC_LABELS[wt.topicId].exercise,
      lessonTitle: lesson?.title ?? TOPIC_LABELS[wt.topicId].title,
      priority,
      reason:
        wt.percentage < 40
          ? `Scored ${wt.correct}/${wt.total} (${wt.percentage}%). Revise foundational definitions and worked examples for: ${focusList}.`
          : wt.percentage < 60
            ? `Scored ${wt.correct}/${wt.total} (${wt.percentage}%). Revisit step-by-step rules for: ${focusList}.`
            : `Scored ${wt.correct}/${wt.total} (${wt.percentage}%). Polish edge cases in: ${focusList}.`,
      focusConcepts: wt.concepts,
      suggestedLabTab: TOPIC_LAB_RECOMMENDATIONS[wt.topicId],
    };
  });

  // Generate personalised practice sequence based on incorrect answers
  const personalisedPracticePlan: PersonalisedPracticeItem[] = [];
  const usedIds = new Set<string>();

  const difficultyRank: Record<PracticeQuestion['difficulty'], number> = {
    Easy: 0,
    Medium: 1,
    Hard: 2,
  };

  const typeOrderForRemediation: Record<PracticeQuestion['type'], number> = {
    'true-false': 0,
    'fill-blank': 1,
    mcq: 2,
    'find-error': 3,
    'solve-problem': 4,
  };

  // Stage 1: Repair Foundation from specific incorrect diagnostic questions (ordered weakest topic first)
  for (const wt of sortedWeak) {
    const missedInTopic = wrongQuestions.filter((q) => q.topicId === wt.topicId);
    const pool = practiceBank
      .filter((pq) => pq.topicId === wt.topicId && !usedIds.has(pq.id))
      .sort((a, b) => {
        const dDiff = difficultyRank[a.difficulty] - difficultyRank[b.difficulty];
        if (dDiff !== 0) return dDiff;
        return typeOrderForRemediation[a.type] - typeOrderForRemediation[b.type];
      });

    // Pick 2 targeted items per missed diagnostic question (capped cleanly)
    const countToTake = Math.min(pool.length, Math.max(2, missedInTopic.length * 2));
    for (let i = 0; i < countToTake; i++) {
      const candidate = pool[i];
      if (!candidate || usedIds.has(candidate.id)) continue;
      usedIds.add(candidate.id);
      const refTag =
        missedInTopic[i % Math.max(1, missedInTopic.length)]?.conceptTag ??
        TOPIC_LABELS[wt.topicId].title;
      personalisedPracticePlan.push({
        questionId: candidate.id,
        topicId: wt.topicId,
        stage: wt.percentage < 60 ? 'Repair Foundation' : 'Consolidate Concept',
        reason: `Targeted from missed concept: ${refTag} (${TOPIC_LABELS[wt.topicId].exercise})`,
      });
    }
  }

  // Stage 2: Transfer & Mastery check (higher-order solve-problem / find-error questions)
  if (personalisedPracticePlan.length > 0) {
    for (const wt of sortedWeak.slice(0, 3)) {
      const challenge = practiceBank.find(
        (pq) =>
          pq.topicId === wt.topicId &&
          !usedIds.has(pq.id) &&
          (pq.type === 'find-error' || pq.type === 'solve-problem')
      );
      if (challenge) {
        usedIds.add(challenge.id);
        personalisedPracticePlan.push({
          questionId: challenge.id,
          topicId: wt.topicId,
          stage: 'Transfer & Mastery',
          reason: `Verify independent mastery on ${TOPIC_LABELS[wt.topicId].exercise} (${challenge.type === 'find-error' ? 'Spot the Mistake' : 'Numerical Application'})`,
        });
      }
    }
  } else {
    // Student answered every diagnostic question correctly -> build 6-question Mastery Extension sequence
    for (const tid of TOPIC_ORDER) {
      const extension =
        practiceBank.find(
          (pq) =>
            pq.topicId === tid &&
            !usedIds.has(pq.id) &&
            pq.difficulty === 'Hard'
        ) ??
        practiceBank.find(
          (pq) =>
            pq.topicId === tid &&
            !usedIds.has(pq.id) &&
            (pq.type === 'solve-problem' || pq.type === 'find-error')
        );
      if (extension) {
        usedIds.add(extension.id);
        personalisedPracticePlan.push({
          questionId: extension.id,
          topicId: tid,
          stage: 'Transfer & Mastery',
          reason: `Extension challenge for ${TOPIC_LABELS[tid].exercise} (Strong baseline verified)`,
        });
      }
    }
  }

  return {
    strongConcepts,
    weakConcepts: sortedWeak,
    recommendedLessons,
    personalisedPracticePlan,
    wrongQuestionIds,
  };
}

export function evaluateDiagnosticAttempt(
  answers: Record<string, number>,
  attemptNumber: number,
  questions: QuizQuestion[] = DIAGNOSTIC_QUESTIONS,
  practiceBank: PracticeQuestion[] = ALL_PRACTICE_QUESTIONS
): DiagnosticResult {
  const topicScores: Record<TopicId, { correct: number; total: number }> = {
    'order-equality': { correct: 0, total: 0 },
    'types-transpose': { correct: 0, total: 0 },
    'add-sub': { correct: 0, total: 0 },
    multiplication: { correct: 0, total: 0 },
    'determinant-inverse': { correct: 0, total: 0 },
    'linear-systems': { correct: 0, total: 0 },
  };

  let score = 0;
  for (const q of questions) {
    topicScores[q.topicId].total += 1;
    if (answers[q.id] === q.correctIndex) {
      score += 1;
      topicScores[q.topicId].correct += 1;
    }
  }

  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const band = classifyPerformanceBand(percentage);

  const diagnosis = buildDiagnosticDiagnosis(topicScores, answers, questions, practiceBank);

  return {
    attemptNumber,
    completedAt: new Date().toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    score,
    total,
    percentage,
    performanceBand: band.id,
    topicScores,
    answers: { ...answers },
    wrongQuestionIds: diagnosis.wrongQuestionIds,
    strongConcepts: diagnosis.strongConcepts,
    weakConcepts: diagnosis.weakConcepts,
    recommendedLessons: diagnosis.recommendedLessons,
    personalisedPracticePlan: diagnosis.personalisedPracticePlan,
  };
}

export function normalizeDiagnosticResult(
  raw: DiagnosticResult,
  fallbackAttemptNumber = 1
): DiagnosticResult {
  const percentage =
    raw.percentage ?? (raw.total > 0 ? Math.round((raw.score / raw.total) * 100) : 0);
  const band = classifyPerformanceBand(percentage);

  if (
    raw.strongConcepts &&
    raw.weakConcepts &&
    raw.recommendedLessons &&
    raw.personalisedPracticePlan
  ) {
    return {
      ...raw,
      attemptNumber: raw.attemptNumber ?? fallbackAttemptNumber,
      percentage,
      performanceBand: raw.performanceBand ?? band.id,
    };
  }

  const diagnosis = buildDiagnosticDiagnosis(
    raw.topicScores,
    raw.answers ?? {},
    DIAGNOSTIC_QUESTIONS,
    ALL_PRACTICE_QUESTIONS
  );

  return {
    ...raw,
    attemptNumber: raw.attemptNumber ?? fallbackAttemptNumber,
    percentage,
    performanceBand: raw.performanceBand ?? band.id,
    wrongQuestionIds: raw.wrongQuestionIds ?? [],
    strongConcepts: diagnosis.strongConcepts,
    weakConcepts: diagnosis.weakConcepts,
    recommendedLessons: diagnosis.recommendedLessons,
    personalisedPracticePlan: diagnosis.personalisedPracticePlan,
  };
}

export interface AttemptComparison {
  totalAttempts: number;
  firstAttemptPct: number;
  previousAttemptPct: number | null;
  latestAttemptPct: number;
  deltaFromFirst: number;
  deltaFromPrevious: number | null;
  topicDeltas: {
    topicId: TopicId;
    firstPct: number;
    latestPct: number;
    delta: number;
  }[];
}

export function computeAttemptComparison(history: DiagnosticResult[]): AttemptComparison | null {
  if (history.length === 0) return null;
  const first = normalizeDiagnosticResult(history[0], 1);
  const latest = normalizeDiagnosticResult(history[history.length - 1], history.length);
  const previous =
    history.length >= 2
      ? normalizeDiagnosticResult(history[history.length - 2], history.length - 1)
      : null;

  const firstPct = first.percentage ?? 0;
  const latestPct = latest.percentage ?? 0;
  const previousPct = previous ? (previous.percentage ?? 0) : null;

  const topicDeltas = TOPIC_ORDER.map((tid) => {
    const f = first.topicScores[tid] ?? { correct: 0, total: 0 };
    const l = latest.topicScores[tid] ?? { correct: 0, total: 0 };
    const fPct = f.total > 0 ? Math.round((f.correct / f.total) * 100) : 0;
    const lPct = l.total > 0 ? Math.round((l.correct / l.total) * 100) : 0;
    return {
      topicId: tid,
      firstPct: fPct,
      latestPct: lPct,
      delta: lPct - fPct,
    };
  });

  return {
    totalAttempts: history.length,
    firstAttemptPct: firstPct,
    previousAttemptPct: previousPct,
    latestAttemptPct: latestPct,
    deltaFromFirst: latestPct - firstPct,
    deltaFromPrevious: previousPct !== null ? latestPct - previousPct : null,
    topicDeltas,
  };
}
