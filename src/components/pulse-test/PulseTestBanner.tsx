import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Target } from 'lucide-react';

interface PulseTestBannerProps {
  daysSinceLastAssessment: number;
  isTimeForPulse: boolean;
  isTimeForFull: boolean;
  onStartPulseTest: () => void;
  onStartFullAssessment: () => void;
}

export const PulseTestBanner: React.FC<PulseTestBannerProps> = ({
  daysSinceLastAssessment,
  isTimeForPulse,
  isTimeForFull,
  onStartPulseTest,
  onStartFullAssessment
}) => {
  if (!isTimeForPulse && !isTimeForFull) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5 mb-6">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            {isTimeForFull ? <Target className="h-6 w-6 text-primary" /> : <TrendingUp className="h-6 w-6 text-primary" />}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">
              {isTimeForFull ? 'Time for Your Annual HEARTI Assessment!' : 'HEARTI Coach Pulse Check'}
            </h3>
            
            <p className="text-muted-foreground mb-4">
              {isTimeForFull ? (
                `It's been ${daysSinceLastAssessment} days since your initial assessment. Take your comprehensive annual HEARTI assessment to see your leadership growth over the year.`
              ) : (
                `It's been ${daysSinceLastAssessment} days since your last assessment. Take a quick 6-question pulse test to track your leadership development progress.`
              )}
            </p>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="h-4 w-4" />
              <span>
                {isTimeForFull ? 'Annual assessment recommended' : 'Pulse test available'}
              </span>
            </div>
            
            <div className="flex gap-3">
              {isTimeForFull ? (
                <Button onClick={onStartFullAssessment} className="bg-primary hover:bg-primary/90">
                  Take Full Assessment
                </Button>
              ) : (
                <Button onClick={onStartPulseTest} className="bg-primary hover:bg-primary/90">
                  Start Pulse Test (6 questions)
                </Button>
              )}
              
              <Button variant="outline" onClick={() => {}}>
                Remind Me Later
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};