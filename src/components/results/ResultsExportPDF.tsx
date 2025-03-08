
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
    // Apply comprehensive PDF-specific styles directly
    const style = document.createElement('style');
    style.textContent = `
      .pdf-container {
        width: 8.5in;
        height: auto;
        padding: 0.5in;
        box-sizing: border-box;
        background-color: white;
        color: #333;
        font-family: 'Arial', sans-serif;
        line-height: 1.5;
        overflow: hidden;
      }
      
      .pdf-container * {
        box-sizing: border-box;
      }
      
      .pdf-header {
        text-align: center;
        margin-bottom: 0.5in;
        padding-bottom: 0.25in;
        border-bottom: 1px solid #ddd;
        page-break-inside: avoid;
        page-break-after: avoid;
      }
      
      .pdf-title {
        font-size: 24pt;
        font-weight: bold;
        color: #6366f1;
        margin-bottom: 8pt;
      }
      
      .pdf-subtitle {
        font-size: 14pt;
        color: #6b7280;
      }
      
      .pdf-section {
        margin-bottom: 0.5in;
        page-break-inside: avoid;
      }
      
      .pdf-section-title {
        font-size: 18pt;
        font-weight: bold;
        color: #4f46e5;
        margin-bottom: 0.2in;
        padding-bottom: 6pt;
        border-bottom: 1px solid #e5e7eb;
        page-break-after: avoid;
      }
      
      .pdf-chart-container {
        height: 6in !important;
        page-break-inside: avoid;
        margin: 0.25in 0;
      }
      
      .pdf-charts-grid {
        display: flex !important;
        flex-direction: row !important;
        justify-content: space-between !important;
        page-break-after: always;
        page-break-inside: avoid;
      }
      
      .pdf-chart-column {
        width: 3.5in !important;
        padding: 0.3in !important;
      }
      
      .pdf-dimension-card {
        page-break-inside: avoid !important;
        margin-bottom: 0.5in !important;
        border: 1px solid #e5e7eb;
        border-radius: 8pt;
        overflow: hidden;
      }
      
      .pdf-dimension-header {
        padding: 12pt 16pt !important;
        page-break-after: avoid;
      }
      
      .pdf-dimension-content {
        padding: 16pt !important;
        background-color: #f9fafb;
      }
      
      .humility-header { background-color: #8B5CF6; }
      .empathy-header { background-color: #EC4899; }
      .accountability-header { background-color: #F97316; }
      .resiliency-header { background-color: #10B981; }
      .transparency-header { background-color: #0EA5E9; }
      .inclusivity-header { background-color: #6366F1; }
      
      .pdf-dimension-title {
        font-size: 16pt !important;
        font-weight: bold;
        margin-bottom: 8pt;
      }
      
      .pdf-dimension-score {
        font-size: 14pt !important;
        font-weight: bold;
        display: inline-block;
        padding: 4pt 10pt !important;
        background-color: white;
        border-radius: 12pt;
        margin-bottom: 8pt;
      }
      
      .pdf-footer {
        margin-top: 0.5in;
        padding-top: 0.25in;
        border-top: 1px solid #ddd;
        page-break-before: avoid;
      }
      
      /* Override flex layout for PDF */
      .pdf-container .flex {
        display: block !important;
      }
      
      .pdf-container .lg\\:flex-row {
        display: flex !important;
        flex-direction: row !important;
      }
      
      /* Ensure recharts are properly sized and visible */
      .pdf-container .recharts-wrapper {
        overflow: visible !important;
        page-break-inside: avoid !important;
      }
      
      .pdf-container .recharts-surface {
        overflow: visible !important;
      }
      
      /* Force page breaks between dimension cards */
      .pdf-container .pdf-dimension-card {
        page-break-after: always !important;
      }
      
      /* Ensure consistent text size */
      .pdf-container p, 
      .pdf-container li {
        font-size: 12pt !important;
        line-height: 1.5 !important;
      }
      
      /* Fix for radar charts in PDF */
      .pdf-container .recharts-polar-grid-concentric-polygon,
      .pdf-container .recharts-polar-grid-concentric-circle,
      .pdf-container .recharts-polar-grid-angle {
        stroke-width: 1px !important;
      }
      
      .pdf-container .recharts-polar-angle-axis-tick-value {
        font-size: 11pt !important;
        font-weight: bold !important;
      }

      /* Ensure image/svg aspect ratios and sizes are maintained */
      .pdf-container img,
      .pdf-container svg {
        max-width: 100% !important;
        height: auto !important;
      }
      
      @page {
        size: letter portrait;
        margin: 0;
      }
    `;
    tempContainer.appendChild(style);
    
    // Force browser to calculate layout with PDF styles
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Determine the height of the content
    const contentHeight = tempContainer.scrollHeight;
    const pageHeight = 10 * 96; // 10 inches (11 - 1 margin) at 96 DPI
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
      
      // Calculate aspect ratio to maintain proportions
      const canvasRatio = canvas.height / canvas.width;
      const pageWidth = 8.5; // inches
      const pageHeight = Math.min(11, pageWidth * canvasRatio);
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
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
