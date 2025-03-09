
import React from 'react';
import { Hexagon, Award, Calendar, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { HEARTIDimension } from '@/types';
import HabitTrackerCore from './habit-tracker/HabitTrackerCore';
import { useIsMobile } from '@/hooks/use-mobile';

interface HabitTrackerProps {
  focusDimension?: HEARTIDimension;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ focusDimension }) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="shadow-lg border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue to-light-blue text-white">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Hexagon className="text-white" size={24} />
          HEARTI™ Habit Tracker
        </CardTitle>
        <CardDescription className="text-blue-100 flex items-center gap-2">
          <Calendar className="text-blue-100" size={16} />
          Build consistent habits by practicing them 1 time to form lasting behaviors
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-3' : 'p-6'} bg-gray-50`}>
        <HabitTrackerCore focusDimension={focusDimension} />
      </CardContent>
      <CardFooter className="bg-white p-4 text-sm text-muted-foreground border-t flex items-center">
        <Target size={16} className="mr-2 text-blue-600" />
        <p>Complete each habit 1 time to turn it into a lasting behavioral change.</p>
      </CardFooter>
    </Card>
  );
};

export default HabitTracker;
