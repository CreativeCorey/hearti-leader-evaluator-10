
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
    'results.comparison.noneLabel': '无比较',
    'results.comparison.progress': 'HEARTI 随时间的进展',
    'results.comparison.progressSubtitle': '选择图表上的一个点以查看该评估的数据',
    'results.comparison.noProgressData': '完成更多评估以查看您随时间的进展。',
    'results.comparison.overallScore': '总体分数'
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
    'results.comparison.noneLabel': 'Aucune comparaison',
    'results.comparison.progress': 'Progression HEARTI au fil du temps',
    'results.comparison.progressSubtitle': 'Sélectionnez un point sur le graphique pour voir les données de cette évaluation',
    'results.comparison.noProgressData': 'Complétez plus d\'évaluations pour voir votre progression au fil du temps.',
    'results.comparison.overallScore': 'Score global'
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
    'results.comparison.noneLabel': 'Sin comparación',
    'results.comparison.progress': 'Progreso de HEARTI a lo largo del tiempo',
    'results.comparison.progressSubtitle': 'Selecciona un punto en el gráfico para ver los datos de esa evaluación',
    'results.comparison.noProgressData': 'Completa más evaluaciones para ver tu progreso a lo largo del tiempo.',
    'results.comparison.overallScore': 'Puntuación general'
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
    'results.comparison.noneLabel': 'Nessun confronto',
    'results.comparison.progress': 'Progresso HEARTI nel tempo',
    'results.comparison.progressSubtitle': 'Seleziona un punto sul grafico per vedere i dati di quella valutazione',
    'results.comparison.noProgressData': 'Completa più valutazioni per vedere il tuo progresso nel tempo.',
    'results.comparison.overallScore': 'Punteggio complessivo'
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
    'results.comparison.noneLabel': '比較なし',
    'results.comparison.progress': '時間の経過に伴うHEARTIの進捗',
    'results.comparison.progressSubtitle': 'チャート上のポイントを選択して、その評価のデータを表示します',
    'results.comparison.noProgressData': '時間の経過に伴う進捗を確認するには、より多くの評価を完了してください。',
    'results.comparison.overallScore': '総合スコア'
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
    'results.comparison.noneLabel': 'بدون مقارنة',
    'results.comparison.progress': 'تقدم HEARTI مع مرور الوقت',
    'results.comparison.progressSubtitle': 'حدد نقطة على الرسم البياني لعرض بيانات ذلك التقييم',
    'results.comparison.noProgressData': 'أكمل المزيد من التقييمات لرؤية تقدمك مع مرور الوقت.',
    'results.comparison.overallScore': 'النتيجة الإجمالية'
  },
};

// Common direct translations for development section
const developmentTranslations = {
  zh: {
    'results.development.addToHabitTracker': '添加到习惯跟踪器',
    'results.development.chooseActivitiesFor': '为以下选择活动',
    'results.development.recommendationsTitle': 'HEARTI™ 领导力发展建议'
  },
  fr: {
    'results.development.addToHabitTracker': 'Ajouter au suivi d\'habitudes',
    'results.development.chooseActivitiesFor': 'Choisir des activités pour',
    'results.development.recommendationsTitle': 'Recommandations de développement pour le leadership HEARTI™'
  },
  es: {
    'results.development.addToHabitTracker': 'Añadir al seguimiento de hábitos',
    'results.development.chooseActivitiesFor': 'Elegir actividades para',
    'results.development.recommendationsTitle': 'Recomendaciones de desarrollo para el liderazgo HEARTI™'
  },
  it: {
    'results.development.addToHabitTracker': 'Aggiungi al tracker di abitudini',
    'results.development.chooseActivitiesFor': 'Scegli attività per',
    'results.development.recommendationsTitle': 'Raccomandazioni di sviluppo per la leadership HEARTI™'
  },
  ja: {
    'results.development.addToHabitTracker': '習慣トラッカーに追加',
    'results.development.chooseActivitiesFor': '活動を選択する',
    'results.development.recommendationsTitle': 'HEARTI™リーダーシップの開発推奨事項'
  },
  ar: {
    'results.development.addToHabitTracker': 'إضافة إلى متتبع العادات',
    'results.development.chooseActivitiesFor': 'اختر الأنشطة لـ',
    'results.development.recommendationsTitle': 'توصيات التطوير لقيادة HEARTI™'
  },
};

