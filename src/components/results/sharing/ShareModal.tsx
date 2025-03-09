import React, { useState, useRef } from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Share, Copy } from 'lucide-react';
import html2canvas from 'html2canvas';
import { showSuccessToast, showErrorToast } from '@/utils/notifications';
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
    try {
      await navigator.clipboard.writeText(shareableLink);
      setIsCopied(true);
      showSuccessToast("Link copied", "The link has been copied to your clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      showErrorToast("Failed to copy", "Please try again or copy manually");
    }
  };
  
  const downloadImage = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const imageUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `HEARTI-Leader-Results-${new Date().toISOString().split('T')[0]}.png`;
      link.href = imageUrl;
      link.click();
      
      showSuccessToast("Image downloaded", "Your results have been saved as an image");
    } catch (error) {
      console.error('Failed to download image:', error);
      showErrorToast("Download failed", "Please try again later");
    } finally {
      setIsDownloading(false);
    }
  };
  
  const shareToSocial = async (platform: string) => {
    try {
      if (!cardRef.current) return;
      
      // Generate image from the card
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const imageUrl = canvas.toDataURL('image/png');
      
      // Platform-specific share logic
      switch (platform) {
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableLink)}&summary=${encodeURIComponent(captionText)}`, '_blank');
          break;
          
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(captionText)}&url=${encodeURIComponent(shareableLink)}`, '_blank');
          break;
          
        case 'bluesky':
          // Bluesky doesn't have a direct web share API, so download the image
          const blueSkyLink = document.createElement('a');
          blueSkyLink.download = `HEARTI-Leader-Results-${new Date().toISOString().split('T')[0]}.png`;
          blueSkyLink.href = imageUrl;
          blueSkyLink.click();
          
          showSuccessToast("Share to Bluesky", "Image downloaded. Copy your caption and upload the image to Bluesky.");
          break;
          
        case 'slack':
          // Slack doesn't have a direct web share API, download image and provide instructions
          const slackLink = document.createElement('a');
          slackLink.download = `HEARTI-Leader-Results-${new Date().toISOString().split('T')[0]}.png`;
          slackLink.href = imageUrl;
          slackLink.click();
          
          showSuccessToast("Share to Slack", "Image downloaded. Upload to Slack and paste your caption.");
          break;
          
        case 'teams':
          // Microsoft Teams doesn't have a direct web share API
          const teamsLink = document.createElement('a');
          teamsLink.download = `HEARTI-Leader-Results-${new Date().toISOString().split('T')[0]}.png`;
          teamsLink.href = imageUrl;
          teamsLink.click();
          
          showSuccessToast("Share to Microsoft Teams", "Image downloaded. Upload to Teams and paste your caption.");
          break;
          
        case 'email':
          window.location.href = `mailto:?subject=My HEARTI:Leader Results&body=${encodeURIComponent(captionText + '\n\n' + shareableLink)}`;
          break;
          
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(captionText + '\n\n' + shareableLink)}`, '_blank');
          break;
          
        case 'instagram':
        case 'threads':
        case 'fanbase':
        default:
          // For platforms that don't have direct sharing APIs
          const link = document.createElement('a');
          link.download = `HEARTI-Leader-Results-${new Date().toISOString().split('T')[0]}.png`;
          link.href = imageUrl;
          link.click();
          
          // After downloading, copy the caption to clipboard
          await navigator.clipboard.writeText(captionText);
          
          showSuccessToast("Share to " + platform.charAt(0).toUpperCase() + platform.slice(1), "Image downloaded and caption copied to clipboard. You can now upload it manually.");
          break;
      }
      
    } catch (error) {
      console.error(`Failed to share to ${platform}:`, error);
      showErrorToast("Sharing failed", `Could not share to ${platform}. Please try again.`);
    }
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
              onDownloadImage={downloadImage}
              onShareToSocial={shareToSocial}
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
