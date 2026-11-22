export type BoardBankCategory =
  | 'conceptual-mcqs'
  | 'definitions-properties'
  | 'add-sub'
  | 'multiplication'
  | 'determinants'
  | 'singular-nonsingular'
  | 'adjoint-inverse'
  | 'cramers-rule'
  | 'matrix-inversion'
  | 'simultaneous-equations';

export const BOARD_CATEGORY_LABELS: Record<BoardBankCategory, string> = {
  'conceptual-mcqs': '1. Conceptual MCQs',
  'definitions-properties': '2. Definitions & Properties',
  'add-sub': '3. Matrix Addition & Subtraction',
  multiplication: '4. Matrix Multiplication',
  determinants: '5. Determinants',
  'singular-nonsingular': '6. Singular & Non-Singular Matrices',
  'adjoint-inverse': '7. Adjoint & Inverse',
  'cramers-rule': "8. Cramer's Rule",
  'matrix-inversion': '9. Matrix Inversion Method',
  'simultaneous-equations': '10. Simultaneous Equations',
};

export type QuestionSourceLabel =
  | 'Board-style practice'
  | 'Textbook-based'
  | 'Conceptual practice'
  | 'Past-paper question';

export interface ShortGroupConfig {
  id: 'Q2' | 'Q3' | 'Q4';
  title: string;
  totalQuestions: number;
  attemptRequired: number;
  marksPerQuestion: number;
}

export interface BoardExamConfig {
  examTitle: string;
  durationMinutes: number;
  objective: {
    title: string;
    totalQuestions: number;
    marksPerQuestion: number;
  };
  shortGroups: ShortGroupConfig[];
  longSection: {
    title: string;
    totalQuestions: number;
    attemptRequired: number;
    marksPerQuestion: number;
    choicePatternNote: string;
  };
}

export const DEFAULT_PUNJAB_BOARD_CONFIG: BoardExamConfig = {
  examTitle: 'Grade 9 Mathematics · Unit 1 Full-Pattern Practice Paper (75 Marks)',
  durationMinutes: 150,
  objective: {
    title: 'Part I — Objective (MCQs)',
    totalQuestions: 15,
    marksPerQuestion: 1,
  },
  shortGroups: [
    {
      id: 'Q2',
      title: 'Q2 — Short Questions (Attempt 6 out of 9)',
      totalQuestions: 9,
      attemptRequired: 6,
      marksPerQuestion: 2,
    },
    {
      id: 'Q3',
      title: 'Q3 — Short Questions (Attempt 6 out of 9)',
      totalQuestions: 9,
      attemptRequired: 6,
      marksPerQuestion: 2,
    },
    {
      id: 'Q4',
      title: 'Q4 — Short Questions (Attempt 6 out of 9)',
      totalQuestions: 9,
      attemptRequired: 6,
      marksPerQuestion: 2,
    },
  ],
  longSection: {
    title: 'Part III — Long Questions (Attempt 3 out of 5)',
    totalQuestions: 5,
    attemptRequired: 3,
    marksPerQuestion: 8,
    choicePatternNote:
      'Prescribed choice pattern: Attempt any 3 out of 5 questions (Q5–Q9). Each 8-mark question consists of Part (a) [4 marks] and Part (b) [4 marks].',
  },
};

export function computeConfigTotalMarks(config: BoardExamConfig): {
  objectiveMarks: number;
  shortMarks: number;
  longMarks: number;
  totalMarks: number;
} {
  const objectiveMarks = config.objective.totalQuestions * config.objective.marksPerQuestion;
  const shortMarks = config.shortGroups.reduce(
    (acc, g) => acc + g.attemptRequired * g.marksPerQuestion,
    0
  );
  const longMarks =
    config.longSection.attemptRequired * config.longSection.marksPerQuestion;

  return {
    objectiveMarks,
    shortMarks,
    longMarks,
    totalMarks: objectiveMarks + shortMarks + longMarks,
  };
}
