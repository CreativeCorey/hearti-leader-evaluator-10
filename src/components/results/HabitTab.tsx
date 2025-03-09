
import React from 'react';
import { HEARTIDimension } from '@/types';
import { Calendar, Award, BookText, Brain, BarChart, Headphones, Leaf } from 'lucide-react';
import HabitTracker from '../HabitTracker';
import { LucideIcon } from 'lucide-react';

interface HabitTabProps {
  focusDimension: HEARTIDimension;
}

const dimensionLabels = {
  humility: 'Humility',
  empathy: 'Empathy',
  accountability: 'Accountability',
  resiliency: 'Resiliency',
  transparency: 'Transparency',
  inclusivity: 'Inclusivity'
};

// Updated to use LucideIcon type
const dimensionIcons: Record<string, LucideIcon> = {
  humility: Award,
  empathy: Brain,
  accountability: BarChart,
  resiliency: Leaf,
  transparency: BookText,
  inclusivity: Headphones
};

const HabitTab: React.FC<HabitTabProps> = ({ focusDimension }) => {
  const DimensionIcon = dimensionIcons[focusDimension] || Award;
  
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
