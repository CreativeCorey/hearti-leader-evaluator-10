
import React from 'react';
import { HEARTIDimension } from '@/types';
import HabitTab from '../HabitTab';

interface HabitTabContentProps {
  topDevelopmentArea: HEARTIDimension;
}

const HabitTabContent: React.FC<HabitTabContentProps> = ({ topDevelopmentArea }) => {
  return <HabitTab focusDimension={topDevelopmentArea} />;
};

export default HabitTabContent;
