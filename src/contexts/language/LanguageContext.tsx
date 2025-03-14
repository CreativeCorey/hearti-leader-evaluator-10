
import { createContext, useContext } from 'react';

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'it' | 'ar' | 'de' | 'zh' | 'ja' | 'he';

export interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

// Default translations for fallback
const defaultTranslations = {
  common: {
    loading: "Loading...",
    error: "An error occurred",
  },
  tabs: {
    summary: "Summary",
    dimensions: "Dimensions",
    report: "Guide",
    buildHabits: "Build Habits",
    developSkills: "Develop Skills",
    dataViz: {
      desktop: "HEARTI Spectra",
      mobile: "Spectra"
    }
  },
  results: {
    report: {
      description: "Insights and recommendations to help you develop your leadership skills"
    },
    comparison: {
      yourHEARTI: "Your HEARTI",
      score: "Score",
      strength: "Strength",
      vulnerability: "Vulnerability",
      competent: "Competent",
      selectOption: "Select a comparison option to view data",
      useControls: "Use the comparison controls above to visualize your HEARTI data"
    },
    dimensions: {
      scoreLabel: "Score",
      levelsOf: "Levels of",
      developmentTips: "Development Tips",
      tipsForIncreasing: "Tips for increasing",
      leadership: "leadership"
    }
  }
};

// Create a default translator that uses the key if no translation is found
const defaultTranslator = (key: string) => {
  const keys = key.split('.');
  let value = defaultTranslations as any;
  
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      return key; // Return the key if no translation is found
    }
  }
  
  return typeof value === 'string' ? value : key;
};

export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  t: defaultTranslator,
});

export const useLanguage = () => useContext(LanguageContext);
