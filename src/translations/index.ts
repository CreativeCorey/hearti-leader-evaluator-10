
import { SupportedLanguage } from '@/contexts/language/LanguageContext';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';
import { ar } from './ar';
import { de } from './de';
import { zh } from './zh';
import { ja } from './ja';

export const translations = {
  en,
  es,
  fr,
  it,
  ar,
  de,
  zh,
  ja
};

export const getTranslation = (language: SupportedLanguage, key: string, params?: Record<string, string>): string => {
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

export const languageNames = {
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  ar: "العربية",
  de: "Deutsch",
  zh: "中文",
  ja: "日本語"
};
