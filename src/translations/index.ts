
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

// Common direct translations for the comparison section across languages
const comparisonTranslations = {
  zh: {
    'results.comparison.yourHEARTI': '您的 HEARTI',
    'results.comparison.score': '分数',
    'results.comparison.strength': '优势',
    'results.comparison.vulnerability': '弱点',
    'results.comparison.competent': '胜任',
    'results.comparison.selectOption': '选择比较选项以查看数据',
    'results.comparison.useControls': '使用上方的比较控制查看您的 HEARTI 数据',
    'results.comparison.averageLabel': '平均值',
    'results.comparison.noneLabel': '无比较'
  },
  fr: {
    'results.comparison.yourHEARTI': 'Votre HEARTI',
    'results.comparison.score': 'Score',
    'results.comparison.strength': 'Force',
    'results.comparison.vulnerability': 'Vulnérabilité',
    'results.comparison.competent': 'Compétent',
    'results.comparison.selectOption': 'Sélectionnez une option de comparaison pour voir les données',
    'results.comparison.useControls': 'Utilisez les contrôles de comparaison pour visualiser vos données HEARTI',
    'results.comparison.averageLabel': 'Moyenne',
    'results.comparison.noneLabel': 'Aucune comparaison'
  },
  es: {
    'results.comparison.yourHEARTI': 'Tu HEARTI',
    'results.comparison.score': 'Puntuación',
    'results.comparison.strength': 'Fortaleza',
    'results.comparison.vulnerability': 'Vulnerabilidad',
    'results.comparison.competent': 'Competente',
    'results.comparison.selectOption': 'Selecciona una opción de comparación para ver datos',
    'results.comparison.useControls': 'Usa los controles de comparación para visualizar tus datos HEARTI',
    'results.comparison.averageLabel': 'Promedio',
    'results.comparison.noneLabel': 'Sin comparación'
  },
  it: {
    'results.comparison.yourHEARTI': 'Il tuo HEARTI',
    'results.comparison.score': 'Punteggio',
    'results.comparison.strength': 'Forza',
    'results.comparison.vulnerability': 'Vulnerabilità',
    'results.comparison.competent': 'Competente',
    'results.comparison.selectOption': 'Seleziona un\'opzione di confronto per visualizzare i dati',
    'results.comparison.useControls': 'Usa i controlli di confronto per visualizzare i tuoi dati HEARTI',
    'results.comparison.averageLabel': 'Media',
    'results.comparison.noneLabel': 'Nessun confronto'
  },
  ja: {
    'results.comparison.yourHEARTI': 'あなたのHEARTI',
    'results.comparison.score': 'スコア',
    'results.comparison.strength': '強み',
    'results.comparison.vulnerability': '弱み',
    'results.comparison.competent': '有能',
    'results.comparison.selectOption': 'データを表示するには比較オプションを選択してください',
    'results.comparison.useControls': 'HEARTIデータを可視化するには上記の比較コントロールを使用してください',
    'results.comparison.averageLabel': '平均',
    'results.comparison.noneLabel': '比較なし'
  },
  ar: {
    'results.comparison.yourHEARTI': 'HEARTI الخاص بك',
    'results.comparison.score': 'النتيجة',
    'results.comparison.strength': 'القوة',
    'results.comparison.vulnerability': 'الضعف',
    'results.comparison.competent': 'كفء',
    'results.comparison.selectOption': 'حدد خيار المقارنة لعرض البيانات',
    'results.comparison.useControls': 'استخدم عناصر التحكم في المقارنة أعلاه لتصور بيانات HEARTI الخاصة بك',
    'results.comparison.averageLabel': 'المتوسط',
    'results.comparison.noneLabel': 'بدون مقارنة'
  },
};

