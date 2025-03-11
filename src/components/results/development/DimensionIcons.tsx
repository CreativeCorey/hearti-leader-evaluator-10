
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

// Updated dimension colors with swapped colors for empathy and transparency
export const dimensionColors: Record<HEARTIDimension, string> = {
  humility: '#EE2D67',      // Pink
  empathy: '#3953A4',       // Deep Blue (swapped with transparency)
  accountability: '#00A249', // Vibrant Green
  resiliency: '#FFCC33',    // Golden Yellow
  transparency: '#18B7D9',  // Cyan (swapped with empathy)
  inclusivity: '#5B0F58'    // Deep Purple
};
