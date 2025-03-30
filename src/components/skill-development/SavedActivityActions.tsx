
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Calendar, BookmarkCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface SavedActivityActionsProps {
  isCompleted: boolean;
  onToggleCompletion: (e: React.MouseEvent) => void;
  onShowFrequencySelector: () => void;
  onRemove: (e: React.MouseEvent) => void;
}

const SavedActivityActions: React.FC<SavedActivityActionsProps> = ({
  isCompleted,
  onToggleCompletion,
  onShowFrequencySelector,
  onRemove
}) => {
  const { t } = useLanguage();
  
  const markCompleteText = t('results.habits.markComplete', { fallback: "Mark Complete" });
  const completedText = t('results.habits.complete', { fallback: "Completed" });
  const addToTrackerText = t('results.development.addToHabitTracker', { fallback: "Add to Tracker" });
  const removeText = t('common.delete', { fallback: "Remove" });
  
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      <Button 
        variant={isCompleted ? "outline" : "default"}
        size="sm" 
        className="flex items-center gap-1" 
        onClick={onToggleCompletion}
      >
        {isCompleted ? (
          <>
            <Check size={16} className="text-green-600" />
            {completedText}
          </>
        ) : (
          markCompleteText
        )}
      </Button>
      
      <Button 
        variant="default" 
        size="sm"
        className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700"
        onClick={onShowFrequencySelector}
      >
        <Calendar size={16} />
        {addToTrackerText}
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <BookmarkCheck size={16} className="mr-1" />
        {removeText}
      </Button>
    </div>
  );
};

export default SavedActivityActions;
