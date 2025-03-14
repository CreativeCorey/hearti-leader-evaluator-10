
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HEARTIDimension } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { dimensionIcons, dimensionLabels, dimensionColors } from '../results/development/DimensionIcons';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface HabitTabsProps {
  activeDimension: HEARTIDimension | 'all';
  onDimensionChange: (value: HEARTIDimension | 'all') => void;
}

const HabitTabs: React.FC<HabitTabsProps> = ({ 
  activeDimension, 
  onDimensionChange 
}) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  return (
    <div className="mobile-tabs-container space-y-2">
      {/* All tab in its own row, spanning full width */}
      <TabsList className="w-full flex justify-center">
        <TabsTrigger 
          value="all" 
          className={`flex items-center gap-1 w-full py-2 ${activeDimension === 'all' ? 'bg-blue-100' : ''}`}
          onClick={() => onDimensionChange('all')}
        >
          <Search className="text-gray-600" size={isMobile ? 16 : 18} />
          {t('results.habits.allHabits')}
        </TabsTrigger>
      </TabsList>
      
      {/* Dimension tabs in a 3-column grid - styled to match development tabs */}
      <TabsList className="w-full grid grid-cols-3 gap-1">
        {Object.entries(dimensionIcons)
          .filter(([key]) => key !== 'all')
          .map(([dimension, Icon]) => {
            const dimName = dimension as HEARTIDimension;
            const isActive = activeDimension === dimension;
            const color = dimensionColors[dimName];
            
            return (
              <TabsTrigger 
                key={dimension}
                value={dimension} 
                className={`flex flex-col items-center justify-center gap-1 py-3`}
                style={{ 
                  color: isActive ? color : undefined,
                  backgroundColor: isActive ? `${color}10` : undefined
                }}
                onClick={() => onDimensionChange(dimName)}
              >
                <Icon size={isMobile ? 16 : 18} style={{ color }} />
                <span className={isMobile ? "text-xs" : "text-sm"}>{t(`dimensions.${dimName}`)}</span>
              </TabsTrigger>
            );
          })}
      </TabsList>
    </div>
  );
};

export default HabitTabs;
