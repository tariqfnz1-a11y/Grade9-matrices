import {
  Award,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  FlaskConical,
  Globe,
  GraduationCap,
  Home,
  Layers,
  ListChecks,
  Target,
} from 'lucide-react';
import React from 'react';
import type { SectionId } from '../types/curriculum';

interface ModuleIconProps {
  sectionId: SectionId;
  className?: string;
}

export const ModuleIcon: React.FC<ModuleIconProps> = ({
  sectionId,
  className = 'w-4 h-4 shrink-0',
}) => {
  switch (sectionId) {
    case 'dashboard':
      return <Home className={className} aria-hidden="true" />;
    case 'diagnostic':
      return <ClipboardCheck className={className} aria-hidden="true" />;
    case 'learn':
      return <BookOpen className={className} aria-hidden="true" />;
    case 'lab':
      return <FlaskConical className={className} aria-hidden="true" />;
    case 'examples':
      return <ListChecks className={className} aria-hidden="true" />;
    case 'practice':
      return <Target className={className} aria-hidden="true" />;
    case 'revision':
      return <Layers className={className} aria-hidden="true" />;
    case 'board-prep':
      return <GraduationCap className={className} aria-hidden="true" />;
    case 'applications':
      return <Globe className={className} aria-hidden="true" />;
    case 'final-assessment':
      return <Award className={className} aria-hidden="true" />;
    case 'progress':
      return <BarChart3 className={className} aria-hidden="true" />;
  }
};
