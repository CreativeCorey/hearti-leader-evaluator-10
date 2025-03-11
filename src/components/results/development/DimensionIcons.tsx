
import { LucideIcon } from 'lucide-react';
import { Gauge, HeartHandshake, Goal, TreePalm, Blend, Users } from 'lucide-react';
import { HEARTIDimension } from '@/types';

export const dimensionIcons: Record<string, LucideIcon> = {
  humility: Gauge,
  empathy: HeartHandshake,
  accountability: Goal,
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

// Updated dimension colors with pink for user spectra and orange for resiliency
export const dimensionColors: Record<HEARTIDimension, string> = {
  humility: '#EE2D67',      // Pink
  empathy: '#3953A4',       // Deep Blue
  accountability: '#00A249', // Vibrant Green
  resiliency: '#F97316',    // Orange (changed from yellow)
  transparency: '#18B7D9',  // Cyan
  inclusivity: '#5B0F58'    // Deep Purple
};
