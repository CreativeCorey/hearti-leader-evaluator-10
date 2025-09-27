import React from 'react';
import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    // Allow common formatting elements
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'pre', 'code', 'span', 'div'
    ],
    ALLOWED_ATTR: ['class', 'style'],
    // Remove any script tags and event handlers
    FORBID_TAGS: ['script', 'object', 'embed', 'base', 'link'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
  });
};

/**
 * Component for safely rendering sanitized HTML
 */
interface SafeHtmlProps {
  html: string;
  className?: string;
  component?: keyof JSX.IntrinsicElements;
}

export const SafeHtml: React.FC<SafeHtmlProps> = ({ 
  html, 
  className = '', 
  component: Component = 'div' 
}) => {
  const sanitizedHtml = sanitizeHtml(html);
  
  return (
    <Component 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};