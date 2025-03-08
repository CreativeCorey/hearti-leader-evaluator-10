
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
      <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p className="mt-4 text-gray-600">Loading your habits...</p>
    </div>
  );
};

export default LoadingSpinner;