// Common direct translations for habits section
const habitsTranslations = {
  zh: {
    'results.habits.yourHabits': '您的习惯',
    'results.habits.addHabit': '添加习惯',
    'results.habits.trackerTitle': 'HEARTI™ 领导力习惯跟踪器',
    'results.habits.trackerDescription': '跟踪您在建立所选行为的一致习惯时的进展。完成每项行为30次，使其成为持久习惯。',
    'results.habits.recommendedFocus': '我们建议专注于来自您发展领域的行为：',
    'results.habits.addBehaviorsInstructions': '通过使用开发标签中的"添加到习惯跟踪器"按钮或在您保存的活动中添加行为到您的习惯跟踪器。'
  },
  fr: {
    'results.habits.yourHabits': 'Vos Habitudes',
    'results.habits.addHabit': 'Ajouter une habitude',
    'results.habits.trackerTitle': 'Suivi des habitudes pour le leadership HEARTI™',
    'results.habits.trackerDescription': 'Suivez votre progression à mesure que vous développez des habitudes cohérentes pour vos comportements choisis. Complétez chaque comportement 30 fois pour en faire une habitude durable.',
    'results.habits.recommendedFocus': 'Nous vous recommandons de vous concentrer sur les comportements de votre domaine de développement :',
    'results.habits.addBehaviorsInstructions': 'Ajoutez des comportements à votre suivi d\'habitudes en utilisant le bouton "Ajouter au suivi d\'habitudes" dans l\'onglet Développement ou sur vos activités enregistrées.'
  },
  es: {
    'results.habits.yourHabits': 'Tus Hábitos',
    'results.habits.addHabit': 'Añadir Hábito',
    'results.habits.trackerTitle': 'Seguimiento de hábitos para el liderazgo HEARTI™',
    'results.habits.trackerDescription': 'Sigue tu progreso mientras desarrollas hábitos consistentes para tus comportamientos elegidos. Completa cada comportamiento 30 veces para convertirlo en un hábito duradero.',
    'results.habits.recommendedFocus': 'Recomendamos centrarse en comportamientos de tu área de desarrollo:',
    'results.habits.addBehaviorsInstructions': 'Añade comportamientos a tu seguimiento de hábitos utilizando el botón "Añadir al seguimiento de hábitos" en la pestaña de Desarrollo o en tus actividades guardadas.'
  },
  it: {
    'results.habits.yourHabits': 'Le tue Abitudini',
    'results.habits.addHabit': 'Aggiungi Abitudine',
    'results.habits.trackerTitle': 'Tracker delle abitudini per la leadership HEARTI™',
    'results.habits.trackerDescription': 'Tieni traccia dei tuoi progressi mentre costruisci abitudini costanti per i comportamenti scelti. Completa ogni comportamento 30 volte per trasformarlo in un\'abitudine duratura.',
    'results.habits.recommendedFocus': 'Consigliamo di concentrarsi sui comportamenti della tua area di sviluppo:',
    'results.habits.addBehaviorsInstructions': 'Aggiungi comportamenti al tuo tracker di abitudini utilizzando il pulsante "Aggiungi al tracker di abitudini" nella scheda Sviluppo o sulle tue attività salvate.'
  },
  ja: {
    'results.habits.yourHabits': 'あなたの習慣',
    'results.habits.addHabit': '習慣を追加',
    'results.habits.trackerTitle': 'HEARTI™リーダーシップの習慣トラッカー',
    'results.habits.trackerDescription': '選択した行動の一貫した習慣を構築するにつれて進捗状況を追跡します。各行動を30回完了して、持続的な習慣にします。',
    'results.habits.recommendedFocus': '開発領域からの行動に焦点を当てることをお勧めします：',
    'results.habits.addBehaviorsInstructions': '開発タブまたは保存したアクティビティで「習慣トラッカーに追加」ボタンを使用して、習慣トラッカーに行動を追加します。'
  },
  ar: {
    'results.habits.yourHabits': 'عاداتك',
    'results.habits.addHabit': 'إضافة عادة',
    'results.habits.trackerTitle': 'متتبع العادات لقيادة HEARTI™',
    'results.habits.trackerDescription': 'تتبع تقدمك أثناء بناء عادات متسقة لسلوكياتك المختارة. أكمل كل سلوك 30 مرة لتحويله إلى عادة دائمة.',
    'results.habits.recommendedFocus': 'نوصي بالتركيز على السلوكيات من منطقة التطوير الخاصة بك:',
    'results.habits.addBehaviorsInstructions': 'أضف سلوكيات إلى متتبع العادات الخاص بك باستخدام زر "إضافة إلى متتبع العادات" في علامة التبويب التطوير أو على أنشطتك المحفوظة.'
  },
};

