
import { jsPDF } from 'jspdf';

/**
 * Creates a new PDF document with consistent settings
 * @returns A configured jsPDF instance
 */
export const createPdfDocument = (): jsPDF => {
  return new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [8.5, 11],
    compress: true
  });
};

/**
 * Creates a temporary container for PDF content rendering
 * @param content The HTML element to clone into the container
 * @param style The style element to apply to the container
 * @returns The created temporary container element
 */
export const createTempContainer = (
  content: HTMLElement,
  style: HTMLStyleElement
): HTMLElement => {
  // Create the PDF container div
  const tempContainer = document.createElement('div');
  tempContainer.className = 'pdf-container';
  document.body.appendChild(tempContainer);
  
  // Clone the element and add to temp container
  const clonedElement = content.cloneNode(true) as HTMLElement;
  tempContainer.appendChild(clonedElement);
  
  // Add a link to our PDF stylesheet
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = '/src/styles/pdf-report.css';
  tempContainer.appendChild(linkElement);
  
  // Also append the style element for any dynamic styles
  tempContainer.appendChild(style);
  
  return tempContainer;
};
