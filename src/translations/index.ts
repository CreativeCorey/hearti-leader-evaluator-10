
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

export const getTranslation = (language: SupportedLanguage, key: string, params?: Record<string, string>): string => {
  // Special handling for comparison labels that were showing as untranslated
  if (key.includes('results.comparison.')) {
    const comparisonKey = handleComparisonKeys(language, key);
    if (comparisonKey) return comparisonKey;
  }
  
  // Special handling for dimension names - these should always remain in English
  if (shouldKeepInEnglish(key)) {
    const dimensionName = extractDimensionName(key);
    return dimensionName || key;
  }
  
  // Split the key by dots to access nested properties
  const keys = key.split('.');
  let translation: any = translations[language];
  
  // Traverse the translation object based on the key path
  for (const k of keys) {
    if (translation && translation[k]) {
      translation = translation[k];
    } else {
      // If no translation found, return the English translation
      const englishTranslation = getNestedTranslation(translations.en, keys);
      return processInterpolation(englishTranslation || key, params);
    }
  }
  
  // Process any string interpolation
  return processInterpolation(translation, params);
};

// Special handling for comparison keys that were showing untranslated
function handleComparisonKeys(language: SupportedLanguage, key: string): string | null {
  const comparisonTerms: Record<string, Record<string, string>> = {
    zh: {
      'results.comparison.averageLabel': '平均',
      'results.comparison.yourHEARTI': '你的 HEARTI',
      'results.comparison.score': '分数',
      'results.comparison.strength': '优势',
      'results.comparison.vulnerability': '需发展',
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

// Helper to detect if a key should remain in English
function shouldKeepInEnglish(key: string): boolean {
  // Check if the key contains any of the terms that should remain in English
  return keepInEnglishTerms.some(term => 
    key === term || 
    key.endsWith(`.${term}`) || 
    key.includes(`${term}.`)
  );
}

// Extract the dimension name from a key
function extractDimensionName(key: string): string | null {
  const dimensionNames = ['Humility', 'Empathy', 'Accountability', 'Resiliency', 'Transparency', 'Inclusivity'];
  const lowerDimensionNames = dimensionNames.map(d => d.toLowerCase());
  
  // Direct match for dimension name
  for (const dimension of [...dimensionNames, ...lowerDimensionNames]) {
    if (key === dimension) {
      return capitalizeFirstLetter(dimension);
    }
  }
  
  // Check if the key ends with a dimension name
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];
  
  for (const dimension of lowerDimensionNames) {
    if (lastPart.toLowerCase() === dimension) {
      return capitalizeFirstLetter(dimension);
    }
  }
  
  return null;
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
