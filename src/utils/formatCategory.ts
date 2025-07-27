
/**
 * Formats category names to be more readable
 * Handles compound words by adding spaces and proper capitalization
 */
export function formatCategoryName(category: string): string {
  if (!category) return '';
  
  // Handle specific compound words commonly found in the activities
  let formatted = category
    .toLowerCase()
    .replace(/selfreflectionawareness/gi, 'Self-Reflection & Awareness')
    .replace(/selfreflection/gi, 'Self-Reflection')
    .replace(/activelistening/gi, 'Active Listening')
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
    .replace(/leadingbyexample/gi, 'Leading by Example')
    .replace(/escuchaactiva/gi, 'Escucha Activa')
    .replace(/escuchaactive/gi, 'Escucha Activa');
  
  // If no specific replacement was made, try to add spaces before capital letters
  if (formatted === category.toLowerCase()) {
    formatted = category
      // Add space before capital letters that follow lowercase letters
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Capitalize the first letter of each word
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  return formatted;
}
