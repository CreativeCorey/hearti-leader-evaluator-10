
import React from 'react';
import { format, isSameDay } from 'date-fns';

interface WeekHeaderProps {
  weekDates: Date[];
}

const WeekHeader: React.FC<WeekHeaderProps> = ({ weekDates }) => {
  return (
    <div className="grid grid-cols-7 gap-2 mb-2">
      <div className="font-medium text-sm text-muted-foreground">Habit</div>
      {weekDates.map((date, i) => (
        <div 
          key={i} 
          className={`text-center text-sm font-medium ${
            isSameDay(date, new Date()) ? 'text-indigo-600' : 'text-muted-foreground'
          }`}
        >
          <div>{format(date, 'EEE')}</div>
          <div>{format(date, 'd')}</div>
        </div>
      ))}
    </div>
  );
};

export default WeekHeader;
