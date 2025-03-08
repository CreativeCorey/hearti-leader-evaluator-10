
import React from 'react';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

const TodayHeader: React.FC = () => {
  const isMobile = useIsMobile();
  // Get today's formatted date for display
  const todayFormatted = format(new Date(), 'EEEE, MMMM d');

  return (
    <div className="flex flex-col space-y-2">
      <h2 className={`${isMobile ? 'text-2xl' : 'text-2xl'} font-bold text-blue`}>Today</h2>
      <p className="text-muted-foreground">{todayFormatted}</p>
    </div>
  );
};

export default TodayHeader;
