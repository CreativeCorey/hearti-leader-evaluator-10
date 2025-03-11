
import React, { useState, useRef } from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Share, Copy } from 'lucide-react';
import { downloadResultsImage, copyLinkToClipboard } from './shareUtils';
import { shareToSocial } from './platformShareHandlers';
import ImageShareTab from './ImageShareTab';
import LinkShareTab from './LinkShareTab';

interface ShareModalProps {
  assessment: HEARTIAssessment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ assessment, open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState<'image' | 'link'>('image');
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const shareableLink = window.location.href;
  
  // Get top strength dimension
  const sortedDimensions = Object.entries(assessment.dimensionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dimension]) => dimension as HEARTIDimension);
  
  const topStrength = sortedDimensions[0];
  const capitalizedTopStrength = topStrength.charAt(0).toUpperCase() + topStrength.slice(1);
  
  // Default caption text
  const defaultCaptionText = `The top strength in my HEARTI:Leader Quotient is ${capitalizedTopStrength}. Get yours at takehearti.com today #HEARTILeader`;
  
  // State for custom caption
  const [captionText, setCaptionText] = useState(defaultCaptionText);
  
  const handleCopyLink = async () => {
    const success = await copyLinkToClipboard(shareableLink);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };
  
  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      await downloadResultsImage(cardRef);
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleShareToSocial = async (platform: string) => {
    await shareToSocial(platform, {
      element: cardRef.current,
      shareableLink,
      captionText
    });
  };
  
  const resetCaptionToDefault = () => {
    setCaptionText(defaultCaptionText);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Results</DialogTitle>
          <DialogDescription>
            Share your HEARTI:Leader assessment results with others.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'image' | 'link')} className="mt-2">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="image" className="flex items-center gap-1">
              <Share size={16} />
              Share Image
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-1">
              <Copy size={16} />
              Copy Link
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="image">
            <ImageShareTab
              cardRef={cardRef}
              assessment={assessment}
              captionText={captionText}
              isDownloading={isDownloading}
              onCaptionChange={setCaptionText}
              onResetCaption={resetCaptionToDefault}
              onDownloadImage={handleDownloadImage}
              onShareToSocial={handleShareToSocial}
            />
          </TabsContent>
          
          <TabsContent value="link">
            <LinkShareTab
              shareableLink={shareableLink}
              isCopied={isCopied}
              onCopyLink={handleCopyLink}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
