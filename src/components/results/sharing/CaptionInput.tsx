
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CaptionInputProps {
  captionText: string;
  onCaptionChange: (text: string) => void;
  onResetCaption: () => void;
}

const CaptionInput: React.FC<CaptionInputProps> = ({ 
  captionText, 
  onCaptionChange, 
  onResetCaption 
}) => {
  return (
    <div className="mb-4">
      <Label htmlFor="caption">Caption</Label>
      <div className="flex gap-2 mt-1">
        <Input 
          id="caption"
          value={captionText} 
          onChange={(e) => onCaptionChange(e.target.value)}
          className="flex-1"
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onResetCaption}
          className="whitespace-nowrap"
        >
          Reset
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        This caption will be used when sharing to social media platforms.
      </p>
    </div>
  );
};

export default CaptionInput;
