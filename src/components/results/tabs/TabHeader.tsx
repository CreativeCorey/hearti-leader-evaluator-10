
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface TabHeaderProps {
  title: string;
  description?: string;
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
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      
      {showExportButton && onExportPDF && (
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onExportPDF}
          disabled={exportingPdf}
        >
          {exportingPdf ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          Export PDF
        </Button>
      )}
    </div>
  );
};

export default TabHeader;
