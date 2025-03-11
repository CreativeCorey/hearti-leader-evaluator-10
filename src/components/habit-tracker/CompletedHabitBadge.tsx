
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Trophy, Star, Check } from 'lucide-react';
import { HEARTIDimension } from '@/types';
import { dimensionColors } from '../results/development/DimensionIcons';

interface CompletedHabitBadgeProps {
  dimension: HEARTIDimension;
  size?: 'sm' | 'md' | 'lg';
  iconType?: 'award' | 'trophy' | 'star' | 'check';
}

// Updated colors based on our new color scheme
const dimensionColors = {
  humility: {
    bg: 'bg-[#5B0F58]/10',
    text: 'text-[#5B0F58]',
    border: 'border-[#5B0F58]/20'
  },
  empathy: {
    bg: 'bg-[#18B7D9]/10',
    text: 'text-[#18B7D9]',
    border: 'border-[#18B7D9]/20'
  },
  accountability: {
    bg: 'bg-[#00A249]/10',
    text: 'text-[#00A249]',
    border: 'border-[#00A249]/20'
  },
  resiliency: {
    bg: 'bg-[#FFCC33]/10',
    text: 'text-[#FFCC33]',
    border: 'border-[#FFCC33]/20'
  },
  transparency: {
    bg: 'bg-[#3953A4]/10',
    text: 'text-[#3953A4]',
    border: 'border-[#3953A4]/20'
  },
  inclusivity: {
    bg: 'bg-[#EE2D67]/10',
    text: 'text-[#EE2D67]',
    border: 'border-[#EE2D67]/20'
  }
};

const iconSizes = {
  sm: 12,
  md: 16,
  lg: 20
};

const badgeSizes = {
  sm: 'text-xs py-0.5 px-1.5',
  md: 'text-xs py-1 px-2',
  lg: 'text-sm py-1.5 px-2.5'
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
  
  const colorSet = dimensionColors[dimension];
  
  return (
    <Badge 
      className={`
        ${colorSet.bg} 
        ${colorSet.text} 
        ${colorSet.border}
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
