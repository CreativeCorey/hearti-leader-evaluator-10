
import { HEARTIAssessment } from '@/types';
import { createPdfDocument, createTempContainer } from './documentSetup';
import { createPdfStyles } from './pdfStyles';
import { calculateTotalPages, renderPdfPage } from './pdfRendering';

/**
 * Main function to export a HEARTI report to PDF
 * @param element The HTML element containing the report content
 * @param assessment The assessment data for the report
 * @returns Promise that resolves when the PDF is saved
 */
export const exportToPDF = async (element: HTMLElement, assessment: HEARTIAssessment): Promise<void> => {
  // Set up styling and container
  const pdfStyles = createPdfStyles();
  const tempContainer = createTempContainer(element, pdfStyles);
  
  try {
    // Force browser to calculate layout with PDF styles
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clone the element to avoid modifying the original DOM
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Find all carousel pages and ensure they're visible
    const carouselItems = clonedElement.querySelectorAll('.pdf-page');
    carouselItems.forEach((item) => {
      (item as HTMLElement).style.display = 'block';
    });
    
    // Determine the height of the content with all pages visible
    const contentHeight = tempContainer.scrollHeight;
    const docPageHeight = 10 * 96; // 10 inches (11 - 1 margin) at 96 DPI
    
    // Create PDF document
    const pdf = createPdfDocument();
    
    // Calculate total pages needed
    const totalPages = calculateTotalPages(contentHeight, docPageHeight);
    
    // Render each page
    for (let i = 0; i < totalPages; i++) {
      await renderPdfPage(pdf, tempContainer, i, docPageHeight, contentHeight);
    }
    
    // Save the PDF
    pdf.save(`HEARTI_Assessment_${assessment.id}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error; // Rethrow to allow caller to handle errors
  } finally {
    // Clean up the temporary container
    if (document.body.contains(tempContainer)) {
      document.body.removeChild(tempContainer);
    }
  }
};
