
// Utility function to format category names properly
export const formatCategory = (category: string): string => {
  // First, handle camelCase by inserting spaces before capital letters
  let formatted = category.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // Replace special characters with spaces and handle ampersands
  formatted = formatted.replace(/([a-z])&([a-z])/gi, '$1 & $2');
  
  // Handle all specific keyword cases that need spaces
  formatted = formatted
    .replace(/selfreflection/i, 'Self Reflection')
    .replace(/mindsetshifts/i, 'Mindset Shifts')
    .replace(/stressmanagement/i, 'Stress Management')
    .replace(/trackingprogress/i, 'Tracking Progress')
    .replace(/opencommunication/i, 'Open Communication')
    .replace(/buildingawareness/i, 'Building Awareness')
    .replace(/emotionalawareness/i, 'Emotional Awareness')
    .replace(/emotionalregulation/i, 'Emotional Regulation')
    .replace(/buildingconnections/i, 'Building Connections')
    .replace(/selfreflectionawareness/i, 'Self Reflection & Awareness')
    .replace(/problemsolvingskills/i, 'Problem Solving Skills')
    .replace(/supportsystemscommunity/i, 'Support Systems & Community')
    .replace(/settingclearexpectations/i, 'Setting Clear Expectations')
    .replace(/takingownership/i, 'Taking Ownership')
    .replace(/creatingsafespaces/i, 'Creating Safe Spaces')
    .replace(/promotingequity/i, 'Promoting Equity')
    .replace(/fosteringcollaboration/i, 'Fostering Collaboration')
    .replace(/leadingbyexample/i, 'Leading By Example')
    .replace(/sharinginformation/i, 'Sharing Information')
    .replace(/empoweringothers/i, 'Empowering Others')
    .replace(/continuousimprovement/i, 'Continuous Improvement')
    .replace(/buildingtrust/i, 'Building Trust')
    .replace(/acknowledgingothers/i, 'Acknowledging Others')
    .replace(/activelistening/i, 'Active Listening')
    .replace(/perspectivetaking/i, 'Perspective Taking');
  
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
    'Self Reflection & Awareness': 'Self Reflection & Awareness',
    'Perspective Taking': 'Perspective Taking',
    'Emotional Awareness': 'Emotional Awareness',
    'Emotional Regulation': 'Emotional Regulation',
    'Continuous Improvement': 'Continuous Improvement',
    'Open Communication': 'Open Communication',
    'Sharing Information': 'Sharing Information',
    'Fostering Collaboration': 'Fostering Collaboration',
    'Building Trust': 'Building Trust',
    'Building Connections': 'Building Connections',
    'Empowering Others': 'Empowering Others',
    'Acknowledging Others': 'Acknowledging Others'
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
