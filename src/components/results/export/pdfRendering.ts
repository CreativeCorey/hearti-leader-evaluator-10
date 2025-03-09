
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Calculates the total number of pages needed for the PDF
 * @param contentHeight The height of the content in pixels
 * @param docPageHeight The height of a page in pixels
 * @returns The number of pages needed
 */
export const calculateTotalPages = (
  contentHeight: number,
  docPageHeight: number
): number => {
  return Math.ceil(contentHeight / docPageHeight);
};

/**
 * Renders a single page of the PDF
 * @param pdf The jsPDF document
 * @param tempContainer The temporary container with the content
 * @param pageIndex The index of the page to render
 * @param docPageHeight The height of a page in pixels
 * @param contentHeight The total height of the content in pixels
 * @returns Promise that resolves when the page is rendered
 */
export const renderPdfPage = async (
  pdf: jsPDF,
  tempContainer: HTMLElement,
  pageIndex: number,
  docPageHeight: number,
  contentHeight: number
): Promise<void> => {
  // If not the first page, add a new page
  if (pageIndex > 0) {
    pdf.addPage();
  }
  
  // Calculate the position to capture
  const yPosition = pageIndex * docPageHeight;
  
  const canvas = await html2canvas(tempContainer, {
    scale: 2, // Higher resolution
    useCORS: true,
    logging: false,
    width: 8.5 * 96, // 8.5 inches at 96 DPI
    height: Math.min(docPageHeight, contentHeight - yPosition), // Capture only what's needed
    y: yPosition, // Offset to capture the correct portion
    windowWidth: 8.5 * 96,
    windowHeight: contentHeight
  });
  
  // Add the image to the PDF
  const imgData = canvas.toDataURL('image/jpeg', 1.0);
  
  // Calculate aspect ratio to maintain proportions
  const canvasRatio = canvas.height / canvas.width;
  const pageWidth = 8.5; // inches
  const renderedPageHeight = Math.min(11, pageWidth * canvasRatio);
  
  pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, renderedPageHeight);
};
