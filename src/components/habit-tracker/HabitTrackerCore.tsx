
import React from 'react';
import { HEARTIDimension } from '@/types';
import { HabitTrackerProvider } from '@/contexts/HabitTrackerContext';
import HabitHeader from './HabitHeader';
import HabitList from './HabitList';
import { completionGoals } from './HabitTrackerContent';

interface HabitTrackerCoreProps {
  focusDimension?: HEARTIDimension;
}

const HabitTrackerCore: React.FC<HabitTrackerCoreProps> = ({ 
  focusDimension 
}) => {
  return (
    <HabitTrackerProvider focusDimension={focusDimension}>
      <div className="space-y-4">
        <HabitHeader />
        <HabitList />
      </div>
    </HabitTrackerProvider>
  );
};

export default HabitTrackerCore;
