
import { format } from 'date-fns';
import { HEARTIAssessment } from '@/types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

class ResultsExportPDF {
  static async exportPDF(
    reportRef: React.RefObject<HTMLDivElement>,
    assessment: HEARTIAssessment,
    toast: any
  ) {
    if (!reportRef.current) return;
    
    const userName = assessment.demographics?.name || "Leader";
    const dateStr = format(new Date(assessment.date), 'yyyy-MM-dd');
    const fileName = `HEARTI-Leader-Report-${userName}-${dateStr}.pdf`;
    
    toast({
      title: "Generating PDF",
      description: "Please wait while we generate your report...",
    });
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = 210;  // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 10;      // margin in mm
    const contentWidth = pageWidth - (margin * 2);
    
    const reportSections = [];
    
    const addSection = (element: Element | null) => {
      if (!element) return;
      reportSections.push(element);
    };
    
    const introSection = reportRef.current.querySelector('.prose:first-child');
    const spectraSection = reportRef.current.querySelector('.my-8');
    const dimensionCards = reportRef.current.querySelectorAll('.mb-8.overflow-hidden');
    const conclusionCard = reportRef.current.querySelector('.mb-8:not(.overflow-hidden)');
    
    addSection(introSection);
    addSection(spectraSection);
    
    dimensionCards.forEach(card => {
      addSection(card);
    });
    
    addSection(conclusionCard);
    
    let currentPage = 1;
    
    for (let i = 0; i < reportSections.length; i++) {
      const section = reportSections[i];
      
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.top = '0';
      tempDiv.style.left = '0';
      tempDiv.style.width = `${reportRef.current.offsetWidth}px`;
      tempDiv.style.background = 'white';
      tempDiv.style.overflow = 'hidden';
      
      const sectionClone = section.cloneNode(true);
      tempDiv.appendChild(sectionClone);
      document.body.appendChild(tempDiv);
      
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: 'white'
      });
      
      document.body.removeChild(tempDiv);
      
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (i > 0) {
        pdf.addPage();
        currentPage++;
      }
      
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        margin,
        margin,
        imgWidth,
        imgHeight
      );
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Page ${currentPage}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );
    }
    
    pdf.save(fileName);
    
    toast({
      title: "PDF Generated",
      description: "Your HEARTI Leader report has been downloaded.",
    });
  }
}

export default ResultsExportPDF;
