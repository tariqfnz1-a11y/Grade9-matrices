import { CheckCircle2, ChevronRight, Home, Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { NAV_ITEMS } from '../data/unit1Content';
import type { SectionId, StudentProgress } from '../types/curriculum';
import { computeUnitCompletion, getModuleCompletionInfo } from '../utils/progressStorage';
import { ModuleIcon } from './ModuleIcon';

interface LayoutShellProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  progress: StudentProgress;
  children: React.ReactNode;
}

const TOP_LINKS: { id: SectionId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'learn', label: 'Learn' },
  { id: 'lab', label: 'Math Lab' },
  { id: 'practice', label: 'Practice' },
  { id: 'board-prep', label: 'Board Prep' },
];

export const LayoutShell: React.FC<LayoutShellProps> = ({
  activeSection,
  onNavigate,
  progress,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const handleSelect = (id: SectionId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unitCompletion = computeUnitCompletion(progress);
  const currentNav = NAV_ITEMS.find((n) => n.id === activeSection) ?? NAV_ITEMS[0];

  const renderSidebarNav = (mobile = false) => (
    <nav aria-label={mobile ? 'Mobile unit navigation' : 'Unit 1 navigation'} className="mt-4 space-y-1">
      {NAV_ITEMS.map((item) => {
        const isActive = activeSection === item.id;
        const info = getModuleCompletionInfo(item.id, progress);

        return (
          <button
            key={item.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => handleSelect(item.id)}
            className={`w-full flex items-center justify-between gap-2 px-3 rounded-lg text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
              mobile ? 'py-3' : 'py-2.5'
            } ${
              isActive
                ? 'bg-[#0F294A] text-white font-medium'
                : 'text-slate-700 hover:bg-slate-100 hover:text-[#0F294A]'
            }`}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <ModuleIcon
                sectionId={item.id}
                className={`w-4 h-4 shrink-0 ${
                  isActive
                    ? 'text-teal-300'
                    : info.status === 'completed'
                      ? 'text-[#0D9488]'
                      : 'text-slate-500'
                }`}
              />
              <span
                className={`font-mono-num text-xs shrink-0 ${
                  isActive ? 'text-teal-200' : 'text-slate-500'
                }`}
              >
                {item.number}
              </span>
              <span className="truncate">{item.label}</span>
            </span>

            <span className="flex items-center gap-1 shrink-0">
              {info.badgeText && (
                <span
                  className={`font-mono-num text-xs ${
                    isActive
                      ? 'text-teal-200'
                      : info.status === 'completed'
                        ? 'text-[#0F766E] font-semibold'
                        : 'text-slate-600'
                  }`}
                >
                  {info.badgeText}
                </span>
              )}
              {info.status === 'completed' && (
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? 'text-teal-300' : 'text-[#0D9488]'
                  }`}
                  aria-label="Completed"
                />
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] print:bg-white text-slate-900 flex flex-col">
      {/* Skip to main content for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#0F294A] focus:text-white focus:text-sm focus:font-medium focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Top Bar: strict 3-zone contract */}
      <header className="print:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-8 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close unit navigation' : 'Open unit navigation'}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => handleSelect('dashboard')}
            className="inline-flex items-center gap-2 font-display text-base sm:text-lg font-bold tracking-tight text-[#0F294A] whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded px-1 py-0.5"
          >
            <Home className="w-4 h-4 text-[#0D9488] shrink-0 hidden sm:inline" aria-hidden="true" />
            <span>Grade 9 Mathematics · Unit 1</span>
          </button>
        </div>

        <nav
          aria-label="Primary quick links"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          {TOP_LINKS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleSelect(item.id)}
                className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                  isActive
                    ? 'border-[#0D9488] text-[#0F294A] font-semibold'
                    : 'border-transparent hover:text-[#0F294A] hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
            title="Overall Unit 1 learning progress"
          >
            <span className="font-medium">Progress</span>
            <span className="font-mono-num font-bold text-[#0F766E] tabular-nums">
              {unitCompletion.percent}%
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSelect('progress')}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#0F294A] rounded-lg hover:bg-[#163864] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            Student Progress
          </button>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1440px] w-full mx-auto">
        {/* Desktop Sidebar */}
        <aside
          aria-label="Unit 1 curriculum modules"
          className="print:hidden hidden lg:block w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-6"
        >
          <div className="px-3 pb-4 border-b border-slate-100 space-y-3">
            <div>
              <p className="text-xs font-medium text-slate-600">Punjab Board Syllabus</p>
              <p className="font-display text-sm font-semibold text-[#0F294A] mt-0.5">
                Matrices and Determinants
              </p>
            </div>

            {/* Global Unit Progress Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#0F294A]">Unit Progress</span>
                <span className="font-mono-num font-bold text-[#0F766E] tabular-nums">
                  {unitCompletion.percent}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Overall Unit 1 completion percentage"
                aria-valuenow={unitCompletion.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                className="w-full h-2 bg-slate-200 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-[#0D9488] transition-all duration-300"
                  style={{ width: `${unitCompletion.percent}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 tabular-nums">
                {unitCompletion.completedModules} of {unitCompletion.totalModules} unit milestones
                completed
              </p>
            </div>
          </div>

          {renderSidebarNav(false)}
        </aside>

        {/* Mobile / Tablet Drawer */}
        {mobileMenuOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Unit 1 navigation drawer"
            className="fixed inset-0 z-40 lg:hidden flex"
          >
            <div
              className="fixed inset-0 bg-slate-900/40"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <aside className="relative w-80 max-w-[85vw] bg-white h-full overflow-y-auto px-4 py-5 border-r border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <p className="text-xs text-slate-600">Punjab Board Syllabus</p>
                  <p className="font-display text-sm font-semibold text-[#0F294A]">
                    Unit 1 · Matrices &amp; Determinants
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0F294A]">Unit Progress</span>
                  <span className="font-mono-num font-bold text-[#0F766E] tabular-nums">
                    {unitCompletion.percent}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0D9488]"
                    style={{ width: `${unitCompletion.percent}%` }}
                  />
                </div>
              </div>

              {renderSidebarNav(true)}
            </aside>
          </div>
        )}

        {/* Main Workspace Canvas */}
        <main id="main-content" className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-6 lg:py-8 print:p-0">
          {/* Breadcrumbs + Home Button on all learning pages */}
          {activeSection !== 'dashboard' && (
            <div className="print:hidden mb-6 flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={() => handleSelect('dashboard')}
                  className="inline-flex items-center gap-1 font-medium text-[#0F766E] hover:text-[#0F294A] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                >
                  <Home className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Home</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span className="text-slate-600">{currentNav.phase}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span className="font-semibold text-[#0F294A]" aria-current="page">
                  Module {currentNav.number}: {currentNav.label}
                </span>
              </nav>

              <button
                type="button"
                onClick={() => handleSelect('dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F294A] bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] shrink-0"
              >
                <Home className="w-3.5 h-3.5 text-[#0D9488]" aria-hidden="true" />
                <span>Back to Home</span>
              </button>
            </div>
          )}

          {children}

          <footer className="print:hidden mt-14 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
            <span>
              Grade 9 Mathematics · Unit 1: Matrices and Determinants · Punjab Textbook Board Syllabus
            </span>
            <span>All computations and progress stored locally in your browser.</span>
          </footer>
        </main>
      </div>
    </div>
  );
};
