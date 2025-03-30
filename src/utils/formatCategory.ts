
/**
 * Formats activity category names by adding spaces between words
 * and handling special cases
 */
export const formatCategoryName = (category: string): string => {
  if (!category) return '';
  
  // First, handle camelCase by inserting spaces before capital letters
  let formatted = category.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // Replace hyphens with spaces
  formatted = formatted.replace(/-/g, ' ');
  
  // Replace special characters with spaces and handle ampersands
  formatted = formatted.replace(/([a-z])&([a-z])/gi, '$1 & $2');
  
  // Handle common concatenated category names
  const commonCategories: Record<string, string> = {
    'activelistening': 'Active Listening',
    'selfreflection': 'Self Reflection',
    'selfreflectionawareness': 'Self Reflection & Awareness',
    'mindsetshifts': 'Mindset Shifts',
    'stressmanagement': 'Stress Management',
    'trackingprogress': 'Tracking Progress',
    'opencommunication': 'Open Communication',
    'buildingawareness': 'Building Awareness',
    'emotionalawareness': 'Emotional Awareness',
    'emotionalregulation': 'Emotional Regulation',
    'buildingconnections': 'Building Connections',
    'problemsolvingskills': 'Problem Solving Skills',
    'supportsystemscommunity': 'Support Systems & Community',
    'settingclearexpectations': 'Setting Clear Expectations',
    'takingownership': 'Taking Ownership',
    'creatingsafespaces': 'Creating Safe Spaces',
    'promotingequity': 'Promoting Equity',
    'fosteringcollaboration': 'Fostering Collaboration',
    'leadingbyexample': 'Leading By Example',
    'sharinginformation': 'Sharing Information',
    'empoweringothers': 'Empowering Others',
    'continuousimprovement': 'Continuous Improvement',
    'buildingtrust': 'Building Trust',
    'acknowledgingothers': 'Acknowledging Others',
    'perspectivetaking': 'Perspective Taking',
    'buildingconnections': 'Building Connections'
  };
  
  // Check if we have a direct match in our common categories
  const lowerCaseCategory = category.toLowerCase().replace(/[-\s]/g, '');
  if (commonCategories[lowerCaseCategory]) {
    return commonCategories[lowerCaseCategory];
  }
  
  // For categories without a match in our dictionary, 
  // capitalize first letter of each word
  return formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
