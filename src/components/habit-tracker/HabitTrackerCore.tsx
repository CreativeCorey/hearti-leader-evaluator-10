
import React from 'react';
import { HEARTIDimension } from '@/types';
import { HabitTrackerProvider } from '@/contexts/HabitTrackerContext';
import HabitTrackerContent from './HabitTrackerContent';

interface HabitTrackerCoreProps {
  focusDimension?: HEARTIDimension;
}

const HabitTrackerCore: React.FC<HabitTrackerCoreProps> = ({ focusDimension }) => {
  return (
    <HabitTrackerProvider focusDimension={focusDimension}>
      <HabitTrackerContent />
    </HabitTrackerProvider>
  );
};

export default HabitTrackerCore;
