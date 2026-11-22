export type Matrix = number[][];

export interface Fraction {
  num: number;
  den: number;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function toFraction(numerator: number, denominator: number): Fraction {
  if (denominator === 0) {
    return { num: numerator, den: 0 };
  }
  const sign = denominator < 0 ? -1 : 1;
  const n = numerator * sign;
  const d = Math.abs(denominator);
  if (Number.isInteger(n) && Number.isInteger(d)) {
    const divisor = gcd(n, d);
    return { num: n / divisor, den: d / divisor };
  }
  return { num: Number(n.toFixed(4)), den: Number(d.toFixed(4)) };
}

export function formatFractionLatex(num: number, den = 1): string {
  if (den === 0) return '\\text{undefined}';
  if (num === 0) return '0';
  if (Number.isInteger(num) && Number.isInteger(den)) {
    const f = toFraction(num, den);
    if (f.den === 1) return `${f.num}`;
    const sign = f.num < 0 ? '-' : '';
    return `${sign}\\frac{${Math.abs(f.num)}}{${f.den}}`;
  }
  const val = num / den;
  return Number.isInteger(val) ? `${val}` : val.toFixed(2);
}

export function formatNum(n: number): string {
  if (Math.abs(n) < 1e-10) return '0';
  if (Number.isInteger(n)) return `${n}`;
  return Number(n.toFixed(2)).toString();
}

export function matrixToLatex(m: Matrix): string {
  const rows = m.map((row) => row.map((v) => formatNum(v)).join(' & ')).join(' \\\\ ');
  return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
}

export function determinantToLatex(m: Matrix): string {
  const rows = m.map((row) => row.map((v) => formatNum(v)).join(' & ')).join(' \\\\ ');
  return `\\begin{vmatrix} ${rows} \\end{vmatrix}`;
}

export function getOrder(m: Matrix): { rows: number; cols: number } {
  return {
    rows: m.length,
    cols: m[0]?.length ?? 0,
  };
}

export function createMatrix(rows: number, cols: number, fill = 0): Matrix {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));
}

export function cloneMatrix(m: Matrix): Matrix {
  return m.map((r) => [...r]);
}

export function transposeMatrix(m: Matrix): Matrix {
  const { rows, cols } = getOrder(m);
  const res = createMatrix(cols, rows);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      res[j][i] = m[i][j];
    }
  }
  return res;
}

export function negateMatrix(m: Matrix): Matrix {
  return m.map((row) => row.map((val) => (val === 0 ? 0 : -val)));
}

export function matricesEqual(a: Matrix, b: Matrix): boolean {
  const oa = getOrder(a);
  const ob = getOrder(b);
  if (oa.rows !== ob.rows || oa.cols !== ob.cols) return false;
  for (let i = 0; i < oa.rows; i++) {
    for (let j = 0; j < oa.cols; j++) {
      if (Math.abs(a[i][j] - b[i][j]) > 1e-9) return false;
    }
  }
  return true;
}

export interface MatrixClassification {
  orderLabel: string;
  isSquare: boolean;
  isRectangular: boolean;
  isRow: boolean;
  isColumn: boolean;
  isNull: boolean;
  isDiagonal: boolean;
  isScalar: boolean;
  isIdentity: boolean;
  isSymmetric: boolean;
  isSkewSymmetric: boolean;
  typesList: string[];
}

export function classifyMatrix(m: Matrix): MatrixClassification {
  const { rows, cols } = getOrder(m);
  const isSquare = rows === cols && rows > 0;
  const isRectangular = rows !== cols;
  const isRow = rows === 1;
  const isColumn = cols === 1;
  const isNull = m.every((row) => row.every((v) => v === 0));

  let isDiagonal = isSquare;
  let isScalar = isSquare;
  let isIdentity = isSquare;
  let isSymmetric = isSquare;
  let isSkewSymmetric = isSquare;

  if (isSquare) {
    let hasNonZeroDiagonal = false;
    const firstDiag = m[0]?.[0] ?? 0;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const val = m[i][j];
        if (i !== j && val !== 0) {
          isDiagonal = false;
          isScalar = false;
          isIdentity = false;
        }
        if (i === j) {
          if (val !== 0) hasNonZeroDiagonal = true;
          if (val !== firstDiag) isScalar = false;
          if (val !== 1) isIdentity = false;
          if (val !== 0) isSkewSymmetric = false;
        }
        if (val !== m[j][i]) {
          isSymmetric = false;
        }
        if (val !== -m[j][i]) {
          isSkewSymmetric = false;
        }
      }
    }

    if (!hasNonZeroDiagonal) {
      isDiagonal = false;
      isScalar = false;
    }
    if (firstDiag === 0) {
      isScalar = false;
    }
  }

  const typesList: string[] = [];
  if (isRow) typesList.push('Row Matrix');
  if (isColumn) typesList.push('Column Matrix');
  if (isSquare) typesList.push('Square Matrix');
  if (isRectangular) typesList.push('Rectangular Matrix');
  if (isNull) typesList.push('Null / Zero Matrix');
  if (isDiagonal) typesList.push('Diagonal Matrix');
  if (isScalar) typesList.push('Scalar Matrix');
  if (isIdentity) typesList.push('Identity (Unit) Matrix');
  if (isSymmetric) typesList.push('Symmetric Matrix (Aᵗ = A)');
  if (isSkewSymmetric) typesList.push('Skew-Symmetric Matrix (Aᵗ = -A)');

  return {
    orderLabel: `${rows}-by-${cols}`,
    isSquare,
    isRectangular,
    isRow,
    isColumn,
    isNull,
    isDiagonal,
    isScalar,
    isIdentity,
    isSymmetric,
    isSkewSymmetric,
    typesList,
  };
}

