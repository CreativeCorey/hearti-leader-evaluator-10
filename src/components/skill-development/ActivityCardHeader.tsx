
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

// Function to format category names from camelCase to Title Case With Spaces
const formatCategoryName = (category: string): string => {
  if (!category) return '';
  
  // Handle categories that are in camelCase format
  if (category.match(/[a-z][A-Z]/)) {
    // Split camelCase into words and capitalize first letter of each word
    return category
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  // If it's not camelCase, just capitalize the first letter
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const ActivityCardHeader: React.FC<ActivityCardHeaderProps> = ({ 
  activity, 
  showExpandButton = false,
  toggleExpanded,
  isSaved = false,
  expanded = false
}) => {
  const { t } = useLanguage();
  const formattedCategory = formatCategoryName(activity.category);
  
  // Get category translation with fallback to formatted English category
  const categoryKey = `activities.categories.${activity.category}`;
  const translatedCategory = t(categoryKey, { fallback: formattedCategory });
  
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
