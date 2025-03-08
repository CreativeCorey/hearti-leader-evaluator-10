
import React from 'react';
import { HEARTIDimension } from '@/types';
import { Calendar } from 'lucide-react';
import HabitTracker from '../HabitTracker';

interface HabitTabProps {
  focusDimension: HEARTIDimension;
}

const HabitTab: React.FC<HabitTabProps> = ({ focusDimension }) => {
  return (
    <div className="mb-4">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
        <h3 className="font-medium flex items-center gap-2 text-blue-800">
          <Calendar className="text-blue-600" size={20} />
          Habit Tracking for HEARTI Leadership
        </h3>
        <p className="text-blue-700 mt-1">
          Build consistent habits to strengthen your leadership skills. We recommend focusing on your development area: 
          <strong className="uppercase"> {focusDimension}</strong>
        </p>
      </div>
      
      <HabitTracker focusDimension={focusDimension} />
    </div>
  );
};

export default HabitTab;
