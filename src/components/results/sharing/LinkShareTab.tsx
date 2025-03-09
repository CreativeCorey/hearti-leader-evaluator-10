
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface LinkShareTabProps {
  shareableLink: string;
  isCopied: boolean;
  onCopyLink: () => void;
}

const LinkShareTab: React.FC<LinkShareTabProps> = ({ 
  shareableLink, 
  isCopied, 
  onCopyLink 
}) => {
  return (
    <>
      <div className="mb-4 border p-2 rounded-md bg-gray-50 flex items-center justify-between">
        <p className="text-sm truncate mr-2">{shareableLink}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCopyLink}
          className="flex items-center gap-1 shrink-0"
        >
          {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          {isCopied ? "Copied" : "Copy"}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Share this link with others to allow them to see your results directly.
      </p>
    </>
  );
};

export default LinkShareTab;
