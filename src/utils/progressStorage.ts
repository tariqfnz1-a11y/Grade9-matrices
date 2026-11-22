import type {
  DiagnosticResult,
  FinalAssessmentResult,
  SectionId,
  StudentProgress,
  TopicId,
} from '../types/curriculum';

const STORAGE_KEY = 'g9_math_unit1_matrices_progress_v1';

const EMPTY_BY_TOPIC: Record<TopicId, { attempted: number; correct: number }> = {
  'order-equality': { attempted: 0, correct: 0 },
  'types-transpose': { attempted: 0, correct: 0 },
  'add-sub': { attempted: 0, correct: 0 },
  multiplication: { attempted: 0, correct: 0 },
  'determinant-inverse': { attempted: 0, correct: 0 },
  'linear-systems': { attempted: 0, correct: 0 },
};

export function createInitialProgress(): StudentProgress {
  return {
    completedLessons: [],
    studiedExamples: [],
    labModulesExplored: [],
    practiceStats: {
      attempted: 0,
      correct: 0,
      currentStreak: 0,
      bestStreak: 0,
      byTopic: {
        'order-equality': { ...EMPTY_BY_TOPIC['order-equality'] },
        'types-transpose': { ...EMPTY_BY_TOPIC['types-transpose'] },
        'add-sub': { ...EMPTY_BY_TOPIC['add-sub'] },
        multiplication: { ...EMPTY_BY_TOPIC['multiplication'] },
        'determinant-inverse': { ...EMPTY_BY_TOPIC['determinant-inverse'] },
        'linear-systems': { ...EMPTY_BY_TOPIC['linear-systems'] },
      },
    },
    diagnosticResult: null,
    diagnosticHistory: [],
    finalAssessments: [],
    flashcardsReviewed: [],
    boardQuestionsChecked: [],
    applicationsSolved: [],
  };
}

export function loadProgress(): StudentProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialProgress();
    const parsed = JSON.parse(raw) as Partial<StudentProgress>;
    const base = createInitialProgress();
    return {
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      studiedExamples: Array.isArray(parsed.studiedExamples) ? parsed.studiedExamples : [],
      labModulesExplored: Array.isArray(parsed.labModulesExplored) ? parsed.labModulesExplored : [],
      practiceStats: {
        attempted: parsed.practiceStats?.attempted ?? 0,
        correct: parsed.practiceStats?.correct ?? 0,
        currentStreak: parsed.practiceStats?.currentStreak ?? 0,
        bestStreak: parsed.practiceStats?.bestStreak ?? 0,
        byTopic: {
          ...base.practiceStats.byTopic,
          ...(parsed.practiceStats?.byTopic ?? {}),
        },
      },
      diagnosticResult: parsed.diagnosticResult ?? null,
      diagnosticHistory: Array.isArray(parsed.diagnosticHistory)
        ? parsed.diagnosticHistory
        : parsed.diagnosticResult
          ? [parsed.diagnosticResult]
          : [],
      finalAssessments: Array.isArray(parsed.finalAssessments) ? parsed.finalAssessments : [],
      flashcardsReviewed: Array.isArray(parsed.flashcardsReviewed) ? parsed.flashcardsReviewed : [],
      boardQuestionsChecked: Array.isArray(parsed.boardQuestionsChecked)
        ? parsed.boardQuestionsChecked
        : [],
      applicationsSolved: Array.isArray(parsed.applicationsSolved) ? parsed.applicationsSolved : [],
      lastVisitedSection: parsed.lastVisitedSection,
      lastLessonTopic: parsed.lastLessonTopic,
    };
  } catch {
    return createInitialProgress();
  }
}

