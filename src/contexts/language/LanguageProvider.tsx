
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

  // Translation function
  const t = (key: string, params?: Record<string, any>) => {
    // Common special case keys that need fallbacks
    const commonFallbacks = {
      'results.comparison.yourHEARTI': 'Your HEARTI',
      'results.comparison.score': 'Score',
      'results.comparison.strength': 'Strength',
      'results.comparison.vulnerability': 'Vulnerability',
      'results.comparison.competent': 'Competent',
      'results.comparison.averageLabel': 'Average',
      'results.comparison.noneLabel': 'None',
      'results.comparison.selectOption': 'Select a comparison option to view data',
      'results.comparison.useControls': 'Use the comparison controls above to visualize your HEARTI data',
      'results.development.addToHabitTracker': 'Add to Habit Tracker',
      'results.development.chooseActivitiesFor': 'Choose Activities For',
      'results.habits.yourHabits': 'Your Habits',
      'results.habits.addHabit': 'Add Habit',
      'results.report.description': 'Insights and recommendations to help you develop your leadership skills'
    };
    
    // For dimension names and some special keys, always return in English
    if (shouldKeepInEnglish(key)) {
      return getTranslation('en', key, params);
    }
    
    // For specific keys with known fallbacks
    if (commonFallbacks[key] && currentLanguage !== 'en') {
      const translation = getTranslation(currentLanguage, key, {
        ...(params || {}),
        fallback: commonFallbacks[key]
      });
      
      // If translation is the key itself, use the fallback
      if (translation === key) {
        return commonFallbacks[key];
      }
      
      return translation;
    }
    
    // Special handling for feedback sections
    if (key.startsWith('dimensions.feedback.')) {
      const dimensionPart = key.split('.')[2]; // e.g., "humility"
      const levelPart = key.split('.')[3];     // e.g., "excellent"
      
      const genericFallbacks = {
        excellent: `You excel in ${dimensionPart}. You actively seek feedback, admit mistakes, and recognize others' contributions.`,
        good: `You have a good level of ${dimensionPart}. Continue developing your awareness and openness to others.`,
        average: `You have some understanding of ${dimensionPart}. Try to be more intentional in this area.`,
        needsImprovement: `You need to focus more on ${dimensionPart}. Try to develop this dimension through practice and learning.`
      };
      
      const translation = getTranslation(currentLanguage, key, {
        ...(params || {}),
        fallback: genericFallbacks[levelPart] || `Feedback for ${dimensionPart}`
      });
      
      // If translation is the key itself, use the fallback
      if (translation === key) {
        return genericFallbacks[levelPart] || `Feedback for ${dimensionPart}`;
      }
      
      return translation;
    }
    
    // Handle activity categories and descriptions with proper fallbacks
    if (key.startsWith('activities.categories.') || key.startsWith('activities.descriptions.')) {
      const lastPart = key.split('.').pop();
      const fallbackText = key.startsWith('activities.categories.') 
        ? lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/([A-Z])/g, ' $1').trim()
        : params?.fallback || `Description for activity ${lastPart}`;
      
      const translation = getTranslation(currentLanguage, key, {
        ...(params || {}),
        fallback: fallbackText
      });
      
      return translation;
    }
    
    // Regular translation with optional fallback
    return getTranslation(currentLanguage, key, params);
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
