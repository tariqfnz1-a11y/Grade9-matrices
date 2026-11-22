import {
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  Printer,
  RotateCcw,
  RotateCw,
  XCircle,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { MathBlock, RichMathText } from '../components/MathBlock';
import {
  ADJOINT_INVERSE_SUMMARY,
  ALL_IMPORTANT_FORMULAS,
  buildDownloadableRevisionText,
  COMMON_EXAM_MISTAKES,
  CRAMERS_RULE_SUMMARY,
  DETERMINANT_RULES,
  EXPANDED_REVISION_CARDS,
  IMPORTANT_DEFINITIONS,
  IMPORTANT_MCQ_FACTS,
  MATRIX_CLASSIFICATION_TABLE,
  MATRIX_INVERSION_SUMMARY,
  MATRIX_OPERATION_PROPERTIES,
  REVISION_SELF_TESTS,
} from '../data/quickRevisionData';
import { TOPIC_LABELS } from '../data/unit1Content';
import type { StudentProgress, TopicId } from '../types/curriculum';

interface QuickRevisionViewProps {
  progress: StudentProgress;
  onMarkFlashcard: (cardId: string) => void;
}

type RevisionTab = 'one-page' | 'flashcards' | 'self-test';

export const QuickRevisionView: React.FC<QuickRevisionViewProps> = ({
  progress,
  onMarkFlashcard,
}) => {
  const [activeTab, setActiveTab] = useState<RevisionTab>('one-page');

  // Flashcards state
  const [cardFilter, setCardFilter] = useState<TopicId | 'all'>('all');
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});

  // Click-to-reveal MCQ facts state
  const [revealedFacts, setRevealedFacts] = useState<Record<string, boolean>>({});
  const [revealAllFacts, setRevealAllFacts] = useState(false);

  // Self-test activity state
  const [selfTestAnswers, setSelfTestAnswers] = useState<Record<string, number>>({});

  const filteredCards = useMemo(
    () =>
      EXPANDED_REVISION_CARDS.filter(
        (c) => cardFilter === 'all' || c.topicId === cardFilter
      ),
    [cardFilter]
  );

  const handleFlip = (id: string) => {
    setFlippedIds((prev) => {
      const next = !prev[id];
      if (next) {
        onMarkFlashcard(id);
      }
      return { ...prev, [id]: next };
    });
  };

  const handleToggleRevealAll = () => {
    const next = !revealAllFacts;
    setRevealAllFacts(next);
    if (next) {
      const allOpen: Record<string, boolean> = {};
      IMPORTANT_MCQ_FACTS.forEach((f) => {
        allOpen[f.id] = true;
      });
      setRevealedFacts(allOpen);
    } else {
      setRevealedFacts({});
    }
  };

  const handleDownloadSummary = () => {
    const content = buildDownloadableRevisionText();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'grade9-unit1-quick-revision-summary.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintSheet = () => {
    if (activeTab !== 'one-page') {
      setActiveTab('one-page');
      window.setTimeout(() => window.print(), 120);
    } else {
      window.print();
    }
  };

  const selfTestAnsweredCount = Object.keys(selfTestAnswers).length;
  const selfTestCorrectCount = REVISION_SELF_TESTS.filter(
    (q) => selfTestAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="space-y-8">
      {/* Header & Print/Download Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-medium text-[#0D9488]">
            Module 07 · Complete Unit 1 Quick Revision Centre
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F294A] mt-1">
            Quick Revision Centre
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            One-page syllabus summary, 12-type matrix classification, formulas, flashcards,
            click-to-reveal MCQ facts, and print/download revision sheets.
          </p>
        </div>

        <div className="print:hidden flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrintSheet}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#0F294A] bg-white border border-slate-300 rounded-lg hover:bg-slate-50 whitespace-nowrap"
          >
            <Printer className="w-4 h-4 text-[#0D9488]" />
            <span>Print Revision Sheet</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadSummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864] whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Download Summary (.txt)</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Quick Revision study modes"
          className="inline-flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-xl"
        >
          {(
            [
              ['one-page', 'One-Page Revision Notes (Sections 1–10)'],
              ['flashcards', `Formula Flashcards (${EXPANDED_REVISION_CARDS.length})`],
              ['self-test', `Self-Testing Activities (${REVISION_SELF_TESTS.length})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === id
                  ? 'bg-white text-[#0F294A] shadow-sm'
                  : 'text-slate-600 hover:text-[#0F294A]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono-num text-slate-600 tabular-nums">
          Flashcards Reviewed: {progress.flashcardsReviewed.length} / {EXPANDED_REVISION_CARDS.length}
        </span>
      </div>

      {/* ============================================================
          TAB 1: ONE-PAGE REVISION NOTES (ALL 10 SECTIONS + PRINTABLE)
      ============================================================ */}
      {activeTab === 'one-page' && (
        <div className="space-y-8">
          {/* Quick Section Jump Links (hidden in print) */}
          <nav
            aria-label="One-page revision sections"
            className="print:hidden bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-2 text-xs"
          >
            {[
              ['#rev-sec-1', '1. Definitions'],
              ['#rev-sec-2', '2. Classification Table'],
              ['#rev-sec-3', '3. Formulas'],
              ['#rev-sec-4', '4. Operation Properties'],
              ['#rev-sec-5', '5. Determinant Rules'],
              ['#rev-sec-6', '6. Adjoint & Inverse'],
              ['#rev-sec-7', "7. Cramer's Rule"],
              ['#rev-sec-8', '8. Inversion Method'],
              ['#rev-sec-9', '9. Exam Mistakes'],
              ['#rev-sec-10', '10. MCQ Facts'],
            ].map(([href, text]) => (
              <a
                key={href}
                href={href}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[#0F294A] font-medium hover:border-[#0D9488] hover:text-[#0D9488]"
              >
                {text}
              </a>
            ))}
          </nav>

          {/* 1. IMPORTANT DEFINITIONS */}
          <section id="rev-sec-1" className="space-y-3 print-avoid-break">
            <h2 className="font-display text-xl font-bold text-[#0F294A]">
              1. Important Definitions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {IMPORTANT_DEFINITIONS.map((def) => (
                <article
                  key={def.term}
                  className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 print-avoid-break"
                >
                  <h3 className="font-display text-sm font-bold text-[#0F294A]">{def.term}</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <RichMathText text={def.definition} />
                  </p>
                  {def.formulaLatex && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 overflow-x-auto">
                      <MathBlock latex={def.formulaLatex} />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* 2. MATRIX CLASSIFICATION TABLE */}
          <section id="rev-sec-2" className="space-y-3 print-avoid-break">
            <h2 className="font-display text-xl font-bold text-[#0F294A]">
              2. Matrix Classification Table (12 Types)
            </h2>
            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Matrix Type</th>
                    <th className="px-4 py-3 font-semibold">Defining Condition</th>
                    <th className="px-4 py-3 font-semibold">Example</th>
                    <th className="px-4 py-3 font-semibold">Key Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {MATRIX_CLASSIFICATION_TABLE.map((row) => (
                    <tr key={row.type}>
                      <td className="px-4 py-3 font-semibold text-[#0F294A] whitespace-nowrap">
                        <RichMathText text={row.type} />
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <RichMathText text={row.condition} />
                      </td>
                      <td className="px-4 py-3">
                        <MathBlock latex={row.exampleLatex} />
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <RichMathText text={row.note} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. ALL IMPORTANT FORMULAS */}
          <section id="rev-sec-3" className="space-y-3 print-avoid-break">
            <h2 className="font-display text-xl font-bold text-[#0F294A]">
              3. All Important Formulas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ALL_IMPORTANT_FORMULAS.map((f) => (
                <div
                  key={f.title}
                  className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 print-avoid-break"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0F294A]">{f.title}</span>
                    <span className="font-mono-num text-[#0D9488]">{f.exercise}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-x-auto">
                    <MathBlock latex={f.latex} display />
                  </div>
                  <p className="text-xs text-slate-600">
                    <RichMathText text={f.note} />
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. PROPERTIES OF MATRIX OPERATIONS */}
          <section id="rev-sec-4" className="space-y-3 print-avoid-break">
            <h2 className="font-display text-xl font-bold text-[#0F294A]">
              4. Properties of Matrix Operations
            </h2>
            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Property / Law</th>
                    <th className="px-4 py-3 font-semibold">Mathematical Statement</th>
                    <th className="px-4 py-3 font-semibold">Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {MATRIX_OPERATION_PROPERTIES.map((prop) => (
                    <tr key={prop.name}>
                      <td className="px-4 py-3 font-medium text-[#0D9488] whitespace-nowrap">
                        {prop.group}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#0F294A]">{prop.name}</td>
                      <td className="px-4 py-3">
                        <MathBlock latex={prop.latex} />
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <RichMathText text={prop.condition} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. DETERMINANT RULES */}
          <section id="rev-sec-5" className="space-y-3 print-avoid-break">
            <h2 className="font-display text-xl font-bold text-[#0F294A]">
              5. Determinant Rules (2×2 Matrices)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DETERMINANT_RULES.map((rule) => (
                <article
                  key={rule.title}
                  className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 print-avoid-break"
                >
                  <h3 className="font-display text-sm font-bold text-[#0F294A]">{rule.title}</h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 overflow-x-auto">
                    <MathBlock latex={rule.latex} display />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <RichMathText text={rule.explanation} />
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* 6. ADJOINT AND INVERSE FORMULAS */}
          <section id="rev-sec-6" className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 print-avoid-break">
            <h2 className="font-display text-xl font-bold text-[#0F294A]">
              6. Adjoint and Multiplicative Inverse Formulas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 overflow-x-auto">
                <p className="text-xs font-semibold text-[#0F294A]">Matrix &amp; Adjoint</p>
                <MathBlock latex={ADJOINT_INVERSE_SUMMARY.matrixLatex} display />
                <MathBlock latex={ADJOINT_INVERSE_SUMMARY.adjLatex} display />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 overflow-x-auto">
                <p className="text-xs font-semibold text-[#0F294A]">Inverse Formula &amp; Check</p>
                <MathBlock latex={ADJOINT_INVERSE_SUMMARY.invLatex} display />
                <MathBlock latex={ADJOINT_INVERSE_SUMMARY.verifyLatex} display />
              </div>
            </div>
            <ul className="text-xs sm:text-sm text-slate-700 space-y-1 list-disc pl-5">
              {ADJOINT_INVERSE_SUMMARY.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {/* 7 & 8. CRAMER'S RULE & MATRIX INVERSION METHOD */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section
              id="rev-sec-7"
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 print-avoid-break"
            >
              <h2 className="font-display text-xl font-bold text-[#0F294A]">
                7. Cramer’s Rule Formulas
              </h2>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-x-auto space-y-2">
                <MathBlock latex={CRAMERS_RULE_SUMMARY.systemLatex} display />
                <MathBlock latex={CRAMERS_RULE_SUMMARY.matricesLatex} display />
                <MathBlock latex={CRAMERS_RULE_SUMMARY.solutionLatex} display />
              </div>
              <ol className="text-xs sm:text-sm text-slate-700 space-y-1 list-decimal pl-5">
                {CRAMERS_RULE_SUMMARY.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>

            <section
              id="rev-sec-8"
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 print-avoid-break"
            >
              <h2 className="font-display text-xl font-bold text-[#0F294A]">
                8. Matrix Inversion Method
              </h2>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-x-auto space-y-2">
                <MathBlock latex={MATRIX_INVERSION_SUMMARY.equationLatex} display />
                <MathBlock latex={MATRIX_INVERSION_SUMMARY.solveLatex} display />
              </div>
              <ol className="text-xs sm:text-sm text-slate-700 space-y-1 list-decimal pl-5">
                {MATRIX_INVERSION_SUMMARY.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          </div>

          {/* 9. COMMON EXAMINATION MISTAKES */}
          <section id="rev-sec-9" className="space-y-3 print-avoid-break">
            <h2 className="font-display text-xl font-bold text-[#0F294A]">
              9. Common Examination Mistakes to Avoid
            </h2>
            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Topic</th>
                    <th className="px-4 py-3 font-semibold">Common Mistake</th>
                    <th className="px-4 py-3 font-semibold">Correct Examination Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {COMMON_EXAM_MISTAKES.map((row) => (
                    <tr key={row.topic}>
                      <td className="px-4 py-3 font-semibold text-[#0F294A] whitespace-nowrap">
                        {row.topic}
                      </td>
                      <td className="px-4 py-3 text-rose-800">{row.mistake}</td>
                      <td className="px-4 py-3 text-slate-700">{row.correction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 10. IMPORTANT MCQ FACTS (CLICK-TO-REVEAL) */}
          <section id="rev-sec-10" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-[#0F294A]">
                  10. Important Board MCQ Facts (Click-to-Reveal)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Test your recall before clicking Reveal Answer. All answers print automatically
                  on paper.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleRevealAll}
                className="print:hidden inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#0F294A] bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                {revealAllFacts ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide All Answers</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Reveal All Answers</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {IMPORTANT_MCQ_FACTS.map((fact, idx) => {
                const isOpen = !!revealedFacts[fact.id];
                return (
                  <article
                    key={fact.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 print-avoid-break"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-[#0F294A]">
                        <span className="font-mono-num text-xs text-[#0D9488] mr-1.5">
                          #{idx + 1}
                        </span>
                        <RichMathText text={fact.prompt} />
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setRevealedFacts((prev) => ({ ...prev, [fact.id]: !prev[fact.id] }))
                      }
                      className="print:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F294A] bg-slate-100 rounded-lg hover:bg-slate-200"
                    >
                      {isOpen ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hide Answer</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Click to Reveal Answer</span>
                        </>
                      )}
                    </button>

                    <div
                      className={`${
                        isOpen ? 'block' : 'hidden print:block'
                      } bg-teal-50/70 border border-teal-200 rounded-lg p-3 space-y-1.5 text-xs`}
                    >
                      <p className="font-semibold text-[#0F294A]">
                        Answer: <RichMathText text={fact.revealAnswer} />
                      </p>
                      {fact.revealLatex && (
                        <div className="bg-white border border-teal-100 rounded px-2.5 py-1 overflow-x-auto">
                          <MathBlock latex={fact.revealLatex} />
                        </div>
                      )}
                      <p className="text-slate-700">
                        <RichMathText text={fact.reason} />
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ============================================================
          TAB 2: FORMULA FLASHCARDS
      ============================================================ */}
      {activeTab === 'flashcards' && (
        <section className="space-y-5">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setCardFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${
                cardFilter === 'all'
                  ? 'border-[#0F294A] bg-[#0F294A] text-white'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              All Exercises ({EXPANDED_REVISION_CARDS.length})
            </button>
            {(Object.keys(TOPIC_LABELS) as TopicId[]).map((tid) => (
              <button
                key={tid}
                type="button"
                onClick={() => setCardFilter(tid)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${
                  cardFilter === tid
                    ? 'border-[#0F294A] bg-[#0F294A] text-white'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                {TOPIC_LABELS[tid].exercise}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card) => {
              const flipped = !!flippedIds[card.id];
              const reviewed = progress.flashcardsReviewed.includes(card.id);

              return (
                <button
                  key={card.id}
                  type="button"
                  aria-pressed={flipped}
                  onClick={() => handleFlip(card.id)}
                  className={`text-left rounded-xl border p-5 min-h-[220px] flex flex-col justify-between transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                    flipped
                      ? 'bg-[#0F294A] text-white border-[#0F294A]'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-[#0D9488]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className={flipped ? 'text-teal-200' : 'text-slate-500'}>
                      {TOPIC_LABELS[card.topicId].exercise}
                    </span>
                    {reviewed && (
                      <span
                        className={`inline-flex items-center gap-1 ${
                          flipped ? 'text-teal-300' : 'text-[#0D9488]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Reviewed
                      </span>
                    )}
                  </div>

                  <div className="my-3 space-y-2">
                    <h3
                      className={`font-display text-base font-bold ${
                        flipped ? 'text-white' : 'text-[#0F294A]'
                      }`}
                    >
                      {card.frontTitle}
                    </h3>
                    {!flipped ? (
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <RichMathText text={card.frontPrompt} />
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-slate-100 leading-relaxed">
                          <RichMathText text={card.backAnswer} />
                        </p>
                        {card.backLatex && (
                          <div className="bg-white/10 rounded px-2.5 py-1.5 text-white overflow-x-auto">
                            <MathBlock latex={card.backLatex} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      flipped ? 'text-teal-200' : 'text-[#0D9488]'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{flipped ? 'Click to show prompt' : 'Click to flip answer'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ============================================================
          TAB 3: SHORT SELF-TESTING ACTIVITIES
      ============================================================ */}
      {activeTab === 'self-test' && (
        <section className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0F294A]">
                Rapid Formula &amp; Concept Self-Check
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Attempt all {REVISION_SELF_TESTS.length} quick checks below for immediate
                explanations.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono-num text-sm font-bold text-[#0F294A] tabular-nums">
                Score: {selfTestCorrectCount} / {selfTestAnsweredCount} answered
              </span>
              <button
                type="button"
                onClick={() => setSelfTestAnswers({})}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Activity</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REVISION_SELF_TESTS.map((q, idx) => {
              const picked = selfTestAnswers[q.id];
              const isAnswered = picked !== undefined;
              const isCorrect = picked === q.correctIndex;

              return (
                <article
                  key={q.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Check {idx + 1} · {TOPIC_LABELS[q.topicId].exercise}
                    </span>
                    {isAnswered && (
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          isCorrect ? 'text-[#0D9488]' : 'text-rose-700'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> Review
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-[#0F294A]">
                    <RichMathText text={q.prompt} />
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isPicked = picked === optIdx;
                      const isRight = q.correctIndex === optIdx;
                      let cls = 'border-slate-200 bg-white hover:border-[#0D9488] text-slate-800';
                      if (isAnswered) {
                        if (isRight) cls = 'border-[#0D9488] bg-teal-50 text-[#0F294A] font-medium';
                        else if (isPicked) cls = 'border-rose-400 bg-rose-50 text-rose-900';
                      }
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() =>
                            setSelfTestAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                          className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors flex items-center justify-between gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${cls}`}
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <span className="font-mono-num text-xs text-slate-600 shrink-0">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span className="min-w-0">
                              <RichMathText text={opt} />
                            </span>
                          </span>
                          {isAnswered && isRight && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Correct</span>
                            </span>
                          )}
                          {isAnswered && isPicked && !isRight && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 shrink-0">
                              <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Your choice</span>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <strong className="text-[#0F294A]">Explanation: </strong>
                      <RichMathText text={q.explanation} />
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
