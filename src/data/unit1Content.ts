import type {
  BoardQuestion,
  ConceptLesson,
  NavItem,
  QuizQuestion,
  RevisionCard,
  TopicId,
  WorkedExample,
} from '../types/curriculum';

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    number: '01',
    label: 'Dashboard',
    shortLabel: 'Dashboard',
    phase: 'Start',
    description: 'Unit overview, study roadmap, and quick launch.',
  },
  {
    id: 'diagnostic',
    number: '02',
    label: 'Diagnostic Assessment',
    shortLabel: 'Diagnostic',
    phase: 'Start',
    description: 'Pre-unit baseline check to pinpoint focus areas.',
  },
  {
    id: 'learn',
    number: '03',
    label: 'Learn Concepts',
    shortLabel: 'Learn',
    phase: 'Learn & Explore',
    description: 'Structured lessons for Exercises 1.1 to 1.6.',
  },
  {
    id: 'lab',
    number: '04',
    label: 'Interactive Mathematics Lab',
    shortLabel: 'Math Lab',
    phase: 'Learn & Explore',
    description: 'Live matrix builder, SVG animations, and equation solver.',
  },
  {
    id: 'examples',
    number: '05',
    label: 'Worked Examples',
    shortLabel: 'Examples',
    phase: 'Learn & Explore',
    description: 'Step-by-step syllabus solutions with examiner notes.',
  },
  {
    id: 'practice',
    number: '06',
    label: 'Practice Zone',
    shortLabel: 'Practice',
    phase: 'Practice & Exam',
    description: 'Topic drills, dynamic problem generator, and instant hints.',
  },
  {
    id: 'revision',
    number: '07',
    label: 'Quick Revision',
    shortLabel: 'Revision',
    phase: 'Practice & Exam',
    description: 'Formula sheets, properties matrix, and flashcards.',
  },
  {
    id: 'board-prep',
    number: '08',
    label: 'Board Examination Preparation',
    shortLabel: 'Board Prep',
    phase: 'Practice & Exam',
    description: 'BISE Punjab paper pattern, MCQs, short & long questions.',
  },
  {
    id: 'applications',
    number: '09',
    label: 'Real-life Applications',
    shortLabel: 'Applications',
    phase: 'Learn & Explore',
    description: 'Pixels, cryptography, inventory cost, and linear models.',
  },
  {
    id: 'final-assessment',
    number: '10',
    label: 'Final Unit Assessment',
    shortLabel: 'Final Test',
    phase: 'Practice & Exam',
    description: 'Comprehensive 15-question unit mastery exam.',
  },
  {
    id: 'progress',
    number: '11',
    label: 'Student Progress Dashboard',
    shortLabel: 'Progress',
    phase: 'Track',
    description: 'Topic mastery analytics, scores, and study report.',
  },
];

export const TOPIC_LABELS: Record<TopicId, { title: string; exercise: string }> = {
  'order-equality': { title: 'Order & Equal Matrices', exercise: 'Exercise 1.1' },
  'types-transpose': { title: 'Types, Negative & Transpose', exercise: 'Exercise 1.2' },
  'add-sub': { title: 'Addition & Subtraction', exercise: 'Exercise 1.3' },
  multiplication: { title: 'Matrix Multiplication', exercise: 'Exercise 1.4' },
  'determinant-inverse': { title: 'Determinant & Inverse', exercise: 'Exercise 1.5' },
  'linear-systems': { title: 'Simultaneous Linear Equations', exercise: 'Exercise 1.6' },
};

