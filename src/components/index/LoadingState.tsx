
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LoadingState: React.FC = () => {
  const [isStalled, setIsStalled] = useState(false);
  
  useEffect(() => {
    // Set a timeout to detect stalled loading
    const timeout = setTimeout(() => {
      setIsStalled(true);
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(timeout);
  }, []);
  
  const handleReload = () => {
    window.location.reload();
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] space-y-4">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg">Loading data...</p>
        
        {isStalled && (
          <div className="mt-4 space-y-3">
            <p className="text-amber-600">Loading seems to be taking longer than expected.</p>
            <Button onClick={handleReload} variant="outline">
              Reload Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingState;