// Common direct translations for development section
const developmentTranslations = {
  zh: {
    'results.development.addToHabitTracker': '添加到习惯跟踪器',
    'results.development.chooseActivitiesFor': '为以下选择活动'
  },
  fr: {
    'results.development.addToHabitTracker': 'Ajouter au suivi d\'habitudes',
    'results.development.chooseActivitiesFor': 'Choisir des activités pour'
  },
  es: {
    'results.development.addToHabitTracker': 'Añadir al seguimiento de hábitos',
    'results.development.chooseActivitiesFor': 'Elegir actividades para'
  },
  it: {
    'results.development.addToHabitTracker': 'Aggiungi al tracker di abitudini',
    'results.development.chooseActivitiesFor': 'Scegli attività per'
  },
  ja: {
    'results.development.addToHabitTracker': '習慣トラッカーに追加',
    'results.development.chooseActivitiesFor': '活動を選択する'
  },
  ar: {
    'results.development.addToHabitTracker': 'إضافة إلى متتبع العادات',
    'results.development.chooseActivitiesFor': 'اختر الأنشطة لـ'
  },
};

// Common direct translations for habits section
const habitsTranslations = {
  zh: {
    'results.habits.yourHabits': '您的习惯',
    'results.habits.addHabit': '添加习惯'
  },
  fr: {
    'results.habits.yourHabits': 'Vos Habitudes',
    'results.habits.addHabit': 'Ajouter une habitude'
  },
  es: {
    'results.habits.yourHabits': 'Tus Hábitos',
    'results.habits.addHabit': 'Añadir Hábito'
  },
  it: {
    'results.habits.yourHabits': 'Le tue Abitudini',
    'results.habits.addHabit': 'Aggiungi Abitudine'
  },
  ja: {
    'results.habits.yourHabits': 'あなたの習慣',
    'results.habits.addHabit': '習慣を追加'
  },
  ar: {
    'results.habits.yourHabits': 'عاداتك',
    'results.habits.addHabit': 'إضافة عادة'
  },
};

