
import React from 'react';

const EmptyHabitState: React.FC = () => {
  return (
    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
      <p className="text-muted-foreground">No habits found. Click "Add Habit" to create one.</p>
    </div>
  );
};

export default EmptyHabitState;
