
import React from 'react';
import { HabitItemHeaderProps } from '@/types';
import { useLanguage } from '@/contexts/language/LanguageContext';

const HabitItemHeader: React.FC<HabitItemHeaderProps> = ({
  title,
  dimension,
  completedToday,
  skippedToday,
  frequency
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium text-base">{title}</h3>
        <p className="text-xs text-muted-foreground capitalize">
          {dimension} • {t(`results.habits.${frequency}`, { fallback: frequency })}
        </p>
      </div>
      
      {completedToday && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
          {t('results.habits.completedToday', { fallback: 'Completed Today' })}
        </span>
      )}
      
      {skippedToday && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          {t('results.habits.skippedToday', { fallback: 'Skipped Today' })}
        </span>
      )}
    </div>
  );
};

export default HabitItemHeader;
