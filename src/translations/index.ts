
import { SupportedLanguage } from '@/contexts/language/LanguageContext';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';
import { ar } from './ar';
import { de } from './de';
import { zh } from './zh';
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

export const getTranslation = (language: SupportedLanguage, key: string, params?: Record<string, string>): string => {
  // Special handling for dimension names - these should always remain in English
  if (isDimensionNameKey(key)) {
    const dimensionName = key.split('.').pop();
    return dimensionName ? capitalizeFirstLetter(dimensionName) : key;
  }
  
  // Special handling for feedback keys that contain dimension names
  if (key.startsWith('dimensions.feedback.') || key.includes('.feedback.')) {
    const parts = key.split('.');
    const lastPart = parts[parts.length - 1];
    
    // Try to get the translation from the translations object
    let translation = getNestedTranslation(translations[language], parts);
    
    // If no translation found, fall back to English
    if (!translation) {
      translation = getNestedTranslation(translations.en, parts);
    }
    
    return processInterpolation(translation || key, params);
  }
  
  // Special handling for activity descriptions and titles which should remain in English
  if (key.startsWith('activities.') || key.includes('activity.')) {
    // Return the English translation for activities
    const englishTranslation = getNestedTranslation(translations.en, key.split('.'));
    return processInterpolation(englishTranslation || key, params);
  }
  
  // Split the key by dots to access nested properties
  const keys = key.split('.');
  let translation: any = translations[language];
  
  // Traverse the translation object based on the key path
  for (const k of keys) {
    if (translation && translation[k]) {
      translation = translation[k];
    } else {
      // If no translation found, return the key or the English translation
      const englishTranslation = getNestedTranslation(translations.en, keys);
      return processInterpolation(englishTranslation || key, params);
    }
  }
  
  // Process any string interpolation
  return processInterpolation(translation, params);
};

// Helper function to determine if a key is a dimension name
function isDimensionNameKey(key: string): boolean {
  const dimensionNames = ['humility', 'empathy', 'accountability', 'resiliency', 'transparency', 'inclusivity'];
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];
  
  // Check if the key is directly a dimension name or ends with a dimension name
  return (
    (key.startsWith('results.dimensions.') && dimensionNames.includes(lastPart)) ||
    (key.startsWith('dimensions.') && dimensionNames.includes(lastPart)) ||
    dimensionNames.includes(key)
  );
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper function to get nested translation
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

// Helper function to process string interpolation
const processInterpolation = (text: string, params?: Record<string, string>): string => {
  if (!params || typeof text !== 'string') {
    return text;
  }

  let result = text;
  Object.entries(params).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(placeholder, value);
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
