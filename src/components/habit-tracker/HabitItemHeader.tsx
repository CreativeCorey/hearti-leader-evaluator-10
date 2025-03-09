
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { HEARTIDimension } from '@/types';
import { Gauge, HeartHandshake, ChartNoAxesCombined, TreePalm, Blend, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { LucideIcon } from 'lucide-react';

interface HabitItemHeaderProps {
  dimension: HEARTIDimension;
  frequency: 'daily' | 'weekly' | 'monthly';
  isHabitMastered: boolean;
  onDeleteHabit: () => void;
}

// Updated type definition to use LucideIcon
const dimensionIcons: Record<string, LucideIcon> = {
  humility: Gauge,
  empathy: HeartHandshake,
  accountability: ChartNoAxesCombined,
  resiliency: TreePalm,
  transparency: Blend,
  inclusivity: Users
};

const frequencyColors = {
  daily: 'text-blue-600',
  weekly: 'text-purple-600',
  monthly: 'text-orange-600'
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
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-1">
        <DimensionIcon size={isMobile ? 14 : 16} className="text-gray-500" />
        <span className={`text-xs ${frequencyColors[frequency]} uppercase font-medium`}>
          {frequency}
        </span>
      </div>
      {!isHabitMastered && (
        <Button 
          variant="ghost" 
          className="h-auto p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50"
          onClick={onDeleteHabit}
        >
          <Trash size={isMobile ? 14 : 16} />
        </Button>
      )}
    </div>
  );
};

export default HabitItemHeader;
