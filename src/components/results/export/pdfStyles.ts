
/**
 * PDF styling utilities for consistent PDF exports
 */

/**
 * Generates and applies PDF-specific styles to the temporary container
 * @returns The style element with PDF styles
 */
export const createPdfStyles = (): HTMLStyleElement => {
  const style = document.createElement('style');
  
  // Instead of having styles directly here, we now import them from CSS files
  // This empty style element will automatically inherit all the PDF styles from 
  // the CSS files imported in pdf-report.css when added to the DOM
  style.textContent = '';
  
  return style;
};
