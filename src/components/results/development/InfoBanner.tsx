
import React from 'react';
import { HEARTIDimension } from '@/types';
import { dimensionIcons, dimensionLabels } from './DimensionIcons';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface InfoBannerProps {
  focusDimension: HEARTIDimension;
}

const InfoBanner: React.FC<InfoBannerProps> = ({ focusDimension }) => {
  const { t } = useLanguage();
  const DimensionIcon = dimensionIcons[focusDimension] || dimensionIcons.humility;
  
  return (
    <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-6 rounded-md">
      <h3 className="font-medium flex items-center gap-2 text-indigo-800">
        <DimensionIcon className="text-indigo-600" size={20} />
        Development Recommendations for HEARTI™ Leadership
      </h3>
      <p className="text-indigo-700 mt-1">
        {t('results.development.activitiesDescription', { dimension: focusDimension })}
        <strong className="uppercase flex items-center gap-1 inline-flex mt-1">
          <DimensionIcon size={14} /> {focusDimension}
        </strong>
      </p>
      <p className="text-indigo-700 mt-2 text-sm">
        {t('results.development.complete')}
      </p>
    </div>
  );
};

export default InfoBanner;
