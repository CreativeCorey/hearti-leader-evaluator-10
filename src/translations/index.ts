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

export const getTranslation = (language: SupportedLanguage, key: string, params?: Record<string, string>): string => {
  // Special handling for dimension names - these should always remain in English
  if (isDimensionNameKey(key)) {
    const dimensionName = key.split('.').pop();
    return dimensionName ? capitalizeFirstLetter(dimensionName) : key;
  }
  
  // Activity descriptions should be translated
  if (isActivityKey(key)) {
    return getActivityTranslation(language, key, params);
  }
  
  // For report content we should translate it based on the language
  if (isReportKey(key)) {
    return getReportTranslation(language, key, params);
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

function isActivityKey(key: string): boolean {
  return key.includes('activities.') || key.includes('activity.') || key.startsWith('Choose Activities for:');
}

function isReportKey(key: string): boolean {
  return key.startsWith('report.') || key.includes('.report.');
}

function getActivityTranslation(language: SupportedLanguage, key: string, params?: Record<string, string>): string {
  // Check if this language has activity translations
  const activityTranslation = getNestedTranslation(translations[language], ['activities', key]);
  
  if (activityTranslation) {
    return processInterpolation(activityTranslation, params);
  }
  
  // Fallback to English for activities if not found
  const englishTranslation = getNestedTranslation(translations.en, ['activities', key]);
  return processInterpolation(englishTranslation || key, params);
}

function getReportTranslation(language: SupportedLanguage, key: string, params?: Record<string, string>): string {
  // Check if this language has report translations
  const reportTranslation = getNestedTranslation(translations[language], key.split('.'));
  
  if (reportTranslation) {
    return processInterpolation(reportTranslation, params);
  }
  
  // Fallback to English for report content if not found
  const englishTranslation = getNestedTranslation(translations.en, key.split('.'));
  return processInterpolation(englishTranslation || key, params);
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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
