import { BookOpen, Download, Target, Trash2, TrendingUp } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { TOPIC_LABELS } from '../data/unit1Content';
import type { SectionId, StudentProgress, TopicId } from '../types/curriculum';
import {
  classifyPerformanceBand,
  computeAttemptComparison,
  getBandBadgeColors,
  normalizeDiagnosticResult,
} from '../utils/diagnosticEngine';

interface ProgressDashboardViewProps {
  progress: StudentProgress;
  onResetProgress: () => void;
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

export const ProgressDashboardView: React.FC<ProgressDashboardViewProps> = ({
  progress,
  onResetProgress,
  onNavigate,
  onOpenLesson,
  onStartPersonalisedPractice,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!confirmOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConfirmOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [confirmOpen]);

  const accuracy =
    progress.practiceStats.attempted > 0
      ? Math.round((progress.practiceStats.correct / progress.practiceStats.attempted) * 100)
      : 0;

  const latestDiag = useMemo(
    () =>
      progress.diagnosticResult
        ? normalizeDiagnosticResult(
            progress.diagnosticResult,
            progress.diagnosticHistory.length || 1
          )
        : null,
    [progress.diagnosticResult, progress.diagnosticHistory.length]
  );

  const comparison = useMemo(
    () => computeAttemptComparison(progress.diagnosticHistory),
    [progress.diagnosticHistory]
  );

  const latestFinal = progress.finalAssessments[0];
  const latestFinalPct = latestFinal
    ? Math.round((latestFinal.score / latestFinal.total) * 100)
    : null;

  const currentIndicatorPct =
    latestFinalPct ??
    (progress.practiceStats.attempted > 0
      ? accuracy
      : latestDiag?.percentage ?? null);

  const activeBand =
    currentIndicatorPct !== null ? classifyPerformanceBand(currentIndicatorPct) : null;
  const bandColors = activeBand ? getBandBadgeColors(activeBand.id) : null;

  const totalAnsweredCombined =
    (latestDiag?.total ?? 0) + progress.practiceStats.attempted;
  const totalCorrectCombined =
    (latestDiag?.score ?? 0) + progress.practiceStats.correct;
  const totalIncorrectCombined = totalAnsweredCombined - totalCorrectCombined;

  const overallReadiness = Math.round(
    ((progress.completedLessons.length / 6) * 0.35 +
      (progress.studiedExamples.length / 6) * 0.2 +
      (progress.practiceStats.attempted > 0 ? accuracy / 100 : 0) * 0.25 +
      (latestFinal ? latestFinal.score / latestFinal.total : 0) * 0.2) *
      100
  );

  const handleExportReport = () => {
    const lines = [
      'GRADE 9 MATHEMATICS - UNIT 1: MATRICES AND DETERMINANTS',
      'Student Self-Learning Progress Report',
      `Exported: ${new Date().toLocaleString()}`,
      '',
      `Overall Unit Readiness: ${overallReadiness}%`,
      activeBand ? `Current Learning Stage: ${activeBand.label} (${activeBand.rangeText})` : '',
      `Concept Lessons Completed: ${progress.completedLessons.length} / 6`,
      `Worked Examples Studied: ${progress.studiedExamples.length} / 6`,
      `Lab Modules Explored: ${progress.labModulesExplored.length} / 7`,
      `Practice Questions Attempted: ${progress.practiceStats.attempted} (${progress.practiceStats.correct} correct, ${progress.practiceStats.attempted - progress.practiceStats.correct} incorrect, ${accuracy}%)`,
      `Best Practice Streak: ${progress.practiceStats.bestStreak}`,
      latestDiag
        ? `Latest Diagnostic: Attempt #${latestDiag.attemptNumber ?? 1} — ${latestDiag.score} / ${latestDiag.total} (${latestDiag.percentage}%) [${latestDiag.completedAt}]`
        : 'Diagnostic Baseline: Not taken',
      comparison && comparison.totalAttempts >= 2
        ? `Diagnostic Improvement: ${comparison.firstAttemptPct}% -> ${comparison.latestAttemptPct}% (${comparison.deltaFromFirst >= 0 ? '+' : ''}${comparison.deltaFromFirst}%)`
        : '',
      latestFinal
        ? `Latest Final Assessment: ${latestFinal.score} / ${latestFinal.total} (${latestFinalPct}%) [${latestFinal.completedAt}]`
        : 'Final Assessment: Not taken',
    ].filter(Boolean);

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grade9-unit1-progress-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-medium text-[#0D9488]">
            Module 11 · Visual Progress &amp; Growth Analytics
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F294A] mt-1">
            Student Progress Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Tracks total marks, topic-wise performance, correct/incorrect answers, recommended
            revision topics, and improvement across attempts in browser localStorage.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-[#0F294A] bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

      {/* Encouraging Growth Status Banner */}
      {activeBand && bandColors ? (
        <section className={`border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${bandColors.bg} ${bandColors.border}`}>
          <div className="space-y-1">
            <p className={`text-xs font-semibold ${bandColors.text}`}>
              Current Learning Snapshot · {activeBand.label} ({activeBand.rangeText})
            </p>
            <p className="text-sm text-slate-800 leading-relaxed">
              {activeBand.encouragement} Scores measure what you have practiced so far—not a fixed
              limit on your potential.
            </p>
          </div>
          {latestDiag && (latestDiag.personalisedPracticePlan?.length ?? 0) > 0 && (
            <button
              type="button"
              onClick={onStartPersonalisedPractice}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864] whitespace-nowrap shrink-0"
            >
              <Target className="w-4 h-4" />
              <span>Practice Recommended Sequence</span>
            </button>
          )}
        </section>
      ) : (
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#0F294A]">Start With Your Diagnostic Check</p>
            <p className="text-sm text-slate-600">
              Attempt the 18-question Diagnostic Assessment to identify your strong concepts, weak
              topics, and personalised practice path.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('diagnostic')}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864] whitespace-nowrap shrink-0"
          >
            Start Diagnostic
          </button>
        </section>
      )}

