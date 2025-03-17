
import { SupportedLanguage } from '@/contexts/language/LanguageContext';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';
import { ar } from './ar';
import { de } from './de';
import { zh } from './zh/index';
import { ja } from './ja';
import { he } from './he';

export const translations = {
  en,
  es,
  fr,
  it,
  ar,
  de,
  zh,
  ja,
  he
};

// Terms that should always remain in English regardless of translation
const keepInEnglishTerms = [
  'HEARTI',
  'Humility',
  'Empathy',
  'Accountability',
  'Resiliency',
  'Transparency',
  'Inclusivity',
  'Spectra',
  'Leader',
  'humility',
  'empathy',
  'accountability',
  'resiliency',
  'transparency',
  'inclusivity'
];

export const getTranslation = (language: SupportedLanguage, key: string, params?: Record<string, any>): string => {
  // Special handling for comparison section labels that were showing as untranslated
  if (key.includes('results.comparison.')) {
    const comparisonKey = handleComparisonKeys(language, key);
    if (comparisonKey) return processInterpolation(comparisonKey, params);
  }
  
  // Handle activity categories and descriptions
  if (key.startsWith('activities.categories.') || key.startsWith('activities.descriptions.')) {
    const activityTranslation = getNestedTranslation(translations[language], key.split('.'));
    
    // If no translation found in current language, try English
    if (!activityTranslation && language !== 'en') {
      const englishTranslation = getNestedTranslation(translations.en, key.split('.'));
      if (englishTranslation) {
        return processInterpolation(englishTranslation, params);
      }
    }
    
    // If we have a translation, return it
    if (activityTranslation) {
      return processInterpolation(activityTranslation, params);
    }
    
    // If all else fails and we have a fallback, use it
    if (params?.fallback) {
      return params.fallback;
    }
    
    // Last resort - return the key
    return key;
  }
  
  // Handle development text
  if (key.startsWith('results.development.') || key.startsWith('results.habits.')) {
    const developmentTranslation = getNestedTranslation(translations[language], key.split('.'));
    
    // If no translation found in current language, try English
    if (!developmentTranslation && language !== 'en') {
      const englishTranslation = getNestedTranslation(translations.en, key.split('.'));
      if (englishTranslation) {
        return processInterpolation(englishTranslation, params);
      }
    }
    
    // If we have a translation, return it
    if (developmentTranslation) {
      return processInterpolation(developmentTranslation, params);
    }
    
    // If all else fails and we have a fallback, use it
    if (params?.fallback) {
      return params.fallback;
    }
  }
  
  // Split the key by dots to access nested properties
  const keys = key.split('.');
  let translation: any = translations[language];
  
  // Traverse the translation object based on the key path
  for (const k of keys) {
    if (translation && translation[k] !== undefined) {
      translation = translation[k];
    } else {
      // If no translation found, return the English translation or fallback
      const englishTranslation = getNestedTranslation(translations.en, keys);
      return processInterpolation(englishTranslation || params?.fallback || key, params);
    }
  }
  
  // Handle dimension names that should always be in English
  if (keepInEnglishTerms.includes(translation)) {
    return translation;
  }
  
  // Process any string interpolation
  return processInterpolation(translation, params);
};

// Special handling for comparison keys that were showing untranslated
function handleComparisonKeys(language: SupportedLanguage, key: string): string | null {
  const comparisonTerms: Record<string, Record<string, string>> = {
    zh: {
      'results.comparison.averageLabel': '平均值',
      'results.comparison.yourHEARTI': '您的 HEARTI',
      'results.comparison.score': '分数',
      'results.comparison.strength': '优势',
      'results.comparison.vulnerability': '弱点',
      'results.comparison.competent': '胜任',
      'results.comparison.selectOption': '选择比较选项以查看数据',
      'results.comparison.useControls': '使用上方的比较控制查看您的 HEARTI 数据'
    }
  };
  
  if (comparisonTerms[language] && comparisonTerms[language][key]) {
    return comparisonTerms[language][key];
  }
  
  return null;
}

// Utility function to get a nested translation
const getNestedTranslation = (obj: any, keys: string[]): string | undefined => {
  let result = obj;
  for (const key of keys) {
    if (result && result[key] !== undefined) {
      result = result[key];
    } else {
      return undefined;
    }
  }
  return typeof result === 'string' ? result : undefined;
};

// Process string interpolation in translations
const processInterpolation = (text: string, params?: Record<string, any>): string => {
  if (!params || typeof text !== 'string') {
    return text;
  }

  // Filter out special keys like 'fallback' that are not for interpolation
  const interpolationParams = Object.fromEntries(
    Object.entries(params).filter(([key]) => key !== 'fallback')
  );

  let result = text;
  Object.entries(interpolationParams).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(placeholder, String(value));
  });

  return result;
};

export const isRTLLanguage = (language: SupportedLanguage): boolean => {
  return ['ar', 'he'].includes(language);
};

export const languageNames = {
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  ar: "العربية",
  de: "Deutsch",
  zh: "中文",
  ja: "日本語",
  he: "עברית"
};
