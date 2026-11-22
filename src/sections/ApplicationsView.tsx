import { CheckCircle2, Circle, HelpCircle, Lightbulb, RotateCcw, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { MathBlock, RichMathText } from '../components/MathBlock';
import {
  REAL_LIFE_ACTIVITIES,
  type RealLifeActivityId,
  THINK_BEYOND_TOPICS,
} from '../data/realLifeActivities';
import type { StudentProgress } from '../types/curriculum';
import { matrixToLatex, multiplyMatrices } from '../utils/matrixMath';

interface ApplicationsViewProps {
  progress: StudentProgress;
  onMarkSolved: (activityId: string) => void;
}

const BASE_PIXELS = [
  [20, 60, 60, 20],
  [60, 140, 140, 60],
  [60, 140, 140, 60],
  [20, 60, 60, 20],
];

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  progress,
  onMarkSolved,
}) => {
  const [activeId, setActiveId] = useState<RealLifeActivityId>('attendance');

  // Challenge inputs & evaluation state per activity
  const [challengeInputs, setChallengeInputs] = useState<Record<string, string>>({});
  const [challengeChecked, setChallengeChecked] = useState<
    Record<string, 'correct' | 'incorrect'>
  >({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});

  // Interactive Shopping Cost Sandbox (for Activity 4)
  const [shopQty, setShopQty] = useState({
    zainBooks: 4,
    zainPens: 3,
    omarBooks: 6,
    omarPens: 2,
    priceBook: 150,
    pricePen: 40,
  });

  // Interactive Pixel Grid for "Think Beyond the Textbook: Computer Graphics"
  const [brightnessScale, setBrightnessScale] = useState(1.2);
  const [brightnessShift, setBrightnessShift] = useState(10);

  const activity =
    REAL_LIFE_ACTIVITIES.find((a) => a.id === activeId) ?? REAL_LIFE_ACTIVITIES[0];

  const handleCheckChallenge = () => {
    const allCorrect = activity.challenge.answerFields.every((field) => {
      const raw = (challengeInputs[`${activity.id}:${field.key}`] ?? '').trim();
      const num = Number(raw);
      return raw !== '' && Number.isFinite(num) && Math.abs(num - field.expected) < 1e-4;
    });

    setChallengeChecked((prev) => ({
      ...prev,
      [activity.id]: allCorrect ? 'correct' : 'incorrect',
    }));
    if (allCorrect) {
      onMarkSolved(activity.id);
    }
  };

  const handleResetChallenge = () => {
    setChallengeChecked((prev) => {
      const next = { ...prev };
      delete next[activity.id];
      return next;
    });
    setChallengeInputs((prev) => {
      const next = { ...prev };
      activity.challenge.answerFields.forEach((f) => {
        delete next[`${activity.id}:${f.key}`];
      });
      return next;
    });
  };

  // Shopping sandbox matrix multiplication
  const Q = [
    [shopQty.zainBooks, shopQty.zainPens],
    [shopQty.omarBooks, shopQty.omarPens],
  ];
  const P = [[shopQty.priceBook], [shopQty.pricePen]];
  const C = multiplyMatrices(Q, P) ?? [[0], [0]];

  // Pixel matrix adjustment (Grade 9 scalar multiplication + addition)
  const adjustedPixels = BASE_PIXELS.map((row) =>
    row.map((val) =>
      Math.max(0, Math.min(255, Math.round(val * brightnessScale + brightnessShift)))
    )
  );

  const canCheckChallenge = activity.challenge.answerFields.every((field) => {
    const raw = (challengeInputs[`${activity.id}:${field.key}`] ?? '').trim();
    return raw !== '' && Number.isFinite(Number(raw));
  });
  const challengeStatus = challengeChecked[activity.id];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-[#0D9488]">
          Module 09 · Real-Life Mathematics for Grade 9
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F294A] mt-1">
          Real-life Applications
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          See how matrices and determinants solve everyday school, shopping, and problem-solving
          situations using Grade 9 mathematics.
        </p>
      </div>

      {/* 5 Contextual Activity Selector */}
      <div className="space-y-6">
        <div
          role="tablist"
          aria-label="Five real-life mathematical activities"
          className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl"
        >
          {REAL_LIFE_ACTIVITIES.map((act) => {
            const isActive = act.id === activeId;
            const isSolved = progress.applicationsSolved.includes(act.id);
            return (
              <button
                key={act.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActiveId(act.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                  isActive
                    ? 'bg-white text-[#0F294A] shadow-sm'
                    : 'text-slate-600 hover:text-[#0F294A]'
                }`}
              >
                {isSolved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488]" aria-hidden="true" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                )}
                <span>{act.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Active Contextual Activity Workspace */}
        <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          {/* Title & Syllabus Link */}
          <div className="border-b border-slate-100 pb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#0F766E]">
                Activity {activity.number} · {activity.syllabusLink}
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0F294A] mt-1">
                {activity.title}
              </h2>
            </div>
            {progress.applicationsSolved.includes(activity.id) && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E]">
                <CheckCircle2 className="w-4 h-4 text-[#0D9488]" aria-hidden="true" />
                <span>Challenge Solved</span>
              </span>
            )}
          </div>

          {/* 1. Realistic Scenario & Clear Mathematical Problem */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-1.5">
              <h3 className="font-display text-sm font-bold text-[#0F294A]">Realistic Scenario</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                <RichMathText text={activity.scenario} />
              </p>
            </div>
            <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-5 space-y-1.5">
              <h3 className="font-display text-sm font-bold text-[#0F766E]">
                Mathematical Problem
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed">
                <RichMathText text={activity.problemStatement} />
              </p>
            </div>
          </div>

          {/* 2. Data Presented in Tables */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-[#0F294A]">
              Organized Data Tables
            </h3>
            <div
              className={`grid grid-cols-1 ${
                activity.tables.length > 1 ? 'md:grid-cols-2' : ''
              } gap-4`}
            >
              {activity.tables.map((tbl) => (
                <div
                  key={tbl.caption}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white"
                >
                  <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#0F294A]">
                    {tbl.caption}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="border-b border-slate-200 text-xs text-slate-600 bg-slate-50/50">
                        <tr>
                          {tbl.headers.map((h) => (
                            <th key={h} className="px-4 py-2 font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {tbl.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`px-4 py-2 ${
                                  cIdx === 0
                                    ? 'font-medium text-[#0F294A]'
                                    : 'font-mono-num text-slate-700 tabular-nums'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Try-It Calculator for Activity 4 (Shopping & Cost) */}
          {activity.id === 'shopping-cost' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-sm font-bold text-[#0F294A]">
                    Interactive Cost Matrix Calculator (Try Your Own Numbers)
                  </h3>
                  <p className="text-xs text-slate-600">
                    Adjust quantities or prices to see how <MathBlock latex="Q \cdot P" /> updates
                    both bills immediately.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                {(
                  [
                    ['zainBooks', 'Zain Notebooks'],
                    ['zainPens', 'Zain Pens'],
                    ['omarBooks', 'Omar Notebooks'],
                    ['omarPens', 'Omar Pens'],
                    ['priceBook', 'Notebook Price'],
                    ['pricePen', 'Pen Price'],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="font-medium text-slate-700">
                    {label}
                    <input
                      type="number"
                      min={0}
                      max={1000}
                      value={shopQty[key]}
                      onChange={(e) =>
                        setShopQty((prev) => ({
                          ...prev,
                          [key]: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                      className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 font-mono-num"
                    />
                  </label>
                ))}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 overflow-x-auto">
                <MathBlock
                  latex={`Q \\cdot P = ${matrixToLatex(Q)} ${matrixToLatex(P)} = ${matrixToLatex(
                    C
                  )} \\implies \\text{Zain: PKR } ${C[0][0]}, \\; \\text{Omar: PKR } ${C[1][0]}`}
                  display
                />
              </div>
            </div>
          )}

          {/* 3. Step-by-Step Solution */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-[#0F294A]">
              Step-by-Step Solution
            </h3>
            <div className="space-y-3">
              {activity.solutionSteps.map((step) => (
                <div
                  key={step.label}
                  className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-2"
                >
                  <p className="text-xs font-bold text-[#0F294A]">{step.label}</p>
                  <p className="text-xs sm:text-sm text-slate-700">
                    <RichMathText text={step.explanation} />
                  </p>
                  <div className="bg-white border border-slate-200 rounded-lg p-3 overflow-x-auto">
                    <MathBlock latex={step.latex} display />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Mathematical Concept Explanation */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-1.5">
            <h3 className="font-display text-sm font-bold text-[#0F294A]">
              Mathematical Concept Involved
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              <RichMathText text={activity.conceptExplanation} />
            </p>
          </div>

          {/* 5. Independent Student Challenge */}
          <div className="border border-teal-200 bg-teal-50/40 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-bold text-[#0F294A]">
                Independent Student Challenge
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowHint((prev) => ({ ...prev, [activity.id]: !prev[activity.id] }))
                  }
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#0D9488] hover:text-[#0F766E]"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint[activity.id] ? 'Hide Hint' : 'Show Hint'}</span>
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed">
              <RichMathText text={activity.challenge.prompt} />
            </p>

            {activity.challenge.dataTable && (
              <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white max-w-xl">
                <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 text-xs font-semibold text-[#0F294A]">
                  {activity.challenge.dataTable.caption}
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 text-slate-600">
                    <tr>
                      {activity.challenge.dataTable.headers.map((h) => (
                        <th key={h} className="px-3 py-2 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activity.challenge.dataTable.rows.map((r, idx) => (
                      <tr key={idx}>
                        {r.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`px-3 py-2 ${
                              cIdx === 0 ? 'font-medium text-[#0F294A]' : 'font-mono-num'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {showHint[activity.id] && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-amber-950">
                <strong>Hint: </strong>
                <RichMathText text={activity.challenge.hint} />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activity.challenge.answerFields.map((field) => {
                const inputKey = `${activity.id}:${field.key}`;
                return (
                  <label key={field.key} className="block text-xs font-medium text-[#0F294A]">
                    {field.label} {field.unit ? `(${field.unit})` : ''}
                    <input
                      type="number"
                      placeholder="Enter number..."
                      value={challengeInputs[inputKey] ?? ''}
                      onChange={(e) =>
                        setChallengeInputs((prev) => ({
                          ...prev,
                          [inputKey]: e.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono-num text-sm text-[#0F294A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                    />
                  </label>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={!canCheckChallenge}
                onClick={handleCheckChallenge}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                  canCheckChallenge
                    ? 'bg-[#0F294A] text-white hover:bg-[#163864]'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              >
                Check Challenge Answer
              </button>
              <button
                type="button"
                onClick={() =>
                  setShowSolution((prev) => ({ ...prev, [activity.id]: !prev[activity.id] }))
                }
                className="px-3.5 py-2 text-xs font-medium text-[#0F294A] bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                {showSolution[activity.id] ? 'Hide Worked Solution' : 'View Worked Solution'}
              </button>
              {challengeStatus && (
                <button
                  type="button"
                  onClick={handleResetChallenge}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#0F294A]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {challengeStatus === 'correct' && (
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0F766E]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Well done! Both answers match the matrix solution accurately.</span>
              </div>
            )}

            {challengeStatus === 'incorrect' && (
              <div className="flex items-center gap-2 text-sm font-semibold text-rose-700">
                <XCircle className="w-4 h-4" />
                <span>Not quite yet—check the Hint or Worked Solution and try again.</span>
              </div>
            )}

            {showSolution[activity.id] && (
              <div className="bg-white border border-slate-200 rounded-lg p-4 overflow-x-auto">
                <p className="text-xs font-semibold text-[#0F766E] mb-1">Worked Solution:</p>
                <MathBlock latex={activity.challenge.workedSolutionLatex} display />
              </div>
            )}
          </div>
        </article>
      </div>

      {/* ============================================================
          THINK BEYOND THE TEXTBOOK
      ============================================================ */}
      <section className="space-y-6 border-t border-slate-200 pt-8">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-[#0D9488]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#0D9488]">
              Conceptual Connections · Simple Grade 9 Perspective
            </p>
            <h2 className="font-display text-2xl font-bold text-[#0F294A] mt-0.5">
              THINK BEYOND THE TEXTBOOK
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Explore how the exact ideas from Exercises 1.1 to 1.6 work behind the scenes in
              everyday life.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {THINK_BEYOND_TOPICS.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <p className="text-xs font-medium text-[#0D9488]">{item.unit1Connection}</p>
                <h3 className="font-display text-lg font-bold text-[#0F294A]">{item.question}</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{item.simpleAnswer}</p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700">
                  <strong className="text-[#0F294A]">Everyday Example: </strong>
                  {item.dailyExample}
                </div>
              </div>

              {/* Simple Interactive Visual for Computer Graphics Card */}
              {item.id === 'graphics' && (
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <p className="text-xs font-semibold text-[#0F294A]">
                    Try Adjusting a 4×4 Pixel Matrix (<MathBlock latex="B = kA + C" />)
                  </p>
                  <div className="flex flex-wrap items-center gap-5">
                    <svg
                      viewBox="0 0 120 120"
                      className="w-24 h-24 border border-slate-300 rounded shrink-0"
                      role="img"
                      aria-label="4 by 4 grayscale pixel matrix preview"
                    >
                      {adjustedPixels.map((row, r) =>
                        row.map((val, c) => (
                          <rect
                            key={`${r}-${c}`}
                            x={c * 30}
                            y={r * 30}
                            width="30"
                            height="30"
                            fill={`rgb(${val},${val},${val})`}
                          />
                        ))
                      )}
                    </svg>
                    <div className="flex-1 min-w-[180px] space-y-2 text-xs">
                      <label className="block text-slate-700">
                        Scalar Multiply (k = {brightnessScale.toFixed(1)})
                        <input
                          type="range"
                          min={0.5}
                          max={2.0}
                          step={0.1}
                          value={brightnessScale}
                          onChange={(e) => setBrightnessScale(Number(e.target.value))}
                          className="w-full mt-1 accent-[#0D9488]"
                        />
                      </label>
                      <label className="block text-slate-700">
                        Add Constant Brightness (+{brightnessShift})
                        <input
                          type="range"
                          min={0}
                          max={80}
                          step={5}
                          value={brightnessShift}
                          onChange={(e) => setBrightnessShift(Number(e.target.value))}
                          className="w-full mt-1 accent-[#0D9488]"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
