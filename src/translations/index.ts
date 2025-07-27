
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

// Activity descriptions translations
const activityDescriptionsTranslations = {
  en: {
    // Humility
    'activities.descriptions.h1': "Write down three things you're grateful for about your team every day.",
    'activities.descriptions.h2': "Reflect on a recent mistake and identify what you learned from it.",
    'activities.descriptions.h3': "Keep a journal to track moments when you felt proud or overly confident—analyze why.",
    'activities.descriptions.h4': "Ask yourself daily: \"Am I listening more than I'm speaking?\"",
    'activities.descriptions.h5': "Identify one area where you can improve as a leader or colleague.",
    'activities.descriptions.h6': "Focus fully on the speaker during conversations—no multitasking.",
    'activities.descriptions.h7': "Paraphrase what someone says before responding to ensure understanding.",
    'activities.descriptions.h8': "Avoid interrupting others while they're sharing ideas.",
    'activities.descriptions.h9': "Ask clarifying questions to show genuine interest.",
    'activities.descriptions.h10': "Publicly recognize a teammate's contribution in a meeting.",
    
    // Empathy
    'activities.descriptions.e1': "Focus entirely on the speaker without distractions.",
    'activities.descriptions.e2': "Avoid interrupting while someone is sharing their thoughts.",
    'activities.descriptions.e3': "Paraphrase what someone says to confirm understanding.",
    'activities.descriptions.e4': "Ask open-ended questions like, \"How did that make you feel?\"",
    'activities.descriptions.e5': "Imagine yourself in a coworker's situation before reacting.",
    'activities.descriptions.e6': "Spend a day shadowing someone in a different role to understand their challenges.",
    'activities.descriptions.e7': "Role-play scenarios from another team member's point of view.",
    'activities.descriptions.e8': "Schedule regular one-on-one check-ins with team members.",
    'activities.descriptions.e9': "Share something personal (appropriately) to encourage mutual trust.",
    'activities.descriptions.e10': "Notice changes in a colleague's mood or energy levels.",
    
    // Accountability
    'activities.descriptions.a1': "Define specific, measurable goals for yourself and your team.",
    'activities.descriptions.a2': "Break down large projects into smaller, actionable tasks with deadlines.",
    'activities.descriptions.a3': "Communicate your role and responsibilities clearly to others.",
    'activities.descriptions.a4': "Admit mistakes immediately and take steps to correct them.",
    'activities.descriptions.a5': "Avoid blaming others when things go wrong—focus on solutions.",
    'activities.descriptions.a6': "Own both successes and failures as part of your journey.",
    'activities.descriptions.a7': "Keep a daily or weekly log of completed tasks and achievements.",
    'activities.descriptions.a8': "Share updates with your team to maintain transparency.",
    'activities.descriptions.a9': "Consistently meet or exceed expectations to build credibility.",
    'activities.descriptions.a10': "Seek feedback regularly from peers, managers, and subordinates.",
    
    // Resiliency
    'activities.descriptions.r1': "Reframe setbacks as opportunities to learn and grow.",
    'activities.descriptions.r2': "Practice gratitude by writing down three positive things each day.",
    'activities.descriptions.r3': "Focus on what you can control rather than worrying about external factors.",
    'activities.descriptions.r4': "Take short breaks throughout the day to recharge.",
    'activities.descriptions.r5': "Practice deep breathing exercises during stressful moments.",
    'activities.descriptions.r6': "Incorporate mindfulness or meditation into your daily routine.",
    'activities.descriptions.r7': "Break overwhelming problems into smaller, manageable steps.",
    'activities.descriptions.r8': "Brainstorm multiple solutions before deciding on one.",
    'activities.descriptions.r9': "Label your emotions (e.g., \"I'm feeling frustrated\") to process them better.",
    'activities.descriptions.r10': "Build strong relationships with coworkers who uplift you.",
    
    // Transparency
    'activities.descriptions.t1': "Share updates regularly with your team, even if there's no major news.",
    'activities.descriptions.t2': "Hold weekly check-ins to discuss progress, challenges, and goals.",
    'activities.descriptions.t3': "Use clear, simple language instead of jargon or technical terms.",
    'activities.descriptions.t4': "Create a shared drive or platform where all relevant documents are accessible.",
    'activities.descriptions.t5': "Share both successes and setbacks openly with your team.",
    'activities.descriptions.t6': "Make performance metrics visible to promote accountability.",
    'activities.descriptions.t7': "Follow through on promises and commitments consistently.",
    'activities.descriptions.t8': "Apologize sincerely if you make a mistake or miscommunicate.",
    'activities.descriptions.t9': "Delegate tasks while providing full visibility into expectations.",
    'activities.descriptions.t10': "Conduct surveys to gauge how transparent employees feel the workplace is.",
    
    // Inclusivity
    'activities.descriptions.i1': "Educate yourself on diversity, equity, and inclusion (DEI) topics through books, articles, or podcasts.",
    'activities.descriptions.i2': "Attend workshops or training sessions on unconscious bias and microaggressions.",
    'activities.descriptions.i3': "Reflect on your own biases and how they might influence your behavior.",
    'activities.descriptions.i4': "Encourage open discussions about inclusion and belonging.",
    'activities.descriptions.i5': "Establish anonymous feedback channels for employees to voice concerns.",
    'activities.descriptions.i6': "Host listening sessions to hear diverse perspectives and experiences.",
    'activities.descriptions.i7': "Review hiring practices to eliminate bias and ensure fairness.",
    'activities.descriptions.i8': "Offer mentorship programs that connect underrepresented employees with leaders.",
    'activities.descriptions.i9': "Pair employees from different departments or backgrounds for projects.",
    'activities.descriptions.i10': "Model inclusive behavior in every interaction."
  },
  fr: {
    // Humility
    'activities.descriptions.h1': "Écrivez trois choses pour lesquelles vous êtes reconnaissant envers votre équipe chaque jour.",
    'activities.descriptions.h2': "Réfléchissez sur une erreur récente et identifiez ce que vous en avez appris.",
    'activities.descriptions.h3': "Tenez un journal pour suivre les moments où vous vous êtes senti fier ou trop confiant—analysez pourquoi.",
    'activities.descriptions.h4': "Demandez-vous quotidiennement : \"Est-ce que j'écoute plus que je ne parle ?\"",
    'activities.descriptions.h5': "Identifiez un domaine où vous pouvez vous améliorer en tant que leader ou collègue.",
    'activities.descriptions.h6': "Concentrez-vous entièrement sur l'orateur pendant les conversations—pas de multitâche.",
    'activities.descriptions.h7': "Paraphrasez ce que quelqu'un dit avant de répondre pour assurer la compréhension.",
    'activities.descriptions.h8': "Évitez d'interrompre les autres pendant qu'ils partagent leurs idées.",
    'activities.descriptions.h9': "Posez des questions de clarification pour montrer un intérêt sincère.",
    'activities.descriptions.h10': "Reconnaissez publiquement la contribution d'un coéquipier lors d'une réunion.",
    
    // Empathy
    'activities.descriptions.e1': "Concentrez-vous entièrement sur l'orateur sans distractions.",
    'activities.descriptions.e2': "Évitez d'interrompre pendant que quelqu'un partage ses pensées.",
    'activities.descriptions.e3': "Paraphrasez ce que quelqu'un dit pour confirmer la compréhension.",
    'activities.descriptions.e4': "Posez des questions ouvertes comme \"Comment cela vous a-t-il fait ressentir ?\"",
    'activities.descriptions.e5': "Imaginez-vous dans la situation d'un collègue avant de réagir.",
    'activities.descriptions.e6': "Passez une journée à observer quelqu'un dans un rôle différent pour comprendre ses défis.",
    'activities.descriptions.e7': "Jouez des scénarios du point de vue d'un autre membre de l'équipe.",
    'activities.descriptions.e8': "Planifiez des rencontres individuelles régulières avec les membres de l'équipe.",
    'activities.descriptions.e9': "Partagez quelque chose de personnel (de manière appropriée) pour encourager la confiance mutuelle.",
    'activities.descriptions.e10': "Remarquez les changements dans l'humeur ou les niveaux d'énergie d'un collègue.",
    
    // Accountability
    'activities.descriptions.a1': "Définissez des objectifs spécifiques et mesurables pour vous-même et votre équipe.",
    'activities.descriptions.a2': "Décomposez les grands projets en tâches plus petites et réalisables avec des échéances.",
    'activities.descriptions.a3': "Communiquez clairement votre rôle et vos responsabilités aux autres.",
    'activities.descriptions.a4': "Admettez immédiatement les erreurs et prenez des mesures pour les corriger.",
    'activities.descriptions.a5': "Évitez de blâmer les autres quand les choses vont mal—concentrez-vous sur les solutions.",
    'activities.descriptions.a6': "Assumez les succès et les échecs comme partie de votre parcours.",
    'activities.descriptions.a7': "Tenez un journal quotidien ou hebdomadaire des tâches accomplies et des réalisations.",
    'activities.descriptions.a8': "Partagez les mises à jour avec votre équipe pour maintenir la transparence.",
    'activities.descriptions.a9': "Respectez ou dépassez constamment les attentes pour établir la crédibilité.",
    'activities.descriptions.a10': "Sollicitez régulièrement des commentaires de la part des pairs, managers et subordonnés.",
    
    // Resiliency
    'activities.descriptions.r1': "Recadrez les revers comme des opportunités d'apprendre et de grandir.",
    'activities.descriptions.r2': "Pratiquez la gratitude en écrivant trois choses positives chaque jour.",
    'activities.descriptions.r3': "Concentrez-vous sur ce que vous pouvez contrôler plutôt que de vous inquiéter des facteurs externes.",
    'activities.descriptions.r4': "Prenez de courtes pauses tout au long de la journée pour vous ressourcer.",
    'activities.descriptions.r5': "Pratiquez des exercices de respiration profonde pendant les moments stressants.",
    'activities.descriptions.r6': "Intégrez la pleine conscience ou la méditation dans votre routine quotidienne.",
    'activities.descriptions.r7': "Décomposez les problèmes accablants en étapes plus petites et gérables.",
    'activities.descriptions.r8': "Réfléchissez à plusieurs solutions avant de décider d'une seule.",
    'activities.descriptions.r9': "Étiquetez vos émotions (par exemple, \"Je me sens frustré\") pour mieux les traiter.",
    'activities.descriptions.r10': "Construisez des relations solides avec des collègues qui vous élèvent.",
    
    // Transparency
    'activities.descriptions.t1': "Partagez régulièrement les mises à jour avec votre équipe, même s'il n'y a pas de nouvelles majeures.",
    'activities.descriptions.t2': "Organisez des réunions hebdomadaires pour discuter des progrès, défis et objectifs.",
    'activities.descriptions.t3': "Utilisez un langage clair et simple au lieu de jargon ou de termes techniques.",
    'activities.descriptions.t4': "Créez un lecteur partagé ou une plateforme où tous les documents pertinents sont accessibles.",
    'activities.descriptions.t5': "Partagez ouvertement les succès et les revers avec votre équipe.",
    'activities.descriptions.t6': "Rendez les métriques de performance visibles pour promouvoir la responsabilité.",
    'activities.descriptions.t7': "Respectez constamment les promesses et engagements.",
    'activities.descriptions.t8': "Excusez-vous sincèrement si vous faites une erreur ou communiquez mal.",
    'activities.descriptions.t9': "Déléguez des tâches tout en fournissant une visibilité complète sur les attentes.",
    'activities.descriptions.t10': "Menez des sondages pour évaluer à quel point les employés trouvent le lieu de travail transparent.",
    
    // Inclusivity
    'activities.descriptions.i1': "Éduquez-vous sur les sujets de diversité, équité et inclusion (DEI) par le biais de livres, articles ou podcasts.",
    'activities.descriptions.i2': "Assistez à des ateliers ou sessions de formation sur les biais inconscients et les microagressions.",
    'activities.descriptions.i3': "Réfléchissez sur vos propres biais et comment ils peuvent influencer votre comportement.",
    'activities.descriptions.i4': "Encouragez des discussions ouvertes sur l'inclusion et l'appartenance.",
    'activities.descriptions.i5': "Établissez des canaux de rétroaction anonymes pour que les employés puissent exprimer leurs préoccupations.",
    'activities.descriptions.i6': "Organisez des sessions d'écoute pour entendre diverses perspectives et expériences.",
    'activities.descriptions.i7': "Révisez les pratiques d'embauche pour éliminer les biais et assurer l'équité.",
    'activities.descriptions.i8': "Offrez des programmes de mentorat qui connectent les employés sous-représentés avec les leaders.",
    'activities.descriptions.i9': "Jumelez des employés de différents départements ou origines pour des projets.",
    'activities.descriptions.i10': "Modélisez un comportement inclusif dans chaque interaction."
  },
  es: {
    // Humility
    'activities.descriptions.h1': "Escribe tres cosas por las que estás agradecido sobre tu equipo cada día.",
    'activities.descriptions.h2': "Reflexiona sobre un error reciente e identifica lo que aprendiste de él.",
    'activities.descriptions.h3': "Lleva un diario para rastrear momentos cuando te sentiste orgulloso o demasiado confiado—analiza por qué.",
    'activities.descriptions.h4': "Pregúntate diariamente: \"¿Estoy escuchando más de lo que hablo?\"",
    'activities.descriptions.h5': "Identifica un área donde puedes mejorar como líder o colega.",
    'activities.descriptions.h6': "Concéntrate completamente en el hablante durante las conversaciones—sin multitarea.",
    'activities.descriptions.h7': "Parafrasea lo que alguien dice antes de responder para asegurar comprensión.",
    'activities.descriptions.h8': "Evita interrumpir a otros mientras comparten sus ideas.",
    'activities.descriptions.h9': "Haz preguntas aclaratorias para mostrar interés genuino.",
    'activities.descriptions.h10': "Reconoce públicamente la contribución de un compañero de equipo en una reunión.",
    
    // Empathy
    'activities.descriptions.e1': "Concéntrate completamente en el hablante sin distracciones.",
    'activities.descriptions.e2': "Evita interrumpir mientras alguien comparte sus pensamientos.",
    'activities.descriptions.e3': "Parafrasea lo que alguien dice para confirmar comprensión.",
    'activities.descriptions.e4': "Haz preguntas abiertas como \"¿Cómo te hizo sentir eso?\"",
    'activities.descriptions.e5': "Imagínate en la situación de un compañero de trabajo antes de reaccionar.",
    'activities.descriptions.e6': "Pasa un día siguiendo a alguien en un rol diferente para entender sus desafíos.",
    'activities.descriptions.e7': "Representa escenarios desde el punto de vista de otro miembro del equipo.",
    'activities.descriptions.e8': "Programa reuniones individuales regulares con miembros del equipo.",
    'activities.descriptions.e9': "Comparte algo personal (apropiadamente) para fomentar confianza mutua.",
    'activities.descriptions.e10': "Nota cambios en el estado de ánimo o niveles de energía de un colega.",
    
    // Accountability
    'activities.descriptions.a1': "Define objetivos específicos y medibles para ti y tu equipo.",
    'activities.descriptions.a2': "Divide proyectos grandes en tareas más pequeñas y accionables con fechas límite.",
    'activities.descriptions.a3': "Comunica tu rol y responsabilidades claramente a otros.",
    'activities.descriptions.a4': "Admite errores inmediatamente y toma medidas para corregirlos.",
    'activities.descriptions.a5': "Evita culpar a otros cuando las cosas van mal—enfócate en soluciones.",
    'activities.descriptions.a6': "Aprópiate tanto de éxitos como de fracasos como parte de tu jornada.",
    'activities.descriptions.a7': "Lleva un registro diario o semanal de tareas completadas y logros.",
    'activities.descriptions.a8': "Comparte actualizaciones con tu equipo para mantener transparencia.",
    'activities.descriptions.a9': "Cumple o supera consistentemente las expectativas para construir credibilidad.",
    'activities.descriptions.a10': "Busca retroalimentación regularmente de compañeros, gerentes y subordinados.",
    
    // Resiliency
    'activities.descriptions.r1': "Reenfoca los contratiempos como oportunidades para aprender y crecer.",
    'activities.descriptions.r2': "Practica gratitud escribiendo tres cosas positivas cada día.",
    'activities.descriptions.r3': "Enfócate en lo que puedes controlar en lugar de preocuparte por factores externos.",
    'activities.descriptions.r4': "Toma descansos cortos durante el día para recargar energías.",
    'activities.descriptions.r5': "Practica ejercicios de respiración profunda durante momentos estresantes.",
    'activities.descriptions.r6': "Incorpora mindfulness o meditación en tu rutina diaria.",
    'activities.descriptions.r7': "Divide problemas abrumadores en pasos más pequeños y manejables.",
    'activities.descriptions.r8': "Piensa en múltiples soluciones antes de decidir una.",
    'activities.descriptions.r9': "Etiqueta tus emociones (ej., \"Me siento frustrado\") para procesarlas mejor.",
    'activities.descriptions.r10': "Construye relaciones sólidas con compañeros de trabajo que te eleven.",
    
    // Transparency
    'activities.descriptions.t1': "Comparte actualizaciones regularmente con tu equipo, incluso si no hay noticias importantes.",
    'activities.descriptions.t2': "Organiza reuniones semanales para discutir progreso, desafíos y objetivos.",
    'activities.descriptions.t3': "Usa lenguaje claro y simple en lugar de jerga o términos técnicos.",
    'activities.descriptions.t4': "Crea una unidad compartida o plataforma donde todos los documentos relevantes sean accesibles.",
    'activities.descriptions.t5': "Comparte tanto éxitos como contratiempos abiertamente con tu equipo.",
    'activities.descriptions.t6': "Haz visibles las métricas de rendimiento para promover responsabilidad.",
    'activities.descriptions.t7': "Cumple promesas y compromisos consistentemente.",
    'activities.descriptions.t8': "Discúlpate sinceramente si cometes un error o comunicas mal.",
    'activities.descriptions.t9': "Delega tareas mientras proporcionas visibilidad completa de las expectativas.",
    'activities.descriptions.t10': "Conduce encuestas para evaluar qué tan transparente sienten los empleados que es el lugar de trabajo.",
    
    // Inclusivity
    'activities.descriptions.i1': "Edúcate sobre temas de diversidad, equidad e inclusión (DEI) a través de libros, artículos o podcasts.",
    'activities.descriptions.i2': "Asiste a talleres o sesiones de entrenamiento sobre sesgo inconsciente y microagresiones.",
    'activities.descriptions.i3': "Reflexiona sobre tus propios sesgos y cómo pueden influir tu comportamiento.",
    'activities.descriptions.i4': "Fomenta discusiones abiertas sobre inclusión y pertenencia.",
    'activities.descriptions.i5': "Establece canales de retroalimentación anónimos para que los empleados expresen preocupaciones.",
    'activities.descriptions.i6': "Organiza sesiones de escucha para oír diversas perspectivas y experiencias.",
    'activities.descriptions.i7': "Revisa prácticas de contratación para eliminar sesgo y asegurar equidad.",
    'activities.descriptions.i8': "Ofrece programas de mentoría que conecten empleados subrepresentados con líderes.",
    'activities.descriptions.i9': "Empareja empleados de diferentes departamentos o antecedentes para proyectos.",
    'activities.descriptions.i10': "Modela comportamiento inclusivo en cada interacción."
  }
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
  
  // Activity descriptions special handling
  if (key.startsWith('activities.descriptions.')) {
    if (activityDescriptionsTranslations[language] && activityDescriptionsTranslations[language][key]) {
      return activityDescriptionsTranslations[language][key];
    }
    
    // If no direct translation found, return the fallback if provided, or the key
    return params?.fallback || key;
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
