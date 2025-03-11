
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

// Updated dimension colors with more vibrant and distinctive hues
export const dimensionColors: Record<HEARTIDimension, string> = {
  humility: '#5B0F58',      // Deep Purple
  empathy: '#18B7D9',       // Bright Cyan
  accountability: '#00A249', // Vibrant Green
  resiliency: '#FFCC33',    // Golden Yellow
  transparency: '#3953A4',  // Royal Blue
  inclusivity: '#EE2D67'    // Bright Pink
};
