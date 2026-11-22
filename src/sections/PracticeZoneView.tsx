import { CheckCircle2, HelpCircle, RefreshCw, RotateCcw, Shuffle, Target, XCircle } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { MathBlock, RichMathText } from '../components/MathBlock';
import { ALL_PRACTICE_QUESTIONS } from '../data/practiceBank';
import { TOPIC_LABELS } from '../data/unit1Content';
import { normalizeDiagnosticResult } from '../utils/diagnosticEngine';
import type {
  PracticeQuestion,
  PracticeQuestionType,
  StudentProgress,
  TopicId,
} from '../types/curriculum';

interface PracticeZoneViewProps {
  progress: StudentProgress;
  startPersonalised?: boolean;
  onConsumePersonalisedRequest?: () => void;
  onRecordAttempt: (topicId: TopicId, isCorrect: boolean) => void;
}

const TYPE_LABELS: Record<PracticeQuestionType, string> = {
  mcq: 'A. Multiple Choice',
  'true-false': 'B. True or False',
  'fill-blank': 'C. Fill in the Blanks',
  'find-error': 'D. Find the Error',
  'solve-problem': 'E. Solve the Problem',
};

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeBlankInput(val: string): string {
  return val.trim().toLowerCase().replace(/\s+/g, ' ');
}

function normalizeBlankCompact(val: string): string {
  return val.trim().toLowerCase().replace(/\s+/g, '').replace(/×/g, 'x');
}

function parseNumericOrFraction(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s+/g, '');
  if (!cleaned) return null;
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/');
    if (parts.length !== 2) return null;
    const num = Number(parts[0]);
    const den = Number(parts[1]);
    if (Number.isNaN(num) || Number.isNaN(den) || den === 0) return null;
    return num / den;
  }
  const n = Number(cleaned);
  return Number.isNaN(n) || !Number.isFinite(n) ? null : n;
}

function getEncouragingFeedback(correct: number, total: number): string {
  if (total === 0) {
    return 'Select an answer and check your work to receive immediate feedback.';
  }
  const pct = Math.round((correct / total) * 100);
  if (pct >= 90) {
    return 'Outstanding mastery! Your accuracy across Unit 1 concepts is board-ready.';
  }
  if (pct >= 75) {
    return 'Great progress! Review the missed explanations below to lock in full marks.';
  }
  if (pct >= 50) {
    return 'Solid effort! Keep practicing the weak topics highlighted here to raise your score.';
  }
  return 'Every mistake is a step toward mastery. Use the Hints and Worked Solutions, then retry!';
}

