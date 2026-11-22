import { useCallback, useEffect, useState } from 'react';
import { LayoutShell } from './components/LayoutShell';
import { NAV_ITEMS } from './data/unit1Content';
import { ApplicationsView } from './sections/ApplicationsView';
import { BoardPrepView } from './sections/BoardPrepView';
import { DashboardView } from './sections/DashboardView';
import { DiagnosticView } from './sections/DiagnosticView';
import { FinalAssessmentView } from './sections/FinalAssessmentView';
import { LearnConceptsView } from './sections/LearnConceptsView';
import { MathLabView } from './sections/MathLabView';
import { PracticeZoneView } from './sections/PracticeZoneView';
import { ProgressDashboardView } from './sections/ProgressDashboardView';
import { QuickRevisionView } from './sections/QuickRevisionView';
import { WorkedExamplesView } from './sections/WorkedExamplesView';
import type {
  DiagnosticResult,
  FinalAssessmentResult,
  SectionId,
  StudentProgress,
  TopicId,
} from './types/curriculum';
import {
  loadProgress,
  markApplicationSolved,
  markBoardQuestionChecked,
  markExampleStudied,
  markFlashcardReviewed,
  markLabExplored,
  recordLastLessonTopic,
  recordPracticeAttempt,
  recordSectionVisit,
  resetProgressStorage,
  saveDiagnosticResult,
  saveFinalAssessmentResult,
  toggleLessonCompleted,
} from './utils/progressStorage';

function resolveInitialSection(): SectionId {
  const hash = window.location.hash.replace('#', '') as SectionId;
  if (NAV_ITEMS.some((n) => n.id === hash)) {
    return hash;
  }
  return 'dashboard';
}

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>(() => resolveInitialSection());
  const [progress, setProgress] = useState<StudentProgress>(() => loadProgress());
  const [focusedLessonTopic, setFocusedLessonTopic] = useState<TopicId>(
    () => progress.lastLessonTopic ?? 'order-equality'
  );
  const [startPersonalisedPractice, setStartPersonalisedPractice] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      const next = resolveInitialSection();
      setActiveSection(next);
      setProgress((prev) => recordSectionVisit(prev, next));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = useCallback((section: SectionId) => {
    setActiveSection(section);
    setProgress((prev) => recordSectionVisit(prev, section));
    if (window.location.hash !== `#${section}`) {
      window.location.hash = section;
    }
  }, []);

  const handleOpenLesson = useCallback(
    (topicId: TopicId) => {
      setFocusedLessonTopic(topicId);
      setProgress((prev) => recordLastLessonTopic(prev, topicId));
      handleNavigate('learn');
    },
    [handleNavigate]
  );

  const handleSelectLessonTopic = useCallback((topicId: TopicId) => {
    setFocusedLessonTopic(topicId);
    setProgress((prev) => recordLastLessonTopic(prev, topicId));
  }, []);

  const handleStartPersonalisedPractice = useCallback(() => {
    setStartPersonalisedPractice(true);
    handleNavigate('practice');
  }, [handleNavigate]);

  const handleConsumePersonalisedRequest = useCallback(() => {
    setStartPersonalisedPractice(false);
  }, []);

  const handleSaveDiagnostic = useCallback((result: DiagnosticResult) => {
    setProgress((prev) => saveDiagnosticResult(prev, result));
  }, []);

  const handleToggleLesson = useCallback((topicId: TopicId) => {
    setProgress((prev) => toggleLessonCompleted(prev, topicId));
  }, []);

  const handleMarkLab = useCallback((labId: string) => {
    setProgress((prev) => markLabExplored(prev, labId));
  }, []);

  const handleMarkExample = useCallback((exampleId: string) => {
    setProgress((prev) => markExampleStudied(prev, exampleId));
  }, []);

  const handleRecordPractice = useCallback((topicId: TopicId, isCorrect: boolean) => {
    setProgress((prev) => recordPracticeAttempt(prev, topicId, isCorrect));
  }, []);

  const handleMarkFlashcard = useCallback((cardId: string) => {
    setProgress((prev) => markFlashcardReviewed(prev, cardId));
  }, []);

  const handleMarkBoard = useCallback((questionId: string) => {
    setProgress((prev) => markBoardQuestionChecked(prev, questionId));
  }, []);

  const handleMarkApplicationSolved = useCallback((activityId: string) => {
    setProgress((prev) => markApplicationSolved(prev, activityId));
  }, []);

  const handleSaveFinal = useCallback((result: FinalAssessmentResult) => {
    setProgress((prev) => saveFinalAssessmentResult(prev, result));
  }, []);

  const handleResetProgress = useCallback(() => {
    setProgress(resetProgressStorage());
  }, []);

  return (
    <LayoutShell
      activeSection={activeSection}
      onNavigate={handleNavigate}
      progress={progress}
    >
      {activeSection === 'dashboard' && (
        <DashboardView
          progress={progress}
          onNavigate={handleNavigate}
          onOpenLesson={handleOpenLesson}
          onStartPersonalisedPractice={handleStartPersonalisedPractice}
        />
      )}
      {activeSection === 'diagnostic' && (
        <DiagnosticView
          progress={progress}
          onSaveResult={handleSaveDiagnostic}
          onNavigate={handleNavigate}
          onOpenLesson={handleOpenLesson}
          onStartPersonalisedPractice={handleStartPersonalisedPractice}
        />
      )}
      {activeSection === 'learn' && (
        <LearnConceptsView
          progress={progress}
          initialTopic={focusedLessonTopic}
          onSelectTopic={handleSelectLessonTopic}
          onToggleLessonCompleted={handleToggleLesson}
          onNavigate={handleNavigate}
        />
      )}
      {activeSection === 'lab' && (
        <MathLabView progress={progress} onMarkExplored={handleMarkLab} />
      )}
      {activeSection === 'examples' && (
        <WorkedExamplesView progress={progress} onMarkStudied={handleMarkExample} />
      )}
      {activeSection === 'practice' && (
        <PracticeZoneView
          progress={progress}
          startPersonalised={startPersonalisedPractice}
          onConsumePersonalisedRequest={handleConsumePersonalisedRequest}
          onRecordAttempt={handleRecordPractice}
        />
      )}
      {activeSection === 'revision' && (
        <QuickRevisionView progress={progress} onMarkFlashcard={handleMarkFlashcard} />
      )}
      {activeSection === 'board-prep' && (
        <BoardPrepView progress={progress} onMarkChecked={handleMarkBoard} />
      )}
      {activeSection === 'applications' && (
        <ApplicationsView
          progress={progress}
          onMarkSolved={handleMarkApplicationSolved}
        />
      )}
      {activeSection === 'final-assessment' && (
        <FinalAssessmentView progress={progress} onSaveResult={handleSaveFinal} />
      )}
      {activeSection === 'progress' && (
        <ProgressDashboardView
          progress={progress}
          onResetProgress={handleResetProgress}
          onNavigate={handleNavigate}
          onOpenLesson={handleOpenLesson}
          onStartPersonalisedPractice={handleStartPersonalisedPractice}
        />
      )}
    </LayoutShell>
  );
}