export function saveProgress(progress: StudentProgress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function resetProgressStorage(): StudentProgress {
  const fresh = createInitialProgress();
  saveProgress(fresh);
  return fresh;
}

export function recordSectionVisit(
  current: StudentProgress,
  section: SectionId
): StudentProgress {
  if (section === 'dashboard' || current.lastVisitedSection === section) {
    return current;
  }
  const next: StudentProgress = {
    ...current,
    lastVisitedSection: section,
  };
  saveProgress(next);
  return next;
}

export function recordLastLessonTopic(
  current: StudentProgress,
  topicId: TopicId
): StudentProgress {
  if (current.lastLessonTopic === topicId) return current;
  const next: StudentProgress = {
    ...current,
    lastLessonTopic: topicId,
  };
  saveProgress(next);
  return next;
}

export function toggleLessonCompleted(
  current: StudentProgress,
  topicId: TopicId
): StudentProgress {
  const exists = current.completedLessons.includes(topicId);
  const next: StudentProgress = {
    ...current,
    completedLessons: exists
      ? current.completedLessons.filter((t) => t !== topicId)
      : [...current.completedLessons, topicId],
  };
  saveProgress(next);
  return next;
}

export function markExampleStudied(
  current: StudentProgress,
  exampleId: string
): StudentProgress {
  if (current.studiedExamples.includes(exampleId)) return current;
  const next: StudentProgress = {
    ...current,
    studiedExamples: [...current.studiedExamples, exampleId],
  };
  saveProgress(next);
  return next;
}

export function markLabExplored(
  current: StudentProgress,
  labId: string
): StudentProgress {
  if (current.labModulesExplored.includes(labId)) return current;
  const next: StudentProgress = {
    ...current,
    labModulesExplored: [...current.labModulesExplored, labId],
  };
  saveProgress(next);
  return next;
}

export function markApplicationSolved(
  current: StudentProgress,
  activityId: string
): StudentProgress {
  if (current.applicationsSolved.includes(activityId)) return current;
  const next: StudentProgress = {
    ...current,
    applicationsSolved: [...current.applicationsSolved, activityId],
  };
  saveProgress(next);
  return next;
}

export function recordPracticeAttempt(
  current: StudentProgress,
  topicId: TopicId,
  isCorrect: boolean
): StudentProgress {
  const prevTopic = current.practiceStats.byTopic[topicId] ?? { attempted: 0, correct: 0 };
  const nextStreak = isCorrect ? current.practiceStats.currentStreak + 1 : 0;
  const next: StudentProgress = {
    ...current,
    practiceStats: {
      attempted: current.practiceStats.attempted + 1,
      correct: current.practiceStats.correct + (isCorrect ? 1 : 0),
      currentStreak: nextStreak,
      bestStreak: Math.max(current.practiceStats.bestStreak, nextStreak),
      byTopic: {
        ...current.practiceStats.byTopic,
        [topicId]: {
          attempted: prevTopic.attempted + 1,
          correct: prevTopic.correct + (isCorrect ? 1 : 0),
        },
      },
    },
  };
  saveProgress(next);
  return next;
}

export function saveDiagnosticResult(
  current: StudentProgress,
  result: DiagnosticResult
): StudentProgress {
  const nextHistory = [...current.diagnosticHistory, result].slice(-12);
  const next: StudentProgress = {
    ...current,
    diagnosticResult: result,
    diagnosticHistory: nextHistory,
  };
  saveProgress(next);
  return next;
}

export function saveFinalAssessmentResult(
  current: StudentProgress,
  result: FinalAssessmentResult
): StudentProgress {
  const next: StudentProgress = {
    ...current,
    finalAssessments: [result, ...current.finalAssessments].slice(0, 10),
  };
  saveProgress(next);
  return next;
}

export function markFlashcardReviewed(
  current: StudentProgress,
  cardId: string
): StudentProgress {
  if (current.flashcardsReviewed.includes(cardId)) return current;
  const next: StudentProgress = {
    ...current,
    flashcardsReviewed: [...current.flashcardsReviewed, cardId],
  };
  saveProgress(next);
  return next;
}

export function markBoardQuestionChecked(
  current: StudentProgress,
  questionId: string
): StudentProgress {
  if (current.boardQuestionsChecked.includes(questionId)) return current;
  const next: StudentProgress = {
    ...current,
    boardQuestionsChecked: [...current.boardQuestionsChecked, questionId],
  };
  saveProgress(next);
  return next;
}

export type ModuleCompletionStatus = 'completed' | 'in-progress' | 'not-started';

export interface ModuleCompletionInfo {
  status: ModuleCompletionStatus;
  badgeText: string | null;
  statusLabel: string;
}

export function getModuleCompletionInfo(
  id: SectionId,
  progress: StudentProgress
): ModuleCompletionInfo {
  switch (id) {
    case 'dashboard':
      return { status: 'in-progress', badgeText: null, statusLabel: 'Unit Home' };

    case 'diagnostic': {
      if (progress.diagnosticResult) {
        return {
          status: 'completed',
          badgeText: `${progress.diagnosticResult.score}/${progress.diagnosticResult.total}`,
          statusLabel: 'Completed',
        };
      }
      return { status: 'not-started', badgeText: null, statusLabel: 'Not started' };
    }

    case 'learn': {
      const done = progress.completedLessons.length;
      return {
        status: done >= 6 ? 'completed' : done > 0 ? 'in-progress' : 'not-started',
        badgeText: `${done}/6`,
        statusLabel: done >= 6 ? 'Completed' : done > 0 ? `${done}/6 Done` : 'Not started',
      };
    }

    case 'lab': {
      const count = progress.labModulesExplored.length;
      return {
        status: count >= 7 ? 'completed' : count > 0 ? 'in-progress' : 'not-started',
        badgeText: `${count}/7`,
        statusLabel: count >= 7 ? 'All Explored' : count > 0 ? `${count}/7 Explored` : 'Not started',
      };
    }

    case 'examples': {
      const count = progress.studiedExamples.length;
      return {
        status: count >= 6 ? 'completed' : count > 0 ? 'in-progress' : 'not-started',
        badgeText: `${count}/6`,
        statusLabel: count >= 6 ? 'Completed' : count > 0 ? `${count}/6 Studied` : 'Not started',
      };
    }

    case 'practice': {
      const { attempted, correct } = progress.practiceStats;
      if (attempted === 0) {
        return { status: 'not-started', badgeText: null, statusLabel: 'Not started' };
      }
      const acc = Math.round((correct / attempted) * 100);
      const done = attempted >= 15 && acc >= 70;
      return {
        status: done ? 'completed' : 'in-progress',
        badgeText: `${correct}/${attempted}`,
        statusLabel: done ? 'Target Met' : `${attempted} Solved`,
      };
    }

    case 'revision': {
      const count = progress.flashcardsReviewed.length;
      return {
        status: count >= 10 ? 'completed' : count > 0 ? 'in-progress' : 'not-started',
        badgeText: `${count}/15`,
        statusLabel:
          count >= 10 ? 'Completed' : count > 0 ? `${count}/15 Cards` : 'Ready to review',
      };
    }

    case 'board-prep': {
      const count = progress.boardQuestionsChecked.length;
      return {
        status: count >= 5 ? 'completed' : count > 0 ? 'in-progress' : 'not-started',
        badgeText: count > 0 ? `${count}` : null,
        statusLabel:
          count >= 5 ? 'Practiced' : count > 0 ? `${count} Checked` : 'Not started',
      };
    }

    case 'applications': {
      const count = progress.applicationsSolved.length;
      return {
        status: count >= 5 ? 'completed' : count > 0 ? 'in-progress' : 'not-started',
        badgeText: `${count}/5`,
        statusLabel: count >= 5 ? 'Completed' : count > 0 ? `${count}/5 Solved` : 'Not started',
      };
    }

    case 'final-assessment': {
      const latest = progress.finalAssessments[0];
      if (!latest) {
        return { status: 'not-started', badgeText: null, statusLabel: 'Not attempted' };
      }
      const pct = Math.round((latest.score / latest.total) * 100);
      return {
        status: pct >= 80 ? 'completed' : 'in-progress',
        badgeText: `${latest.score}/${latest.total}`,
        statusLabel: pct >= 80 ? 'Mastered' : `${pct}% Score`,
      };
    }

    case 'progress': {
      const hasActivity =
        progress.diagnosticResult !== null ||
        progress.completedLessons.length > 0 ||
        progress.practiceStats.attempted > 0 ||
        progress.finalAssessments.length > 0;
      return {
        status: hasActivity ? 'in-progress' : 'not-started',
        badgeText: null,
        statusLabel: hasActivity ? 'Tracking Active' : 'No data yet',
      };
    }
  }
}

export function computeUnitCompletion(progress: StudentProgress): {
  percent: number;
  completedModules: number;
  totalModules: number;
} {
  const milestones: number[] = [
    progress.diagnosticResult ? 1 : 0,
    Math.min(1, progress.completedLessons.length / 6),
    Math.min(1, progress.labModulesExplored.length / 7),
    Math.min(1, progress.studiedExamples.length / 6),
    Math.min(1, progress.practiceStats.attempted / 15),
    Math.min(1, progress.flashcardsReviewed.length / 10),
    Math.min(1, progress.boardQuestionsChecked.length / 5),
    Math.min(1, progress.applicationsSolved.length / 5),
    progress.finalAssessments.length > 0
      ? Math.min(1, progress.finalAssessments[0].score / Math.max(1, progress.finalAssessments[0].total * 0.8))
      : 0,
  ];

  const completedModules = milestones.filter((m) => m >= 1).length;
  const sum = milestones.reduce((acc, val) => acc + val, 0);
  const percent = Math.round((sum / milestones.length) * 100);

  return {
    percent,
    completedModules,
    totalModules: milestones.length,
  };
}
