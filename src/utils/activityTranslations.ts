import { useLanguage } from '@/contexts/language/LanguageContext';

// Master mapping of activity categories to their normalized keys and translations
const CATEGORY_MAPPINGS = {
  'Self-Reflection & Awareness': {
    key: 'selfreflectionawareness',
    en: 'Self-Reflection & Awareness',
    fr: 'Réflexion sur Soi et Conscience',
    es: 'Autorreflexión y Conciencia',
    zh: '自我反思与意识',
    de: 'Selbstreflexion & Bewusstsein',
    it: 'Auto-riflessione e Consapevolezza',
    ar: 'التفكير الذاتي والوعي',
    he: 'רפלקציה עצמית ומודעות',
    ja: '自己省察と意識'
  },
  'Active Listening': {
    key: 'activelistening',
    en: 'Active Listening',
    fr: 'Écoute Active',
    es: 'Escucha Activa',
    zh: '积极倾听',
    de: 'Aktives Zuhören',
    it: 'Ascolto Attivo',
    ar: 'الاستماع النشط',
    he: 'הקשבה פעילה',
    ja: 'アクティブリスニング'
  },
  'Perspective-Taking': {
    key: 'perspectivetaking',
    en: 'Perspective-Taking',
    fr: 'Prise de Perspective',
    es: 'Toma de Perspectiva',
    zh: '换位思考',
    de: 'Perspektivenwechsel',
    it: 'Presa di Prospettiva',
    ar: 'تبني وجهات النظر',
    he: 'התחשבות בנקודות מבט',
    ja: '視点の変更'
  },
  'Building Connections': {
    key: 'buildingconnections',
    en: 'Building Connections',
    fr: 'Créer des Liens',
    es: 'Construir Conexiones',
    zh: '建立联系',
    de: 'Verbindungen aufbauen',
    it: 'Costruire Connessioni',
    ar: 'بناء الروابط',
    he: 'יצירת קשרים',
    ja: 'つながりの構築'
  },
  'Acknowledging Others': {
    key: 'acknowledgingothers',
    en: 'Acknowledging Others',
    fr: 'Reconnaître les Autres',
    es: 'Reconocer a Otros',
    zh: '认可他人',
    de: 'Andere anerkennen',
    it: 'Riconoscere gli Altri',
    ar: 'الاعتراف بالآخرين',
    he: 'הכרה באחרים',
    ja: '他者の承認'
  },
  'Emotional Awareness': {
    key: 'emotionalawareness',
    en: 'Emotional Awareness',
    fr: 'Conscience Émotionnelle',
    es: 'Conciencia Emocional',
    zh: '情感意识',
    de: 'Emotionales Bewusstsein',
    it: 'Consapevolezza Emotiva',
    ar: 'الوعي العاطفي',
    he: 'מודעות רגשית',
    ja: '感情的認識'
  },
  'Setting Clear Expectations': {
    key: 'settingclearexpectations',
    en: 'Setting Clear Expectations',
    fr: 'Établir des Attentes Claires',
    es: 'Establecer Expectativas Claras',
    zh: '设定明确期望',
    de: 'Klare Erwartungen setzen',
    it: 'Stabilire Aspettative Chiare',
    ar: 'وضع توقعات واضحة',
    he: 'קביעת ציפיות ברורות',
    ja: '明確な期待の設定'
  },
  'Taking Ownership': {
    key: 'takingownership',
    en: 'Taking Ownership',
    fr: 'Prendre la Responsabilité',
    es: 'Asumir Responsabilidad',
    zh: '承担责任',
    de: 'Verantwortung übernehmen',
    it: 'Assumersi la Responsabilità',
    ar: 'تحمل المسؤولية',
    he: 'לקיחת אחריות',
    ja: '責任を取る'
  },
  'Tracking Progress': {
    key: 'trackingprogress',
    en: 'Tracking Progress',
    fr: 'Suivi des Progrès',
    es: 'Seguimiento del Progreso',
    zh: '跟踪进度',
    de: 'Fortschritt verfolgen',
    it: 'Monitoraggio dei Progressi',
    ar: 'تتبع التقدم',
    he: 'מעקב אחר התקדמות',
    ja: '進捗の追跡'
  },
  'Building Trust': {
    key: 'buildingtrust',
    en: 'Building Trust',
    fr: 'Construire la Confiance',
    es: 'Construir Confianza',
    zh: '建立信任',
    de: 'Vertrauen aufbauen',
    it: 'Costruire Fiducia',
    ar: 'بناء الثقة',
    he: 'בניית אמון',
    ja: '信頼の構築'
  },
  'Continuous Improvement': {
    key: 'continuousimprovement',
    en: 'Continuous Improvement',
    fr: 'Amélioration Continue',
    es: 'Mejora Continua',
    zh: '持续改进',
    de: 'Kontinuierliche Verbesserung',
    it: 'Miglioramento Continuo',
    ar: 'التحسين المستمر',
    he: 'שיפור מתמיד',
    ja: '継続的改善'
  },
  'Mindset Shifts': {
    key: 'mindsetshifts',
    en: 'Mindset Shifts',
    fr: 'Changements de Mentalité',
    es: 'Cambios de Mentalidad',
    zh: '思维转变',
    de: 'Denkweise ändern',
    it: 'Cambiamenti di Mentalità',
    ar: 'تغييرات العقلية',
    he: 'שינויי תפיסה',
    ja: 'マインドセットの変化'
  },
  'Stress Management': {
    key: 'stressmanagement',
    en: 'Stress Management',
    fr: 'Gestion du Stress',
    es: 'Gestión del Estrés',
    zh: '压力管理',
    de: 'Stressmanagement',
    it: 'Gestione dello Stress',
    ar: 'إدارة الضغط',
    he: 'ניהול לחץ',
    ja: 'ストレス管理'
  },
  'Problem-Solving Skills': {
    key: 'problemsolvingskills',
    en: 'Problem-Solving Skills',
    fr: 'Compétences de Résolution de Problèmes',
    es: 'Habilidades de Resolución de Problemas',
    zh: '解决问题技能',
    de: 'Problemlösungsfähigkeiten',
    it: 'Abilità di Risoluzione dei Problemi',
    ar: 'مهارات حل المشاكل',
    he: 'כישורי פתרון בעיות',
    ja: '問題解決スキル'
  },
  'Emotional Regulation': {
    key: 'emotionalregulation',
    en: 'Emotional Regulation',
    fr: 'Régulation Émotionnelle',
    es: 'Regulación Emocional',
    zh: '情绪调节',
    de: 'Emotionale Regulation',
    it: 'Regolazione Emotiva',
    ar: 'التنظيم العاطفي',
    he: 'ויסות רגשי',
    ja: '感情調節'
  },
  'Support Systems & Community': {
    key: 'supportsystemscommunity',
    en: 'Support Systems & Community',
    fr: 'Systèmes de Soutien et Communauté',
    es: 'Sistemas de Apoyo y Comunidad',
    zh: '支持系统与社区',
    de: 'Unterstützungssysteme & Gemeinschaft',
    it: 'Sistemi di Supporto e Comunità',
    ar: 'أنظمة الدعم والمجتمع',
    he: 'מערכות תמיכה וקהילה',
    ja: 'サポートシステムとコミュニティ'
  },
  'Open Communication': {
    key: 'opencommunication',
    en: 'Open Communication',
    fr: 'Communication Ouverte',
    es: 'Comunicación Abierta',
    zh: '开放沟通',
    de: 'Offene Kommunikation',
    it: 'Comunicazione Aperta',
    ar: 'التواصل المفتوح',
    he: 'תקשורת פתוחה',
    ja: 'オープンコミュニケーション'
  },
  'Sharing Information': {
    key: 'sharinginformation',
    en: 'Sharing Information',
    fr: 'Partage d\'Information',
    es: 'Compartir Información',
    zh: '分享信息',
    de: 'Informationen teilen',
    it: 'Condivisione delle Informazioni',
    ar: 'مشاركة المعلومات',
    he: 'שיתוף מידע',
    ja: '情報共有'
  },
  'Empowering Others': {
    key: 'empoweringothers',
    en: 'Empowering Others',
    fr: 'Autonomiser les Autres',
    es: 'Empoderar a Otros',
    zh: '赋权他人',
    de: 'Andere stärken',
    it: 'Responsabilizzare gli Altri',
    ar: 'تمكين الآخرين',
    he: 'העצמת אחרים',
    ja: '他者のエンパワーメント'
  },
  'Building Awareness': {
    key: 'buildingawareness',
    en: 'Building Awareness',
    fr: 'Construire la Conscience',
    es: 'Construir Conciencia',
    zh: '构建意识',
    de: 'Bewusstsein schaffen',
    it: 'Costruire Consapevolezza',
    ar: 'بناء الوعي',
    he: 'בניית מודעות',
    ja: '意識の構築'
  },
  'Creating Safe Spaces': {
    key: 'creatingsafespaces',
    en: 'Creating Safe Spaces',
    fr: 'Créer des Espaces Sûrs',
    es: 'Crear Espacios Seguros',
    zh: '创造安全空间',
    de: 'Sichere Räume schaffen',
    it: 'Creare Spazi Sicuri',
    ar: 'إنشاء مساحات آمنة',
    he: 'יצירת מרחבים בטוחים',
    ja: '安全なスペースの創造'
  },
  'Promoting Equity': {
    key: 'promotingequity',
    en: 'Promoting Equity',
    fr: 'Promouvoir l\'Équité',
    es: 'Promover la Equidad',
    zh: '促进公平',
    de: 'Gerechtigkeit fördern',
    it: 'Promuovere l\'Equità',
    ar: 'تعزيز العدالة',
    he: 'קידום שוויון',
    ja: '公平性の促進'
  },
  'Fostering Collaboration': {
    key: 'fosteringcollaboration',
    en: 'Fostering Collaboration',
    fr: 'Favoriser la Collaboration',
    es: 'Fomentar la Colaboración',
    zh: '促进协作',
    de: 'Zusammenarbeit fördern',
    it: 'Favorire la Collaborazione',
    ar: 'تعزيز التعاون',
    he: 'טיפוח שיתוף פעולה',
    ja: 'コラボレーションの促進'
  },
  'Leading by Example': {
    key: 'leadingbyexample',
    en: 'Leading by Example',
    fr: 'Diriger par l\'Exemple',
    es: 'Liderar con el Ejemplo',
    zh: '以身作则',
    de: 'Mit gutem Beispiel vorangehen',
    it: 'Guidare con l\'Esempio',
    ar: 'القيادة بالمثال',
    he: 'הובלה בדוגמה אישית',
    ja: '模範による指導'
  }
};

