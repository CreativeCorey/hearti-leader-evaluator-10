
/**
 * Formats activity category names by adding spaces between words
 * and handling special cases
 */
export const formatCategoryName = (category: string): string => {
  // First, handle camelCase by inserting spaces before capital letters
  let formatted = category.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // Replace special characters with spaces and handle ampersands
  formatted = formatted.replace(/([a-z])&([a-z])/gi, '$1 & $2');
  
  // Handle all specific keyword cases that need spaces
  const specialCases: Record<string, string> = {
    'settingclearexpectations': 'Setting Clear Expectations',
    'takingownership': 'Taking Ownership',
    'activelistening': 'Active Listening',
    'selfreflection': 'Self Reflection',
    'mindsetshifts': 'Mindset Shifts',
    'stressmanagement': 'Stress Management',
    'trackingprogress': 'Tracking Progress',
    'opencommunication': 'Open Communication',
    'buildingawareness': 'Building Awareness',
    'emotionalawareness': 'Emotional Awareness',
    'emotionalregulation': 'Emotional Regulation',
    'buildingconnections': 'Building Connections',
    'selfreflectionawareness': 'Self Reflection & Awareness',
    'problemsolvingskills': 'Problem Solving Skills',
    'supportsystemscommunity': 'Support Systems & Community',
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
  };
  
  // Check if we have a direct match in our special cases
  const lowerCategory = formatted.toLowerCase().replace(/\s+/g, '');
  if (specialCases[lowerCategory]) {
    return specialCases[lowerCategory];
  }
  
  // For categories without a direct match, capitalize first letter of each word
  return formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
