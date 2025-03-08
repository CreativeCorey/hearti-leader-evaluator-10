
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
  
  try {
    // Apply PDF-specific styles
    const style = document.createElement('style');
    style.textContent = `
      .pdf-container {
        width: 8.5in;
        padding: 0.5in;
        box-sizing: border-box;
        background-color: white;
        color: #333;
        font-family: 'Arial', sans-serif;
        line-height: 1.5;
      }
      
      .pdf-container * {
        box-sizing: border-box;
      }
      
      .pdf-chart-container {
        height: 5.5in !important;
      }
      
      .pdf-charts-grid {
        display: flex !important;
        flex-direction: row !important;
        justify-content: space-between !important;
      }
      
      .pdf-chart-column {
        width: 3.5in !important;
        height: auto !important;
      }
      
      .pdf-dimension-card {
        page-break-inside: avoid !important;
      }
    `;
    tempContainer.appendChild(style);
    
    // Force browser to calculate layout with PDF styles
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Determine the height of the content
    const contentHeight = tempContainer.scrollHeight;
    const pageHeight = 10.5 * 96; // 10.5 inches (11 - 0.5 margin) at 96 DPI
    const totalPages = Math.ceil(contentHeight / pageHeight);
    
    const pdf = createPdfDocument();
    
    // Capture each page of content
    for (let i = 0; i < totalPages; i++) {
      // If not the first page, add a new page
      if (i > 0) {
        pdf.addPage();
      }
      
      // Calculate the position to capture
      const yPosition = i * pageHeight;
      
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        width: 8.5 * 96, // 8.5 inches at 96 DPI
        height: Math.min(pageHeight, contentHeight - yPosition), // Capture only what's needed
        y: yPosition, // Offset to capture the correct portion
        windowWidth: 8.5 * 96,
        windowHeight: contentHeight
      });
      
      // Add the image to the PDF
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
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
