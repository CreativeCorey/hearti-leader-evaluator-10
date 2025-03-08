
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Trophy, Star, Check } from 'lucide-react';
import { HEARTIDimension } from '@/types';

interface CompletedHabitBadgeProps {
  dimension: HEARTIDimension;
  size?: 'sm' | 'md' | 'lg';
  iconType?: 'award' | 'trophy' | 'star' | 'check';
}

const dimensionColors = {
  humility: 'bg-purple-100 border-purple-200 text-purple-800',
  empathy: 'bg-blue-100 border-blue-200 text-blue-800',
  accountability: 'bg-green-100 border-green-200 text-green-800',
  resiliency: 'bg-amber-100 border-amber-200 text-amber-800',
  transparency: 'bg-indigo-100 border-indigo-200 text-indigo-800',
  inclusivity: 'bg-rose-100 border-rose-200 text-rose-800'
};

const iconSizes = {
  sm: 12,
  md: 16,
  lg: 20
};

const badgeSizes = {
  sm: 'text-xs py-0 px-1.5',
  md: 'text-xs py-0.5 px-2',
  lg: 'text-sm py-1 px-2.5'
};

const CompletedHabitBadge: React.FC<CompletedHabitBadgeProps> = ({ 
  dimension, 
  size = 'md',
  iconType = 'award'
}) => {
  // Select the icon based on iconType
  const IconComponent = {
    award: Award,
    trophy: Trophy,
    star: Star,
    check: Check
  }[iconType];
  
  return (
    <Badge 
      className={`
        ${dimensionColors[dimension]} 
        ${badgeSizes[size]}
        flex items-center gap-1 font-medium border
      `}
    >
      <IconComponent size={iconSizes[size]} className="flex-shrink-0" />
      <span>Mastered</span>
    </Badge>
  );
};

export default CompletedHabitBadge;