export function addMatrices(a: Matrix, b: Matrix, subtract = false): Matrix | null {
  const oa = getOrder(a);
  const ob = getOrder(b);
  if (oa.rows !== ob.rows || oa.cols !== ob.cols) return null;
  return a.map((row, i) =>
    row.map((val, j) => (subtract ? val - b[i][j] : val + b[i][j]))
  );
}

export function multiplyMatrices(a: Matrix, b: Matrix): Matrix | null {
  const oa = getOrder(a);
  const ob = getOrder(b);
  if (oa.cols !== ob.rows) return null;
  const result = createMatrix(oa.rows, ob.cols, 0);
  for (let i = 0; i < oa.rows; i++) {
    for (let j = 0; j < ob.cols; j++) {
      let sum = 0;
      for (let k = 0; k < oa.cols; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

export interface Inverse2x2Result {
  determinant: number;
  isSingular: boolean;
  adjoint: Matrix;
  inverseNumeric: Matrix | null;
  inverseLatex: string | null;
}

export function compute2x2Inverse(m: Matrix): Inverse2x2Result {
  const a = m[0][0];
  const b = m[0][1];
  const c = m[1][0];
  const d = m[1][1];
  const det = a * d - b * c;
  const adjoint: Matrix = [
    [d, -b],
    [-c, a],
  ];

  if (Math.abs(det) < 1e-10) {
    return {
      determinant: 0,
      isSingular: true,
      adjoint,
      inverseNumeric: null,
      inverseLatex: null,
    };
  }

  const inverseNumeric: Matrix = [
    [d / det, -b / det],
    [-c / det, a / det],
  ];

  const f00 = formatFractionLatex(d, det);
  const f01 = formatFractionLatex(-b, det);
  const f10 = formatFractionLatex(-c, det);
  const f11 = formatFractionLatex(a, det);

  const inverseLatex = `\\begin{bmatrix} ${f00} & ${f01} \\\\ ${f10} & ${f11} \\end{bmatrix}`;

  return {
    determinant: det,
    isSingular: false,
    adjoint,
    inverseNumeric,
    inverseLatex,
  };
}

export interface LinearSystemSolution {
  detA: number;
  detAx: number;
  detAy: number;
  isSingular: boolean;
  uniqueSolution: boolean;
  x: number | null;
  y: number | null;
  xLatex: string;
  yLatex: string;
  A: Matrix;
  Ax: Matrix;
  Ay: Matrix;
  B: Matrix;
  adjA: Matrix;
}

export function solve2x2System(
  a1: number,
  b1: number,
  c1: number,
  a2: number,
  b2: number,
  c2: number
): LinearSystemSolution {
  const A: Matrix = [
    [a1, b1],
    [a2, b2],
  ];
  const B: Matrix = [[c1], [c2]];
  const Ax: Matrix = [
    [c1, b1],
    [c2, b2],
  ];
  const Ay: Matrix = [
    [a1, c1],
    [a2, c2],
  ];
  const adjA: Matrix = [
    [b2, -b1],
    [-a2, a1],
  ];

  const detA = a1 * b2 - b1 * a2;
  const detAx = c1 * b2 - b1 * c2;
  const detAy = a1 * c2 - c1 * a2;

  if (Math.abs(detA) < 1e-10) {
    return {
      detA: 0,
      detAx,
      detAy,
      isSingular: true,
      uniqueSolution: false,
      x: null,
      y: null,
      xLatex: '\\text{No unique solution}',
      yLatex: '\\text{No unique solution}',
      A,
      Ax,
      Ay,
      B,
      adjA,
    };
  }

  return {
    detA,
    detAx,
    detAy,
    isSingular: false,
    uniqueSolution: true,
    x: detAx / detA,
    y: detAy / detA,
    xLatex: formatFractionLatex(detAx, detA),
    yLatex: formatFractionLatex(detAy, detA),
    A,
    Ax,
    Ay,
    B,
    adjA,
  };
}

export function resizeMatrix(prev: Matrix, newRows: number, newCols: number): Matrix {
  const next = createMatrix(newRows, newCols, 0);
  for (let i = 0; i < Math.min(prev.length, newRows); i++) {
    for (let j = 0; j < Math.min(prev[0]?.length ?? 0, newCols); j++) {
      next[i][j] = prev[i][j];
    }
  }
  return next;
}

export interface SubstitutionCheck {
  eq1Lhs: number;
  eq1Rhs: number;
  eq1Verified: boolean;
  eq2Lhs: number;
  eq2Rhs: number;
  eq2Verified: boolean;
}

export function verifySystemSubstitution(
  a1: number,
  b1: number,
  c1: number,
  a2: number,
  b2: number,
  c2: number,
  x: number,
  y: number
): SubstitutionCheck {
  const eq1Lhs = a1 * x + b1 * y;
  const eq2Lhs = a2 * x + b2 * y;
  return {
    eq1Lhs,
    eq1Rhs: c1,
    eq1Verified: Math.abs(eq1Lhs - c1) < 1e-6,
    eq2Lhs,
    eq2Rhs: c2,
    eq2Verified: Math.abs(eq2Lhs - c2) < 1e-6,
  };
}

