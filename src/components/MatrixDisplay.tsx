import React, { useEffect, useRef, useState } from 'react';
import type { Matrix } from '../utils/matrixMath';
import { formatNum } from '../utils/matrixMath';

interface MatrixDisplayProps {
  matrix: Matrix;
  label?: string;
  isDeterminant?: boolean;
  highlightRow?: number | null;
  highlightCol?: number | null;
  highlightCell?: [number, number] | null;
  highlightMainDiag?: boolean;
  highlightAntiDiag?: boolean;
  onCellClick?: (r: number, c: number) => void;
  compact?: boolean;
}

export const MatrixDisplay: React.FC<MatrixDisplayProps> = ({
  matrix,
  label,
  isDeterminant = false,
  highlightRow = null,
  highlightCol = null,
  highlightCell = null,
  highlightMainDiag = false,
  highlightAntiDiag = false,
  onCellClick,
  compact = false,
}) => {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;

  return (
    <div className="inline-flex items-center gap-2.5 max-w-full">
      {label && (
        <span className="font-display text-sm font-semibold text-[#0F294A] shrink-0">
          {label} =
        </span>
      )}
      <div
        className={`relative inline-grid px-2.5 py-1.5 ${
          isDeterminant
            ? 'border-x-2 border-slate-800'
            : 'border-x-2 border-slate-800 rounded-sm'
        }`}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(${compact ? '2rem' : '2.75rem'}, auto))`,
          gap: compact ? '0.25rem' : '0.35rem',
        }}
      >
        {!isDeterminant && (
          <>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 h-1.5 w-1.5 border-t-2 border-slate-800"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 bottom-0 h-1.5 w-1.5 border-b-2 border-slate-800"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 h-1.5 w-1.5 border-t-2 border-slate-800"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-0 h-1.5 w-1.5 border-b-2 border-slate-800"
            />
          </>
        )}

        {matrix.map((row, rIdx) =>
          row.map((val, cIdx) => {
            const isCell =
              highlightCell !== null && highlightCell[0] === rIdx && highlightCell[1] === cIdx;
            const isRow = highlightRow === rIdx;
            const isCol = highlightCol === cIdx;
            const isMainDiag = highlightMainDiag && rIdx === cIdx;
            const isAntiDiag = highlightAntiDiag && rIdx + cIdx === rows - 1 && rows === cols;

            let cellBg = 'text-slate-900';
            if (isCell) {
              cellBg = 'bg-[#0D9488] text-white font-semibold';
            } else if (isMainDiag) {
              cellBg = 'bg-teal-100 text-[#0F294A] font-semibold ring-1 ring-[#0D9488]';
            } else if (isAntiDiag) {
              cellBg = 'bg-amber-100 text-amber-950 font-semibold ring-1 ring-amber-400';
            } else if (isRow && isCol) {
              cellBg = 'bg-[#0F294A] text-white font-semibold';
            } else if (isRow) {
              cellBg = 'bg-teal-50 text-[#0F294A] font-medium ring-1 ring-teal-300';
            } else if (isCol) {
              cellBg = 'bg-sky-50 text-[#0F294A] font-medium ring-1 ring-sky-300';
            }

            if (onCellClick) {
              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  type="button"
                  onClick={() => onCellClick(rIdx, cIdx)}
                  className={`flex items-center justify-center rounded px-1.5 py-1 font-mono-num text-sm transition-colors hover:ring-1 hover:ring-[#0D9488] ${cellBg}`}
                >
                  {formatNum(val)}
                </button>
              );
            }

            return (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`flex items-center justify-center rounded px-1.5 py-1 font-mono-num text-sm transition-colors ${cellBg}`}
              >
                {formatNum(val)}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

interface MatrixEditorProps {
  matrix: Matrix;
  onChange: (next: Matrix) => void;
  label?: string;
  min?: number;
  max?: number;
  highlightRow?: number | null;
  highlightCol?: number | null;
  highlightCell?: [number, number] | null;
  onCellFocus?: (r: number, c: number) => void;
}

export const MatrixEditor: React.FC<MatrixEditorProps> = ({
  matrix,
  onChange,
  label,
  min = -50,
  max = 50,
  highlightRow = null,
  highlightCol = null,
  highlightCell = null,
  onCellFocus,
}) => {
  const cols = matrix[0]?.length ?? 0;
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  const lastEmittedRef = useRef<Matrix | null>(null);

  useEffect(() => {
    if (matrix === lastEmittedRef.current) {
      return;
    }
    setDrafts({});
    setValidationMsg(null);
  }, [matrix]);

  const handleCellChange = (r: number, c: number, raw: string) => {
    const key = `${r}-${c}`;
    setDrafts((prev) => ({ ...prev, [key]: raw }));

    if (raw === '' || raw === '-' || raw === '.' || raw === '-.') {
      setValidationMsg(null);
      return;
    }

    const parsed = Number(raw);
    if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
      setValidationMsg('Enter a valid real number.');
      return;
    }

    if (parsed < min || parsed > max) {
      setValidationMsg(`Allowed range is ${min} to ${max}.`);
      return;
    }

    setValidationMsg(null);
    const next = matrix.map((row, rIdx) =>
      row.map((v, cIdx) => (rIdx === r && cIdx === c ? parsed : v))
    );
    lastEmittedRef.current = next;
    onChange(next);
  };

  const handleCellBlur = (r: number, c: number) => {
    const key = `${r}-${c}`;
    if (drafts[key] === undefined) return;
    setDrafts((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setValidationMsg(null);
  };

  return (
    <div className="inline-flex flex-col gap-1.5 max-w-full">
      {label && <span className="text-xs font-medium text-slate-600">{label}</span>}
      <div className="relative inline-flex items-center border-x-2 border-[#0F294A] px-2.5 py-2 rounded-sm bg-white">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-t-2 border-[#0F294A]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 bottom-0 h-2 w-2 border-b-2 border-[#0F294A]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-t-2 border-[#0F294A]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 h-2 w-2 border-b-2 border-[#0F294A]"
        />

        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(2.85rem, 3.6rem))` }}
        >
          {matrix.map((row, rIdx) =>
            row.map((val, cIdx) => {
              const key = `${rIdx}-${cIdx}`;
              const displayVal = drafts[key] !== undefined ? drafts[key] : String(val);
              const isCellHighlighted =
                highlightCell !== null && highlightCell[0] === rIdx && highlightCell[1] === cIdx;
              const isHighlighted = highlightRow === rIdx || highlightCol === cIdx;

              let inputStyle = 'border-slate-300 bg-slate-50 text-slate-900';
              if (isCellHighlighted) {
                inputStyle = 'border-[#0D9488] bg-teal-100 font-semibold text-[#0F294A] ring-1 ring-[#0D9488]';
              } else if (isHighlighted) {
                inputStyle = 'border-[#0D9488] bg-teal-50 font-semibold text-[#0F294A]';
              }

              return (
                <input
                  key={key}
                  type="text"
                  inputMode="decimal"
                  aria-label={`${label ?? 'Matrix'} row ${rIdx + 1} column ${cIdx + 1}`}
                  value={displayVal}
                  onFocus={() => onCellFocus?.(rIdx, cIdx)}
                  onBlur={() => handleCellBlur(rIdx, cIdx)}
                  onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                  className={`w-full min-h-[40px] rounded border px-1.5 py-1.5 text-center font-mono-num text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] ${inputStyle}`}
                />
              );
            })
          )}
        </div>
      </div>
      {validationMsg && (
        <span role="alert" className="text-xs font-medium text-rose-700">
          {validationMsg}
        </span>
      )}
    </div>
  );
};
