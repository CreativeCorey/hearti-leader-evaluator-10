
import React from 'react';
import { HEARTIDimension } from '@/types';
import { Calendar } from 'lucide-react';
import HabitTracker from '../HabitTracker';
import { dimensionIcons, dimensionLabels } from './development/DimensionIcons';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface HabitTabProps {
  focusDimension: HEARTIDimension;
}

const HabitTab: React.FC<HabitTabProps> = ({ focusDimension }) => {
  const DimensionIcon = dimensionIcons[focusDimension] || dimensionIcons.humility;
  const { t } = useLanguage();
  
  return (
    <div className="mb-4">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
        <h3 className="font-medium flex items-center gap-2 text-blue-800">
          <DimensionIcon className="text-blue-600" size={20} />
          {t('habitTracker.title')}
        </h3>
        <p className="text-blue-700 mt-1">
          {t('habitTracker.description')}
        </p>
        <p className="text-blue-700 mt-2 text-sm">
          {t('habitTracker.focusAreaPrefix')}
          <strong className="uppercase flex items-center gap-1 inline-flex mt-1">
            <DimensionIcon size={14} /> {t(`dimensions.${focusDimension}`)}
          </strong>
        </p>
        <p className="text-blue-700 mt-2 text-sm font-medium">
          {t('habitTracker.addBehaviorsHint')}
        </p>
      </div>
      
      <HabitTracker focusDimension={focusDimension} />
    </div>
  );
};

export default HabitTab;
