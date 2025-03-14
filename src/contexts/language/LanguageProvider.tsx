
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

  // Translation function with support for string interpolation
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslation(currentLanguage, key, params);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
