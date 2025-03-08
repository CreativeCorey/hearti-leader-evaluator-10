
import React from 'react';
import { Calendar } from 'lucide-react';
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
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Calendar className="text-white" size={24} />
          HEARTI™ Habit Tracker
        </CardTitle>
        <CardDescription className="text-indigo-100">
          Build consistent habits to strengthen your leadership dimensions
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-3' : 'p-6'} bg-gray-50`}>
        <HabitTrackerCore focusDimension={focusDimension} />
      </CardContent>
      <CardFooter className="bg-white p-4 text-sm text-muted-foreground border-t">
        <p>Consistently practicing these habits will strengthen your HEARTI skills over time.</p>
      </CardFooter>
    </Card>
  );
};

export default HabitTracker;
