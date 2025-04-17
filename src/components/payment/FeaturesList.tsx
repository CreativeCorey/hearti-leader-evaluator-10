
import React from 'react';
import { CardContent } from '@/components/ui/card';

export const FeaturesList = () => {
  return (
    <CardContent className="space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">What's included:</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-primary h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5">✓</div>
            <span>Detailed assessment of all 6 leadership skills</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-primary h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5">✓</div>
            <span>Personalized development activities</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-primary h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5">✓</div>
            <span>Progress tracking and habit builder tools</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-primary h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5">✓</div>
            <span>Compare your scores with industry benchmarks</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-primary h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5">✓</div>
            <span>Export your results and share with your team</span>
          </li>
        </ul>
      </div>
      
      <div className="text-center pt-4">
        <p className="text-2xl font-bold">$49.00</p>
        <p className="text-sm text-muted-foreground">One-time payment, lifetime access</p>
      </div>
    </CardContent>
  );
};