// Direct translations for report and dimensions sections
const reportsAndDimensionsTranslations = {
  zh: {
    'results.report.description': '帮助您发展领导能力的见解和建议',
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
  },
  fr: {
    'results.report.description': 'Insights et recommandations pour vous aider à développer vos compétences en leadership',
    'dimensions.feedback.humility.excellent': 'Vous excellez en humilité. Vous recherchez activement les commentaires, admettez les erreurs et reconnaissez les contributions des autres.',
    'dimensions.feedback.humility.good': 'Vous avez un bon niveau d\'humilité. Continuez à développer votre conscience de soi et votre ouverture aux autres.',
    'dimensions.feedback.humility.average': 'Vous avez une certaine compréhension de l\'importance de l\'humilité. Essayez de rechercher davantage de feedback et réduisez votre défensivité.',
    'dimensions.feedback.humility.needsImprovement': 'Vous devez vous concentrer davantage sur l\'humilité. Essayez de reconnaître vos limites et d\'apprendre des autres.',
    'dimensions.feedback.empathy.excellent': 'Vous excellez en empathie. Vous comprenez bien les sentiments des autres et vous résolvez les différends.',
    'dimensions.feedback.empathy.good': 'Vous avez un bon niveau d\'empathie. Continuez à pratiquer l\'écoute active et à comprendre les perspectives des autres.',
    'dimensions.feedback.empathy.average': 'Vous avez une certaine compréhension de l\'empathie. Essayez de vous concentrer davantage sur les besoins émotionnels des autres.',
    'dimensions.feedback.empathy.needsImprovement': 'Vous devez vous concentrer davantage sur l\'empathie. Essayez de prendre le temps de vraiment comprendre les sentiments et les perspectives des autres.',
    'dimensions.feedback.accountability.excellent': 'Vous excellez en responsabilité. Vous prenez toujours la responsabilité de vos actions et vous tenez vos engagements.',
    'dimensions.feedback.accountability.good': 'Vous avez un bon niveau de responsabilité. Continuez à affiner votre capacité à fixer des objectifs et à suivre les progrès.',
    'dimensions.feedback.accountability.average': 'Vous avez une certaine compréhension de la responsabilité. Essayez d\'être plus clair sur vos rôles et vos attentes.',
    'dimensions.feedback.accountability.needsImprovement': 'Vous devez vous concentrer davantage sur la responsabilité. Essayez de fixer des objectifs clairs et de respecter vos engagements.',
    'dimensions.feedback.resiliency.excellent': 'Vous excellez en résilience. Vous gérez efficacement le stress et vous vous remettez bien des revers.',
    'dimensions.feedback.resiliency.good': 'Vous avez un bon niveau de résilience. Continuez à développer votre adaptabilité et vos habitudes d\'autosoins.',
    'dimensions.feedback.resiliency.average': 'Vous avez une certaine compréhension de la résilience. Essayez de cultiver une attitude plus positive face aux défis.',
    'dimensions.feedback.resiliency.needsImprovement': 'Vous devez vous concentrer davantage sur la résilience. Essayez de développer des habitudes d\'autosoins et cherchez des systèmes de soutien.',
    'dimensions.feedback.transparency.excellent': 'Vous excellez en transparence. Vous communiquez de manière claire et ouverte, ce qui crée de la confiance.',
    'dimensions.feedback.transparency.good': 'Vous avez un bon niveau de transparence. Continuez à développer votre dialogue honnête et le partage d\'informations.',
    'dimensions.feedback.transparency.average': 'Vous avez une certaine compréhension de la transparence. Essayez de partager plus proactivement les informations et les raisons.',
    'dimensions.feedback.transparency.needsImprovement': 'Vous devez vous concentrer davantage sur la transparence. Essayez de communiquer plus ouvertement, même dans des situations difficiles.',
    'dimensions.feedback.inclusivity.excellent': 'Vous excellez en inclusivité. Vous valorisez la diversité et créez des environnements inclusifs.',
    'dimensions.feedback.inclusivity.good': 'Vous avez un bon niveau d\'inclusivité. Continuez à développer votre capacité à inclure des personnes de différents milieux et perspectives.',
    'dimensions.feedback.inclusivity.average': 'Vous avez une certaine compréhension de l\'inclusivité. Essayez de vous concentrer davantage sur les voix sous-représentées.',
    'dimensions.feedback.inclusivity.needsImprovement': 'Vous devez vous concentrer davantage sur l\'inclusivité. Essayez de comprendre la valeur de la diversité et de remettre en question vos hypothèses.'
  },
  es: {
    'results.report.description': 'Insights y recomendaciones para ayudarte a desarrollar tus habilidades de liderazgo',
    'dimensions.feedback.humility.excellent': 'Sobresales en humildad. Buscas activamente retroalimentación, admites errores y reconoces las contribuciones de otros.',
    'dimensions.feedback.humility.good': 'Tienes un buen nivel de humildad. Continúa desarrollando tu autoconciencia y apertura hacia los demás.',
    'dimensions.feedback.humility.average': 'Tienes cierta comprensión de la importancia de la humildad. Intenta buscar más retroalimentación y reduce tu actitud defensiva.',
    'dimensions.feedback.humility.needsImprovement': 'Necesitas enfocarte más en la humildad. Intenta reconocer tus limitaciones y aprender de los demás.',
    'dimensions.feedback.empathy.excellent': 'Sobresales en empatía. Entiendes bien los sentimientos de los demás y resuelves diferencias.',
    'dimensions.feedback.empathy.good': 'Tienes un buen nivel de empatía. Continúa practicando la escucha activa y comprendiendo las perspectivas de los demás.',
    'dimensions.feedback.empathy.average': 'Tienes cierta comprensión de la empatía. Intenta enfocarte más en las necesidades emocionales de los demás.',
    'dimensions.feedback.empathy.needsImprovement': 'Necesitas enfocarte más en la empatía. Intenta tomarte el tiempo para realmente entender los sentimientos y perspectivas de los demás.',
    'dimensions.feedback.accountability.excellent': 'Sobresales en responsabilidad. Siempre asumes la responsabilidad de tus acciones y cumples tus compromisos.',
    'dimensions.feedback.accountability.good': 'Tienes un buen nivel de responsabilidad. Continúa refinando tu capacidad para establecer metas y seguir el progreso.',
    'dimensions.feedback.accountability.average': 'Tienes cierta comprensión de la responsabilidad. Intenta ser más claro sobre tus roles y expectativas.',
    'dimensions.feedback.accountability.needsImprovement': 'Necesitas enfocarte más en la responsabilidad. Intenta establecer metas claras y mantener tus compromisos.',
    'dimensions.feedback.resiliency.excellent': 'Sobresales en resiliencia. Manejas eficazmente el estrés y te recuperas bien de los reveses.',
    'dimensions.feedback.resiliency.good': 'Tienes un buen nivel de resiliencia. Continúa desarrollando tu adaptabilidad y hábitos de autocuidado.',
    'dimensions.feedback.resiliency.average': 'Tienes cierta comprensión de la resiliencia. Intenta cultivar una actitud más positiva frente a los desafíos.',
    'dimensions.feedback.resiliency.needsImprovement': 'Necesitas enfocarte más en la resiliencia. Intenta desarrollar hábitos de autocuidado y busca sistemas de apoyo.',
    'dimensions.feedback.transparency.excellent': 'Sobresales en transparencia. Comunicas de manera clara y abierta, lo que genera confianza.',
    'dimensions.feedback.transparency.good': 'Tienes un buen nivel de transparencia. Continúa desarrollando tu diálogo honesto y compartiendo información.',
    'dimensions.feedback.transparency.average': 'Tienes cierta comprensión de la transparencia. Intenta compartir más proactivamente información y razones.',
    'dimensions.feedback.transparency.needsImprovement': 'Necesitas enfocarte más en la transparencia. Intenta comunicarte más abiertamente, incluso en situaciones difíciles.',
    'dimensions.feedback.inclusivity.excellent': 'Sobresales en inclusividad. Valoras la diversidad y creas entornos inclusivos.',
    'dimensions.feedback.inclusivity.good': 'Tienes un buen nivel de inclusividad. Continúa desarrollando tu capacidad para incluir a personas de diferentes orígenes y perspectivas.',
    'dimensions.feedback.inclusivity.average': 'Tienes cierta comprensión de la inclusividad. Intenta enfocarte más en las voces subrepresentadas.',
    'dimensions.feedback.inclusivity.needsImprovement': 'Necesitas enfocarte más en la inclusividad. Intenta entender el valor de la diversidad y cuestiona tus suposiciones.'
  }
};

