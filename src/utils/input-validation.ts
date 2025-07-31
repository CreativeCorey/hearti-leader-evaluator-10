// Input validation utilities for security

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validate password strength
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (password.length > 128) {
    errors.push("Password must be less than 128 characters");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitize text input
export const sanitizeText = (text: string, maxLength = 500): string => {
  return text
    .trim()
    .slice(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

// Validate UUID format
export const validateUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Validate assessment answers
export const validateAssessmentAnswers = (answers: any): boolean => {
  if (!Array.isArray(answers)) return false;
  
  // Check if all answers are valid numbers between 1-5
  return answers.every(answer => 
    typeof answer === 'number' && 
    answer >= 1 && 
    answer <= 5 && 
    Number.isInteger(answer)
  );
};

// Rate limiting check (simple implementation)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export const checkRateLimit = (identifier: string, maxRequests = 10, windowMs = 60000): boolean => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);
  
  if (!userLimit || now - userLimit.lastReset > windowMs) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
};

// Validate organization name
export const validateOrganizationName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 100 && /^[a-zA-Z0-9\s\-\.]+$/.test(name);
};

// Validate user name
export const validateUserName = (name: string): boolean => {
  return name.length >= 1 && name.length <= 50 && /^[a-zA-Z\s\-\.]+$/.test(name);
};