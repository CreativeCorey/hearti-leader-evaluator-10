
import { HEARTIAssessment } from '@/types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const createPdfDocument = (): jsPDF => {
  return new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [8.5, 11],
    compress: true
  });
};

export const exportToPDF = async (element: HTMLElement, assessment: HEARTIAssessment) => {
  // Create a temporary container with the PDF styles applied
  const tempContainer = document.createElement('div');
  tempContainer.className = 'pdf-container';
  document.body.appendChild(tempContainer);
  
  // Clone the element and add to temp container
  const clonedElement = element.cloneNode(true) as HTMLElement;
  tempContainer.appendChild(clonedElement);
  
  // Add the PDF-specific stylesheet
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = '/src/styles/pdf-report.css';
  tempContainer.appendChild(linkElement);
  
  try {
    // Force browser to calculate layout with PDF styles
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Determine the height of the content
    const contentHeight = tempContainer.scrollHeight;
    const pageHeight = 11 * 96; // 11 inches at 96 DPI
    const totalPages = Math.ceil(contentHeight / pageHeight);
    
    const pdf = createPdfDocument();
    
    // Capture each page of content
    for (let i = 0; i < totalPages; i++) {
      // If not the first page, add a new page
      if (i > 0) {
        pdf.addPage();
      }
      
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        width: 8.5 * 96, // 8.5 inches at 96 DPI
        height: pageHeight,
        y: i * pageHeight, // Offset to capture the correct portion
        windowWidth: 8.5 * 96,
        windowHeight: contentHeight
      });
      
      // Add the image to the PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, 8.5, 11);
    }
    
    // Save the PDF
    pdf.save(`HEARTI_Assessment_${assessment.id}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    // Clean up
    document.body.removeChild(tempContainer);
  }
};
