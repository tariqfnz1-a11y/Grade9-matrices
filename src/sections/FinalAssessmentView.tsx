import { CheckCircle2, Clock, Flag, RotateCcw, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { RichMathText } from '../components/MathBlock';
import { FINAL_ASSESSMENT_QUESTIONS, TOPIC_LABELS } from '../data/unit1Content';
import type { FinalAssessmentResult, StudentProgress, TopicId } from '../types/curriculum';

interface FinalAssessmentViewProps {
  progress: StudentProgress;
  onSaveResult: (result: FinalAssessmentResult) => void;
}

export const FinalAssessmentView: React.FC<FinalAssessmentViewProps> = ({
  progress,
  onSaveResult,
}) => {
  const [phase, setPhase] = useState<'intro' | 'active' | 'review'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (phase !== 'active') return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const formatDuration = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleStart = () => {
    setAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setPhase('active');
  };

  const handleSubmitExam = () => {
    const topicScores: Record<TopicId, { correct: number; total: number }> = {
      'order-equality': { correct: 0, total: 0 },
      'types-transpose': { correct: 0, total: 0 },
      'add-sub': { correct: 0, total: 0 },
      multiplication: { correct: 0, total: 0 },
      'determinant-inverse': { correct: 0, total: 0 },
      'linear-systems': { correct: 0, total: 0 },
    };

    let score = 0;
    FINAL_ASSESSMENT_QUESTIONS.forEach((q) => {
      topicScores[q.topicId].total += 1;
      if (answers[q.id] === q.correctIndex) {
        score += 1;
        topicScores[q.topicId].correct += 1;
      }
    });

    const result: FinalAssessmentResult = {
      completedAt: new Date().toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      score,
      total: FINAL_ASSESSMENT_QUESTIONS.length,
      durationSeconds: elapsedSeconds,
      topicScores,
    };

    onSaveResult(result);
    setPhase('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentQuestion = FINAL_ASSESSMENT_QUESTIONS[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const latestResult = progress.finalAssessments[0] ?? null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-medium text-[#0D9488]">Module 10 · Summative Unit Evaluation</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F294A] mt-1">
            Final Unit Assessment
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            15 comprehensive questions covering all six exercises of Unit 1: Matrices and
            Determinants.
          </p>
        </div>

        {phase === 'active' && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg font-mono-num text-sm text-[#0F294A] shrink-0">
            <Clock className="w-4 h-4 text-[#0D9488]" />
            <span>{formatDuration(elapsedSeconds)}</span>
          </div>
        )}
      </div>

      {/* INTRO SCREEN */}
      {phase === 'intro' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
            <h2 className="font-display text-xl font-bold text-[#0F294A]">
              Unit 1 Mastery Exam Instructions
            </h2>
            <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li>Contains 15 multiple-choice questions across Exercises 1.1 to 1.6.</li>
              <li>You may flag questions to review before final submission.</li>
              <li>
                Your score, time taken, and topic-by-topic breakdown are saved locally in your
                browser.
              </li>
              <li>Passing mastery benchmark: 80% (12 / 15 or higher).</li>
            </ul>
            <button
              type="button"
              onClick={handleStart}
              className="px-6 py-3 text-sm font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864]"
            >
              Start Final Assessment
            </button>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-[#0F294A]">
              Previous Attempts
            </h3>
            {progress.finalAssessments.length === 0 ? (
              <p className="text-sm text-slate-500">
                No final unit assessment attempts recorded yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {progress.finalAssessments.slice(0, 4).map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-2.5 text-sm"
                  >
                    <div>
                      <p className="font-medium text-[#0F294A]">{att.completedAt}</p>
                      <p className="text-xs text-slate-500 font-mono-num">
                        Time: {formatDuration(att.durationSeconds)}
                      </p>
                    </div>
                    <span className="font-mono-num font-bold text-[#0D9488] tabular-nums">
                      {att.score}/{att.total} ({Math.round((att.score / att.total) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACTIVE EXAM */}
      {phase === 'active' && currentQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-100 pb-3">
              <span>
                Question {currentIndex + 1} of {FINAL_ASSESSMENT_QUESTIONS.length} ·{' '}
                {TOPIC_LABELS[currentQuestion.topicId].exercise}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFlagged((f) => ({ ...f, [currentQuestion.id]: !f[currentQuestion.id] }))
                }
                className={`inline-flex items-center gap-1.5 font-medium ${
                  flagged[currentQuestion.id] ? 'text-amber-700' : 'text-slate-500 hover:text-[#0F294A]'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flagged[currentQuestion.id] ? 'Flagged' : 'Flag for Review'}</span>
              </button>
            </div>

            <div className="text-base sm:text-lg font-medium text-[#0F294A]">
              <RichMathText text={currentQuestion.prompt} />
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((opt, idx) => {
                const picked = answers[currentQuestion.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: idx }))
                    }
                    className={`text-left px-4 py-3.5 rounded-lg border text-sm transition-colors flex items-center gap-3 ${
                      picked
                        ? 'border-[#0F294A] bg-slate-100 text-[#0F294A] font-medium ring-1 ring-[#0F294A]'
                        : 'border-slate-200 bg-white hover:border-[#0D9488]'
                    }`}
                  >
                    <span className="font-mono-num text-xs text-slate-500">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span>
                      <RichMathText text={opt} />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-[#0F294A] disabled:opacity-40"
              >
                Previous
              </button>

              {currentIndex < FINAL_ASSESSMENT_QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((i) => Math.min(FINAL_ASSESSMENT_QUESTIONS.length - 1, i + 1))
                  }
                  className="px-5 py-2 text-sm font-medium rounded-lg bg-[#0F294A] text-white hover:bg-[#163864]"
                >
                  Next Question
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="px-5 py-2 text-sm font-medium rounded-lg bg-[#0D9488] text-white hover:bg-[#0F766E]"
                >
                  Submit Final Assessment
                </button>
              )}
            </div>
          </div>

          {/* Question Navigator Grid */}
          <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#0F294A]">Question Navigator</span>
              <span className="font-mono-num text-slate-500 tabular-nums">
                {answeredCount}/{FINAL_ASSESSMENT_QUESTIONS.length} answered
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {FINAL_ASSESSMENT_QUESTIONS.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;
                const isFlag = !!flagged[q.id];
                let btnCls = 'border-slate-200 bg-white text-slate-700';
                let statusLabel = 'Not answered';
                if (isCurrent) {
                  btnCls = 'border-[#0F294A] bg-[#0F294A] text-white font-semibold';
                  statusLabel = isFlag ? 'Current, Flagged' : isAnswered ? 'Current, Answered' : 'Current';
                } else if (isFlag) {
                  btnCls = 'border-amber-400 bg-amber-50 text-amber-900 font-medium';
                  statusLabel = isAnswered ? 'Flagged, Answered' : 'Flagged for review';
                } else if (isAnswered) {
                  btnCls = 'border-[#0D9488] bg-teal-50 text-[#0F766E] font-medium';
                  statusLabel = 'Answered';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Question ${idx + 1}: ${statusLabel}`}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`h-10 rounded-lg border font-mono-num text-xs transition-colors inline-flex items-center justify-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${btnCls}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlag ? (
                      <span aria-hidden="true" className="text-[10px]">
                        ⚑
                      </span>
                    ) : isAnswered ? (
                      <span aria-hidden="true" className="text-[10px]">
                        ●
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-slate-600 pt-1">
              <span>● Answered</span>
              <span>⚑ Flagged</span>
              <span>Plain: Unanswered</span>
            </div>

            <button
              type="button"
              onClick={handleSubmitExam}
              className="w-full py-2.5 text-sm font-medium rounded-lg bg-[#0D9488] text-white hover:bg-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              Finish &amp; Grade Exam
            </button>
          </aside>
        </div>
      )}

      {/* REVIEW REPORT */}
      {phase === 'review' && latestResult && (
        <div className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">
                Unit 1 Assessment Result · Duration {formatDuration(latestResult.durationSeconds)}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F294A] mt-1 tabular-nums">
                Score: {latestResult.score} / {latestResult.total} (
                {Math.round((latestResult.score / latestResult.total) * 100)}%)
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {latestResult.score >= 12
                  ? 'Excellent work! You have achieved Unit 1 mastery and are ready for BISE Punjab Board exams.'
                  : 'Good effort! Review the step-by-step solutions below and strengthen those topics in the Practice Zone, then retake anytime.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864] shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Exam</span>
            </button>
          </section>

          <div className="space-y-4">
            {FINAL_ASSESSMENT_QUESTIONS.map((q, idx) => {
              const chosen = answers[q.id];
              const isCorrect = chosen === q.correctIndex;
              return (
                <article
                  key={q.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Q{idx + 1} · {TOPIC_LABELS[q.topicId].exercise}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        isCorrect ? 'text-[#0D9488]' : 'text-rose-700'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> Incorrect
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-medium text-[#0F294A]">
                    <RichMathText text={q.prompt} />
                  </p>
                  <div className="text-sm text-slate-700 space-y-1">
                    <p>
                      <strong>Correct Answer:</strong>{' '}
                      <RichMathText text={q.options[q.correctIndex]} />
                    </p>
                    {!isCorrect && chosen !== undefined && (
                      <p className="text-rose-700">
                        <strong>Your Answer:</strong> <RichMathText text={q.options[chosen]} />
                      </p>
                    )}
                    <p className="text-slate-600 pt-1">
                      <RichMathText text={q.solutionSteps.join(' ')} />
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