export const PracticeZoneView: React.FC<PracticeZoneViewProps> = ({
  progress,
  startPersonalised,
  onConsumePersonalisedRequest,
  onRecordAttempt,
}) => {
  const normalisedDiag = useMemo(
    () =>
      progress.diagnosticResult
        ? normalizeDiagnosticResult(progress.diagnosticResult)
        : null,
    [progress.diagnosticResult]
  );
  const personalisedPlan = useMemo(
    () => normalisedDiag?.personalisedPracticePlan ?? [],
    [normalisedDiag]
  );

  const [personalisedMode, setPersonalisedMode] = useState<boolean>(
    Boolean(startPersonalised && personalisedPlan.length > 0)
  );
  const [topicFilter, setTopicFilter] = useState<TopicId | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<PracticeQuestionType | 'all'>('all');
  const [sessionLimit, setSessionLimit] = useState<number>(10);
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);

  // Per-question user responses & evaluation states
  const [mcqChoice, setMcqChoice] = useState<Record<string, number>>({});
  const [tfChoice, setTfChoice] = useState<Record<string, boolean>>({});
  const [textInput, setTextInput] = useState<Record<string, string>>({});
  const [checkedStatus, setCheckedStatus] = useState<Record<string, 'correct' | 'incorrect'>>({});
  const [shownHints, setShownHints] = useState<Record<string, boolean>>({});
  const [retryIncorrectOnly, setRetryIncorrectOnly] = useState(false);

  useEffect(() => {
    if (startPersonalised && personalisedPlan.length > 0) {
      setPersonalisedMode(true);
      setRetryIncorrectOnly(false);
      onConsumePersonalisedRequest?.();
    }
  }, [startPersonalised, personalisedPlan.length, onConsumePersonalisedRequest]);

  const matchingPool = useMemo(() => {
    return ALL_PRACTICE_QUESTIONS.filter((q) => {
      const matchTopic = topicFilter === 'all' || q.topicId === topicFilter;
      const matchType = typeFilter === 'all' || q.type === typeFilter;
      return matchTopic && matchType;
    });
  }, [topicFilter, typeFilter]);

  const personalisedQuestions = useMemo(() => {
    const questionMap = new Map(ALL_PRACTICE_QUESTIONS.map((q) => [q.id, q]));
    return personalisedPlan
      .map((item) => questionMap.get(item.questionId))
      .filter((q): q is PracticeQuestion => q !== undefined);
  }, [personalisedPlan]);

  const activeQuestions: PracticeQuestion[] = useMemo(() => {
    if (personalisedMode && personalisedQuestions.length > 0) {
      if (retryIncorrectOnly) {
        const missed = personalisedQuestions.filter((q) => checkedStatus[q.id] === 'incorrect');
        if (missed.length > 0) return missed;
      }
      return personalisedQuestions;
    }
    if (retryIncorrectOnly) {
      const missed = matchingPool.filter((q) => checkedStatus[q.id] === 'incorrect');
      if (missed.length > 0) return missed;
    }
    const base = shuffleSeed > 0 ? shuffleArray(matchingPool) : matchingPool;
    return sessionLimit === 0 ? base : base.slice(0, sessionLimit);
  }, [
    personalisedMode,
    personalisedQuestions,
    matchingPool,
    shuffleSeed,
    sessionLimit,
    retryIncorrectOnly,
    checkedStatus,
  ]);

  // Session metrics
  const sessionAnsweredIds = activeQuestions
    .map((q) => q.id)
    .filter((id) => checkedStatus[id] !== undefined);
  const sessionCorrectCount = sessionAnsweredIds.filter(
    (id) => checkedStatus[id] === 'correct'
  ).length;
  const sessionIncorrectCount = sessionAnsweredIds.length - sessionCorrectCount;

  // Overall accuracy & weak topic identification
  const totalAccuracy =
    progress.practiceStats.attempted > 0
      ? Math.round((progress.practiceStats.correct / progress.practiceStats.attempted) * 100)
      : 0;

  const weakTopics = useMemo(() => {
    return (Object.keys(TOPIC_LABELS) as TopicId[])
      .map((tid) => {
        const stat = progress.practiceStats.byTopic[tid];
        const attempted = stat?.attempted ?? 0;
        const correct = stat?.correct ?? 0;
        const incorrect = attempted - correct;
        const pct = attempted > 0 ? Math.round((correct / attempted) * 100) : null;
        return { tid, attempted, correct, incorrect, pct };
      })
      .filter((t) => t.attempted > 0 && t.pct !== null && (t.pct < 75 || t.incorrect > 0))
      .sort((a, b) => (a.pct ?? 100) - (b.pct ?? 100));
  }, [progress.practiceStats.byTopic]);

  const clearSessionResponses = () => {
    setMcqChoice({});
    setTfChoice({});
    setTextInput({});
    setCheckedStatus({});
    setShownHints({});
    setRetryIncorrectOnly(false);
  };

  const handleRandomiseSession = () => {
    clearSessionResponses();
    setShuffleSeed((s) => s + 1);
  };

  const handleRetryQuestion = (qId: string) => {
    setCheckedStatus((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    setMcqChoice((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    setTfChoice((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    setTextInput((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  const handleRetryAllIncorrect = () => {
    const wrongIds = activeQuestions
      .filter((q) => checkedStatus[q.id] === 'incorrect')
      .map((q) => q.id);
    if (wrongIds.length === 0) return;

    setRetryIncorrectOnly(true);
    wrongIds.forEach((id) => handleRetryQuestion(id));
  };

  const handleCheckQuestion = (q: PracticeQuestion) => {
    if (checkedStatus[q.id]) return;

    let isCorrect = false;
    if (q.type === 'mcq' || q.type === 'find-error') {
      const picked = mcqChoice[q.id];
      if (picked === undefined) return;
      isCorrect = picked === q.correctIndex;
    } else if (q.type === 'true-false') {
      const picked = tfChoice[q.id];
      if (picked === undefined) return;
      isCorrect = picked === q.correctBoolean;
    } else if (q.type === 'fill-blank') {
      const raw = textInput[q.id] ?? '';
      const norm = normalizeBlankInput(raw);
      const compact = normalizeBlankCompact(raw);
      if (!norm) return;
      isCorrect = q.acceptedAnswers.some(
        (ans) => normalizeBlankInput(ans) === norm || normalizeBlankCompact(ans) === compact
      );
    } else if (q.type === 'solve-problem') {
      const raw = textInput[q.id] ?? '';
      const num = parseNumericOrFraction(raw);
      if (num === null) return;
      isCorrect = Math.abs(num - q.expectedNumeric) < 1e-4;
    }

    setCheckedStatus((prev) => ({
      ...prev,
      [q.id]: isCorrect ? 'correct' : 'incorrect',
    }));
    onRecordAttempt(q.topicId, isCorrect);
  };

  const canCheck = (q: PracticeQuestion): boolean => {
    if (checkedStatus[q.id]) return false;
    if (q.type === 'mcq' || q.type === 'find-error') return mcqChoice[q.id] !== undefined;
    if (q.type === 'true-false') return tfChoice[q.id] !== undefined;
    if (q.type === 'fill-blank') return normalizeBlankInput(textInput[q.id] ?? '').length > 0;
    if (q.type === 'solve-problem') return parseNumericOrFraction(textInput[q.id] ?? '') !== null;
    return false;
  };

  return (
    <div className="space-y-8">
      {/* Header + Lifetime Accuracy Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-medium text-[#0D9488]">
            Module 06 · {ALL_PRACTICE_QUESTIONS.length} Verified Local Questions
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F294A] mt-1">
            Comprehensive Practice Zone
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Practice MCQs, True/False, Fill in the Blanks, Find the Error, and Computational
            problems across all six exercises.
          </p>
        </div>

        <div className="flex items-center gap-5 text-sm bg-white border border-slate-200 rounded-xl px-4 py-2.5 shrink-0">
          <div>
            <span className="text-xs text-slate-500 block">Overall Accuracy</span>
            <span className="font-mono-num font-bold text-[#0F294A] tabular-nums">
              {progress.practiceStats.attempted > 0 ? `${totalAccuracy}%` : '—'}
            </span>
          </div>
          <div className="h-7 w-px bg-slate-200" aria-hidden="true" />
          <div>
            <span className="text-xs text-slate-500 block">Solved</span>
            <span className="font-mono-num font-bold text-[#0F294A] tabular-nums">
              {progress.practiceStats.correct}/{progress.practiceStats.attempted}
            </span>
          </div>
          <div className="h-7 w-px bg-slate-200" aria-hidden="true" />
          <div>
            <span className="text-xs text-slate-500 block">Streak</span>
            <span className="font-mono-num font-bold text-[#0D9488] tabular-nums">
              {progress.practiceStats.currentStreak}
            </span>
          </div>
        </div>
      </div>

      {/* Personalised Remediation Banner (when diagnostic plan exists) */}
      {personalisedPlan.length > 0 && (
        <section
          className={`border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            personalisedMode
              ? 'bg-teal-50/70 border-[#0D9488]'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#0F766E]">
              Diagnostic Remediation Path · {personalisedPlan.length} Sequenced Questions
            </p>
            <p className="text-sm text-[#0F294A]">
              {personalisedMode
                ? 'Active: Practicing your personalised sequence ordered from weak concepts to mastery transfer.'
                : 'Your latest diagnostic generated a targeted practice sequence based on your incorrect answers.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setPersonalisedMode((v) => !v);
                clearSessionResponses();
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                personalisedMode
                  ? 'bg-white border border-slate-300 text-[#0F294A] hover:bg-slate-50'
                  : 'bg-[#0D9488] text-white hover:bg-[#0F766E]'
              }`}
            >
              {personalisedMode ? 'Switch to Custom Filters' : 'Launch Personalised Sequence'}
            </button>
          </div>
        </section>
      )}

      {/* Filters & Randomizer Deck */}
      {!personalisedMode && (
      <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#0F294A]">1. Filter by Syllabus Module</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                setTopicFilter('all');
                clearSessionResponses();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                topicFilter === 'all'
                  ? 'border-[#0F294A] bg-[#0F294A] text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              All 6 Modules ({ALL_PRACTICE_QUESTIONS.length})
            </button>
            {(Object.keys(TOPIC_LABELS) as TopicId[]).map((tid) => (
              <button
                key={tid}
                type="button"
                onClick={() => {
                  setTopicFilter(tid);
                  clearSessionResponses();
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  topicFilter === tid
                    ? 'border-[#0F294A] bg-[#0F294A] text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {TOPIC_LABELS[tid].exercise}: {TOPIC_LABELS[tid].title}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <p className="text-xs font-semibold text-[#0F294A]">2. Filter by Question Type</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                setTypeFilter('all');
                clearSessionResponses();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                typeFilter === 'all'
                  ? 'border-[#0D9488] bg-[#0D9488] text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              All 5 Types
            </button>
            {(Object.keys(TYPE_LABELS) as PracticeQuestionType[]).map((qt) => (
              <button
                key={qt}
                type="button"
                onClick={() => {
                  setTypeFilter(qt);
                  clearSessionResponses();
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  typeFilter === qt
                    ? 'border-[#0D9488] bg-[#0D9488] text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {TYPE_LABELS[qt]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span>Set size:</span>
            {[10, 20, 0].map((lim) => (
              <button
                key={lim}
                type="button"
                onClick={() => {
                  setSessionLimit(lim);
                  setRetryIncorrectOnly(false);
                }}
                className={`px-2.5 py-1 rounded border font-mono-num ${
                  sessionLimit === lim
                    ? 'border-[#0F294A] bg-slate-100 text-[#0F294A] font-semibold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {lim === 0 ? `All (${matchingPool.length})` : lim}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRandomiseSession}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864]"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Randomise Questions</span>
            </button>
            <button
              type="button"
              onClick={clearSessionResponses}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Session</span>
            </button>
          </div>
        </div>
      </section>
      )}

      {/* Session Scoreboard & Weak Topics Analysis */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs text-slate-500">Current Practice Session</p>
              <p className="font-display text-lg font-bold text-[#0F294A] tabular-nums">
                {sessionCorrectCount} Correct · {sessionIncorrectCount} Incorrect ·{' '}
                {activeQuestions.length - sessionAnsweredIds.length} Remaining
              </p>
            </div>
            {sessionIncorrectCount > 0 && (
              <button
                type="button"
                onClick={handleRetryAllIncorrect}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry {sessionIncorrectCount} Incorrect</span>
              </button>
            )}
          </div>
          <p className="text-sm text-slate-700">
            {getEncouragingFeedback(sessionCorrectCount, sessionAnsweredIds.length)}
          </p>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0F294A]">
            <Target className="w-4 h-4 text-[#0D9488]" />
            <span>Weak Topic Detector (Based on Your Answers)</span>
          </div>
          {weakTopics.length === 0 ? (
            <p className="text-xs text-slate-600 leading-relaxed">
              {progress.practiceStats.attempted === 0
                ? 'Complete a few questions to automatically detect topics needing extra review.'
                : 'No weak topics detected right now — all attempted exercises are 75% or above.'}
            </p>
          ) : (
            <div className="space-y-2">
              {weakTopics.slice(0, 3).map((wt) => (
                <div
                  key={wt.tid}
                  className="flex items-center justify-between gap-2 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
                >
                  <span className="font-medium text-[#0F294A] truncate">
                    {TOPIC_LABELS[wt.tid].exercise} · {wt.pct}% ({wt.incorrect} missed)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTopicFilter(wt.tid);
                      setTypeFilter('all');
                      clearSessionResponses();
                    }}
                    className="font-semibold text-[#0D9488] hover:text-[#0F766E] whitespace-nowrap shrink-0"
                  >
                    Drill Topic →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Questions Feed */}
      <div className="space-y-5">
        {activeQuestions.map((q, idx) => {
          const status = checkedStatus[q.id];
          const isChecked = status !== undefined;
          const hintOpen = !!shownHints[q.id];
          const planMeta = personalisedMode
            ? personalisedPlan.find((p) => p.questionId === q.id)
            : undefined;

          return (
            <article
              key={q.id}
              className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4"
            >
              {planMeta && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-[#0F294A] flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-[#0F766E]">
                    Step {idx + 1} · {planMeta.stage}
                  </span>
                  <span className="text-slate-600">{planMeta.reason}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>
                  Question {idx + 1} · {TYPE_LABELS[q.type]} · {TOPIC_LABELS[q.topicId].exercise} ·{' '}
                  {q.difficulty}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setShownHints((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                  }
                  className="inline-flex items-center gap-1 font-medium text-[#0D9488] hover:text-[#0F766E]"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{hintOpen ? 'Hide Hint' : 'Show Hint'}</span>
                </button>
              </div>

              <div className="text-base font-medium text-[#0F294A]">
                <RichMathText text={q.prompt} />
              </div>

              {hintOpen && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-sm text-amber-950">
                  <strong>Hint: </strong>
                  <RichMathText text={q.hint} />
                </div>
              )}

              {/* TYPE A & TYPE D: 4-Option MCQ / Find the Error */}
              {(q.type === 'mcq' || q.type === 'find-error') && (
                <div className="space-y-4">
                  {q.type === 'find-error' && (
                    <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-4 overflow-x-auto">
                      <p className="text-xs font-semibold text-rose-800 mb-1">
                        Student&apos;s Incorrect Work:
                      </p>
                      <MathBlock latex={q.flawedWorkLatex} display />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const picked = mcqChoice[q.id] === optIdx;
                      const isRight = q.correctIndex === optIdx;
                      let cls = 'border-slate-200 bg-white hover:border-[#0D9488] text-slate-800';
                      if (isChecked) {
                        if (isRight) {
                          cls = 'border-[#0D9488] bg-teal-50 text-[#0F294A] font-medium';
                        } else if (picked) {
                          cls = 'border-rose-400 bg-rose-50 text-rose-900';
                        }
                      } else if (picked) {
                        cls = 'border-[#0F294A] bg-slate-100 ring-1 ring-[#0F294A] text-[#0F294A]';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isChecked}
                          aria-pressed={!isChecked ? picked : undefined}
                          onClick={() =>
                            setMcqChoice((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                          className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors flex items-center justify-between gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${cls}`}
                        >
                          <span className="flex items-start gap-3 min-w-0">
                            <span className="font-mono-num text-xs text-slate-600 mt-0.5 shrink-0">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span className="min-w-0">
                              <RichMathText text={opt} />
                            </span>
                          </span>
                          {isChecked && isRight && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] shrink-0">
                              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                              <span>Correct</span>
                            </span>
                          )}
                          {isChecked && picked && !isRight && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 shrink-0">
                              <XCircle className="w-4 h-4" aria-hidden="true" />
                              <span>Your choice</span>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TYPE B: True or False */}
              {q.type === 'true-false' && (
                <div className="space-y-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm sm:text-base text-slate-900">
                    <RichMathText text={q.statement} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    {[true, false].map((val) => {
                      const picked = tfChoice[q.id] === val;
                      const isRight = q.correctBoolean === val;
                      let cls = 'border-slate-200 bg-white hover:border-[#0D9488] text-slate-800';
                      if (isChecked) {
                        if (isRight) {
                          cls = 'border-[#0D9488] bg-teal-50 text-[#0F294A] font-semibold';
                        } else if (picked) {
                          cls = 'border-rose-400 bg-rose-50 text-rose-900';
                        }
                      } else if (picked) {
                        cls = 'border-[#0F294A] bg-slate-100 ring-1 ring-[#0F294A] font-semibold';
                      }
                      return (
                        <button
                          key={String(val)}
                          type="button"
                          disabled={isChecked}
                          aria-pressed={!isChecked ? picked : undefined}
                          onClick={() => setTfChoice((prev) => ({ ...prev, [q.id]: val }))}
                          className={`px-4 py-3 rounded-lg border text-sm transition-colors inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${cls}`}
                        >
                          <span>{val ? 'True' : 'False'}</span>
                          {isChecked && isRight && (
                            <CheckCircle2 className="w-4 h-4 text-[#0D9488]" aria-label="Correct" />
                          )}
                          {isChecked && picked && !isRight && (
                            <XCircle className="w-4 h-4 text-rose-700" aria-label="Your incorrect choice" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TYPE C & TYPE E: Fill in the Blanks / Solve the Problem */}
              {(q.type === 'fill-blank' || q.type === 'solve-problem') && (
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    inputMode={q.type === 'solve-problem' ? 'text' : 'text'}
                    disabled={isChecked}
                    aria-label={
                      q.type === 'fill-blank' ? 'Fill in the blank answer' : 'Numerical answer'
                    }
                    placeholder={
                      q.type === 'fill-blank'
                        ? 'Type your answer...'
                        : 'Enter number or fraction (e.g. -4 or 1/2)'
                    }
                    value={textInput[q.id] ?? ''}
                    onChange={(e) =>
                      setTextInput((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && canCheck(q)) {
                        e.preventDefault();
                        handleCheckQuestion(q);
                      }
                    }}
                    className="w-full sm:w-72 min-h-[42px] rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 font-mono-num text-sm text-[#0F294A] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:bg-white"
                  />
                  {q.type === 'solve-problem' && q.unitLabel && (
                    <span className="text-sm text-slate-600">{q.unitLabel}</span>
                  )}
                </div>
              )}

              {/* Action Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {!isChecked ? (
                  <button
                    type="button"
                    disabled={!canCheck(q)}
                    onClick={() => handleCheckQuestion(q)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      canCheck(q)
                        ? 'bg-[#0F294A] text-white hover:bg-[#163864]'
                        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Check Answer
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      {status === 'correct' ? (
                        <span className="inline-flex items-center gap-1.5 text-[#0D9488]">
                          <CheckCircle2 className="w-4 h-4" />
                          Correct!
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-rose-700">
                          <XCircle className="w-4 h-4" />
                          Incorrect — review the explanation below.
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRetryQuestion(q.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry Question</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Feedback & Worked Solution */}
              {isChecked && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-sm text-slate-700">
                  {(q.type === 'fill-blank' || q.type === 'solve-problem') && (
                    <p>
                      <strong className="text-[#0F294A]">Expected Answer: </strong>
                      <span className="font-mono-num font-semibold text-[#0D9488]">
                        {q.displayAnswer}
                      </span>
                    </p>
                  )}
                  <p>
                    <strong className="text-[#0F294A]">Explanation: </strong>
                    <RichMathText text={q.explanation} />
                  </p>
                  {q.type === 'find-error' && (
                    <div className="bg-white border border-slate-200 rounded-lg p-3 overflow-x-auto">
                      <p className="text-xs font-semibold text-[#0F766E] mb-1">
                        Correct Procedure:
                      </p>
                      <MathBlock latex={q.correctProcedureLatex} display />
                    </div>
                  )}
                  {q.type === 'solve-problem' && (
                    <div className="bg-white border border-slate-200 rounded-lg p-3 overflow-x-auto">
                      <p className="text-xs font-semibold text-[#0F766E] mb-1">Worked Solution:</p>
                      <MathBlock latex={q.workedSolutionLatex} display />
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
