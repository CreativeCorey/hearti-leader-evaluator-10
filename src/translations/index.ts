
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
  // Direct translation cases for frequently used sections with issues
  const directTranslations: Record<string, Record<string, Record<string, string>>> = {
    zh: {
      results: {
        'results.development.addToHabitTracker': '添加到习惯跟踪器',
        'results.habits.yourHabits': '您的习惯',
        'results.report.description': '帮助您发展领导能力的见解和建议',
        'results.comparison.averageLabel': '平均值',
      },
      dimensions: {
        'dimensions.feedback.humility.excellent': '您在谦逊方面表现出色。您愿意寻求反馈，承认错误，认可他人贡献。',
        'dimensions.feedback.humility.good': '您在谦逊方面表现良好。继续培养您的自我意识和对他人的开放性。',
        'dimensions.feedback.humility.average': '您对谦逊的重要性有一定认识。尝试更多地寻求反馈，降低防御性。',
        'dimensions.feedback.humility.needsImprovement': '您需要更加关注谦逊。尝试承认自己的局限性，向他人学习。',
        'dimensions.feedback.empathy.excellent': '您在同理心方面表现出色。您能理解他人的感受，消除分歧。',
        'dimensions.feedback.empathy.good': '您在同理心方面表现良好。继续练习积极倾听，理解他人观点。',
        'dimensions.feedback.empathy.average': '您对同理心有一定理解。尝试更加关注他人的情感需求。',
        'dimensions.feedback.empathy.needsImprovement': '您需要更加关注同理心。尝试花时间真正理解他人的感受和观点。',
        'dimensions.feedback.accountability.excellent': '您在责任感方面表现出色。您始终对自己的行动负责并履行承诺。',
        'dimensions.feedback.accountability.good': '您在责任感方面表现良好。继续完善您设定目标和跟踪进度的能力。',
        'dimensions.feedback.accountability.average': '您对责任感有一定理解。尝试更加明确您的角色和期望。',
        'dimensions.feedback.accountability.needsImprovement': '您需要更加关注责任感。尝试设定明确的目标，并坚持完成承诺。',
        'dimensions.feedback.resiliency.excellent': '您在韧性方面表现出色。您能有效管理压力，从挫折中恢复。',
        'dimensions.feedback.resiliency.good': '您在韧性方面表现良好。继续培养您的适应能力和自我照顾习惯。',
        'dimensions.feedback.resiliency.average': '您对韧性有一定理解。尝试培养更积极的心态，面对挑战。',
        'dimensions.feedback.resiliency.needsImprovement': '您需要更加关注韧性。尝试培养自我照顾习惯，寻求支持系统。',
        'dimensions.feedback.transparency.excellent': '您在透明度方面表现出色。您以清晰、开放的方式沟通，建立信任。',
        'dimensions.feedback.transparency.good': '您在透明度方面表现良好。继续培养坦诚对话和信息共享的能力。',
        'dimensions.feedback.transparency.average': '您对透明度有一定理解。尝试更加主动地分享信息和理由。',
        'dimensions.feedback.transparency.needsImprovement': '您需要更加关注透明度。尝试更开放地沟通，即使在困难情况下也是如此。',
        'dimensions.feedback.inclusivity.excellent': '您在包容性方面表现出色。您重视多样性，创造包容的环境。',
        'dimensions.feedback.inclusivity.good': '您在包容性方面表现良好。继续培养您包容不同背景和观点的能力。',
        'dimensions.feedback.inclusivity.average': '您对包容性有一定理解。尝试更加关注代表性不足的声音。',
        'dimensions.feedback.inclusivity.needsImprovement': '您需要更加关注包容性。尝试了解多样性的价值，挑战自己的假设。'
      }
    }
  };

  // Check for direct translations first
  if (directTranslations[language] && 
      directTranslations[language][key.split('.')[0]] && 
      directTranslations[language][key.split('.')[0]][key]) {
    return processInterpolation(directTranslations[language][key.split('.')[0]][key], params);
  }

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
  
  // Handle development, habits, and report text specifically
  if (key.startsWith('results.development.') || 
      key.startsWith('results.habits.') ||
      key.startsWith('results.report.')) {
    const translation = getNestedTranslation(translations[language], key.split('.'));
    
    // If no translation found in current language, try English
    if (!translation && language !== 'en') {
      const englishTranslation = getNestedTranslation(translations.en, key.split('.'));
      if (englishTranslation) {
        return processInterpolation(englishTranslation, params);
      }
    }
    
    // If we have a translation, return it
    if (translation) {
      return processInterpolation(translation, params);
    }
    
    // If all else fails and we have a fallback, use it
    if (params?.fallback) {
      return params.fallback;
    }
    
    // Last resort - return a user-friendly message instead of the key
    return language === 'en' ? (params?.fallback || "Translation not found") : getTranslation('en', key, params);
  }
  
  // Handle dimension feedback specifically
  if (key.startsWith('dimensions.feedback.')) {
    const feedbackTranslation = getNestedTranslation(translations[language], key.split('.'));
    
    // If no translation found in current language, try English
    if (!feedbackTranslation && language !== 'en') {
      const englishTranslation = getNestedTranslation(translations.en, key.split('.'));
      if (englishTranslation) {
        return processInterpolation(englishTranslation, params);
      }
    }
    
    // If we have a translation, return it
    if (feedbackTranslation) {
      return processInterpolation(feedbackTranslation, params);
    }
    
    // If all else fails and we have a fallback, use it
    if (params?.fallback) {
      return params.fallback;
    }
    
    // Last resort - return a user-friendly message instead of the key
    return language === 'en' ? (params?.fallback || "Feedback not available") : getTranslation('en', key, params);
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
