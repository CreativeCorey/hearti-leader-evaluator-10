
import React, { useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LoadingState: React.FC = () => {
  const [isStalled, setIsStalled] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  
  useEffect(() => {
    // Set a timeout to detect stalled loading
    const timeout = setTimeout(() => {
      setIsStalled(true);
    }, 5000); // 5 seconds timeout
    
    // Check if there are any console errors indicating a failed connection
    const checkForErrors = setTimeout(() => {
      setErrorOccurred(true);
    }, 8000); // 8 seconds timeout
    
    return () => {
      clearTimeout(timeout);
      clearTimeout(checkForErrors);
    };
  }, []);
  
  const handleReload = () => {
    window.location.reload();
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] space-y-4">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Loading your data...</h2>
        
        {(isStalled || errorOccurred) && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-md">
              <p className="text-amber-700">
                {errorOccurred 
                  ? "We're having trouble connecting to our servers." 
                  : "Loading seems to be taking longer than expected."}
              </p>
              <p className="text-amber-700 mt-2 text-sm">
                This could be due to a slow internet connection or a temporary server issue.
              </p>
            </div>
            
            <Button 
              onClick={handleReload} 
              className="w-full flex items-center justify-center gap-2"
              variant="default"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingState;
