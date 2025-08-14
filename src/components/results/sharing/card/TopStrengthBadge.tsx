
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
  
  // Do not translate dimension names - they remain in English
  
  return (
    <div className="mt-4 bg-green-50 p-3 rounded-md border border-green-100 dark:bg-green-900/20 dark:border-green-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Crown size={16} className="mr-2 text-green-800 dark:text-white" />
          <span className="font-medium text-green-800 dark:text-white">
            <span className="font-semibold">{t('results.comparison.strength')}:</span> {topStrength}
          </span>
        </div>
        <div>
          <DimensionIcon dimension={topStrength} />
        </div>
      </div>
      <p className="text-green-700 dark:text-white font-semibold mt-1 text-center">
        {topStrengthScore.toString()}/5
      </p>
    </div>
  );
};

export default TopStrengthBadge;
