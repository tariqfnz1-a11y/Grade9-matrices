import type {
  BoardBankCategory,
  BoardExamConfig,
  QuestionSourceLabel,
} from './boardExamConfig';

export interface BoardMcqItem {
  id: string;
  bankCategory: BoardBankCategory;
  sourceLabel: QuestionSourceLabel;
  sourceNote: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface BoardShortItem {
  id: string;
  bankCategory: BoardBankCategory;
  sourceLabel: QuestionSourceLabel;
  sourceNote: string;
  prompt: string;
  modelSolutionLatex: string;
  markingPoints: [string, string]; // 2 marks total (1 mark each)
}

export interface BoardLongPart {
  label: '(a)' | '(b)';
  marks: 4;
  bankCategory: BoardBankCategory;
  prompt: string;
  modelSolutionLatex: string;
  rubricSteps: { step: string; marks: 1 }[]; // 4 x 1 = 4 marks
}

export interface BoardLongItem {
  id: string;
  bankCategory: BoardBankCategory;
  sourceLabel: QuestionSourceLabel;
  sourceNote: string;
  partA: BoardLongPart;
  partB: BoardLongPart;
}

export const BOARD_MCQ_BANK: BoardMcqItem[] = [
  {
    id: 'bm-1',
    bankCategory: 'conceptual-mcqs',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Grade 9 Review Exercise 1',
    prompt: 'The order of matrix $\\begin{bmatrix} 2 & 1 \\end{bmatrix}$ is:',
    options: ['2-by-1', '1-by-2', '1-by-1', '2-by-2'],
    correctIndex: 1,
    explanation: 'It has 1 row and 2 columns, so its order is $1\\text{-by-}2$.',
  },
  {
    id: 'bm-2',
    bankCategory: 'conceptual-mcqs',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Grade 9 Review Exercise 1',
    prompt: 'The matrix $\\begin{bmatrix} \\sqrt{2} & 0 \\\\ 0 & \\sqrt{2} \\end{bmatrix}$ is called a:',
    options: ['Zero matrix', 'Unit matrix', 'Scalar matrix', 'Singular matrix'],
    correctIndex: 2,
    explanation: 'All off-diagonal entries are $0$ and diagonal entries are equal to $\\sqrt{2} \\neq 0, 1$, so it is a Scalar matrix.',
  },
  {
    id: 'bm-3',
    bankCategory: 'definitions-properties',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Grade 9 Review Exercise 1',
    prompt: 'Which of the following is the order of a square matrix?',
    options: ['2-by-2', '1-by-2', '2-by-1', '3-by-2'],
    correctIndex: 0,
    explanation: 'A square matrix has equal rows and columns ($m = n$), such as $2\\text{-by-}2$.',
  },
  {
    id: 'bm-4',
    bankCategory: 'definitions-properties',
    sourceLabel: 'Conceptual practice',
    sourceNote: 'Unit 1.2 Symmetry Property',
    prompt: 'A square matrix $A$ satisfying $A^t = -A$ is called:',
    options: ['Symmetric', 'Skew-symmetric', 'Diagonal', 'Scalar'],
    correctIndex: 1,
    explanation: 'By definition, $A^t = -A$ defines a Skew-symmetric matrix.',
  },
  {
    id: 'bm-5',
    bankCategory: 'add-sub',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Grade 9 Review Exercise 1',
    prompt: 'The additive inverse of $\\begin{bmatrix} 1 & -2 \\\\ 0 & -1 \\end{bmatrix}$ is:',
    options: [
      '$\\begin{bmatrix} -1 & 2 \\\\ 0 & 1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & 2 \\\\ 0 & 1 \\end{bmatrix}$',
      '$\\begin{bmatrix} -1 & -2 \\\\ 0 & -1 \\end{bmatrix}$',
      '$\\begin{bmatrix} -1 & 0 \\\\ 2 & 1 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    explanation: 'Negating every entry changes signs: $-A = \\begin{bmatrix} -1 & 2 \\\\ 0 & 1 \\end{bmatrix}$.',
  },
  {
    id: 'bm-6',
    bankCategory: 'add-sub',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Grade 9 Review Exercise 1',
    prompt: 'If $X + \\begin{bmatrix} -1 & -2 \\\\ 0 & -1 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}$, then $X$ equals:',
    options: [
      '$\\begin{bmatrix} 2 & 2 \\\\ 0 & 2 \\end{bmatrix}$',
      '$\\begin{bmatrix} 0 & 2 \\\\ 0 & 0 \\end{bmatrix}$',
      '$\\begin{bmatrix} 2 & 0 \\\\ 0 & 2 \\end{bmatrix}$',
      '$\\begin{bmatrix} -2 & -2 \\\\ 0 & -2 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    explanation: '$X = \\begin{bmatrix} 1-(-1) & 0-(-2) \\\\ 0-0 & 1-(-1) \\end{bmatrix} = \\begin{bmatrix} 2 & 2 \\\\ 0 & 2 \\end{bmatrix}$.',
  },
  {
    id: 'bm-7',
    bankCategory: 'multiplication',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Grade 9 Review Exercise 1',
    prompt: 'Product of $\\begin{bmatrix} x & y \\end{bmatrix} \\begin{bmatrix} 2 \\\\ -1 \\end{bmatrix}$ is:',
    options: ['$[2x + y]$', '$[x - 2y]$', '$[2x - y]$', '$[x + 2y]$'],
    correctIndex: 2,
    explanation: 'Row by column gives $(x)(2) + (y)(-1) = [2x - y]$.',
  },
  {
    id: 'bm-8',
    bankCategory: 'multiplication',
    sourceLabel: 'Conceptual practice',
    sourceNote: 'Unit 1.4 Reversal Law',
    prompt: 'For any two conformable matrices $A$ and $B$, $(AB)^t$ equals:',
    options: ['$A^t B^t$', '$B^t A^t$', '$AB$', '$(BA)^t$'],
    correctIndex: 1,
    explanation: 'The transpose of a product reverses the order: $(AB)^t = B^t A^t$.',
  },
  {
    id: 'bm-9',
    bankCategory: 'determinants',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Grade 9 Review Exercise 1',
    prompt: 'If $\\begin{vmatrix} 2 & 6 \\\\ 3 & x \\end{vmatrix} = 0$, then $x$ is equal to:',
    options: ['9', '-6', '6', '-9'],
    correctIndex: 0,
    explanation: '$(2)(x) - (6)(3) = 0 \\implies 2x = 18 \\implies x = 9$.',
  },
  {
    id: 'bm-10',
    bankCategory: 'determinants',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.5 Determinant Practice',
    prompt: 'The determinant of $\\begin{bmatrix} -2 & 3 \\\\ -4 & 5 \\end{bmatrix}$ is:',
    options: ['2', '-2', '-22', '22'],
    correctIndex: 0,
    explanation: '$(-2)(5) - (3)(-4) = -10 + 12 = 2$.',
  },
  {
    id: 'bm-11',
    bankCategory: 'singular-nonsingular',
    sourceLabel: 'Conceptual practice',
    sourceNote: 'Unit 1.5 Singularity Condition',
    prompt: 'A square matrix $A$ is called singular if:',
    options: ['$|A| = 0$', '$|A| \\neq 0$', '$A^t = A$', '$A = I$'],
    correctIndex: 0,
    explanation: 'By definition, a square matrix is singular when its determinant is zero ($|A| = 0$).',
  },
  {
    id: 'bm-12',
    bankCategory: 'singular-nonsingular',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.5 Singularity Check',
    prompt: 'Which of the following matrices is singular?',
    options: [
      '$\\begin{bmatrix} 3 & 6 \\\\ 2 & 4 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 2 & -1 \\\\ 1 & 3 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    explanation: '$\\begin{vmatrix} 3 & 6 \\\\ 2 & 4 \\end{vmatrix} = 12 - 12 = 0$, so it is singular.',
  },
  {
    id: 'bm-13',
    bankCategory: 'adjoint-inverse',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Grade 9 Review Exercise 1',
    prompt: 'Adjoint of $\\begin{bmatrix} 1 & -2 \\\\ 0 & -1 \\end{bmatrix}$ is:',
    options: [
      '$\\begin{bmatrix} -1 & 2 \\\\ 0 & 1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & 2 \\\\ 0 & -1 \\end{bmatrix}$',
      '$\\begin{bmatrix} -1 & -2 \\\\ 0 & 1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & 0 \\\\ -2 & -1 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    explanation: 'Swap $1$ and $-1$, and negate $-2$ and $0$ to obtain $\\begin{bmatrix} -1 & 2 \\\\ 0 & 1 \\end{bmatrix}$.',
  },
  {
    id: 'bm-14',
    bankCategory: 'adjoint-inverse',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.5 Inverse Calculation',
    prompt: 'If $A = \\begin{bmatrix} 3 & 1 \\\\ 5 & 2 \\end{bmatrix}$, then $A^{-1}$ is:',
    options: [
      '$\\begin{bmatrix} 2 & -1 \\\\ -5 & 3 \\end{bmatrix}$',
      '$\\begin{bmatrix} 2 & 1 \\\\ 5 & 3 \\end{bmatrix}$',
      '$\\begin{bmatrix} 3 & -1 \\\\ -5 & 2 \\end{bmatrix}$',
      '$\\begin{bmatrix} -2 & 1 \\\\ 5 & -3 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    explanation: '$|A| = 6 - 5 = 1$, so $A^{-1} = \\operatorname{Adj}(A) = \\begin{bmatrix} 2 & -1 \\\\ -5 & 3 \\end{bmatrix}$.',
  },
  {
    id: 'bm-15',
    bankCategory: 'cramers-rule',
    sourceLabel: 'Conceptual practice',
    sourceNote: 'Unit 1.6 Cramer Formula',
    prompt: 'According to Cramer’s Rule, if $|A| \\neq 0$, then $x$ equals:',
    options: [
      '$\\frac{|A_x|}{|A|}$',
      '$\\frac{|A|}{|A_x|}$',
      '$\\frac{|A_y|}{|A|}$',
      '$|A_x| \\cdot |A|$',
    ],
    correctIndex: 0,
    explanation: 'Cramer’s Rule gives $x = \\frac{|A_x|}{|A|}$ and $y = \\frac{|A_y|}{|A|}$.',
  },
  {
    id: 'bm-16',
    bankCategory: 'cramers-rule',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.6 Determinant Ax',
    prompt: 'For $2x + y = 3$ and $6x + 5y = 1$, the value of $|A_x|$ is:',
    options: ['14', '4', '-14', '16'],
    correctIndex: 0,
    explanation: '$|A_x| = \\begin{vmatrix} 3 & 1 \\\\ 1 & 5 \\end{vmatrix} = 15 - 1 = 14$.',
  },
  {
    id: 'bm-17',
    bankCategory: 'matrix-inversion',
    sourceLabel: 'Conceptual practice',
    sourceNote: 'Unit 1.6 Matrix Inversion',
    prompt: 'When solving $AX = B$ by the Matrix Inversion Method ($|A| \\neq 0$), $X$ equals:',
    options: ['$A^{-1} B$', '$B A^{-1}$', '$A B$', '$\\operatorname{Adj}(A) B$'],
    correctIndex: 0,
    explanation: 'Multiplying $AX = B$ on the left by $A^{-1}$ yields $X = A^{-1}B$.',
  },
  {
    id: 'bm-18',
    bankCategory: 'matrix-inversion',
    sourceLabel: 'Conceptual practice',
    sourceNote: 'Unit 1.6 Existence Condition',
    prompt: 'A unique solution of $AX = B$ via Matrix Inversion Method exists if and only if:',
    options: ['$|A| \\neq 0$', '$|A| = 0$', '$A = B$', '$B = O$'],
    correctIndex: 0,
    explanation: '$A^{-1}$ exists if and only if $A$ is non-singular ($|A| \\neq 0$).',
  },
  {
    id: 'bm-19',
    bankCategory: 'simultaneous-equations',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.6 Simultaneous System',
    prompt: 'The solution set of $x + y = 7$ and $x - y = 3$ is:',
    options: ['$\\{(5, 2)\\}$', '$\\{(2, 5)\\}$', '$\\{(4, 3)\\}$', '$\\{(10, 4)\\}$'],
    correctIndex: 0,
    explanation: '$x = 5, y = 2$ satisfies $5+2=7$ and $5-2=3$.',
  },
  {
    id: 'bm-20',
    bankCategory: 'conceptual-mcqs',
    sourceLabel: 'Conceptual practice',
    sourceNote: 'Unit 1.4 Product Order',
    prompt: 'If $A$ is of order $2\\times 3$ and $B$ is of order $3\\times 1$, the order of $AB$ is:',
    options: ['2-by-1', '1-by-2', '3-by-3', '2-by-3'],
    correctIndex: 0,
    explanation: '$A_{2\\times 3} B_{3\\times 1}$ yields $(AB)_{2\\times 1}$.',
  },
];

export const BOARD_SHORT_BANK: BoardShortItem[] = [
  {
    id: 'bs-1',
    bankCategory: 'definitions-properties',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Exercise 1.1 Q3',
    prompt:
      'Find the values of $a, b, c$ and $d$ which satisfy $\\begin{bmatrix} a+c & a+2b \\\\ c-1 & 4d-6 \\end{bmatrix} = \\begin{bmatrix} 0 & -7 \\\\ 3 & 2d \\end{bmatrix}$.',
    markingPoints: [
      '1 mark: Equate corresponding entries and solve $c=4, d=3$.',
      '1 mark: Substitute to obtain $a=-4, b=-\\frac{3}{2}$.',
    ],
    modelSolutionLatex:
      'c-1=3 \\implies c=4; \\; 4d-6=2d \\implies d=3; \\; a+4=0 \\implies a=-4; \\; -4+2b=-7 \\implies b=-\\frac{3}{2}',
  },
  {
    id: 'bs-2',
    bankCategory: 'definitions-properties',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Exercise 1.2 Q6',
    prompt: 'If $A = \\begin{bmatrix} 1 & 2 \\\\ 0 & 1 \\end{bmatrix}$, verify that $(A^t)^t = A$.',
    markingPoints: [
      '1 mark: Compute $A^t = \\begin{bmatrix} 1 & 0 \\\\ 2 & 1 \\end{bmatrix}$.',
      '1 mark: Transpose again to show $(A^t)^t = A$.',
    ],
    modelSolutionLatex:
      'A^t = \\begin{bmatrix} 1 & 0 \\\\ 2 & 1 \\end{bmatrix} \\implies (A^t)^t = \\begin{bmatrix} 1 & 2 \\\\ 0 & 1 \\end{bmatrix} = A',
  },
  {
    id: 'bs-3',
    bankCategory: 'definitions-properties',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.2 Symmetric Matrix Check',
    prompt:
      'If $A = \\begin{bmatrix} 1 & 2 \\\\ 0 & 1 \\end{bmatrix}$, show that $A + A^t$ is symmetric.',
    markingPoints: [
      '1 mark: Find $A^t$ and compute $B = A + A^t = \\begin{bmatrix} 2 & 2 \\\\ 2 & 2 \\end{bmatrix}$.',
      '1 mark: Show $B^t = B$, proving $A + A^t$ is symmetric.',
    ],
    modelSolutionLatex:
      'A+A^t = \\begin{bmatrix} 1 & 2 \\\\ 0 & 1 \\end{bmatrix} + \\begin{bmatrix} 1 & 0 \\\\ 2 & 1 \\end{bmatrix} = \\begin{bmatrix} 2 & 2 \\\\ 2 & 2 \\end{bmatrix} = (A+A^t)^t',
  },
  {
    id: 'bs-4',
    bankCategory: 'definitions-properties',
    sourceLabel: 'Conceptual practice',
    sourceNote: 'Unit 1.2 Scalar vs Identity',
    prompt: 'Define a Scalar matrix and give an example of order $3\\times 3$.',
    markingPoints: [
      '1 mark: Accurate definition (diagonal matrix with equal non-zero diagonal entries).',
      '1 mark: Valid $3\\times 3$ example such as $3I_3$.',
    ],
    modelSolutionLatex:
      '\\text{Diagonal matrix with all diagonal entries equal to } k \\neq 0. \\quad \\text{Example: } \\begin{bmatrix} 3 & 0 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & 3 \\end{bmatrix}',
  },
  {
    id: 'bs-5',
    bankCategory: 'add-sub',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.3 Linear Combination',
    prompt:
      'If $A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}$ and $B = \\begin{bmatrix} -1 & 0 \\\\ 2 & 1 \\end{bmatrix}$, find $2A - 3B$.',
    markingPoints: [
      '1 mark: Compute $2A = \\begin{bmatrix} 2 & 4 \\\\ 6 & 8 \\end{bmatrix}$ and $3B = \\begin{bmatrix} -3 & 0 \\\\ 6 & 3 \\end{bmatrix}$.',
      '1 mark: Subtract accurately to get $\\begin{bmatrix} 5 & 4 \\\\ 0 & 5 \\end{bmatrix}$.',
    ],
    modelSolutionLatex:
      '2A - 3B = \\begin{bmatrix} 2-(-3) & 4-0 \\\\ 6-6 & 8-3 \\end{bmatrix} = \\begin{bmatrix} 5 & 4 \\\\ 0 & 5 \\end{bmatrix}',
  },
  {
    id: 'bs-6',
    bankCategory: 'add-sub',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Exercise 1.3 Q7',
    prompt:
      'Find $a$ and $b$ if $2\\begin{bmatrix} 2 & 4 \\\\ -3 & a \\end{bmatrix} + 3\\begin{bmatrix} 1 & b \\\\ 8 & -4 \\end{bmatrix} = \\begin{bmatrix} 7 & 10 \\\\ 18 & 1 \\end{bmatrix}$.',
    markingPoints: [
      '1 mark: Simplify LHS to $\\begin{bmatrix} 7 & 8+3b \\\\ 18 & 2a-12 \\end{bmatrix}$.',
      '1 mark: Solve $b = \\frac{2}{3}$ and $a = \\frac{13}{2}$.',
    ],
    modelSolutionLatex:
      '8+3b=10 \\implies b=\\frac{2}{3}; \\quad 2a-12=1 \\implies a=\\frac{13}{2}',
  },
  {
    id: 'bs-7',
    bankCategory: 'add-sub',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Review Exercise 1 Q4',
    prompt:
      'If $A = \\begin{bmatrix} 2 & 3 \\\\ 1 & 0 \\end{bmatrix}$ and $B = \\begin{bmatrix} 5 & -4 \\\\ -2 & -1 \\end{bmatrix}$, find $2A + 3B$.',
    markingPoints: [
      '1 mark: Compute $2A$ and $3B$.',
      '1 mark: Sum to $\\begin{bmatrix} 19 & -6 \\\\ -4 & -3 \\end{bmatrix}$.',
    ],
    modelSolutionLatex:
      '2A+3B = \\begin{bmatrix} 4 & 6 \\\\ 2 & 0 \\end{bmatrix} + \\begin{bmatrix} 15 & -12 \\\\ -6 & -3 \\end{bmatrix} = \\begin{bmatrix} 19 & -6 \\\\ -4 & -3 \\end{bmatrix}',
  },
  {
    id: 'bs-8',
    bankCategory: 'add-sub',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.3 Additive Inverse',
    prompt:
      'Find the additive inverse of $P = \\begin{bmatrix} \\sqrt{3} & -1 \\\\ 2 & -\\sqrt{5} \\end{bmatrix}$ and verify $P + (-P) = O$.',
    markingPoints: [
      '1 mark: Write $-P = \\begin{bmatrix} -\\sqrt{3} & 1 \\\\ -2 & \\sqrt{5} \\end{bmatrix}$.',
      '1 mark: Show entry-wise sum equals $\\begin{bmatrix} 0 & 0 \\\\ 0 & 0 \\end{bmatrix}$.',
    ],
    modelSolutionLatex:
      '-P = \\begin{bmatrix} -\\sqrt{3} & 1 \\\\ -2 & \\sqrt{5} \\end{bmatrix}, \\quad P + (-P) = \\begin{bmatrix} 0 & 0 \\\\ 0 & 0 \\end{bmatrix} = O',
  },
  {
    id: 'bs-9',
    bankCategory: 'add-sub',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.3 Matrix Equation',
    prompt:
      'Solve for matrix $X$: $X + \\begin{bmatrix} 3 & -2 \\\\ 1 & 5 \\end{bmatrix} = \\begin{bmatrix} 7 & 4 \\\\ -2 & 9 \\end{bmatrix}$.',
    markingPoints: [
      '1 mark: Rearrange $X = \\begin{bmatrix} 7 & 4 \\\\ -2 & 9 \\end{bmatrix} - \\begin{bmatrix} 3 & -2 \\\\ 1 & 5 \\end{bmatrix}$.',
      '1 mark: Evaluate $X = \\begin{bmatrix} 4 & 6 \\\\ -3 & 4 \\end{bmatrix}$.',
    ],
    modelSolutionLatex:
      'X = \\begin{bmatrix} 7-3 & 4-(-2) \\\\ -2-1 & 9-5 \\end{bmatrix} = \\begin{bmatrix} 4 & 6 \\\\ -3 & 4 \\end{bmatrix}',
  },
  {
    id: 'bs-10',
    bankCategory: 'multiplication',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Exercise 1.4 Q2',
    prompt:
      'If $A = \\begin{bmatrix} 3 & 0 \\\\ -1 & 2 \\end{bmatrix}$ and $B = \\begin{bmatrix} 6 \\\\ 5 \\end{bmatrix}$, find $AB$ and state if $BA$ is possible.',
    markingPoints: [
      '1 mark: Compute $AB = \\begin{bmatrix} 18 \\\\ 4 \\end{bmatrix}$.',
      '1 mark: State $BA$ is not possible (columns of $B = 1 \\neq$ rows of $A = 2$).',
    ],
    modelSolutionLatex:
      'AB = \\begin{bmatrix} 3(6)+0(5) \\\\ -1(6)+2(5) \\end{bmatrix} = \\begin{bmatrix} 18 \\\\ 4 \\end{bmatrix}; \\quad BA \\text{ is not conformable.}',
  },
  {
    id: 'bs-11',
    bankCategory: 'multiplication',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.4 Product Evaluation',
    prompt:
      'Find the product $\\begin{bmatrix} 1 & 2 \\\\ -3 & 0 \\\\ 6 & -1 \\end{bmatrix} \\begin{bmatrix} 4 & 5 \\\\ 0 & -4 \\end{bmatrix}$.',
    markingPoints: [
      '1 mark: Set up $3\\times 2$ product correctly.',
      '1 mark: Evaluate all six entries: $\\begin{bmatrix} 4 & -3 \\\\ -12 & -15 \\\\ 24 & 34 \\end{bmatrix}$.',
    ],
    modelSolutionLatex:
      '\\begin{bmatrix} 4+0 & 5-8 \\\\ -12+0 & -15+0 \\\\ 24+0 & 30+4 \\end{bmatrix} = \\begin{bmatrix} 4 & -3 \\\\ -12 & -15 \\\\ 24 & 34 \\end{bmatrix}',
  },
  {
    id: 'bs-12',
    bankCategory: 'multiplication',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.4 Non-Commutativity',
    prompt:
      'Using $A = \\begin{bmatrix} 0 & 1 \\\\ 2 & -3 \\end{bmatrix}$ and $B = \\begin{bmatrix} -3 & 4 \\\\ 5 & -2 \\end{bmatrix}$, show that $AB \\neq BA$.',
    markingPoints: [
      '1 mark: Compute $AB = \\begin{bmatrix} 5 & -2 \\\\ -21 & 14 \\end{bmatrix}$.',
      '1 mark: Compute $BA = \\begin{bmatrix} 8 & -15 \\\\ -4 & 11 \\end{bmatrix}$ and conclude $AB \\neq BA$.',
    ],
    modelSolutionLatex:
      'AB = \\begin{bmatrix} 5 & -2 \\\\ -21 & 14 \\end{bmatrix} \\neq BA = \\begin{bmatrix} 8 & -15 \\\\ -4 & 11 \\end{bmatrix}',
  },
  {
    id: 'bs-13',
    bankCategory: 'multiplication',
    sourceLabel: 'Conceptual practice',
    sourceNote: 'Unit 1.4 Conformability',
    prompt:
      'If $A$ has order $2\\times 3$, $B$ has order $3\\times 4$, and $C$ has order $4\\times 2$, find the orders of $AB$ and $(AB)C$.',
    markingPoints: [
      '1 mark: Order of $AB$ is $2\\times 4$.',
      '1 mark: Order of $(AB)C$ is $2\\times 2$.',
    ],
    modelSolutionLatex:
      'A_{2\\times 3}B_{3\\times 4} \\implies (AB)_{2\\times 4}; \\quad (AB)_{2\\times 4}C_{4\\times 2} \\implies ((AB)C)_{2\\times 2}',
  },
  {
    id: 'bs-14',
    bankCategory: 'determinants',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Exercise 1.5 Q1',
    prompt:
      'Find the determinants of $A = \\begin{bmatrix} -1 & 1 \\\\ 2 & 0 \\end{bmatrix}$ and $B = \\begin{bmatrix} 1 & 3 \\\\ 2 & -2 \\end{bmatrix}$.',
    markingPoints: [
      '1 mark: $|A| = (-1)(0) - (1)(2) = -2$.',
      '1 mark: $|B| = (1)(-2) - (3)(2) = -8$.',
    ],
    modelSolutionLatex: '|A| = 0 - 2 = -2, \\qquad |B| = -2 - 6 = -8',
  },
  {
    id: 'bs-15',
    bankCategory: 'determinants',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.5 Determinant Equation',
    prompt: 'Find the value of $x$ if $\\begin{vmatrix} 3x & 4 \\\\ 2 & 5 \\end{vmatrix} = 7$.',
    markingPoints: [
      '1 mark: Expand determinant: $15x - 8 = 7$.',
      '1 mark: Solve $15x = 15 \\implies x = 1$.',
    ],
    modelSolutionLatex: '(3x)(5) - (4)(2) = 7 \\implies 15x - 8 = 7 \\implies 15x = 15 \\implies x = 1',
  },
  {
    id: 'bs-16',
    bankCategory: 'determinants',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.5 Determinant of Transpose',
    prompt:
      'For $M = \\begin{bmatrix} 4 & -3 \\\\ 1 & 2 \\end{bmatrix}$, verify that $|M| = |M^t|$.',
    markingPoints: [
      '1 mark: Evaluate $|M| = 8 - (-3) = 11$.',
      '1 mark: Form $M^t = \\begin{bmatrix} 4 & 1 \\\\ -3 & 2 \\end{bmatrix}$ and evaluate $|M^t| = 8 + 3 = 11$.',
    ],
    modelSolutionLatex: '|M| = 8 + 3 = 11; \\quad |M^t| = \\begin{vmatrix} 4 & 1 \\\\ -3 & 2 \\end{vmatrix} = 8 + 3 = 11',
  },
  {
    id: 'bs-17',
    bankCategory: 'singular-nonsingular',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Exercise 1.5 Q2',
    prompt:
      'Find whether $C = \\begin{bmatrix} 7 & -9 \\\\ 3 & 5 \\end{bmatrix}$ and $D = \\begin{bmatrix} 5 & -10 \\\\ -2 & 4 \\end{bmatrix}$ are singular or non-singular.',
    markingPoints: [
      '1 mark: $|C| = 35 + 27 = 62 \\neq 0 \\implies$ Non-singular.',
      '1 mark: $|D| = 20 - 20 = 0 \\implies$ Singular.',
    ],
    modelSolutionLatex: '|C| = 62 \\neq 0 \\text{ (Non-singular)}, \\quad |D| = 0 \\text{ (Singular)}',
  },
  {
    id: 'bs-18',
    bankCategory: 'singular-nonsingular',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.5 Singularity Parameter',
    prompt: 'For what value of $k$ is $P = \\begin{bmatrix} k-1 & 2 \\\\ 6 & 4 \\end{bmatrix}$ singular?',
    markingPoints: [
      '1 mark: Set $|P| = 4(k-1) - 12 = 0$.',
      '1 mark: Solve $4k - 16 = 0 \\implies k = 4$.',
    ],
    modelSolutionLatex: '4(k-1) - 12 = 0 \\implies 4k - 4 - 12 = 0 \\implies 4k = 16 \\implies k = 4',
  },
  {
    id: 'bs-19',
    bankCategory: 'adjoint-inverse',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Exercise 1.5 Q3',
    prompt:
      'Find the multiplicative inverse of $A = \\begin{bmatrix} -1 & 3 \\\\ 2 & 0 \\end{bmatrix}$, if it exists.',
    markingPoints: [
      '1 mark: Compute $|A| = 0 - 6 = -6 \\neq 0$ and $\\operatorname{Adj}(A) = \\begin{bmatrix} 0 & -3 \\\\ -2 & -1 \\end{bmatrix}$.',
      '1 mark: Compute $A^{-1} = \\begin{bmatrix} 0 & \\frac{1}{2} \\\\ \\frac{1}{3} & \\frac{1}{6} \\end{bmatrix}$.',
    ],
    modelSolutionLatex:
      'A^{-1} = \\frac{1}{-6}\\begin{bmatrix} 0 & -3 \\\\ -2 & -1 \\end{bmatrix} = \\begin{bmatrix} 0 & \\frac{1}{2} \\\\ \\frac{1}{3} & \\frac{1}{6} \\end{bmatrix}',
  },
  {
    id: 'bs-20',
    bankCategory: 'adjoint-inverse',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.5 Multiplicative Inverse Check',
    prompt:
      'Verify that $A = \\begin{bmatrix} 3 & 5 \\\\ 1 & 2 \\end{bmatrix}$ and $B = \\begin{bmatrix} 2 & -5 \\\\ -1 & 3 \\end{bmatrix}$ are multiplicative inverses of each other.',
    markingPoints: [
      '1 mark: Multiply $AB$ and simplify to $I_2$.',
      '1 mark: Conclude $AB = I_2 \\implies B = A^{-1}$.',
    ],
    modelSolutionLatex:
      'AB = \\begin{bmatrix} 6-5 & -15+15 \\\\ 2-2 & -5+6 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = I_2',
  },
  {
    id: 'bs-21',
    bankCategory: 'adjoint-inverse',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Exercise 1.5 Q3(iv)',
    prompt:
      'Determine whether $D = \\begin{bmatrix} \\frac{1}{2} & \\frac{3}{4} \\\\ 1 & 2 \\end{bmatrix}$ is invertible, and find $D^{-1}$ if possible.',
    markingPoints: [
      '1 mark: Compute $|D| = 1 - \\frac{3}{4} = \\frac{1}{4} \\neq 0$.',
      '1 mark: Compute $D^{-1} = 4\\begin{bmatrix} 2 & -\\frac{3}{4} \\\\ -1 & \\frac{1}{2} \\end{bmatrix} = \\begin{bmatrix} 8 & -3 \\\\ -4 & 2 \\end{bmatrix}$.',
    ],
    modelSolutionLatex:
      '|D| = \\frac{1}{4} \\implies D^{-1} = 4\\begin{bmatrix} 2 & -\\frac{3}{4} \\\\ -1 & \\frac{1}{2} \\end{bmatrix} = \\begin{bmatrix} 8 & -3 \\\\ -4 & 2 \\end{bmatrix}',
  },
  {
    id: 'bs-22',
    bankCategory: 'cramers-rule',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.6 Cramer Setup',
    prompt:
      'Write down the determinants $D$, $D_x$, and $D_y$ for the system $4x + 2y = 8$ and $3x - y = -1$ (do not solve).',
    markingPoints: [
      '1 mark: Write $D = \\begin{vmatrix} 4 & 2 \\\\ 3 & -1 \\end{vmatrix}$ correctly.',
      '1 mark: Write $D_x = \\begin{vmatrix} 8 & 2 \\\\ -1 & -1 \\end{vmatrix}$ and $D_y = \\begin{vmatrix} 4 & 8 \\\\ 3 & -1 \\end{vmatrix}$.',
    ],
    modelSolutionLatex:
      'D = \\begin{vmatrix} 4 & 2 \\\\ 3 & -1 \\end{vmatrix}, \\quad D_x = \\begin{vmatrix} 8 & 2 \\\\ -1 & -1 \\end{vmatrix}, \\quad D_y = \\begin{vmatrix} 4 & 8 \\\\ 3 & -1 \\end{vmatrix}',
  },
  {
    id: 'bs-23',
    bankCategory: 'cramers-rule',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.6 Cramer Calculation',
    prompt: 'Using Cramer’s Rule, find $x$ and $y$ if $D = -10$, $D_x = -20$, and $D_y = 30$.',
    markingPoints: [
      '1 mark: Compute $x = \\frac{-20}{-10} = 2$.',
      '1 mark: Compute $y = \\frac{30}{-10} = -3$.',
    ],
    modelSolutionLatex: 'x = \\frac{-20}{-10} = 2, \\qquad y = \\frac{30}{-10} = -3',
  },
  {
    id: 'bs-24',
    bankCategory: 'matrix-inversion',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.6 Matrix Form',
    prompt:
      'Express the linear system $3x - 4y = 4$ and $x + 2y = 8$ in matrix form $AX = B$ and compute $|A|$.',
    markingPoints: [
      '1 mark: Write $\\begin{bmatrix} 3 & -4 \\\\ 1 & 2 \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 4 \\\\ 8 \\end{bmatrix}$.',
      '1 mark: Evaluate $|A| = 6 - (-4) = 10$.',
    ],
    modelSolutionLatex:
      '\\begin{bmatrix} 3 & -4 \\\\ 1 & 2 \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 4 \\\\ 8 \\end{bmatrix}, \\quad |A| = 6 + 4 = 10',
  },
  {
    id: 'bs-25',
    bankCategory: 'matrix-inversion',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.6 Inversion Step',
    prompt:
      'Given $A^{-1} = \\frac{1}{5}\\begin{bmatrix} 2 & 1 \\\\ -1 & 2 \\end{bmatrix}$ and $B = \\begin{bmatrix} 3 \\\\ 4 \\end{bmatrix}$, find $X = A^{-1}B$.',
    markingPoints: [
      '1 mark: Multiply $\\begin{bmatrix} 2 & 1 \\\\ -1 & 2 \\end{bmatrix}\\begin{bmatrix} 3 \\\\ 4 \\end{bmatrix} = \\begin{bmatrix} 10 \\\\ 5 \\end{bmatrix}$.',
      '1 mark: Divide by $5$ to obtain $X = \\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix}$.',
    ],
    modelSolutionLatex:
      'X = \\frac{1}{5}\\begin{bmatrix} 6+4 \\\\ -3+8 \\end{bmatrix} = \\frac{1}{5}\\begin{bmatrix} 10 \\\\ 5 \\end{bmatrix} = \\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix}',
  },
  {
    id: 'bs-26',
    bankCategory: 'simultaneous-equations',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Exercise 1.6 Q2',
    prompt:
      'Translate into two linear equations: The length of a rectangle is $4$ times its width, and its perimeter is $150\\text{ cm}$.',
    markingPoints: [
      '1 mark: Define width $= x$, length $= y$ and write $y = 4x \\implies 4x - y = 0$.',
      '1 mark: Write $2(x+y) = 150 \\implies x + y = 75$.',
    ],
    modelSolutionLatex: '4x - y = 0, \\qquad x + y = 75',
  },
  {
    id: 'bs-27',
    bankCategory: 'simultaneous-equations',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Exercise 1.6 Q4',
    prompt:
      'Translate into matrix form $AX = B$: The third angle of an isosceles triangle is $16^\\circ$ less than the sum of the two equal angles.',
    markingPoints: [
      '1 mark: Let equal angles $= x$ each and third angle $= y$: $2x + y = 180$ and $2x - y = 16$.',
      '1 mark: Write $\\begin{bmatrix} 2 & 1 \\\\ 2 & -1 \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 180 \\\\ 16 \\end{bmatrix}$.',
    ],
    modelSolutionLatex:
      '\\begin{bmatrix} 2 & 1 \\\\ 2 & -1 \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 180 \\\\ 16 \\end{bmatrix}',
  },
  {
    id: 'bs-28',
    bankCategory: 'conceptual-mcqs',
    sourceLabel: 'Conceptual practice',
    sourceNote: 'Unit 1.1 Row vs Column',
    prompt:
      'Construct a $2\\times 3$ matrix $A = [a_{ij}]$ where $a_{ij} = i + j$.',
    markingPoints: [
      '1 mark: Compute Row 1 ($i=1$): $a_{11}=2, a_{12}=3, a_{13}=4$.',
      '1 mark: Compute Row 2 ($i=2$): $a_{21}=3, a_{22}=4, a_{23}=5$.',
    ],
    modelSolutionLatex: 'A = \\begin{bmatrix} 2 & 3 & 4 \\\\ 3 & 4 & 5 \\end{bmatrix}',
  },
  {
    id: 'bs-29',
    bankCategory: 'multiplication',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.4 Unknown Entry',
    prompt:
      'Find $x$ and $y$ if $\\begin{bmatrix} 2 & 1 \\\\ -1 & 3 \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 5 \\\\ 8 \\end{bmatrix}$.',
    markingPoints: [
      '1 mark: Expand to $2x + y = 5$ and $-x + 3y = 8$.',
      '1 mark: Solve $x = 1, y = 3$.',
    ],
    modelSolutionLatex: 'x = 1, \\; y = 3 \\quad (2(1)+3=5, \\; -1+9=8)',
  },
  {
    id: 'bs-30',
    bankCategory: 'adjoint-inverse',
    sourceLabel: 'Conceptual practice',
    sourceNote: 'Unit 1.5 Adjoint Identity',
    prompt:
      'For $A = \\begin{bmatrix} 2 & 1 \\\\ 5 & 3 \\end{bmatrix}$, show that $A \\cdot \\operatorname{Adj}(A) = |A| I_2$.',
    markingPoints: [
      '1 mark: Compute $|A| = 1$ and $\\operatorname{Adj}(A) = \\begin{bmatrix} 3 & -1 \\\\ -5 & 2 \\end{bmatrix}$.',
      '1 mark: Multiply $A \\cdot \\operatorname{Adj}(A) = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = 1 \\cdot I_2$.',
    ],
    modelSolutionLatex:
      'A \\cdot \\operatorname{Adj}(A) = \\begin{bmatrix} 6-5 & -2+2 \\\\ 15-15 & -5+6 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = |A|I_2',
  },
];

export const BOARD_LONG_BANK: BoardLongItem[] = [
  {
    id: 'bl-1',
    bankCategory: 'cramers-rule',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Exercise 1.6 Q1(i) & Exercise 1.4 Q6',
    partA: {
      label: '(a)',
      marks: 4,
      bankCategory: 'cramers-rule',
      prompt:
        'Solve the simultaneous linear equations by **Cramer’s Rule**: $2x - 2y = 4$ and $3x + 2y = 6$.',
      modelSolutionLatex:
        'A = \\begin{bmatrix} 2 & -2 \\\\ 3 & 2 \\end{bmatrix}, \\; |A| = 4+6 = 10 \\neq 0 \\\\ |A_x| = \\begin{vmatrix} 4 & -2 \\\\ 6 & 2 \\end{vmatrix} = 8+12 = 20, \\; |A_y| = \\begin{vmatrix} 2 & 4 \\\\ 3 & 6 \\end{vmatrix} = 12-12 = 0 \\\\ x = \\frac{20}{10} = 2, \\quad y = \\frac{0}{10} = 0 \\implies \\text{Solution Set} = \\{(2, 0)\\}',
      rubricSteps: [
        { step: 'Write matrix form AX = B and compute |A| = 10 ≠ 0.', marks: 1 },
        { step: 'Form Ax correctly and compute |Ax| = 20.', marks: 1 },
        { step: 'Form Ay correctly and compute |Ay| = 0.', marks: 1 },
        { step: 'Evaluate x = 2, y = 0 and write Solution Set = {(2, 0)}.', marks: 1 },
      ],
    },
    partB: {
      label: '(b)',
      marks: 4,
      bankCategory: 'multiplication',
      prompt:
        'For $A = \\begin{bmatrix} -1 & 3 \\\\ 2 & 0 \\end{bmatrix}$ and $B = \\begin{bmatrix} 1 & 2 \\\\ -3 & -5 \\end{bmatrix}$, verify that $(AB)^t = B^t A^t$.',
      modelSolutionLatex:
        'AB = \\begin{bmatrix} -10 & -17 \\\\ 2 & 4 \\end{bmatrix} \\implies (AB)^t = \\begin{bmatrix} -10 & 2 \\\\ -17 & 4 \\end{bmatrix} \\\\ B^t A^t = \\begin{bmatrix} 1 & -3 \\\\ 2 & -5 \\end{bmatrix} \\begin{bmatrix} -1 & 2 \\\\ 3 & 0 \\end{bmatrix} = \\begin{bmatrix} -10 & 2 \\\\ -17 & 4 \\end{bmatrix} = \\text{LHS}',
      rubricSteps: [
        { step: 'Compute product AB accurately as [[-10, -17], [2, 4]].', marks: 1 },
        { step: 'Take transpose (AB)ᵗ accurately as [[-10, 2], [-17, 4]].', marks: 1 },
        { step: 'Find Bᵗ and Aᵗ correctly.', marks: 1 },
        { step: 'Multiply BᵗAᵗ in correct order and conclude LHS = RHS.', marks: 1 },
      ],
    },
  },
  {
    id: 'bl-2',
    bankCategory: 'matrix-inversion',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Exercise 1.6 Q1(iv) & Exercise 1.5 Q6',
    partA: {
      label: '(a)',
      marks: 4,
      bankCategory: 'matrix-inversion',
      prompt:
        'Solve by **Matrix Inversion Method**: $3x - 2y = -6$ and $5x - 2y = -10$.',
      modelSolutionLatex:
        'A = \\begin{bmatrix} 3 & -2 \\\\ 5 & -2 \\end{bmatrix}, \\; |A| = -6 + 10 = 4 \\neq 0 \\\\ \\operatorname{Adj}(A) = \\begin{bmatrix} -2 & 2 \\\\ -5 & 3 \\end{bmatrix} \\implies X = \\frac{1}{4}\\begin{bmatrix} -2 & 2 \\\\ -5 & 3 \\end{bmatrix}\\begin{bmatrix} -6 \\\\ -10 \\end{bmatrix} = \\frac{1}{4}\\begin{bmatrix} -8 \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} -2 \\\\ 0 \\end{bmatrix}',
      rubricSteps: [
        { step: 'Write AX = B and compute |A| = 4 ≠ 0.', marks: 1 },
        { step: 'Determine Adj(A) = [[-2, 2], [-5, 3]] and A⁻¹.', marks: 1 },
        { step: 'Multiply A⁻¹B in left-to-right order.', marks: 1 },
        { step: 'Conclude x = -2, y = 0 and Solution Set = {(-2, 0)}.', marks: 1 },
      ],
    },
    partB: {
      label: '(b)',
      marks: 4,
      bankCategory: 'adjoint-inverse',
      prompt:
        'Verify $(AB)^{-1} = B^{-1}A^{-1}$ for $A = \\begin{bmatrix} 4 & 0 \\\\ -1 & 2 \\end{bmatrix}$ and $B = \\begin{bmatrix} -4 & -2 \\\\ 1 & -1 \\end{bmatrix}$.',
      modelSolutionLatex:
        'AB = \\begin{bmatrix} -16 & -8 \\\\ 6 & 0 \\end{bmatrix}, \\; |AB| = 48 \\implies (AB)^{-1} = \\frac{1}{48}\\begin{bmatrix} 0 & 8 \\\\ -6 & -16 \\end{bmatrix} \\\\ |A|=8, \\; A^{-1} = \\frac{1}{8}\\begin{bmatrix} 2 & 0 \\\\ 1 & 4 \\end{bmatrix}; \\quad |B|=6, \\; B^{-1} = \\frac{1}{6}\\begin{bmatrix} -1 & 2 \\\\ -1 & -4 \\end{bmatrix} \\\\ B^{-1}A^{-1} = \\frac{1}{48}\\begin{bmatrix} 0 & 8 \\\\ -6 & -16 \\end{bmatrix} = \\text{LHS}',
      rubricSteps: [
        { step: 'Compute AB and |AB| = 48.', marks: 1 },
        { step: 'Find (AB)⁻¹ correctly.', marks: 1 },
        { step: 'Compute B⁻¹ and A⁻¹ separately.', marks: 1 },
        { step: 'Multiply B⁻¹A⁻¹ and verify equality with (AB)⁻¹.', marks: 1 },
      ],
    },
  },
  {
    id: 'bl-3',
    bankCategory: 'simultaneous-equations',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Exercise 1.6 Q2 & Q3',
    partA: {
      label: '(a)',
      marks: 4,
      bankCategory: 'simultaneous-equations',
      prompt:
        'The length of a rectangle is $4$ times its width. The perimeter is $150\\text{ cm}$. Find the dimensions using the **Matrix Inversion Method**.',
      modelSolutionLatex:
        '4x - y = 0, \\; x + y = 75 \\implies A = \\begin{bmatrix} 4 & -1 \\\\ 1 & 1 \\end{bmatrix}, \\; |A| = 5 \\\\ X = \\frac{1}{5}\\begin{bmatrix} 1 & 1 \\\\ -1 & 4 \\end{bmatrix}\\begin{bmatrix} 0 \\\\ 75 \\end{bmatrix} = \\frac{1}{5}\\begin{bmatrix} 75 \\\\ 300 \\end{bmatrix} = \\begin{bmatrix} 15 \\\\ 60 \\end{bmatrix}',
      rubricSteps: [
        { step: 'Define width x, length y and form 4x - y = 0 and x + y = 75.', marks: 1 },
        { step: 'Write matrix form AX = B and compute |A| = 5 ≠ 0.', marks: 1 },
        { step: 'Compute X = A⁻¹B = [[15], [60]].', marks: 1 },
        { step: 'State width = 15 cm and length = 60 cm with units.', marks: 1 },
      ],
    },
    partB: {
      label: '(b)',
      marks: 4,
      bankCategory: 'simultaneous-equations',
      prompt:
        'Two sides of a rectangle differ by $3.5\\text{ cm}$. Find the dimensions if its perimeter is $67\\text{ cm}$, using **Cramer’s Rule**.',
      modelSolutionLatex:
        'x - y = 3.5, \\; x + y = 33.5 \\implies |A| = 2 \\\\ |A_x| = \\begin{vmatrix} 3.5 & -1 \\\\ 33.5 & 1 \\end{vmatrix} = 37, \\quad |A_y| = \\begin{vmatrix} 1 & 3.5 \\\\ 1 & 33.5 \\end{vmatrix} = 30 \\\\ x = \\frac{37}{2} = 18.5\\text{ cm}, \\quad y = \\frac{30}{2} = 15\\text{ cm}',
      rubricSteps: [
        { step: 'Form x - y = 3.5 and x + y = 33.5 from 2(x+y)=67.', marks: 1 },
        { step: 'Compute |A| = 2 ≠ 0.', marks: 1 },
        { step: 'Compute |Ax| = 37 and |Ay| = 30.', marks: 1 },
        { step: 'Conclude length = 18.5 cm and width = 15 cm.', marks: 1 },
      ],
    },
  },
  {
    id: 'bl-4',
    bankCategory: 'cramers-rule',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.6 Cramer Rule & 1.3 Associative Verification',
    partA: {
      label: '(a)',
      marks: 4,
      bankCategory: 'cramers-rule',
      prompt:
        'Solve the linear system by **Cramer’s Rule**: $4x + 2y = 8$ and $3x - y = -1$.',
      modelSolutionLatex:
        '|A| = \\begin{vmatrix} 4 & 2 \\\\ 3 & -1 \\end{vmatrix} = -4 - 6 = -10 \\\\ |A_x| = \\begin{vmatrix} 8 & 2 \\\\ -1 & -1 \\end{vmatrix} = -8 + 2 = -6, \\quad |A_y| = \\begin{vmatrix} 4 & 8 \\\\ 3 & -1 \\end{vmatrix} = -4 - 24 = -28 \\\\ x = \\frac{-6}{-10} = \\frac{3}{5}, \\quad y = \\frac{-28}{-10} = \\frac{14}{5}',
      rubricSteps: [
        { step: 'Write coefficient matrix A and compute |A| = -10.', marks: 1 },
        { step: 'Compute |Ax| = -6 accurately.', marks: 1 },
        { step: 'Compute |Ay| = -28 accurately.', marks: 1 },
        { step: 'Simplify x = 3/5, y = 14/5 and state Solution Set.', marks: 1 },
      ],
    },
    partB: {
      label: '(b)',
      marks: 4,
      bankCategory: 'add-sub',
      prompt:
        'For $A = \\begin{bmatrix} 1 & 2 \\\\ 0 & -1 \\end{bmatrix}$, $B = \\begin{bmatrix} 2 & -1 \\\\ 3 & 4 \\end{bmatrix}$, $C = \\begin{bmatrix} -1 & 3 \\\\ 1 & 2 \\end{bmatrix}$, verify $A + (B + C) = (A + B) + C$.',
      modelSolutionLatex:
        'B+C = \\begin{bmatrix} 1 & 2 \\\\ 4 & 6 \\end{bmatrix} \\implies A+(B+C) = \\begin{bmatrix} 2 & 4 \\\\ 4 & 5 \\end{bmatrix} \\\\ A+B = \\begin{bmatrix} 3 & 1 \\\\ 3 & 3 \\end{bmatrix} \\implies (A+B)+C = \\begin{bmatrix} 2 & 4 \\\\ 4 & 5 \\end{bmatrix}',
      rubricSteps: [
        { step: 'Compute B + C accurately.', marks: 1 },
        { step: 'Compute LHS = A + (B + C) = [[2, 4], [4, 5]].', marks: 1 },
        { step: 'Compute A + B accurately.', marks: 1 },
        { step: 'Compute RHS = (A + B) + C and verify LHS = RHS.', marks: 1 },
      ],
    },
  },
  {
    id: 'bl-5',
    bankCategory: 'simultaneous-equations',
    sourceLabel: 'Textbook-based',
    sourceNote: 'PCTB Exercise 1.6 Q5 & Review Ex 1 Q6',
    partA: {
      label: '(a)',
      marks: 4,
      bankCategory: 'simultaneous-equations',
      prompt:
        'One acute angle of a right triangle is $12^\\circ$ more than twice the other acute angle. Find both acute angles using **Matrix Inversion Method**.',
      modelSolutionLatex:
        'x + y = 90, \\; x - 2y = 12 \\implies A = \\begin{bmatrix} 1 & 1 \\\\ 1 & -2 \\end{bmatrix}, \\; |A| = -3 \\\\ X = \\frac{1}{-3}\\begin{bmatrix} -2 & -1 \\\\ -1 & 1 \\end{bmatrix}\\begin{bmatrix} 90 \\\\ 12 \\end{bmatrix} = \\frac{1}{-3}\\begin{bmatrix} -192 \\\\ -78 \\end{bmatrix} = \\begin{bmatrix} 64 \\\\ 26 \\end{bmatrix}',
      rubricSteps: [
        { step: 'Form equations x + y = 90 and x - 2y = 12.', marks: 1 },
        { step: 'Find |A| = -3 ≠ 0 and Adj(A).', marks: 1 },
        { step: 'Multiply A⁻¹B correctly.', marks: 1 },
        { step: 'Conclude the acute angles are 64° and 26°.', marks: 1 },
      ],
    },
    partB: {
      label: '(b)',
      marks: 4,
      bankCategory: 'definitions-properties',
      prompt:
        'If $A = \\begin{bmatrix} 1 & 2 \\\\ 0 & 1 \\end{bmatrix}$, show that $A + A^t$ is symmetric and $A - A^t$ is skew-symmetric.',
      modelSolutionLatex:
        'A + A^t = \\begin{bmatrix} 2 & 2 \\\\ 2 & 2 \\end{bmatrix} = (A+A^t)^t \\quad (\\text{Symmetric}) \\\\ A - A^t = \\begin{bmatrix} 0 & 2 \\\\ -2 & 0 \\end{bmatrix}, \\quad (A - A^t)^t = \\begin{bmatrix} 0 & -2 \\\\ 2 & 0 \\end{bmatrix} = -(A - A^t) \\quad (\\text{Skew-symmetric})',
      rubricSteps: [
        { step: 'Compute Aᵗ and A + Aᵗ accurately.', marks: 1 },
        { step: 'Verify (A + Aᵗ)ᵗ = A + Aᵗ.', marks: 1 },
        { step: 'Compute A - Aᵗ accurately.', marks: 1 },
        { step: 'Verify (A - Aᵗ)ᵗ = -(A - Aᵗ).', marks: 1 },
      ],
    },
  },
  {
    id: 'bl-6',
    bankCategory: 'matrix-inversion',
    sourceLabel: 'Board-style practice',
    sourceNote: 'Unit 1.6 Matrix Inversion & 1.5 Adjoint Identity',
    partA: {
      label: '(a)',
      marks: 4,
      bankCategory: 'matrix-inversion',
      prompt:
        'Solve by **Matrix Inversion Method**: $5x - 2y = -10$ and $3x - 2y = -6$.',
      modelSolutionLatex:
        'A = \\begin{bmatrix} 5 & -2 \\\\ 3 & -2 \\end{bmatrix}, \\; |A| = -10 + 6 = -4 \\\\ X = \\frac{1}{-4}\\begin{bmatrix} -2 & 2 \\\\ -3 & 5 \\end{bmatrix}\\begin{bmatrix} -10 \\\\ -6 \\end{bmatrix} = \\frac{1}{-4}\\begin{bmatrix} 8 \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} -2 \\\\ 0 \\end{bmatrix}',
      rubricSteps: [
        { step: 'Write AX = B and compute |A| = -4.', marks: 1 },
        { step: 'Compute Adj(A) = [[-2, 2], [-3, 5]].', marks: 1 },
        { step: 'Multiply A⁻¹B accurately.', marks: 1 },
        { step: 'State x = -2, y = 0 and Solution Set = {(-2, 0)}.', marks: 1 },
      ],
    },
    partB: {
      label: '(b)',
      marks: 4,
      bankCategory: 'adjoint-inverse',
      prompt:
        'If $A = \\begin{bmatrix} 1 & 2 \\\\ 4 & 6 \\end{bmatrix}$, verify that $A(\\operatorname{Adj} A) = (\\operatorname{Adj} A)A = |A|I_2$.',
      modelSolutionLatex:
        '|A| = 6 - 8 = -2, \\quad \\operatorname{Adj} A = \\begin{bmatrix} 6 & -2 \\\\ -4 & 1 \\end{bmatrix} \\\\ A(\\operatorname{Adj} A) = \\begin{bmatrix} -2 & 0 \\\\ 0 & -2 \\end{bmatrix} = (\\operatorname{Adj} A)A = -2\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}',
      rubricSteps: [
        { step: 'Compute |A| = -2 and Adj(A).', marks: 1 },
        { step: 'Multiply A(Adj A) = [[-2, 0], [0, -2]].', marks: 1 },
        { step: 'Multiply (Adj A)A = [[-2, 0], [0, -2]].', marks: 1 },
        { step: 'Verify both equal |A|I₂.', marks: 1 },
      ],
    },
  },
];

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed + 1;
  const nextRand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(nextRand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface GeneratedBoardPaper {
  config: BoardExamConfig;
  objectiveMcqs: BoardMcqItem[];
  shortGroups: {
    groupId: 'Q2' | 'Q3' | 'Q4';
    title: string;
    attemptRequired: number;
    marksPerQuestion: number;
    questions: BoardShortItem[];
  }[];
  longQuestions: BoardLongItem[];
}

export function generateBoardPaper(
  config: BoardExamConfig,
  seed = Date.now()
): GeneratedBoardPaper {
  const mcqsPool = shuffleWithSeed(BOARD_MCQ_BANK, seed);
  const objectiveMcqs = mcqsPool.slice(
    0,
    Math.min(config.objective.totalQuestions, mcqsPool.length)
  );

  const shortPool = shuffleWithSeed(BOARD_SHORT_BANK, seed + 17);
  let cursor = 0;
  const shortGroups = config.shortGroups.map((grp) => {
    const picked: BoardShortItem[] = [];
    for (let i = 0; i < grp.totalQuestions; i++) {
      picked.push(shortPool[cursor % shortPool.length]);
      cursor += 1;
    }
    return {
      groupId: grp.id,
      title: grp.title,
      attemptRequired: grp.attemptRequired,
      marksPerQuestion: grp.marksPerQuestion,
      questions: picked,
    };
  });

  const longPool = shuffleWithSeed(BOARD_LONG_BANK, seed + 31);
  const longQuestions = longPool.slice(
    0,
    Math.min(config.longSection.totalQuestions, longPool.length)
  );

  return {
    config,
    objectiveMcqs,
    shortGroups,
    longQuestions,
  };
}
