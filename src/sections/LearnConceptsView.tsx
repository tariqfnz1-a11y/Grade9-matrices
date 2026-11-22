import { CheckCircle2, Circle, ChevronRight, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MathBlock, RichMathText } from '../components/MathBlock';
import { CONCEPT_LESSONS } from '../data/unit1Content';
import type { SectionId, StudentProgress, TopicId } from '../types/curriculum';

interface LearnConceptsViewProps {
  progress: StudentProgress;
  initialTopic?: TopicId;
  onSelectTopic?: (topicId: TopicId) => void;
  onToggleLessonCompleted: (topicId: TopicId) => void;
  onNavigate: (section: SectionId) => void;
}

export const LearnConceptsView: React.FC<LearnConceptsViewProps> = ({
  progress,
  initialTopic,
  onSelectTopic,
  onToggleLessonCompleted,
  onNavigate,
}) => {
  const [activeTopicId, setActiveTopicId] = useState<TopicId>(initialTopic ?? 'order-equality');

  useEffect(() => {
    if (initialTopic) {
      setActiveTopicId(initialTopic);
    }
  }, [initialTopic]);

  const [quickCheckAnswer, setQuickCheckAnswer] = useState<Record<TopicId, number | null>>({
    'order-equality': null,
    'types-transpose': null,
    'add-sub': null,
    multiplication: null,
    'determinant-inverse': null,
    'linear-systems': null,
  });

  // Interactive SVG state for 1.1 Row/Column order explorer
  const [svgRows, setSvgRows] = useState(2);
  const [svgCols, setSvgCols] = useState(3);

  const lesson = CONCEPT_LESSONS.find((l) => l.id === activeTopicId) ?? CONCEPT_LESSONS[0];
  const isCompleted = progress.completedLessons.includes(lesson.id);
  const selectedCheck = quickCheckAnswer[lesson.id];

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-[#0D9488]">Module 03 · Syllabus Textbook Lessons</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F294A] mt-1">
          Learn Concepts
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Structured definitions, laws, visual diagrams, and quick-checks for Exercises 1.1 to 1.6.
        </p>
      </div>

      {/* Topic Selector Segmented Tabs */}
      <div
        role="tablist"
        aria-label="Unit 1 syllabus lessons"
        className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl"
      >
        {CONCEPT_LESSONS.map((item) => {
          const active = item.id === activeTopicId;
          const done = progress.completedLessons.includes(item.id);
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => {
                setActiveTopicId(item.id);
                onSelectTopic?.(item.id);
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                active
                  ? 'bg-white text-[#0F294A] shadow-sm'
                  : 'text-slate-600 hover:text-[#0F294A]'
              }`}
            >
              {done ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488]" aria-hidden="true" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              )}
              <span>{item.exerciseRef}</span>
            </button>
          );
        })}
      </div>

      {/* Lesson Header Card */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {lesson.exerciseRef} · Punjab Textbook Board
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0F294A] mt-1">
              {lesson.title}
            </h2>
            <p className="text-sm text-slate-600 mt-1">{lesson.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={() => onToggleLessonCompleted(lesson.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              isCompleted
                ? 'bg-teal-50 text-[#0F766E] border border-teal-300'
                : 'bg-[#0F294A] text-white hover:bg-[#163864]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Lesson Completed' : 'Mark as Completed'}</span>
          </button>
        </div>

        {/* Learning Objectives */}
        <div>
          <h3 className="font-display text-sm font-semibold text-[#0F294A] mb-2">
            Learning Objectives
          </h3>
          <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
            {lesson.learningObjectives.map((obj, idx) => (
              <li key={idx}>{obj}</li>
            ))}
          </ul>
        </div>

        {/* Contextual Interactive SVG Visual for Lesson 1.1 */}
        {lesson.id === 'order-equality' && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 flex flex-col items-center">
              <svg
                viewBox="0 0 340 190"
                className="w-full max-w-[340px] h-auto"
                role="img"
                aria-label={`Interactive matrix grid showing ${svgRows} rows and ${svgCols} columns`}
              >
                <text x="170" y="20" textAnchor="middle" fill="#0F294A" fontSize="12" fontWeight="600">
                  Visualizing Order: {svgRows}-by-{svgCols} ({svgRows * svgCols} entries)
                </text>
                {/* Brackets */}
                <path d="M 65 36 L 55 36 L 55 168 L 65 168" fill="none" stroke="#0F294A" strokeWidth="2.5" />
                <path d="M 275 36 L 285 36 L 285 168 L 275 168" fill="none" stroke="#0F294A" strokeWidth="2.5" />
                {Array.from({ length: svgRows }).map((_, r) =>
                  Array.from({ length: svgCols }).map((__, c) => {
                    const cellW = 200 / svgCols;
                    const cellH = 116 / svgRows;
                    const x = 70 + c * cellW + 4;
                    const y = 44 + r * cellH + 4;
                    return (
                      <g key={`${r}-${c}`}>
                        <rect
                          x={x}
                          y={y}
                          width={cellW - 8}
                          height={cellH - 8}
                          rx="4"
                          fill={r === 0 ? '#CCFBF1' : '#FFFFFF'}
                          stroke={c === 0 ? '#0D9488' : '#CBD5E1'}
                          strokeWidth="1.5"
                        />
                        <text
                          x={x + (cellW - 8) / 2}
                          y={y + (cellH - 8) / 2 + 4}
                          textAnchor="middle"
                          fill="#0F294A"
                          fontSize="11"
                          fontFamily="monospace"
                        >
                          a{r + 1}
                          {c + 1}
                        </text>
                      </g>
                    );
                  })
                )}
              </svg>
            </div>
            <div className="lg:col-span-5 space-y-4">
              <p className="text-sm font-semibold text-[#0F294A]">
                Interactive Order Explorer
              </p>
              <p className="text-xs text-slate-600">
                Adjust rows ($m$) and columns ($n$) to observe how subscripts $a_{'{ij}'}$ map to
                horizontal rows and vertical columns.
              </p>
              <div className="space-y-3">
                <label className="block text-xs font-medium text-slate-700">
                  Rows (m): <span className="font-mono-num text-[#0F294A]">{svgRows}</span>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    value={svgRows}
                    onChange={(e) => setSvgRows(Number(e.target.value))}
                    className="w-full mt-1 accent-[#0D9488]"
                  />
                </label>
                <label className="block text-xs font-medium text-slate-700">
                  Columns (n): <span className="font-mono-num text-[#0F294A]">{svgCols}</span>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    value={svgCols}
                    onChange={(e) => setSvgCols(Number(e.target.value))}
                    className="w-full mt-1 accent-[#0D9488]"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Key Definitions */}
        <div className="space-y-4">
          <h3 className="font-display text-lg font-semibold text-[#0F294A]">
            Key Definitions & Formulas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.keyDefinitions.map((def, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-2.5"
              >
                <h4 className="font-display text-base font-semibold text-[#0F294A]">
                  {def.term}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  <RichMathText text={def.definition} />
                </p>
                {def.formulaLatex && (
                  <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
                    <MathBlock latex={def.formulaLatex} display />
                  </div>
                )}
                {def.exampleLatex && (
                  <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
                    <MathBlock latex={def.exampleLatex} display />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Properties and Laws */}
        <div className="space-y-3">
          <h3 className="font-display text-lg font-semibold text-[#0F294A]">
            Essential Rules & Algebraic Laws
          </h3>
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white">
            {lesson.propertiesAndRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-semibold text-[#0F294A]">
                    {rule.title}
                  </h4>
                  <p className="text-sm text-slate-600">
                    <RichMathText text={rule.note} />
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 shrink-0">
                  <MathBlock latex={rule.latex} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Mistakes Table */}
        <div className="space-y-3">
          <h3 className="font-display text-lg font-semibold text-[#0F294A]">
            Common Exam Mistakes to Avoid
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Common Error</th>
                  <th className="px-4 py-3 font-semibold">Correct Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {lesson.commonMistakes.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-rose-800 align-top">
                      <RichMathText text={item.mistake} />
                    </td>
                    <td className="px-4 py-3 text-slate-700 align-top">
                      <RichMathText text={item.correction} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Understanding Check */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
          <p className="text-xs font-medium text-[#0D9488]">Check Your Understanding</p>
          <p className="text-base font-medium text-[#0F294A]">
            <RichMathText text={lesson.quickCheck.question} />
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lesson.quickCheck.options.map((opt, oIdx) => {
              const chosen = selectedCheck === oIdx;
              const isCorrect = oIdx === lesson.quickCheck.correctIndex;
              let cls = 'border-slate-200 bg-white hover:border-[#0D9488] text-slate-800';
              if (selectedCheck !== null) {
                if (isCorrect) {
                  cls = 'border-[#0D9488] bg-teal-50 text-[#0F294A] font-medium';
                } else if (chosen) {
                  cls = 'border-rose-400 bg-rose-50 text-rose-900';
                }
              }
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() =>
                    setQuickCheckAnswer((prev) => ({ ...prev, [lesson.id]: oIdx }))
                  }
                  className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors flex items-center justify-between gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${cls}`}
                >
                  <span className="min-w-0">
                    <RichMathText text={opt} />
                  </span>
                  {selectedCheck !== null && isCorrect && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] shrink-0">
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      <span>Correct</span>
                    </span>
                  )}
                  {selectedCheck !== null && chosen && !isCorrect && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 shrink-0">
                      <XCircle className="w-4 h-4" aria-hidden="true" />
                      <span>Your choice</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {selectedCheck !== null && (
            <div className="pt-2 text-sm text-slate-700 flex items-start gap-2">
              {selectedCheck === lesson.quickCheck.correctIndex ? (
                <CheckCircle2 className="w-4 h-4 text-[#0D9488] mt-0.5 shrink-0" aria-hidden="true" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-700 mt-0.5 shrink-0" aria-hidden="true" />
              )}
              <div>
                <strong className="text-[#0F294A]">
                  {selectedCheck === lesson.quickCheck.correctIndex
                    ? 'Well done! '
                    : 'Keep going — review this step: '}
                </strong>
                <RichMathText text={lesson.quickCheck.explanation} />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('lab')}
            className="text-sm font-medium text-[#0D9488] hover:text-[#0F766E]"
          >
            Experiment in Interactive Math Lab →
          </button>
          <button
            type="button"
            onClick={() => onNavigate('examples')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864]"
          >
            <span>See Worked Examples</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
