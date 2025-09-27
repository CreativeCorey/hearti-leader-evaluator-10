/**
 * Security utility functions for the application
 */

/**
 * Content Security Policy headers for enhanced security
 */
export const getCSPHeaders = () => {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://api.stripe.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ')
  };
};

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: { max: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  PASSWORD_RESET: { max: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  ASSESSMENT_CREATION: { max: 10, windowMs: 60 * 60 * 1000 }, // 10 assessments per hour
  MESSAGE_SENDING: { max: 50, windowMs: 60 * 60 * 1000 } // 50 messages per hour
};

/**
 * Validates input data against common security threats
 */
export const validateSecureInput = (input: string, maxLength: number = 1000): boolean => {
  // Check length
  if (input.length > maxLength) return false;
  
  // Check for common injection patterns
  const dangerousPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * Sanitizes user input for safe display
 */
export const sanitizeUserInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};