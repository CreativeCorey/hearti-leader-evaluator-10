
/**
 * Formats activity category names by adding spaces between words
 * and ensuring proper Title Case format
 */
export const formatCategoryName = (category: string): string => {
  if (!category) return '';
  
  // First check if it's in our common categories dictionary
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
    'perspectivegiving': 'Perspective Giving',
    'escuchaactiva': 'Escucha Activa',
    'tomadeperspectiva': 'Toma de Perspectiva',
    'construirconexiones': 'Construir Conexiones',
    'construirconexionesrelaciones': 'Construir Conexiones',
    'ascoltoattivo': 'Ascolto Attivo',
    'presadiperspettiva': 'Presa di Prospettiva',
    'costruireconnessioni': 'Costruire Connessioni',
    'ecouteactive': 'Écoute Active',
    'prisedeperspective': 'Prise de Perspective',
    'creerdesliens': 'Créer des Liens',
    // Fix for specific category formatting issues seen in screenshots
    'settingclearexpectations': 'Setting Clear Expectations',
    'trackingprogress': 'Tracking Progress',
    'buildingtrust': 'Building Trust',
    'takingownership': 'Taking Ownership',
    // Ensure single words are properly capitalized
    'settingclearexpectations': 'Setting Clear Expectations',
    'trackingprogress': 'Tracking Progress',
    'buildingtrust': 'Building Trust',
  };
  
  if (commonCategories[lowerCaseCategory]) {
    return commonCategories[lowerCaseCategory];
  }
  
  // Handle concatenated category names like "SettingclearExpectations"
  if (/^[A-Za-z]+$/.test(category)) {
    // For single-word categories that don't match our dictionary
    if (!/[A-Z]/.test(category.substring(1))) {
      // If there are no capital letters after the first letter
      return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    }
    
    // Break camelCase into separate words
    let result = category.replace(/([a-z])([A-Z])/g, '$1 $2');
    // Capitalize first letter of each word
    return result.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
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
  
  // Capitalize each word
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
