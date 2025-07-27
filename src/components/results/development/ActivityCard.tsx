
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Check, Plus } from 'lucide-react';
import FrequencySelector from './FrequencySelector';
import { dimensionIcons } from './DimensionIcons';
import { useActivityTranslations } from '@/utils/activityTranslations';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ActivityCardProps {
  activity: {
    id: string;
    category: string;
    description: string;
    dimension?: string;
  };
  isSelected: boolean;
  selectedFrequency: 'daily' | 'weekly' | 'monthly';
  onActivitySelect: (activityId: string) => void;
  onFrequencyChange: (frequency: 'daily' | 'weekly' | 'monthly') => void;
  onAddToHabitTracker: (activityId: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isSelected,
  selectedFrequency,
  onActivitySelect,
  onFrequencyChange,
  onAddToHabitTracker
}) => {
  const { t } = useLanguage();
  const { getTranslatedCategory, getTranslatedDescription } = useActivityTranslations();
  
  // Get the appropriate dimension icon or default to Plus
  const dimensionName = activity.dimension || 'humility';
  const DimensionIcon = dimensionIcons[dimensionName] || Plus;
  
  // Get properly translated category and description
  const displayCategory = getTranslatedCategory(activity.category);
  const displayDescription = getTranslatedDescription(activity.id, activity.description);

  return (
    <Card 
      key={activity.id} 
      className={`cursor-pointer transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 dark:border-indigo-800' : 'dark:bg-gray-900'}`}
      onClick={() => onActivitySelect(activity.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <div className={`mt-1 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}>
            {isSelected ? <Check size={18} /> : <DimensionIcon size={18} />}
          </div>
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white dark:font-bold">{displayCategory}</h4>
            <p className="text-sm mt-1 dark:text-gray-300">{displayDescription}</p>
          </div>
        </div>
        {isSelected && (
          <div className="mt-3 pt-3 border-t dark:border-gray-700">
            <FrequencySelector 
              selectedFrequency={selectedFrequency}
              onFrequencyChange={onFrequencyChange}
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center gap-2 text-indigo-700 dark:text-indigo-400 dark:border-gray-700 dark:hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                onAddToHabitTracker(activity.id);
              }}
            >
              <BarChart size={14} />
              {t('results.development.addToHabitTracker')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
