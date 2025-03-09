
import { LucideIcon } from 'lucide-react';
import { Gauge, HeartHandshake, ChartNoAxesCombined, TreePalm, Blend, Users } from 'lucide-react';
import { HEARTIDimension } from '@/types';

export const dimensionIcons: Record<string, LucideIcon> = {
  humility: Gauge,
  empathy: HeartHandshake,
  accountability: ChartNoAxesCombined,
  resiliency: TreePalm,
  transparency: Blend,
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

// Export standardized dimension colors
export const dimensionColors: Record<HEARTIDimension, string> = {
  humility: '#6366F1',    // Indigo
  empathy: '#EC4899',     // Pink
  accountability: '#F59E0B', // Amber
  resiliency: '#10B981',  // Emerald
  transparency: '#06B6D4', // Cyan
  inclusivity: '#8B5CF6'  // Violet
};
