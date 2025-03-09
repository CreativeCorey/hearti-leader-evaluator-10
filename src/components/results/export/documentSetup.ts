
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
  const tempContainer = document.createElement('div');
  tempContainer.className = 'pdf-container';
  document.body.appendChild(tempContainer);
  
  // Clone the element and add to temp container
  const clonedElement = content.cloneNode(true) as HTMLElement;
  tempContainer.appendChild(clonedElement);
  tempContainer.appendChild(style);
  
  return tempContainer;
};
