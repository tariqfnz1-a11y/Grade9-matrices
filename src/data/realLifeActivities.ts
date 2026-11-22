export type RealLifeActivityId =
  | 'attendance'
  | 'exam-results'
  | 'resource-allocation'
  | 'shopping-cost'
  | 'two-unknowns';

export interface DataTableSpec {
  caption: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface ActivityChallenge {
  prompt: string;
  dataTable?: DataTableSpec;
  answerFields: {
    key: string;
    label: string;
    expected: number;
    unit?: string;
  }[];
  hint: string;
  workedSolutionLatex: string;
}

export interface RealLifeActivity {
  id: RealLifeActivityId;
  number: string;
  tabLabel: string;
  title: string;
  syllabusLink: string;
  scenario: string;
  problemStatement: string;
  tables: DataTableSpec[];
  solutionSteps: {
    label: string;
    explanation: string;
    latex: string;
  }[];
  conceptExplanation: string;
  challenge: ActivityChallenge;
}

export interface ThinkBeyondTopic {
  id: string;
  question: string;
  simpleAnswer: string;
  dailyExample: string;
  unit1Connection: string;
}

export const REAL_LIFE_ACTIVITIES: RealLifeActivity[] = [
  {
    id: 'attendance',
    number: '01',
    tabLabel: '1. School Attendance',
    title: 'School Attendance Tracking Across Sections',
    syllabusLink: 'Exercises 1.1 & 1.3 (Matrix Order, Addition & Subtraction)',
    scenario:
      'At a high school in Lahore, the Grade 9 coordinator records how many boys and girls are present in Sections 9-A, 9-B, and 9-C on Monday and Tuesday.',
    problemStatement:
      'Represent Monday’s attendance as matrix $M$ and Tuesday’s attendance as matrix $T$. Find (a) the combined two-day attendance matrix $M + T$, and (b) the day-to-day change matrix $T - M$.',
    tables: [
      {
        caption: 'Monday Attendance Table (Matrix M)',
        headers: ['Class', 'Boys Present', 'Girls Present'],
        rows: [
          ['9-A', 22, 24],
          ['9-B', 20, 25],
          ['9-C', 18, 21],
        ],
      },
      {
        caption: 'Tuesday Attendance Table (Matrix T)',
        headers: ['Class', 'Boys Present', 'Girls Present'],
        rows: [
          ['9-A', 24, 25],
          ['9-B', 19, 26],
          ['9-C', 21, 23],
        ],
      },
    ],
    solutionSteps: [
      {
        label: 'Step 1: Write Both Tables as 3 × 2 Matrices',
        explanation:
          'Each class forms one horizontal row (3 rows) and Boys/Girls form two vertical columns (2 columns).',
        latex:
          'M = \\begin{bmatrix} 22 & 24 \\\\ 20 & 25 \\\\ 18 & 21 \\end{bmatrix}, \\qquad T = \\begin{bmatrix} 24 & 25 \\\\ 19 & 26 \\\\ 21 & 23 \\end{bmatrix}',
      },
      {
        label: 'Step 2: Combined Two-Day Attendance (M + T)',
        explanation: 'Since both matrices have the same order $3 \\times 2$, add matching entries:',
        latex:
          'M + T = \\begin{bmatrix} 22+24 & 24+25 \\\\ 20+19 & 25+26 \\\\ 18+21 & 21+23 \\end{bmatrix} = \\begin{bmatrix} 46 & 49 \\\\ 39 & 51 \\\\ 39 & 44 \\end{bmatrix}',
      },
      {
        label: 'Step 3: Change From Monday to Tuesday (T − M)',
        explanation:
          'Subtract Monday’s entries from Tuesday’s entries. Negative entries show fewer students present on Tuesday:',
        latex:
          'T - M = \\begin{bmatrix} 24-22 & 25-24 \\\\ 19-20 & 26-25 \\\\ 21-18 & 23-21 \\end{bmatrix} = \\begin{bmatrix} +2 & +1 \\\\ -1 & +1 \\\\ +3 & +2 \\end{bmatrix}',
      },
    ],
    conceptExplanation:
      'This activity uses Matrix Order ($3 \\times 2$) from Exercise 1.1 and Matrix Addition/Subtraction from Exercise 1.3. We can add or subtract two attendance tables only when both cover the exact same classes and columns (same order).',
    challenge: {
      prompt:
        'Independent Challenge: Look at the Wednesday attendance table below for Sections 9-A and 9-B. If Wednesday’s matrix is $W$, compute the total boys present in Section 9-A across Monday and Wednesday, and the change in girls present in Section 9-B from Monday to Wednesday ($W_{22} - M_{22}$).',
      dataTable: {
        caption: 'Wednesday Attendance (Sections 9-A & 9-B)',
        headers: ['Class', 'Boys Present', 'Girls Present'],
        rows: [
          ['9-A', 25, 23],
          ['9-B', 22, 22],
        ],
      },
      answerFields: [
        { key: 'totalBoys9A', label: 'Monday + Wednesday Boys in 9-A', expected: 47, unit: 'students' },
        { key: 'changeGirls9B', label: 'Change in Girls in 9-B (Wed − Mon)', expected: -3, unit: 'students' },
      ],
      hint: 'From Monday (M): 9-A Boys = 22, 9-B Girls = 25. From Wednesday (W): 9-A Boys = 25, 9-B Girls = 22.',
      workedSolutionLatex:
        '\\text{9-A Boys (Mon + Wed)} = 22 + 25 = 47, \\qquad \\text{9-B Girls Change} = 22 - 25 = -3',
    },
  },
  {
    id: 'exam-results',
    number: '02',
    tabLabel: '2. Exam Results',
    title: 'Comparing Monthly Examination Results',
    syllabusLink: 'Exercises 1.2 & 1.3 (Matrix Transpose & Matrix Subtraction)',
    scenario:
      'Four Grade 9 students (Ayesha, Bilal, Hina, and Saad) wrote two monthly tests in Mathematics and Physics (out of 50 marks each). The teacher wants to check student-by-student progress and reorganize Test 1 by subject.',
    problemStatement:
      'Let $A$ be Test 1 marks and $B$ be Test 2 marks (order $4 \\times 2$). Find the improvement matrix $B - A$, and write the transpose $A^t$ to display subjects as rows.',
    tables: [
      {
        caption: 'Monthly Test 1 Marks out of 50 (Matrix A)',
        headers: ['Student', 'Mathematics', 'Physics'],
        rows: [
          ['Ayesha', 38, 41],
          ['Bilal', 32, 35],
          ['Hina', 44, 40],
          ['Saad', 29, 34],
        ],
      },
      {
        caption: 'Monthly Test 2 Marks out of 50 (Matrix B)',
        headers: ['Student', 'Mathematics', 'Physics'],
        rows: [
          ['Ayesha', 43, 44],
          ['Bilal', 37, 34],
          ['Hina', 46, 45],
          ['Saad', 35, 38],
        ],
      },
    ],
    solutionSteps: [
      {
        label: 'Step 1: Construct Matrices A and B (4 × 2)',
        explanation: 'Four students form 4 rows and two subjects form 2 columns:',
        latex:
          'A = \\begin{bmatrix} 38 & 41 \\\\ 32 & 35 \\\\ 44 & 40 \\\\ 29 & 34 \\end{bmatrix}, \\qquad B = \\begin{bmatrix} 43 & 44 \\\\ 37 & 34 \\\\ 46 & 45 \\\\ 35 & 38 \\end{bmatrix}',
      },
      {
        label: 'Step 2: Compute Improvement Matrix (B − A)',
        explanation: 'Subtract each student’s Test 1 score from Test 2:',
        latex:
          'B - A = \\begin{bmatrix} 43-38 & 44-41 \\\\ 37-32 & 34-35 \\\\ 46-44 & 45-40 \\\\ 35-29 & 38-34 \\end{bmatrix} = \\begin{bmatrix} 5 & 3 \\\\ 5 & -1 \\\\ 2 & 5 \\\\ 6 & 4 \\end{bmatrix}',
      },
      {
        label: 'Step 3: Take Transpose Aᵗ to Group by Subject',
        explanation:
          'Interchanging rows and columns turns the $4 \\times 2$ matrix into a $2 \\times 4$ matrix (Row 1 = Math, Row 2 = Physics):',
        latex:
          'A^t = \\begin{bmatrix} 38 & 32 & 44 & 29 \\\\ 41 & 35 & 40 & 34 \\end{bmatrix}',
      },
    ],
    conceptExplanation:
      'Matrix Subtraction ($B - A$) quickly measures improvement across every student and subject in a single step. Taking the Transpose ($A^t$) switches rows and columns without changing any score—useful when switching from a student-wise view to a subject-wise view.',
    challenge: {
      prompt:
        'Independent Challenge: Using the two-student mark table below, calculate the combined total marks ($P + Q$) for Sana in English, and find which row/column entry $(P^t)_{21}$ represents for Ali in Computer.',
      dataTable: {
        caption: 'Quiz 1 (P) and Quiz 2 (Q) Marks',
        headers: ['Student', 'English (P / Q)', 'Computer (P / Q)'],
        rows: [
          ['Ali', '18 / 20', '22 / 24'],
          ['Sana', '19 / 23', '21 / 25'],
        ],
      },
      answerFields: [
        { key: 'sanaEngTotal', label: 'Sana Total in English (P + Q)', expected: 42, unit: 'marks' },
        { key: 'ptEntry21', label: 'Entry (Pᵗ)₂₁ (Ali Computer in Quiz 1)', expected: 22, unit: 'marks' },
      ],
      hint: 'Sana English = 19 + 23. In Pᵗ, Row 2 holds Computer scores and Column 1 is Ali.',
      workedSolutionLatex:
        'P + Q = \\begin{bmatrix} 38 & 46 \\\\ 42 & 46 \\end{bmatrix}, \\quad P^t = \\begin{bmatrix} 18 & 19 \\\\ 22 & 21 \\end{bmatrix} \\implies (P^t)_{21} = 22',
    },
  },
  {
    id: 'resource-allocation',
    number: '03',
    tabLabel: '3. Resource Allocation',
    title: 'School Stationery & Book Resource Allocation',
    syllabusLink: 'Exercise 1.3 (Scalar Multiplication & Matrix Addition)',
    scenario:
      'The school store distributes Math Textbooks, Graph Notebooks, and Geometry Boxes to Sections 9-A, 9-B, and 9-C in Term 1 (Matrix $R$). For Term 2, the principal plans double the Term 1 supply ($2R$) plus an extra emergency stock matrix $E$.',
    problemStatement:
      'Represent Term 1 distribution as matrix $R$ and the extra stock as matrix $E$. Compute the total Term 2 allocation $T = 2R + E$.',
    tables: [
      {
        caption: 'Term 1 Resource Distribution (Matrix R)',
        headers: ['Section', 'Textbooks', 'Graph Notebooks', 'Geometry Boxes'],
        rows: [
          ['9-A', 30, 60, 15],
          ['9-B', 25, 50, 12],
          ['9-C', 20, 45, 10],
        ],
      },
      {
        caption: 'Extra Emergency Stock (Matrix E)',
        headers: ['Section', 'Textbooks', 'Graph Notebooks', 'Geometry Boxes'],
        rows: [
          ['9-A', 5, 10, 3],
          ['9-B', 4, 8, 2],
          ['9-C', 6, 5, 4],
        ],
      },
    ],
    solutionSteps: [
      {
        label: 'Step 1: Write Matrices R and E (3 × 3)',
        explanation: 'Both tables have 3 sections and 3 resource types:',
        latex:
          'R = \\begin{bmatrix} 30 & 60 & 15 \\\\ 25 & 50 & 12 \\\\ 20 & 45 & 10 \\end{bmatrix}, \\qquad E = \\begin{bmatrix} 5 & 10 & 3 \\\\ 4 & 8 & 2 \\\\ 6 & 5 & 4 \\end{bmatrix}',
      },
      {
        label: 'Step 2: Apply Scalar Multiplication (2R)',
        explanation: 'Multiply every single entry of $R$ by the scalar $2$:',
        latex:
          '2R = \\begin{bmatrix} 60 & 120 & 30 \\\\ 50 & 100 & 24 \\\\ 40 & 90 & 20 \\end{bmatrix}',
      },
      {
        label: 'Step 3: Add Extra Stock (2R + E)',
        explanation: 'Add corresponding entries of $2R$ and $E$:',
        latex:
          '2R + E = \\begin{bmatrix} 65 & 130 & 33 \\\\ 54 & 108 & 26 \\\\ 46 & 95 & 24 \\end{bmatrix}',
      },
    ],
    conceptExplanation:
      'Scalar Multiplication ($kR$) scales an entire supply plan uniformly by multiplying every cell by $k$. Combining it with Matrix Addition ($2R + E$) models real budget adjustments cleanly.',
    challenge: {
      prompt:
        'Independent Challenge: Suppose next year the school prepares $3R$ items for 9-C, but 5 Notebooks from 9-C are damaged and removed. Using $R_{3,2} = 45$, how many Graph Notebooks are left in Section 9-C ($3R_{3,2} - 5$), and how many total Geometry Boxes does Section 9-A get under $2R + E$?',
      answerFields: [
        { key: 'notebooks9C', label: '9-C Graph Notebooks (3×45 − 5)', expected: 130, unit: 'notebooks' },
        { key: 'geom9A', label: '9-A Geometry Boxes in (2R + E)', expected: 33, unit: 'boxes' },
      ],
      hint: 'Multiply 45 by 3 and subtract 5. For 9-A Geometry Boxes, check row 1, col 3 of 2R + E.',
      workedSolutionLatex:
        '3(45) - 5 = 135 - 5 = 130, \\qquad (2R + E)_{1,3} = 2(15) + 3 = 33',
    },
  },
  {
    id: 'shopping-cost',
    number: '04',
    tabLabel: '4. Shopping & Cost',
    title: 'Shopping Bill Calculation via Matrix Multiplication',
    syllabusLink: 'Exercise 1.4 (Conformable Matrix Multiplication)',
    scenario:
      'Two classmates, Zain and Omar, visit a stationery shop. Zain buys 4 notebooks and 3 pens, while Omar buys 6 notebooks and 2 pens. Each notebook costs PKR 150 and each pen costs PKR 40.',
    problemStatement:
      'Arrange the quantities in a $2 \\times 2$ matrix $Q$ and the unit prices in a $2 \\times 1$ column matrix $P$. Use matrix multiplication $C = Q \\cdot P$ to find both students’ bills at once.',
    tables: [
      {
        caption: 'Quantities Purchased (Matrix Q)',
        headers: ['Student', 'Notebooks', 'Pens'],
        rows: [
          ['Zain', 4, 3],
          ['Omar', 6, 2],
        ],
      },
      {
        caption: 'Unit Price List (Matrix P)',
        headers: ['Item', 'Price (PKR)'],
        rows: [
          ['Notebook', 150],
          ['Pen', 40],
        ],
      },
    ],
    solutionSteps: [
      {
        label: 'Step 1: Check Conformability',
        explanation:
          '$Q$ has order $2 \\times 2$ (2 students $\\times$ 2 items) and $P$ has order $2 \\times 1$ (2 items $\\times$ 1 price column). Since columns of $Q$ ($2$) = rows of $P$ ($2$), $QP$ is valid and yields a $2 \\times 1$ bill matrix.',
        latex:
          'Q = \\begin{bmatrix} 4 & 3 \\\\ 6 & 2 \\end{bmatrix}_{2 \\times 2}, \\qquad P = \\begin{bmatrix} 150 \\\\ 40 \\end{bmatrix}_{2 \\times 1}',
      },
      {
        label: 'Step 2: Multiply Each Row of Q by Column P',
        explanation:
          'Each student’s row multiplies Notebook Qty $\\times$ Notebook Price $+$ Pen Qty $\\times$ Pen Price:',
        latex:
          'Q \\cdot P = \\begin{bmatrix} (4)(150) + (3)(40) \\\\ (6)(150) + (2)(40) \\end{bmatrix} = \\begin{bmatrix} 600 + 120 \\\\ 900 + 80 \\end{bmatrix} = \\begin{bmatrix} 720 \\\\ 980 \\end{bmatrix}',
      },
      {
        label: 'Step 3: Interpret the Result',
        explanation: 'Zain’s total bill is PKR 720 and Omar’s total bill is PKR 980.',
        latex: '\\text{Zain} = \\text{PKR } 720, \\qquad \\text{Omar} = \\text{PKR } 980',
      },
    ],
    conceptExplanation:
      'Matrix Multiplication pairs every row of items with the price column automatically! Notice also why order matters: $P_{2 \\times 1} \\cdot Q_{2 \\times 2}$ is NOT conformable because $1 \\neq 2$.',
    challenge: {
      prompt:
        'Independent Challenge: At the school canteen, Sana buys 3 sandwiches and 2 juices. Each sandwich costs PKR 120 and each juice costs PKR 60. Use a $1 \\times 2$ quantity row matrix multiplied by a $2 \\times 1$ price column matrix to find Sana’s total bill.',
      answerFields: [
        { key: 'sanaBill', label: 'Sana’s Total Bill', expected: 480, unit: 'PKR' },
      ],
      hint: 'Compute [3  2] · [120; 60] = 3(120) + 2(60).',
      workedSolutionLatex:
        '\\begin{bmatrix} 3 & 2 \\end{bmatrix} \\begin{bmatrix} 120 \\\\ 60 \\end{bmatrix} = [3(120) + 2(60)] = [360 + 120] = [480]',
    },
  },
  {
    id: 'two-unknowns',
    number: '05',
    tabLabel: '5. Two Unknowns',
    title: 'Finding Two Unknown Prices Using Cramer’s Rule',
    syllabusLink: 'Exercises 1.5 & 1.6 (Simultaneous Equations, Determinants & Cramer’s Rule)',
    scenario:
      'At a stationery store, price tags are missing on two items: Geometry Boxes ($x$) and Calculators ($y$). Bundle A (3 Geometry Boxes + 2 Calculators) costs PKR 1,700, while Bundle B (2 Geometry Boxes + 5 Calculators) costs PKR 2,600.',
    problemStatement:
      'Set up two simultaneous linear equations, check $|A| \\neq 0$, and use Cramer’s Rule to find the exact price of one Geometry Box ($x$) and one Calculator ($y$).',
    tables: [
      {
        caption: 'Shop Bundle Receipts',
        headers: ['Bundle', 'Geometry Boxes (x)', 'Calculators (y)', 'Total Cost (PKR)'],
        rows: [
          ['Bundle A', 3, 2, 1700],
          ['Bundle B', 2, 5, 2600],
        ],
      },
    ],
    solutionSteps: [
      {
        label: 'Step 1: Write Equations and Matrix Form AX = B',
        explanation: 'Translate both receipts into $3x + 2y = 1700$ and $2x + 5y = 2600$:',
        latex:
          '\\begin{bmatrix} 3 & 2 \\\\ 2 & 5 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 1700 \\\\ 2600 \\end{bmatrix}',
      },
      {
        label: 'Step 2: Calculate Determinant |A|',
        explanation: 'Confirm the coefficient matrix is non-singular:',
        latex: '|A| = (3)(5) - (2)(2) = 15 - 4 = 11 \\neq 0',
      },
      {
        label: 'Step 3: Compute |Aₓ| and |Aᵧ|',
        explanation: 'Replace column 1 with $B$ for $A_x$, and column 2 with $B$ for $A_y$:',
        latex:
          '|A_x| = \\begin{vmatrix} 1700 & 2 \\\\ 2600 & 5 \\end{vmatrix} = 8500 - 5200 = 3300, \\qquad |A_y| = \\begin{vmatrix} 3 & 1700 \\\\ 2 & 2600 \\end{vmatrix} = 7800 - 3400 = 4400',
      },
      {
        label: 'Step 4: Solve Using Cramer’s Rule',
        explanation: 'Divide each determinant by $|A| = 11$:',
        latex:
          'x = \\frac{3300}{11} = \\text{PKR } 300 \\; (\\text{Geometry Box}), \\qquad y = \\frac{4400}{11} = \\text{PKR } 400 \\; (\\text{Calculator})',
      },
    ],
    conceptExplanation:
      'Whenever two unknown quantities satisfy two distinct linear conditions, determinants test if a unique answer exists ($|A| \\neq 0$) and Cramer’s Rule computes each unknown directly without messy guessing.',
    challenge: {
      prompt:
        'Independent Challenge: Two notebooks and 3 pencils cost PKR 260 ($2x + 3y = 260$). Four notebooks and 1 pencil cost PKR 420 ($4x + y = 420$). Use determinants and Cramer’s Rule to find the price of 1 notebook ($x$) and 1 pencil ($y$).',
      answerFields: [
        { key: 'notebookPrice', label: 'Price of 1 Notebook (x)', expected: 100, unit: 'PKR' },
        { key: 'pencilPrice', label: 'Price of 1 Pencil (y)', expected: 20, unit: 'PKR' },
      ],
      hint: '|A| = 2(1) − 3(4) = −10, |Aₓ| = 260(1) − 3(420) = −1000, and |Aᵧ| = 2(420) − 260(4) = −200.',
      workedSolutionLatex:
        '|A| = -10, \\quad x = \\frac{-1000}{-10} = 100, \\quad y = \\frac{-200}{-10} = 20',
    },
  },
];

export const THINK_BEYOND_TOPICS: ThinkBeyondTopic[] = [
  {
    id: 'graphics',
    question: 'Why do matrices matter in computer graphics?',
    simpleAnswer:
      'A digital photo or screen is made of tiny colored squares called pixels arranged in rows and columns—just like a matrix! Each entry stores a brightness or color number.',
    dailyExample:
      'When you brighten a photo on your phone, the software multiplies the pixel matrix by a scale number and adds a constant—using the same scalar multiplication and matrix addition you learn in Exercise 1.3.',
    unit1Connection: 'Matrix Order (m × n), Scalar Multiplication (kA), Matrix Addition',
  },
  {
    id: 'data-org',
    question: 'How are matrices used in data organisation?',
    simpleAnswer:
      'Whenever information has two clear dimensions—such as cities vs. days of temperature, or months vs. household bills—a matrix keeps every number in an exact row-and-column address.',
    dailyExample:
      'Comparing two monthly expense tables takes a single subtraction (Month 2 − Month 1), and switching rows with columns is simply taking the Transpose (Aᵗ).',
    unit1Connection: 'Rectangular Arrays, Equal Matrices, Matrix Transpose (Aᵗ)',
  },
  {
    id: 'school-info',
    question: 'How can matrices help manage school information?',
    simpleAnswer:
      'Schools track hundreds of students across classes, subjects, attendance days, and textbook counts. Storing these registers as matrices lets staff compute totals and shortages cleanly without losing track of positions.',
    dailyExample:
      'Multiplying a class supply table (Q) by a unit cost column (P) immediately gives the total bill for every section on one sheet.',
    unit1Connection: 'Matrix Addition, Scalar Multiplication, Matrix Multiplication (Q · P)',
  },
  {
    id: 'simultaneous-life',
    question: 'Where do simultaneous equations occur in daily life?',
    simpleAnswer:
      'Any situation where two unknown amounts are linked by two separate clues creates two linear equations—such as finding individual item prices from two receipts or finding a garden’s length and width from its perimeter.',
    dailyExample:
      'Shopkeepers, engineers, and planners use determinants (|A| ≠ 0) and Cramer’s Rule to guarantee there is one exact answer and to compute both unknowns quickly.',
    unit1Connection: 'Determinants, Matrix Inversion (X = A⁻¹B), Cramer’s Rule',
  },
];