export const getTranslation = (language: SupportedLanguage, key: string, params?: Record<string, any>): string => {
  // Handle comparison section labels
  if (key.startsWith('results.comparison.')) {
    if (comparisonTranslations[language] && comparisonTranslations[language][key]) {
      return processInterpolation(comparisonTranslations[language][key], params);
    }
  }
  
  // Handle development section labels
  if (key.startsWith('results.development.')) {
    if (developmentTranslations[language] && developmentTranslations[language][key]) {
      return processInterpolation(developmentTranslations[language][key], params);
    }
  }
  
  // Handle habits section labels
  if (key.startsWith('results.habits.')) {
    if (habitsTranslations[language] && habitsTranslations[language][key]) {
      return processInterpolation(habitsTranslations[language][key], params);
    }
  }
  
  // Handle report and dimensions section
  if (key.startsWith('results.report.') || key.startsWith('dimensions.feedback.')) {
    if (reportsAndDimensionsTranslations[language] && reportsAndDimensionsTranslations[language][key]) {
      return processInterpolation(reportsAndDimensionsTranslations[language][key], params);
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
      // If no translation found in current language, try English
      const englishTranslation = getNestedTranslation(translations.en, keys);
      if (englishTranslation) {
        return processInterpolation(englishTranslation, params);
      }
      
      // If we have a fallback, use it
      if (params?.fallback) {
        return processInterpolation(params.fallback, params);
      }
      
      // Last resort - return key
      return key;
    }
  }
  
  // Handle dimension names that should always be in English
  if (typeof translation === 'string' && keepInEnglishTerms.includes(translation)) {
    return translation;
  }
  
  // Process any string interpolation
  return typeof translation === 'string' ? processInterpolation(translation, params) : key;
};

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
