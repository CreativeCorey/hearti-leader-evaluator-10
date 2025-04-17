
import React from 'react';
import { HEARTIDimension, HabitTabContentProps } from '@/types';
import HabitTab from '../HabitTab';

const HabitTabContent: React.FC<HabitTabContentProps> = ({ 
  topDevelopmentArea,
  onRefreshAssessments 
}) => {
  return <HabitTab focusDimension={topDevelopmentArea} onRefreshAssessments={onRefreshAssessments} />;
};

export default HabitTabContent;
