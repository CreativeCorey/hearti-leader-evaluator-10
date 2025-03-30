
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

  // Define available languages
  const availableLanguages = ['en', 'es', 'fr', 'it', 'ar', 'de', 'zh', 'ja', 'he'];

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

  // i18n compatible interface
  const i18n = {
    language: currentLanguage,
    changeLanguage: setLanguage,
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
    
    // Report header translations
    if (key === 'report.header.title' || key === 'report.header.content') {
      const reportTranslations = {
        'report.header.title': {
          zh: '亲爱的21世纪领导者：',
          fr: 'Cher leader du 21e siècle :',
          es: 'Estimado líder del siglo XXI:',
          it: 'Caro leader del 21° secolo:',
          ar: 'عزيزي قائد القرن الحادي والعشرين:',
          de: 'Lieber Führungskraft des 21. Jahrhunderts:',
          ja: '21世紀のリーダーの皆様へ：',
          he: 'מנהיג המאה ה-21 היקר:'
        },
        'report.header.content': {
          zh: '您代表着未来，而不是过去。您可能被鼓励通过专注于为昨天的工业时代而非今天相关的能力来发展您的领导技能—更不用说明天了。\n\n我们理解，因为我们确定了明天工作场所所需的基本领导技能。我们研究了认知和积极心理学、组织设计和绩效管理方面的最新突破。我们还与数十个行业的现代领导者交谈。\n\n通过这个过程，我们了解到21世纪工作场所所需的核心能力是转型型领导者有意识地使用以鼓励更好结果的特质。它们是谦逊、同理心、责任感、韧性、透明度和包容性。运用这些能力的领导者将开辟创新、创造力和积极员工体验的道路。我们的研究还表明，雇用和发展具有这些特质的领导者的公司表现优于那些雇用和发展具有传统领导行为的领导者的公司。',
          fr: 'Vous représentez l\'avenir, pas le passé. Vous avez probablement été encouragé à développer vos compétences en leadership en vous concentrant sur des compétences conçues pour l\'ère industrielle d\'hier au lieu de celles pertinentes aujourd\'hui, sans parler de demain.\n\nNous comprenons parce que nous avons identifié les compétences de leadership essentielles requises pour le lieu de travail de demain. Nous avons étudié les percées récentes en psychologie cognitive et positive, en conception organisationnelle et en gestion de la performance. Nous avons également parlé à des leaders modernes de dizaines d\'industries.\n\nGrâce à ce processus, nous avons compris que les compétences fondamentales requises pour le lieu de travail du 21e siècle sont des traits que les leaders transformationnels utilisent intentionnellement pour encourager de meilleurs résultats. Ce sont l\'humilité, l\'empathie, la responsabilité, la résilience, la transparence et l\'inclusivité. Les leaders qui exploitent ces compétences forgeront des voies d\'innovation, de créativité et d\'expériences positives pour les employés. Nos recherches ont également révélé que les entreprises qui embauchent et développent des leaders avec ces traits performent mieux que celles qui embauchent et développent des leaders avec des comportements de leadership traditionnels.',
          es: 'Representas el futuro, no el pasado. Es probable que te hayan animado a desarrollar tus habilidades de liderazgo centrándote en competencias diseñadas para la Era Industrial de ayer en lugar de las relevantes hoy, por no hablar del mañana.\n\nLo entendemos porque identificamos las habilidades de liderazgo esenciales requeridas para el lugar de trabajo del mañana. Estudiamos avances recientes en psicología cognitiva y positiva, diseño organizacional y gestión del rendimiento. También hablamos con líderes modernos de docenas de industrias.\n\nA través de este proceso, entendimos que las competencias básicas requeridas para el lugar de trabajo del siglo XXI son rasgos que los líderes transformacionales usan intencionalmente para fomentar mejores resultados. Son Humildad, Empatía, Responsabilidad, Resiliencia, Transparencia e Inclusividad. Los líderes que aprovechan estas competencias forjarán caminos de innovación, creatividad y experiencias positivas de los empleados. Nuestra investigación también reveló que las empresas que contratan y desarrollan líderes con estos rasgos tienen un mejor desempeño que aquellas que contratan y desarrollan líderes con comportamientos de liderazgo tradicionales.',
          it: 'Rappresenti il futuro, non il passato. Probabilmente sei stato incoraggiato a sviluppare le tue capacità di leadership concentrandoti su competenze progettate per l\'Era Industriale di ieri invece di quelle rilevanti oggi, per non parlare di domani.\n\nLo capiamo perché abbiamo identificato le competenze di leadership essenziali richieste per il luogo di lavoro di domani. Abbiamo studiato recenti scoperte nella psicologia cognitiva e positiva, nel design organizzativo e nella gestione delle performance. Abbiamo anche parlato con leader moderni di decine di settori.\n\nAttraverso questo processo, abbiamo compreso che le competenze fondamentali richieste per il luogo di lavoro del XXI secolo sono tratti che i leader trasformazionali usano intenzionalmente per incoraggiare risultati migliori. Sono Umiltà, Empatia, Responsabilità, Resilienza, Trasparenza e Inclusività. I leader che sfruttano queste competenze forgeranno percorsi di innovazione, creatività ed esperienze positive dei dipendenti. La nostra ricerca ha anche rivelato che le aziende che assumono e sviluppano leader con questi tratti ottengono prestazioni migliori rispetto a quelle che assumono e sviluppano leader con comportamenti di leadership tradizionali.'
        }
      };
      
      if (reportTranslations[key] && reportTranslations[key][currentLanguage]) {
        return reportTranslations[key][currentLanguage];
      } else if (params?.fallback) {
        return params.fallback;
      }
    }
    
    // Translation for report dimension analysis title
    if (key === 'report.dimension.analysisTitle') {
      const dimensionAnalysisTitle = {
        zh: 'HEARTI 维度分析',
        fr: 'Analyse des dimensions HEARTI',
        es: 'Análisis de dimensiones HEARTI',
        it: 'Analisi delle dimensioni HEARTI',
        ar: 'تحليل أبعاد HEARTI',
        de: 'HEARTI Dimensionsanalyse',
        ja: 'HEARTI次元分析',
        he: 'ניתוח ממדי HEARTI'
      };
      
      return dimensionAnalysisTitle[currentLanguage] || params?.fallback || 'HEARTI Dimension Analysis';
    }
    
    // Translation for report dimension analysis description
    if (key === 'report.dimension.analysisDescription') {
      const dimensionAnalysisDescription = {
        zh: '以下每个维度显示您的分数、能力水平和持续发展的指导。',
        fr: 'Chaque dimension ci-dessous montre votre score, votre niveau de compétence et des conseils pour votre développement continu.',
        es: 'Cada dimensión a continuación muestra tu puntuación, nivel de competencia y orientación para tu desarrollo continuo.',
        it: 'Ogni dimensione qui sotto mostra il tuo punteggio, livello di competenza e guida per il tuo continuo sviluppo.',
        ar: 'يعرض كل بعد أدناه درجتك ومستوى كفاءتك وإرشادات لتطويرك المستمر.',
        de: 'Jede Dimension unten zeigt Ihre Punktzahl, Kompetenzniveau und Anleitung für Ihre kontinuierliche Entwicklung.',
        ja: '以下の各次元は、あなたのスコア、能力レベル、そして継続的な成長のためのガイダンスを示しています。',
        he: 'כל ממד למטה מציג את הציון שלך, רמת המיומנות, והדרכה להמשך הפיתוח שלך.'
      };
      
      return dimensionAnalysisDescription[currentLanguage] || params?.fallback || 'Each dimension below shows your score, competency level, and guidance for your continued development.';
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
      'results.lq.title': 'HEARTI:Leader Quotient Results',
      'results.comparison.progress': 'HEARTI Progress Over Time',
      'results.comparison.progressSubtitle': 'Select a point on the chart to view that assessment\'s data',
      'results.comparison.noProgressData': 'Complete more assessments to see your progress over time.'
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
      
      // Create feedback translations for all languages
      const feedbackTranslations = {
        fr: {
          humility: {
            excellent: "Vous excellez en humilité. Vous recherchez activement les retours, admettez les erreurs et reconnaissez les contributions des autres.",
            good: "Vous avez un bon niveau d'humilité. Continuez à développer votre conscience de soi et votre ouverture aux autres.",
            average: "Vous avez un niveau modéré d'humilité. Essayez d'être plus intentionnel dans ce domaine.",
            needsImprovement: "Vous devez vous concentrer davantage sur l'humilité. Essayez de développer cette dimension par la pratique et l'apprentissage."
          },
          empathy: {
            excellent: "Vous excellez en empathie. Vous comprenez les sentiments des autres et réduisez les désaccords.",
            good: "Vous avez un bon niveau d'empathie. Continuez à développer votre sensibilité et votre compréhension des autres.",
            average: "Vous avez un niveau modéré d'empathie. Essayez d'être plus attentif aux besoins des autres.",
            needsImprovement: "Vous devez vous concentrer davantage sur l'empathie. Essayez de développer cette dimension par la pratique et l'apprentissage."
          },
          accountability: {
            excellent: "Vous excellez en responsabilité. Vous assumez la responsabilité de vos actions et tenez vos engagements.",
            good: "Vous avez un bon niveau de responsabilité. Continuez à renforcer votre engagement et votre fiabilité.",
            average: "Vous avez un niveau modéré de responsabilité. Essayez d'être plus cohérent dans vos actions.",
            needsImprovement: "Vous devez vous concentrer davantage sur la responsabilité. Essayez de développer cette dimension par la pratique et l'apprentissage."
          },
          resiliency: {
            excellent: "Vous excellez en résilience. Vous gérez efficacement le stress et rebondissez après les revers.",
            good: "Vous avez un bon niveau de résilience. Continuez à développer votre adaptabilité et votre persévérance.",
            average: "Vous avez un niveau modéré de résilience. Essayez de renforcer votre capacité à faire face aux défis.",
            needsImprovement: "Vous devez vous concentrer davantage sur la résilience. Essayez de développer cette dimension par la pratique et l'apprentissage."
          },
          transparency: {
            excellent: "Vous excellez en transparence. Vous communiquez ouvertement et créez un environnement de confiance.",
            good: "Vous avez un bon niveau de transparence. Continuez à cultiver l'honnêteté et la clarté dans vos interactions.",
            average: "Vous avez un niveau modéré de transparence. Essayez de partager plus ouvertement vos pensées et décisions.",
            needsImprovement: "Vous devez vous concentrer davantage sur la transparence. Essayez de développer cette dimension par la pratique et l'apprentissage."
          },
          inclusivity: {
            excellent: "Vous excellez en inclusivité. Vous valorisez la diversité et créez des espaces où chacun peut contribuer.",
            good: "Vous avez un bon niveau d'inclusivité. Continuez à cultiver un environnement accueillant pour tous.",
            average: "Vous avez un niveau modéré d'inclusivité. Essayez d'être plus attentif à inclure diverses perspectives.",
            needsImprovement: "Vous devez vous concentrer davantage sur l'inclusivité. Essayez de développer cette dimension par la pratique et l'apprentissage."
          }
        },
        zh: {
          humility: {
            excellent: "您在谦逊方面表现出色。您积极寻求反馈，承认错误，并认可他人的贡献。",
            good: "您在谦逊方面有良好的水平。继续发展您的自我意识和对他人的开放性。",
            average: "您在谦逊方面有中等水平。尝试在这个领域更加有意识。",
            needsImprovement: "您需要更多地关注谦逊。尝试通过实践和学习来发展这个维度。"
          },
          empathy: {
            excellent: "您在同理心方面表现出色。您理解他人的感受并减少分歧。",
            good: "您在同理心方面有良好的水平。继续发展您的敏感度和对他人的理解。",
            average: "您在同理心方面有中等水平。尝试更加关注他人的需求。",
            needsImprovement: "您需要更多地关注同理心。尝试通过实践和学习来发展这个维度。"
          },
          accountability: {
            excellent: "您在责任感方面表现出色。您为自己的行动负责并履行承诺。",
            good: "您在责任感方面有良好的水平。继续加强您的承诺和可靠性。",
            average: "您在责任感方面有中等水平。尝试在您的行动中更加一致。",
            needsImprovement: "您需要更多地关注责任感。尝试通过实践和学习来发展这个维度。"
          },
          resiliency: {
            excellent: "您在韧性方面表现出色。您有效管理压力并从挫折中恢复。",
            good: "您在韧性方面有良好的水平。继续发展您的适应性和毅力。",
            average: "您在韧性方面有中等水平。尝试加强您应对挑战的能力。",
            needsImprovement: "您需要更多地关注韧性。尝试通过实践和学习来发展这个维度。"
          },
          transparency: {
            excellent: "您在透明度方面表现出色。您公开沟通并创造信任的环境。",
            good: "您在透明度方面有良好的水平。继续在您的互动中培养诚实和清晰。",
            average: "您在透明度方面有中等水平。尝试更公开地分享您的想法和决定。",
            needsImprovement: "您需要更多地关注透明度。尝试通过实践和学习来发展这个维度。"
          },
          inclusivity: {
            excellent: "您在包容性方面表现出色。您重视多样性并创造每个人都能贡献的空间。",
            good: "您在包容性方面有良好的水平。继续培养一个对所有人开放的环境。",
            average: "您在包容性方面有中等水平。尝试更加关注包括各种观点。",
            needsImprovement: "您需要更多地关注包容性。尝试通过实践和学习来发展这个维度。"
          }
        }
      };
      
      if (feedbackTranslations[currentLanguage] && 
          feedbackTranslations[currentLanguage][dimensionPart] && 
          feedbackTranslations[currentLanguage][dimensionPart][levelPart]) {
        return feedbackTranslations[currentLanguage][dimensionPart][levelPart];
      }
      
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
      const lastPart = key.split('.').pop() || '';
      
      // Format categories with spaces
      let formattedCategory = lastPart;
      if (lastPart.match(/[a-z][A-Z]/)) {
        formattedCategory = lastPart
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/^[a-z]/, match => match.toUpperCase());
      }
      
      const fallbackText = key.startsWith('activities.categories.') 
        ? formattedCategory
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
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      t,
      i18n,
      availableLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
