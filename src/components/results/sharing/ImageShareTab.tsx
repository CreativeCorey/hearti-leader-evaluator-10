
import React, { RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download } from 'lucide-react';
import ShareResultsCard from './ShareResultsCard';
import CaptionInput from './CaptionInput';
import SocialShareGrid from './SocialShareGrid';

interface ImageShareTabProps {
  cardRef: RefObject<HTMLDivElement>;
  assessment: any;
  captionText: string;
  isDownloading: boolean;
  onCaptionChange: (text: string) => void;
  onResetCaption: () => void;
  onDownloadImage: () => void;
  onShareToSocial: (platform: string) => void;
}

const ImageShareTab: React.FC<ImageShareTabProps> = ({
  cardRef,
  assessment,
  captionText,
  isDownloading,
  onCaptionChange,
  onResetCaption,
  onDownloadImage,
  onShareToSocial
}) => {
  return (
    <>
      <div className="mb-4" ref={cardRef}>
        <ShareResultsCard assessment={assessment} />
      </div>
      
      <CaptionInput 
        captionText={captionText}
        onCaptionChange={onCaptionChange}
        onResetCaption={onResetCaption}
      />
      
      <div className="flex flex-col gap-2 mb-4">
        <Button 
          variant="secondary" 
          className="w-full" 
          onClick={onDownloadImage}
          disabled={isDownloading}
        >
          <Download size={18} className="mr-2" />
          {isDownloading ? "Downloading..." : "Download Image"}
        </Button>
      </div>
      
      <Separator className="my-4" />
      
      <h4 className="font-medium mb-2">Share to:</h4>
      <SocialShareGrid onShareToSocial={onShareToSocial} />
    </>
  );
};

export default ImageShareTab;
