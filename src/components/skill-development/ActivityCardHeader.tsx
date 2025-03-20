
import React from 'react';
import { ChevronDown, ChevronUp, BookmarkCheck } from 'lucide-react';
import { SkillActivity } from '@/data/heartActivities';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ActivityCardHeaderProps {
  activity: SkillActivity;
  showExpandButton?: boolean;
  toggleExpanded?: () => void;
  isSaved?: boolean;
  expanded?: boolean;
}

const ActivityCardHeader: React.FC<ActivityCardHeaderProps> = ({ 
  activity, 
  showExpandButton = false,
  toggleExpanded,
  isSaved = false,
  expanded = false
}) => {
  const { t } = useLanguage();
  
  // Get category translation with fallback to formatted English category
  const categoryKey = `activities.categories.${activity.category.toLowerCase().replace(/[- ]/g, '')}`;
  const translatedCategory = t(categoryKey, { fallback: activity.category });
  
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center">
        {isSaved && (
          <BookmarkCheck size={18} className="text-indigo-500 mr-1.5" />
        )}
        <h3 className="text-base font-medium text-indigo-600">{translatedCategory}</h3>
      </div>
      
      {showExpandButton && toggleExpanded && (
        <button 
          onClick={toggleExpanded}
          className="text-gray-500 hover:text-gray-700 p-1 -mt-1"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
      )}
    </div>
  );
};

export default ActivityCardHeader;
