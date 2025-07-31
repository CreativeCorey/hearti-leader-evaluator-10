// Secure storage utilities to replace direct localStorage usage

// List of sensitive keys that should not be stored in localStorage
const SENSITIVE_KEYS = [
  'auth_token',
  'session_token',
  'api_key',
  'access_token',
  'refresh_token',
  'password',
  'credit_card',
  'ssn',
  'private_key'
];

// Check if a key contains sensitive information
const isSensitiveKey = (key: string): boolean => {
  const lowerKey = key.toLowerCase();
  return SENSITIVE_KEYS.some(sensitiveKey => lowerKey.includes(sensitiveKey));
};

// Secure localStorage wrapper
export const secureStorage = {
  // Set item with security checks
  setItem: (key: string, value: string): boolean => {
    try {
      if (isSensitiveKey(key)) {
        console.warn(`Attempted to store sensitive data in localStorage: ${key}`);
        return false;
      }
      
      // Limit storage size per item (1MB)
      if (value.length > 1024 * 1024) {
        console.warn(`Data too large for localStorage: ${key}`);
        return false;
      }
      
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Failed to store data:', error);
      return false;
    }
  },

  // Get item safely
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      return null;
    }
  },

  // Remove item
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove data:', error);
      return false;
    }
  },

  // Clear all non-sensitive items
  clearNonSensitive: (): void => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (!isSensitiveKey(key)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },

  // Get storage size
  getStorageSize: (): number => {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error('Failed to calculate storage size:', error);
      return 0;
    }
  }
};

// Utility to sanitize data before storage
export const sanitizeForStorage = (data: any): string => {
  try {
    // Remove potentially dangerous properties
    const sanitized = JSON.parse(JSON.stringify(data, (key, value) => {
      // Filter out function properties and sensitive keys
      if (typeof value === 'function' || isSensitiveKey(key)) {
        return undefined;
      }
      
      // Limit string length
      if (typeof value === 'string' && value.length > 10000) {
        return value.substring(0, 10000) + '...[truncated]';
      }
      
      return value;
    }));
    
    return JSON.stringify(sanitized);
  } catch (error) {
    console.error('Failed to sanitize data for storage:', error);
    return '{}';
  }
};

// Session storage wrapper (slightly more secure than localStorage)
export const secureSessionStorage = {
  setItem: (key: string, value: string): boolean => {
    try {
      if (isSensitiveKey(key)) {
        console.warn(`Attempted to store sensitive data in sessionStorage: ${key}`);
        return false;
      }
      
      sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Failed to store session data:', error);
      return false;
    }
  },

  getItem: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.error('Failed to retrieve session data:', error);
      return null;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove session data:', error);
      return false;
    }
  }
};