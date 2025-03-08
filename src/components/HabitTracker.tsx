
import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { HEARTIDimension } from '@/types';
import HabitTrackerCore from './habit-tracker/HabitTrackerCore';

interface HabitTrackerProps {
  focusDimension?: HEARTIDimension;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ focusDimension }) => {
  return (
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Calendar className="text-indigo-600" size={24} />
          HEARTI Habit Tracker
        </CardTitle>
        <CardDescription>
          Build consistent habits to strengthen your leadership dimensions
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <HabitTrackerCore focusDimension={focusDimension} />
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 text-sm text-muted-foreground rounded-b-lg">
        <p>Consistently practicing these habits will strengthen your HEARTI skills over time.</p>
      </CardFooter>
    </Card>
  );
};

export default HabitTracker;
