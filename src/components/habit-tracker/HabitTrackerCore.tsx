
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { HEARTIDimension } from '@/types';
import { calculateStreaks } from '@/utils/habitUtils';
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
