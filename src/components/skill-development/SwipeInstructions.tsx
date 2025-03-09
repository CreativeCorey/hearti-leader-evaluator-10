
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const SwipeInstructions: React.FC = () => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Hide the instructions after a few seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!visible) return null;
  
  return (
    <Card className="bg-blue-50 border-blue-200 p-3 mb-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-blue-700">
          <ArrowRight className="h-4 w-4 mr-2" />
          <span className="text-xs">Swipe right to save</span>
        </div>
        <div className="flex items-center text-green-700">
          <span className="text-xs">Swipe left to add to tracker</span>
          <ArrowLeft className="h-4 w-4 ml-2" />
        </div>
      </div>
    </Card>
  );
};

export default SwipeInstructions;
