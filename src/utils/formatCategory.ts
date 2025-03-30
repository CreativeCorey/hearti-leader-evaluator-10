
/**
 * Formats activity category names by adding spaces between words
 * and ensuring proper Title Case format
 */
export const formatCategoryName = (category: string): string => {
  if (!category) return '';
  
  // Convert camelCase, hyphenated, or concatenated words to spaces
  let formatted = category
    // Add space before capital letters in camelCase
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace hyphens with spaces
    .replace(/-/g, ' ')
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Handle ampersand spacing - ensure spaces around &
    .replace(/([a-zA-Z])&([a-zA-Z])/g, '$1 & $2');
  
  // Handle common category names with custom formatting
  // This ensures consistent formatting for specific categories across all translations
  const lowerCaseCategory = category.toLowerCase().replace(/[-_\s&]/g, '');
  
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
    'buildingconnections': 'Building Connections',
    'perspectivemaking': 'Perspective Making',
    'perspectiveforming': 'Perspective Forming',
    'perspectivegiving': 'Perspective Giving'
  };
  
  if (commonCategories[lowerCaseCategory]) {
    return commonCategories[lowerCaseCategory];
  }
  
  // Otherwise, capitalize each word
  return formatted
    .split(' ')
    .map(word => {
      // Skip empty strings
      if (!word) return '';
      
      // Always capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};
