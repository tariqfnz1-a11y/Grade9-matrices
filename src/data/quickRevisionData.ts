import type { RevisionCard, TopicId } from '../types/curriculum';

export interface RevisionDefinition {
  term: string;
  definition: string;
  formulaLatex?: string;
}

export interface MatrixClassificationRow {
  type: string;
  condition: string;
  exampleLatex: string;
  note: string;
}

export interface RevisionFormula {
  title: string;
  exercise: string;
  latex: string;
  note: string;
}

export interface OperationPropertyItem {
  group: 'Addition' | 'Multiplication' | 'Transpose & Inverse';
  name: string;
  latex: string;
  condition: string;
}

export interface DeterminantRuleItem {
  title: string;
  latex: string;
  explanation: string;
}

export interface CommonMistakeItem {
  topic: string;
  mistake: string;
  correction: string;
}

export interface ImportantMcqFact {
  id: string;
  prompt: string;
  revealAnswer: string;
  revealLatex?: string;
  reason: string;
}

export interface SelfTestQuestion {
  id: string;
  topicId: TopicId;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

// 1. IMPORTANT DEFINITIONS
export const IMPORTANT_DEFINITIONS: RevisionDefinition[] = [
  {
    term: 'Matrix',
    definition:
      'A rectangular array of real numbers arranged in horizontal rows and vertical columns, enclosed within square brackets $[\\;]$.',
    formulaLatex: 'A = \\begin{bmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{bmatrix}',
  },
  {
    term: 'Order of a Matrix',
    definition:
      'If a matrix $M$ has $m$ rows and $n$ columns, its order (dimension) is stated as $m\\text{-by-}n$ (rows first, columns second).',
    formulaLatex: '\\text{Order} = m \\times n',
  },
  {
    term: 'Equal Matrices',
    definition:
      'Two matrices $A$ and $B$ are equal ($A = B$) if and only if they have the same order and every pair of corresponding entries is equal ($a_{ij} = b_{ij}$).',
  },
  {
    term: 'Negative of a Matrix ($-A$)',
    definition:
      'Obtained by changing the sign of every entry of $A$. It acts as the additive inverse of $A$.',
    formulaLatex: 'A + (-A) = O',
  },
  {
    term: 'Transpose of a Matrix ($A^t$)',
    definition:
      'Obtained by interchanging the rows and columns of $A$. If $A$ has order $m \\times n$, then $A^t$ has order $n \\times m$.',
    formulaLatex: '(A^t)_{ij} = A_{ji}',
  },
  {
    term: 'Symmetric Matrix',
    definition: 'A square matrix $A$ is symmetric if taking its transpose leaves it unchanged.',
    formulaLatex: 'A^t = A',
  },
  {
    term: 'Skew-Symmetric Matrix',
    definition:
      'A square matrix $A$ is skew-symmetric if its transpose equals its negative. All main diagonal entries are $0$.',
    formulaLatex: 'A^t = -A',
  },
  {
    term: 'Singular & Non-Singular Matrices',
    definition:
      'A square matrix $A$ is singular if $|A| = 0$ (no inverse exists), and non-singular if $|A| \\neq 0$ (unique inverse exists).',
    formulaLatex: '|A| = 0 \\; (\\text{Singular}), \\quad |A| \\neq 0 \\; (\\text{Non-Singular})',
  },
  {
    term: 'Adjoint of a $2 \\times 2$ Matrix',
    definition:
      'Formed by interchanging the main diagonal entries ($a, d$) and changing the signs of the off-diagonal entries ($b, c$).',
    formulaLatex:
      '\\operatorname{Adj}(A) = \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}',
  },
  {
    term: 'Multiplicative Inverse ($A^{-1}$)',
    definition:
      'For a non-singular matrix $A$, the matrix $A^{-1}$ such that $A A^{-1} = A^{-1} A = I$.',
    formulaLatex: 'A^{-1} = \\frac{1}{|A|} \\operatorname{Adj}(A), \\quad |A| \\neq 0',
  },
];

// 2. MATRIX CLASSIFICATION TABLE (12 Textbook Types)
export const MATRIX_CLASSIFICATION_TABLE: MatrixClassificationRow[] = [
  {
    type: 'Row Matrix',
    condition: 'Contains only 1 row ($1 \\times n$)',
    exampleLatex: '\\begin{bmatrix} 2 & -5 & 1 \\end{bmatrix}',
    note: 'Order always starts with 1.',
  },
  {
    type: 'Column Matrix',
    condition: 'Contains only 1 column ($m \\times 1$)',
    exampleLatex: '\\begin{bmatrix} 3 \\\\ 0 \\\\ -4 \\end{bmatrix}',
    note: 'Order always ends with 1.',
  },
  {
    type: 'Rectangular Matrix',
    condition: 'Rows $\\neq$ Columns ($m \\neq n$)',
    exampleLatex: '\\begin{bmatrix} 1 & 0 & 2 \\\\ 4 & 5 & 6 \\end{bmatrix}',
    note: 'Includes row & column matrices ($n>1$ or $m>1$).',
  },
  {
    type: 'Square Matrix',
    condition: 'Rows = Columns ($m = n$)',
    exampleLatex: '\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}',
    note: 'Only square matrices have determinants & inverses.',
  },
  {
    type: 'Null / Zero Matrix ($O$)',
    condition: 'Every entry equals $0$',
    exampleLatex: '\\begin{bmatrix} 0 & 0 \\\\ 0 & 0 \\end{bmatrix}',
    note: 'Can be square or rectangular.',
  },
  {
    type: 'Transpose Matrix ($A^t$)',
    condition: 'Rows and columns of $A$ interchanged',
    exampleLatex: '\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}^t = \\begin{bmatrix} 1 & 3 \\\\ 2 & 4 \\end{bmatrix}',
    note: '$(A^t)^t = A$.',
  },
  {
    type: 'Negative Matrix ($-A$)',
    condition: 'Sign of every entry of $A$ is reversed',
    exampleLatex: '-\\begin{bmatrix} 2 & -3 \\\\ 0 & 5 \\end{bmatrix} = \\begin{bmatrix} -2 & 3 \\\\ 0 & -5 \\end{bmatrix}',
    note: 'Additive inverse of $A$.',
  },
  {
    type: 'Symmetric Matrix',
    condition: 'Square matrix with $A^t = A$',
    exampleLatex: '\\begin{bmatrix} 1 & 3 \\\\ 3 & -2 \\end{bmatrix}',
    note: 'Entries mirror across main diagonal.',
  },
  {
    type: 'Skew-Symmetric Matrix',
    condition: 'Square matrix with $A^t = -A$',
    exampleLatex: '\\begin{bmatrix} 0 & 4 \\\\ -4 & 0 \\end{bmatrix}',
    note: 'Main diagonal entries must be $0$.',
  },
  {
    type: 'Diagonal Matrix',
    condition: 'Square; off-diagonal entries $= 0$, at least one diagonal $\\neq 0$',
    exampleLatex: '\\begin{bmatrix} 2 & 0 \\\\ 0 & -5 \\end{bmatrix}',
    note: 'All scalar & identity matrices are diagonal.',
  },
  {
    type: 'Scalar Matrix',
    condition: 'Diagonal matrix with equal diagonal entries $k \\neq 0$',
    exampleLatex: '\\begin{bmatrix} \\sqrt{2} & 0 \\\\ 0 & \\sqrt{2} \\end{bmatrix}',
    note: 'Equals $kI$.',
  },
  {
    type: 'Identity (Unit) Matrix ($I$)',
    condition: 'Diagonal matrix with all diagonal entries $= 1$',
    exampleLatex: '\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}',
    note: 'Multiplicative identity: $AI = IA = A$.',
  },
];

// 3. ALL IMPORTANT FORMULAS
export const ALL_IMPORTANT_FORMULAS: RevisionFormula[] = [
  {
    title: 'Matrix Addition / Subtraction',
    exercise: 'Ex 1.3',
    latex: '(A \\pm B)_{ij} = a_{ij} \\pm b_{ij}',
    note: 'Defined only when $A$ and $B$ have the exact same order.',
  },
  {
    title: 'Scalar Multiplication',
    exercise: 'Ex 1.3',
    latex: '(kA)_{ij} = k \\cdot a_{ij}',
    note: 'Multiply every single entry of $A$ by real number $k$.',
  },
  {
    title: 'Multiplication Conformability & Output Order',
    exercise: 'Ex 1.4',
    latex: 'A_{m \\times n} \\cdot B_{n \\times p} = (AB)_{m \\times p}',
    note: 'Columns of left matrix ($n$) must equal rows of right matrix ($n$).',
  },
  {
    title: '2×2 Matrix Product Formula',
    exercise: 'Ex 1.4',
    latex:
      '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\begin{bmatrix} e & f \\\\ g & h \\end{bmatrix} = \\begin{bmatrix} ae+bg & af+bh \\\\ ce+dg & cf+dh \\end{bmatrix}',
    note: 'Row of 1st matrix multiplied element-wise by column of 2nd matrix.',
  },
  {
    title: '2×2 Determinant Formula',
    exercise: 'Ex 1.5',
    latex: '|A| = \\det \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} = ad - bc',
    note: 'Main diagonal product minus secondary diagonal product.',
  },
  {
    title: 'Adjoint & Inverse Formula',
    exercise: 'Ex 1.5',
    latex: 'A^{-1} = \\frac{1}{ad - bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix} \\quad (ad - bc \\neq 0)',
    note: 'Exists only for non-singular square matrices.',
  },
  {
    title: 'Matrix Inversion Method',
    exercise: 'Ex 1.6',
    latex: 'AX = B \\implies X = A^{-1}B = \\frac{1}{|A|}(\\operatorname{Adj} A)B',
    note: '$A^{-1}$ must multiply $B$ from the LEFT.',
  },
  {
    title: 'Cramer’s Rule Formula',
    exercise: 'Ex 1.6',
    latex: 'x = \\frac{|A_x|}{|A|}, \\quad y = \\frac{|A_y|}{|A|} \\quad (|A| \\neq 0)',
    note: 'Replace column 1 with $B$ for $A_x$; column 2 with $B$ for $A_y$.',
  },
];

// 4. PROPERTIES OF MATRIX OPERATIONS
export const MATRIX_OPERATION_PROPERTIES: OperationPropertyItem[] = [
  {
    group: 'Addition',
    name: 'Commutative Law of Addition',
    latex: 'A + B = B + A',
    condition: 'Valid for matrices of the same order.',
  },
  {
    group: 'Addition',
    name: 'Associative Law of Addition',
    latex: '(A + B) + C = A + (B + C)',
    condition: 'Valid for matrices of the same order.',
  },
  {
    group: 'Addition',
    name: 'Additive Identity & Inverse',
    latex: 'A + O = O + A = A, \\quad A + (-A) = O',
    condition: '$O$ is the zero matrix of the same order as $A$.',
  },
  {
    group: 'Multiplication',
    name: 'Non-Commutativity in General',
    latex: 'AB \\neq BA \\text{ (in general)}',
    condition: 'Even if both $AB$ and $BA$ exist, they are usually unequal.',
  },
  {
    group: 'Multiplication',
    name: 'Associative Law of Multiplication',
    latex: '(AB)C = A(BC)',
    condition: 'Whenever conformable.',
  },
  {
    group: 'Multiplication',
    name: 'Distributive Laws',
    latex: 'A(B \\pm C) = AB \\pm AC, \\quad (A \\pm B)C = AC \\pm BC',
    condition: 'Preserve left/right multiplication order!',
  },
  {
    group: 'Multiplication',
    name: 'Multiplicative Identity',
    latex: 'AI = IA = A',
    condition: 'For square matrix $A$ and identity matrix $I$ of same order.',
  },
  {
    group: 'Transpose & Inverse',
    name: 'Double Transpose & Sum Transpose',
    latex: '(A^t)^t = A, \\quad (A + B)^t = A^t + B^t',
    condition: 'Order of addition unchanged.',
  },
  {
    group: 'Transpose & Inverse',
    name: 'Transpose Reversal Law',
    latex: '(AB)^t = B^t A^t',
    condition: 'Order reverses when distributing transpose over a product.',
  },
  {
    group: 'Transpose & Inverse',
    name: 'Inverse Reversal & Double Inverse',
    latex: '(AB)^{-1} = B^{-1} A^{-1}, \\quad (A^{-1})^{-1} = A',
    condition: 'Valid when $A$ and $B$ are both non-singular.',
  },
];

// 5. DETERMINANT RULES
export const DETERMINANT_RULES: DeterminantRuleItem[] = [
  {
    title: 'Standard 2×2 Determinant',
    latex: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc',
    explanation: 'Multiply top-left by bottom-right ($ad$), then subtract top-right times bottom-left ($bc$).',
  },
  {
    title: 'Singular Matrix Test',
    latex: '|A| = 0 \\implies A \\text{ is Singular}',
    explanation: 'No multiplicative inverse exists; equations $AX = B$ do not have a unique solution.',
  },
  {
    title: 'Non-Singular Matrix Test',
    latex: '|A| \\neq 0 \\implies A \\text{ is Non-Singular}',
    explanation: 'Unique inverse $A^{-1}$ exists and $AX = B$ has a unique solution $(x, y)$.',
  },
  {
    title: 'Determinant of Identity & Zero Matrix',
    latex: '|I| = 1, \\quad |O| = 0',
    explanation: 'For $I_2$, $(1)(1) - (0)(0) = 1$. For $O_2$, $(0)(0) - (0)(0) = 0$.',
  },
  {
    title: 'Product & Transpose Determinant Rules',
    latex: '|AB| = |A||B|, \\quad |A^t| = |A|',
    explanation: 'Transposing does not change the determinant; determinant of a product equals product of determinants.',
  },
];

// 6. ADJOINT & INVERSE STEPS / FORMULAS
export const ADJOINT_INVERSE_SUMMARY = {
  matrixLatex: 'A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}',
  detLatex: '|A| = ad - bc',
  adjLatex: '\\operatorname{Adj}(A) = \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}',
  invLatex: 'A^{-1} = \\frac{1}{|A|} \\operatorname{Adj}(A) = \\frac{1}{ad - bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}',
  verifyLatex: 'A \\cdot A^{-1} = A^{-1} \\cdot A = I = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}',
  checklist: [
    'Step 1: Always compute |A| = ad - bc FIRST.',
    'Step 2: If |A| = 0, stop and write: "A is singular, so A⁻¹ does not exist."',
    'Step 3: Form Adj(A) by swapping diagonal entries (a ↔ d) and negating off-diagonal entries (b → -b, c → -c).',
    'Step 4: Divide every entry of Adj(A) by |A| (keep exact simplified fractions; avoid rounding decimals).',
  ],
};

// 7. CRAMER'S RULE FORMULAS
export const CRAMERS_RULE_SUMMARY = {
  systemLatex: '\\begin{cases} a_1 x + b_1 y = c_1 \\\\ a_2 x + b_2 y = c_2 \\end{cases}',
  matricesLatex:
    'A = \\begin{bmatrix} a_1 & b_1 \\\\ a_2 & b_2 \\end{bmatrix}, \\quad A_x = \\begin{bmatrix} c_1 & b_1 \\\\ c_2 & b_2 \\end{bmatrix}, \\quad A_y = \\begin{bmatrix} a_1 & c_1 \\\\ a_2 & c_2 \\end{bmatrix}',
  solutionLatex:
    'x = \\frac{|A_x|}{|A|} = \\frac{c_1 b_2 - b_1 c_2}{a_1 b_2 - b_1 a_2}, \\qquad y = \\frac{|A_y|}{|A|} = \\frac{a_1 c_2 - c_1 a_2}{a_1 b_2 - b_1 a_2} \\qquad (|A| \\neq 0)',
  steps: [
    'Step 1: Write equations in standard form ax + by = c.',
    'Step 2: Compute |A| = a₁b₂ - b₁a₂. Confirm |A| ≠ 0.',
    'Step 3: Replace Column 1 of A with constants (c₁, c₂) to get Aₓ, then find |Aₓ|.',
    'Step 4: Replace Column 2 of A with constants (c₁, c₂) to get Aᵧ, then find |Aᵧ|.',
    'Step 5: Compute x = |Aₓ| / |A| and y = |Aᵧ| / |A|, and write Solution Set = {(x, y)}.',
  ],
};

// 8. MATRIX INVERSION METHOD
export const MATRIX_INVERSION_SUMMARY = {
  equationLatex: 'AX = B \\implies \\begin{bmatrix} a_1 & b_1 \\\\ a_2 & b_2 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} c_1 \\\\ c_2 \\end{bmatrix}',
  solveLatex: 'X = A^{-1} B = \\frac{1}{|A|} \\begin{bmatrix} b_2 & -b_1 \\\\ -a_2 & a_1 \\end{bmatrix} \\begin{bmatrix} c_1 \\\\ c_2 \\end{bmatrix}',
  steps: [
    'Step 1: Express the equations in matrix form AX = B.',
    'Step 2: Calculate |A|. If |A| = 0, state that a unique solution is not possible.',
    'Step 3: Find Adj(A) and compute A⁻¹ = (1 / |A|) Adj(A).',
    'Step 4: Multiply X = A⁻¹ B (always keep A⁻¹ on the LEFT of B!).',
    'Step 5: Simplify the resulting 2 × 1 column matrix to read x and y.',
  ],
};

// 9. COMMON EXAMINATION MISTAKES
export const COMMON_EXAM_MISTAKES: CommonMistakeItem[] = [
  {
    topic: 'Ex 1.1 · Matrix Order',
    mistake: 'Writing columns before rows (e.g., calling a 2-row, 3-column matrix "3-by-2").',
    correction: 'Always count horizontal rows FIRST, then vertical columns: m-by-n.',
  },
  {
    topic: 'Ex 1.4 · Multiplication',
    mistake: 'Multiplying two 2×2 matrices entry-by-entry like addition.',
    correction: 'Multiply Row i of the 1st matrix by Column j of the 2nd matrix and add the products.',
  },
  {
    topic: 'Ex 1.4 · Reversal Laws',
    mistake: 'Writing (AB)ᵗ = AᵗBᵗ or (AB)⁻¹ = A⁻¹B⁻¹.',
    correction: 'Both transpose and inverse reverse the order: (AB)ᵗ = BᵗAᵗ and (AB)⁻¹ = B⁻¹A⁻¹.',
  },
  {
    topic: 'Ex 1.5 · Determinant Signs',
    mistake: 'Evaluating |A| = ad + bc or mishandling minus signs when b or c is negative.',
    correction: 'Always subtract: ad − bc, using brackets such as (4)(3) − (2)(−1) = 12 + 2 = 14.',
  },
  {
    topic: 'Ex 1.5 · Adjoint Rule',
    mistake: 'Changing the signs of the main diagonal entries or forgetting to swap a and d.',
    correction: 'SWAP the main diagonal entries (a ↔ d) and NEGATE the off-diagonal entries (b → -b, c → -c).',
  },
  {
    topic: 'Ex 1.6 · Inversion Order',
    mistake: 'Computing X = B A⁻¹ instead of X = A⁻¹ B.',
    correction: 'Matrix multiplication is not commutative; A⁻¹ (2×2) times B (2×1) is valid, whereas B A⁻¹ is undefined!',
  },
  {
    topic: 'Ex 1.6 · Cramer’s Rule',
    mistake: 'Replacing the wrong column when building Aₓ or Aᵧ, or writing equations before standard ax + by = c form.',
    correction: 'Put x and y on the left and constants on the right first; B replaces Column 1 for Aₓ and Column 2 for Aᵧ.',
  },
];

// 10. IMPORTANT MCQ FACTS (Click-to-Reveal)
export const IMPORTANT_MCQ_FACTS: ImportantMcqFact[] = [
  {
    id: 'mcq-fact-1',
    prompt: 'If a matrix $A$ has order $m \\times n$, what is the order of its transpose $A^t$?',
    revealAnswer: '$n \\times m$ ($n$-by-$m$)',
    revealLatex: '(A_{m\\times n})^t = (A^t)_{n\\times m}',
    reason: 'Interchanging rows and columns swaps the two dimensions.',
  },
  {
    id: 'mcq-fact-2',
    prompt: 'What is always true about every main diagonal entry of a Skew-Symmetric matrix?',
    revealAnswer: 'Every main diagonal entry is $0$.',
    revealLatex: 'a_{ii} = -a_{ii} \\implies 2a_{ii} = 0 \\implies a_{ii} = 0',
    reason: 'Since $A^t = -A$, diagonal elements equal their own negatives, which only holds for $0$.',
  },
  {
    id: 'mcq-fact-3',
    prompt: 'What distinguishes a Scalar matrix from an Identity matrix?',
    revealAnswer: 'Every Identity matrix is a Scalar matrix with $k = 1$, whereas a Scalar matrix can have any equal non-zero diagonal constant $k$.',
    revealLatex: 'I = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}, \\quad S = \\begin{bmatrix} k & 0 \\\\ 0 & k \\end{bmatrix}',
    reason: 'For example, $\\operatorname{diag}(\\sqrt{2}, \\sqrt{2})$ is a Scalar matrix, not an Identity matrix.',
  },
  {
    id: 'mcq-fact-4',
    prompt: 'If $A$ has order $2 \\times 3$ and $B$ has order $3 \\times 4$, what is the order of $AB$? Does $BA$ exist?',
    revealAnswer: '$AB$ has order $2 \\times 4$; $BA$ does NOT exist.',
    revealLatex: 'A_{2\\times 3} \\cdot B_{3\\times 4} = (AB)_{2\\times 4}',
    reason: 'Columns of $B$ ($4$) $\\neq$ rows of $A$ ($2$), so $BA$ is not conformable.',
  },
  {
    id: 'mcq-fact-5',
    prompt: 'Complete the standard board identity: $(AB)^{-1} = ?$',
    revealAnswer: '$B^{-1} A^{-1}$',
    revealLatex: '(AB)^{-1} = B^{-1} A^{-1}',
    reason: 'Inverse of a product reverses order (provided both $A$ and $B$ are non-singular).',
  },
  {
    id: 'mcq-fact-6',
    prompt: 'What is the determinant of the $2 \\times 2$ identity matrix $I$?',
    revealAnswer: '$|I| = 1$',
    revealLatex: '|I| = (1)(1) - (0)(0) = 1',
    reason: 'An identity matrix is always non-singular with determinant $1$ and $I^{-1} = I$.',
  },
  {
    id: 'mcq-fact-7',
    prompt: 'When is a square matrix $A$ guaranteed NOT to have a multiplicative inverse?',
    revealAnswer: 'When $|A| = 0$ (i.e., $A$ is singular).',
    revealLatex: '|A| = 0 \\implies A^{-1} \\text{ does not exist}',
    reason: 'Division by $|A| = 0$ in $\\frac{1}{|A|}\\operatorname{Adj}(A)$ is undefined.',
  },
  {
    id: 'mcq-fact-8',
    prompt: 'What is the additive identity for any $m \\times n$ matrix $A$?',
    revealAnswer: 'The $m \\times n$ Null (Zero) matrix $O$.',
    revealLatex: 'A + O = O + A = A',
    reason: 'Adding $0$ to each entry leaves every entry unchanged.',
  },
  {
    id: 'mcq-fact-9',
    prompt: 'If $X + \\begin{bmatrix} -1 & -2 \\\\ 0 & -1 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}$, how do you isolate $X$?',
    revealAnswer: 'Add $\\begin{bmatrix} 1 & 2 \\\\ 0 & 1 \\end{bmatrix}$ to the right side: $X = \\begin{bmatrix} 2 & 2 \\\\ 0 & 2 \\end{bmatrix}$.',
    revealLatex: 'X = I - (-M) = I + M',
    reason: 'Subtracting a negative matrix adds its entries.',
  },
  {
    id: 'mcq-fact-10',
    prompt: 'In Cramer’s Rule, if $|A| = 0$ and $|A_x| \\neq 0$, how many solutions does the system have?',
    revealAnswer: 'No solution (the equations represent parallel lines).',
    revealLatex: '|A| = 0 \\implies \\text{No unique solution}',
    reason: 'Cramer’s Rule requires $|A| \\neq 0$ for a unique solution.',
  },
];

// EXPANDED FORMULA & CONCEPT FLASHCARDS (15 Cards covering all 6 exercises)
export const EXPANDED_REVISION_CARDS: RevisionCard[] = [
  {
    id: 'rev-1',
    topicId: 'order-equality',
    frontTitle: 'Order of a Matrix',
    frontPrompt: 'How do you state the order of a matrix with $m$ horizontal rows and $n$ vertical columns?',
    backAnswer: 'Order is written as $m\\text{-by-}n$ (rows first, columns second).',
    backLatex: '\\text{Order} = m \\times n',
  },
  {
    id: 'rev-2',
    topicId: 'order-equality',
    frontTitle: 'Matrix Equality Condition',
    frontPrompt: 'State the two conditions required for $A = B$.',
    backAnswer: '$A$ and $B$ must have the same order AND equal corresponding entries.',
    backLatex: '\\text{Order}(A) = \\text{Order}(B) \\;\\&\\; a_{ij} = b_{ij}',
  },
  {
    id: 'rev-3',
    topicId: 'types-transpose',
    frontTitle: 'Symmetric vs Skew-Symmetric',
    frontPrompt: 'What condition defines a Symmetric matrix versus a Skew-Symmetric matrix?',
    backAnswer: 'A square matrix $A$ is symmetric if $A^t = A$, and skew-symmetric if $A^t = -A$.',
    backLatex: 'A^t = A \\; (\\text{Symmetric}), \\quad A^t = -A \\; (\\text{Skew-Symmetric})',
  },
  {
    id: 'rev-4',
    topicId: 'types-transpose',
    frontTitle: 'Scalar vs Identity Matrix',
    frontPrompt: 'What is the difference between a Scalar matrix and an Identity matrix?',
    backAnswer: 'Both are diagonal with equal diagonal entries $k \\neq 0$. An Identity matrix is the special case where $k = 1$.',
    backLatex: 'S = \\begin{bmatrix} k & 0 \\\\ 0 & k \\end{bmatrix}, \\quad I = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}',
  },
  {
    id: 'rev-5',
    topicId: 'add-sub',
    frontTitle: 'Additive Identity & Inverse',
    frontPrompt: 'What are the additive identity and additive inverse of a matrix $A$?',
    backAnswer: 'The zero matrix $O$ (same order as $A$) is the additive identity; $-A$ is the additive inverse.',
    backLatex: 'A + O = A, \\quad A + (-A) = O',
  },
  {
    id: 'rev-6',
    topicId: 'add-sub',
    frontTitle: 'Sum Transpose Law',
    frontPrompt: 'How does transpose distribute over matrix addition $(A + B)^t$?',
    backAnswer: 'It equals the sum of the individual transposes.',
    backLatex: '(A + B)^t = A^t + B^t',
  },
  {
    id: 'rev-7',
    topicId: 'multiplication',
    frontTitle: 'Conformability for $AB$',
    frontPrompt: 'When can you multiply two matrices $A$ and $B$ to get $AB$?',
    backAnswer: 'Only when the number of columns in $A$ equals the number of rows in $B$.',
    backLatex: 'A_{m \\times n} \\cdot B_{n \\times p} \\implies (AB)_{m \\times p}',
  },
  {
    id: 'rev-8',
    topicId: 'multiplication',
    frontTitle: 'Transpose of a Product',
    frontPrompt: 'Complete the identity: $(AB)^t = ?$',
    backAnswer: 'The transpose of a product equals the product of transposes in reverse order.',
    backLatex: '(AB)^t = B^t A^t',
  },
  {
    id: 'rev-9',
    topicId: 'multiplication',
    frontTitle: 'Commutativity Check',
    frontPrompt: 'Is matrix multiplication commutative in general ($AB = BA$)?',
    backAnswer: 'No! In general $AB \\neq BA$, except special cases like $AI = IA$ or $AA^{-1} = A^{-1}A$.',
    backLatex: 'AB \\neq BA \\; (\\text{in general})',
  },
  {
    id: 'rev-10',
    topicId: 'determinant-inverse',
    frontTitle: '2×2 Determinant Formula',
    frontPrompt: 'How do you compute $|A|$ for $A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$?',
    backAnswer: 'Main diagonal product minus secondary diagonal product.',
    backLatex: '|A| = ad - bc',
  },
  {
    id: 'rev-11',
    topicId: 'determinant-inverse',
    frontTitle: 'Singular Matrix Test',
    frontPrompt: 'When is a square matrix $A$ called singular, and does $A^{-1}$ exist?',
    backAnswer: 'If $|A| = 0$, $A$ is singular and its multiplicative inverse does not exist.',
    backLatex: '|A| = ad - bc = 0 \\implies \\text{Singular (No inverse)}',
  },
  {
    id: 'rev-12',
    topicId: 'determinant-inverse',
    frontTitle: '2×2 Inverse Formula',
    frontPrompt: 'State the formula for $A^{-1}$ when $A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$ and $|A| \\neq 0$.',
    backAnswer: 'Divide the adjoint matrix by the determinant $|A|$.',
    backLatex: 'A^{-1} = \\frac{1}{ad - bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}',
  },
  {
    id: 'rev-13',
    topicId: 'determinant-inverse',
    frontTitle: 'Inverse Reversal Law',
    frontPrompt: 'Complete the identity for two non-singular matrices: $(AB)^{-1} = ?$',
    backAnswer: 'The inverse of a product equals the product of inverses in reverse order.',
    backLatex: '(AB)^{-1} = B^{-1} A^{-1}',
  },
  {
    id: 'rev-14',
    topicId: 'linear-systems',
    frontTitle: 'Matrix Inversion Method',
    frontPrompt: 'If $AX = B$ and $|A| \\neq 0$, how do you solve for $X$?',
    backAnswer: 'Multiply $B$ on the left by $A^{-1}$.',
    backLatex: 'X = A^{-1}B = \\frac{1}{|A|}(\\operatorname{Adj} A)B',
  },
  {
    id: 'rev-15',
    topicId: 'linear-systems',
    frontTitle: 'Cramer’s Rule',
    frontPrompt: 'How are $x$ and $y$ computed using Cramer’s Rule?',
    backAnswer: 'Replace column 1 of $A$ with $B$ for $A_x$, and column 2 with $B$ for $A_y$.',
    backLatex: 'x = \\frac{|A_x|}{|A|}, \\quad y = \\frac{|A_y|}{|A|}',
  },
];

// SHORT SELF-TESTING MINI-QUIZ
export const REVISION_SELF_TESTS: SelfTestQuestion[] = [
  {
    id: 'st-1',
    topicId: 'order-equality',
    prompt: 'A matrix has $3$ rows and $1$ column. Its order and type are:',
    options: [
      'Order $3 \\times 1$, Column matrix',
      'Order $1 \\times 3$, Row matrix',
      'Order $3 \\times 1$, Row matrix',
      'Order $3 \\times 3$, Square matrix',
    ],
    correctIndex: 0,
    explanation: 'Rows come first ($3$) and columns second ($1$). Having $1$ column makes it a column matrix.',
  },
  {
    id: 'st-2',
    topicId: 'types-transpose',
    prompt: 'Which matrix is Skew-Symmetric?',
    options: [
      '$\\begin{bmatrix} 1 & 2 \\\\ 2 & 1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 0 & -3 \\\\ 3 & 0 \\end{bmatrix}$',
      '$\\begin{bmatrix} 3 & 0 \\\\ 0 & 3 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & 0 \\\\ 0 & -1 \\end{bmatrix}$',
    ],
    correctIndex: 1,
    explanation: 'Its transpose is $\\begin{bmatrix} 0 & 3 \\\\ -3 & 0 \\end{bmatrix} = -A$, and its diagonal entries are $0$.',
  },
  {
    id: 'st-3',
    topicId: 'multiplication',
    prompt: 'If $P$ is $3 \\times 2$ and $Q$ is $2 \\times 4$, what is the order of $(PQ)^t$?',
    options: ['$3 \\times 4$', '$4 \\times 3$', '$2 \\times 2$', 'Not defined'],
    correctIndex: 1,
    explanation: '$PQ$ has order $3 \\times 4$, so its transpose $(PQ)^t$ swaps dimensions to $4 \\times 3$.',
  },
  {
    id: 'st-4',
    topicId: 'determinant-inverse',
    prompt: 'What is $|A|$ if $A = \\begin{bmatrix} 5 & -2 \\\\ 3 & 4 \\end{bmatrix}$?',
    options: ['14', '26', '-26', '20'],
    correctIndex: 1,
    explanation: '$|A| = (5)(4) - (-2)(3) = 20 - (-6) = 26$.',
  },
  {
    id: 'st-5',
    topicId: 'determinant-inverse',
    prompt: 'Which matrix has NO multiplicative inverse?',
    options: [
      '$\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 2 & 4 \\\\ 1 & 2 \\end{bmatrix}$',
      '$\\begin{bmatrix} 3 & 1 \\\\ 2 & 1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 4 & 0 \\\\ 0 & -2 \\end{bmatrix}$',
    ],
    correctIndex: 1,
    explanation: '$\\det\\begin{bmatrix} 2 & 4 \\\\ 1 & 2 \\end{bmatrix} = (2)(2) - (4)(1) = 4 - 4 = 0$, so the matrix is singular and has no inverse.',
  },
  {
    id: 'st-6',
    topicId: 'linear-systems',
    prompt: 'In Cramer’s Rule, if $|A| = -4$, $|A_x| = 12$, and $|A_y| = -8$, then $(x, y) =$',
    options: ['$(-3, 2)$', '$(3, -2)$', '$(-3, -2)$', '$(2, -3)$'],
    correctIndex: 0,
    explanation: '$x = 12 / (-4) = -3$ and $y = (-8) / (-4) = 2$.',
  },
];

// Locally generated downloadable text revision summary
export function buildDownloadableRevisionText(): string {
  const lines: string[] = [
    'GRADE 9 MATHEMATICS - UNIT 1: MATRICES AND DETERMINANTS',
    'Comprehensive Quick Revision Summary (Punjab Textbook Board Syllabus)',
    '====================================================================',
    '',
    '1. IMPORTANT DEFINITIONS',
    '------------------------',
    ...IMPORTANT_DEFINITIONS.map(
      (d) => `- ${d.term}: ${d.definition.replace(/\$/g, '')}${d.formulaLatex ? ` [${d.formulaLatex}]` : ''}`
    ),
    '',
    '2. MATRIX CLASSIFICATION TABLE (12 TYPES)',
    '-----------------------------------------',
    ...MATRIX_CLASSIFICATION_TABLE.map(
      (r) => `- ${r.type}: ${r.condition.replace(/\$/g, '')} | Note: ${r.note.replace(/\$/g, '')}`
    ),
    '',
    '3. ALL IMPORTANT FORMULAS',
    '-------------------------',
    ...ALL_IMPORTANT_FORMULAS.map(
      (f) => `- ${f.title} (${f.exercise}): ${f.latex} -- ${f.note.replace(/\$/g, '')}`
    ),
    '',
    '4. PROPERTIES OF MATRIX OPERATIONS',
    '----------------------------------',
    ...MATRIX_OPERATION_PROPERTIES.map(
      (p) => `- [${p.group}] ${p.name}: ${p.latex} (${p.condition.replace(/\$/g, '')})`
    ),
    '',
    '5. DETERMINANT RULES (2x2)',
    '--------------------------',
    ...DETERMINANT_RULES.map((d) => `- ${d.title}: ${d.latex} -- ${d.explanation.replace(/\$/g, '')}`),
    '',
    '6. ADJOINT AND INVERSE FORMULAS',
    '-------------------------------',
    '- For A = [[a, b], [c, d]]:',
    '- |A| = ad - bc',
    '- Adj(A) = [[d, -b], [-c, a]]',
    '- A^-1 = (1 / |A|) * Adj(A), valid only when |A| != 0',
    ...ADJOINT_INVERSE_SUMMARY.checklist.map((s) => `  * ${s}`),
    '',
    "7. CRAMER'S RULE FORMULAS",
    '-------------------------',
    '- Standard System: a1*x + b1*y = c1, a2*x + b2*y = c2',
    '- x = |Ax| / |A|,  y = |Ay| / |A|  (|A| != 0)',
    ...CRAMERS_RULE_SUMMARY.steps.map((s) => `  * ${s}`),
    '',
    '8. MATRIX INVERSION METHOD',
    '--------------------------',
    '- Matrix Form: A * X = B  =>  X = A^-1 * B = (1 / |A|) * Adj(A) * B',
    ...MATRIX_INVERSION_SUMMARY.steps.map((s) => `  * ${s}`),
    '',
    '9. COMMON EXAMINATION MISTAKES TO AVOID',
    '---------------------------------------',
    ...COMMON_EXAM_MISTAKES.map(
      (m) => `- [${m.topic}] Mistake: ${m.mistake} | Fix: ${m.correction}`
    ),
    '',
    '10. IMPORTANT MCQ FACTS',
    '-----------------------',
    ...IMPORTANT_MCQ_FACTS.map(
      (f, idx) =>
        `${idx + 1}. ${f.prompt.replace(/\$/g, '')} -> Answer: ${f.revealAnswer.replace(/\$/g, '')} (${f.reason.replace(/\$/g, '')})`
    ),
    '',
  ];
  return lines.join('\n');
}
