
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

// Swapping the colors for resiliency and accountability
export const dimensionColors: Record<HEARTIDimension, string> = {
  humility: '#EE2D67',      // Pink (unchanged)
  empathy: '#F97316',       // Orange (unchanged)
  accountability: '#00A249', // Green (changed from deep blue)
  resiliency: '#3953A4',    // Deep Blue (changed from green)
  transparency: '#18B7D9',  // Cyan (unchanged)
  inclusivity: '#5B0F58'    // Deep Purple (unchanged)
};