      {/* Summary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-500">Diagnostic Marks &amp; %</p>
          <p className="font-display text-2xl font-bold text-[#0F294A] mt-1 tabular-nums">
            {latestDiag ? `${latestDiag.score}/${latestDiag.total} (${latestDiag.percentage}%)` : '—'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {latestDiag
              ? `${progress.diagnosticHistory.length} attempt${progress.diagnosticHistory.length > 1 ? 's' : ''} recorded`
              : 'Not attempted yet'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-500">Correct vs Incorrect Responses</p>
          <p className="font-display text-2xl font-bold text-[#0F294A] mt-1 tabular-nums">
            {totalCorrectCombined} ✓ · {totalIncorrectCombined} ✕
          </p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            Across {totalAnsweredCombined} diagnostic &amp; practice items
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-600">Practice Accuracy &amp; Readiness</p>
          <p className="font-display text-2xl font-bold text-[#0F294A] mt-1 tabular-nums">
            {progress.practiceStats.attempted > 0 ? `${accuracy}%` : '—'} · {overallReadiness}%
          </p>
          <p className="text-xs text-slate-600 mt-1">
            {progress.completedLessons.length}/6 lessons · {progress.labModulesExplored.length}/7 lab · {progress.applicationsSolved.length}/5 apps
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-600">Final Unit Score</p>
          <p className="font-display text-2xl font-bold text-[#0F294A] mt-1 tabular-nums">
            {latestFinal ? `${latestFinal.score}/${latestFinal.total} (${latestFinalPct}%)` : '—'}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            {progress.finalAssessments.length} final attempt{progress.finalAssessments.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {/* Visual Topic-Wise Performance Chart & Table */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div>
          <h2 className="font-display text-lg font-bold text-[#0F294A]">
            Visual Topic-Wise Performance (Exercises 1.1 – 1.6)
          </h2>
          <p className="text-sm text-slate-600">
            Compares your latest Diagnostic accuracy (navy) and Practice Zone accuracy (teal) per
            module.
          </p>
        </div>

        {/* SVG Grouped Horizontal Bar Chart */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-x-auto">
          <svg
            viewBox="0 0 650 250"
            className="w-full min-w-[480px] h-auto"
            role="img"
            aria-label="Grouped bar chart comparing diagnostic and practice percentages across six Unit 1 exercises"
          >
            {/* Legend */}
            <rect x="165" y="6" width="12" height="10" rx="2" fill="#0F294A" />
            <text x="182" y="15" fill="#0F294A" fontSize="11" fontWeight="600">
              Latest Diagnostic %
            </text>
            <rect x="315" y="6" width="12" height="10" rx="2" fill="#0D9488" />
            <text x="332" y="15" fill="#0F766E" fontSize="11" fontWeight="600">
              Practice Accuracy %
            </text>

            {[0, 40, 60, 80, 100].map((mark) => {
              const x = 165 + (mark / 100) * 410;
              return (
                <g key={mark}>
                  <line
                    x1={x}
                    y1={28}
                    x2={x}
                    y2={226}
                    stroke={mark === 80 ? '#0D9488' : '#E2E8F0'}
                    strokeDasharray={mark === 80 ? '4 3' : undefined}
                    strokeWidth={1}
                  />
                  <text
                    x={x}
                    y={242}
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
              const diagStat = latestDiag?.topicScores[tid];
              const diagPct =
                diagStat && diagStat.total > 0
                  ? Math.round((diagStat.correct / diagStat.total) * 100)
                  : 0;
              const pracStat = progress.practiceStats.byTopic[tid];
              const pracPct =
                pracStat && pracStat.attempted > 0
                  ? Math.round((pracStat.correct / pracStat.attempted) * 100)
                  : 0;
              const y = 34 + idx * 32;

              return (
                <g key={tid}>
                  <text
                    x={155}
                    y={y + 16}
                    textAnchor="end"
                    fill="#0F294A"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {TOPIC_LABELS[tid].exercise}
                  </text>
                  <rect x={165} y={y} width={410} height={10} rx={3} fill="#E2E8F0" />
                  {diagPct > 0 && (
                    <rect
                      x={165}
                      y={y}
                      width={Math.max(4, (diagPct / 100) * 410)}
                      height={10}
                      rx={3}
                      fill="#0F294A"
                    />
                  )}
                  <rect x={165} y={y + 13} width={410} height={10} rx={3} fill="#E2E8F0" />
                  {pracPct > 0 && (
                    <rect
                      x={165}
                      y={y + 13}
                      width={Math.max(4, (pracPct / 100) * 410)}
                      height={10}
                      rx={3}
                      fill="#0D9488"
                    />
                  )}
                  <text
                    x={584}
                    y={y + 15}
                    fill="#334155"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {diagStat ? `${diagPct}%` : '—'} / {pracStat?.attempted ? `${pracPct}%` : '—'}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Exercise</th>
                <th className="px-4 py-3 font-semibold">Topic</th>
                <th className="px-4 py-3 font-semibold">Diagnostic</th>
                <th className="px-4 py-3 font-semibold">Practice Accuracy</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {TOPIC_ORDER.map((tid) => {
                const lessonDone = progress.completedLessons.includes(tid);
                const diagStat = latestDiag?.topicScores[tid];
                const diagPct =
                  diagStat && diagStat.total > 0
                    ? Math.round((diagStat.correct / diagStat.total) * 100)
                    : null;
                const pracStat = progress.practiceStats.byTopic[tid];
                const pracPct =
                  pracStat && pracStat.attempted > 0
                    ? Math.round((pracStat.correct / pracStat.attempted) * 100)
                    : null;
                const refPct = pracPct ?? diagPct;
                const band = refPct !== null ? classifyPerformanceBand(refPct) : null;
                const colors = band ? getBandBadgeColors(band.id) : null;

                return (
                  <tr key={tid}>
                    <td className="px-4 py-3 font-mono-num text-xs text-slate-600 whitespace-nowrap">
                      {TOPIC_LABELS[tid].exercise}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#0F294A]">
                      {TOPIC_LABELS[tid].title}
                    </td>
                    <td className="px-4 py-3 font-mono-num text-xs text-slate-700 tabular-nums">
                      {diagStat && diagPct !== null
                        ? `${diagStat.correct}/${diagStat.total} (${diagPct}%)`
                        : '—'}
                    </td>
                    <td className="px-4 py-3 font-mono-num text-xs text-slate-700 tabular-nums">
                      {pracStat && pracPct !== null
                        ? `${pracStat.correct}/${pracStat.attempted} (${pracPct}%)`
                        : 'No drills yet'}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {band && colors ? (
                        <span className={`font-medium ${colors.text}`}>{band.label}</span>
                      ) : (
                        <span className="text-slate-500">Not assessed</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onOpenLesson(tid)}
                        className="text-xs font-medium text-[#0D9488] hover:text-[#0F766E] whitespace-nowrap"
                      >
                        {lessonDone ? 'Review Lesson' : 'Study Lesson'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recommended Revision Topics + Improvement Between Attempts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-[#0F294A]">
              Recommended Revision Topics
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('diagnostic')}
              className="text-xs font-medium text-[#0D9488] hover:text-[#0F766E]"
            >
              View Full Diagnostic →
            </button>
          </div>

          {!latestDiag ? (
            <p className="text-sm text-slate-600">
              Complete the Diagnostic Assessment to generate personalised lesson and practice
              recommendations.
            </p>
          ) : (latestDiag.recommendedLessons?.length ?? 0) === 0 ? (
            <p className="text-sm text-[#0F766E] bg-teal-50 border border-teal-200 rounded-lg p-4">
              All six syllabus topics scored 80% or above on your latest diagnostic! Keep practicing
              board-level problems to retain full accuracy.
            </p>
          ) : (
            <div className="space-y-3">
              {latestDiag.recommendedLessons?.map((rec) => (
                <div
                  key={rec.topicId}
                  className="border border-slate-200 rounded-lg p-4 bg-slate-50/70 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0F294A]">
                      {rec.exerciseRef} · {rec.lessonTitle}
                    </span>
                    <span
                      className={`font-medium ${
                        rec.priority === 'High' ? 'text-rose-700' : 'text-amber-700'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{rec.reason}</p>
                  <button
                    type="button"
                    onClick={() => onOpenLesson(rec.topicId)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D9488] hover:text-[#0F766E]"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open {rec.exerciseRef} Lesson →</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0D9488]" />
              <h2 className="font-display text-lg font-bold text-[#0F294A]">
                Improvement Between Attempts
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('diagnostic')}
              className="text-xs font-medium text-[#0D9488] hover:text-[#0F766E]"
            >
              Retake Diagnostic
            </button>
          </div>

          {progress.diagnosticHistory.length === 0 ? (
            <p className="text-sm text-slate-600">
              No diagnostic attempts recorded yet. After your first attempt and subsequent retakes,
              your score progression appears here.
            </p>
          ) : progress.diagnosticHistory.length === 1 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-[#0F294A]">
                Attempt #1 Recorded: {latestDiag?.score}/{latestDiag?.total} ({latestDiag?.percentage}
                %)
              </p>
              <p className="text-xs text-slate-600">
                Revise your recommended topics and retake the Diagnostic Assessment to measure your
                improvement over Attempt #1.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comparison && (
                <div className="bg-teal-50/70 border border-teal-200 rounded-lg p-4 flex items-center justify-between text-sm">
                  <span className="font-medium text-[#0F294A]">
                    Attempt #1 ({comparison.firstAttemptPct}%) → Attempt #
                    {comparison.totalAttempts} ({comparison.latestAttemptPct}%)
                  </span>
                  <span
                    className={`font-mono-num font-bold tabular-nums ${
                      comparison.deltaFromFirst >= 0 ? 'text-[#0F766E]' : 'text-amber-700'
                    }`}
                  >
                    {comparison.deltaFromFirst >= 0 ? '+' : ''}
                    {comparison.deltaFromFirst}%
                  </span>
                </div>
              )}

              <div className="space-y-2">
                {progress.diagnosticHistory.map((att, idx) => {
                  const norm = normalizeDiagnosticResult(att, idx + 1);
                  const pct = norm.percentage ?? 0;
                  return (
                    <div key={`${norm.attemptNumber}-${idx}`} className="space-y-1 text-xs">
                      <div className="flex justify-between font-mono-num text-slate-700">
                        <span>
                          Attempt #{norm.attemptNumber ?? idx + 1} ({norm.completedAt})
                        </span>
                        <span>
                          {norm.score}/{norm.total} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0D9488]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {progress.finalAssessments.length > 0 && (
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <p className="text-xs font-semibold text-[#0F294A]">
                Recent Final Unit Assessment Scores
              </p>
              <div className="flex flex-wrap gap-2">
                {progress.finalAssessments.slice(0, 4).map((fa, i) => (
                  <span
                    key={`${fa.completedAt}-${i}`}
                    className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 font-mono-num text-xs text-slate-700"
                  >
                    {fa.score}/{fa.total} ({Math.round((fa.score / fa.total) * 100)}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Reset Confirmation Modal */}
      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-lg">
            <h3 id="reset-dialog-title" className="font-display text-lg font-bold text-[#0F294A]">
              Reset all local progress?
            </h3>
            <p className="text-sm text-slate-600">
              This clears your completed lessons, practice scores, diagnostic attempt history,
              personalised practice sequence, and final assessment scores from this browser.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                autoFocus
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-700 rounded-lg hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