/**
 * Normalizes a category string to match translation keys
 * Removes spaces, ampersands, hyphens, and converts to lowercase
 */
function normalizeCategory(category: string): string {
  return category.toLowerCase().replace(/[-_\s&']/g, '');
}

/**
 * Finds the correct translation for a category
 * Uses multiple matching strategies to find the best translation
 */
export function getActivityCategoryTranslation(category: string, currentLanguage: string): string {
  if (!category) return '';
  
  // First try exact match
  const exactMatch = Object.values(CATEGORY_MAPPINGS).find(mapping => 
    mapping.en === category || mapping.key === normalizeCategory(category)
  );
  
  if (exactMatch && exactMatch[currentLanguage as keyof typeof exactMatch]) {
    return exactMatch[currentLanguage as keyof typeof exactMatch] as string;
  }
  
  // Try fuzzy matching by normalized keys
  const normalizedInput = normalizeCategory(category);
  const fuzzyMatch = Object.values(CATEGORY_MAPPINGS).find(mapping => 
    mapping.key === normalizedInput
  );
  
  if (fuzzyMatch && fuzzyMatch[currentLanguage as keyof typeof fuzzyMatch]) {
    return fuzzyMatch[currentLanguage as keyof typeof fuzzyMatch] as string;
  }
  
  // Fallback to the original category
  return category;
}

/**
 * Gets activity description translation using activity ID
 */
export function getActivityDescriptionTranslation(activityId: string, t: (key: string, options?: any) => string): string {
  // Try the double-nested structure first (activities.activities.descriptions.{id})
  let descriptionKey = `activities.activities.descriptions.${activityId}`;
  let translated = t(descriptionKey);
  
  // If that fails, try the single-nested structure (activities.descriptions.{id})
  if (translated === descriptionKey) {
    descriptionKey = `activities.descriptions.${activityId}`;
    translated = t(descriptionKey);
  }
  
  // If translation key is returned as-is, it means no translation was found
  if (translated === descriptionKey) {
    return ''; // Return empty to fall back to original description
  }
  
  return translated;
}

/**
 * Hook to get translated activity data
 */
export function useActivityTranslations() {
  const { t, currentLanguage } = useLanguage();
  
  const getTranslatedCategory = (category: string) => {
    return getActivityCategoryTranslation(category, currentLanguage);
  };
  
  const getTranslatedDescription = (activityId: string, originalDescription: string) => {
    const translated = getActivityDescriptionTranslation(activityId, t);
    return translated || originalDescription;
  };
  
  return {
    getTranslatedCategory,
    getTranslatedDescription
  };
}