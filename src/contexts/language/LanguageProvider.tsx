
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

  // Translation function with special handling for dimension names
  const t = (key: string, params?: Record<string, string>) => {
    // For dimension names and some special keys, always return in English
    if (shouldKeepInEnglish(key)) {
      return getTranslation('en', key, params);
    }
    
    // Handle special comparison keys that show translation keys instead of content
    if (key.startsWith('results.comparison.')) {
      const specificTranslation = handleComparisonSpecialCases(currentLanguage, key, params);
      if (specificTranslation) return specificTranslation;
    }
    
    // Fix for the development activity strings
    if (key.startsWith('activities.categories.') || key.startsWith('activities.descriptions.')) {
      const activityTranslation = getTranslation(currentLanguage, key, params);
      if (activityTranslation === key && currentLanguage !== 'en') {
        // Fall back to English for missing translations
        return getTranslation('en', key, params);
      }
      return activityTranslation;
    }
    
    // Regular translation
    return getTranslation(currentLanguage, key, params);
  };
  
  // Helper function to handle special cases in comparison section
  const handleComparisonSpecialCases = (language: SupportedLanguage, key: string, params?: Record<string, string>): string | null => {
    // Special case translations for comparison section
    const comparisonTerms: Record<string, Record<string, string>> = {
      zh: {
        'results.comparison.yourHEARTI': '您的 HEARTI',
        'results.comparison.score': '分数',
        'results.comparison.strength': '优势',
        'results.comparison.vulnerability': '弱点',
        'results.comparison.competent': '胜任',
        'results.comparison.averageLabel': '平均值',
        'results.comparison.selectOption': '选择比较选项以查看数据',
        'results.comparison.useControls': '使用上方的比较控制查看您的 HEARTI 数据'
      }
    };
    
    if (comparisonTerms[language] && comparisonTerms[language][key]) {
      return comparisonTerms[language][key];
    }
    
    return null;
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
