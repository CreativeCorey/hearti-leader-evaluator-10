
import React from 'react';
import { Calendar } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Gauge, Ear, BarChart, TreeDeciduous, Search, Users } from 'lucide-react';
import { HEARTIDimension } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface HabitItemTitleProps {
  dimension: HEARTIDimension;
  description: string;
  streakCount: number;
}

const dimensionIcons: Record<string, LucideIcon> = {
  humility: Gauge,
  empathy: Ear,
  accountability: BarChart,
  resiliency: TreeDeciduous,
  transparency: Search,
  inclusivity: Users
};

const HabitItemTitle: React.FC<HabitItemTitleProps> = ({
  dimension,
  description,
  streakCount
}) => {
  const isMobile = useIsMobile();
  const DimensionIcon = dimensionIcons[dimension] || Gauge;
  
  return (
    <>
      <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold mb-1 flex items-center gap-2`}>
        <DimensionIcon size={isMobile ? 16 : 20} className="text-gray-500" />
        {description}
      </h3>
      
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar size={12} />
          Current streak: {streakCount} {streakCount === 1 ? 'day' : 'days'}
        </div>
      </div>
    </>
  );
};

export default HabitItemTitle;