export const CONCEPT_LESSONS: ConceptLesson[] = [
  {
    id: 'order-equality',
    exerciseRef: 'Exercise 1.1',
    title: '1.1 Introduction, Order & Equal Matrices',
    subtitle: 'Understanding rectangular arrays, rows, columns, and matrix equality',
    learningObjectives: [
      'Define a matrix and identify its rows and columns.',
      'Determine the order (dimension) of any given matrix as m-by-n.',
      'Identify whether two matrices are equal and solve for unknown entries.',
    ],
    keyDefinitions: [
      {
        term: 'Matrix',
        definition:
          'A rectangular array or formation of a collection of real numbers enclosed within square brackets $[\\;]$ is called a matrix. Matrices are usually denoted by capital letters $A, B, C, \\dots$',
        exampleLatex: 'A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{bmatrix}',
      },
      {
        term: 'Rows and Columns',
        definition:
          'Horizontal lines of entries are called rows ($R_1, R_2, \\dots$) and vertical lines of entries are called columns ($C_1, C_2, \\dots$).',
        exampleLatex: 'R_1 = \\begin{bmatrix} 1 & 2 & 3 \\end{bmatrix}, \\quad C_2 = \\begin{bmatrix} 2 \\\\ 5 \\end{bmatrix}',
      },
      {
        term: 'Order of a Matrix',
        definition:
          'If a matrix $M$ has $m$ rows and $n$ columns, then its order is written as $m\\text{-by-}n$ (or $m \\times n$). Always state the number of rows first.',
        formulaLatex: '\\text{Order} = (\\text{Number of rows}) \\times (\\text{Number of columns})',
        exampleLatex: 'B = \\begin{bmatrix} 2 & 0 \\\\ -1 & 4 \\\\ 7 & 3 \\end{bmatrix} \\implies \\text{Order is } 3\\text{-by-}2',
      },
      {
        term: 'Equal Matrices ($A = B$)',
        definition:
          'Two matrices $A$ and $B$ are equal if and only if: (1) Order of $A$ equals Order of $B$, and (2) Their corresponding entries are equal ($a_{ij} = b_{ij}$).',
        exampleLatex:
          '\\begin{bmatrix} 2 & 3 \\\\ 1 & 5 \\end{bmatrix} = \\begin{bmatrix} 2 & 1+2 \\\\ 1 & 3+2 \\end{bmatrix}',
      },
    ],
    propertiesAndRules: [
      {
        title: 'Standard Entry Notation',
        latex: 'A = [a_{ij}]_{m \\times n}',
        note: 'Here $i$ denotes the row index and $j$ denotes the column index of entry $a_{ij}$.',
      },
      {
        title: 'Total Number of Entries',
        latex: '\\text{Total Entries} = m \\times n',
        note: 'A $3 \\times 2$ matrix always contains $3 \\times 2 = 6$ real-number entries.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Writing columns before rows when stating the order (e.g., calling a 2-row, 3-column matrix 3-by-2).',
        correction: 'Remember "RC" (Rows then Columns): count horizontal rows first, then vertical columns.',
      },
      {
        mistake: 'Assuming two matrices are equal just because they contain the same set of numbers in different positions.',
        correction: 'Both the order AND the exact position of every corresponding entry must match.',
      },
    ],
    quickCheck: {
      question:
        'If $\\begin{bmatrix} a+1 & 3 \\\\ 4 & b-2 \\end{bmatrix} = \\begin{bmatrix} 5 & 3 \\\\ 4 & 1 \\end{bmatrix}$, what are the values of $a$ and $b$?',
      options: ['$a = 4, b = 3$', '$a = 6, b = -1$', '$a = 4, b = -1$', '$a = 5, b = 1$'],
      correctIndex: 0,
      explanation: 'Equating corresponding entries gives $a+1 = 5 \\implies a = 4$, and $b-2 = 1 \\implies b = 3$.',
    },
  },
  {
    id: 'types-transpose',
    exerciseRef: 'Exercise 1.2',
    title: '1.2 Types of Matrices, Negative & Transpose',
    subtitle: 'Classifying matrices by shape and symmetry, plus transpose and negative operations',
    learningObjectives: [
      'Recognize Row, Column, Rectangular, Square, and Null/Zero matrices.',
      'Find the Negative ($-A$) and Transpose ($A^t$) of any matrix.',
      'Distinguish between Symmetric, Skew-Symmetric, Diagonal, Scalar, and Identity matrices.',
    ],
    keyDefinitions: [
      {
        term: 'Row & Column Matrices',
        definition:
          'A matrix with only one row is a Row Matrix ($1 \\times n$). A matrix with only one column is a Column Matrix ($m \\times 1$).',
        exampleLatex: 'R = \\begin{bmatrix} 2 & -1 & 5 \\end{bmatrix}, \\quad C = \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}',
      },
      {
        term: 'Rectangular vs Square Matrix',
        definition:
          'If number of rows $\\neq$ number of columns ($m \\neq n$), it is a Rectangular Matrix. If $m = n$, it is a Square Matrix.',
        exampleLatex: 'S = \\begin{bmatrix} 2 & -1 \\\\ 0 & 3 \\end{bmatrix} \\; (2 \\times 2 \\text{ Square})',
      },
      {
        term: 'Null or Zero Matrix ($O$)',
        definition: 'A matrix of any order in which every entry is $0$.',
        exampleLatex: 'O = \\begin{bmatrix} 0 & 0 \\\\ 0 & 0 \\end{bmatrix}',
      },
      {
        term: 'Transpose of a Matrix ($A^t$)',
        definition:
          'Obtained by interchanging the rows of $A$ into columns (or columns into rows). If $A$ is $m \\times n$, then $A^t$ is $n \\times m$.',
        exampleLatex:
          'A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{bmatrix} \\implies A^t = \\begin{bmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{bmatrix}',
      },
      {
        term: 'Symmetric & Skew-Symmetric Matrices',
        definition:
          'A square matrix $A$ is Symmetric if $A^t = A$. It is Skew-Symmetric if $A^t = -A$ (which forces all main diagonal entries to be $0$).',
        exampleLatex:
          '\\text{Symmetric: } \\begin{bmatrix} 1 & 2 \\\\ 2 & -3 \\end{bmatrix}, \\quad \\text{Skew-Symmetric: } \\begin{bmatrix} 0 & 4 \\\\ -4 & 0 \\end{bmatrix}',
      },
      {
        term: 'Diagonal, Scalar & Identity ($I$) Matrices',
        definition:
          'A square matrix with all non-diagonal entries zero and at least one non-zero diagonal entry is Diagonal. If all diagonal entries are equal ($k \\neq 0$), it is Scalar. If every diagonal entry is $1$, it is an Identity (Unit) Matrix $I$.',
        exampleLatex:
          'D = \\begin{bmatrix} 2 & 0 \\\\ 0 & 5 \\end{bmatrix}, \\quad S = \\begin{bmatrix} 3 & 0 \\\\ 0 & 3 \\end{bmatrix}, \\quad I_2 = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}',
      },
    ],
    propertiesAndRules: [
      {
        title: 'Double Transpose Identity',
        latex: '(A^t)^t = A',
        note: 'Taking the transpose twice returns the original matrix.',
      },
      {
        title: 'Hierarchy of Special Square Matrices',
        latex: '\\text{Identity} \\subset \\text{Scalar} \\subset \\text{Diagonal} \\subset \\text{Square}',
        note: 'Every identity matrix is scalar and diagonal, and every scalar matrix is diagonal.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Calling a zero matrix $\\begin{bmatrix} 0 & 0 \\\\ 0 & 0 \\end{bmatrix}$ a diagonal matrix.',
        correction: 'In the Punjab Board definition, a diagonal matrix must have at least one non-zero entry on its main diagonal.',
      },
      {
        mistake: 'Placing non-zero entries on the diagonal of a skew-symmetric matrix.',
        correction: 'Since $a_{ii} = -a_{ii}$, every main diagonal entry of a skew-symmetric matrix must be $0$.',
      },
    ],
    quickCheck: {
      question: 'Which statement is true about the matrix $M = \\begin{bmatrix} 5 & 0 \\\\ 0 & 5 \\end{bmatrix}$?',
      options: [
        'It is both a diagonal matrix and a scalar matrix.',
        'It is an identity matrix.',
        'It is a skew-symmetric matrix.',
        'It is a rectangular matrix.',
      ],
      correctIndex: 0,
      explanation: 'All non-diagonal entries are 0 and all diagonal entries are equal to 5 ($\\neq 0$), making it both diagonal and scalar.',
    },
  },
  {
    id: 'add-sub',
    exerciseRef: 'Exercise 1.3',
    title: '1.3 Addition, Subtraction & Scalar Multiplication',
    subtitle: 'Conformability rules, additive identity, additive inverse, and algebraic laws',
    learningObjectives: [
      'Check whether two matrices are conformable for addition or subtraction.',
      'Perform matrix addition, subtraction, and multiplication by a real scalar $k$.',
      'Verify commutative and associative laws of matrix addition.',
    ],
    keyDefinitions: [
      {
        term: 'Conformability for Addition / Subtraction',
        definition:
          'Two matrices $A$ and $B$ are conformable for addition or subtraction if and only if they have the exact same order.',
        formulaLatex: '\\text{Order}(A) = \\text{Order}(B) = m \\times n',
      },
      {
        term: 'Matrix Addition ($A + B$)',
        definition: 'Add corresponding entries: $(A + B)_{ij} = a_{ij} + b_{ij}$.',
        exampleLatex:
          '\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} + \\begin{bmatrix} 5 & -1 \\\\ 0 & 2 \\end{bmatrix} = \\begin{bmatrix} 6 & 1 \\\\ 3 & 6 \\end{bmatrix}',
      },
      {
        term: 'Scalar Multiplication ($kA$)',
        definition: 'Multiply every single entry of matrix $A$ by the real number $k$.',
        exampleLatex: '3 \\begin{bmatrix} 2 & -1 \\\\ 4 & 0 \\end{bmatrix} = \\begin{bmatrix} 6 & -3 \\\\ 12 & 0 \\end{bmatrix}',
      },
      {
        term: 'Additive Identity & Additive Inverse',
        definition:
          'The zero matrix $O$ of the same order as $A$ is the additive identity ($A + O = A$). The negative matrix $-A$ is the additive inverse ($A + (-A) = O$).',
      },
    ],
    propertiesAndRules: [
      {
        title: 'Commutative Law of Addition',
        latex: 'A + B = B + A',
        note: 'Order does not matter when adding conformable matrices.',
      },
      {
        title: 'Associative Law of Addition',
        latex: '(A + B) + C = A + (B + C)',
        note: 'Grouping does not change the sum.',
      },
      {
        title: 'Transpose of a Sum',
        latex: '(A + B)^t = A^t + B^t',
        note: 'Frequently tested in Exercise 1.3 board questions.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Attempting to add a $2 \\times 2$ matrix with a $2 \\times 3$ matrix.',
        correction: 'Always check orders first. If orders differ, write "Not conformable for addition".',
      },
      {
        mistake: 'Forgetting to distribute the minus sign to negative entries in $A - B$.',
        correction: 'Write $A - B = A + (-B)$ and pay close attention to signs: $2 - (-3) = 5$.',
      },
    ],
    quickCheck: {
      question:
        'If $A = \\begin{bmatrix} 2 & -1 \\\\ 3 & 0 \\end{bmatrix}$, what is the additive inverse of $A$?',
      options: [
        '$\\begin{bmatrix} -2 & 1 \\\\ -3 & 0 \\end{bmatrix}$',
        '$\\begin{bmatrix} 2 & 3 \\\\ -1 & 0 \\end{bmatrix}$',
        '$\\begin{bmatrix} 0 & 0 \\\\ 0 & 0 \\end{bmatrix}$',
        '$\\begin{bmatrix} -2 & -1 \\\\ -3 & 0 \\end{bmatrix}$',
      ],
      correctIndex: 0,
      explanation: 'The additive inverse of $A$ is $-A$, formed by reversing the sign of every entry.',
    },
  },
  {
    id: 'multiplication',
    exerciseRef: 'Exercise 1.4',
    title: '1.4 Multiplication of Matrices',
    subtitle: 'Row-by-column product, conformability, non-commutativity, and transpose law',
    learningObjectives: [
      'Determine whether product $AB$ is defined using inner dimensions.',
      'Compute the product $AB$ using row-by-column dot products.',
      'Understand why $AB \\neq BA$ in general, and verify $(AB)^t = B^t A^t$.',
    ],
    keyDefinitions: [
      {
        term: 'Conformability for Multiplication',
        definition:
          'The product $AB$ is defined if and only if the number of columns in $A$ equals the number of rows in $B$.',
        formulaLatex: 'A_{m \\times \\mathbf{n}} \\cdot B_{\\mathbf{n} \\times p} = (AB)_{m \\times p}',
      },
      {
        term: 'Row-by-Column Rule',
        definition:
          'To find the entry in row $i$ and column $j$ of $AB$, multiply each entry of row $i$ of $A$ by the corresponding entry of column $j$ of $B$, then add the products.',
        exampleLatex:
          '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\begin{bmatrix} e & f \\\\ g & h \\end{bmatrix} = \\begin{bmatrix} ae+bg & af+bh \\\\ ce+dg & cf+dh \\end{bmatrix}',
      },
    ],
    propertiesAndRules: [
      {
        title: 'Non-Commutativity in General',
        latex: 'AB \\neq BA',
        note: 'Even when both $AB$ and $BA$ exist, they are usually not equal!',
      },
      {
        title: 'Associative & Distributive Laws',
        latex: '(AB)C = A(BC), \\quad A(B+C) = AB + AC',
        note: 'Preserve left-to-right order when expanding brackets.',
      },
      {
        title: 'Transpose of a Product (Reversal Law)',
        latex: '(AB)^t = B^t A^t',
        note: 'Notice the order reverses! $(AB)^t \\neq A^t B^t$ in general.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Multiplying matrices entry-by-entry (like addition).',
        correction: 'Matrix multiplication always pairs ROWS of the first matrix with COLUMNS of the second matrix.',
      },
      {
        mistake: 'Writing $(AB)^t = A^t B^t$ instead of $B^t A^t$.',
        correction: 'Remember the "socks and shoes" reversal rule: $(AB)^t = B^t A^t$.',
      },
    ],
    quickCheck: {
      question: 'If matrix $A$ has order $2 \\times 3$ and matrix $B$ has order $3 \\times 4$, what is the order of $AB$?',
      options: ['$2 \\times 4$', '$3 \\times 3$', '$4 \\times 2$', 'Not defined'],
      correctIndex: 0,
      explanation: 'Inner dimensions match ($3 = 3$), so the outer dimensions give the product order $2 \\times 4$.',
    },
  },
  {
    id: 'determinant-inverse',
    exerciseRef: 'Exercise 1.5',
    title: '1.5 Determinant, Adjoint & Multiplicative Inverse',
    subtitle: 'Singular vs non-singular matrices, adjoint of a 2×2 matrix, and inverse formula',
    learningObjectives: [
      'Evaluate the determinant $|A|$ of any $2 \\times 2$ matrix.',
      'Distinguish between singular ($|A|=0$) and non-singular ($|A|\\neq 0$) matrices.',
      'Find the adjoint $\\text{Adj } A$ and multiplicative inverse $A^{-1}$.',
    ],
    keyDefinitions: [
      {
        term: 'Determinant of a $2 \\times 2$ Matrix',
        definition: 'For $A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$, its determinant is the scalar $|A| = \\det A = ad - bc$.',
        formulaLatex: '|A| = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc',
      },
      {
        term: 'Singular vs Non-Singular Matrix',
        definition:
          'A square matrix $A$ is Singular if $|A| = 0$ (no inverse exists). It is Non-Singular if $|A| \\neq 0$ (inverse exists).',
      },
      {
        term: 'Adjoint of a $2 \\times 2$ Matrix',
        definition:
          'Swap the main diagonal entries ($a \\leftrightarrow d$) and change the signs of the other two entries ($b \\to -b, c \\to -c$).',
        formulaLatex: '\\text{Adj } A = \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}',
      },
      {
        term: 'Multiplicative Inverse ($A^{-1}$)',
        definition: 'Exists only when $|A| \\neq 0$, satisfying $A A^{-1} = A^{-1} A = I$.',
        formulaLatex: 'A^{-1} = \\frac{1}{|A|} \\text{Adj } A = \\frac{1}{ad - bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}',
      },
    ],
    propertiesAndRules: [
      {
        title: 'Identity Check',
        latex: 'A A^{-1} = A^{-1} A = I_2',
        note: 'You can always verify your inverse in an exam by multiplying $A$ and $A^{-1}$.',
      },
      {
        title: 'Inverse of a Product (Reversal Law)',
        latex: '(AB)^{-1} = B^{-1} A^{-1}',
        note: 'Provided both $A$ and $B$ are non-singular.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Adding $ad + bc$ instead of subtracting $ad - bc$ in the determinant.',
        correction: 'Always subtract the secondary diagonal product: $(a \\cdot d) - (b \\cdot c)$.',
      },
      {
        mistake: 'Swapping signs of the wrong diagonal when taking the adjoint.',
        correction: 'Swap positions of $a$ and $d$; negate $b$ and $c$.',
      },
    ],
    quickCheck: {
      question: 'For what value of $k$ is the matrix $A = \\begin{bmatrix} 6 & 3 \\\\ k & 2 \\end{bmatrix}$ singular?',
      options: ['$k = 4$', '$k = 3$', '$k = -4$', '$k = 12$'],
      correctIndex: 0,
      explanation: 'For a singular matrix, $|A| = 0 \\implies (6)(2) - (3)(k) = 0 \\implies 12 - 3k = 0 \\implies k = 4$.',
    },
  },
  {
    id: 'linear-systems',
    exerciseRef: 'Exercise 1.6',
    title: '1.6 Solution of Simultaneous Linear Equations',
    subtitle: 'Solving systems using Matrix Inversion Method and Cramer’s Rule',
    learningObjectives: [
      'Convert two linear equations in two variables into matrix form $AX = B$.',
      'Solve systems using the Matrix Inversion Method: $X = A^{-1}B$.',
      'Solve systems using Cramer’s Rule: $x = \\frac{|A_x|}{|A|}, y = \\frac{|A_y|}{|A|}$.',
    ],
    keyDefinitions: [
      {
        term: 'Matrix Representation ($AX = B$)',
        definition: 'Write the system $a_1x + b_1y = c_1$ and $a_2x + b_2y = c_2$ in matrix form.',
        formulaLatex:
          '\\begin{bmatrix} a_1 & b_1 \\\\ a_2 & b_2 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} c_1 \\\\ c_2 \\end{bmatrix}',
      },
      {
        term: 'Method 1: Matrix Inversion Method',
        definition: 'Compute $|A|$. If $|A| \\neq 0$, find $A^{-1} = \\frac{1}{|A|} \\text{Adj } A$ and multiply $X = A^{-1} B$.',
        formulaLatex: 'X = A^{-1}B = \\frac{1}{|A|} (\\text{Adj } A) B',
      },
      {
        term: 'Method 2: Cramer’s Rule',
        definition:
          'Form $A_x$ by replacing the 1st column of $A$ with $B$, and $A_y$ by replacing the 2nd column of $A$ with $B$.',
        formulaLatex:
          'x = \\frac{|A_x|}{|A|}, \\quad y = \\frac{|A_y|}{|A|}, \\quad (|A| \\neq 0)',
      },
    ],
    propertiesAndRules: [
      {
        title: 'Consistent vs Inconsistent Systems',
        latex: '|A| \\neq 0 \\implies \\text{Unique Solution } (x, y)',
        note: 'If $|A| = 0$, neither Matrix Inversion nor Cramer’s Rule gives a unique solution.',
      },
      {
        title: 'Word Problem Translation',
        latex: '\\text{Let variables } x, y \\to \\text{Form 2 equations} \\to AX = B',
        note: 'Always write the final answer with clear units (e.g., cm, degrees, PKR).',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Multiplying $B A^{-1}$ instead of $A^{-1} B$ in the Matrix Inversion Method.',
        correction: 'Since matrix multiplication is not commutative, $X = A^{-1} B$ MUST have $A^{-1}$ on the left.',
      },
      {
        mistake: 'Replacing the wrong column when forming $A_x$ or $A_y$ in Cramer’s Rule.',
        correction: 'Column 1 holds $x$-coefficients so $B$ replaces Column 1 in $A_x$; Column 2 holds $y$-coefficients so $B$ replaces Column 2 in $A_y$.',
      },
    ],
    quickCheck: {
      question:
        'For the system $2x + y = 3$ and $6x + 5y = 1$, what is the matrix $A_x$ in Cramer’s Rule?',
      options: [
        '$\\begin{bmatrix} 3 & 1 \\\\ 1 & 5 \\end{bmatrix}$',
        '$\\begin{bmatrix} 2 & 3 \\\\ 6 & 1 \\end{bmatrix}$',
        '$\\begin{bmatrix} 2 & 1 \\\\ 6 & 5 \\end{bmatrix}$',
        '$\\begin{bmatrix} 1 & 3 \\\\ 5 & 1 \\end{bmatrix}$',
      ],
      correctIndex: 0,
      explanation: '$A_x$ replaces the first column of $A = \\begin{bmatrix} 2 & 1 \\\\ 6 & 5 \\end{bmatrix}$ with $B = \\begin{bmatrix} 3 \\\\ 1 \\end{bmatrix}$.',
    },
  },
];

