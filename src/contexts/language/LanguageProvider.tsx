
import React, { useState, useEffect } from 'react';
import { LanguageContext, SupportedLanguage } from './LanguageContext';
import { getTranslation, isRTLLanguage } from '@/translations';

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Try to get the saved language from localStorage or default to 'en'
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return (savedLanguage as SupportedLanguage) || 'en';
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', currentLanguage);
    
    // Update document direction for RTL languages (Arabic and Hebrew)
    if (isRTLLanguage(currentLanguage)) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = currentLanguage;
      
      // Add RTL specific classname to body for additional styling
      document.body.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = currentLanguage;
      
      // Remove RTL classname if it exists
      document.body.classList.remove('rtl');
    }
    
    console.log(`Language changed to: ${currentLanguage}, RTL: ${isRTLLanguage(currentLanguage)}`);
  }, [currentLanguage]);

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
  };

  // Translation function
  const t = (key: string, params?: Record<string, any>) => {
    // Special cases for the summary tab sections
    if (key.startsWith('results.summary.')) {
      // Handle summary tab translations with fallbacks
      const summaryTranslations = {
        'results.summary.overallScore': {
          zh: '总体得分',
          fr: 'Score global',
          es: 'Puntuación general',
          it: 'Punteggio complessivo',
          ar: 'النتيجة الإجمالية',
          de: 'Gesamtpunktzahl',
          ja: '総合スコア',
          he: 'ציון כולל'
        },
        'results.summary.overallDescription': {
          zh: '您的HEARTI:Leader商数表明您在21世纪领导力所需技能方面的整体熟练程度。',
          fr: 'Votre Quotient HEARTI:Leader indique votre niveau global de compétences nécessaires pour le leadership du 21e siècle.',
          es: 'Tu Cociente HEARTI:Leader indica tu competencia general en las habilidades necesarias para el liderazgo del siglo XXI.',
          it: 'Il tuo Quoziente HEARTI:Leader indica la tua competenza complessiva nelle abilità necessarie per la leadership del XXI secolo.',
          ar: 'يشير معامل HEARTI:Leader الخاص بك إلى كفاءتك الشاملة في المهارات اللازمة للقيادة في القرن الحادي والعشرين.',
          de: 'Ihr HEARTI:Leader-Quotient zeigt Ihre allgemeine Kompetenz in den für die Führung im 21. Jahrhundert erforderlichen Fähigkeiten an.',
          ja: 'あなたのHEARTI:Leaderクオーシェントは、21世紀のリーダーシップに必要なスキルにおけるあなたの総合的な習熟度を示しています。',
          he: 'מנת ה-HEARTI:Leader שלך מצביעה על המיומנות הכללית שלך בכישורים הנדרשים למנהיגות במאה ה-21.'
        },
        'results.summary.topStrength': {
          zh: '最强优势',
          fr: 'Force principale',
          es: 'Fortaleza principal',
          it: 'Punto di forza principale',
          ar: 'نقطة القوة الرئيسية',
          de: 'Größte Stärke',
          ja: '最高の強み',
          he: 'חוזק עיקרי'
        },
        'results.summary.strengthDescription': {
          zh: '这是您得分最高的HEARTI维度。',
          fr: 'C\'est votre dimension HEARTI avec le score le plus élevé.',
          es: 'Esta es tu dimensión HEARTI con mayor puntuación.',
          it: 'Questa è la tua dimensione HEARTI con il punteggio più alto.',
          ar: 'هذا هو البعد HEARTI الخاص بك ذو الدرجة الأعلى.',
          de: 'Dies ist Ihre HEARTI-Dimension mit der höchsten Punktzahl.',
          ja: 'これはあなたの最高スコアのHEARTI次元です。',
          he: 'זהו ממד ה-HEARTI שלך עם הציון הגבוה ביותר.'
        },
        'results.summary.developmentArea': {
          zh: '发展领域',
          fr: 'Zone de développement',
          es: 'Área de desarrollo',
          it: 'Area di sviluppo',
          ar: 'منطقة التطوير',
          de: 'Entwicklungsbereich',
          ja: '開発領域',
          he: 'אזור פיתוח'
        },
        'results.summary.developmentDescription': {
          zh: '该维度具有最大的成长潜力。',
          fr: 'Cette dimension a le plus de potentiel de croissance.',
          es: 'Esta dimensión tiene el mayor potencial de crecimiento.',
          it: 'Questa dimensione ha il maggior potenziale di crescita.',
          ar: 'يمتلك هذا البعد أكبر إمكانات للنمو.',
          de: 'Diese Dimension hat das größte Wachstumspotenzial.',
          ja: 'この次元は最も成長の可能性があります。',
          he: 'לממד זה יש את הפוטנציאל הגדול ביותר לצמיחה.'
        }
      };
      
      if (summaryTranslations[key] && summaryTranslations[key][currentLanguage]) {
        return summaryTranslations[key][currentLanguage];
      } else if (params?.fallback) {
        return params.fallback;
      }
    }

    // Specific handling for report descriptions
    if (key === 'results.report.description') {
      const reportDescriptions = {
        zh: '帮助您发展领导能力的见解和建议',
        fr: 'Perspectives et recommandations pour vous aider à développer vos compétences en leadership',
        es: 'Insights y recomendaciones para ayudarte a desarrollar tus habilidades de liderazgo',
        it: 'Approfondimenti e raccomandazioni per aiutarti a sviluppare le tue capacità di leadership',
        ar: 'رؤى وتوصيات لمساعدتك على تطوير مهارات القيادة لديك',
        de: 'Erkenntnisse und Empfehlungen, die Ihnen helfen, Ihre Führungskompetenzen zu entwickeln',
        ja: 'リーダーシップスキルの開発を支援するための洞察と推奨事項',
        he: 'תובנות והמלצות לעזור לך לפתח את כישורי המנהיגות שלך'
      };
      
      return reportDescriptions[currentLanguage] || params?.fallback || "Insights and recommendations to help you develop your leadership skills";
    }
    
    // Common special case keys that need fallbacks
    const commonFallbacks = {
      'results.comparison.yourHEARTI': 'Your HEARTI',
      'results.comparison.score': 'Score',
      'results.comparison.strength': 'Strength',
      'results.comparison.vulnerability': 'Vulnerability',
      'results.comparison.competent': 'Competent',
      'results.comparison.averageLabel': 'Average',
      'results.comparison.noneLabel': 'None',
      'results.comparison.selectOption': 'Select a comparison option to view data',
      'results.comparison.useControls': 'Use the comparison controls above to visualize your HEARTI data',
      'results.development.addToHabitTracker': 'Add to Habit Tracker',
      'results.development.chooseActivitiesFor': 'Choose Activities For',
      'results.habits.yourHabits': 'Your Habits',
      'results.habits.addHabit': 'Add Habit',
      'results.habits.trackerTitle': 'Habit Tracker for HEARTI™ Leadership',
      'results.habits.trackerDescription': 'Track your progress as you build consistent habits for your chosen behaviors. Complete each behavior 30 times to turn it into a lasting habit.',
      'results.habits.recommendedFocus': 'We recommend focusing on behaviors from your development area:',
      'results.habits.addBehaviorsInstructions': 'Add behaviors to your habit tracker by using the "Add to Habit Tracker" button in the Development tab or on your saved activities.',
      'results.development.recommendationsTitle': 'Development Recommendations for HEARTI™ Leadership',
      'results.development.activitiesDescription': 'These activities are designed to help you develop your {{dimension}} leadership dimension. Select up to 3 activities to focus on.',
      'results.development.complete': 'Complete these activities regularly to build lasting leadership habits.',
      'results.lq.title': 'HEARTI:Leader Quotient Results'
    };
    
    // For dimension names and some special keys, always return in English
    if (shouldKeepInEnglish(key)) {
      return getTranslation('en', key, params);
    }
    
    // For the development tab activity text
    if (key === 'results.development.activitiesDescription') {
      const activityDescriptions = {
        zh: `这些活动旨在帮助您发展您的${params?.dimension || ''}领导维度。选择最多3个活动来关注。`,
        fr: `Ces activités sont conçues pour vous aider à développer votre dimension de leadership ${params?.dimension || ''}. Sélectionnez jusqu'à 3 activités sur lesquelles vous concentrer.`,
        es: `Estas actividades están diseñadas para ayudarte a desarrollar tu dimensión de liderazgo ${params?.dimension || ''}. Selecciona hasta 3 actividades para enfocarte.`,
        it: `Queste attività sono progettate per aiutarti a sviluppare la tua dimensione di leadership ${params?.dimension || ''}. Seleziona fino a 3 attività su cui concentrarti.`,
        ar: `تم تصميم هذه الأنشطة لمساعدتك على تطوير بُعد القيادة ${params?.dimension || ''} الخاص بك. حدد ما يصل إلى 3 أنشطة للتركيز عليها.`,
        de: `Diese Aktivitäten sollen Ihnen helfen, Ihre ${params?.dimension || ''}-Führungsdimension zu entwickeln. Wählen Sie bis zu 3 Aktivitäten, auf die Sie sich konzentrieren möchten.`,
        ja: `これらのアクティビティは、あなたの${params?.dimension || ''}リーダーシップ次元を開発するのに役立つように設計されています。重点を置く活動を最大3つ選択してください。`,
        he: `פעילויות אלה נועדו לעזור לך לפתח את ממד המנהיגות ${params?.dimension || ''} שלך. בחר עד 3 פעילויות להתמקד בהן.`
      };
      
      return activityDescriptions[currentLanguage] || params?.fallback || `These activities are designed to help you develop your ${params?.dimension || ''} leadership dimension. Select up to 3 activities to focus on.`;
    }
    
    // For specific keys with known fallbacks
    if (commonFallbacks[key] && currentLanguage !== 'en') {
      const translation = getTranslation(currentLanguage, key, {
        ...(params || {}),
        fallback: commonFallbacks[key]
      });
      
      // If translation is the key itself, use the fallback
      if (translation === key) {
        return commonFallbacks[key];
      }
      
      return translation;
    }
    
    // Special handling for feedback sections
    if (key.startsWith('dimensions.feedback.')) {
      const dimensionPart = key.split('.')[2]; // e.g., "humility"
      const levelPart = key.split('.')[3];     // e.g., "excellent"
      
      const genericFallbacks = {
        excellent: `You excel in ${dimensionPart}. You actively seek feedback, admit mistakes, and recognize others' contributions.`,
        good: `You have a good level of ${dimensionPart}. Continue developing your awareness and openness to others.`,
        average: `You have a moderate level of ${dimensionPart}. Try to be more intentional in this area.`,
        needsImprovement: `You need to focus more on ${dimensionPart}. Try to develop this dimension through practice and learning.`
      };
      
      const translation = getTranslation(currentLanguage, key, {
        ...(params || {}),
        fallback: genericFallbacks[levelPart] || `Feedback for ${dimensionPart}`
      });
      
      // If translation is the key itself, use the fallback
      if (translation === key) {
        return genericFallbacks[levelPart] || `Feedback for ${dimensionPart}`;
      }
      
      return translation;
    }
    
    // Handle activity categories and descriptions with proper fallbacks
    if (key.startsWith('activities.categories.') || key.startsWith('activities.descriptions.')) {
      const lastPart = key.split('.').pop();
      const fallbackText = key.startsWith('activities.categories.') 
        ? lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/([A-Z])/g, ' $1').trim()
        : params?.fallback || `Description for activity ${lastPart}`;
      
      const translation = getTranslation(currentLanguage, key, {
        ...(params || {}),
        fallback: fallbackText
      });
      
      // Check if we got back the key itself (translation failed)
      if (translation === key) {
        return fallbackText;
      }
      
      return translation;
    }

    // Handle "HEARTI:Leader Quotient" title in summary 
    if (key === 'results.lq.title') {
      const lqTitles = {
        zh: 'HEARTI:Leader 商数结果',
        fr: 'Résultats du Quotient HEARTI:Leader',
        es: 'Resultados del Cociente HEARTI:Leader',
        it: 'Risultati del Quoziente HEARTI:Leader',
        ar: 'نتائج معامل HEARTI:Leader',
        de: 'HEARTI:Leader Quotient-Ergebnisse',
        ja: 'HEARTI:Leaderクオーシェント結果',
        he: 'תוצאות מנת ה-HEARTI:Leader'
      };
      
      return lqTitles[currentLanguage] || params?.fallback || 'HEARTI:Leader Quotient Results';
    }
    
    // Regular translation with optional fallback
    const result = getTranslation(currentLanguage, key, params);
    
    // If the result is the key itself (which means translation failed), 
    // and we have a fallback, use the fallback
    if (result === key && params?.fallback) {
      return params.fallback;
    }
    
    return result;
  };
    
  // Helper function to determine if a key should remain in English
  const shouldKeepInEnglish = (key: string): boolean => {
    // Dimension names should always be in English
    const dimensionNames = ['humility', 'empathy', 'accountability', 'resiliency', 'transparency', 'inclusivity'];
    const heartiTerms = ['HEARTI', 'Spectra', 'Leader'];
    
    // Check direct dimension name or HEARTI* matches
    if (dimensionNames.includes(key.toLowerCase())) {
      return true;
    }
    
    // Check if key contains HEARTI, Spectra, or Leader
    for (const term of heartiTerms) {
      if (key.includes(term)) {
        return true;
      }
    }
    
    // Check dimension names at the end of keys
    const lastSegment = key.split('.').pop()?.toLowerCase();
    if (lastSegment && dimensionNames.includes(lastSegment)) {
      return true;
    }
    
    // Check if the key is for dimension feedback sections
    if (key.includes('dimensions.feedback.') && dimensionNames.some(dim => key.includes(`.${dim}.`))) {
      return true;
    }
    
    return false;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
