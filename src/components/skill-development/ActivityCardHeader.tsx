
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
  
  // Improved function to format category names with spaces
  const formatCategoryName = (category: string): string => {
    // First, handle camelCase by inserting spaces before capital letters
    let formatted = category.replace(/([a-z])([A-Z])/g, '$1 $2');
    
    // Handle special characters and formatting
    formatted = formatted
      .replace(/([a-z])&([a-z])/gi, '$1 & $2')
      .replace(/selfreflection/i, 'Self Reflection')
      .replace(/mindsetshifts/i, 'Mindset Shifts')
      .replace(/stressmanagement/i, 'Stress Management')
      .replace(/trackingprogress/i, 'Tracking Progress')
      .replace(/opencommunication/i, 'Open Communication')
      .replace(/buildingawareness/i, 'Building Awareness')
      .replace(/emotionalawareness/i, 'Emotional Awareness')
      .replace(/emotionalregulation/i, 'Emotional Regulation')
      .replace(/buildingconnections/i, 'Building Connections');
    
    // Handle specific cases to give better names
    const specialCases: Record<string, string> = {
      'Setting Clear Expectations': 'Expectation Setting',
      'Taking Ownership': 'Taking Ownership',
      'Problem Solving Skills': 'Problem Solving',
      'Support Systems & Community': 'Support Systems',
      'Building Awareness': 'Building Awareness',
      'Creating Safe Spaces': 'Creating Safe Spaces',
      'Promoting Equity': 'Promoting Equity',
      'Leading By Example': 'Leading By Example',
      'Self Reflection Awareness': 'Self Reflection & Awareness',
      'Perspective Taking': 'Perspective Taking',
      'Emotional Awareness': 'Emotional Awareness',
      'Continuous Improvement': 'Continuous Improvement',
      'Open Communication': 'Open Communication',
      'Sharing Information': 'Sharing Information',
      'Fostering Collaboration': 'Fostering Collaboration'
    };
    
    // Check if we have a special case for this category
    for (const [original, replacement] of Object.entries(specialCases)) {
      if (formatted.toLowerCase() === original.toLowerCase()) {
        return replacement;
      }
    }
    
    // For categories without special case, just capitalize first letter of each word
    return formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Get category translation with fallback to formatted English category
  const categoryKey = `activities.categories.${activity.category.toLowerCase().replace(/[- ]/g, '')}`;
  const formattedCategory = formatCategoryName(activity.category);
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
