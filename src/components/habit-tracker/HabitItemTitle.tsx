
import React from 'react';
import { Habit } from '@/hooks/useHabits';
import { dimensionIcons, dimensionColors } from '../results/development/DimensionIcons';

interface HabitItemTitleProps {
  habit: Habit;
  dimensionColor: string;
}

const HabitItemTitle: React.FC<HabitItemTitleProps> = ({
  habit,
  dimensionColor
}) => {
  const DimensionIcon = dimensionIcons[habit.dimension];
  
  return (
    <div className="flex items-center gap-2">
      <div style={{ color: dimensionColor }}>
        {DimensionIcon && <DimensionIcon size={18} />}
      </div>
      <h3 className="font-semibold text-base">{habit.description}</h3>
    </div>
  );
};

export default HabitItemTitle;
