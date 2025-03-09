
import React from 'react';
import { format } from 'date-fns';
import { Award, Calendar } from 'lucide-react';

const TodayHeader: React.FC = () => {
  const today = new Date();
  const todayFormatted = format(today, 'EEEE, MMMM d');

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Calendar size={18} className="mr-2 text-blue-600" />
        <div>
          <p className="text-sm text-muted-foreground">Today</p>
          <h2 className="text-xl font-bold">{todayFormatted}</h2>
        </div>
      </div>
      <div className="flex items-center bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-full text-xs font-medium">
        <Award size={14} className="mr-1.5 text-indigo-600" />
        30 Completions = Mastery
      </div>
    </div>
  );
};

export default TodayHeader;
