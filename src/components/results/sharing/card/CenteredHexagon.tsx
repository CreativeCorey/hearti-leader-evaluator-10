
import React from 'react';
import { HEARTIDimension } from '@/types';
import { dimensionColors } from '@/components/results/development/DimensionIcons';

interface CenteredHexagonProps {
  topStrength: HEARTIDimension;
}

const CenteredHexagon: React.FC<CenteredHexagonProps> = ({ topStrength }) => {
  // Get the initial letter of the top dimension
  const topDimensionInitial = topStrength.charAt(0).toUpperCase();
  
  return (
    <div 
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ width: '48px', height: '48px' }}
    >
      <svg 
        width="48" 
        height="48" 
        viewBox="0 0 48 48" 
        preserveAspectRatio="xMidYMid meet"
      >
        <polygon 
          points="24,4 41.6,14 41.6,34 24,44 6.4,34 6.4,14"
          fill="white" 
          stroke={dimensionColors[topStrength]} 
          strokeWidth="2"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="text-2xl font-bold"
          style={{ color: dimensionColors[topStrength] }}
        >
          {topDimensionInitial}
        </span>
      </div>
    </div>
  );
};

export default CenteredHexagon;
