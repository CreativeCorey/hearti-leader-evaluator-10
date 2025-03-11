
import { showSuccessToast, showErrorToast } from '@/utils/notifications';
import { generateImageFromElement } from './shareUtils';

interface ShareOptions {
  element: HTMLElement | null;
  shareableLink: string;
  captionText: string;
}

/**
 * Handles sharing to LinkedIn
 */
export const shareToLinkedIn = (shareableLink: string): void => {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableLink)}`;
  window.open(linkedInUrl, '_blank', 'width=600,height=600');
};

/**
 * Handles sharing to Twitter/X
 */
export const shareToTwitter = (shareableLink: string, captionText: string): void => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(captionText)}&url=${encodeURIComponent(shareableLink)}`;
  window.open(twitterUrl, '_blank', 'width=600,height=600');
};

/**
 * Handles sharing to WhatsApp
 */
export const shareToWhatsApp = (shareableLink: string, captionText: string): void => {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(captionText + '\n\n' + shareableLink)}`;
  window.open(whatsappUrl, '_blank', 'width=600,height=600');
};

/**
 * Handles sharing to Email
 */
export const shareToEmail = (shareableLink: string, captionText: string): void => {
  const emailSubject = "My HEARTI:Leader Results";
  const emailBody = `${captionText}\n\n${shareableLink}`;
  window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
};

/**
 * Handles sharing to platforms that require downloading the image
 */
export const shareWithImageDownload = async (
  platform: string,
  element: HTMLElement | null,
  captionText: string
): Promise<void> => {
  try {
    const imageUrl = await generateImageFromElement(element);
    if (!imageUrl) throw new Error('Failed to generate image');
    
    const link = document.createElement('a');
    link.download = `HEARTI-Leader-Results-${new Date().toISOString().split('T')[0]}.png`;
    link.href = imageUrl;
    link.click();
    
    // Copy caption to clipboard
    await navigator.clipboard.writeText(captionText);
    
    showSuccessToast(
      `Share to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`, 
      "Image downloaded and caption copied to clipboard for sharing."
    );
  } catch (error) {
    console.error(`Failed to share to ${platform}:`, error);
    showErrorToast("Sharing failed", `Could not share to ${platform}. Please try again.`);
  }
};

/**
 * Main share handler function that routes to platform-specific handlers
 */
export const shareToSocial = async (platform: string, options: ShareOptions): Promise<void> => {
  const { element, shareableLink, captionText } = options;
  
  try {
    switch (platform) {
      case 'linkedin':
        shareToLinkedIn(shareableLink);
        break;
        
      case 'twitter':
        shareToTwitter(shareableLink, captionText);
        break;
        
      case 'whatsapp':
        shareToWhatsApp(shareableLink, captionText);
        break;
        
      case 'email':
        shareToEmail(shareableLink, captionText);
        break;
        
      case 'bluesky':
      case 'slack':
      case 'teams':
      case 'instagram':
      case 'threads':
      case 'fanbase':
      default:
        await shareWithImageDownload(platform, element, captionText);
        break;
    }
  } catch (error) {
    console.error(`Failed to share to ${platform}:`, error);
    showErrorToast("Sharing failed", `Could not share to ${platform}. Please try again.`);
  }
};
