import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  FileText,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Settings2,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { MathBlock, RichMathText } from '../components/MathBlock';
import {
  BOARD_CATEGORY_LABELS,
  type BoardBankCategory,
  type BoardExamConfig,
  computeConfigTotalMarks,
  DEFAULT_PUNJAB_BOARD_CONFIG,
} from '../data/boardExamConfig';
import {
  BOARD_LONG_BANK,
  BOARD_MCQ_BANK,
  BOARD_SHORT_BANK,
  type GeneratedBoardPaper,
  generateBoardPaper,
} from '../data/boardQuestionBank';
import type { StudentProgress } from '../types/curriculum';

interface BoardPrepViewProps {
  progress: StudentProgress;
  onMarkChecked: (questionId: string) => void;
}

type PrepTab = 'paper' | 'bank-explorer';
type PaperPhase = 'setup' | 'active' | 'grading';
type PaperSectionTab = 'objective' | 'Q2' | 'Q3' | 'Q4' | 'long' | 'unanswered';

export const BoardPrepView: React.FC<BoardPrepViewProps> = ({
  progress,
  onMarkChecked,
}) => {
  const [prepTab, setPrepTab] = useState<PrepTab>('paper');

  // Configurable Exam Blueprint
  const [config, setConfig] = useState<BoardExamConfig>(() =>
    structuredClone(DEFAULT_PUNJAB_BOARD_CONFIG)
  );
  const [showConfigEditor, setShowConfigEditor] = useState(false);

  // Active Practice Paper State
  const [phase, setPhase] = useState<PaperPhase>('setup');
  const [paperSeed, setPaperSeed] = useState(1);
  const [paper, setPaper] = useState<GeneratedBoardPaper>(() =>
    generateBoardPaper(DEFAULT_PUNJAB_BOARD_CONFIG, 1)
  );
  const [activeSection, setActiveSection] = useState<PaperSectionTab>('objective');

  // Countdown Timer
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_PUNJAB_BOARD_CONFIG.durationMinutes * 60);
  const [timerPaused, setTimerPaused] = useState(false);

  // Student Paper Responses
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [activeMcqIdx, setActiveMcqIdx] = useState(0);
  const [selectedShorts, setSelectedShorts] = useState<Record<'Q2' | 'Q3' | 'Q4', string[]>>({
    Q2: [],
    Q3: [],
    Q4: [],
  });
  const [shortScratch, setShortScratch] = useState<Record<string, string>>({});
  const [selectedLongs, setSelectedLongs] = useState<string[]>([]);
  const [longScratch, setLongScratch] = useState<Record<string, string>>({});

  // Subjective Self-Marking State
  const [shortSelfMarks, setShortSelfMarks] = useState<Record<string, number>>({});
  const [longRubricChecks, setLongRubricChecks] = useState<Record<string, boolean>>({});

  // Bank Explorer State
  const [explorerCategory, setExplorerCategory] = useState<BoardBankCategory | 'all'>('all');
  const [explorerMcqPicked, setExplorerMcqPicked] = useState<Record<string, number>>({});
  const [explorerRevealed, setExplorerRevealed] = useState<Record<string, boolean>>({});

  const configTotals = useMemo(() => computeConfigTotalMarks(config), [config]);

  // Countdown timer effect
  useEffect(() => {
    if (phase !== 'active' || timerPaused) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, timerPaused]);

  const formatCountdown = (totalSec: number): string => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartPaper = (nextSeed = paperSeed + 1) => {
    const generated = generateBoardPaper(config, nextSeed);
    setPaperSeed(nextSeed);
    setPaper(generated);
    setMcqAnswers({});
    setActiveMcqIdx(0);
    setSelectedShorts({ Q2: [], Q3: [], Q4: [] });
    setShortScratch({});
    setSelectedLongs([]);
    setLongScratch({});
    setShortSelfMarks({});
    setLongRubricChecks({});
    setSecondsLeft(config.durationMinutes * 60);
    setTimerPaused(false);
    setActiveSection('objective');
    setPhase('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleShortSelect = (
    groupId: 'Q2' | 'Q3' | 'Q4',
    qId: string,
    maxRequired: number
  ) => {
    setSelectedShorts((prev) => {
      const current = prev[groupId];
      if (current.includes(qId)) {
        return { ...prev, [groupId]: current.filter((id) => id !== qId) };
      }
      if (current.length >= maxRequired) return prev;
      return { ...prev, [groupId]: [...current, qId] };
    });
  };

  const handleToggleLongSelect = (qId: string, maxRequired: number) => {
    setSelectedLongs((prev) => {
      if (prev.includes(qId)) return prev.filter((id) => id !== qId);
      if (prev.length >= maxRequired) return prev;
      return [...prev, qId];
    });
  };

  const handleSubmitPaper = () => {
    paper.objectiveMcqs.forEach((m) => onMarkChecked(m.id));
    setPhase('grading');
    setActiveSection('objective');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Unanswered summary during active exam
  const unansweredMcqs = paper.objectiveMcqs
    .map((q, idx) => ({ q, idx }))
    .filter(({ q }) => mcqAnswers[q.id] === undefined);

  const incompleteShortGroups = paper.shortGroups.filter(
    (g) => selectedShorts[g.groupId].length < g.attemptRequired
  );
  const longRemaining = Math.max(0, paper.config.longSection.attemptRequired - selectedLongs.length);

  // Grading Calculations
  const objectiveEarned = paper.objectiveMcqs.reduce((sum, q) => {
    return (
      sum + (mcqAnswers[q.id] === q.correctIndex ? paper.config.objective.marksPerQuestion : 0)
    );
  }, 0);

  const shortEarned = paper.shortGroups.reduce((sum, g) => {
    const chosen = selectedShorts[g.groupId];
    return (
      sum +
      chosen.reduce((gs, qId) => {
        const key = `${g.groupId}:${qId}`;
        return gs + (shortSelfMarks[key] ?? 0);
      }, 0)
    );
  }, 0);

  const longEarned = selectedLongs.reduce((sum, qId) => {
    const item = paper.longQuestions.find((l) => l.id === qId);
    if (!item) return sum;
    const partAMarks = item.partA.rubricSteps.reduce(
      (s, _, i) => s + (longRubricChecks[`${qId}:A:${i}`] ? 1 : 0),
      0
    );
    const partBMarks = item.partB.rubricSteps.reduce(
      (s, _, i) => s + (longRubricChecks[`${qId}:B:${i}`] ? 1 : 0),
      0
    );
    return sum + partAMarks + partBMarks;
  }, 0);

  const paperTotals = computeConfigTotalMarks(paper.config);
  const finalTotalEarned = objectiveEarned + shortEarned + longEarned;
  const finalPercent =
    paperTotals.totalMarks > 0
      ? Math.round((finalTotalEarned / paperTotals.totalMarks) * 100)
      : 0;

  // 10-Category Topic-Wise Performance Breakdown
  const categoryBreakdown = useMemo(() => {
    const map: Record<BoardBankCategory, { earned: number; max: number }> = {
      'conceptual-mcqs': { earned: 0, max: 0 },
      'definitions-properties': { earned: 0, max: 0 },
      'add-sub': { earned: 0, max: 0 },
      multiplication: { earned: 0, max: 0 },
      determinants: { earned: 0, max: 0 },
      'singular-nonsingular': { earned: 0, max: 0 },
      'adjoint-inverse': { earned: 0, max: 0 },
      'cramers-rule': { earned: 0, max: 0 },
      'matrix-inversion': { earned: 0, max: 0 },
      'simultaneous-equations': { earned: 0, max: 0 },
    };

    paper.objectiveMcqs.forEach((m) => {
      const pts = paper.config.objective.marksPerQuestion;
      map[m.bankCategory].max += pts;
      if (mcqAnswers[m.id] === m.correctIndex) {
        map[m.bankCategory].earned += pts;
      }
    });

    paper.shortGroups.forEach((g) => {
      selectedShorts[g.groupId].forEach((qId) => {
        const item = g.questions.find((q) => q.id === qId);
        if (!item) return;
        map[item.bankCategory].max += g.marksPerQuestion;
        map[item.bankCategory].earned += shortSelfMarks[`${g.groupId}:${qId}`] ?? 0;
      });
    });

    selectedLongs.forEach((qId) => {
      const item = paper.longQuestions.find((l) => l.id === qId);
      if (!item) return;
      map[item.partA.bankCategory].max += item.partA.marks;
      item.partA.rubricSteps.forEach((_, idx) => {
        if (longRubricChecks[`${qId}:A:${idx}`]) map[item.partA.bankCategory].earned += 1;
      });
      map[item.partB.bankCategory].max += item.partB.marks;
      item.partB.rubricSteps.forEach((_, idx) => {
        if (longRubricChecks[`${qId}:B:${idx}`]) map[item.partB.bankCategory].earned += 1;
      });
    });

    return map;
  }, [paper, mcqAnswers, selectedShorts, shortSelfMarks, selectedLongs, longRubricChecks]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-medium text-[#0D9488]">
            Module 08 · Punjab Board Examination Preparation Zone
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F294A] mt-1">
            Board Examination Preparation
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Configurable 75-mark Punjab Board practice paper simulator with countdown timer,
            prescribed question choices, model solutions, and long-question rubrics.
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setPrepTab('paper')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              prepTab === 'paper' ? 'bg-white text-[#0F294A] shadow-sm' : 'text-slate-600'
            }`}
          >
            75-Mark Exam Simulator
          </button>
          <button
            type="button"
            onClick={() => setPrepTab('bank-explorer')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              prepTab === 'bank-explorer' ? 'bg-white text-[#0F294A] shadow-sm' : 'text-slate-600'
            }`}
          >
            10-Topic Bank Explorer
          </button>
        </div>
      </div>

      {/* ============================================================
          MODE A: 75-MARK EXAM SIMULATOR
      ============================================================ */}
      {prepTab === 'paper' && (
        <>
          {/* PHASE 1: SETUP & CONFIGURATOR */}
          {phase === 'setup' && (
            <div className="space-y-6">
              <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Configurable Examination Blueprint</p>
                    <h2 className="font-display text-xl font-bold text-[#0F294A] mt-0.5">
                      {config.examTitle}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setShowConfigEditor((v) => !v)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-[#0F294A] bg-slate-100 rounded-lg hover:bg-slate-200"
                    >
                      <Settings2 className="w-4 h-4" />
                      <span>{showConfigEditor ? 'Hide Settings' : 'Configure Pattern'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartPaper()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864]"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Generate Practice Paper ({configTotals.totalMarks} Marks)</span>
                    </button>
                  </div>
                </div>

                {/* Blueprint Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/70">
                    <p className="text-xs text-slate-500">Part I · Objective</p>
                    <p className="font-display text-lg font-bold text-[#0F294A] mt-1 tabular-nums">
                      {config.objective.totalQuestions} MCQs ({configTotals.objectiveMarks}m)
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {config.objective.marksPerQuestion} mark each · Auto-graded
                    </p>
                  </div>

                  {config.shortGroups.map((grp) => (
                    <div key={grp.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/70">
                      <p className="text-xs text-slate-500">Part II · {grp.id}</p>
                      <p className="font-display text-lg font-bold text-[#0F294A] mt-1 tabular-nums">
                        {grp.attemptRequired} / {grp.totalQuestions} (
                        {grp.attemptRequired * grp.marksPerQuestion}m)
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {grp.marksPerQuestion} marks each · Model solution
                      </p>
                    </div>
                  ))}

                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/70">
                    <p className="text-xs text-slate-500">Part III · Long Qs</p>
                    <p className="font-display text-lg font-bold text-[#0F294A] mt-1 tabular-nums">
                      {config.longSection.attemptRequired} / {config.longSection.totalQuestions} (
                      {configTotals.longMarks}m)
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {config.longSection.marksPerQuestion} marks each · Rubric graded
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {config.longSection.choicePatternNote} Source honesty note: Every question is
                  explicitly tagged as <strong>Textbook-based</strong>,{' '}
                  <strong>Board-style practice</strong>, or <strong>Conceptual practice</strong>.
                </p>

                {/* Configurable Pattern Editor */}
                {showConfigEditor && (
                  <div className="border-t border-slate-200 pt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-sm font-bold text-[#0F294A]">
                        Examination Pattern Settings
                      </h3>
                      <button
                        type="button"
                        onClick={() => setConfig(structuredClone(DEFAULT_PUNJAB_BOARD_CONFIG))}
                        className="text-xs font-medium text-[#0D9488] hover:text-[#0F766E]"
                      >
                        Restore 75-Mark Punjab Board Default
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <label className="block font-medium text-slate-700">
                        Timer Duration (Minutes)
                        <input
                          type="number"
                          min={10}
                          max={240}
                          value={config.durationMinutes}
                          onChange={(e) => {
                            const val = Math.max(10, Math.min(240, Number(e.target.value) || 60));
                            setConfig((c) => ({ ...c, durationMinutes: val }));
                          }}
                          className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 font-mono-num"
                        />
                      </label>

                      <label className="block font-medium text-slate-700">
                        Objective MCQs (max {BOARD_MCQ_BANK.length})
                        <input
                          type="number"
                          min={5}
                          max={BOARD_MCQ_BANK.length}
                          value={config.objective.totalQuestions}
                          onChange={(e) => {
                            const val = Math.max(
                              5,
                              Math.min(BOARD_MCQ_BANK.length, Number(e.target.value) || 15)
                            );
                            setConfig((c) => ({
                              ...c,
                              objective: { ...c.objective, totalQuestions: val },
                            }));
                          }}
                          className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 font-mono-num"
                        />
                      </label>

                      <label className="block font-medium text-slate-700">
                        Short Qs Attempt per Group (out of 9)
                        <input
                          type="number"
                          min={1}
                          max={9}
                          value={config.shortGroups[0].attemptRequired}
                          onChange={(e) => {
                            const val = Math.max(1, Math.min(9, Number(e.target.value) || 6));
                            setConfig((c) => ({
                              ...c,
                              shortGroups: c.shortGroups.map((g) => ({
                                ...g,
                                attemptRequired: val,
                                title: `${g.id} — Short Questions (Attempt ${val} out of ${g.totalQuestions})`,
                              })),
                            }));
                          }}
                          className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 font-mono-num"
                        />
                      </label>

                      <label className="block font-medium text-slate-700">
                        Long Questions Attempt (out of 5)
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={config.longSection.attemptRequired}
                          onChange={(e) => {
                            const val = Math.max(1, Math.min(5, Number(e.target.value) || 3));
                            setConfig((c) => ({
                              ...c,
                              longSection: {
                                ...c.longSection,
                                attemptRequired: val,
                                title: `Part III — Long Questions (Attempt ${val} out of ${c.longSection.totalQuestions})`,
                              },
                            }));
                          }}
                          className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 font-mono-num"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* PHASE 2: ACTIVE PRACTICE PAPER */}
          {phase === 'active' && (
            <div className="space-y-6">
              {/* Countdown Timer & Submission Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border font-mono-num text-sm font-bold ${
                      secondsLeft <= 300
                        ? 'border-rose-300 bg-rose-50 text-rose-800'
                        : 'border-slate-200 bg-slate-50 text-[#0F294A]'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-[#0D9488]" />
                    <span>{formatCountdown(secondsLeft)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTimerPaused((p) => !p)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                  >
                    {timerPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    <span>{timerPaused ? 'Resume' : 'Pause'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSection('unanswered')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>
                      Review Unanswered ({unansweredMcqs.length} MCQs ·{' '}
                      {incompleteShortGroups.length} Short · {longRemaining} Long)
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitPaper}
                    className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#0D9488] rounded-lg hover:bg-[#0F766E]"
                  >
                    Submit & Grade Paper
                  </button>
                </div>
              </div>

              {secondsLeft === 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-rose-900 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    Time is up. Review your selections or click <strong>Submit &amp; Grade Paper</strong> to check answers and mark subjective work.
                  </span>
                </div>
              )}

              {/* Section Navigation Tabs */}
              <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-xl">
                {(
                  [
                    {
                      id: 'objective',
                      label: `Part I: MCQs (${Object.keys(mcqAnswers).length}/${paper.objectiveMcqs.length})`,
                    },
                    ...paper.shortGroups.map((g) => ({
                      id: g.groupId,
                      label: `${g.groupId} (${selectedShorts[g.groupId].length}/${g.attemptRequired})`,
                    })),
                    {
                      id: 'long',
                      label: `Part III: Long (${selectedLongs.length}/${paper.config.longSection.attemptRequired})`,
                    },
                    {
                      id: 'unanswered',
                      label: 'Unanswered Check',
                    },
                  ] as { id: PaperSectionTab; label: string }[]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSection(tab.id)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      activeSection === tab.id
                        ? 'bg-white text-[#0F294A] shadow-sm'
                        : 'text-slate-600 hover:text-[#0F294A]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* PART I: OBJECTIVE MCQs */}
              {activeSection === 'objective' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                    {(() => {
                      const mcq = paper.objectiveMcqs[activeMcqIdx];
                      if (!mcq) return null;
                      return (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-100 pb-3">
                            <span>
                              MCQ {activeMcqIdx + 1} of {paper.objectiveMcqs.length} ·{' '}
                              {paper.config.objective.marksPerQuestion} Mark ·{' '}
                              {BOARD_CATEGORY_LABELS[mcq.bankCategory]}
                            </span>
                            <span className="font-medium text-slate-600">
                              {mcq.sourceLabel} · {mcq.sourceNote}
                            </span>
                          </div>

                          <div className="text-base sm:text-lg font-medium text-[#0F294A]">
                            <RichMathText text={mcq.prompt} />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {mcq.options.map((opt, idx) => {
                              const picked = mcqAnswers[mcq.id] === idx;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  aria-pressed={picked}
                                  onClick={() =>
                                    setMcqAnswers((prev) => ({ ...prev, [mcq.id]: idx }))
                                  }
                                  className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
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
                              disabled={activeMcqIdx === 0}
                              onClick={() => setActiveMcqIdx((i) => Math.max(0, i - 1))}
                              className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-[#0F294A] disabled:opacity-40"
                            >
                              Previous
                            </button>
                            {activeMcqIdx < paper.objectiveMcqs.length - 1 ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMcqIdx((i) =>
                                    Math.min(paper.objectiveMcqs.length - 1, i + 1)
                                  )
                                }
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-[#0F294A] text-white hover:bg-[#163864]"
                              >
                                Next MCQ
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setActiveSection('Q2')}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-[#0D9488] text-white hover:bg-[#0F766E]"
                              >
                                Continue to Part II (Q2)
                              </button>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* MCQ Navigator Palette */}
                  <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                    <p className="text-xs font-semibold text-[#0F294A]">
                      MCQ Navigator (1–{paper.objectiveMcqs.length})
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {paper.objectiveMcqs.map((m, idx) => {
                        const isCurr = idx === activeMcqIdx;
                        const isAns = mcqAnswers[m.id] !== undefined;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setActiveMcqIdx(idx)}
                            aria-current={isCurr ? 'step' : undefined}
                            aria-label={`MCQ ${idx + 1}: ${
                              isCurr ? 'current' : isAns ? 'answered' : 'unanswered'
                            }`}
                            className={`h-10 rounded-lg border font-mono-num text-xs transition-colors inline-flex items-center justify-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                              isCurr
                                ? 'border-[#0F294A] bg-[#0F294A] text-white font-semibold'
                                : isAns
                                  ? 'border-[#0D9488] bg-teal-50 text-[#0F766E] font-medium'
                                  : 'border-slate-200 bg-white text-slate-700'
                            }`}
                          >
                            <span>{idx + 1}</span>
                            {isAns && (
                              <span aria-hidden="true" className="text-[9px]">
                                ●
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-slate-600">
                      Navy: current · Teal with ●: answered · White: unanswered
                    </p>
                  </aside>
                </div>
              )}

              {/* PART II: SHORT QUESTION GROUPS Q2, Q3, Q4 */}
              {(activeSection === 'Q2' || activeSection === 'Q3' || activeSection === 'Q4') &&
                (() => {
                  const grp = paper.shortGroups.find((g) => g.groupId === activeSection);
                  if (!grp) return null;
                  const chosen = selectedShorts[grp.groupId];

                  return (
                    <section className="space-y-4">
                      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h2 className="font-display text-lg font-bold text-[#0F294A]">
                            {grp.title}
                          </h2>
                          <p className="text-xs text-slate-600">
                            Select any {grp.attemptRequired} of the {grp.questions.length} parts (
                            {grp.marksPerQuestion} marks each). You can write working notes below
                            before submitting for model solutions.
                          </p>
                        </div>
                        <span className="font-mono-num text-sm font-semibold text-[#0D9488] tabular-nums">
                          Selected: {chosen.length} / {grp.attemptRequired}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {grp.questions.map((sq, idx) => {
                          const isSelected = chosen.includes(sq.id);
                          const limitReached = chosen.length >= grp.attemptRequired;
                          return (
                            <article
                              key={sq.id}
                              className={`bg-white border rounded-xl p-5 space-y-3 transition-colors ${
                                isSelected ? 'border-[#0D9488] ring-1 ring-[#0D9488]' : 'border-slate-200'
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                                <span>
                                  {grp.groupId} ({idx + 1}) · {grp.marksPerQuestion} Marks ·{' '}
                                  {BOARD_CATEGORY_LABELS[sq.bankCategory]}
                                </span>
                                <span>{sq.sourceLabel}</span>
                              </div>

                              <div className="text-sm sm:text-base font-medium text-[#0F294A]">
                                <RichMathText text={sq.prompt} />
                              </div>

                              <div className="flex items-center justify-between gap-2 pt-1">
                                <button
                                  type="button"
                                  disabled={!isSelected && limitReached}
                                  onClick={() =>
                                    handleToggleShortSelect(grp.groupId, sq.id, grp.attemptRequired)
                                  }
                                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                  isSelected
                                    ? 'bg-[#0D9488] text-white'
                                    : limitReached
                                      ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                                      : 'bg-slate-100 text-[#0F294A] hover:bg-slate-200'
                                }`}
                              >
                                {isSelected ? 'Selected to Attempt' : 'Select to Attempt'}
                              </button>
                            </div>

                            {isSelected && (
                              <textarea
                                rows={2}
                                aria-label={`Working notes for ${grp.groupId} part ${idx + 1}`}
                                placeholder="Optional scratchpad working (solve on paper or type key steps here)..."
                                value={shortScratch[`${grp.groupId}:${sq.id}`] ?? ''}
                                onChange={(e) =>
                                  setShortScratch((prev) => ({
                                    ...prev,
                                    [`${grp.groupId}:${sq.id}`]: e.target.value,
                                  }))
                                }
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                              />
                            )}
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  );
                })()}

              {/* PART III: LONG QUESTIONS */}
              {activeSection === 'long' && (
                <section className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display text-lg font-bold text-[#0F294A]">
                        {paper.config.longSection.title}
                      </h2>
                      <p className="text-xs text-slate-600">
                        {paper.config.longSection.choicePatternNote}
                      </p>
                    </div>
                    <span className="font-mono-num text-sm font-semibold text-[#0D9488] tabular-nums">
                      Selected: {selectedLongs.length} / {paper.config.longSection.attemptRequired}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {paper.longQuestions.map((lq, idx) => {
                      const isSelected = selectedLongs.includes(lq.id);
                      const limitReached =
                        selectedLongs.length >= paper.config.longSection.attemptRequired;
                      return (
                        <article
                          key={lq.id}
                          className={`bg-white border rounded-xl p-6 space-y-4 ${
                            isSelected ? 'border-[#0D9488] ring-1 ring-[#0D9488]' : 'border-slate-200'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                            <span>
                              Question {5 + idx} · {paper.config.longSection.marksPerQuestion} Marks
                              (4 + 4) · {lq.sourceLabel} · {lq.sourceNote}
                            </span>
                            <button
                              type="button"
                              disabled={!isSelected && limitReached}
                              onClick={() =>
                                handleToggleLongSelect(
                                  lq.id,
                                  paper.config.longSection.attemptRequired
                                )
                              }
                              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg ${
                                isSelected
                                  ? 'bg-[#0D9488] text-white'
                                  : limitReached
                                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                                    : 'bg-slate-100 text-[#0F294A] hover:bg-slate-200'
                              }`}
                            >
                              {isSelected ? 'Selected to Attempt' : 'Select Question'}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1">
                              <p className="text-xs font-semibold text-[#0F294A]">
                                Part (a) · 4 Marks · {BOARD_CATEGORY_LABELS[lq.partA.bankCategory]}
                              </p>
                              <p className="text-sm text-slate-900">
                                <RichMathText text={lq.partA.prompt} />
                              </p>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1">
                              <p className="text-xs font-semibold text-[#0F294A]">
                                Part (b) · 4 Marks · {BOARD_CATEGORY_LABELS[lq.partB.bankCategory]}
                              </p>
                              <p className="text-sm text-slate-900">
                                <RichMathText text={lq.partB.prompt} />
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <textarea
                              rows={3}
                              aria-label={`Working notes for Long Question ${5 + idx}`}
                              placeholder="Optional scratchpad for Part (a) and Part (b) key steps..."
                              value={longScratch[lq.id] ?? ''}
                              onChange={(e) =>
                                setLongScratch((prev) => ({ ...prev, [lq.id]: e.target.value }))
                              }
                              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                            />
                          )}
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* REVIEW UNANSWERED CHECKLIST */}
              {activeSection === 'unanswered' && (
                <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                  <h2 className="font-display text-lg font-bold text-[#0F294A]">
                    Review Unanswered & Incomplete Sections
                  </h2>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-[#0F294A]">
                      Part I — Unanswered MCQs ({unansweredMcqs.length})
                    </h3>
                    {unansweredMcqs.length === 0 ? (
                      <p className="text-xs text-[#0D9488] font-medium">
                        All {paper.objectiveMcqs.length} MCQs have been answered.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {unansweredMcqs.map(({ q, idx }) => (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => {
                              setActiveMcqIdx(idx);
                              setActiveSection('objective');
                            }}
                            className="px-3 py-1.5 text-xs font-mono-num rounded-lg border border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100"
                          >
                            Jump to MCQ {idx + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <h3 className="text-sm font-semibold text-[#0F294A]">
                      Part II — Short Question Choices
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {paper.shortGroups.map((g) => {
                        const count = selectedShorts[g.groupId].length;
                        const done = count >= g.attemptRequired;
                        return (
                          <button
                            key={g.groupId}
                            type="button"
                            onClick={() => setActiveSection(g.groupId)}
                            className={`text-left p-3.5 rounded-lg border text-xs ${
                              done
                                ? 'border-teal-200 bg-teal-50 text-[#0F766E]'
                                : 'border-amber-200 bg-amber-50 text-amber-950'
                            }`}
                          >
                            <p className="font-bold">{g.groupId}</p>
                            <p className="mt-0.5 tabular-nums">
                              {count} of {g.attemptRequired} selected
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <h3 className="text-sm font-semibold text-[#0F294A]">
                      Part III — Long Question Choices
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveSection('long')}
                      className={`px-4 py-2.5 rounded-lg border text-xs font-medium ${
                        longRemaining === 0
                          ? 'border-teal-200 bg-teal-50 text-[#0F766E]'
                          : 'border-amber-200 bg-amber-50 text-amber-950'
                      }`}
                    >
                      {selectedLongs.length} of {paper.config.longSection.attemptRequired} Long
                      Questions selected — Click to review Part III
                    </button>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* PHASE 3: GRADING, SELF-MARKING RUBRIC & FINAL REPORT */}
          {phase === 'grading' && (
            <div className="space-y-8">
              {/* Final Score Summary */}
              <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      Combined Objective (Auto) + Subjective (Self-Marked) Score
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F294A] mt-1 tabular-nums">
                      Total Score: {finalTotalEarned} / {paperTotals.totalMarks} ({finalPercent}%)
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartPaper(paperSeed + 1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864]"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Generate New Practice Paper</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhase('setup')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Paper Settings</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/70">
                    <p className="text-xs text-slate-500">Part I · Objective (Auto-Graded)</p>
                    <p className="font-display text-xl font-bold text-[#0F294A] mt-1 tabular-nums">
                      {objectiveEarned} / {paperTotals.objectiveMarks}
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/70">
                    <p className="text-xs text-slate-500">Part II · Short Qs (Self-Marked)</p>
                    <p className="font-display text-xl font-bold text-[#0F294A] mt-1 tabular-nums">
                      {shortEarned} / {paperTotals.shortMarks}
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/70">
                    <p className="text-xs text-slate-500">Part III · Long Qs (Rubric-Marked)</p>
                    <p className="font-display text-xl font-bold text-[#0F294A] mt-1 tabular-nums">
                      {longEarned} / {paperTotals.longMarks}
                    </p>
                  </div>
                </div>

                {/* 10-Category Topic Performance Breakdown */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-display text-base font-bold text-[#0F294A]">
                    Topic-Wise Performance Across Unit 1 Bank
                  </h3>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                        <tr>
                          <th className="px-4 py-2.5 font-semibold">Topic Category</th>
                          <th className="px-4 py-2.5 font-semibold">Marks Earned</th>
                          <th className="px-4 py-2.5 font-semibold">Accuracy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {(Object.keys(BOARD_CATEGORY_LABELS) as BoardBankCategory[]).map((cat) => {
                          const entry = categoryBreakdown[cat];
                          if (entry.max === 0) return null;
                          const pct = Math.round((entry.earned / entry.max) * 100);
                          return (
                            <tr key={cat}>
                              <td className="px-4 py-2.5 font-medium text-[#0F294A]">
                                {BOARD_CATEGORY_LABELS[cat]}
                              </td>
                              <td className="px-4 py-2.5 font-mono-num tabular-nums">
                                {entry.earned} / {entry.max}
                              </td>
                              <td className="px-4 py-2.5 font-mono-num tabular-nums text-[#0D9488] font-semibold">
                                {pct}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Part I Objective Review */}
              <section className="space-y-3">
                <h3 className="font-display text-lg font-bold text-[#0F294A]">
                  Part I — Objective Answer Key & Explanations
                </h3>
                <div className="space-y-3">
                  {paper.objectiveMcqs.map((m, idx) => {
                    const picked = mcqAnswers[m.id];
                    const isCorrect = picked === m.correctIndex;
                    return (
                      <article
                        key={m.id}
                        className="bg-white border border-slate-200 rounded-xl p-5 space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                          <span>
                            MCQ {idx + 1} · {BOARD_CATEGORY_LABELS[m.bankCategory]} · {m.sourceLabel}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 font-semibold ${
                              isCorrect ? 'text-[#0D9488]' : 'text-rose-700'
                            }`}
                          >
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" /> 1 / 1 Mark
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" /> 0 / 1 Mark
                              </>
                            )}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-[#0F294A]">
                          <RichMathText text={m.prompt} />
                        </p>
                        {!isCorrect && (
                          <p className="text-xs text-rose-800">
                            <strong>Your Choice:</strong>{' '}
                            {picked !== undefined ? (
                              <RichMathText text={m.options[picked]} />
                            ) : (
                              'Not answered'
                            )}
                          </p>
                        )}
                        <p className="text-xs text-slate-700">
                          <strong>Correct Option:</strong>{' '}
                          <RichMathText text={m.options[m.correctIndex]} /> ·{' '}
                          <RichMathText text={m.explanation} />
                        </p>
                      </article>
                    );
                  })}
                </div>
              </section>

              {/* Part II Short Questions Self-Marking */}
              <section className="space-y-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#0F294A]">
                    Part II — Short Questions Model Solutions & Self-Marking
                  </h3>
                  <p className="text-xs text-slate-600">
                    Compare your written solution against each model solution and award 0, 1, or 2
                    marks.
                  </p>
                </div>

                {paper.shortGroups.map((g) => {
                  const chosen = selectedShorts[g.groupId];
                  return (
                    <div key={g.groupId} className="space-y-3">
                      <h4 className="font-display text-sm font-bold text-[#0F294A]">
                        {g.groupId} ({chosen.length} attempted)
                      </h4>
                      {chosen.length === 0 ? (
                        <p className="text-xs text-slate-500">
                          No questions were selected in {g.groupId}.
                        </p>
                      ) : (
                        chosen.map((qId) => {
                          const sq = g.questions.find((q) => q.id === qId);
                          if (!sq) return null;
                          const markKey = `${g.groupId}:${qId}`;
                          const awarded = shortSelfMarks[markKey];
                          return (
                            <article
                              key={markKey}
                              className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                                <span>
                                  {g.groupId} · {BOARD_CATEGORY_LABELS[sq.bankCategory]} ·{' '}
                                  {sq.sourceLabel} ({sq.sourceNote})
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span>Self-Mark:</span>
                                  {[0, 1, 2].map((pts) => (
                                    <button
                                      key={pts}
                                      type="button"
                                      onClick={() =>
                                        setShortSelfMarks((prev) => ({ ...prev, [markKey]: pts }))
                                      }
                                      className={`px-2.5 py-1 rounded font-mono-num text-xs border ${
                                        awarded === pts
                                          ? 'border-[#0D9488] bg-[#0D9488] text-white font-semibold'
                                          : 'border-slate-200 bg-slate-50 text-slate-700'
                                      }`}
                                    >
                                      {pts}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm font-medium text-[#0F294A]">
                                <RichMathText text={sq.prompt} />
                              </p>
                              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-x-auto">
                                <MathBlock latex={sq.modelSolutionLatex} display />
                              </div>
                              <ul className="text-xs text-slate-600 list-disc pl-5 space-y-0.5">
                                {sq.markingPoints.map((mp, idx) => (
                                  <li key={idx}>
                                    <RichMathText text={mp} />
                                  </li>
                                ))}
                              </ul>
                            </article>
                          );
                        })
                      )}
                    </div>
                  );
                })}
              </section>

              {/* Part III Long Questions Rubric Self-Marking */}
              <section className="space-y-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#0F294A]">
                    Part III — Long Questions 8-Mark Self-Marking Rubric
                  </h3>
                  <p className="text-xs text-slate-600">
                    Tick each completed step (1 mark each) in Part (a) and Part (b) to compute your
                    score out of 8 per question.
                  </p>
                </div>

                {selectedLongs.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No long questions were selected in Part III.
                  </p>
                ) : (
                  selectedLongs.map((qId) => {
                    const lq = paper.longQuestions.find((l) => l.id === qId);
                    if (!lq) return null;
                    return (
                      <article
                        key={qId}
                        className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
                      >
                        <p className="text-xs text-slate-500">
                          8 Marks · {lq.sourceLabel} · {lq.sourceNote}
                        </p>

                        {(
                          [
                            { code: 'A' as const, part: lq.partA },
                            { code: 'B' as const, part: lq.partB },
                          ] as const
                        ).map(({ code, part }) => (
                          <div
                            key={code}
                            className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-3"
                          >
                            <p className="text-xs font-bold text-[#0F294A]">
                              Part {part.label} · {part.marks} Marks ·{' '}
                              {BOARD_CATEGORY_LABELS[part.bankCategory]}
                            </p>
                            <p className="text-sm font-medium text-slate-900">
                              <RichMathText text={part.prompt} />
                            </p>
                            <div className="bg-white border border-slate-200 rounded-lg p-3 overflow-x-auto">
                              <MathBlock latex={part.modelSolutionLatex} display />
                            </div>
                            <div className="space-y-1.5">
                              <p className="text-xs font-semibold text-[#0F766E]">
                                Step-Wise Self-Marking Checklist (1 mark per checked step):
                              </p>
                              {part.rubricSteps.map((rs, idx) => {
                                const checkKey = `${qId}:${code}:${idx}`;
                                const checked = !!longRubricChecks[checkKey];
                                return (
                                  <label
                                    key={checkKey}
                                    className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={(e) =>
                                        setLongRubricChecks((prev) => ({
                                          ...prev,
                                          [checkKey]: e.target.checked,
                                        }))
                                      }
                                      className="mt-0.5 accent-[#0D9488]"
                                    />
                                    <span>
                                      {rs.step} <strong>({rs.marks} mark)</strong>
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </article>
                    );
                  })
                )}
              </section>
            </div>
          )}
        </>
      )}

      {/* ============================================================
          MODE B: 10-TOPIC QUESTION BANK EXPLORER
      ============================================================ */}
      {prepTab === 'bank-explorer' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setExplorerCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                explorerCategory === 'all'
                  ? 'bg-white text-[#0F294A] shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              All 10 Categories
            </button>
            {(Object.keys(BOARD_CATEGORY_LABELS) as BoardBankCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setExplorerCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                  explorerCategory === cat
                    ? 'bg-white text-[#0F294A] shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                {BOARD_CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* MCQs in Explorer */}
          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0F294A]">
              Objective MCQs (1 Mark Each)
            </h2>
            {BOARD_MCQ_BANK.filter(
              (m) => explorerCategory === 'all' || m.bankCategory === explorerCategory
            ).map((m) => {
              const picked = explorerMcqPicked[m.id];
              return (
                <article
                  key={m.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>
                      1 Mark · {BOARD_CATEGORY_LABELS[m.bankCategory]} ·{' '}
                      <strong>{m.sourceLabel}</strong> ({m.sourceNote})
                    </span>
                    {progress.boardQuestionsChecked.includes(m.id) && (
                      <span className="text-[#0D9488] font-medium">Practiced</span>
                    )}
                  </div>
                  <p className="text-sm sm:text-base font-medium text-[#0F294A]">
                    <RichMathText text={m.prompt} />
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {m.options.map((opt, idx) => {
                      const isPicked = picked === idx;
                      const isRight = m.correctIndex === idx;
                      let cls = 'border-slate-200 bg-white hover:border-[#0D9488]';
                      if (picked !== undefined) {
                        if (isRight) cls = 'border-[#0D9488] bg-teal-50 text-[#0F294A] font-medium';
                        else if (isPicked) cls = 'border-rose-400 bg-rose-50 text-rose-900';
                      }
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setExplorerMcqPicked((prev) => ({ ...prev, [m.id]: idx }));
                            onMarkChecked(m.id);
                          }}
                          className={`text-left px-3.5 py-2.5 rounded-lg border text-sm flex items-center justify-between gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${cls}`}
                        >
                          <span className="min-w-0">
                            <span className="font-mono-num text-xs text-slate-600 mr-2">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            <RichMathText text={opt} />
                          </span>
                          {picked !== undefined && isRight && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Correct</span>
                            </span>
                          )}
                          {picked !== undefined && isPicked && !isRight && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 shrink-0">
                              <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Your choice</span>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {picked !== undefined && (
                    <p className="text-xs text-slate-700 pt-1">
                      <strong>Explanation: </strong>
                      <RichMathText text={m.explanation} />
                    </p>
                  )}
                </article>
              );
            })}
          </section>

          {/* Short Questions in Explorer */}
          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0F294A]">
              Short Questions (2 Marks Each)
            </h2>
            {BOARD_SHORT_BANK.filter(
              (s) => explorerCategory === 'all' || s.bankCategory === explorerCategory
            ).map((sq) => {
              const open = !!explorerRevealed[sq.id];
              return (
                <article
                  key={sq.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>
                      2 Marks · {BOARD_CATEGORY_LABELS[sq.bankCategory]} ·{' '}
                      <strong>{sq.sourceLabel}</strong> ({sq.sourceNote})
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-medium text-[#0F294A]">
                    <RichMathText text={sq.prompt} />
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setExplorerRevealed((prev) => ({ ...prev, [sq.id]: !prev[sq.id] }));
                      onMarkChecked(sq.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#0F294A] bg-slate-100 rounded-lg hover:bg-slate-200"
                  >
                    {open ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{open ? 'Hide Model Solution' : 'View Model Solution & Rubric'}</span>
                  </button>
                  {open && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                      <MathBlock latex={sq.modelSolutionLatex} display />
                      <ul className="text-xs text-slate-600 list-disc pl-5">
                        {sq.markingPoints.map((mp, idx) => (
                          <li key={idx}>
                            <RichMathText text={mp} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </section>

          {/* Long Questions in Explorer */}
          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0F294A]">
              Long Questions (8 Marks Each · Part a &amp; Part b)
            </h2>
            {(() => {
              const filteredLongs = BOARD_LONG_BANK.filter(
                (lq) =>
                  explorerCategory === 'all' ||
                  lq.partA.bankCategory === explorerCategory ||
                  lq.partB.bankCategory === explorerCategory
              );
              if (filteredLongs.length === 0) {
                return (
                  <p className="text-xs text-slate-500 bg-white border border-slate-200 rounded-xl p-4">
                    No 8-mark long questions are mapped directly to this category; check the MCQs and Short Questions above.
                  </p>
                );
              }
              return filteredLongs.map((lq) => {
                const open = !!explorerRevealed[lq.id];
                return (
                  <article
                    key={lq.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <span>
                        8 Marks (4 + 4) · {BOARD_CATEGORY_LABELS[lq.partA.bankCategory]} &amp;{' '}
                        {BOARD_CATEGORY_LABELS[lq.partB.bankCategory]} ·{' '}
                        <strong>{lq.sourceLabel}</strong> ({lq.sourceNote})
                      </span>
                      {progress.boardQuestionsChecked.includes(lq.id) && (
                        <span className="text-[#0D9488] font-medium">Reviewed</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1">
                        <p className="text-xs font-semibold text-[#0F294A]">
                          Part (a) · {lq.partA.marks} Marks · {BOARD_CATEGORY_LABELS[lq.partA.bankCategory]}
                        </p>
                        <p className="text-sm text-slate-900">
                          <RichMathText text={lq.partA.prompt} />
                        </p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1">
                        <p className="text-xs font-semibold text-[#0F294A]">
                          Part (b) · {lq.partB.marks} Marks · {BOARD_CATEGORY_LABELS[lq.partB.bankCategory]}
                        </p>
                        <p className="text-sm text-slate-900">
                          <RichMathText text={lq.partB.prompt} />
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setExplorerRevealed((prev) => ({ ...prev, [lq.id]: !prev[lq.id] }));
                        onMarkChecked(lq.id);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#0F294A] bg-slate-100 rounded-lg hover:bg-slate-200"
                    >
                      {open ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{open ? 'Hide Model Solution & Rubric' : 'View Model Solution & 8-Mark Rubric'}</span>
                    </button>

                    {open && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[lq.partA, lq.partB].map((part) => (
                          <div
                            key={part.label}
                            className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2"
                          >
                            <p className="text-xs font-bold text-[#0F294A]">
                              Model Solution — Part {part.label} ({part.marks} Marks)
                            </p>
                            <div className="bg-white border border-slate-200 rounded-lg p-3 overflow-x-auto">
                              <MathBlock latex={part.modelSolutionLatex} display />
                            </div>
                            <ul className="text-xs text-slate-600 list-disc pl-5 space-y-0.5">
                              {part.rubricSteps.map((rs, idx) => (
                                <li key={idx}>
                                  {rs.step} <strong>({rs.marks} mark)</strong>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              });
            })()}
          </section>
        </div>
      )}
    </div>
  );
};
