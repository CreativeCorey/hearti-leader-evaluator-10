
import React from 'react';
import { Hexagon, Award, Calendar, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { HEARTIDimension } from '@/types';
import HabitTrackerCore from './habit-tracker/HabitTrackerCore';
import { useIsMobile } from '@/hooks/use-mobile';
import { completionGoals } from '@/constants/habitGoals';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface HabitTrackerProps {
  focusDimension?: HEARTIDimension;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ focusDimension }) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  return (
    <Card className="shadow-lg border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue to-light-blue text-white">
        <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
          <Hexagon className="text-white" size={24} />
          {t('results.habits.title')}
        </CardTitle>
        <CardDescription className="text-blue-100 flex items-center gap-2 text-sm sm:text-base">
          <Calendar className="text-blue-100" size={16} />
          {t('assessment.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-3 sm:p-4' : 'p-6'} bg-gray-50`}>
        <HabitTrackerCore focusDimension={focusDimension} />
      </CardContent>
      <CardFooter className="bg-white p-3 text-xs sm:text-sm text-muted-foreground border-t flex items-center">
        <Target size={16} className="mr-2 text-blue-600" />
        <p>
          {t('results.habits.daily')}: {completionGoals.daily} | 
          {t('results.habits.weekly')}: {completionGoals.weekly} | 
          {t('results.habits.monthly')}: {completionGoals.monthly}
        </p>
      </CardFooter>
    </Card>
  );
};

export default HabitTracker;
