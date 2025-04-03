
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save, X, Clock } from 'lucide-react';
import { HEARTIDimension } from '@/types';
import { NewHabitForm } from '@/hooks/useHabits';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toggle } from '@/components/ui/toggle';
import { useLanguage } from '@/contexts/language/LanguageContext';

export interface HabitFormProps {
  newHabit: NewHabitForm;
  onCancel: () => void;
  onSave: () => void;
  onHabitChange: (value: Partial<NewHabitForm>) => void;
}

const HabitForm: React.FC<HabitFormProps> = ({
  newHabit,
  onCancel,
  onSave,
  onHabitChange
}) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  const dimensionOptions = {
    humility: t('dimensions.humility', { fallback: 'Humility' }),
    empathy: t('dimensions.empathy', { fallback: 'Empathy' }),
    accountability: t('dimensions.accountability', { fallback: 'Accountability' }),
    resiliency: t('dimensions.resiliency', { fallback: 'Resiliency' }),
    transparency: t('dimensions.transparency', { fallback: 'Transparency' }),
    inclusivity: t('dimensions.inclusivity', { fallback: 'Inclusivity' })
  };

  const dimensionLabel = t('results.habits.dimension', { fallback: 'Dimension' });
  const frequencyLabel = t('results.habits.frequency', { fallback: 'Frequency' });
  const descriptionLabel = t('results.habits.description', { fallback: 'Description' });
  const descriptionPlaceholder = t('results.habits.descriptionPlaceholder', { fallback: 'Enter a description for your habit' });
  const dailyLabel = t('results.habits.daily', { fallback: 'Daily' });
  const weeklyLabel = t('results.habits.weekly', { fallback: 'Weekly' });
  const monthlyLabel = t('results.habits.monthly', { fallback: 'Monthly' });
  const saveHabitLabel = t('results.habits.saveHabit', { fallback: 'Save Habit' });
  const cancelLabel = t('common.cancel', { fallback: 'Cancel' });
  
  return (
    <Card className="mb-6 border bg-white shadow-sm rounded-xl">
      <CardContent className={`${isMobile ? 'pt-4 px-3' : 'pt-6'}`}>
        <div className="grid gap-4">
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
            <div>
              <Label htmlFor="habit-dimension" className="text-sm font-medium mb-1.5">{dimensionLabel}</Label>
              <select
                id="habit-dimension"
                value={newHabit.dimension}
                onChange={(e) => onHabitChange({ dimension: e.target.value as HEARTIDimension })}
                className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="humility">{dimensionOptions.humility}</option>
                <option value="empathy">{dimensionOptions.empathy}</option>
                <option value="accountability">{dimensionOptions.accountability}</option>
                <option value="resiliency">{dimensionOptions.resiliency}</option>
                <option value="transparency">{dimensionOptions.transparency}</option>
                <option value="inclusivity">{dimensionOptions.inclusivity}</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="habit-frequency" className="text-sm font-medium mb-1.5 flex items-center">
                <Clock size={14} className="mr-1" />
                {frequencyLabel}
              </Label>
              <div className="flex gap-2 mt-1">
                <Toggle
                  pressed={newHabit.frequency === 'daily'}
                  onPressedChange={() => onHabitChange({ frequency: 'daily' })}
                  className={`flex-1 text-xs py-1 px-2 h-8 ${newHabit.frequency === 'daily' ? 'bg-blue-100 border-blue-300 text-blue-800' : ''}`}
                >
                  {dailyLabel}
                </Toggle>
                <Toggle
                  pressed={newHabit.frequency === 'weekly'}
                  onPressedChange={() => onHabitChange({ frequency: 'weekly' })}
                  className={`flex-1 text-xs py-1 px-2 h-8 ${newHabit.frequency === 'weekly' ? 'bg-purple-100 border-purple-300 text-purple-800' : ''}`}
                >
                  {weeklyLabel}
                </Toggle>
                <Toggle
                  pressed={newHabit.frequency === 'monthly'}
                  onPressedChange={() => onHabitChange({ frequency: 'monthly' })}
                  className={`flex-1 text-xs py-1 px-2 h-8 ${newHabit.frequency === 'monthly' ? 'bg-orange-100 border-orange-300 text-orange-800' : ''}`}
                >
                  {monthlyLabel}
                </Toggle>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="habit-description" className="text-sm font-medium mb-1.5">{descriptionLabel}</Label>
            <Input
              id="habit-description"
              value={newHabit.description}
              onChange={(e) => onHabitChange({ description: e.target.value })}
              placeholder={descriptionPlaceholder}
              className="p-2.5 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-row gap-3'} mt-2`}>
            <Button 
              onClick={onSave} 
              className={`${isMobile ? 'w-full' : 'flex-1'} bg-indigo-600 hover:bg-indigo-700 text-white`}
            >
              <Save size={16} className="mr-2" />
              {saveHabitLabel}
            </Button>
            {isMobile && (
              <Button 
                onClick={onCancel} 
                variant="outline" 
                className="w-full"
              >
                <X size={16} className="mr-2" />
                {cancelLabel}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitForm;
