
import React from 'react';
import { HEARTIDimension } from '@/types';
import { Calendar } from 'lucide-react';
import HabitTracker from '../HabitTracker';
import { dimensionIcons, dimensionLabels } from './development/DimensionIcons';

interface HabitTabProps {
  focusDimension: HEARTIDimension;
}

const HabitTab: React.FC<HabitTabProps> = ({ focusDimension }) => {
  const DimensionIcon = dimensionIcons[focusDimension] || dimensionIcons.humility;
  
  return (
    <div className="mb-4">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
        <h3 className="font-medium flex items-center gap-2 text-blue-800">
          <DimensionIcon className="text-blue-600" size={20} />
          Habit Building for HEARTI™ Leadership
        </h3>
        <p className="text-blue-700 mt-1">
          Track your progress as you build consistent habits for your chosen behaviors. Complete each behavior 30 times to turn it into a lasting habit.
        </p>
        <p className="text-blue-700 mt-2 text-sm">
          We recommend focusing on behaviors from your development area: 
          <strong className="uppercase flex items-center gap-1 inline-flex mt-1">
            <DimensionIcon size={14} /> {dimensionLabels[focusDimension]}
          </strong>
        </p>
        <p className="text-blue-700 mt-2 text-sm font-medium">
          Add behaviors to your habit tracker by using the "Add to Habit Tracker" button in the Development tab or on your saved activities.
        </p>
      </div>
      
      <HabitTracker focusDimension={focusDimension} />
    </div>
  );
};

export default HabitTab;
