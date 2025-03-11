
import { showSuccessToast, showErrorToast } from '@/utils/notifications';
import { generateImageFromElement } from './shareUtils';

interface ShareOptions {
  element: HTMLElement | null;
  shareableLink: string;
  captionText: string;
}

/**
 * Handles sharing to LinkedIn
 * 
 * NOTE: LinkedIn doesn't allow direct pre-filling of image and text via URL parameters
 * So we download the image and copy the text to clipboard for the user to paste manually
 */
export const shareToLinkedIn = async (
  element: HTMLElement | null,
  shareableLink: string,
  captionText: string
): Promise<void> => {
  try {
    // Generate and download the image
    const imageUrl = await generateImageFromElement(element);
    if (!imageUrl) throw new Error('Failed to generate image');
    
    const link = document.createElement('a');
    link.download = `HEARTI-Leader-Results-${new Date().toISOString().split('T')[0]}.png`;
    link.href = imageUrl;
    link.click();
    
    // Copy caption to clipboard
    await navigator.clipboard.writeText(captionText);
    
    // Open LinkedIn sharing dialog
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableLink)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
    
    showSuccessToast(
      "Share to LinkedIn", 
      "Image downloaded and caption copied to clipboard. Paste the caption in LinkedIn."
    );
  } catch (error) {
    console.error('Failed to share to LinkedIn:', error);
    showErrorToast("LinkedIn sharing failed", "Please try again later");
  }
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
        await shareToLinkedIn(element, shareableLink, captionText);
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