// Activity categories translations
const activityCategoriesTranslations = {
  fr: {
    'activities.categories.activelistening': 'Écoute Active',
    'activities.categories.perspectivetaking': 'Prise de Perspective',
    'activities.categories.buildingconnections': 'Créer des Liens',
    'activities.categories.selfreflectionawareness': 'Réflexion sur Soi et Conscience',
    'activities.categories.acknowledgingothers': 'Reconnaître les Autres',
    'activities.categories.emotionalawareness': 'Conscience Émotionnelle',
    'activities.categories.settingclearexpectations': 'Établir des Attentes Claires',
    'activities.categories.takingownership': 'Prendre la Responsabilité',
    'activities.categories.trackingprogress': 'Suivi des Progrès',
    'activities.categories.buildingtrust': 'Construire la Confiance',
    'activities.categories.continuousimprovement': 'Amélioration Continue',
    'activities.categories.mindsetshifts': 'Changements de Mentalité',
    'activities.categories.stressmanagement': 'Gestion du Stress',
    'activities.categories.problemsolvingskills': 'Compétences de Résolution de Problèmes',
    'activities.categories.emotionalregulation': 'Régulation Émotionnelle',
    'activities.categories.supportsystemscommunity': 'Systèmes de Soutien et Communauté',
    'activities.categories.opencommunication': 'Communication Ouverte',
    'activities.categories.sharinginformation': 'Partage d\'Information',
    'activities.categories.empoweringothers': 'Autonomiser les Autres',
    'activities.categories.buildingawareness': 'Construire la Conscience',
    'activities.categories.creatingsafespaces': 'Créer des Espaces Sûrs',
    'activities.categories.promotingequity': 'Promouvoir l\'Équité',
    'activities.categories.fosteringcollaboration': 'Favoriser la Collaboration',
    'activities.categories.leadingbyexample': 'Diriger par l\'Exemple'
  },
  zh: {
    'activities.categories.activelistening': '积极倾听',
    'activities.categories.perspectivetaking': '换位思考',
    'activities.categories.buildingconnections': '建立联系',
    'activities.categories.selfreflectionawareness': '自我反思与意识',
    'activities.categories.acknowledgingothers': '认可他人',
    'activities.categories.emotionalawareness': '情感意识',
    'activities.categories.settingclearexpectations': '设定明确期望',
    'activities.categories.takingownership': '承担责任',
    'activities.categories.trackingprogress': '跟踪进度',
    'activities.categories.buildingtrust': '建立信任',
    'activities.categories.continuousimprovement': '持续改进',
    'activities.categories.mindsetshifts': '思维转变',
    'activities.categories.stressmanagement': '压力管理',
    'activities.categories.problemsolvingskills': '解决问题技能',
    'activities.categories.emotionalregulation': '情绪调节',
    'activities.categories.supportsystemscommunity': '支持系统与社区',
    'activities.categories.opencommunication': '开放沟通',
    'activities.categories.sharinginformation': '分享信息',
    'activities.categories.empoweringothers': '赋权他人',
    'activities.categories.buildingawareness': '构建意识',
    'activities.categories.creatingsafespaces': '创造安全空间',
    'activities.categories.promotingequity': '促进公平',
    'activities.categories.fosteringcollaboration': '促进协作',
    'activities.categories.leadingbyexample': '以身作则'
  },
  es: {
    'activities.categories.activelistening': 'Escucha Activa',
    'activities.categories.perspectivetaking': 'Toma de Perspectiva',
    'activities.categories.buildingconnections': 'Construir Conexiones',
    'activities.categories.selfreflectionawareness': 'Autorreflexión y Conciencia',
    'activities.categories.acknowledgingothers': 'Reconocer a Otros',
    'activities.categories.emotionalawareness': 'Conciencia Emocional',
    'activities.categories.settingclearexpectations': 'Establecer Expectativas Claras',
    'activities.categories.takingownership': 'Asumir Responsabilidad',
    'activities.categories.trackingprogress': 'Seguimiento del Progreso',
    'activities.categories.buildingtrust': 'Construir Confianza',
    'activities.categories.continuousimprovement': 'Mejora Continua',
    'activities.categories.mindsetshifts': 'Cambios de Mentalidad',
    'activities.categories.stressmanagement': 'Gestión del Estrés',
    'activities.categories.problemsolvingskills': 'Habilidades de Resolución de Problemas',
    'activities.categories.emotionalregulation': 'Regulación Emocional',
    'activities.categories.supportsystemscommunity': 'Sistemas de Apoyo y Comunidad',
    'activities.categories.opencommunication': 'Comunicación Abierta',
    'activities.categories.sharinginformation': 'Compartir Información',
    'activities.categories.empoweringothers': 'Empoderar a Otros',
    'activities.categories.buildingawareness': 'Construir Conciencia',
    'activities.categories.creatingsafespaces': 'Crear Espacios Seguros',
    'activities.categories.promotingequity': 'Promover Equidad',
    'activities.categories.fosteringcollaboration': 'Fomentar Colaboración',
    'activities.categories.leadingbyexample': 'Liderar con el Ejemplo'
  },
  it: {
    'activities.categories.activelistening': 'Ascolto Attivo',
    'activities.categories.perspectivetaking': 'Presa di Prospettiva',
    'activities.categories.buildingconnections': 'Costruire Connessioni',
    'activities.categories.selfreflectionawareness': 'Autoriflessione e Consapevolezza',
    'activities.categories.acknowledgingothers': 'Riconoscere gli Altri',
    'activities.categories.emotionalawareness': 'Consapevolezza Emotiva',
    'activities.categories.settingclearexpectations': 'Stabilire Aspettative Chiare',
    'activities.categories.takingownership': 'Assumersi la Responsabilità',
    'activities.categories.trackingprogress': 'Monitoraggio dei Progressi',
    'activities.categories.buildingtrust': 'Costruire Fiducia',
    'activities.categories.continuousimprovement': 'Miglioramento Continuo',
    'activities.categories.mindsetshifts': 'Cambiamenti di Mentalità',
    'activities.categories.stressmanagement': 'Gestione dello Stress',
    'activities.categories.problemsolvingskills': 'Competenze di Risoluzione Problemi',
    'activities.categories.emotionalregulation': 'Regolazione Emotiva',
    'activities.categories.supportsystemscommunity': 'Sistemi di Supporto e Comunità',
    'activities.categories.opencommunication': 'Comunicazione Aperta',
    'activities.categories.sharinginformation': 'Condivisione Informazioni',
    'activities.categories.empoweringothers': 'Responsabilizzare gli Altri',
    'activities.categories.buildingawareness': 'Costruire Consapevolezza',
    'activities.categories.creatingsafespaces': 'Creare Spazi Sicuri',
    'activities.categories.promotingequity': 'Promuovere Equità',
    'activities.categories.fosteringcollaboration': 'Favorire Collaborazione',
    'activities.categories.leadingbyexample': 'Guidare con l\'Esempio'
  },
  de: {
    'activities.categories.activelistening': 'Aktives Zuhören',
    'activities.categories.perspectivetaking': 'Perspektivenübernahme',
    'activities.categories.buildingconnections': 'Verbindungen Aufbauen',
    'activities.categories.selfreflectionawareness': 'Selbstreflexion und Bewusstsein',
    'activities.categories.acknowledgingothers': 'Andere Anerkennen',
    'activities.categories.emotionalawareness': 'Emotionales Bewusstsein',
    'activities.categories.settingclearexpectations': 'Klare Erwartungen Setzen',
    'activities.categories.takingownership': 'Verantwortung Übernehmen',
    'activities.categories.trackingprogress': 'Fortschritt Verfolgen',
    'activities.categories.buildingtrust': 'Vertrauen Aufbauen',
    'activities.categories.continuousimprovement': 'Kontinuierliche Verbesserung',
    'activities.categories.mindsetshifts': 'Denkweise Ändern',
    'activities.categories.stressmanagement': 'Stressmanagement',
    'activities.categories.problemsolvingskills': 'Problemlösungskompetenzen',
    'activities.categories.emotionalregulation': 'Emotionsregulation',
    'activities.categories.supportsystemscommunity': 'Unterstützungssysteme und Gemeinschaft',
    'activities.categories.opencommunication': 'Offene Kommunikation',
    'activities.categories.sharinginformation': 'Informationen Teilen',
    'activities.categories.empoweringothers': 'Andere Ermächtigen',
    'activities.categories.buildingawareness': 'Bewusstsein Schaffen',
    'activities.categories.creatingsafespaces': 'Sichere Räume Schaffen',
    'activities.categories.promotingequity': 'Gerechtigkeit Fördern',
    'activities.categories.fosteringcollaboration': 'Zusammenarbeit Fördern',
    'activities.categories.leadingbyexample': 'Mit Beispiel Vorangehen'
  },
  ja: {
    'activities.categories.activelistening': 'アクティブリスニング',
    'activities.categories.perspectivetaking': '視点取得',
    'activities.categories.buildingconnections': '関係構築',
    'activities.categories.selfreflectionawareness': '自己反省と認識',
    'activities.categories.acknowledgingothers': '他者を認める',
    'activities.categories.emotionalawareness': '感情的認識',
    'activities.categories.settingclearexpectations': '明確な期待設定',
    'activities.categories.takingownership': '責任を取る',
    'activities.categories.trackingprogress': '進捗追跡',
    'activities.categories.buildingtrust': '信頼構築',
    'activities.categories.continuousimprovement': '継続的改善',
    'activities.categories.mindsetshifts': 'マインドセットの変化',
    'activities.categories.stressmanagement': 'ストレス管理',
    'activities.categories.problemsolvingskills': '問題解決スキル',
    'activities.categories.emotionalregulation': '感情調整',
    'activities.categories.supportsystemscommunity': 'サポートシステムとコミュニティ',
    'activities.categories.opencommunication': 'オープンコミュニケーション',
    'activities.categories.sharinginformation': '情報共有',
    'activities.categories.empoweringothers': '他者のエンパワーメント',
    'activities.categories.buildingawareness': '認識構築',
    'activities.categories.creatingsafespaces': '安全な空間の創造',
    'activities.categories.promotingequity': '公平性の促進',
    'activities.categories.fosteringcollaboration': 'コラボレーション促進',
    'activities.categories.leadingbyexample': '模範による指導'
  },
  ar: {
    'activities.categories.activelistening': 'الإصغاء النشط',
    'activities.categories.perspectivetaking': 'أخذ المنظور',
    'activities.categories.buildingconnections': 'بناء العلاقات',
    'activities.categories.selfreflectionawareness': 'التأمل الذاتي والوعي',
    'activities.categories.acknowledgingothers': 'تقدير الآخرين',
    'activities.categories.emotionalawareness': 'الوعي العاطفي',
    'activities.categories.settingclearexpectations': 'وضع توقعات واضحة',
    'activities.categories.takingownership': 'تحمل المسؤولية',
    'activities.categories.trackingprogress': 'تتبع التقدم',
    'activities.categories.buildingtrust': 'بناء الثقة',
    'activities.categories.continuousimprovement': 'التحسين المستمر',
    'activities.categories.mindsetshifts': 'تغيير العقلية',
    'activities.categories.stressmanagement': 'إدارة الضغط',
    'activities.categories.problemsolvingskills': 'مهارات حل المشاكل',
    'activities.categories.emotionalregulation': 'تنظيم العواطف',
    'activities.categories.supportsystemscommunity': 'أنظمة الدعم والمجتمع',
    'activities.categories.opencommunication': 'التواصل المفتوح',
    'activities.categories.sharinginformation': 'مشاركة المعلومات',
    'activities.categories.empoweringothers': 'تمكين الآخرين',
    'activities.categories.buildingawareness': 'بناء الوعي',
    'activities.categories.creatingsafespaces': 'إنشاء مساحات آمنة',
    'activities.categories.promotingequity': 'تعزيز العدالة',
    'activities.categories.fosteringcollaboration': 'تعزيز التعاون',
    'activities.categories.leadingbyexample': 'القيادة بالمثال'
  },
  he: {
    'activities.categories.activelistening': 'הקשבה פעילה',
    'activities.categories.perspectivetaking': 'נטילת פרספקטיבה',
    'activities.categories.buildingconnections': 'בניית קשרים',
    'activities.categories.selfreflectionawareness': 'הרהור עצמי ומודעות',
    'activities.categories.acknowledgingothers': 'הכרה באחרים',
    'activities.categories.emotionalawareness': 'מודעות רגשית',
    'activities.categories.settingclearexpectations': 'הגדרת ציפיות ברורות',
    'activities.categories.takingownership': 'נטילת אחריות',
    'activities.categories.trackingprogress': 'מעקב אחר התקדמות',
    'activities.categories.buildingtrust': 'בניית אמון',
    'activities.categories.continuousimprovement': 'שיפור מתמיד',
    'activities.categories.mindsetshifts': 'שינויי חשיבה',
    'activities.categories.stressmanagement': 'ניהול לחץ',
    'activities.categories.problemsolvingskills': 'כישורי פתרון בעיות',
    'activities.categories.emotionalregulation': 'ויסות רגשי',
    'activities.categories.supportsystemscommunity': 'מערכות תמיכה וקהילה',
    'activities.categories.opencommunication': 'תקשורת פתוחה',
    'activities.categories.sharinginformation': 'שיתוף מידע',
    'activities.categories.empoweringothers': 'העצמת אחרים',
    'activities.categories.buildingawareness': 'בניית מודעות',
    'activities.categories.creatingsafespaces': 'יצירת מרחבים בטוחים',
    'activities.categories.promotingequity': 'קידום שוויון',
    'activities.categories.fosteringcollaboration': 'טיפוח שיתוף פעולה',
    'activities.categories.leadingbyexample': 'הובלה באמצעות דוגמה'
  }
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
    'dimensions.feedback.inclusivity.needsImprovement': '您需要更加关注包容性。尝试了解多样性的价值，挑战自己的假设。',
    'report.header.title': '亲爱的21世纪领导者：',
    'report.header.content': '您代表着未来，而不是过去。您可能被鼓励通过专注于为昨天的工业时代而非今天相关的能力来发展您的领导技能—更不用说明天了。\n\n我们理解，因为我们确定了明天工作场所所需的基本领导技能。我们研究了认知和积极心理学、组织设计和绩效管理方面的最新突破。我们还与数十个行业的现代领导者交谈。\n\n通过这个过程，我们了解到21世纪工作场所所需的核心能力是转型型领导者有意识地使用以鼓励更好结果的特质。它们是谦逊、同理心、责任感、韧性、透明度和包容性。运用这些能力的领导者将开辟创新、创造力和积极员工体验的道路。我们的研究还表明，雇用和发展具有这些特质的领导者的公司表现优于那些雇用和发展具有传统领导行为的领导者的公司。',
    'report.dimension.analysisTitle': 'HEARTI 维度分析',
    'report.dimension.analysisDescription': '以下每个维度显示您的分数、能力水平和持续发展的指导。'
  },
  fr: {
    'results.report.description': 'Perspectives et recommandations pour vous aider à développer vos compétences en leadership',
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
    'dimensions.feedback.inclusivity.needsImprovement': 'Vous devez vous concentrer davantage sur l\'inclusivité. Essayez de comprendre la valeur de la diversité et de remettre en question vos hypothèses.',
    'report.header.title': 'Cher leader du 21e siècle :',
    'report.header.content': 'Vous représentez l\'avenir, pas le passé. Vous avez probablement été encouragé à développer vos compétences en leadership en vous concentrant sur des compétences conçues pour l\'ère industrielle d\'hier au lieu de celles pertinentes aujourd\'hui, sans parler de demain.\n\nNous comprenons parce que nous avons identifié les compétences de leadership essentielles requises pour le lieu de travail de demain. Nous avons étudié les percées récentes en psychologie cognitive et positive, en conception organisationnelle et en gestion de la performance. Nous avons également parlé à des leaders modernes de dizaines d\'industries.\n\nGrâce à ce processus, nous avons compris que les compétences fondamentales requises pour le lieu de travail du 21e siècle sont des traits que les leaders transformationnels utilisent intentionnellement pour encourager de meilleurs résultats. Ce sont l\'humilité, l\'empathie, la responsabilité, la résilience, la transparence et l\'inclusivité. Les leaders qui exploitent ces compétences forgeront des voies d\'innovation, de créativité et d\'expériences positives pour les employés. Nos recherches ont également révélé que les entreprises qui embauchent et développent des leaders avec ces traits performent mieux que celles qui embauchent et développent des leaders avec des comportements de leadership traditionnels.',
    'report.dimension.analysisTitle': 'Analyse des dimensions HEARTI',
    'report.dimension.analysisDescription': 'Chaque dimension ci-dessous montre votre score, votre niveau de compétence et des conseils pour votre développement continu.'
  },
  es: {
    'results.report.description': 'Insights y recomendaciones para ayudarte a desarrollar tus habilidades de liderazgo',
    'report.header.title': 'Estimado líder del siglo XXI:',
    'report.header.content': 'Representas el futuro, no el pasado. Es probable que te hayan animado a desarrollar tus habilidades de liderazgo centrándote en competencias diseñadas para la Era Industrial de ayer en lugar de las relevantes hoy, por no hablar del mañana.\n\nLo entendemos porque identificamos las habilidades de liderazgo esenciales requeridas para el lugar de trabajo del mañana. Estudiamos avances recientes en psicología cognitiva y positiva, diseño organizacional y gestión del rendimiento. También hablamos con líderes modernos de docenas de industrias.\n\nA través de este proceso, entendimos que las competencias básicas requeridas para el lugar de trabajo del siglo XXI son rasgos que los líderes transformacionales usan intencionalmente para fomentar mejores resultados. Son Humildad, Empatía, Responsabilidad, Resiliencia, Transparencia e Inclusividad. Los líderes que aprovechan estas competencias forjarán caminos de innovación, creatividad y experiencias positivas de los empleados. Nuestra investigación también reveló que las empresas que contratan y desarrollan líderes con estos rasgos tienen un mejor desempeño que aquellas que contratan y desarrollan líderes con comportamientos de liderazgo tradicionales.',
    'report.dimension.analysisTitle': 'Análisis de dimensiones HEARTI',
    'report.dimension.analysisDescription': 'Cada dimensión a continuación muestra tu puntuación, nivel de competencia y orientación para tu desarrollo continuo.'
  }
};

export const getTranslation = (language: SupportedLanguage, key: string, params?: Record<string, any>): string => {
  // Activity categories special handling
  if (key.startsWith('activities.categories.')) {
    if (activityCategoriesTranslations[language] && activityCategoriesTranslations[language][key]) {
      return activityCategoriesTranslations[language][key];
    }
    
    // If no direct translation, format the key nicely
    const category = key.replace('activities.categories.', '');
    return formatCategoryName(category);
  }
  
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
  if (key.startsWith('results.report.') || key.startsWith('dimensions.feedback.') || 
      key.startsWith('report.header.') || key.startsWith('report.dimension.')) {
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

// Format a category name with proper spacing and capitalization
const formatCategoryName = (category: string): string => {
  if (!category) return '';
  
  return category
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^[a-z]/, match => match.toUpperCase());
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
