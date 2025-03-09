
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg">Loading data...</p>
      </div>
    </div>
  );
};

export default LoadingState;
