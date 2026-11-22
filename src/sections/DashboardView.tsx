import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  FlaskConical,
  Play,
  Target,
} from 'lucide-react';
import React from 'react';
import { MathBlock } from '../components/MathBlock';
import { ModuleIcon } from '../components/ModuleIcon';
import { CONCEPT_LESSONS, NAV_ITEMS, TOPIC_LABELS } from '../data/unit1Content';
import type { SectionId, StudentProgress, TopicId } from '../types/curriculum';
import { classifyPerformanceBand, normalizeDiagnosticResult } from '../utils/diagnosticEngine';
import { computeUnitCompletion, getModuleCompletionInfo } from '../utils/progressStorage';

interface DashboardViewProps {
  progress: StudentProgress;
  onNavigate: (section: SectionId) => void;
  onOpenLesson: (topicId: TopicId) => void;
  onStartPersonalisedPractice: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  onNavigate,
  onOpenLesson,
  onStartPersonalisedPractice,
}) => {
  const lessonsDone = progress.completedLessons.length;
  const accuracy =
    progress.practiceStats.attempted > 0
      ? Math.round((progress.practiceStats.correct / progress.practiceStats.attempted) * 100)
      : 0;
  const latestFinal = progress.finalAssessments[0];
  const nextUnfinishedLesson = CONCEPT_LESSONS.find(
    (l) => !progress.completedLessons.includes(l.id)
  );
  const diag = progress.diagnosticResult
    ? normalizeDiagnosticResult(
        progress.diagnosticResult,
        progress.diagnosticHistory.length || 1
      )
    : null;
  const diagBand = diag ? classifyPerformanceBand(diag.percentage ?? 0) : null;
  const unitCompletion = computeUnitCompletion(progress);

  const resumeNav =
    progress.lastVisitedSection && progress.lastVisitedSection !== 'dashboard'
      ? NAV_ITEMS.find((n) => n.id === progress.lastVisitedSection)
      : null;

  const handleResume = () => {
    if (!resumeNav) return;
    if (resumeNav.id === 'learn' && progress.lastLessonTopic) {
      onOpenLesson(progress.lastLessonTopic);
      return;
    }
    onNavigate(resumeNav.id);
  };

  return (
    <div className="space-y-10">
      {/* Hero 2-column split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-[#0F766E]">
              Grade 9 Mathematics · Punjab Textbook Board Syllabus
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0F294A] mt-2 tracking-tight text-balance">
              Unit 1: Matrices and Determinants
            </h1>
            <p className="text-slate-600 mt-3 text-base leading-relaxed max-w-2xl">
              Learn step by step at your own pace. Explore interactive matrix simulations, worked
              textbook examples, targeted practice drills, and Punjab Board paper preparation—all
              saved locally in your browser.
            </p>
          </div>

          <div className="mt-7 space-y-4">
            {/* Overall Progress Bar inside Hero */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-[#0F294A]">
                  Your Unit 1 Learning Progress
                </span>
                <span className="font-mono-num font-bold text-[#0F766E] tabular-nums">
                  {unitCompletion.percent}% ({unitCompletion.completedModules} of{' '}
                  {unitCompletion.totalModules} milestones)
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Unit 1 overall completion"
                aria-valuenow={unitCompletion.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-[#0D9488] transition-all duration-300"
                  style={{ width: `${unitCompletion.percent}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {resumeNav && (
                <button
                  type="button"
                  onClick={handleResume}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0D9488] rounded-lg hover:bg-[#0F766E] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                >
                  <Play className="w-4 h-4" aria-hidden="true" />
                  <span>
                    Resume:{' '}
                    {resumeNav.id === 'learn' && progress.lastLessonTopic
                      ? TOPIC_LABELS[progress.lastLessonTopic].exercise
                      : resumeNav.shortLabel}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onNavigate(progress.diagnosticResult ? 'learn' : 'diagnostic')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                <span>
                  {progress.diagnosticResult
                    ? nextUnfinishedLesson
                      ? `Study ${nextUnfinishedLesson.exerciseRef}`
                      : 'Review Concept Lessons'
                    : 'Start Diagnostic Assessment'}
                </span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('lab')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0F294A] bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                <FlaskConical className="w-4 h-4 text-[#0D9488]" aria-hidden="true" />
                <span>Open Math Lab</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Visual Anchor: Matrix Transformation & Key Identity */}
        <div className="lg:col-span-5 bg-[#0F294A] text-white rounded-xl p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-teal-200">
            <span>Core Unit Architecture</span>
            <span>Exercises 1.1 – 1.6</span>
          </div>

          <div className="my-5 flex items-center justify-center">
            <svg
              viewBox="0 0 320 150"
              className="w-full max-w-[320px] h-auto"
              role="img"
              aria-label="Diagram showing matrix equation A X equals B and inverse solution"
            >
              {/* Grid lines */}
              <defs>
                <pattern id="heroGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="320" height="150" rx="8" fill="url(#heroGrid)" />

              {/* Matrix A box */}
              <rect
                x="18"
                y="32"
                width="82"
                height="86"
                rx="6"
                fill="rgba(255,255,255,0.08)"
                stroke="#2DD4BF"
                strokeWidth="1.5"
              />
              <text x="59" y="54" textAnchor="middle" fill="#99F6E4" fontSize="11" fontWeight="600">
                Matrix A
              </text>
              <text x="42" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontFamily="monospace">
                a₁₁
              </text>
              <text x="76" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontFamily="monospace">
                a₁₂
              </text>
              <text x="42" y="102" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontFamily="monospace">
                a₂₁
              </text>
              <text x="76" y="102" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontFamily="monospace">
                a₂₂
              </text>

              {/* Arrow */}
              <line x1="108" y1="75" x2="146" y2="75" stroke="#5EEAD4" strokeWidth="2" />
              <polygon points="146,70 156,75 146,80" fill="#5EEAD4" />
              <text x="131" y="64" textAnchor="middle" fill="#CBD5E1" fontSize="10">
                |A| ≠ 0
              </text>

              {/* Result Box */}
              <rect
                x="164"
                y="26"
                width="138"
                height="98"
                rx="6"
                fill="rgba(13,148,136,0.22)"
                stroke="#5EEAD4"
                strokeWidth="1.5"
              />
              <text x="233" y="49" textAnchor="middle" fill="#99F6E4" fontSize="11" fontWeight="600">
                System Solution
              </text>
              <text x="233" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontFamily="monospace">
                X = A⁻¹ B
              </text>
              <text x="233" y="101" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontFamily="monospace">
                x = |Aₓ|/|A|
              </text>
            </svg>
          </div>

          <div className="bg-white/10 rounded-lg px-4 py-2.5 text-center">
            <MathBlock
              latex="A^{-1} = \frac{1}{|A|} \operatorname{Adj}(A), \quad |A| = ad - bc \neq 0"
              className="text-white text-sm"
            />
          </div>
        </div>
      </section>

      {/* 4-column KPI strip below hero */}
      <section aria-label="Unit 1 progress summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-600">Concept Lessons</p>
          <p className="font-display text-2xl font-bold text-[#0F294A] mt-1 tabular-nums">
            {lessonsDone} / 6
          </p>
          <p className="text-xs text-slate-600 mt-1">Exercises 1.1 through 1.6</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-600">Practice Accuracy</p>
          <p className="font-display text-2xl font-bold text-[#0F294A] mt-1 tabular-nums">
            {progress.practiceStats.attempted > 0 ? `${accuracy}%` : '—'}
          </p>
          <p className="text-xs text-slate-600 mt-1 tabular-nums">
            {progress.practiceStats.correct} correct of {progress.practiceStats.attempted} attempted
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-600">Diagnostic Baseline</p>
          <p className="font-display text-2xl font-bold text-[#0F294A] mt-1 tabular-nums">
            {diag ? `${diag.score} / ${diag.total} (${diag.percentage}%)` : 'Not taken'}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            {diagBand ? diagBand.label : '18-question pre-unit check'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-600">Final Unit Score</p>
          <p className="font-display text-2xl font-bold text-[#0F294A] mt-1 tabular-nums">
            {latestFinal ? `${latestFinal.score} / ${latestFinal.total}` : 'Pending'}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            {latestFinal
              ? `${Math.round((latestFinal.score / latestFinal.total) * 100)}% latest attempt`
              : '15-question mastery exam'}
          </p>
        </div>
      </section>

      {/* Diagnostic Remediation Callout */}
      {diag && diagBand && (
        <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#0F766E]">
              Personalised Study Path · {diagBand.label}
            </p>
            <p className="text-sm text-[#0F294A]">
              {(diag.recommendedLessons?.length ?? 0) > 0
                ? `Recommended revision focus: ${diag.recommendedLessons
                    ?.slice(0, 3)
                    .map((r) => r.exerciseRef)
                    .join(', ')}. Keep building step by step!`
                : 'Strong baseline across all six exercises! Challenge yourself with the extension practice set or 75-Mark Board Simulator.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            {diag.recommendedLessons && diag.recommendedLessons[0] && (
              <button
                type="button"
                onClick={() => onOpenLesson(diag.recommendedLessons![0].topicId)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[#0F294A] bg-slate-100 rounded-lg hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                Revise {diag.recommendedLessons[0].exerciseRef}
              </button>
            )}
            <button
              type="button"
              onClick={onStartPersonalisedPractice}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#0D9488] rounded-lg hover:bg-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              Start Personalised Practice
            </button>
          </div>
        </section>
      )}

      {/* Syllabus Exercise Coverage */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-bold text-[#0F294A]">
              Syllabus Roadmap (Exercises 1.1 – 1.6)
            </h2>
            <p className="text-sm text-slate-600">
              Follow the six Punjab Board sub-topics in sequence or jump directly to any exercise.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('learn')}
            className="text-sm font-medium text-[#0F766E] hover:text-[#0F294A] whitespace-nowrap shrink-0 self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
          >
            View all lessons →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONCEPT_LESSONS.map((lesson) => {
            const isDone = progress.completedLessons.includes(lesson.id);
            const topicInfo = TOPIC_LABELS[lesson.id];
            return (
              <div
                key={lesson.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-600">
                    <span className="font-medium">{topicInfo.exercise}</span>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#0F766E]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488]" aria-hidden="true" />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <Circle className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        Not started
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-base font-semibold text-[#0F294A] mt-2">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {lesson.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenLesson(lesson.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0F294A] hover:text-[#0D9488] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
                  >
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                    <span>{isDone ? 'Review Lesson' : 'Study Concept'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('practice')}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#0F294A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
                  >
                    <Target className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Drill</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* All Learning Modules Directory with Completion Indicators */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0F294A]">
            Platform Modules
          </h2>
          <p className="text-sm text-slate-600">
            Every learning tool, lab, and board exam resource works offline with saved completion
            status.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAV_ITEMS.filter((n) => n.id !== 'dashboard').map((item) => {
            const info = getModuleCompletionInfo(item.id, progress);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className="text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-[#0D9488] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1.5 font-mono-num">
                      <ModuleIcon sectionId={item.id} className="w-4 h-4 text-[#0D9488]" />
                      <span>Module {item.number}</span>
                    </span>
                    <span>{item.phase}</span>
                  </div>
                  <h3 className="font-display text-base font-semibold text-[#0F294A] mt-2">
                    {item.label}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span
                    className={`inline-flex items-center gap-1.5 font-semibold ${
                      info.status === 'completed'
                        ? 'text-[#0F766E]'
                        : info.status === 'in-progress'
                          ? 'text-[#0F294A]'
                          : 'text-slate-600'
                    }`}
                  >
                    {info.status === 'completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488]" aria-hidden="true" />
                    ) : info.status === 'in-progress' ? (
                      <Clock className="w-3.5 h-3.5 text-[#0F294A]" aria-hidden="true" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    )}
                    <span>{info.statusLabel}</span>
                  </span>

                  <span className="font-medium text-[#0F766E]">Open →</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
