
import React, { useState, useRef } from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import ShareResultsCard from './ShareResultsCard';
import SocialShareButton from './SocialShareButton';
import html2canvas from 'html2canvas';
import { 
  Linkedin, Twitter, Instagram, Mail, Share, Download, Copy, 
  MessageCircle, Check, Slack, BrandBluesky
} from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/utils/notifications';

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
  const { toast } = useToast();
  
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
          
          toast({
            title: "Share to Bluesky",
            description: "Image downloaded. Copy your caption and upload the image to Bluesky.",
            duration: 5000,
          });
          break;
          
        case 'slack':
          // Slack doesn't have a direct web share API, download image and provide instructions
          const slackLink = document.createElement('a');
          slackLink.download = `HEARTI-Leader-Results-${new Date().toISOString().split('T')[0]}.png`;
          slackLink.href = imageUrl;
          slackLink.click();
          
          toast({
            title: "Share to Slack",
            description: "Image downloaded. Upload to Slack and paste your caption.",
            duration: 5000,
          });
          break;
          
        case 'teams':
          // Microsoft Teams doesn't have a direct web share API
          const teamsLink = document.createElement('a');
          teamsLink.download = `HEARTI-Leader-Results-${new Date().toISOString().split('T')[0]}.png`;
          teamsLink.href = imageUrl;
          teamsLink.click();
          
          toast({
            title: "Share to Microsoft Teams",
            description: "Image downloaded. Upload to Teams and paste your caption.",
            duration: 5000,
          });
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
          
          toast({
            title: `Share to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
            description: "Image downloaded and caption copied to clipboard. You can now upload it manually.",
            duration: 5000,
          });
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
            <div className="mb-4" ref={cardRef}>
              <ShareResultsCard assessment={assessment} />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="caption">Caption</Label>
              <div className="flex gap-2 mt-1">
                <Input 
                  id="caption"
                  value={captionText} 
                  onChange={(e) => setCaptionText(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetCaptionToDefault}
                  className="whitespace-nowrap"
                >
                  Reset
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This caption will be used when sharing to social media platforms.
              </p>
            </div>
            
            <div className="flex flex-col gap-2 mb-4">
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={downloadImage}
                disabled={isDownloading}
              >
                <Download size={18} className="mr-2" />
                {isDownloading ? "Downloading..." : "Download Image"}
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            <h4 className="font-medium mb-2">Share to:</h4>
            <div className="grid grid-cols-2 gap-2">
              <SocialShareButton 
                icon={<Linkedin size={18} />} 
                label="LinkedIn" 
                onClick={() => shareToSocial('linkedin')}
              />
              
              <SocialShareButton 
                icon={<Twitter size={18} />} 
                label="Twitter/X" 
                onClick={() => shareToSocial('twitter')}
              />
              
              <SocialShareButton 
                icon={<Instagram size={18} />} 
                label="Instagram" 
                onClick={() => shareToSocial('instagram')}
              />
              
              <SocialShareButton 
                icon={<MessageCircle size={18} />} 
                label="WhatsApp" 
                onClick={() => shareToSocial('whatsapp')}
              />
              
              <SocialShareButton 
                icon={<BrandBluesky size={18} />} 
                label="Bluesky" 
                onClick={() => shareToSocial('bluesky')}
              />
              
              <SocialShareButton 
                icon={<Slack size={18} />} 
                label="Slack" 
                onClick={() => shareToSocial('slack')}
              />
              
              <SocialShareButton 
                icon={<Mail size={18} />} 
                label="Email" 
                onClick={() => shareToSocial('email')}
              />
              
              <SocialShareButton 
                icon={<MessageCircle size={18} />} 
                label="Teams" 
                onClick={() => shareToSocial('teams')}
              />
              
              <SocialShareButton 
                icon={<MessageCircle size={18} />} 
                label="Threads" 
                onClick={() => shareToSocial('threads')}
                className="col-span-2 md:col-span-1"
              />
              
              <SocialShareButton 
                icon={<MessageCircle size={18} />} 
                label="Fanbase" 
                onClick={() => shareToSocial('fanbase')}
                className="col-span-2 md:col-span-1"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="link">
            <div className="mb-4 border p-2 rounded-md bg-gray-50 flex items-center justify-between">
              <p className="text-sm truncate mr-2">{shareableLink}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyLink}
                className="flex items-center gap-1 shrink-0"
              >
                {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {isCopied ? "Copied" : "Copy"}
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Share this link with others to allow them to see your results directly.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
