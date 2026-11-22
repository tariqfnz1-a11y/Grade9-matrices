import { CheckCircle2, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { MathBlock, RichMathText } from '../components/MathBlock';
import { TOPIC_LABELS, WORKED_EXAMPLES } from '../data/unit1Content';
import type { StudentProgress, TopicId } from '../types/curriculum';

interface WorkedExamplesViewProps {
  progress: StudentProgress;
  onMarkStudied: (exampleId: string) => void;
}

export const WorkedExamplesView: React.FC<WorkedExamplesViewProps> = ({
  progress,
  onMarkStudied,
}) => {
  const [filterTopic, setFilterTopic] = useState<TopicId | 'all'>('all');
  const [revealedSteps, setRevealedSteps] = useState<Record<string, number>>({});

  const filtered =
    filterTopic === 'all'
      ? WORKED_EXAMPLES
      : WORKED_EXAMPLES.filter((e) => e.topicId === filterTopic);

  const handleRevealNext = (id: string, totalSteps: number) => {
    setRevealedSteps((prev) => {
      const current = prev[id] ?? 1;
      const next = Math.min(totalSteps, current + 1);
      if (next === totalSteps) {
        onMarkStudied(id);
      }
      return { ...prev, [id]: next };
    });
  };

  const handleShowAll = (id: string, totalSteps: number) => {
    setRevealedSteps((prev) => ({ ...prev, [id]: totalSteps }));
    onMarkStudied(id);
  };

  const handleResetSteps = (id: string) => {
    setRevealedSteps((prev) => ({ ...prev, [id]: 1 }));
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-[#0D9488]">Module 05 · Step-by-Step Solutions</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F294A] mt-1">
          Worked Examples
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Textbook-aligned solved examples with guided step-by-step reveal and examiner notes.
        </p>
      </div>

      {/* Topic Filter */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => setFilterTopic('all')}
          className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            filterTopic === 'all'
              ? 'bg-white text-[#0F294A] shadow-sm'
              : 'text-slate-600 hover:text-[#0F294A]'
          }`}
        >
          All Exercises
        </button>
        {(Object.keys(TOPIC_LABELS) as TopicId[]).map((tid) => (
          <button
            key={tid}
            type="button"
            onClick={() => setFilterTopic(tid)}
            className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              filterTopic === tid
                ? 'bg-white text-[#0F294A] shadow-sm'
                : 'text-slate-600 hover:text-[#0F294A]'
            }`}
          >
            {TOPIC_LABELS[tid].exercise}
          </button>
        ))}
      </div>

      {/* Examples List */}
      <div className="space-y-6">
        {filtered.map((ex) => {
          const shownCount = revealedSteps[ex.id] ?? 1;
          const allShown = shownCount >= ex.steps.length;
          const isStudied = progress.studiedExamples.includes(ex.id);

          return (
            <article
              key={ex.id}
              className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 space-y-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs text-slate-500">
                    {ex.exerciseRef} · {TOPIC_LABELS[ex.topicId].title} · {ex.difficulty}
                  </p>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F294A] mt-1">
                    {ex.title}
                  </h2>
                </div>
                {isStudied && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0D9488]">
                    <CheckCircle2 className="w-4 h-4" /> Studied
                  </span>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm sm:text-base text-slate-900">
                <RichMathText text={ex.problemStatement} />
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {ex.steps.slice(0, shownCount).map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className="border border-slate-200 rounded-lg p-4 bg-white space-y-2"
                  >
                    <p className="font-display text-sm font-semibold text-[#0F294A]">
                      {step.label}
                    </p>
                    <p className="text-sm text-slate-600">
                      <RichMathText text={step.explanation} />
                    </p>
                    <div className="bg-slate-50 rounded px-3 py-2">
                      <MathBlock latex={step.mathLatex} display />
                    </div>
                  </div>
                ))}
              </div>

              {allShown && (
                <div className="space-y-3">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-[#0F766E] mb-1">Final Answer</p>
                    <MathBlock latex={ex.finalAnswerLatex} display />
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700">
                    <strong className="text-[#0F294A]">Examiner Tip: </strong>
                    <RichMathText text={ex.examinerTip} />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-xs font-mono-num text-slate-500 tabular-nums">
                  Showing {shownCount} of {ex.steps.length} steps
                </span>
                <div className="flex flex-wrap gap-2">
                  {!allShown ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRevealNext(ex.id, ex.steps.length)}
                        className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864]"
                      >
                        Reveal Next Step
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShowAll(ex.id, ex.steps.length)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-[#0F294A] bg-slate-100 rounded-lg hover:bg-slate-200"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Show Full Solution</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleResetSteps(ex.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                    >
                      <EyeOff className="w-4 h-4" />
                      <span>Collapse Steps</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
