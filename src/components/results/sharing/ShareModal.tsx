
import React, { useState, useRef } from 'react';
import { HEARTIAssessment } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import ShareResultsCard from './ShareResultsCard';
import SocialShareButton from './SocialShareButton';
import html2canvas from 'html2canvas';
import { 
  Linkedin, Twitter, Instagram, Mail, Share, Download, Copy, 
  MessageCircle, Check
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
      const shareText = `Check out my HEARTI:Leader assessment results! Overall score: ${assessment.overallScore}/5`;
      
      // Platform-specific share logic
      switch (platform) {
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableLink)}`, '_blank');
          break;
          
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareableLink)}`, '_blank');
          break;
          
        case 'email':
          window.location.href = `mailto:?subject=My HEARTI:Leader Results&body=${encodeURIComponent(shareText + '\n\n' + shareableLink)}`;
          break;
          
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareableLink)}`, '_blank');
          break;
          
        default:
          // For platforms that don't have direct sharing APIs
          // First download the image, then show instructions
          const link = document.createElement('a');
          link.download = `HEARTI-Leader-Results-${new Date().toISOString().split('T')[0]}.png`;
          link.href = imageUrl;
          link.click();
          
          toast({
            title: `Share to ${platform}`,
            description: "Image downloaded. You can now upload it manually to your platform of choice.",
            duration: 5000,
          });
      }
      
    } catch (error) {
      console.error(`Failed to share to ${platform}:`, error);
      showErrorToast("Sharing failed", `Could not share to ${platform}. Please try again.`);
    }
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
                icon={<Mail size={18} />} 
                label="Email" 
                onClick={() => shareToSocial('email')}
                className="col-span-2"
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
