import type { PracticeQuestion } from '../../types/curriculum';
import { MODULE_1_QUESTIONS } from './module1';
import { MODULE_2_QUESTIONS } from './module2';
import { MODULE_3_QUESTIONS } from './module3';
import { MODULE_4_QUESTIONS } from './module4';
import { MODULE_5_QUESTIONS } from './module5';
import { MODULE_6_QUESTIONS } from './module6';

export const ALL_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  ...MODULE_1_QUESTIONS,
  ...MODULE_2_QUESTIONS,
  ...MODULE_3_QUESTIONS,
  ...MODULE_4_QUESTIONS,
  ...MODULE_5_QUESTIONS,
  ...MODULE_6_QUESTIONS,
];
