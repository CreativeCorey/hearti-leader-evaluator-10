
import { LucideIcon } from 'lucide-react';
import { Gauge, Ear, ChartNoAxesCombined, TreePalm, Search, Users } from 'lucide-react';
import { HEARTIDimension } from '@/types';

export const dimensionIcons: Record<string, LucideIcon> = {
  humility: Gauge,
  empathy: Ear,
  accountability: ChartNoAxesCombined,
  resiliency: TreePalm,
  transparency: Search,
  inclusivity: Users,
};

export const dimensionLabels: Record<HEARTIDimension, string> = {
  humility: 'Humility',
  empathy: 'Empathy',
  accountability: 'Accountability',
  resiliency: 'Resiliency',
  transparency: 'Transparency',
  inclusivity: 'Inclusivity'
};
