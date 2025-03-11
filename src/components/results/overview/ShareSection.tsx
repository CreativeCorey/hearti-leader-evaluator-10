
import React from 'react';
import { HEARTIAssessment } from '@/types';
import ShareResultsCard from '../sharing/ShareResultsCard';

interface ShareSectionProps {
  assessment: HEARTIAssessment;
}

const ShareSection: React.FC<ShareSectionProps> = ({ assessment }) => {
  return <ShareResultsCard assessment={assessment} />;
};

export default ShareSection;
