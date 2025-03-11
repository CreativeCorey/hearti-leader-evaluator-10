
import html2canvas from 'html2canvas';
import { showSuccessToast, showErrorToast } from '@/utils/notifications';

/**
 * Generates an image from a DOM element and returns the data URL
 */
export const generateImageFromElement = async (element: HTMLElement | null): Promise<string | null> => {
  if (!element) return null;
  
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Failed to generate image:', error);
    return null;
  }
};

/**
 * Downloads an image of the results card
 */
export const downloadResultsImage = async (cardRef: React.RefObject<HTMLDivElement>): Promise<void> => {
  if (!cardRef.current) return;
  
  try {
    const imageUrl = await generateImageFromElement(cardRef.current);
    if (!imageUrl) throw new Error('Failed to generate image');
    
    const link = document.createElement('a');
    link.download = `HEARTI-Leader-Results-${new Date().toISOString().split('T')[0]}.png`;
    link.href = imageUrl;
    link.click();
    
    showSuccessToast("Image downloaded", "Your results have been saved as an image");
  } catch (error) {
    console.error('Failed to download image:', error);
    showErrorToast("Download failed", "Please try again later");
  }
};

/**
 * Handles copying the shareable link to clipboard
 */
export const copyLinkToClipboard = async (link: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(link);
    showSuccessToast("Link copied", "The link has been copied to your clipboard");
    return true;
  } catch (error) {
    console.error('Failed to copy link:', error);
    showErrorToast("Failed to copy", "Please try again or copy manually");
    return false;
  }
};
