import { ArrowLeftRight, CheckCircle2, Pause, Play, RefreshCw, RotateCcw, StepForward, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MathBlock, RichMathText } from '../components/MathBlock';
import { MatrixDisplay, MatrixEditor } from '../components/MatrixDisplay';
import type { StudentProgress } from '../types/curriculum';
import type { Matrix } from '../utils/matrixMath';
import {
  addMatrices,
  classifyMatrix,
  compute2x2Inverse,
  determinantToLatex,
  formatNum,
  matrixToLatex,
  multiplyMatrices,
  resizeMatrix,
  solve2x2System,
  transposeMatrix,
  verifySystemSubstitution,
} from '../utils/matrixMath';

interface MathLabViewProps {
  progress?: StudentProgress;
  onMarkExplored: (labId: string) => void;
}

type LabSimId =
  | 'builder'
  | 'transpose'
  | 'add-sub'
  | 'multiply'
  | 'determinant'
  | 'inverse'
  | 'cramer';

const LAB_SIMS: { id: LabSimId; label: string }[] = [
  { id: 'builder', label: '1. Matrix Builder' },
  { id: 'transpose', label: '2. Transpose Simulator' },
  { id: 'add-sub', label: '3. Add & Subtract' },
  { id: 'multiply', label: '4. Multiplication Lab' },
  { id: 'determinant', label: '5. Determinant' },
  { id: 'inverse', label: '6. Inverse Matrix' },
  { id: 'cramer', label: "7. Cramer's Rule" },
];

const BUILDER_EXAMPLES: { rows: number; cols: number; mat: Matrix; note: string }[] = [
  { rows: 1, cols: 4, mat: [[2, -1, 5, 0]], note: '1-by-4 Row Matrix' },
  { rows: 3, cols: 1, mat: [[4], [-2], [7]], note: '3-by-1 Column Matrix' },
  { rows: 2, cols: 2, mat: [[3, 0], [0, 3]], note: '2-by-2 Square & Scalar Matrix' },
  { rows: 2, cols: 3, mat: [[1, -2, 4], [0, 5, -3]], note: '2-by-3 Rectangular Matrix' },
];

const TRANSPOSE_EXAMPLES: Matrix[] = [
  [
    [1, 2, 3],
    [4, 5, 6],
  ],
  [
    [-1, 5],
    [3, 0],
    [2, -4],
  ],
  [
    [2, 7],
    [7, -3],
  ],
];

const ADDSUB_EXAMPLES: { op: 'add' | 'sub'; a: Matrix; b: Matrix }[] = [
  {
    op: 'add',
    a: [
      [2, -1],
      [4, 3],
    ],
    b: [
      [1, 5],
      [-2, 2],
    ],
  },
  {
    op: 'sub',
    a: [
      [5, 2, -1],
      [0, 3, 6],
    ],
    b: [
      [1, -4, 2],
      [3, 3, -2],
    ],
  },
  {
    op: 'add',
    a: [
      [3, -2],
      [1, 0],
      [-4, 5],
    ],
    b: [
      [-1, 2],
      [4, 7],
      [6, -3],
    ],
  },
];

const MULTIPLY_EXAMPLES: { a: Matrix; b: Matrix }[] = [
  {
    a: [
      [1, 2, 0],
      [-1, 3, 2],
    ],
    b: [
      [2, -1],
      [1, 4],
      [0, 3],
    ],
  },
  {
    a: [
      [2, -1],
      [3, 4],
    ],
    b: [
      [1, 5],
      [-2, 0],
    ],
  },
  {
    a: [[2, -1, 3]],
    b: [[1], [4], [-2]],
  },
];

const DETERMINANT_EXAMPLES: Matrix[] = [
  [
    [4, 2],
    [-1, 3],
  ],
  [
    [2, 6],
    [1, 3],
  ],
  [
    [-3, 5],
    [2, -4],
  ],
];

const INVERSE_EXAMPLES: Matrix[] = [
  [
    [3, 1],
    [1, 2],
  ],
  [
    [2, 4],
    [1, 2],
  ],
  [
    [-1, 3],
    [2, 0],
  ],
];

const CRAMER_EXAMPLES = [
  { a1: 2, b1: 1, c1: 5, a2: 1, b2: -1, c2: 1 },
  { a1: 3, b1: -2, c1: -6, a2: 5, b2: -2, c2: -10 },
  { a1: 2, b1: -2, c1: 4, a2: 3, b2: 2, c2: 6 },
  { a1: 2, b1: 4, c1: 5, a2: 1, b2: 2, c2: 3 }, // Singular example
];

