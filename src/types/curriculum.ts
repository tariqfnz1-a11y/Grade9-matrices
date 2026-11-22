export type SectionId =
  | 'dashboard'
  | 'diagnostic'
  | 'learn'
  | 'lab'
  | 'examples'
  | 'practice'
  | 'revision'
  | 'board-prep'
  | 'applications'
  | 'final-assessment'
  | 'progress';

export type TopicId =
  | 'order-equality'
  | 'types-transpose'
  | 'add-sub'
  | 'multiplication'
  | 'determinant-inverse'
  | 'linear-systems';

export interface NavItem {
  id: SectionId;
  number: string;
  label: string;
  shortLabel: string;
  phase: 'Start' | 'Learn & Explore' | 'Practice & Exam' | 'Track';
  description: string;
}

export interface ConceptLesson {
  id: TopicId;
  exerciseRef: string;
  title: string;
  subtitle: string;
  learningObjectives: string[];
  keyDefinitions: {
    term: string;
    definition: string;
    formulaLatex?: string;
    exampleLatex?: string;
  }[];
  propertiesAndRules: {
    title: string;
    latex: string;
    note: string;
  }[];
  commonMistakes: {
    mistake: string;
    correction: string;
  }[];
  quickCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface WorkedExample {
  id: string;
  topicId: TopicId;
  exerciseRef: string;
  title: string;
  difficulty: 'Foundational' | 'Standard' | 'Board Level';
  problemStatement: string;
  steps: {
    label: string;
    explanation: string;
    mathLatex: string;
  }[];
  finalAnswerLatex: string;
  examinerTip: string;
}

export interface QuizQuestion {
  id: string;
  topicId: TopicId;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  conceptTag?: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  hint: string;
  solutionSteps: string[];
}

export type PracticeQuestionType =
  | 'mcq'
  | 'true-false'
  | 'fill-blank'
  | 'find-error'
  | 'solve-problem';

interface BasePracticeQuestion {
  id: string;
  topicId: TopicId;
  type: PracticeQuestionType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prompt: string;
  hint: string;
  explanation: string;
}

export interface McqPracticeQuestion extends BasePracticeQuestion {
  type: 'mcq';
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
}

export interface TrueFalsePracticeQuestion extends BasePracticeQuestion {
  type: 'true-false';
  statement: string;
  correctBoolean: boolean;
}

export interface FillBlankPracticeQuestion extends BasePracticeQuestion {
  type: 'fill-blank';
  acceptedAnswers: string[];
  displayAnswer: string;
}

export interface FindErrorPracticeQuestion extends BasePracticeQuestion {
  type: 'find-error';
  flawedWorkLatex: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  correctProcedureLatex: string;
}

export interface SolveProblemPracticeQuestion extends BasePracticeQuestion {
  type: 'solve-problem';
  expectedNumeric: number;
  displayAnswer: string;
  unitLabel?: string;
  workedSolutionLatex: string;
}

export type PracticeQuestion =
  | McqPracticeQuestion
  | TrueFalsePracticeQuestion
  | FillBlankPracticeQuestion
  | FindErrorPracticeQuestion
  | SolveProblemPracticeQuestion;

export interface RevisionCard {
  id: string;
  topicId: TopicId;
  frontTitle: string;
  frontPrompt: string;
  backAnswer: string;
  backLatex?: string;
}

export interface BoardQuestion {
  id: string;
  part: 'MCQ' | 'Short Question' | 'Long Question';
  marks: number;
  yearTag: string;
  topicId: TopicId;
  question: string;
  options?: string[];
  correctIndex?: number;
  markingScheme: string[];
  modelAnswerLatex: string;
}

export type PerformanceBandId =
  | 'foundational'
  | 'developing'
  | 'satisfactory'
  | 'strong'
  | 'excellent';

export interface PerformanceBand {
  id: PerformanceBandId;
  label: string;
  rangeText: string;
  summary: string;
  encouragement: string;
}

export interface TopicConceptDiagnosis {
  topicId: TopicId;
  correct: number;
  total: number;
  percentage: number;
  bandId: PerformanceBandId;
  concepts: string[];
  severity?: 'High' | 'Medium';
}

export interface LessonRecommendation {
  topicId: TopicId;
  exerciseRef: string;
  lessonTitle: string;
  priority: 'High' | 'Medium';
  reason: string;
  focusConcepts: string[];
  suggestedLabTab?: string;
}

export interface PersonalisedPracticeItem {
  questionId: string;
  topicId: TopicId;
  stage: 'Repair Foundation' | 'Consolidate Concept' | 'Transfer & Mastery';
  reason: string;
}

export interface DiagnosticResult {
  attemptNumber?: number;
  completedAt: string;
  score: number;
  total: number;
  percentage?: number;
  performanceBand?: PerformanceBandId;
  topicScores: Record<TopicId, { correct: number; total: number }>;
  answers?: Record<string, number>;
  wrongQuestionIds?: string[];
  strongConcepts?: TopicConceptDiagnosis[];
  weakConcepts?: TopicConceptDiagnosis[];
  recommendedLessons?: LessonRecommendation[];
  personalisedPracticePlan?: PersonalisedPracticeItem[];
}

export interface FinalAssessmentResult {
  completedAt: string;
  score: number;
  total: number;
  durationSeconds: number;
  topicScores: Record<TopicId, { correct: number; total: number }>;
}

export interface StudentProgress {
  completedLessons: TopicId[];
  studiedExamples: string[];
  labModulesExplored: string[];
  practiceStats: {
    attempted: number;
    correct: number;
    currentStreak: number;
    bestStreak: number;
    byTopic: Record<TopicId, { attempted: number; correct: number }>;
  };
  diagnosticResult: DiagnosticResult | null;
  diagnosticHistory: DiagnosticResult[];
  finalAssessments: FinalAssessmentResult[];
  flashcardsReviewed: string[];
  boardQuestionsChecked: string[];
  applicationsSolved: string[];
  lastVisitedSection?: SectionId;
  lastLessonTopic?: TopicId;
}
