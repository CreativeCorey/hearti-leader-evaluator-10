
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { HEARTIDimension } from '@/types';
import { LucideIcon } from 'lucide-react';
import { Gauge, Ear, BarChart, TreePalm, Search, Users } from 'lucide-react';
import CompletedHabitBadge from './CompletedHabitBadge';
import { useIsMobile } from '@/hooks/use-mobile';

interface HabitItemHeaderProps {
  dimension: HEARTIDimension;
  frequency: 'daily' | 'weekly' | 'monthly';
  isHabitMastered: boolean;
  onDeleteHabit: () => void;
}

const dimensionColors = {
  humility: 'bg-purple-100 text-purple-800 border-purple-200',
  empathy: 'bg-blue-100 text-blue-800 border-blue-200',
  accountability: 'bg-green-100 text-green-800 border-green-200',
  resiliency: 'bg-amber-100 text-amber-800 border-amber-200',
  transparency: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  inclusivity: 'bg-rose-100 text-rose-800 border-rose-200'
};

const dimensionLabels = {
  humility: 'Humility',
  empathy: 'Empathy',
  accountability: 'Accountability',
  resiliency: 'Resiliency',
  transparency: 'Transparency',
  inclusivity: 'Inclusivity'
};

const dimensionIcons: Record<string, LucideIcon> = {
  humility: Gauge,
  empathy: Ear,
  accountability: BarChart,
  resiliency: TreePalm,
  transparency: Search,
  inclusivity: Users
};

const HabitItemHeader: React.FC<HabitItemHeaderProps> = ({
  dimension,
  frequency,
  isHabitMastered,
  onDeleteHabit
}) => {
  const isMobile = useIsMobile();
  const DimensionIcon = dimensionIcons[dimension] || Gauge;
  
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center space-x-2">
        <div className={`px-2 py-1 rounded-md text-xs font-medium ${dimensionColors[dimension]} flex items-center gap-1`}>
          <DimensionIcon size={12} />
          {isMobile ? dimension.charAt(0).toUpperCase() : dimensionLabels[dimension]}
        </div>
        <span className="text-xs text-muted-foreground">{frequency === 'daily' ? 'Daily' : 'Weekly'}</span>
        {isHabitMastered && (
          <CompletedHabitBadge 
            dimension={dimension}
            size={isMobile ? 'sm' : 'md'}
            iconType={dimension === 'accountability' ? 'trophy' : 
                      dimension === 'humility' ? 'star' : 'award'}
          />
        )}
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0" 
        onClick={onDeleteHabit}
      >
        <X size={16} />
      </Button>
    </div>
  );
};

export default HabitItemHeader;
