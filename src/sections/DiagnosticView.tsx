import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  RotateCcw,
  Target,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { RichMathText } from '../components/MathBlock';
import { ALL_PRACTICE_QUESTIONS } from '../data/practiceBank';
import { DIAGNOSTIC_QUESTIONS, TOPIC_LABELS } from '../data/unit1Content';
import type { DiagnosticResult, SectionId, StudentProgress, TopicId } from '../types/curriculum';
import {
  classifyPerformanceBand,
  computeAttemptComparison,
  evaluateDiagnosticAttempt,
  getBandBadgeColors,
  normalizeDiagnosticResult,
} from '../utils/diagnosticEngine';

interface DiagnosticViewProps {
  progress: StudentProgress;
  onSaveResult: (result: DiagnosticResult) => void;
  onNavigate: (section: SectionId) => void;
  onOpenLesson: (topicId: TopicId) => void;
  onStartPersonalisedPractice: () => void;
}

const TOPIC_ORDER: TopicId[] = [
  'order-equality',
  'types-transpose',
  'add-sub',
  'multiplication',
  'determinant-inverse',
  'linear-systems',
];

export const DiagnosticView: React.FC<DiagnosticViewProps> = ({
  progress,
  onSaveResult,
  onNavigate,
  onOpenLesson,
  onStartPersonalisedPractice,
}) => {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const history = progress.diagnosticHistory;
  const latestRaw = progress.diagnosticResult;

  const activeResult = useMemo(() => {
    const target = submitted ? progress.diagnosticResult : latestRaw;
    if (!target) return null;
    return normalizeDiagnosticResult(target, history.length || 1);
  }, [submitted, progress.diagnosticResult, latestRaw, history.length]);

  const comparison = useMemo(() => computeAttemptComparison(history), [history]);

  const practiceQuestionMap = useMemo(
    () => new Map(ALL_PRACTICE_QUESTIONS.map((q) => [q.id, q])),
    []
  );

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmit = () => {
    const attemptNumber = history.length + 1;
    const evaluated = evaluateDiagnosticAttempt(answers, attemptNumber);
    onSaveResult(evaluated);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setAnswers({});
    setSubmitted(false);
    setStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const answeredCount = Object.keys(answers).length;

  const activeBand = activeResult
    ? classifyPerformanceBand(
        activeResult.percentage ??
          Math.round((activeResult.score / Math.max(1, activeResult.total)) * 100)
      )
    : null;
  const bandColors = activeBand ? getBandBadgeColors(activeBand.id) : null;

  const correctCount = activeResult?.score ?? 0;
  const incorrectCount = activeResult ? activeResult.total - activeResult.score : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-medium text-[#0D9488]">
            Module 02 · Rule-Based Diagnostic &amp; Remediation Engine
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F294A] mt-1">
            Diagnostic Assessment
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            An 18-question diagnostic across all six syllabus modules that identifies strong and
            weak concepts, recommends lessons, and builds your personalised practice sequence locally.
          </p>
        </div>

        {(started || activeResult) && (
          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0F294A] bg-white border border-slate-300 rounded-lg hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{submitted || activeResult ? 'Retake Diagnostic' : 'Reset Answers'}</span>
          </button>
        )}
      </div>

      {/* ============================================================
          REPORT VIEW: Shown after submission or when revisiting saved result
      ============================================================ */}
      {activeResult && activeBand && bandColors && (!started || submitted) && (
        <div className="space-y-6">
          {/* 1. Overall Score, Percentage & Performance Band */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-2">
                <p className="text-xs text-slate-500">
                  Attempt #{activeResult.attemptNumber ?? 1} · Completed {activeResult.completedAt}
                </p>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F294A] tabular-nums">
                    {activeResult.score} / {activeResult.total} Marks ({activeResult.percentage}%)
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-lg border text-xs font-semibold ${bandColors.bg} ${bandColors.border} ${bandColors.text}`}
                  >
                    {activeBand.label} ({activeBand.rangeText})
                  </span>
                </div>
                <p className="text-sm text-slate-700 max-w-2xl leading-relaxed">
                  {activeBand.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={onStartPersonalisedPractice}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0D9488] rounded-lg hover:bg-[#0F766E] whitespace-nowrap"
                >
                  <Target className="w-4 h-4" />
                  <span>Start Personalised Practice</span>
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0F294A] bg-slate-100 rounded-lg hover:bg-slate-200 whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Assessment</span>
                </button>
              </div>
            </div>

            {/* Growth-Mindset Notice + Correct/Incorrect Split */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-slate-100">
              <div className="md:col-span-7 bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1.5">
                <p className="text-xs font-semibold text-[#0F294A]">
                  Growth &amp; Learning Guidance
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeBand.encouragement}
                </p>
              </div>

              <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0F294A]">Response Breakdown</span>
                  <span className="font-mono-num text-slate-600 tabular-nums">
                    {correctCount} Correct · {incorrectCount} Incorrect
                  </span>
                </div>
                <div className="w-full h-3 bg-rose-200 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#0D9488]"
                    style={{
                      width: `${activeResult.total > 0 ? Math.round((correctCount / activeResult.total) * 100) : 0}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>{correctCount} answered accurately</span>
                  <span>{incorrectCount} targeted for practice</span>
                </div>
              </div>
            </div>

            {/* 5 Performance Scale Reference */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs pt-1">
              {(
                [
                  ['Below 40%', 'Needs foundational support', 'foundational'],
                  ['40–59%', 'Developing understanding', 'developing'],
                  ['60–79%', 'Satisfactory understanding', 'satisfactory'],
                  ['80–89%', 'Strong understanding', 'strong'],
                  ['90–100%', 'Excellent understanding', 'excellent'],
                ] as const
              ).map(([range, label, id]) => {
                const isCurrent = activeBand.id === id;
                const colors = getBandBadgeColors(id);
                return (
                  <div
                    key={id}
                    className={`rounded-lg border px-3 py-2 ${
                      isCurrent
                        ? `${colors.bg} ${colors.border} ${colors.text} font-semibold`
                        : 'border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    <p className="font-mono-num text-[11px]">{range}</p>
                    <p className="mt-0.5 leading-snug">{label}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 2. Topic-Wise Performance SVG Chart + 6-Module Cards */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0F294A]">
                Topic-Wise Performance Across All 6 Modules
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Each module carries 3 diagnostic checkpoints covering definitions, procedures, and
                problem solving.
              </p>
            </div>

            {/* Visual SVG Bar Chart */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-x-auto">
              <svg
                viewBox="0 0 640 210"
                className="w-full min-w-[460px] h-auto"
                role="img"
                aria-label="Topic-wise diagnostic percentage chart across all six Unit 1 modules"
              >
                {[0, 40, 60, 80, 100].map((mark) => {
                  const x = 165 + (mark / 100) * 410;
                  return (
                    <g key={mark}>
                      <line
                        x1={x}
                        y1={16}
                        x2={x}
                        y2={182}
                        stroke={mark === 80 ? '#0D9488' : '#E2E8F0'}
                        strokeDasharray={mark === 80 ? '4 3' : undefined}
                        strokeWidth={1}
                      />
                      <text
                        x={x}
                        y={198}
                        textAnchor="middle"
                        fill="#64748B"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {mark}%
                      </text>
                    </g>
                  );
                })}

                {TOPIC_ORDER.map((tid, idx) => {
                  const stat = activeResult.topicScores[tid] ?? { correct: 0, total: 0 };
                  const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                  const band = classifyPerformanceBand(pct);
                  const barColor = getBandBadgeColors(band.id).bar;
                  const y = 22 + idx * 27;
                  const barWidth = Math.max(4, (pct / 100) * 410);
                  return (
                    <g key={tid}>
                      <text
                        x={155}
                        y={y + 13}
                        textAnchor="end"
                        fill="#0F294A"
                        fontSize="11"
                        fontWeight="600"
                      >
                        {TOPIC_LABELS[tid].exercise}
                      </text>
                      <rect
                        x={165}
                        y={y}
                        width={410}
                        height={17}
                        rx={4}
                        fill="#E2E8F0"
                      />
                      <rect
                        x={165}
                        y={y}
                        width={pct === 0 ? 0 : barWidth}
                        height={17}
                        rx={4}
                        fill={barColor}
                      />
                      <text
                        x={585}
                        y={y + 12}
                        fill="#334155"
                        fontSize="11"
                        fontFamily="monospace"
                      >
                        {stat.correct}/{stat.total} ({pct}%)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOPIC_ORDER.map((topicId) => {
                const stat = activeResult.topicScores[topicId] ?? { correct: 0, total: 0 };
                const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                const band = classifyPerformanceBand(pct);
                const colors = getBandBadgeColors(band.id);
                return (
                  <div
                    key={topicId}
                    className="border border-slate-200 rounded-lg p-4 bg-slate-50/70 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-slate-500">{TOPIC_LABELS[topicId].exercise}</span>
                      <span className={`font-medium ${colors.text}`}>{band.label}</span>
                    </div>
                    <p className="font-display text-sm font-semibold text-[#0F294A]">
                      {TOPIC_LABELS[topicId].title}
                    </p>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{ width: `${pct}%`, backgroundColor: colors.bar }}
                      />
                    </div>
                    <p className="text-xs font-mono-num text-slate-600 tabular-nums">
                      {stat.correct} / {stat.total} correct ({pct}%)
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. Strong Concepts & Weak Concepts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0F294A]">
                  Strong Concepts Identified
                </h2>
                <p className="text-xs text-slate-600">
                  Concepts where your accuracy is 80% or above.
                </p>
              </div>
              {(activeResult.strongConcepts?.length ?? 0) === 0 ? (
                <p className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-4">
                  No full modules reached 80% yet—review the weak concepts next door and build up
                  one exercise at a time.
                </p>
              ) : (
                <div className="space-y-3">
                  {activeResult.strongConcepts?.map((sc) => (
                    <div
                      key={sc.topicId}
                      className="border border-teal-200 bg-teal-50/50 rounded-lg p-4 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-[#0F766E]">
                        <span>
                          {TOPIC_LABELS[sc.topicId].exercise} · {TOPIC_LABELS[sc.topicId].title}
                        </span>
                        <span className="font-mono-num tabular-nums">
                          {sc.correct}/{sc.total} ({sc.percentage}%)
                        </span>
                      </div>
                      <p className="text-xs text-slate-700">
                        Verified concepts: {sc.concepts.join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0F294A]">
                  Weak &amp; Developing Concepts
                </h2>
                <p className="text-xs text-slate-600">
                  Targeted topics below 80% prioritized for revision and practice.
                </p>
              </div>
              {(activeResult.weakConcepts?.length ?? 0) === 0 ? (
                <p className="text-sm text-[#0F766E] bg-teal-50 border border-teal-200 rounded-lg p-4">
                  All six syllabus modules scored 80% or higher! Try the extension challenge
                  sequence or the 75-Mark Punjab Board Simulator.
                </p>
              ) : (
                <div className="space-y-3">
                  {activeResult.weakConcepts?.map((wc) => {
                    const colors = getBandBadgeColors(wc.bandId);
                    return (
                      <div
                        key={wc.topicId}
                        className={`border rounded-lg p-4 space-y-1.5 ${colors.bg} ${colors.border}`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className={colors.text}>
                            {TOPIC_LABELS[wc.topicId].exercise} · {TOPIC_LABELS[wc.topicId].title}
                          </span>
                          <span className={`font-mono-num tabular-nums ${colors.text}`}>
                            {wc.correct}/{wc.total} ({wc.percentage}%) ·{' '}
                            {wc.severity === 'High' ? 'Priority Focus' : 'Review'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700">
                          Concepts to strengthen: {wc.concepts.join(' · ')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* 4. Recommended Lessons for Revision */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0F294A]">
                  Recommended Lessons for Revision
                </h2>
                <p className="text-xs text-slate-600">
                  Ordered by greatest score improvement opportunity. Click any lesson to open it
                  directly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('lab')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0D9488] hover:text-[#0F766E]"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Open Interactive Math Lab</span>
              </button>
            </div>

            {(activeResult.recommendedLessons?.length ?? 0) === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-700">
                  No remediation lessons required right now. Proceed to Worked Examples, Board Exam
                  Prep, or the Final Unit Assessment.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('board-prep')}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864]"
                >
                  Open Board Exam Prep
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeResult.recommendedLessons?.map((rec) => (
                  <article
                    key={rec.topicId}
                    className="border border-slate-200 rounded-xl p-5 bg-slate-50/70 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#0D9488]">{rec.exerciseRef}</span>
                        <span
                          className={`font-medium ${
                            rec.priority === 'High' ? 'text-rose-700' : 'text-amber-700'
                          }`}
                        >
                          {rec.priority} Priority
                        </span>
                      </div>
                      <h3 className="font-display text-base font-bold text-[#0F294A]">
                        {rec.lessonTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {rec.reason}
                      </p>
                      {rec.suggestedLabTab && (
                        <p className="text-xs text-slate-500">
                          Suggested Simulator: <strong>{rec.suggestedLabTab}</strong>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenLesson(rec.topicId)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864]"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Revise {rec.exerciseRef}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('lab')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#0F294A] bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
                      >
                        <span>Try in Math Lab</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* 5. Personalised Practice Sequence */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0F294A]">
                  Personalised Practice Sequence ({activeResult.personalisedPracticePlan?.length ?? 0}{' '}
                  Steps)
                </h2>
                <p className="text-xs text-slate-600">
                  Generated deterministically from your missed diagnostic questions—progressing from
                  foundational concepts to problem solving.
                </p>
              </div>
              <button
                type="button"
                onClick={onStartPersonalisedPractice}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#0D9488] rounded-lg hover:bg-[#0F766E] whitespace-nowrap shrink-0"
              >
                <span>Launch Personalised Practice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl bg-slate-50/50">
              {activeResult.personalisedPracticePlan?.slice(0, 8).map((step, idx) => {
                const pq = practiceQuestionMap.get(step.questionId);
                return (
                  <div
                    key={step.questionId}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-semibold text-[#0F294A]">
                        Step {idx + 1} · {step.stage} · {TOPIC_LABELS[step.topicId].exercise}
                      </p>
                      <p className="text-slate-600">{step.reason}</p>
                      {pq && (
                        <p className="text-slate-500 truncate">
                          Preview: <RichMathText text={pq.prompt} />
                        </p>
                      )}
                    </div>
                    <span className="font-mono-num text-[11px] text-slate-500 shrink-0">
                      {pq?.difficulty ?? 'Targeted'}
                    </span>
                  </div>
                );
              })}
              {(activeResult.personalisedPracticePlan?.length ?? 0) > 8 && (
                <div className="px-4 py-2.5 text-xs text-slate-500">
                  + {(activeResult.personalisedPracticePlan?.length ?? 0) - 8} additional transfer
                  questions included when you launch the sequence.
                </div>
              )}
            </div>
          </section>

          {/* 6. Improvement Between Attempts (when >= 2 attempts recorded) */}
          {comparison && comparison.totalAttempts >= 2 && (
            <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#0D9488]" />
                  <div>
                    <h2 className="font-display text-lg font-bold text-[#0F294A]">
                      Improvement Between Diagnostic Attempts
                    </h2>
                    <p className="text-xs text-slate-600">
                      Comparing Attempt #1 ({comparison.firstAttemptPct}%) through Attempt #
                      {comparison.totalAttempts} ({comparison.latestAttemptPct}%)
                    </p>
                  </div>
                </div>
                <span
                  className={`font-mono-num text-sm font-bold tabular-nums ${
                    comparison.deltaFromFirst >= 0 ? 'text-[#0D9488]' : 'text-amber-700'
                  }`}
                >
                  {comparison.deltaFromFirst >= 0 ? '+' : ''}
                  {comparison.deltaFromFirst}% since Attempt #1
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {history.slice(-3).map((att, idx) => {
                  const norm = normalizeDiagnosticResult(att, idx + 1);
                  return (
                    <div
                      key={`${norm.attemptNumber}-${idx}`}
                      className="border border-slate-200 rounded-lg p-4 bg-slate-50/70"
                    >
                      <p className="text-xs text-slate-500">
                        Attempt #{norm.attemptNumber ?? idx + 1} · {norm.completedAt}
                      </p>
                      <p className="font-display text-xl font-bold text-[#0F294A] mt-1 tabular-nums">
                        {norm.score} / {norm.total} ({norm.percentage}%)
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Module</th>
                      <th className="px-4 py-2.5 font-semibold">First Attempt</th>
                      <th className="px-4 py-2.5 font-semibold">Latest Attempt</th>
                      <th className="px-4 py-2.5 font-semibold">Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {comparison.topicDeltas.map((td) => (
                      <tr key={td.topicId}>
                        <td className="px-4 py-2.5 font-medium text-[#0F294A]">
                          {TOPIC_LABELS[td.topicId].exercise}: {TOPIC_LABELS[td.topicId].title}
                        </td>
                        <td className="px-4 py-2.5 font-mono-num tabular-nums">{td.firstPct}%</td>
                        <td className="px-4 py-2.5 font-mono-num tabular-nums">{td.latestPct}%</td>
                        <td
                          className={`px-4 py-2.5 font-mono-num font-semibold tabular-nums ${
                            td.delta > 0
                              ? 'text-[#0D9488]'
                              : td.delta < 0
                                ? 'text-amber-700'
                                : 'text-slate-500'
                          }`}
                        >
                          {td.delta > 0 ? `+${td.delta}%` : `${td.delta}%`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}

      {/* ============================================================
          START GATE (First visit before diagnostic attempt)
      ============================================================ */}
      {!started && !activeResult && (
        <section className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-2xl mx-auto space-y-4">
          <h2 className="font-display text-xl font-bold text-[#0F294A]">
            Begin Your Unit 1 Diagnostic Check
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            This 18-question baseline covers Exercises 1.1 through 1.6 (3 questions per module). Your
            score is never a permanent judgment—it automatically highlights strong concepts, flags
            weak topics, recommends specific lessons, and builds a personalised practice sequence.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864]"
            >
              <span>Begin 18-Question Diagnostic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ============================================================
          ACTIVE QUIZ & QUESTION-BY-QUESTION REVIEW
      ============================================================ */}
      {started && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-slate-600">
              Questions Answered:{' '}
              <strong className="font-mono-num text-[#0F294A] tabular-nums">
                {answeredCount} / {DIAGNOSTIC_QUESTIONS.length}
              </strong>
            </span>
            {!submitted && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount < DIAGNOSTIC_QUESTIONS.length}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  answeredCount === DIAGNOSTIC_QUESTIONS.length
                    ? 'bg-[#0D9488] text-white hover:bg-[#0F766E]'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              >
                Submit Diagnostic
              </button>
            )}
          </div>

          {DIAGNOSTIC_QUESTIONS.map((q, idx) => {
            const selected = answers[q.id];
            const isCorrect = selected === q.correctIndex;
            return (
              <article
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>
                    Question {idx + 1} · {TOPIC_LABELS[q.topicId].exercise} ·{' '}
                    {q.conceptTag ?? TOPIC_LABELS[q.topicId].title}
                  </span>
                  {submitted && (
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
                  )}
                </div>

                <div className="text-base font-medium text-slate-900">
                  <RichMathText text={q.prompt} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => {
                    const isPicked = selected === optIdx;
                    const isAnswer = q.correctIndex === optIdx;
                    let btnStyle =
                      'border-slate-200 bg-white text-slate-800 hover:border-[#0D9488]';
                    if (submitted) {
                      if (isAnswer) {
                        btnStyle = 'border-[#0D9488] bg-teal-50 text-[#0F294A] font-medium';
                      } else if (isPicked && !isAnswer) {
                        btnStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                      } else {
                        btnStyle = 'border-slate-200 bg-slate-50 text-slate-600';
                      }
                    } else if (isPicked) {
                      btnStyle =
                        'border-[#0F294A] bg-slate-100 text-[#0F294A] font-medium ring-1 ring-[#0F294A]';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        disabled={submitted}
                        aria-pressed={!submitted ? isPicked : undefined}
                        className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors flex items-center justify-between gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${btnStyle}`}
                      >
                        <span className="flex items-center gap-3 min-w-0">
                          <span className="font-mono-num text-xs text-slate-600 shrink-0">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span className="min-w-0">
                            <RichMathText text={opt} />
                          </span>
                        </span>
                        {submitted && isAnswer && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] shrink-0">
                            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                            <span>Correct</span>
                          </span>
                        )}
                        {submitted && isPicked && !isAnswer && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 shrink-0">
                            <XCircle className="w-4 h-4" aria-hidden="true" />
                            <span>Your choice</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="pt-3 border-t border-slate-100 text-sm text-slate-700 space-y-1">
                    <p className="font-semibold text-[#0F294A]">Explanation:</p>
                    {q.solutionSteps.map((step, sIdx) => (
                      <p key={sIdx}>
                        <RichMathText text={step} />
                      </p>
                    ))}
                  </div>
                )}
              </article>
            );
          })}

          {!submitted && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount < DIAGNOSTIC_QUESTIONS.length}
                className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${
                  answeredCount === DIAGNOSTIC_QUESTIONS.length
                    ? 'bg-[#0D9488] text-white hover:bg-[#0F766E]'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              >
                {answeredCount === DIAGNOSTIC_QUESTIONS.length
                  ? 'Submit Diagnostic & View Report'
                  : `Answer all questions (${answeredCount}/${DIAGNOSTIC_QUESTIONS.length})`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
