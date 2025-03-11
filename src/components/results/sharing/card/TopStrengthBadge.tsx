
import React from 'react';
import { HEARTIDimension } from '@/types';
import { Crown } from 'lucide-react';
import { useLanguage } from '@/contexts/language/LanguageContext';
import DimensionIcon from './DimensionIcon';

interface TopStrengthBadgeProps {
  topStrength: HEARTIDimension;
  topStrengthScore: number;
}

const TopStrengthBadge: React.FC<TopStrengthBadgeProps> = ({ 
  topStrength, 
  topStrengthScore 
}) => {
  const { t } = useLanguage();
  
  // Get translated dimension name
  const getTranslatedDimensionName = (dimension: HEARTIDimension) => {
    return t(`results.dimensions.${dimension}`);
  };
  
  return (
    <div className="mt-4 bg-green-50 p-3 rounded-md border border-green-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Crown size={16} className="mr-2" />
          <span className="font-medium text-green-800">
            <span className="font-semibold">Strength:</span> {getTranslatedDimensionName(topStrength)}
          </span>
        </div>
        <div>
          <DimensionIcon dimension={topStrength} />
        </div>
      </div>
      <p className="text-green-700 font-semibold mt-1 text-center">
        {topStrengthScore}/5
      </p>
    </div>
  );
};

export default TopStrengthBadge;
