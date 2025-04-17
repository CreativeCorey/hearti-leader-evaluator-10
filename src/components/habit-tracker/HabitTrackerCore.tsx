
import React from 'react';
import { HEARTIDimension } from '@/types';
import { HabitTrackerProvider } from '@/contexts/HabitTrackerContext';
import HabitTrackerContent from './HabitTrackerContent';

interface HabitTrackerCoreProps {
  focusDimension?: HEARTIDimension;
  onRefreshAssessments?: () => void;
}

const HabitTrackerCore: React.FC<HabitTrackerCoreProps> = ({ 
  focusDimension,
  onRefreshAssessments
}) => {
  return (
    <HabitTrackerProvider focusDimension={focusDimension}>
      <HabitTrackerContent onRefreshAssessments={onRefreshAssessments} />
    </HabitTrackerProvider>
  );
};

export default HabitTrackerCore;
