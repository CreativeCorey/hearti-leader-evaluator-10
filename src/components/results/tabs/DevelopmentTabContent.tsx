
import React from 'react';
import { HEARTIDimension } from '@/types';
import DevelopmentTab from '../DevelopmentTab';

interface DevelopmentTabContentProps {
  topDevelopmentArea: HEARTIDimension;
}

const DevelopmentTabContent: React.FC<DevelopmentTabContentProps> = ({ topDevelopmentArea }) => {
  return <DevelopmentTab focusDimension={topDevelopmentArea} />;
};

export default DevelopmentTabContent;
