
import { HEARTIAssessment } from '@/types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const prepareElementForPDF = (element: HTMLElement): HTMLElement => {
  // Create a deep clone of the element to avoid modifying the original
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Add PDF-specific classes
  clone.classList.add('pdf-container');
  
  // Add header styling
  const headerElement = clone.querySelector('h3')?.parentElement;
  if (headerElement) {
    headerElement.classList.add('pdf-header');
    const title = headerElement.querySelector('h3');
    if (title) {
      title.classList.add('pdf-title');
    }
    const subtitle = headerElement.querySelector('p');
    if (subtitle) {
      subtitle.classList.add('pdf-subtitle');
    }
  }
  
  // Style all dimension cards
  const dimensionCards = clone.querySelectorAll('.card');
  dimensionCards.forEach(card => {
    const cardElement = card as HTMLElement;
    const dimension = cardElement.textContent?.toLowerCase().includes('humility') ? 'humility' :
                      cardElement.textContent?.toLowerCase().includes('empathy') ? 'empathy' :
                      cardElement.textContent?.toLowerCase().includes('accountability') ? 'accountability' :
                      cardElement.textContent?.toLowerCase().includes('resiliency') ? 'resiliency' :
                      cardElement.textContent?.toLowerCase().includes('transparency') ? 'transparency' :
                      'inclusivity';
    
    cardElement.classList.add('pdf-dimension-card');
    
    // Style card header
    const header = cardElement.querySelector('[class*="bg-"]');
    if (header) {
      const headerElement = header as HTMLElement;
      headerElement.classList.add('pdf-dimension-header', `${dimension}-header`);
    }
    
    // Style card content
    const content = cardElement.querySelector('.p-6');
    if (content) {
      content.classList.add('pdf-dimension-content');
    }
  });
  
  // Style chart containers
  const chartContainers = clone.querySelectorAll('.h-[300px]');
  chartContainers.forEach(container => {
    container.classList.add('pdf-chart-container');
  });
  
  // Add page breaks strategically
  const sections = clone.querySelectorAll('h3, h4');
  sections.forEach(section => {
    const sectionElement = section as HTMLElement;
    sectionElement.classList.add('pdf-section-title');
    sectionElement.parentElement?.classList.add('pdf-section');
  });
  
  // Add footer
  const footer = document.createElement('div');
  footer.classList.add('pdf-footer');
  footer.textContent = `HEARTI Leader Assessment Report - Generated on ${new Date().toLocaleDateString()}`;
  clone.appendChild(footer);
  
  return clone;
};

export const exportToPDF = async (element: HTMLElement, assessment: HEARTIAssessment) => {
  // Create a temporary container for the PDF preparation
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  document.body.appendChild(tempContainer);
  
  // Clone the element and prepare it for PDF
  const preparedElement = prepareElementForPDF(element);
  tempContainer.appendChild(preparedElement);
  
  // Apply styles for consistent rendering
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .pdf-container * {
      box-sizing: border-box !important;
      display: block !important;
      visibility: visible !important;
      transform: none !important;
      font-family: 'Arial', sans-serif !important;
    }
    
    .pdf-container {
      width: 8.5in !important;
      background-color: white !important;
      padding: 0.5in !important;
      color: #333 !important;
    }
  `;
  tempContainer.appendChild(styleElement);
  
  try {
    // Capture the prepared element
    const canvas = await html2canvas(preparedElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      width: 816, // 8.5 inches at 96 DPI
      height: 1056, // 11 inches at 96 DPI
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: [8.5, 11]
    });
    
    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);
    
    // Save the PDF
    pdf.save(`HEARTI_Assessment_${assessment.id}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    // Clean up
    document.body.removeChild(tempContainer);
  }
};
