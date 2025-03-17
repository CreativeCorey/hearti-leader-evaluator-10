
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

  // Translation function with special handling
  const t = (key: string, params?: Record<string, any>) => {
    // Special handling for dimensions, development, activities, and habits sections
    const specialSections = [
      'dimensions.feedback.',
      'results.development.',
      'results.habits.',
      'results.report.',
      'activities.categories.',
      'activities.descriptions.',
      'results.comparison.'
    ];
    
    // For dimension names and some special keys, always return in English
    if (shouldKeepInEnglish(key)) {
      return getTranslation('en', key, params);
    }
    
    // Handle special cases for various sections that need fallbacks
    for (const section of specialSections) {
      if (key.startsWith(section)) {
        // Get the translation
        const translation = getTranslation(currentLanguage, key, params);
        
        // If the translation is the same as the key (not found) and we're not in English, fall back to English
        if (translation === key && currentLanguage !== 'en') {
          const englishTranslation = getTranslation('en', key, params);
          return englishTranslation !== key ? englishTranslation : params?.fallback || key;
        }
        
        // If we have a fallback parameter and the translation is the key, use the fallback
        if (translation === key && params?.fallback) {
          return params.fallback;
        }
        
        return translation;
      }
    }
    
    // Regular translation
    const translation = getTranslation(currentLanguage, key, params);
    
    // If we have a fallback and the translation is the same as the key (not found), use the fallback
    if (translation === key && params?.fallback) {
      return params.fallback;
    }
    
    return translation;
  };
    
  // Helper function to determine if a key should remain in English
  const shouldKeepInEnglish = (key: string): boolean => {
    // Dimension names should always be in English
    const dimensionNames = ['humility', 'empathy', 'accountability', 'resiliency', 'transparency', 'inclusivity'];
    const heartiTerms = ['HEARTI', 'Spectra', 'Leader'];
    
    // Check direct dimension name or HEARTI* matches
    if (dimensionNames.includes(key.toLowerCase())) {
      return true;
    }
    
    // Check if key contains HEARTI, Spectra, or Leader
    for (const term of heartiTerms) {
      if (key.includes(term)) {
        return true;
      }
    }
    
    // Check dimension names at the end of keys
    const lastSegment = key.split('.').pop()?.toLowerCase();
    if (lastSegment && dimensionNames.includes(lastSegment)) {
      return true;
    }
    
    // Check if the key is for dimension feedback sections
    if (key.includes('dimensions.feedback.') && dimensionNames.some(dim => key.includes(`.${dim}.`))) {
      return true;
    }
    
    return false;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
