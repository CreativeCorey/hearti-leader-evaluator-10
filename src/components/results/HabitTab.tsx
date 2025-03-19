
import React from 'react';
import { HEARTIDimension } from '@/types';
import HabitTrackerCore from '@/components/habit-tracker/HabitTrackerCore';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface HabitTabProps {
  focusDimension: HEARTIDimension;
}

const HabitTab: React.FC<HabitTabProps> = ({ focusDimension }) => {
  const { t } = useLanguage();
  
  const title = t('results.habits.trackerTitle', {
    fallback: "HEARTI™ Leadership Habit Tracker"
  });
  
  const description = t('results.habits.trackerDescription', {
    fallback: "Track your progress as you build consistent habits for your chosen behaviors. Complete each behavior 30 times to turn it into a lasting habit."
  });
  
  const recommendedFocus = t('results.habits.recommendedFocus', {
    fallback: "We recommend focusing on behaviors from your development area:"
  });
  
  const addBehaviorsInstructions = t('results.habits.addBehaviorsInstructions', {
    fallback: "Add behaviors to your habit tracker by using the \"Add to Habit Tracker\" button in the Development tab or on your saved activities."
  });
  
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2 text-center sm:text-left">{title}</h2>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <p className="text-sm font-medium">{recommendedFocus}</p>
          <span className="uppercase text-sm font-bold">{focusDimension}</span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">{addBehaviorsInstructions}</p>
        
        <HabitTrackerCore focusDimension={focusDimension} />
      </div>
    </div>
  );
};

export default HabitTab;