export const DIAGNOSTIC_QUESTIONS: QuizQuestion[] = [
  // Module 1: Exercise 1.1
  {
    id: 'diag-1',
    topicId: 'order-equality',
    difficulty: 'Easy',
    conceptTag: 'Matrix Order (m-by-n)',
    prompt: 'What is the order of the matrix $M = \\begin{bmatrix} 2 & 0 & -4 \\\\ 1 & 7 & 9 \\end{bmatrix}$?',
    options: ['2-by-3', '3-by-2', '2-by-2', '1-by-6'],
    correctIndex: 0,
    hint: 'Count horizontal rows first, then vertical columns.',
    solutionSteps: ['Number of rows = 2.', 'Number of columns = 3.', 'Order = 2-by-3.'],
  },
  {
    id: 'diag-2',
    topicId: 'order-equality',
    difficulty: 'Easy',
    conceptTag: 'Equal Matrices & Unknowns',
    prompt: 'If $\\begin{bmatrix} x & 4 \\\\ -2 & y \\end{bmatrix} = \\begin{bmatrix} 7 & 4 \\\\ -2 & 9 \\end{bmatrix}$, find $x + y$.',
    options: ['16', '11', '2', '-16'],
    correctIndex: 0,
    hint: 'Equate corresponding entries to find $x$ and $y$ first.',
    solutionSteps: ['$x = 7$ and $y = 9$.', 'Therefore $x + y = 7 + 9 = 16$.'],
  },
  {
    id: 'diag-3',
    topicId: 'order-equality',
    difficulty: 'Medium',
    conceptTag: 'Conditions for Matrix Equality',
    prompt: 'Two matrices $A$ and $B$ are equal if and only if:',
    options: [
      'They have the same number of entries',
      'They have the same order and equal corresponding entries',
      'Both are square matrices',
      'Their sums of entries are equal',
    ],
    correctIndex: 1,
    hint: 'Both dimensions and every matching position must match.',
    solutionSteps: [
      'Equal matrices must have identical order ($m \\times n$).',
      'Every entry $a_{ij}$ must equal $b_{ij}$.',
    ],
  },

  // Module 2: Exercise 1.2
  {
    id: 'diag-4',
    topicId: 'types-transpose',
    difficulty: 'Easy',
    conceptTag: 'Row & Column Matrices',
    prompt: 'Which of the following is a column matrix?',
    options: [
      '$\\begin{bmatrix} 3 & -1 & 4 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 3 \\\\ -1 \\\\ 4 \\end{bmatrix}$',
      '$\\begin{bmatrix} 0 & 0 \\\\ 0 & 0 \\end{bmatrix}$',
    ],
    correctIndex: 2,
    hint: 'A column matrix has only 1 vertical column.',
    solutionSteps: ['$\\begin{bmatrix} 3 \\\\ -1 \\\\ 4 \\end{bmatrix}$ has order $3 \\times 1$, so it has a single column.'],
  },
  {
    id: 'diag-5',
    topicId: 'types-transpose',
    difficulty: 'Medium',
    conceptTag: 'Matrix Transpose (A^t)',
    prompt: 'What is the transpose of $A = \\begin{bmatrix} 1 & 5 \\\\ -2 & 3 \\\\ 0 & 4 \\end{bmatrix}$?',
    options: [
      '$\\begin{bmatrix} -1 & -5 \\\\ 2 & -3 \\\\ 0 & -4 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & -2 & 0 \\\\ 5 & 3 & 4 \\end{bmatrix}$',
      '$\\begin{bmatrix} 5 & 1 \\\\ 3 & -2 \\\\ 4 & 0 \\end{bmatrix}$',
      '$\\begin{bmatrix} 0 & 4 \\\\ -2 & 3 \\\\ 1 & 5 \\end{bmatrix}$',
    ],
    correctIndex: 1,
    hint: 'Turn each row into a column.',
    solutionSteps: ['Row 1 becomes Column 1, Row 2 becomes Column 2, Row 3 becomes Column 3.', '$A^t$ has order $2 \\times 3$.'],
  },
  {
    id: 'diag-6',
    topicId: 'types-transpose',
    difficulty: 'Medium',
    conceptTag: 'Symmetric & Skew-Symmetric Matrices',
    prompt: 'A square matrix $A$ is called skew-symmetric if:',
    options: ['$A^t = A$', '$A = O$', '$A^t = -A$', '$A = I$'],
    correctIndex: 2,
    hint: 'Compare symmetric ($A^t = A$) with skew-symmetric.',
    solutionSteps: ['By definition in Exercise 1.2, a square matrix $A$ is skew-symmetric when $A^t = -A$.'],
  },

  // Module 3: Exercise 1.3
  {
    id: 'diag-7',
    topicId: 'add-sub',
    difficulty: 'Easy',
    conceptTag: 'Matrix Addition & Subtraction',
    prompt: 'Compute $\\begin{bmatrix} 3 & -2 \\\\ 1 & 5 \\end{bmatrix} + \\begin{bmatrix} -1 & 4 \\\\ 2 & -3 \\end{bmatrix}$.',
    options: [
      '$\\begin{bmatrix} 2 & 2 \\\\ 3 & 2 \\end{bmatrix}$',
      '$\\begin{bmatrix} 4 & -6 \\\\ -1 & 8 \\end{bmatrix}$',
      '$\\begin{bmatrix} 2 & -6 \\\\ 3 & 2 \\end{bmatrix}$',
      '$\\begin{bmatrix} -3 & -8 \\\\ 2 & -15 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    hint: 'Add numbers in matching positions.',
    solutionSteps: ['$3+(-1)=2$, $-2+4=2$, $1+2=3$, $5+(-3)=2$.'],
  },
  {
    id: 'diag-8',
    topicId: 'add-sub',
    difficulty: 'Medium',
    conceptTag: 'Scalar Multiplication',
    prompt: 'If $A = \\begin{bmatrix} 2 & -3 \\\\ 1 & 4 \\end{bmatrix}$, find $2A$.',
    options: [
      '$\\begin{bmatrix} 4 & -3 \\\\ 1 & 4 \\end{bmatrix}$',
      '$\\begin{bmatrix} 4 & -1 \\\\ 3 & 6 \\end{bmatrix}$',
      '$\\begin{bmatrix} 2 & -6 \\\\ 2 & 4 \\end{bmatrix}$',
      '$\\begin{bmatrix} 4 & -6 \\\\ 2 & 8 \\end{bmatrix}$',
    ],
    correctIndex: 3,
    hint: 'Multiply every single entry by 2.',
    solutionSteps: ['$2A = \\begin{bmatrix} 2(2) & 2(-3) \\\\ 2(1) & 2(4) \\end{bmatrix} = \\begin{bmatrix} 4 & -6 \\\\ 2 & 8 \\end{bmatrix}$.'],
  },
  {
    id: 'diag-9',
    topicId: 'add-sub',
    difficulty: 'Medium',
    conceptTag: 'Additive Inverse & Conformability',
    prompt: 'What is the additive inverse of $B = \\begin{bmatrix} -5 & 2 \\\\ 0 & 3 \\end{bmatrix}$?',
    options: [
      '$\\begin{bmatrix} -5 & -2 \\\\ 0 & -3 \\end{bmatrix}$',
      '$\\begin{bmatrix} 5 & -2 \\\\ 0 & -3 \\end{bmatrix}$',
      '$\\begin{bmatrix} 3 & -2 \\\\ 0 & -5 \\end{bmatrix}$',
      '$\\begin{bmatrix} 0 & 0 \\\\ 0 & 0 \\end{bmatrix}$',
    ],
    correctIndex: 1,
    hint: 'The additive inverse $-B$ negates every entry so that $B + (-B) = O$.',
    solutionSteps: ['$-B = \\begin{bmatrix} -(-5) & -2 \\\\ 0 & -3 \\end{bmatrix} = \\begin{bmatrix} 5 & -2 \\\\ 0 & -3 \\end{bmatrix}$.'],
  },

  // Module 4: Exercise 1.4
  {
    id: 'diag-10',
    topicId: 'multiplication',
    difficulty: 'Medium',
    conceptTag: 'Conformability for Multiplication',
    prompt: 'Which pair of matrices is conformable for the product $AB$?',
    options: [
      '$A$ is $2 \\times 2$ and $B$ is $3 \\times 2$',
      '$A$ is $1 \\times 3$ and $B$ is $1 \\times 3$',
      '$A$ is $2 \\times 3$ and $B$ is $3 \\times 1$',
      '$A$ is $3 \\times 2$ and $B$ is $3 \\times 2$',
    ],
    correctIndex: 2,
    hint: 'Columns of $A$ must equal rows of $B$.',
    solutionSteps: ['In $A_{2\\times 3} \\cdot B_{3\\times 1}$, columns of $A$ (3) = rows of $B$ (3).'],
  },
  {
    id: 'diag-11',
    topicId: 'multiplication',
    difficulty: 'Medium',
    conceptTag: 'Row-by-Column Product',
    prompt: 'Evaluate $\\begin{bmatrix} 2 & -1 \\end{bmatrix} \\begin{bmatrix} 4 \\\\ 3 \\end{bmatrix}$.',
    options: ['$[5]$', '$[11]$', '$[8]$', '$[-5]$'],
    correctIndex: 0,
    hint: 'Multiply row entry by column entry and sum: $(2)(4) + (-1)(3)$.',
    solutionSteps: ['$(2)(4) + (-1)(3) = 8 - 3 = 5$, giving $[5]$.'],
  },
  {
    id: 'diag-12',
    topicId: 'multiplication',
    difficulty: 'Hard',
    conceptTag: '2x2 Matrix Product Entries',
    prompt: 'Let $A = \\begin{bmatrix} 1 & 2 \\\\ 0 & -1 \\end{bmatrix}$ and $B = \\begin{bmatrix} 2 & 0 \\\\ 3 & 1 \\end{bmatrix}$. What is the Row 1, Column 2 entry of $AB$?',
    options: ['8', '2', '-3', '0'],
    correctIndex: 1,
    hint: 'Multiply Row 1 of $A$ by Column 2 of $B$.',
    solutionSteps: ['Row 1 of $A$ is $[1 \\;\\; 2]$ and Column 2 of $B$ is $\\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}$.', '$(1)(0) + (2)(1) = 2$.'],
  },

  // Module 5: Exercise 1.5
  {
    id: 'diag-13',
    topicId: 'determinant-inverse',
    difficulty: 'Medium',
    conceptTag: '2x2 Determinant Calculation',
    prompt: 'Find the determinant of $P = \\begin{bmatrix} 4 & 2 \\\\ -1 & 3 \\end{bmatrix}$.',
    options: ['14', '10', '-14', '6'],
    correctIndex: 0,
    hint: 'Use $|P| = ad - bc$.',
    solutionSteps: ['$|P| = (4)(3) - (2)(-1) = 12 - (-2) = 14$.'],
  },
  {
    id: 'diag-14',
    topicId: 'determinant-inverse',
    difficulty: 'Medium',
    conceptTag: 'Singular vs Non-Singular Matrices',
    prompt: 'For what value of $k$ is $M = \\begin{bmatrix} 6 & 3 \\\\ k & 2 \\end{bmatrix}$ a singular matrix?',
    options: ['3', '-4', '4', '12'],
    correctIndex: 2,
    hint: 'A matrix is singular when $|M| = 0$.',
    solutionSteps: ['$|M| = 6(2) - 3k = 0 \\implies 12 - 3k = 0 \\implies k = 4$.'],
  },
  {
    id: 'diag-15',
    topicId: 'determinant-inverse',
    difficulty: 'Hard',
    conceptTag: 'Adjoint & Multiplicative Inverse',
    prompt: 'Find $\\operatorname{Adj}(A)$ for $A = \\begin{bmatrix} 2 & -5 \\\\ 3 & 7 \\end{bmatrix}$.',
    options: [
      '$\\begin{bmatrix} 7 & -5 \\\\ 3 & 2 \\end{bmatrix}$',
      '$\\begin{bmatrix} 7 & 5 \\\\ -3 & 2 \\end{bmatrix}$',
      '$\\begin{bmatrix} 2 & 5 \\\\ -3 & 7 \\end{bmatrix}$',
      '$\\begin{bmatrix} -7 & 5 \\\\ -3 & -2 \\end{bmatrix}$',
    ],
    correctIndex: 1,
    hint: 'Swap diagonal entries ($a, d$) and change signs of off-diagonal entries ($b, c$).',
    solutionSteps: ['Swap 2 and 7; negate $-5$ to $5$ and $3$ to $-3$: $\\begin{bmatrix} 7 & 5 \\\\ -3 & 2 \\end{bmatrix}$.'],
  },

  // Module 6: Exercise 1.6
  {
    id: 'diag-16',
    topicId: 'linear-systems',
    difficulty: 'Easy',
    conceptTag: 'Matrix Form (AX = B)',
    prompt: 'For $x + 2y = 5$ and $3x - y = 1$, what is the coefficient matrix $A$?',
    options: [
      '$\\begin{bmatrix} 1 & 2 \\\\ 3 & -1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 5 & 2 \\\\ 1 & -1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & 3 \\\\ 2 & -1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & 2 \\\\ 3 & 1 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    hint: 'Place the coefficients of $x$ in column 1 and $y$ in column 2.',
    solutionSteps: ['Row 1 has coefficients $(1, 2)$; Row 2 has coefficients $(3, -1)$.'],
  },
  {
    id: 'diag-17',
    topicId: 'linear-systems',
    difficulty: 'Medium',
    conceptTag: 'Cramer’s Rule Determinants',
    prompt: 'For the system $2x + y = 3$ and $6x + 5y = 1$, what is $|A_x|$ in Cramer’s Rule?',
    options: ['4', '-16', '16', '14'],
    correctIndex: 3,
    hint: 'Form $A_x$ by replacing the 1st column of $A$ with $\\begin{bmatrix} 3 \\\\ 1 \\end{bmatrix}$, then compute its determinant.',
    solutionSteps: ['$A_x = \\begin{bmatrix} 3 & 1 \\\\ 1 & 5 \\end{bmatrix}$, so $|A_x| = (3)(5) - (1)(1) = 15 - 1 = 14$.'],
  },
  {
    id: 'diag-18',
    topicId: 'linear-systems',
    difficulty: 'Hard',
    conceptTag: 'Solving Simultaneous Equations',
    prompt: 'Solve the simultaneous equations $2x + y = 5$ and $x - y = 1$.',
    options: ['$(1, 3)$', '$(3, -1)$', '$(2, 1)$', '$(2, -1)$'],
    correctIndex: 2,
    hint: 'Compute $|A| = -3$, $|A_x| = -6$, and $|A_y| = -3$.',
    solutionSteps: [
      '$|A| = (2)(-1) - (1)(1) = -3$.',
      '$|A_x| = (5)(-1) - (1)(1) = -6 \\implies x = \\frac{-6}{-3} = 2$.',
      '$|A_y| = (2)(1) - (5)(1) = -3 \\implies y = \\frac{-3}{-3} = 1$.',
    ],
  },
];

export const WORKED_EXAMPLES: WorkedExample[] = [
  {
    id: 'ex-1-1',
    topicId: 'order-equality',
    exerciseRef: 'Exercise 1.1 (Q3)',
    title: 'Solving Matrix Equations for Unknown Variables',
    difficulty: 'Standard',
    problemStatement:
      'Find the values of $a, b, c$ and $d$ which satisfy the matrix equation: $$\\begin{bmatrix} a+c & a+2b \\\\ c-1 & 4d-6 \\end{bmatrix} = \\begin{bmatrix} 0 & -7 \\\\ 3 & 2d \\end{bmatrix}$$',
    steps: [
      {
        label: 'Step 1: Equate corresponding entries',
        explanation: 'Since the two $2 \\times 2$ matrices are equal, each entry equals its matching entry:',
        mathLatex: 'a + c = 0 \\quad (i), \\quad a + 2b = -7 \\quad (ii), \\quad c - 1 = 3 \\quad (iii), \\quad 4d - 6 = 2d \\quad (iv)',
      },
      {
        label: 'Step 2: Solve equations (iii) and (iv) first',
        explanation: 'Equation (iii) has only $c$, and equation (iv) has only $d$.',
        mathLatex: 'c = 3 + 1 = 4 \\qquad \\text{and} \\qquad 4d - 2d = 6 \\implies 2d = 6 \\implies d = 3',
      },
      {
        label: 'Step 3: Substitute $c = 4$ into (i) to find $a$',
        explanation: 'Use $a + c = 0$:',
        mathLatex: 'a + 4 = 0 \\implies a = -4',
      },
      {
        label: 'Step 4: Substitute $a = -4$ into (ii) to find $b$',
        explanation: 'Use $a + 2b = -7$:',
        mathLatex: '-4 + 2b = -7 \\implies 2b = -3 \\implies b = -\\frac{3}{2}',
      },
    ],
    finalAnswerLatex: 'a = -4, \\quad b = -\\frac{3}{2}, \\quad c = 4, \\quad d = 3',
    examinerTip: 'Always look for single-variable equations first ($c-1=3$ and $4d-6=2d$) to unlock the rest cleanly.',
  },
  {
    id: 'ex-1-2',
    topicId: 'types-transpose',
    exerciseRef: 'Exercise 1.2 (Q6)',
    title: 'Verifying the Double Transpose Property',
    difficulty: 'Foundational',
    problemStatement:
      'If $A = \\begin{bmatrix} 1 & 2 \\\\ 0 & 1 \\end{bmatrix}$, verify that $(A^t)^t = A$.',
    steps: [
      {
        label: 'Step 1: Find the first transpose $A^t$',
        explanation: 'Interchange the rows of $A$ into columns:',
        mathLatex: 'A^t = \\begin{bmatrix} 1 & 0 \\\\ 2 & 1 \\end{bmatrix}',
      },
      {
        label: 'Step 2: Take the transpose of $A^t$',
        explanation: 'Interchange the rows of $A^t$ back into columns:',
        mathLatex: '(A^t)^t = \\begin{bmatrix} 1 & 2 \\\\ 0 & 1 \\end{bmatrix} = A',
      },
    ],
    finalAnswerLatex: '(A^t)^t = A \\quad (\\text{Verified})',
    examinerTip: 'Show both intermediate matrices explicitly in board exams so full 2 marks are awarded.',
  },
  {
    id: 'ex-1-3',
    topicId: 'add-sub',
    exerciseRef: 'Exercise 1.3 (Q7)',
    title: 'Finding Unknowns in a Linear Matrix Equation',
    difficulty: 'Standard',
    problemStatement:
      'If $2\\begin{bmatrix} 2 & 4 \\\\ -3 & a \\end{bmatrix} + 3\\begin{bmatrix} 1 & b \\\\ 8 & -4 \\end{bmatrix} = \\begin{bmatrix} 7 & 10 \\\\ 18 & 1 \\end{bmatrix}$, find $a$ and $b$.',
    steps: [
      {
        label: 'Step 1: Perform scalar multiplication',
        explanation: 'Multiply every entry of the first matrix by $2$ and the second by $3$:',
        mathLatex: '\\begin{bmatrix} 4 & 8 \\\\ -6 & 2a \\end{bmatrix} + \\begin{bmatrix} 3 & 3b \\\\ 24 & -12 \\end{bmatrix} = \\begin{bmatrix} 7 & 10 \\\\ 18 & 1 \\end{bmatrix}',
      },
      {
        label: 'Step 2: Add the two matrices on the left side',
        explanation: 'Combine corresponding entries:',
        mathLatex: '\\begin{bmatrix} 7 & 8 + 3b \\\\ 18 & 2a - 12 \\end{bmatrix} = \\begin{bmatrix} 7 & 10 \\\\ 18 & 1 \\end{bmatrix}',
      },
      {
        label: 'Step 3: Equate corresponding entries containing $a$ and $b$',
        explanation: 'Solve for $b$ and $a$:',
        mathLatex: '8 + 3b = 10 \\implies 3b = 2 \\implies b = \\frac{2}{3}; \\qquad 2a - 12 = 1 \\implies 2a = 13 \\implies a = \\frac{13}{2}',
      },
    ],
    finalAnswerLatex: 'a = \\frac{13}{2}, \\quad b = \\frac{2}{3}',
    examinerTip: 'Verify the constant entries ($4+3=7$ and $-6+24=18$) match the RHS to catch arithmetic slips early.',
  },
  {
    id: 'ex-1-4',
    topicId: 'multiplication',
    exerciseRef: 'Exercise 1.4 (Q6)',
    title: 'Verifying the Reversal Law $(AB)^t = B^t A^t$',
    difficulty: 'Board Level',
    problemStatement:
      'For $A = \\begin{bmatrix} -1 & 3 \\\\ 2 & 0 \\end{bmatrix}$ and $B = \\begin{bmatrix} 1 & 2 \\\\ -3 & -5 \\end{bmatrix}$, verify that $(AB)^t = B^t A^t$.',
    steps: [
      {
        label: 'Step 1: Compute $AB$ (LHS inner product)',
        explanation: 'Multiply rows of $A$ by columns of $B$:',
        mathLatex:
          'AB = \\begin{bmatrix} (-1)(1)+(3)(-3) & (-1)(2)+(3)(-5) \\\\ (2)(1)+(0)(-3) & (2)(2)+(0)(-5) \\end{bmatrix} = \\begin{bmatrix} -10 & -17 \\\\ 2 & 4 \\end{bmatrix}',
      },
      {
        label: 'Step 2: Take the transpose $(AB)^t$ (LHS)',
        explanation: 'Swap rows and columns of $AB$:',
        mathLatex: '\\text{LHS} = (AB)^t = \\begin{bmatrix} -10 & 2 \\\\ -17 & 4 \\end{bmatrix}',
      },
      {
        label: 'Step 3: Find $B^t$ and $A^t$',
        explanation: 'Transpose each matrix individually before multiplying:',
        mathLatex: 'B^t = \\begin{bmatrix} 1 & -3 \\\\ 2 & -5 \\end{bmatrix}, \\qquad A^t = \\begin{bmatrix} -1 & 2 \\\\ 3 & 0 \\end{bmatrix}',
      },
      {
        label: 'Step 4: Multiply $B^t A^t$ (RHS)',
        explanation: 'Ensure $B^t$ is on the left and $A^t$ is on the right:',
        mathLatex:
          '\\text{RHS} = B^t A^t = \\begin{bmatrix} (1)(-1)+(-3)(3) & (1)(2)+(-3)(0) \\\\ (2)(-1)+(-5)(3) & (2)(2)+(-5)(0) \\end{bmatrix} = \\begin{bmatrix} -10 & 2 \\\\ -17 & 4 \\end{bmatrix}',
      },
    ],
    finalAnswerLatex: '\\text{LHS} = \\text{RHS} \\implies (AB)^t = B^t A^t',
    examinerTip: 'This is a classic 4-mark board long question. Clearly label LHS and RHS.',
  },
  {
    id: 'ex-1-5',
    topicId: 'determinant-inverse',
    exerciseRef: 'Exercise 1.5 (Q3 & Q6)',
    title: 'Computing Multiplicative Inverse of a 2×2 Matrix',
    difficulty: 'Standard',
    problemStatement:
      'Find the multiplicative inverse of $C = \\begin{bmatrix} -2 & 6 \\\\ 3 & -9 \\end{bmatrix}$ and $D = \\begin{bmatrix} \\frac{1}{2} & \\frac{3}{4} \\\\ 1 & 2 \\end{bmatrix}$ if it exists.',
    steps: [
      {
        label: 'Step 1: Check $|C|$ first',
        explanation: 'Compute the determinant of $C$:',
        mathLatex: '|C| = (-2)(-9) - (6)(3) = 18 - 18 = 0',
      },
      {
        label: 'Step 2: Conclude for $C$',
        explanation: 'Since $|C| = 0$, $C$ is singular so $C^{-1}$ does not exist.',
        mathLatex: 'C^{-1} \\text{ does not exist.}',
      },
      {
        label: 'Step 3: Compute $|D|$ and $\\text{Adj } D$',
        explanation: 'For $D$, $|D| = \\left(\\frac{1}{2}\\right)(2) - \\left(\\frac{3}{4}\\right)(1)$:',
        mathLatex:
          '|D| = 1 - \\frac{3}{4} = \\frac{1}{4} \\neq 0, \\qquad \\text{Adj } D = \\begin{bmatrix} 2 & -\\frac{3}{4} \\\\ -1 & \\frac{1}{2} \\end{bmatrix}',
      },
      {
        label: 'Step 4: Compute $D^{-1} = \\frac{1}{|D|}\\text{Adj } D$',
        explanation: 'Dividing by $\\frac{1}{4}$ is the same as multiplying by $4$:',
        mathLatex:
          'D^{-1} = 4 \\begin{bmatrix} 2 & -\\frac{3}{4} \\\\ -1 & \\frac{1}{2} \\end{bmatrix} = \\begin{bmatrix} 8 & -3 \\\\ -4 & 2 \\end{bmatrix}',
      },
    ],
    finalAnswerLatex: 'C^{-1} \\text{ does not exist}; \\quad D^{-1} = \\begin{bmatrix} 8 & -3 \\\\ -4 & 2 \\end{bmatrix}',
    examinerTip: 'Always calculate the determinant FIRST—never waste time finding the adjoint of a singular matrix!',
  },
  {
    id: 'ex-1-6',
    topicId: 'linear-systems',
    exerciseRef: 'Exercise 1.6 (Q1)',
    title: 'Solving Linear Equations by Matrix Inversion & Cramer’s Rule',
    difficulty: 'Board Level',
    problemStatement:
      'Solve the simultaneous linear equations: $2x - 2y = 4$ and $3x + 2y = 6$ using both methods.',
    steps: [
      {
        label: 'Step 1: Write in Matrix Form $AX = B$',
        explanation: 'Extract the coefficient matrix $A$, variable vector $X$, and constant vector $B$:',
        mathLatex: 'A = \\begin{bmatrix} 2 & -2 \\\\ 3 & 2 \\end{bmatrix}, \\quad X = \\begin{bmatrix} x \\\\ y \\end{bmatrix}, \\quad B = \\begin{bmatrix} 4 \\\\ 6 \\end{bmatrix}',
      },
      {
        label: 'Step 2: Find $|A|$',
        explanation: 'Check non-singularity:',
        mathLatex: '|A| = (2)(2) - (-2)(3) = 4 + 6 = 10 \\neq 0',
      },
      {
        label: 'Step 3: Matrix Inversion Method ($X = A^{-1}B$)',
        explanation: 'Find $\\text{Adj } A$ and multiply $\\frac{1}{10}(\\text{Adj } A) B$:',
        mathLatex:
          '\\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\frac{1}{10} \\begin{bmatrix} 2 & 2 \\\\ -3 & 2 \\end{bmatrix} \\begin{bmatrix} 4 \\\\ 6 \\end{bmatrix} = \\frac{1}{10} \\begin{bmatrix} 8 + 12 \\\\ -12 + 12 \\end{bmatrix} = \\frac{1}{10} \\begin{bmatrix} 20 \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} 2 \\\\ 0 \\end{bmatrix}',
      },
      {
        label: 'Step 4: Cramer’s Rule Verification',
        explanation: 'Compute $|A_x|$ and $|A_y|$:',
        mathLatex:
          '|A_x| = \\begin{vmatrix} 4 & -2 \\\\ 6 & 2 \\end{vmatrix} = 8 + 12 = 20, \\quad |A_y| = \\begin{vmatrix} 2 & 4 \\\\ 3 & 6 \\end{vmatrix} = 12 - 12 = 0',
      },
    ],
    finalAnswerLatex: 'x = \\frac{20}{10} = 2, \\quad y = \\frac{0}{10} = 0 \\implies \\text{Solution Set} = \\{(2, 0)\\}',
    examinerTip: 'In board exams, Question 5(a) from Exercise 1.6 is a guaranteed 4-mark Long Question. Write the Solution Set clearly!',
  },
];

export const PRACTICE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'pq-1',
    topicId: 'order-equality',
    difficulty: 'Easy',
    prompt: 'What is the order of a row matrix with 5 elements?',
    options: ['1-by-5', '5-by-1', '5-by-5', '1-by-1'],
    correctIndex: 0,
    hint: 'A row matrix has 1 row and as many columns as elements.',
    solutionSteps: ['1 row and 5 columns gives order $1 \\times 5$ (1-by-5).'],
  },
  {
    id: 'pq-2',
    topicId: 'order-equality',
    difficulty: 'Medium',
    prompt: 'If $\\begin{bmatrix} 2x - 1 & 5 \\\\ 0 & y + 3 \\end{bmatrix} = \\begin{bmatrix} 7 & 5 \\\\ 0 & -2 \\end{bmatrix}$, find $x$ and $y$.',
    options: ['$x = 4, y = -5$', '$x = 3, y = 1$', '$x = 4, y = 1$', '$x = -4, y = -5$'],
    correctIndex: 0,
    hint: 'Set $2x - 1 = 7$ and $y + 3 = -2$.',
    solutionSteps: ['$2x = 8 \\implies x = 4$.', '$y = -2 - 3 = -5$.'],
  },
  {
    id: 'pq-3',
    topicId: 'types-transpose',
    difficulty: 'Easy',
    prompt: 'Which matrix is a Skew-Symmetric matrix?',
    options: [
      '$\\begin{bmatrix} 0 & -5 \\\\ 5 & 0 \\end{bmatrix}$',
      '$\\begin{bmatrix} 2 & 5 \\\\ 5 & 2 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 0 & 5 \\\\ 5 & 0 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    hint: 'For skew-symmetric, $A^t = -A$ and diagonal entries are $0$.',
    solutionSteps: ['For $A = \\begin{bmatrix} 0 & -5 \\\\ 5 & 0 \\end{bmatrix}$, $A^t = \\begin{bmatrix} 0 & 5 \\\\ -5 & 0 \\end{bmatrix} = -A$.'],
  },
  {
    id: 'pq-4',
    topicId: 'types-transpose',
    difficulty: 'Medium',
    prompt: 'If $A$ is a matrix of order $3 \\times 2$, what is the order of $A^t$?',
    options: ['2-by-3', '3-by-2', '3-by-3', '2-by-2'],
    correctIndex: 0,
    hint: 'Taking the transpose swaps rows and columns.',
    solutionSteps: ['Order $m \\times n$ becomes $n \\times m$, so $3 \\times 2$ becomes $2 \\times 3$.'],
  },
  {
    id: 'pq-5',
    topicId: 'add-sub',
    difficulty: 'Easy',
    prompt: 'If $A = \\begin{bmatrix} 4 & -1 \\\\ 2 & 3 \\end{bmatrix}$ and $B = \\begin{bmatrix} 1 & 2 \\\\ -3 & 5 \\end{bmatrix}$, find $A - B$.',
    options: [
      '$\\begin{bmatrix} 3 & -3 \\\\ 5 & -2 \\end{bmatrix}$',
      '$\\begin{bmatrix} 5 & 1 \\\\ -1 & 8 \\end{bmatrix}$',
      '$\\begin{bmatrix} 3 & 1 \\\\ -1 & -2 \\end{bmatrix}$',
      '$\\begin{bmatrix} -3 & 3 \\\\ -5 & 2 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    hint: 'Subtract each entry of $B$ from $A$: $2 - (-3) = 5$.',
    solutionSteps: ['$4-1=3$, $-1-2=-3$, $2-(-3)=5$, $3-5=-2$.'],
  },
  {
    id: 'pq-6',
    topicId: 'add-sub',
    difficulty: 'Hard',
    prompt: 'If $X + \\begin{bmatrix} 2 & -1 \\\\ 3 & 4 \\end{bmatrix} = \\begin{bmatrix} 5 & 2 \\\\ 1 & 0 \\end{bmatrix}$, find matrix $X$.',
    options: [
      '$\\begin{bmatrix} 3 & 3 \\\\ -2 & -4 \\end{bmatrix}$',
      '$\\begin{bmatrix} 7 & 1 \\\\ 4 & 4 \\end{bmatrix}$',
      '$\\begin{bmatrix} -3 & -3 \\\\ 2 & 4 \\end{bmatrix}$',
      '$\\begin{bmatrix} 3 & 1 \\\\ -2 & 4 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    hint: 'Subtract $\\begin{bmatrix} 2 & -1 \\\\ 3 & 4 \\end{bmatrix}$ from the right-hand side.',
    solutionSteps: ['$X = \\begin{bmatrix} 5-2 & 2-(-1) \\\\ 1-3 & 0-4 \\end{bmatrix} = \\begin{bmatrix} 3 & 3 \\\\ -2 & -4 \\end{bmatrix}$.'],
  },
  {
    id: 'pq-7',
    topicId: 'multiplication',
    difficulty: 'Medium',
    prompt: 'Calculate $\\begin{bmatrix} 1 & 2 \\\\ 3 & 0 \\end{bmatrix} \\begin{bmatrix} 2 & -1 \\\\ 1 & 4 \\end{bmatrix}$.',
    options: [
      '$\\begin{bmatrix} 4 & 7 \\\\ 6 & -3 \\end{bmatrix}$',
      '$\\begin{bmatrix} 2 & -2 \\\\ 3 & 0 \\end{bmatrix}$',
      '$\\begin{bmatrix} 4 & 5 \\\\ 6 & 3 \\end{bmatrix}$',
      '$\\begin{bmatrix} 3 & 1 \\\\ 4 & 4 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    hint: 'Row 1 $\\times$ Col 1 = $(1)(2)+(2)(1) = 4$.',
    solutionSteps: [
      'Entry $(1,1): 1(2)+2(1)=4$',
      'Entry $(1,2): 1(-1)+2(4)=7$',
      'Entry $(2,1): 3(2)+0(1)=6$',
      'Entry $(2,2): 3(-1)+0(4)=-3$',
    ],
  },
  {
    id: 'pq-8',
    topicId: 'multiplication',
    difficulty: 'Hard',
    prompt: 'If $\\begin{bmatrix} x & 2 \\end{bmatrix} \\begin{bmatrix} 3 \\\\ -4 \\end{bmatrix} = [1]$, what is $x$?',
    options: ['$3$', '$-3$', '$\\frac{1}{3}$', '$9$'],
    correctIndex: 0,
    hint: 'Expand $3x + 2(-4) = 1$.',
    solutionSteps: ['$3x - 8 = 1 \\implies 3x = 9 \\implies x = 3$.'],
  },
  {
    id: 'pq-9',
    topicId: 'determinant-inverse',
    difficulty: 'Medium',
    prompt: 'What is the adjoint of $A = \\begin{bmatrix} -1 & 3 \\\\ 2 & 5 \\end{bmatrix}$?',
    options: [
      '$\\begin{bmatrix} 5 & -3 \\\\ -2 & -1 \\end{bmatrix}$',
      '$\\begin{bmatrix} -1 & -3 \\\\ -2 & 5 \\end{bmatrix}$',
      '$\\begin{bmatrix} 5 & 3 \\\\ 2 & -1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & -3 \\\\ -2 & -5 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    hint: 'Swap $-1$ and $5$; negate $3$ and $2$.',
    solutionSteps: ['$\\text{Adj } A = \\begin{bmatrix} 5 & -3 \\\\ -2 & -1 \\end{bmatrix}$.'],
  },
  {
    id: 'pq-10',
    topicId: 'determinant-inverse',
    difficulty: 'Hard',
    prompt: 'Find $A^{-1}$ for $A = \\begin{bmatrix} 3 & 1 \\\\ 5 & 2 \\end{bmatrix}$.',
    options: [
      '$\\begin{bmatrix} 2 & -1 \\\\ -5 & 3 \\end{bmatrix}$',
      '$\\begin{bmatrix} 2 & 1 \\\\ 5 & 3 \\end{bmatrix}$',
      '$\\begin{bmatrix} -2 & 1 \\\\ 5 & -3 \\end{bmatrix}$',
      '$\\begin{bmatrix} 3 & -1 \\\\ -5 & 2 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    hint: 'First find $|A| = 3(2) - 1(5) = 1$.',
    solutionSteps: ['$|A| = 6 - 5 = 1$.', '$A^{-1} = \\frac{1}{1} \\begin{bmatrix} 2 & -1 \\\\ -5 & 3 \\end{bmatrix} = \\begin{bmatrix} 2 & -1 \\\\ -5 & 3 \\end{bmatrix}$.'],
  },
  {
    id: 'pq-11',
    topicId: 'linear-systems',
    difficulty: 'Medium',
    prompt: 'In Cramer’s Rule, if $|A| = 5$, $|A_x| = -15$, and $|A_y| = 10$, what is $(x, y)$?',
    options: ['$(-3, 2)$', '$(3, -2)$', '$(-15, 10)$', '$(2, -3)$'],
    correctIndex: 0,
    hint: 'Use $x = |A_x| / |A|$ and $y = |A_y| / |A|$.',
    solutionSteps: ['$x = -15/5 = -3$, $y = 10/5 = 2$.'],
  },
  {
    id: 'pq-12',
    topicId: 'linear-systems',
    difficulty: 'Hard',
    prompt: 'Two angles are supplementary and the larger exceeds the smaller by $30^\\circ$. Which matrix system represents this?',
    options: [
      '$\\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 180 \\\\ 30 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 90 \\\\ 30 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & -1 \\\\ 1 & 1 \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 180 \\\\ 90 \\end{bmatrix}$',
      '$\\begin{bmatrix} 2 & 1 \\\\ 1 & 1 \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 180 \\\\ 30 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    hint: 'Supplementary angles sum to $180^\\circ$.',
    solutionSteps: ['$x + y = 180$ and $x - y = 30$.'],
  },
];

export const REVISION_CARDS: RevisionCard[] = [
  {
    id: 'rev-1',
    topicId: 'order-equality',
    frontTitle: 'Order of a Matrix',
    frontPrompt: 'How do you state the order of a matrix with $m$ horizontal lines and $n$ vertical lines?',
    backAnswer: 'Order is written as $m\\text{-by-}n$ (rows first, columns second).',
    backLatex: '\\text{Order} = m \\times n',
  },
  {
    id: 'rev-2',
    topicId: 'types-transpose',
    frontTitle: 'Symmetric vs Skew-Symmetric',
    frontPrompt: 'What condition defines a Symmetric matrix versus a Skew-Symmetric matrix?',
    backAnswer: 'A square matrix $A$ is symmetric if $A^t = A$, and skew-symmetric if $A^t = -A$.',
    backLatex: 'A^t = A \\; (\\text{Symmetric}), \\quad A^t = -A \\; (\\text{Skew-Symmetric})',
  },
  {
    id: 'rev-3',
    topicId: 'types-transpose',
    frontTitle: 'Scalar vs Identity Matrix',
    frontPrompt: 'What is the difference between a Scalar matrix and an Identity matrix?',
    backAnswer: 'Both are diagonal with equal diagonal entries $k \\neq 0$. An Identity matrix is the special case where $k = 1$.',
    backLatex: 'S = \\begin{bmatrix} k & 0 \\\\ 0 & k \\end{bmatrix}, \\quad I = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}',
  },
  {
    id: 'rev-4',
    topicId: 'add-sub',
    frontTitle: 'Additive Identity & Inverse',
    frontPrompt: 'What are the additive identity and additive inverse of a matrix $A$?',
    backAnswer: 'The zero matrix $O$ (same order as $A$) is the additive identity; $-A$ is the additive inverse.',
    backLatex: 'A + O = A, \\quad A + (-A) = O',
  },
  {
    id: 'rev-5',
    topicId: 'multiplication',
    frontTitle: 'Conformability for $AB$',
    frontPrompt: 'When can you multiply two matrices $A$ and $B$ to get $AB$?',
    backAnswer: 'Only when the number of columns in $A$ equals the number of rows in $B$.',
    backLatex: 'A_{m \\times n} \\cdot B_{n \\times p} \\implies (AB)_{m \\times p}',
  },
  {
    id: 'rev-6',
    topicId: 'multiplication',
    frontTitle: 'Transpose of a Product',
    frontPrompt: 'Complete the identity: $(AB)^t = ?$',
    backAnswer: 'The transpose of a product equals the product of transposes in reverse order.',
    backLatex: '(AB)^t = B^t A^t',
  },
  {
    id: 'rev-7',
    topicId: 'determinant-inverse',
    frontTitle: 'Singular Matrix Test',
    frontPrompt: 'When is a square matrix $A$ called singular, and does $A^{-1}$ exist?',
    backAnswer: 'If $|A| = 0$, $A$ is singular and its multiplicative inverse does not exist.',
    backLatex: '|A| = ad - bc = 0 \\implies \\text{Singular (No inverse)}',
  },
  {
    id: 'rev-8',
    topicId: 'determinant-inverse',
    frontTitle: '2×2 Inverse Formula',
    frontPrompt: 'State the formula for $A^{-1}$ when $A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$ and $|A| \\neq 0$.',
    backAnswer: 'Divide the adjoint matrix by the determinant $|A|$.',
    backLatex: 'A^{-1} = \\frac{1}{ad - bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}',
  },
  {
    id: 'rev-9',
    topicId: 'linear-systems',
    frontTitle: 'Cramer’s Rule',
    frontPrompt: 'How are $x$ and $y$ computed using Cramer’s Rule?',
    backAnswer: 'Replace column 1 of $A$ with $B$ for $A_x$, and column 2 with $B$ for $A_y$.',
    backLatex: 'x = \\frac{|A_x|}{|A|}, \\quad y = \\frac{|A_y|}{|A|}',
  },
];

export const BOARD_QUESTIONS: BoardQuestion[] = [
  {
    id: 'bq-mcq-1',
    part: 'MCQ',
    marks: 1,
    yearTag: 'BISE Lahore / Rawalpindi Review Ex 1',
    topicId: 'types-transpose',
    question: 'The matrix $\\begin{bmatrix} \\sqrt{2} & 0 \\\\ 0 & \\sqrt{2} \\end{bmatrix}$ is called a:',
    options: ['Zero matrix', 'Unit matrix', 'Scalar matrix', 'Singular matrix'],
    correctIndex: 2,
    markingScheme: ['1 mark for identifying equal non-zero diagonal elements ($\\sqrt{2} \\neq 1$) as a Scalar matrix.'],
    modelAnswerLatex: '\\text{Scalar Matrix } (k = \\sqrt{2} \\neq 0, 1)',
  },
  {
    id: 'bq-mcq-2',
    part: 'MCQ',
    marks: 1,
    yearTag: 'BISE Gujranwala / Multan Pattern',
    topicId: 'determinant-inverse',
    question: 'If $\\begin{vmatrix} 2 & 6 \\\\ 3 & x \\end{vmatrix} = 0$, then $x$ is equal to:',
    options: ['9', '-6', '6', '-9'],
    correctIndex: 0,
    markingScheme: ['1 mark for solving $2x - 18 = 0 \\implies x = 9$.'],
    modelAnswerLatex: '2x - 18 = 0 \\implies x = 9',
  },
  {
    id: 'bq-mcq-3',
    part: 'MCQ',
    marks: 1,
    yearTag: 'BISE Faisalabad Review Ex 1',
    topicId: 'multiplication',
    question: 'Product of $\\begin{bmatrix} x & y \\end{bmatrix} \\begin{bmatrix} 2 \\\\ -1 \\end{bmatrix}$ is:',
    options: ['$[2x + y]$', '$[x - 2y]$', '$[2x - y]$', '$[x + 2y]$'],
    correctIndex: 2,
    markingScheme: ['1 mark for row-by-column product $(x)(2) + (y)(-1) = [2x - y]$.'],
    modelAnswerLatex: '\\begin{bmatrix} 2x - y \\end{bmatrix}',
  },
  {
    id: 'bq-short-1',
    part: 'Short Question',
    marks: 2,
    yearTag: 'BISE Lahore Group I',
    topicId: 'types-transpose',
    question:
      'If $A = \\begin{bmatrix} 1 & 2 \\\\ 0 & 1 \\end{bmatrix}$, verify that $A + A^t$ is symmetric.',
    markingScheme: [
      '1 mark: Find $A^t$ and compute $B = A + A^t$.',
      '1 mark: Compute $B^t$ and show $B^t = B$.',
    ],
    modelAnswerLatex:
      'A^t = \\begin{bmatrix} 1 & 0 \\\\ 2 & 1 \\end{bmatrix} \\implies A + A^t = \\begin{bmatrix} 2 & 2 \\\\ 2 & 2 \\end{bmatrix}. \\quad (A + A^t)^t = \\begin{bmatrix} 2 & 2 \\\\ 2 & 2 \\end{bmatrix} = A + A^t',
  },
  {
    id: 'bq-short-2',
    part: 'Short Question',
    marks: 2,
    yearTag: 'BISE Rawalpindi Group II',
    topicId: 'determinant-inverse',
    question:
      'Find whether the matrix $M = \\begin{bmatrix} 3 & 6 \\\\ 2 & 4 \\end{bmatrix}$ is singular or non-singular.',
    markingScheme: [
      '1 mark: Set up determinant formula $|M| = (3)(4) - (6)(2)$.',
      '1 mark: Evaluate $|M| = 0$ and state conclusion "Singular matrix".',
    ],
    modelAnswerLatex: '|M| = (3)(4) - (6)(2) = 12 - 12 = 0 \\implies M \\text{ is a Singular Matrix.}',
  },
  {
    id: 'bq-short-3',
    part: 'Short Question',
    marks: 2,
    yearTag: 'BISE Sargodha',
    topicId: 'add-sub',
    question:
      'If $A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}$ and $B = \\begin{bmatrix} -1 & 0 \\\\ 2 & 1 \\end{bmatrix}$, find $2A - 3B$.',
    markingScheme: [
      '1 mark: Compute $2A$ and $3B$ accurately.',
      '1 mark: Subtract corresponding entries correctly.',
    ],
    modelAnswerLatex:
      '2A - 3B = \\begin{bmatrix} 2 & 4 \\\\ 6 & 8 \\end{bmatrix} - \\begin{bmatrix} -3 & 0 \\\\ 6 & 3 \\end{bmatrix} = \\begin{bmatrix} 5 & 4 \\\\ 0 & 5 \\end{bmatrix}',
  },
  {
    id: 'bq-long-1',
    part: 'Long Question',
    marks: 4,
    yearTag: 'BISE Compulsory Q5(a) Pattern',
    topicId: 'linear-systems',
    question:
      'Solve the system of linear equations using Cramer’s Rule: $3x - 2y = -6$ and $5x - 2y = -10$.',
    markingScheme: [
      '1 mark: Write matrix form $AX = B$ and find $|A| = 4 \\neq 0$.',
      '1 mark: Form $A_x$ correctly and find $|A_x| = -8$.',
      '1 mark: Form $A_y$ correctly and find $|A_y| = 0$.',
      '1 mark: Compute $x = -2, y = 0$ and state Solution Set $= \\{(-2, 0)\\}$.',
    ],
    modelAnswerLatex:
      '|A| = \\begin{vmatrix} 3 & -2 \\\\ 5 & -2 \\end{vmatrix} = -6 + 10 = 4, \\quad |A_x| = \\begin{vmatrix} -6 & -2 \\\\ -10 & -2 \\end{vmatrix} = 12 - 20 = -8, \\quad |A_y| = \\begin{vmatrix} 3 & -6 \\\\ 5 & -10 \\end{vmatrix} = -30 + 30 = 0 \\\\ x = \\frac{-8}{4} = -2, \\; y = \\frac{0}{4} = 0',
  },
  {
    id: 'bq-long-2',
    part: 'Long Question',
    marks: 4,
    yearTag: 'BISE Compulsory Q5(a) Word Problem',
    topicId: 'linear-systems',
    question:
      'The length of a rectangle is $4$ times its width. The perimeter of the rectangle is $150\\text{ cm}$. Find the dimensions of the rectangle using the Matrix Inversion Method.',
    markingScheme: [
      '1 mark: Define width $= x$, length $= y$ and form $y = 4x \\implies 4x - y = 0$ and $2(x+y)=150 \\implies x + y = 75$.',
      '1 mark: Compute $|A| = 5 \\neq 0$ and $\\text{Adj } A$.',
      '1 mark: Compute $X = A^{-1}B = \\frac{1}{5} \\begin{bmatrix} 1 & 1 \\\\ -1 & 4 \\end{bmatrix} \\begin{bmatrix} 0 \\\\ 75 \\end{bmatrix}$.',
      '1 mark: State width $= 15\\text{ cm}$ and length $= 60\\text{ cm}$.',
    ],
    modelAnswerLatex:
      '\\begin{bmatrix} 4 & -1 \\\\ 1 & 1 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 75 \\end{bmatrix} \\implies \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\frac{1}{5} \\begin{bmatrix} 75 \\\\ 300 \\end{bmatrix} = \\begin{bmatrix} 15 \\\\ 60 \\end{bmatrix}',
  },
];

export const FINAL_ASSESSMENT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'final-1',
    topicId: 'order-equality',
    difficulty: 'Easy',
    prompt: 'If a matrix has $4$ rows and $3$ columns, how many elements does it contain and what is its order?',
    options: ['12 elements, order 4-by-3', '12 elements, order 3-by-4', '7 elements, order 4-by-3', '7 elements, order 3-by-4'],
    correctIndex: 0,
    hint: 'Order is rows-by-columns; total elements = rows × columns.',
    solutionSteps: ['Rows = 4, Columns = 3 $\\implies$ Order 4-by-3, Total = $4 \\times 3 = 12$.'],
  },
  {
    id: 'final-2',
    topicId: 'order-equality',
    difficulty: 'Medium',
    prompt: 'Find $x$ and $y$ if $\\begin{bmatrix} x+3 & 1 \\\\ -3 & 3y-4 \\end{bmatrix} = \\begin{bmatrix} 2 & 1 \\\\ -3 & 2 \\end{bmatrix}$.',
    options: ['$x = -1, y = 2$', '$x = 5, y = 2$', '$x = -1, y = -2$', '$x = 1, y = 6$'],
    correctIndex: 0,
    hint: 'Solve $x + 3 = 2$ and $3y - 4 = 2$.',
    solutionSteps: ['$x = 2 - 3 = -1$.', '$3y = 6 \\implies y = 2$.'],
  },
  {
    id: 'final-3',
    topicId: 'types-transpose',
    difficulty: 'Easy',
    prompt: 'Which of the following is an Identity matrix of order $2 \\times 2$?',
    options: [
      '$\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & 1 \\\\ 1 & 1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 2 & 0 \\\\ 0 & 2 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    hint: 'Main diagonal entries must be 1, and all other entries 0.',
    solutionSteps: ['$I_2 = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}$.'],
  },
  {
    id: 'final-4',
    topicId: 'types-transpose',
    difficulty: 'Medium',
    prompt: 'If $A = \\begin{bmatrix} 0 & 3 \\\\ -3 & 0 \\end{bmatrix}$, then $A^t$ equals:',
    options: ['$-A$', '$A$', '$I_2$', '$O$'],
    correctIndex: 0,
    hint: 'Compute $A^t$ and compare with $-A$.',
    solutionSteps: ['$A^t = \\begin{bmatrix} 0 & -3 \\\\ 3 & 0 \\end{bmatrix} = -A$, so $A$ is skew-symmetric.'],
  },
  {
    id: 'final-5',
    topicId: 'types-transpose',
    difficulty: 'Medium',
    prompt: 'A diagonal matrix with all diagonal entries equal to $k$ ($k \\neq 0, 1$) is called a:',
    options: ['Scalar matrix', 'Unit matrix', 'Null matrix', 'Column matrix'],
    correctIndex: 0,
    hint: 'Think of scaling the identity matrix by $k$.',
    solutionSteps: ['Equal non-zero diagonal entries define a Scalar matrix.'],
  },
  {
    id: 'final-6',
    topicId: 'add-sub',
    difficulty: 'Easy',
    prompt: 'Which matrix must be added to $A = \\begin{bmatrix} 3 & -5 \\\\ 2 & 1 \\end{bmatrix}$ to obtain the zero matrix $O$?',
    options: [
      '$\\begin{bmatrix} -3 & 5 \\\\ -2 & -1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 3 & 5 \\\\ 2 & 1 \\end{bmatrix}$',
      '$\\begin{bmatrix} -3 & -5 \\\\ -2 & -1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 0 & 0 \\\\ 0 & 0 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    hint: 'Find the additive inverse $-A$.',
    solutionSteps: ['$A + (-A) = O$, so $-A = \\begin{bmatrix} -3 & 5 \\\\ -2 & -1 \\end{bmatrix}$.'],
  },
  {
    id: 'final-7',
    topicId: 'add-sub',
    difficulty: 'Medium',
    prompt: 'Evaluate $3\\begin{bmatrix} 1 & -2 \\\\ 0 & 4 \\end{bmatrix} - 2\\begin{bmatrix} 2 & -1 \\\\ 3 & 5 \\end{bmatrix}$.',
    options: [
      '$\\begin{bmatrix} -1 & -4 \\\\ -6 & 2 \\end{bmatrix}$',
      '$\\begin{bmatrix} -1 & -8 \\\\ -6 & 2 \\end{bmatrix}$',
      '$\\begin{bmatrix} 7 & -4 \\\\ 6 & 22 \\end{bmatrix}$',
      '$\\begin{bmatrix} -1 & -4 \\\\ 6 & 2 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    hint: 'Watch the double negative: $-6 - (-2) = -4$.',
    solutionSteps: ['$\\begin{bmatrix} 3-4 & -6-(-2) \\\\ 0-6 & 12-10 \\end{bmatrix} = \\begin{bmatrix} -1 & -4 \\\\ -6 & 2 \\end{bmatrix}$.'],
  },
  {
    id: 'final-8',
    topicId: 'multiplication',
    difficulty: 'Medium',
    prompt: 'If $A$ has order $3 \\times 2$ and $B$ has order $2 \\times 4$, what is the order of $BA$?',
    options: ['Not defined', '3-by-4', '4-by-3', '2-by-2'],
    correctIndex: 0,
    hint: 'Check if columns of $B$ equal rows of $A$.',
    solutionSteps: ['Columns of $B$ = 4, Rows of $A$ = 3. Since $4 \\neq 3$, $BA$ is not defined.'],
  },
  {
    id: 'final-9',
    topicId: 'multiplication',
    difficulty: 'Hard',
    prompt: 'If $A = \\begin{bmatrix} 1 & 2 \\\\ 0 & -1 \\end{bmatrix}$ and $B = \\begin{bmatrix} 2 & 0 \\\\ 3 & 1 \\end{bmatrix}$, find $AB$.',
    options: [
      '$\\begin{bmatrix} 8 & 2 \\\\ -3 & -1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 2 & 0 \\\\ 0 & -1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 2 & 4 \\\\ 3 & 5 \\end{bmatrix}$',
      '$\\begin{bmatrix} 8 & 0 \\\\ -3 & 1 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    hint: 'Row 1 of $A$ $\\times$ Col 1 of $B$ = $(1)(2)+(2)(3)=8$.',
    solutionSteps: [
      '$(1,1): 2+6=8$, $(1,2): 0+2=2$',
      '$(2,1): 0-3=-3$, $(2,2): 0-1=-1$',
    ],
  },
  {
    id: 'final-10',
    topicId: 'multiplication',
    difficulty: 'Medium',
    prompt: 'Which law holds true for any two conformable matrices $A$ and $B$?',
    options: ['$(AB)^t = B^t A^t$', '$AB = BA$', '$(AB)^t = A^t B^t$', '$A^2 - B^2 = (A-B)(A+B)$'],
    correctIndex: 0,
    hint: 'Recall the reversal property of transpose.',
    solutionSteps: ['$(AB)^t = B^t A^t$ always holds when $AB$ is defined.'],
  },
  {
    id: 'final-11',
    topicId: 'determinant-inverse',
    difficulty: 'Easy',
    prompt: 'What is the determinant of $M = \\begin{bmatrix} -3 & 4 \\\\ 2 & -5 \\end{bmatrix}$?',
    options: ['7', '23', '-7', '-23'],
    correctIndex: 0,
    hint: 'Evaluate $(-3)(-5) - (4)(2)$.',
    solutionSteps: ['$15 - 8 = 7$.'],
  },
  {
    id: 'final-12',
    topicId: 'determinant-inverse',
    difficulty: 'Medium',
    prompt: 'For which value of $m$ is $\\begin{bmatrix} m & 6 \\\\ 2 & 3 \\end{bmatrix}$ singular?',
    options: ['4', '-4', '9', '1'],
    correctIndex: 0,
    hint: 'Set determinant equal to zero.',
    solutionSteps: ['$3m - 12 = 0 \\implies 3m = 12 \\implies m = 4$.'],
  },
  {
    id: 'final-13',
    topicId: 'determinant-inverse',
    difficulty: 'Hard',
    prompt: 'If $A = \\begin{bmatrix} 4 & 1 \\\\ 3 & 1 \\end{bmatrix}$, what is $A^{-1}$?',
    options: [
      '$\\begin{bmatrix} 1 & -1 \\\\ -3 & 4 \\end{bmatrix}$',
      '$\\begin{bmatrix} 1 & 1 \\\\ 3 & 4 \\end{bmatrix}$',
      '$\\begin{bmatrix} 4 & -1 \\\\ -3 & 1 \\end{bmatrix}$',
      '$\\begin{bmatrix} -1 & 1 \\\\ 3 & -4 \\end{bmatrix}$',
    ],
    correctIndex: 0,
    hint: '$|A| = 4(1) - 1(3) = 1$.',
    solutionSteps: ['$|A| = 1$, $\\text{Adj } A = \\begin{bmatrix} 1 & -1 \\\\ -3 & 4 \\end{bmatrix}$.'],
  },
  {
    id: 'final-14',
    topicId: 'linear-systems',
    difficulty: 'Medium',
    prompt: 'Solve using Cramer’s Rule: $4x + 2y = 8$ and $3x - y = 1$. What is $x$?',
    options: ['$1$', '$2$', '$-1$', '$3$'],
    correctIndex: 0,
    hint: '$|A| = -4 - 6 = -10$ and $|A_x| = -8 - 2 = -10$.',
    solutionSteps: ['$x = \\frac{|A_x|}{|A|} = \\frac{-10}{-10} = 1$.'],
  },
  {
    id: 'final-15',
    topicId: 'linear-systems',
    difficulty: 'Hard',
    prompt: 'In the Matrix Inversion Method for $AX = B$, if $|A| = 0$, what can we conclude?',
    options: [
      'A unique solution does not exist because $A^{-1}$ does not exist.',
      'The solution is automatically $(0, 0)$.',
      'We must multiply $B A^{-1}$ instead.',
      '$X$ equals $\\text{Adj } A$.',
    ],
    correctIndex: 0,
    hint: 'Division by $|A| = 0$ is undefined.',
    solutionSteps: ['When $|A| = 0$, $A$ is singular and $A^{-1}$ does not exist, so no unique solution exists.'],
  },
];
