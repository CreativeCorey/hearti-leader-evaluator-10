
import { createContext, useContext } from 'react';

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'it' | 'ar' | 'de' | 'zh' | 'ja';

export interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);
