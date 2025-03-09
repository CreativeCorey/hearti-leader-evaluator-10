
import { LucideIcon } from 'lucide-react';
import { Award, Brain, BarChart, Leaf, BookText, Headphones } from 'lucide-react';
import { HEARTIDimension } from '@/types';

export const dimensionIcons: Record<string, LucideIcon> = {
  humility: Award,
  empathy: Brain,
  accountability: BarChart,
  resiliency: Leaf,
  transparency: BookText,
  inclusivity: Headphones,
};

export const dimensionLabels: Record<HEARTIDimension, string> = {
  humility: 'Humility',
  empathy: 'Empathy',
  accountability: 'Accountability',
  resiliency: 'Resiliency',
  transparency: 'Transparency',
  inclusivity: 'Inclusivity'
};
