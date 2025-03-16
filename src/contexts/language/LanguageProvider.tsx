import React, { useState, useEffect } from 'react';
import { LanguageContext, SupportedLanguage } from './LanguageContext';
import { getTranslation, isRTLLanguage } from '@/translations';

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Try to get the saved language from localStorage or default to 'en'
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return (savedLanguage as SupportedLanguage) || 'en';
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', currentLanguage);
    
    // Update document direction for RTL languages (Arabic and Hebrew)
    if (isRTLLanguage(currentLanguage)) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = currentLanguage;
      
      // Add RTL specific classname to body for additional styling
      document.body.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = currentLanguage;
      
      // Remove RTL classname if it exists
      document.body.classList.remove('rtl');
    }
    
    console.log(`Language changed to: ${currentLanguage}, RTL: ${isRTLLanguage(currentLanguage)}`);
  }, [currentLanguage]);

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
  };

  // Translation function with support for string interpolation and special cases
  const t = (key: string, params?: Record<string, string>) => {
    // Always keep HEARTI dimension names in English
    if (isDimensionName(key)) {
      return capitalizeFirstLetter(getDimensionName(key));
    }
    
    // Get translation with appropriate fallback
    return getTranslation(currentLanguage, key, params);
  };

  // Helper function to determine if a key is a dimension name
  const isDimensionName = (key: string): boolean => {
    const dimensionNames = ['humility', 'empathy', 'accountability', 'resiliency', 'transparency', 'inclusivity'];
    
    // Check if the key directly matches a dimension name
    if (dimensionNames.includes(key.toLowerCase())) {
      return true;
    }
    
    // Check if the key ends with a dimension name (e.g., 'results.dimensions.humility')
    const lastSegment = key.split('.').pop()?.toLowerCase();
    return lastSegment ? dimensionNames.includes(lastSegment) : false;
  };
  
  // Helper function to extract the dimension name from a key
  const getDimensionName = (key: string): string => {
    const dimensionNames = ['humility', 'empathy', 'accountability', 'resiliency', 'transparency', 'inclusivity'];
    const lastSegment = key.split('.').pop()?.toLowerCase();
    
    if (lastSegment && dimensionNames.includes(lastSegment)) {
      return lastSegment;
    }
    
    // If the key itself is a dimension name
    for (const dimension of dimensionNames) {
      if (key.toLowerCase() === dimension) {
        return dimension;
      }
    }
    
    return key;
  };
  
  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
