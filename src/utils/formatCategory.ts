/**
 * Format category names from the database format to display format
 */
export const formatCategoryName = (category: string | undefined): string => {
  if (!category) return '';
  
  // Handle special cases like "UI/UX" or "OS/Hardware"
  if (category.includes('/')) {
    return category.split('/').map(part => formatCategoryName(part)).join('/');
  }
  
  // Replace underscores and dashes with spaces
  let formatted = category.replace(/[-_]/g, ' ');
  
  // Special case for ampersand - keep it but ensure spaces around it
  formatted = formatted.replace(/\s*&\s*/g, ' & ');
  
  // Handle specific category formats
  const lowerCaseCategory = formatted.toLowerCase();
  
  // Special cases mapping
  const specialCases: Record<string, string> = {
    'ai': 'AI',
    'ml': 'ML',
    'ui': 'UI',
    'ux': 'UX',
    'devops': 'DevOps',
    'tdd': 'TDD',
    'qa': 'QA',
    'api': 'API',
    'cicd': 'CI/CD',
    'os': 'OS'
  };
  
  // Process words with special handling for certain cases
  return formatted.split(' ')
    .map(word => {
      const lowercaseWord = word.toLowerCase();
      
      // Check if the word is in our special cases
      if (specialCases[lowercaseWord]) {
        return specialCases[lowercaseWord];
      }
      
      // Default title case transformation
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};
