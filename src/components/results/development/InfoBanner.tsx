
import React from 'react';
import { HEARTIDimension } from '@/types';
import { dimensionIcons, dimensionLabels } from './DimensionIcons';

interface InfoBannerProps {
  focusDimension: HEARTIDimension;
}

const InfoBanner: React.FC<InfoBannerProps> = ({ focusDimension }) => {
  const DimensionIcon = dimensionIcons[focusDimension] || dimensionIcons.humility;
  
  return (
    <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-6 rounded-md">
      <h3 className="font-medium flex items-center gap-2 text-indigo-800">
        <DimensionIcon className="text-indigo-600" size={20} />
        Development Recommendations for HEARTI™ Leadership
      </h3>
      <p className="text-indigo-700 mt-1">
        Choose 3 behaviors below that will help strengthen your leadership dimensions. We recommend focusing on your development area: 
        <strong className="uppercase"> {dimensionLabels[focusDimension]}</strong>
      </p>
      <p className="text-indigo-700 mt-2 text-sm">
        Practice each behavior 1 time to develop a new habit and master the skill.
      </p>
    </div>
  );
};

export default InfoBanner;
