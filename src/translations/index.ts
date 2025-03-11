
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

export const getTranslation = (language: SupportedLanguage, key: string): string => {
  // Split the key by dots to access nested properties
  const keys = key.split('.');
  let translation: any = translations[language];
  
  // Traverse the translation object based on the key path
  for (const k of keys) {
    if (translation && translation[k]) {
      translation = translation[k];
    } else {
      // If no translation found, return the key or the English translation
      return translations.en[keys[0]]?.[keys[1]] || key;
    }
  }
  
  return translation;
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
