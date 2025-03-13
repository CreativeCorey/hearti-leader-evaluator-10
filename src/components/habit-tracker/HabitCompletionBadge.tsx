
import React from 'react';
import { Trophy } from 'lucide-react';

const HabitCompletionBadge: React.FC = () => {
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-green-50 p-2">
            <Trophy size={24} className="text-green-600" />
          </div>
        </div>
        <p className="text-sm text-green-700 text-center">
          Congratulations! You've completed this habit 30 times and formed a lasting behavior.
        </p>
      </div>
    </div>
  );
};

export default HabitCompletionBadge;
