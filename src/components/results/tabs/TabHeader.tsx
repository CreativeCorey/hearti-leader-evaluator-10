
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TabHeaderProps {
  title: string;
  description: string;
  showExportButton?: boolean;
  onExportPDF?: () => Promise<void>;
  exportingPdf?: boolean;
}

const TabHeader: React.FC<TabHeaderProps> = ({
  title,
  description,
  showExportButton = false,
  onExportPDF,
  exportingPdf = false
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-2 border-b">
      <div className="flex-1">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground max-w-2xl">{description}</p>
      </div>
      
      {showExportButton && onExportPDF && (
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          onClick={onExportPDF}
          disabled={exportingPdf}
          className="pdf-export-button whitespace-nowrap"
        >
          <Download size={isMobile ? 14 : 16} className="mr-1" />
          {exportingPdf ? "Exporting..." : "Export as PDF"}
        </Button>
      )}
    </div>
  );
};

export default TabHeader;
