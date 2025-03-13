
import React from 'react';
import { CheckCircle } from 'lucide-react';

const CompletedHabitBadge: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs">
      <CheckCircle size={12} />
      <span className="font-medium">Mastered</span>
    </div>
  );
};

export default CompletedHabitBadge;
