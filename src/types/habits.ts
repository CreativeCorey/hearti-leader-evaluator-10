
import { HEARTIDimension } from '@/types';

export interface Habit {
  id: string;
  userId: string;
  dimension: HEARTIDimension;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completedDates: string[];
  skippedDates?: string[];
  createdAt: string;
}

export interface NewHabitForm {
  dimension: HEARTIDimension;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
}
