
/**
 * Formats category names to be more readable
 * Handles compound words by adding spaces and proper capitalization
 */
export function formatCategoryName(category: string): string {
  if (!category) return '';
  
  // Handle compound words by adding spaces before capital letters (except the first one)
  // and before common word boundaries
  let formatted = category
    // Add space before capital letters that follow lowercase letters
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Handle specific compound words commonly found in the activities
    .replace(/activelistening/gi, 'Active Listening')
    .replace(/selfreflection/gi, 'Self-Reflection')
    .replace(/perspectivetaking/gi, 'Perspective-Taking')
    .replace(/buildingconnections/gi, 'Building Connections')
    .replace(/emotionalawareness/gi, 'Emotional Awareness')
    .replace(/acknowledgingothers/gi, 'Acknowledging Others')
    .replace(/settingclearexpectations/gi, 'Setting Clear Expectations')
    .replace(/takingownership/gi, 'Taking Ownership')
    .replace(/trackingprogress/gi, 'Tracking Progress')
    .replace(/buildingtrust/gi, 'Building Trust')
    .replace(/continuousimprovement/gi, 'Continuous Improvement')
    .replace(/mindsetshifts/gi, 'Mindset Shifts')
    .replace(/stressmanagement/gi, 'Stress Management')
    .replace(/problemsolvingskills/gi, 'Problem-Solving Skills')
    .replace(/emotionalregulation/gi, 'Emotional Regulation')
    .replace(/supportsystemscommunity/gi, 'Support Systems & Community')
    .replace(/opencommunication/gi, 'Open Communication')
    .replace(/sharinginformation/gi, 'Sharing Information')
    .replace(/empoweringothers/gi, 'Empowering Others')
    .replace(/buildingawareness/gi, 'Building Awareness')
    .replace(/creatingsafespaces/gi, 'Creating Safe Spaces')
    .replace(/promotingequity/gi, 'Promoting Equity')
    .replace(/fosteringcollaboration/gi, 'Fostering Collaboration')
    .replace(/leadingbyexample/gi, 'Leading by Example');
  
  // Capitalize the first letter of each word
  formatted = formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return formatted;
}