export const MathLabView: React.FC<MathLabViewProps> = ({
  progress,
  onMarkExplored,
}) => {
  const [activeSim, setActiveSim] = useState<LabSimId>('builder');

  // 1. Matrix Builder
  const [bRows, setBRows] = useState(2);
  const [bCols, setBCols] = useState(3);
  const [bMat, setBMat] = useState<Matrix>([
    [1, -2, 4],
    [0, 5, -3],
  ]);
  const [bExIdx, setBExIdx] = useState(0);

  // 2. Transpose Simulator
  const [tRows, setTRows] = useState(2);
  const [tCols, setTCols] = useState(3);
  const [tMat, setTMat] = useState<Matrix>([
    [1, 2, 3],
    [4, 5, 6],
  ]);
  const [isTransposed, setIsTransposed] = useState(true);
  const [tExIdx, setTExIdx] = useState(0);

  // 3. Addition & Subtraction
  const [asRows, setAsRows] = useState(2);
  const [asCols, setAsCols] = useState(2);
  const [asOp, setAsOp] = useState<'add' | 'sub'>('add');
  const [asA, setAsA] = useState<Matrix>([
    [2, -1],
    [4, 3],
  ]);
  const [asB, setAsB] = useState<Matrix>([
    [1, 5],
    [-2, 2],
  ]);
  const [asHighlight, setAsHighlight] = useState<[number, number]>([0, 0]);
  const [asExIdx, setAsExIdx] = useState(0);

  // 4. Multiplication Lab
  const [mRowsA, setMRowsA] = useState(2);
  const [mSharedN, setMSharedN] = useState(3);
  const [mColsB, setMColsB] = useState(2);
  const [mulA, setMulA] = useState<Matrix>([
    [1, 2, 0],
    [-1, 3, 2],
  ]);
  const [mulB, setMulB] = useState<Matrix>([
    [2, -1],
    [1, 4],
    [0, 3],
  ]);
  const [mulCell, setMulCell] = useState<[number, number]>([0, 0]);
  const [mulPlaying, setMulPlaying] = useState(false);
  const [mulExIdx, setMulExIdx] = useState(0);

  // 5. Determinant Calculator
  const [detMat, setDetMat] = useState<Matrix>([
    [4, 2],
    [-1, 3],
  ]);
  const [detExIdx, setDetExIdx] = useState(0);

  // 6. Inverse Matrix Simulator
  const [invMat, setInvMat] = useState<Matrix>([
    [3, 1],
    [1, 2],
  ]);
  const [invExIdx, setInvExIdx] = useState(0);

  // 7. Cramer's Rule Explorer
  const [cramer, setCramer] = useState({
    a1: 2,
    b1: 1,
    c1: 5,
    a2: 1,
    b2: -1,
    c2: 1,
  });
  const [cramerExIdx, setCramerExIdx] = useState(0);

  useEffect(() => {
    onMarkExplored(activeSim);
  }, [activeSim, onMarkExplored]);

  // Multiplication auto-stepper
  const mulResult = multiplyMatrices(mulA, mulB);
  useEffect(() => {
    if (!mulPlaying || !mulResult) return;
    const rows = mulResult.length;
    const cols = mulResult[0]?.length ?? 1;
    const timer = window.setInterval(() => {
      setMulCell(([r, c]) => {
        if (c + 1 < cols) return [r, c + 1];
        if (r + 1 < rows) return [r + 1, 0];
        return [0, 0];
      });
    }, 1500);
    return () => window.clearInterval(timer);
  }, [mulPlaying, mulResult]);

  // Derived values
  const bClass = classifyMatrix(bMat);
  const tResult = transposeMatrix(tMat);
  const asResult = addMatrices(asA, asB, asOp === 'sub') ?? [[0]];
  const detA = detMat[0][0] * detMat[1][1] - detMat[0][1] * detMat[1][0];
  const detMainProd = detMat[0][0] * detMat[1][1];
  const detAntiProd = detMat[0][1] * detMat[1][0];
  const invRes = compute2x2Inverse(invMat);
  const invCheck =
    invRes.inverseNumeric !== null ? multiplyMatrices(invMat, invRes.inverseNumeric) : null;
  const cramerRes = solve2x2System(
    cramer.a1,
    cramer.b1,
    cramer.c1,
    cramer.a2,
    cramer.b2,
    cramer.c2
  );
  const cramerCheck =
    cramerRes.x !== null && cramerRes.y !== null
      ? verifySystemSubstitution(
          cramer.a1,
          cramer.b1,
          cramer.c1,
          cramer.a2,
          cramer.b2,
          cramer.c2,
          cramerRes.x,
          cramerRes.y
        )
      : null;

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-[#0D9488]">
          Module 04 · Interactive Mathematics Laboratory
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F294A] mt-1">
          Interactive Mathematics Lab
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Seven interactive simulations covering every operation in Unit 1 — computed locally with
          live step-by-step explanations.
        </p>
      </div>

      {/* 7-Simulation Selector */}
      <div
        role="tablist"
        aria-label="Unit 1 Laboratory Simulations"
        className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl"
      >
        {LAB_SIMS.map((sim) => {
          const active = sim.id === activeSim;
          const explored = progress?.labModulesExplored.includes(sim.id) ?? false;
          return (
            <button
              key={sim.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => {
                setActiveSim(sim.id);
                setMulPlaying(false);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                active
                  ? 'bg-white text-[#0F294A] shadow-sm'
                  : 'text-slate-600 hover:text-[#0F294A]'
              }`}
            >
              {explored && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] shrink-0" aria-label="Explored" />
              )}
              <span>{sim.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================
          1. MATRIX BUILDER
      ============================================================ */}
      {activeSim === 'builder' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0F294A]">
                  1. Matrix Builder
                </h2>
                <p className="text-xs text-slate-500">
                  Choose dimensions, enter values, and inspect the order and matrix shape type.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (bExIdx + 1) % BUILDER_EXAMPLES.length;
                    const ex = BUILDER_EXAMPLES[nextIdx];
                    setBExIdx(nextIdx);
                    setBRows(ex.rows);
                    setBCols(ex.cols);
                    setBMat(ex.mat.map((r) => [...r]));
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0D9488] bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Another Example</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBRows(2);
                    setBCols(3);
                    setBMat([
                      [1, -2, 4],
                      [0, 5, -3],
                    ]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <label className="text-xs font-medium text-slate-700">
                Number of Rows (m): <span className="font-mono-num text-[#0F294A]">{bRows}</span>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={bRows}
                  onChange={(e) => {
                    const r = Number(e.target.value);
                    setBRows(r);
                    setBMat((prev) => resizeMatrix(prev, r, bCols));
                  }}
                  className="w-full mt-1.5 accent-[#0D9488]"
                />
              </label>
              <label className="text-xs font-medium text-slate-700">
                Number of Columns (n):{' '}
                <span className="font-mono-num text-[#0F294A]">{bCols}</span>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={bCols}
                  onChange={(e) => {
                    const c = Number(e.target.value);
                    setBCols(c);
                    setBMat((prev) => resizeMatrix(prev, bRows, c));
                  }}
                  className="w-full mt-1.5 accent-[#0D9488]"
                />
              </label>
            </div>

            <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl p-6 gap-4 overflow-x-auto">
              <MatrixEditor label="Editable Matrix A" matrix={bMat} onChange={setBMat} />
              <div className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-center overflow-x-auto">
                <MathBlock latex={`A = ${matrixToLatex(bMat)}`} display />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-[#0F294A]">
              Automatic Matrix Analysis
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <p className="text-xs text-slate-500">Order (m × n)</p>
                <p className="font-display text-xl font-bold text-[#0F294A] mt-0.5 tabular-nums">
                  {bClass.orderLabel}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <p className="text-xs text-slate-500">Total Entries</p>
                <p className="font-display text-xl font-bold text-[#0D9488] mt-0.5 tabular-nums">
                  {bRows * bCols}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2.5">
              <p className="text-xs font-semibold text-[#0F294A]">Primary Shape Identification</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Row Matrix', active: bClass.isRow, rule: 'm = 1' },
                  { label: 'Column Matrix', active: bClass.isColumn, rule: 'n = 1' },
                  { label: 'Square Matrix', active: bClass.isSquare, rule: 'm = n' },
                  { label: 'Rectangular Matrix', active: bClass.isRectangular, rule: 'm ≠ n' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-lg border px-3 py-2 flex items-center justify-between gap-2 ${
                      item.active
                        ? 'border-[#0D9488] bg-teal-50 text-[#0F294A] font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {item.active && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] shrink-0" aria-label="Matches" />
                      )}
                      <span>{item.label}</span>
                    </span>
                    <span className="font-mono-num">{item.rule}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2">
              <p className="text-xs font-semibold text-[#0F294A]">Explanation</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                This matrix has <strong className="font-mono-num">{bRows}</strong>{' '}
                {bRows === 1 ? 'row' : 'rows'} and{' '}
                <strong className="font-mono-num">{bCols}</strong>{' '}
                {bCols === 1 ? 'column' : 'columns'}, so its order is{' '}
                <strong>{bClass.orderLabel}</strong>.{' '}
                {bClass.isSquare
                  ? 'Because rows equal columns (m = n), it is a Square Matrix.'
                  : 'Because rows do not equal columns (m ≠ n), it is a Rectangular Matrix.'}{' '}
                {bClass.isRow && 'Since it has only 1 row, it is also a Row Matrix. '}
                {bClass.isColumn && 'Since it has only 1 column, it is also a Column Matrix. '}
              </p>
              {bClass.typesList.length > 0 && (
                <p className="text-xs text-slate-600">
                  All matching classifications: {bClass.typesList.join(' · ')}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          2. MATRIX TRANSPOSE SIMULATOR
      ============================================================ */}
      {activeSim === 'transpose' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0F294A]">
                  2. Matrix Transpose Simulator
                </h2>
                <p className="text-xs text-slate-500">
                  Edit matrix A, then click Transpose to interchange its rows and columns.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (tExIdx + 1) % TRANSPOSE_EXAMPLES.length;
                    const ex = TRANSPOSE_EXAMPLES[nextIdx];
                    setTExIdx(nextIdx);
                    setTRows(ex.length);
                    setTCols(ex[0].length);
                    setTMat(ex.map((r) => [...r]));
                    setIsTransposed(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0D9488] bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Another Example</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTRows(2);
                    setTCols(3);
                    setTMat([
                      [1, 2, 3],
                      [4, 5, 6],
                    ]);
                    setIsTransposed(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <label className="text-xs font-medium text-slate-700">
                Rows of A: <span className="font-mono-num text-[#0F294A]">{tRows}</span>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={tRows}
                  onChange={(e) => {
                    const r = Number(e.target.value);
                    setTRows(r);
                    setTMat((prev) => resizeMatrix(prev, r, tCols));
                  }}
                  className="w-full mt-1 accent-[#0D9488]"
                />
              </label>
              <label className="text-xs font-medium text-slate-700">
                Columns of A: <span className="font-mono-num text-[#0F294A]">{tCols}</span>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={tCols}
                  onChange={(e) => {
                    const c = Number(e.target.value);
                    setTCols(c);
                    setTMat((prev) => resizeMatrix(prev, tRows, c));
                  }}
                  className="w-full mt-1 accent-[#0D9488]"
                />
              </label>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-around gap-6 bg-slate-50 border border-slate-200 rounded-xl p-6 overflow-x-auto">
              <MatrixEditor
                label={`Original Matrix A (${tRows}×${tCols})`}
                matrix={tMat}
                onChange={setTMat}
              />

              <button
                type="button"
                onClick={() => setIsTransposed((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864] shrink-0"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>{isTransposed ? 'Transpose Again (Aᵗ)' : 'Transpose Matrix'}</span>
              </button>

              {isTransposed ? (
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-[#0D9488] block">
                    Transposed Matrix Aᵗ ({tCols}×{tRows})
                  </span>
                  <MatrixDisplay matrix={tResult} />
                </div>
              ) : (
                <div className="border border-dashed border-slate-300 rounded-lg px-5 py-4 text-xs text-slate-500 text-center">
                  Click <strong>Transpose Matrix</strong> to interchange rows and columns.
                </div>
              )}
            </div>

            {isTransposed && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 overflow-x-auto">
                <MathBlock
                  latex={`A = ${matrixToLatex(tMat)} \\quad \\xrightarrow{\\text{Rows } \\leftrightarrow \\text{ Columns}} \\quad A^t = ${matrixToLatex(
                    tResult
                  )}`}
                  display
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-[#0F294A]">
              How Transpose Works
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              The transpose <MathBlock latex="A^t" /> is formed by turning every horizontal row of{' '}
              <MathBlock latex="A" /> into a vertical column (or vice versa).
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs text-slate-700">
              <p className="font-semibold text-[#0F294A]">Row-to-Column Mapping:</p>
              {tMat.map((row, rIdx) => (
                <p key={rIdx} className="font-mono-num">
                  Row {rIdx + 1} [{row.map((v) => formatNum(v)).join(', ')}] → Column {rIdx + 1} of
                  Aᵗ
                </p>
              ))}
            </div>
            <p className="text-xs text-slate-600">
              Notice the order swaps from{' '}
              <strong className="font-mono-num">
                {tRows}×{tCols}
              </strong>{' '}
              to{' '}
              <strong className="font-mono-num">
                {tCols}×{tRows}
              </strong>
              .
            </p>
          </div>
        </section>
      )}

      {/* ============================================================
          3. MATRIX ADDITION AND SUBTRACTION
      ============================================================ */}
      {activeSim === 'add-sub' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0F294A]">
                  3. Matrix Addition and Subtraction
                </h2>
                <p className="text-xs text-slate-500">
                  Click or focus any cell to highlight the corresponding entries used in the
                  calculation.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (asExIdx + 1) % ADDSUB_EXAMPLES.length;
                    const ex = ADDSUB_EXAMPLES[nextIdx];
                    setAsExIdx(nextIdx);
                    setAsOp(ex.op);
                    setAsRows(ex.a.length);
                    setAsCols(ex.a[0].length);
                    setAsA(ex.a.map((r) => [...r]));
                    setAsB(ex.b.map((r) => [...r]));
                    setAsHighlight([0, 0]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0D9488] bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Another Example</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAsOp('add');
                    setAsRows(2);
                    setAsCols(2);
                    setAsA([
                      [2, -1],
                      [4, 3],
                    ]);
                    setAsB([
                      [1, 5],
                      [-2, 2],
                    ]);
                    setAsHighlight([0, 0]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="inline-flex p-1 bg-white border border-slate-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setAsOp('add')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md ${
                    asOp === 'add' ? 'bg-[#0F294A] text-white' : 'text-slate-600'
                  }`}
                >
                  Addition (A + B)
                </button>
                <button
                  type="button"
                  onClick={() => setAsOp('sub')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md ${
                    asOp === 'sub' ? 'bg-[#0F294A] text-white' : 'text-slate-600'
                  }`}
                >
                  Subtraction (A − B)
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
                <label className="flex items-center gap-2">
                  Rows: <span className="font-mono-num">{asRows}</span>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    value={asRows}
                    onChange={(e) => {
                      const r = Number(e.target.value);
                      setAsRows(r);
                      setAsA((prev) => resizeMatrix(prev, r, asCols));
                      setAsB((prev) => resizeMatrix(prev, r, asCols));
                      setAsHighlight([0, 0]);
                    }}
                    className="w-24 accent-[#0D9488]"
                  />
                </label>
                <label className="flex items-center gap-2">
                  Cols: <span className="font-mono-num">{asCols}</span>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    value={asCols}
                    onChange={(e) => {
                      const c = Number(e.target.value);
                      setAsCols(c);
                      setAsA((prev) => resizeMatrix(prev, asRows, c));
                      setAsB((prev) => resizeMatrix(prev, asRows, c));
                      setAsHighlight([0, 0]);
                    }}
                    className="w-24 accent-[#0D9488]"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-5 overflow-x-auto">
              <MatrixEditor
                label={`A (${asRows}×${asCols})`}
                matrix={asA}
                onChange={setAsA}
                highlightCell={asHighlight}
                onCellFocus={(r, c) => setAsHighlight([r, c])}
              />
              <span className="font-display text-2xl font-bold text-[#0D9488]">
                {asOp === 'add' ? '+' : '−'}
              </span>
              <MatrixEditor
                label={`B (${asRows}×${asCols})`}
                matrix={asB}
                onChange={setAsB}
                highlightCell={asHighlight}
                onCellFocus={(r, c) => setAsHighlight([r, c])}
              />
              <span className="font-display text-2xl font-bold text-slate-400">=</span>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-[#0D9488]">
                  Result C (click any cell)
                </span>
                <MatrixDisplay
                  matrix={asResult}
                  highlightCell={asHighlight}
                  onCellClick={(r, c) => setAsHighlight([r, c])}
                />
              </div>
            </div>

            {/* Highlighted Entry Formula */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 space-y-1">
              <p className="text-xs font-semibold text-[#0F766E]">
                Highlighted Corresponding Entry: Row {asHighlight[0] + 1}, Column{' '}
                {asHighlight[1] + 1}
              </p>
              <MathBlock
                latex={`c_{${asHighlight[0] + 1}${asHighlight[1] + 1}} = a_{${
                  asHighlight[0] + 1
                }${asHighlight[1] + 1}} ${asOp === 'add' ? '+' : '-'} b_{${asHighlight[0] + 1}${
                  asHighlight[1] + 1
                }} = (${formatNum(asA[asHighlight[0]]?.[asHighlight[1]] ?? 0)}) ${
                  asOp === 'add' ? '+' : '-'
                } (${formatNum(asB[asHighlight[0]]?.[asHighlight[1]] ?? 0)}) = ${formatNum(
                  asResult[asHighlight[0]]?.[asHighlight[1]] ?? 0
                )}`}
                display
              />
            </div>
          </div>

          {/* Step-by-Step Working */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-[#0F294A]">
              Step-by-Step Entry Working
            </h3>
            <p className="text-xs text-slate-600">
              Both matrices have compatible order{' '}
              <strong className="font-mono-num">
                {asRows}×{asCols}
              </strong>
              . Click any line below to inspect its position:
            </p>
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {asResult.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  const active = asHighlight[0] === rIdx && asHighlight[1] === cIdx;
                  const aVal = asA[rIdx][cIdx];
                  const bVal = asB[rIdx][cIdx];
                  return (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      type="button"
                      onClick={() => setAsHighlight([rIdx, cIdx])}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-mono-num transition-colors flex items-center justify-between ${
                        active
                          ? 'border-[#0D9488] bg-teal-50 text-[#0F294A] font-semibold'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>
                        c<sub>{rIdx + 1},{cIdx + 1}</sub>: ({formatNum(aVal)}){' '}
                        {asOp === 'add' ? '+' : '−'} ({formatNum(bVal)})
                      </span>
                      <span>= {formatNum(val)}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          4. MATRIX MULTIPLICATION LAB
      ============================================================ */}
      {activeSim === 'multiply' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0F294A]">
                  4. Matrix Multiplication Lab
                </h2>
                <p className="text-xs text-slate-500">
                  Select compatible dimensions, then click any result cell or Animate to trace
                  row-by-column dot products.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (mulExIdx + 1) % MULTIPLY_EXAMPLES.length;
                    const ex = MULTIPLY_EXAMPLES[nextIdx];
                    setMulPlaying(false);
                    setMulExIdx(nextIdx);
                    setMRowsA(ex.a.length);
                    setMSharedN(ex.a[0].length);
                    setMColsB(ex.b[0].length);
                    setMulA(ex.a.map((r) => [...r]));
                    setMulB(ex.b.map((r) => [...r]));
                    setMulCell([0, 0]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0D9488] bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Another Example</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMulPlaying(false);
                    setMRowsA(2);
                    setMSharedN(3);
                    setMColsB(2);
                    setMulA([
                      [1, 2, 0],
                      [-1, 3, 2],
                    ]);
                    setMulB([
                      [2, -1],
                      [1, 4],
                      [0, 3],
                    ]);
                    setMulCell([0, 0]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Compatible Dimensions Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <label className="text-xs font-medium text-slate-700">
                Rows of A (m): <span className="font-mono-num text-[#0F294A]">{mRowsA}</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={mRowsA}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    setMulPlaying(false);
                    setMRowsA(m);
                    setMulA((prev) => resizeMatrix(prev, m, mSharedN));
                    setMulCell([0, 0]);
                  }}
                  className="w-full mt-1 accent-[#0D9488]"
                />
              </label>
              <label className="text-xs font-medium text-slate-700">
                Cols of A = Rows of B (n):{' '}
                <span className="font-mono-num text-[#0D9488]">{mSharedN}</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={mSharedN}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    setMulPlaying(false);
                    setMSharedN(n);
                    setMulA((prev) => resizeMatrix(prev, mRowsA, n));
                    setMulB((prev) => resizeMatrix(prev, n, mColsB));
                    setMulCell([0, 0]);
                  }}
                  className="w-full mt-1 accent-[#0D9488]"
                />
              </label>
              <label className="text-xs font-medium text-slate-700">
                Cols of B (p): <span className="font-mono-num text-[#0F294A]">{mColsB}</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={mColsB}
                  onChange={(e) => {
                    const p = Number(e.target.value);
                    setMulPlaying(false);
                    setMColsB(p);
                    setMulB((prev) => resizeMatrix(prev, mSharedN, p));
                    setMulCell([0, 0]);
                  }}
                  className="w-full mt-1 accent-[#0D9488]"
                />
              </label>
            </div>

            {/* Interactive Matrices Stage */}
            <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-5 overflow-x-auto">
              <MatrixEditor
                label={`A (${mRowsA}×${mSharedN})`}
                matrix={mulA}
                onChange={setMulA}
                highlightRow={mulCell[0]}
              />
              <span className="font-display text-xl font-bold text-[#0D9488]">×</span>
              <MatrixEditor
                label={`B (${mSharedN}×${mColsB})`}
                matrix={mulB}
                onChange={setMulB}
                highlightCol={mulCell[1]}
              />
              <span className="font-display text-xl font-bold text-slate-400">=</span>

              {mulResult && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-[#0D9488]">
                    AB ({mRowsA}×{mColsB}) — click cell
                  </span>
                  <MatrixDisplay
                    matrix={mulResult}
                    highlightCell={mulCell}
                    onCellClick={(r, c) => {
                      setMulPlaying(false);
                      setMulCell([r, c]);
                    }}
                  />
                </div>
              )}
            </div>

            {/* SVG Visual Pairing & Playback Controls */}
            {mulResult && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-[#0F294A]">
                    Visual Row {mulCell[0] + 1} × Column {mulCell[1] + 1} Pairing → Entry c
                    <sub className="font-mono-num">
                      {mulCell[0] + 1},{mulCell[1] + 1}
                    </sub>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMulPlaying((p) => !p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864]"
                    >
                      {mulPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{mulPlaying ? 'Pause' : 'Animate'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMulPlaying(false);
                        setMulCell(([r, c]) => {
                          if (c + 1 < mColsB) return [r, c + 1];
                          if (r + 1 < mRowsA) return [r + 1, 0];
                          return [0, 0];
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F294A] bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
                    >
                      <StepForward className="w-3.5 h-3.5" />
                      <span>Step Cell</span>
                    </button>
                  </div>
                </div>

                {/* SVG Row-Column Dot Product Diagram */}
                <svg
                  viewBox="0 0 420 96"
                  className="w-full max-w-[440px] h-auto mx-auto"
                  role="img"
                  aria-label="SVG diagram pairing elements of the selected row with the selected column"
                >
                  {mulA[mulCell[0]].map((aVal, k) => {
                    const xCenter = 70 + k * 140;
                    const bVal = mulB[k]?.[mulCell[1]] ?? 0;
                    const prod = aVal * bVal;
                    return (
                      <g key={k}>
                        <rect
                          x={xCenter - 48}
                          y="6"
                          width="96"
                          height="24"
                          rx="5"
                          fill="#CCFBF1"
                          stroke="#0D9488"
                        />
                        <text
                          x={xCenter}
                          y="22"
                          textAnchor="middle"
                          fontSize="11"
                          fontFamily="monospace"
                          fill="#0F294A"
                        >
                          ({formatNum(aVal)}) × ({formatNum(bVal)})
                        </text>
                        <line
                          x1={xCenter}
                          y1="30"
                          x2={xCenter}
                          y2="52"
                          stroke="#0F294A"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points={`${xCenter - 4},48 ${xCenter + 4},48 ${xCenter},54`}
                          fill="#0F294A"
                        />
                        <rect
                          x={xCenter - 34}
                          y="56"
                          width="68"
                          height="24"
                          rx="5"
                          fill="#FFFFFF"
                          stroke="#CBD5E1"
                        />
                        <text
                          x={xCenter}
                          y="72"
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="600"
                          fontFamily="monospace"
                          fill="#0F294A"
                        >
                          {formatNum(prod)}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="bg-white border border-slate-200 rounded-lg p-3 overflow-x-auto">
                  <MathBlock
                    latex={`c_{${mulCell[0] + 1}${mulCell[1] + 1}} = ${mulA[mulCell[0]]
                      .map((v, k) => `(${formatNum(v)})(${formatNum(mulB[k][mulCell[1]])})`)
                      .join(' + ')} = ${mulA[mulCell[0]]
                      .map((v, k) => formatNum(v * mulB[k][mulCell[1]]))
                      .join(' + ')} = ${formatNum(mulResult[mulCell[0]][mulCell[1]])}`}
                    display
                  />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-[#0F294A]">
              Compatibility & Final Product
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Because <MathBlock latex={`A_{${mRowsA} \\times ${mSharedN}}`} /> has{' '}
              <strong>{mSharedN}</strong> columns and{' '}
              <MathBlock latex={`B_{${mSharedN} \\times ${mColsB}}`} /> has{' '}
              <strong>{mSharedN}</strong> rows, the product{' '}
              <MathBlock latex={`(AB)_{${mRowsA} \\times ${mColsB}}`} /> exists.
            </p>
            {mulResult && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-x-auto">
                <p className="text-xs font-medium text-slate-500 mb-1">Final Result Matrix</p>
                <MathBlock latex={`AB = ${matrixToLatex(mulResult)}`} display />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============================================================
          5. DETERMINANT CALCULATOR
      ============================================================ */}
      {activeSim === 'determinant' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0F294A]">
                  5. Determinant Calculator (2 × 2)
                </h2>
                <p className="text-xs text-slate-500">
                  Enter four real numbers to inspect both diagonal products and singularity.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (detExIdx + 1) % DETERMINANT_EXAMPLES.length;
                    setDetExIdx(nextIdx);
                    setDetMat(DETERMINANT_EXAMPLES[nextIdx].map((r) => [...r]));
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0D9488] bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Another Example</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDetMat([
                      [4, 2],
                      [-1, 3],
                    ])
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-around gap-6 bg-slate-50 border border-slate-200 rounded-xl p-5">
              <MatrixEditor label="Enter 2×2 Matrix A" matrix={detMat} onChange={setDetMat} />

              {/* SVG Cross-Diagonal Highlight Diagram */}
              <svg
                viewBox="0 0 220 155"
                className="w-full max-w-[230px] h-auto bg-white border border-slate-200 rounded-xl"
                role="img"
                aria-label="Diagram highlighting main diagonal ad in teal and secondary diagonal bc in amber"
              >
                <text x="110" y="18" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0F294A">
                  Diagonal Products: ad − bc
                </text>
                {/* Main diagonal line a -> d */}
                <line x1="60" y1="52" x2="160" y2="112" stroke="#0D9488" strokeWidth="3" strokeOpacity="0.45" />
                {/* Secondary diagonal line b -> c */}
                <line x1="160" y1="52" x2="60" y2="112" stroke="#D97706" strokeWidth="3" strokeOpacity="0.45" />

                <circle cx="60" cy="52" r="18" fill="#CCFBF1" stroke="#0D9488" strokeWidth="1.5" />
                <text x="60" y="56" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="#0F294A">
                  {formatNum(detMat[0][0])}
                </text>

                <circle cx="160" cy="52" r="18" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
                <text x="160" y="56" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="#0F294A">
                  {formatNum(detMat[0][1])}
                </text>

                <circle cx="60" cy="112" r="18" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
                <text x="60" y="116" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="#0F294A">
                  {formatNum(detMat[1][0])}
                </text>

                <circle cx="160" cy="112" r="18" fill="#CCFBF1" stroke="#0D9488" strokeWidth="1.5" />
                <text x="160" y="116" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="#0F294A">
                  {formatNum(detMat[1][1])}
                </text>

                <text x="110" y="146" textAnchor="middle" fontSize="10" fill="#475569">
                  Teal: ad ({formatNum(detMainProd)}) · Amber: bc ({formatNum(detAntiProd)})
                </text>
              </svg>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-[#0F294A]">
              Step-by-Step Determinant
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
              <p className="text-xs font-medium text-slate-500">Formula</p>
              <MathBlock latex="|A| = \begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc" display />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1.5 text-sm">
              <p className="text-xs font-medium text-slate-500">Calculation</p>
              <p className="text-[#0F766E] font-medium">
                Main diagonal product (ad) = ({formatNum(detMat[0][0])})({formatNum(detMat[1][1])}) ={' '}
                <span className="font-mono-num">{formatNum(detMainProd)}</span>
              </p>
              <p className="text-amber-800 font-medium">
                Secondary diagonal product (bc) = ({formatNum(detMat[0][1])})(
                {formatNum(detMat[1][0])}) ={' '}
                <span className="font-mono-num">{formatNum(detAntiProd)}</span>
              </p>
              <MathBlock
                latex={`|A| = ${formatNum(detMainProd)} - (${formatNum(detAntiProd)}) = ${formatNum(
                  detA
                )}`}
                display
              />
            </div>

            <div
              className={`rounded-xl border p-4 ${
                Math.abs(detA) < 1e-10
                  ? 'border-amber-300 bg-amber-50 text-amber-950'
                  : 'border-teal-300 bg-teal-50 text-[#0F294A]'
              }`}
            >
              <p className="font-display text-sm font-bold">
                {Math.abs(detA) < 1e-10 ? 'Singular Matrix (|A| = 0)' : 'Non-Singular Matrix (|A| ≠ 0)'}
              </p>
              <p className="text-xs mt-1 leading-relaxed">
                {Math.abs(detA) < 1e-10
                  ? 'Because the determinant equals 0, this matrix is singular and has no multiplicative inverse.'
                  : 'Because the determinant is non-zero, this matrix is non-singular and its multiplicative inverse exists.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          6. INVERSE MATRIX SIMULATOR
      ============================================================ */}
      {activeSim === 'inverse' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0F294A]">
                  6. Inverse Matrix Simulator (2 × 2)
                </h2>
                <p className="text-xs text-slate-500">
                  Computes determinant, adjoint, and multiplicative inverse A⁻¹ if |A| ≠ 0.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (invExIdx + 1) % INVERSE_EXAMPLES.length;
                    setInvExIdx(nextIdx);
                    setInvMat(INVERSE_EXAMPLES[nextIdx].map((r) => [...r]));
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0D9488] bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Another Example</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setInvMat([
                      [3, 1],
                      [1, 2],
                    ])
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl p-6 gap-4">
              <MatrixEditor label="Matrix A (2×2)" matrix={invMat} onChange={setInvMat} />
              <div className="w-full bg-white border border-slate-200 rounded-lg p-3 text-center">
                <MathBlock latex="A^{-1} = \frac{1}{|A|} \operatorname{Adj}(A)" display />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs text-slate-700">
              <p className="font-semibold text-[#0F294A]">How Adjoint is Formed:</p>
              <p>
                Swap the main diagonal entries ({formatNum(invMat[0][0])} ↔ {formatNum(invMat[1][1])})
                and reverse the signs of the other two entries ({formatNum(invMat[0][1])} →{' '}
                {formatNum(-invMat[0][1])}, {formatNum(invMat[1][0])} → {formatNum(-invMat[1][0])}).
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-[#0F294A]">
              Inverse Computation Results
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-xs font-medium text-slate-500">Step 1: Determinant |A|</p>
                <MathBlock
                  latex={`|A| = (${formatNum(invMat[0][0])})(${formatNum(
                    invMat[1][1]
                  )}) - (${formatNum(invMat[0][1])})(${formatNum(invMat[1][0])}) = ${formatNum(
                    invRes.determinant
                  )}`}
                  display
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-xs font-medium text-slate-500">Step 2: Adjoint Matrix</p>
                <MathBlock latex={`\\operatorname{Adj}(A) = ${matrixToLatex(invRes.adjoint)}`} display />
              </div>
            </div>

            {invRes.isSingular ? (
              <div
                role="alert"
                className="bg-rose-50 border border-rose-300 rounded-xl p-5 space-y-2 text-rose-950"
              >
                <div className="flex items-center gap-2 font-display text-sm font-bold text-rose-800">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <span>Error: Multiplicative Inverse Does Not Exist</span>
                </div>
                <p className="text-sm leading-relaxed">
                  Since <MathBlock latex="|A| = 0" />, the matrix is <strong>singular</strong>.
                  Division by zero in <MathBlock latex="\frac{1}{|A|}\operatorname{Adj}(A)" /> is
                  undefined, so <MathBlock latex="A^{-1}" /> cannot be computed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 space-y-1">
                  <p className="text-xs font-semibold text-[#0F766E]">
                    Step 3: Multiplicative Inverse A⁻¹
                  </p>
                  <MathBlock
                    latex={`A^{-1} = \\frac{1}{${formatNum(invRes.determinant)}} ${matrixToLatex(
                      invRes.adjoint
                    )} = ${invRes.inverseLatex ?? ''}`}
                    display
                  />
                </div>

                {invCheck && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-[#0F294A] mb-1">
                      Verification Check (A · A⁻¹ = I₂)
                    </p>
                    <MathBlock
                      latex={`A \\cdot A^{-1} = ${matrixToLatex(invCheck)} = I_2`}
                      display
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============================================================
          7. CRAMER'S RULE EXPLORER
      ============================================================ */}
      {activeSim === 'cramer' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0F294A]">
                  7. Cramer&apos;s Rule Explorer
                </h2>
                <p className="text-xs text-slate-500">
                  Solve two simultaneous equations using determinants D, Dₓ, and Dᵧ with live
                  verification.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (cramerExIdx + 1) % CRAMER_EXAMPLES.length;
                    setCramerExIdx(nextIdx);
                    setCramer({ ...CRAMER_EXAMPLES[nextIdx] });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0D9488] bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Another Example</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCramer({ a1: 2, b1: 1, c1: 5, a2: 1, b2: -1, c2: 1 })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Equation Inputs */}
            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
              {(
                [
                  { label: 'Eq 1:', aKey: 'a1', bKey: 'b1', cKey: 'c1' },
                  { label: 'Eq 2:', aKey: 'a2', bKey: 'b2', cKey: 'c2' },
                ] as const
              ).map((row) => (
                <div key={row.label} className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-mono-num text-xs font-semibold text-slate-500 w-10">
                    {row.label}
                  </span>
                  <input
                    type="number"
                    step="1"
                    aria-label={`${row.label} coefficient of x`}
                    value={cramer[row.aKey]}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!Number.isNaN(val)) setCramer((s) => ({ ...s, [row.aKey]: val }));
                    }}
                    className="w-16 min-h-[40px] rounded border border-slate-300 bg-white px-2 py-1 text-center font-mono-num"
                  />
                  <span>x +</span>
                  <input
                    type="number"
                    step="1"
                    aria-label={`${row.label} coefficient of y`}
                    value={cramer[row.bKey]}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!Number.isNaN(val)) setCramer((s) => ({ ...s, [row.bKey]: val }));
                    }}
                    className="w-16 min-h-[40px] rounded border border-slate-300 bg-white px-2 py-1 text-center font-mono-num"
                  />
                  <span>y =</span>
                  <input
                    type="number"
                    step="1"
                    aria-label={`${row.label} constant term`}
                    value={cramer[row.cKey]}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!Number.isNaN(val)) setCramer((s) => ({ ...s, [row.cKey]: val }));
                    }}
                    className="w-16 min-h-[40px] rounded border border-slate-300 bg-white px-2 py-1 text-center font-mono-num"
                  />
                </div>
              ))}
            </div>

            {/* SVG Intersecting Lines Graph */}
            {(() => {
              const range = 8;
              const size = 260;
              const pad = 20;
              const toPx = (x: number, y: number): [number, number] => [
                size / 2 + (x / range) * (size / 2 - pad),
                size / 2 - (y / range) * (size / 2 - pad),
              ];
              const linePts = (a: number, b: number, c: number) => {
                if (Math.abs(b) > 1e-6) {
                  return [toPx(-range, (c - a * -range) / b), toPx(range, (c - a * range) / b)];
                }
                if (Math.abs(a) > 1e-6) {
                  return [toPx(c / a, -range), toPx(c / a, range)];
                }
                return null;
              };
              const l1 = linePts(cramer.a1, cramer.b1, cramer.c1);
              const l2 = linePts(cramer.a2, cramer.b2, cramer.c2);
              const inter =
                cramerRes.x !== null && cramerRes.y !== null
                  ? toPx(cramerRes.x, cramerRes.y)
                  : null;
              const interInBounds =
                cramerRes.x !== null &&
                cramerRes.y !== null &&
                Math.abs(cramerRes.x) <= range &&
                Math.abs(cramerRes.y) <= range;

              return (
                <div className="flex flex-col items-center gap-2">
                  <svg
                    viewBox="0 0 260 260"
                    className="w-full max-w-[260px] h-auto border border-slate-200 rounded-xl bg-white"
                    role="img"
                    aria-label="Coordinate plane showing both equations and intersection point"
                  >
                    <line x1="10" y1="130" x2="250" y2="130" stroke="#CBD5E1" strokeWidth="1" />
                    <line x1="130" y1="10" x2="130" y2="250" stroke="#CBD5E1" strokeWidth="1" />
                    {l1 && (
                      <line
                        x1={l1[0][0]}
                        y1={l1[0][1]}
                        x2={l1[1][0]}
                        y2={l1[1][1]}
                        stroke="#0F294A"
                        strokeWidth="2.5"
                      />
                    )}
                    {l2 && (
                      <line
                        x1={l2[0][0]}
                        y1={l2[0][1]}
                        x2={l2[1][0]}
                        y2={l2[1][1]}
                        stroke="#0D9488"
                        strokeWidth="2.5"
                      />
                    )}
                    {inter && interInBounds && (
                      <g>
                        <circle cx={inter[0]} cy={inter[1]} r="5" fill="#DC2626" />
                        <text
                          x={Math.min(185, Math.max(15, inter[0] + 8))}
                          y={Math.max(20, inter[1] - 8)}
                          fill="#0F294A"
                          fontSize="11"
                          fontWeight="600"
                        >
                          ({formatNum(cramerRes.x!)}, {formatNum(cramerRes.y!)})
                        </text>
                      </g>
                    )}
                    <text x="12" y="20" fill="#0F294A" fontSize="10" fontWeight="600">
                      Navy: Eq 1 · Teal: Eq 2
                    </text>
                  </svg>
                  {inter && !interInBounds && (
                    <p className="text-xs text-slate-600 text-center">
                      Intersection ({formatNum(cramerRes.x!)}, {formatNum(cramerRes.y!)}) lies outside
                      the [−8, 8] graph window.
                    </p>
                  )}
                </div>
              );
            })()}
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-[#0F294A]">
              Step-by-Step Determinants & Verification
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 overflow-x-auto">
              <p className="text-xs font-semibold text-[#0F294A]">
                Step 1: Compute D, Dₓ, and Dᵧ
              </p>
              <MathBlock
                latex={`D = ${determinantToLatex(cramerRes.A)} = ${formatNum(cramerRes.detA)}`}
                display
              />
              <MathBlock
                latex={`D_x = ${determinantToLatex(cramerRes.Ax)} = ${formatNum(cramerRes.detAx)}`}
                display
              />
              <MathBlock
                latex={`D_y = ${determinantToLatex(cramerRes.Ay)} = ${formatNum(cramerRes.detAy)}`}
                display
              />
            </div>

            {cramerRes.isSingular ? (
              <div
                role="alert"
                className="bg-rose-50 border border-rose-300 rounded-xl p-4 text-sm text-rose-950 space-y-1"
              >
                <p className="font-bold text-rose-800">
                  D = 0 — No Unique Solution Exists
                </p>
                <p>
                  Because <MathBlock latex="D = 0" />, Cramer&apos;s Rule cannot divide by zero. The
                  two lines are parallel or identical.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 space-y-1 overflow-x-auto">
                  <p className="text-xs font-semibold text-[#0F766E]">
                    Step 2: Solve for x and y
                  </p>
                  <MathBlock
                    latex={`x = \\frac{D_x}{D} = \\frac{${formatNum(cramerRes.detAx)}}{${formatNum(
                      cramerRes.detA
                    )}} = ${cramerRes.xLatex}, \\qquad y = \\frac{D_y}{D} = \\frac{${formatNum(
                      cramerRes.detAy
                    )}}{${formatNum(cramerRes.detA)}} = ${cramerRes.yLatex}`}
                    display
                  />
                </div>

                {cramerCheck && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-sm">
                    <p className="text-xs font-semibold text-[#0F294A]">
                      Step 3: Substitute Back into Original Equations to Verify
                    </p>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488] mt-0.5 shrink-0" />
                      <RichMathText
                        text={`Eq 1: $(${formatNum(cramer.a1)})(${cramerRes.xLatex}) + (${formatNum(
                          cramer.b1
                        )})(${cramerRes.yLatex}) = ${formatNum(cramerCheck.eq1Lhs)} = ${formatNum(
                          cramerCheck.eq1Rhs
                        )}$ (${cramerCheck.eq1Verified ? 'Verified' : 'Mismatch'})`}
                      />
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488] mt-0.5 shrink-0" />
                      <RichMathText
                        text={`Eq 2: $(${formatNum(cramer.a2)})(${cramerRes.xLatex}) + (${formatNum(
                          cramer.b2
                        )})(${cramerRes.yLatex}) = ${formatNum(cramerCheck.eq2Lhs)} = ${formatNum(
                          cramerCheck.eq2Rhs
                        )}$ (${cramerCheck.eq2Verified ? 'Verified' : 'Mismatch'})`}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
