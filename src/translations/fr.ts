import { report } from './fr/report';
import { activities } from './fr/activities';
import { dimensions } from './fr/dimensions';

export const fr = {
  common: {
    loading: "Chargement...",
    error: "Une erreur s'est produite",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    submit: "Soumettre",
    next: "Suivant",
    previous: "Précédent",
    back: "Retour",
    complete: "Terminer",
    copyright: "© PrismWork, Inc. Tous droits réservés.",
    share: "Partager"
  },
  header: {
    signIn: "Se connecter",
    signOut: "Se déconnecter",
    anonymous: "Mode anonyme",
    enableAnonymous: "Activer l'anonymat",
    account: "Compte"
  },
  assessment: {
    title: "Évaluation de Leadership HEARTI™",
    subtitle: "Mesurez votre croissance en Humility, Empathy, Accountability, Resiliency, Transparency, et Inclusivity",
    cloudStorage: "Stockage cloud",
    localStorage: "Stockage local",
    takeAssessment: "Faire l'évaluation",
    viewResults: "Voir les résultats",
    latestResults: "Derniers résultats d'évaluation",
    completed: "Évaluation terminée",
    submitSuccess: "Votre évaluation a été soumise avec succès.",
    instructions: "Répondez à chaque question en fonction de la fréquence à laquelle vous manifestez le comportement décrit",
    questionCount: "Question {{current}} sur {{total}}",
    of: "sur",
    reload: "Recharger la page",
    selected: "Sélectionné",
    scoreLabels: {
      "1": "Jamais",
      "2": "Rarement",
      "3": "Parfois",
      "4": "Souvent",
      "5": "Toujours"
    },
    questions: {
      // Humility
      "1": "Je reconnais quand je ne connais pas la réponse.",
      "2": "Je demande des retours.",
      "3": "Si les gens expriment des critiques, je mets en œuvre ce que j'apprends.",
      "4": "Je donne publiquement du crédit et amplifie publiquement le succès des autres.",
      "5": "S'associer avec d'autres est fondamental pour mon succès.",
      "6": "Je suis frustré(e) quand je ne reçois pas de reconnaissance.",
      "7": "On m'a dit que je suis un(e) microgestionnaire.",
      "8": "Je laisse mon équipe déterminer comment accomplir le travail.",
      "9": "J'écoute plus que je ne parle.",
      
      // Empathy
      "10": "Je cherche à comprendre les situations du point de vue d'une autre personne en posant des questions et en étant curieux(se).",
      "11": "Je tends la main et exprime mon soutien quand je vois que d'autres sont en difficulté.",
      "13": "Lorsque je prends une décision importante, je consulte délibérément ceux qui pensent différemment de moi.",
      "14": "Je peux reconnaître quand les autres sont en difficulté sans leur demander.",
      "15": "J'apprends des différentes opinions et points de vue des autres.",
      "16": "Je m'efforce de garder tout le monde heureux, parfois à l'excès.",
      "17": "Je comprends la meilleure façon de communiquer des retours à chaque membre de l'équipe.",
      "18": "Je privilégie la livraison de résultats même quand il y a un coût pour le bien-être de mon équipe.",
      "19": "Quand je parle avec quelqu'un, je pense souvent à ce que je vais dire ensuite.",
      
      // Accountability
      "20": "Je tiens les autres responsables de leurs comportements pour créer un lieu de travail d'appartenance.",
      "21": "J'assume la responsabilité de mes décisions et des conséquences des erreurs.",
      "22": "Mes collègues me font confiance pour accomplir le travail.",
      "23": "Je donne aux individus de mon équipe l'autorité de prendre des décisions critiques.",
      "24": "Je communique quand je ne peux pas respecter un délai.",
      "25": "Lorsque je prends des décisions, je préfère garder mes options ouvertes.",
      "26": "Je tiens les autres responsables de l'achèvement de leurs tâches avec précision et dans les délais.",
      "27": "Je tiens les autres responsables même si cela me met mal à l'aise.",
      "28": "Mon équipe me dit quand ils sont en retard sur les objectifs.",
      
      // Resiliency
      "29": "Les obstacles inattendus présentent des opportunités.",
      "30": "J'ai du mal à abandonner un objectif.",
      "31": "Quand j'échoue, je suis capable de m'adapter et d'essayer une approche alternative.",
      "32": "J'ai du mal à surmonter les erreurs que j'ai commises.",
      "33": "Je tire de la sagesse de mes échecs.",
      "34": "J'atteins mes objectifs.",
      "35": "J'ai une vision positive de la vie.",
      "36": "Je me tourne vers les autres pour obtenir du soutien quand je suis sous stress.",
      "37": "Je pratique l'autosoins pour éviter l'épuisement.",
      "38": "Mon équipe se sent épuisée.",
      
      // Transparency
      "39": "Je partage des informations qui permettent à mon équipe de faire leur travail plus efficacement.",
      "40": "J'évite les conversations difficiles.",
      "41": "Je suis à l'aise d'être vulnérable à propos de mes lacunes et défis.",
      "42": "J'explique mes décisions pour que les autres comprennent pourquoi.",
      "43": "Je crois que l'information ne devrait être partagée que sur la base du besoin de savoir.",
      "44": "Je m'assure que mes communications sont pertinentes et appropriées à chaque public.",
      "45": "Je suis prêt(e) à prendre position publiquement sur des questions controversées.",
      "46": "Je partage ma vision et mon objectif pour que les autres puissent mieux comprendre ce qui me motive.",
      "47": "Je priorise mon temps pour des conversations importantes.",
      "48": "Quand les nouvelles sont mauvaises, je n'essaie pas de masquer la vérité.",
      "49": "Les gens me disent que je suis facile à aborder.",
      
      // Inclusivity
      "50": "J'embauche, réfère et recommande des candidats BIPOC.",
      "51": "Je recherche et participe à des formations qui mentionnent les microagressions, l'antiracisme ou le privilège blanc.",
      "52": "Je fournis des retours correctifs aux personnes qui se comportent de manière sexiste, raciste ou homophobe.",
      "53": "Il y a des personnes de différentes générations qui sont mes confidents proches au travail.",
      "54": "Je trouve difficile de reconnaître ou de comprendre les problèmes liés à DEI.",
      "55": "La diversité et l'inclusion sont une distraction des problèmes commerciaux pressants.",
      "56": "J'initie des conversations sur des sujets difficiles de diversité et d'inclusion.",
      "57": "Je parraine activement des personnes de communautés sous-représentées.",
      "58": "Je demande aux collègues BIPOC et LGBTQ+ leur expérience dans notre environnement de travail.",
      "59": "Je collabore avec des talents divers pour assurer que nos programmes et politiques de travail soient inclusifs."
    }
  },
  tabs: {
    summary: "Résumé",
    dimensions: "Dimensions",
    dataViz: {
      desktop: "HEARTI Spectra",
      mobile: "Spectra"
    },
    report: "Rapport",
    developSkills: "HEARTI Coach",
    buildHabits: "Créer des habitudes",
  },
  results: {
    spectra: {
      title: "HEARTI Spectra",
      subtitle: "Vos scores de dimension de leadership",
    },
    lq: {
      title: "Résultats du Quotient HEARTI:Leader",
      subtitle: "Partagez vos résultats HEARTI:Leader avec d'autres ou enregistrez-les pour référence future."
    },
    comparison: {
      title: "Comparaison HEARTI",
      subtitle: "Comparez vos résultats avec des références mondiales",
      combined: "Combiné",
      separate: "Séparé",
      noComparison: "Sans comparaison",
      average: "Moyenne",
      progress: "Progression HEARTI au fil du temps",
      progressSubtitle: "Suivez votre parcours de développement du leadership",
      noProgressData: "Complétez plus d'évaluations pour voir votre progression au fil du temps."
    },
    development: {
      title: "Activités de développement",
      subtitle: "Activités personnalisées pour développer vos compétences en leadership",
      focused: "Ciblé",
      complete: "Complet",
      addToHabitTracker: "Ajouter au suivi",
      selectFrequency: "Sélectionner la fréquence:"
    },
    dimensions: {
      humility: {
        status: {
          strength: '<p class="mb-4"><strong>Félicitations !</strong> {{userName}}, votre force HEARTI:Leader est l\'Humilité. Vous êtes conscient de vos faiblesses, désireux de vous améliorer, vous appréciez les forces des autres et vous êtes concentré sur des objectifs au-delà de votre propre intérêt.</p>',
          vulnerability: '<p class="mb-4">{{userName}}, un domaine de croissance pour vous est l\'Humilité. Les leaders humbles sont conscients de leurs faiblesses, désireux de s\'améliorer, apprécient les forces des autres et se concentrent sur des objectifs au-delà de leur propre intérêt.</p>',
          neutral: '<p class="mb-4">Les leaders humbles sont conscients de leurs faiblesses, désireux de s\'améliorer, apprécient les forces des autres et se concentrent sur des objectifs au-delà de leur propre intérêt.</p>'
        },
        description: '<p class="mb-4">Les leaders humbles sont conscients de leurs faiblesses, désireux de s\'améliorer, apprécient les forces des autres et se concentrent sur des objectifs au-delà de leur propre intérêt.</p><p class="mb-4">Quand il s\'agit de diriger dans le nouveau monde du travail, être humble signifie être à l\'aise avec le fait que vous n\'avez pas toutes les réponses, mais que vous possédez le courage d\'apprendre. Cette capacité est vitale pour travailler sur les questions de diversité, d\'inclusion, d\'équité et d\'appartenance. La clé ici est de commencer par savoir où vous êtes (et où vous n\'êtes pas... encore).</p><p class="mb-4"><strong>4 Éléments Essentiels pour Être un Leader Humble :</strong></p><ul class="list-disc pl-5 mb-4"><li>Avoir conscience de ses limitations</li><li>Comprendre que le succès de vos équipes ou employés améliore votre succès</li><li>Opérer avec un état d\'esprit de service</li><li>Être animé par un objectif supérieur</li></ul>',
        levels: '<p class="mb-2"><strong>Meilleur niveau :</strong> Les leaders humbles se concentrent sur les besoins de toutes les parties prenantes, se demandant "Qu\'ai-je fait pour les autres ?"</p><p class="mb-2"><strong>En évolution :</strong> Les individus qui développent leur leadership humble priorisent les besoins de l\'entreprise mais peuvent ne pas comprendre le lien avec les parties prenantes. Ils peuvent se demander "Qu\'ai-je fait pour l\'organisation ?"</p><p class="mb-2"><strong>Non prêt :</strong> Les leaders qui ne sont pas prêts en humilité sont centrés sur eux-mêmes et leur carrière personnelle, se demandant "Qu\'ai-je fait pour moi ?"</p>',
        tips: '<p class="mb-2">Être un leader humble nécessite de surmonter une croyance en la rareté et de la remplacer par un état d\'esprit de croissance. Pour vous familiariser avec l\'état d\'esprit de croissance, lisez le livre de la professeure de Stanford Carol Dweck, Mindset : La Nouvelle Psychologie du Succès, ou regardez son TEDTalk.</p><p class="mb-2">Mettez le travail de Dweck en pratique en ajoutant le mot "encore" à chaque déclaration négative. Par exemple :</p><ul class="list-disc pl-5 mb-2"><li>"Je ne suis pas bon avec PowerPoint... encore."</li><li>"Je ne suis pas bon en prise de parole en public... encore."</li><li>"Je ne suis pas bon pour demander de l\'aide... encore."</li></ul><p class="mb-2">Si vous luttez avec le micro-management et le perfectionnisme, engagez vos collègues et/ou votre manager pour vous aider à identifier quand vous êtes trop perfectionniste. Développez un mot de code ou un moyen de reconnaître légèrement ces comportements pour mieux reconnaître les modèles et collaborer pour les changer.</p><p>Clarifiez votre "pourquoi" au travail et dans la vie—avoir un objectif supérieur et donner à votre équipe des insights sur votre "pourquoi" peut les enrôler comme alliés dans votre objectif. Comprenez aussi leur "pourquoi".</p>'
      },
      empathy: {
        status: {
          strength: '<p class="mb-4"><strong>Félicitations !</strong> {{userName}}, votre force HEARTI:Leader est l\'Empathie. Vous pouvez comprendre efficacement les sentiments, besoins et motivations des autres.</p>',
          vulnerability: '<p class="mb-4">{{userName}}, un domaine de croissance pour vous est l\'Empathie. Les leaders empathiques peuvent comprendre efficacement les sentiments, besoins et motivations des autres.</p>',
          neutral: '<p class="mb-4">Les leaders empathiques peuvent comprendre efficacement les sentiments, besoins et motivations des autres.</p>'
        },
        description: '<p class="mb-4">Les leaders empathiques sont capables de comprendre les sentiments, besoins et motivations des autres. Basés sur la curiosité et l\'apprentissage, vous avez aussi tendance à être doué pour l\'écoute active et aimez aider les autres à grandir et se développer.</p><p class="mb-4">Au cœur de l\'empathie se trouve la compréhension véritable des besoins d\'autrui. Comprendre vos propres besoins et sentiments est un préalable nécessaire pour comprendre les autres. Il existe trois types d\'empathie : l\'empathie cognitive, l\'empathie émotionnelle et l\'empathie compassionnelle. Comprendre ces types peut vous aider à développer vos compétences en tant que leader empathique.</p><ul class="list-disc pl-5 mb-4"><li><strong>Empathie cognitive :</strong> Être capable de voir les perspectives des autres en comprenant leurs besoins émotionnels</li><li><strong>Empathie émotionnelle :</strong> Être capable de ressentir ce que les autres ressentent</li><li><strong>Empathie compassionnelle :</strong> Être capable de reconnaître la douleur des autres à travers des limites saines et les soutenir par l\'alliance</li></ul><p class="mb-4">L\'empathie concerne aussi la capacité du leader à établir et maintenir efficacement une relation avec les autres. En utilisant l\'empathie compassionnelle, les leaders aident les autres à prendre des mesures pour avancer sans être consumés par les émotions des autres ou prendre des actions de "sauvetage" inappropriées.</p>',
        levels: '<p class="mb-2"><strong>Meilleur niveau :</strong> Les leaders empathiques de haut niveau prennent la responsabilité de se connecter efficacement avec les autres. Ils comprennent leurs propres émotions et sont capables de communiquer avec les autres sur un plan émotionnel. Ils utilisent des outils de mesure pour obtenir des retours afin de mieux comprendre leur capacité à écouter et développer leurs suiveurs.</p><p class="mb-2"><strong>En évolution :</strong> Les individus qui développent l\'empathie reconnaissent sa valeur mais peuvent ne pas vraiment comprendre comment se connecter authentiquement avec les autres—parfois, ils exhibent des comportements de sauvetage. Ils sont peu susceptibles de chercher des retours ou d\'adopter des mesures de performance.</p><p class="mb-2"><strong>Non prêt :</strong> Les leaders qui ne sont pas prêts en empathie ne reconnaissent pas la valeur des comportements empathiques.</p>',
        tips: '<p class="mb-2">L\'expert en leadership Andrew Sobel liste huit façons d\'augmenter l\'empathie. Voici quelques-unes que vous pouvez essayer cette semaine :</p><p class="mb-2"><strong>Défiez-vous.</strong> Vivez des expériences qui vous poussent hors de votre zone de confort. Apprenez de nouvelles compétences comme jouer d\'un instrument ou pratiquer une langue étrangère. Développez de nouvelles capacités professionnelles. Faire ces choses vous rend humble, et l\'humilité est un véritable moteur d\'empathie.</p><p class="mb-2"><strong>Cherchez des retours.</strong> Demandez à votre famille, amis et collègues des retours sur vos compétences relationnelles (comme l\'écoute), puis vérifiez régulièrement avec eux sur vos progrès.</p><p class="mb-2"><strong>Cultivez votre curiosité.</strong> Que pouvez-vous apprendre d\'un collègue très junior "inexpérimenté" ? Que pouvez-vous apprendre d\'un client que vous considérez "étroit" ? Les personnes curieuses posent beaucoup de questions, leur donnant une compréhension différente de ceux qui les entourent.</p><p class="mb-2"><strong>Posez de meilleures questions.</strong> Dans chaque conversation avec un client ou collègue, préparez-vous avec trois ou quatre questions réfléchies, voire provocatrices. Les questions qui commencent par "quoi" ou "comment" ne peuvent généralement pas être répondues par oui ou non. Elles sont plus susceptibles de susciter plus d\'informations. N\'oubliez pas d\'être un auditeur actif et de faire une pause pour vraiment "entendre" ce qui est dit.</p>'
      },
      accountability: {
        status: {
          strength: '<p class="mb-4"><strong>Félicitations !</strong> {{userName}}, votre force HEARTI:Leader est la Responsabilité. Vous osez prendre des décisions impopulaires et assumez la responsabilité des actions et résultats.</p>',
          vulnerability: '<p class="mb-4">{{userName}}, un domaine de croissance pour vous est la Responsabilité. Les leaders responsables osent prendre des décisions impopulaires et assument la responsabilité des actions et résultats.</p>',
          neutral: '<p class="mb-4">Les leaders responsables osent prendre des décisions impopulaires et assument la responsabilité des actions et résultats.</p>'
        },
        description: '<p class="mb-4">Les leaders responsables osent prendre des décisions impopulaires et sont prêts à être responsables de leurs propres actions et décisions ainsi que celles des autres. Ils communiquent ce qu\'ils vont faire, travaillent avec les autres pour obtenir du soutien, et livrent comme promis. Ils opèrent généralement selon le principe de "l\'intention du commandant"—ce qui signifie simplement qu\'ils fixent des objectifs clairs et restent flexibles sur le chemin.</p><p class="mb-4">Les leaders responsables réussissent parce qu\'ils construisent la confiance avec les parties prenantes, y compris les employés, collègues, clients et communautés.</p>',
        levels: '<p class="mb-2"><strong>Meilleur niveau :</strong> Les leaders responsables de haut niveau utilisent des outils comme la planification stratégique et les objectifs en cascade pour définir les responsabilités individuelles et d\'équipe. Ils font aussi régulièrement le point avec leurs suiveurs.</p><p class="mb-2"><strong>En évolution :</strong> Les individus qui développent le leadership responsable peuvent travailler avec des individus et équipes pour définir clairement les rôles et objectifs organisationnels mais peuvent être incohérents dans la responsabilisation des individus et/ou équipes.</p><p class="mb-2"><strong>Non prêt :</strong> Les leaders qui ne sont pas prêts en responsabilité se concentrent sur l\'individu. Ils peuvent manquer de compréhension des interdépendances inter-équipes, avoir des objectifs et mesures peu clairs, et prendre des décisions incohérentes.</p>',
        tips: '<p class="mb-2">Construisez la confiance par la fiabilité, la responsabilité, l\'intégrité et la générosité. Commencez à mesurer ce qui compte et créez des plans de gouvernance qui abordent à la fois les priorités directes et la culture inclusive.</p><p class="mb-2">Pratiquez une communication claire en fixant des attentes dès le départ, en respectant vos engagements, et en abordant rapidement les problèmes quand ils surviennent.</p><p class="mb-2">Développez des systèmes pour suivre les progrès et tenir des points réguliers avec votre équipe pour assurer la responsabilité à tous les niveaux.</p>'
      },
      resiliency: {
        status: {
          strength: '<p class="mb-4"><strong>Félicitations !</strong> {{userName}}, votre force HEARTI:Leader est la Résilience. Vous persistez à travers les défis avec flexibilité et inspirez les autres à continuer vers des objectifs partagés.</p>',
          vulnerability: '<p class="mb-4">{{userName}}, un domaine de croissance pour vous est la Résilience. Les leaders résilients persistent à travers les défis avec flexibilité et inspirent les autres à continuer vers des objectifs partagés.</p>',
          neutral: '<p class="mb-4">Les leaders résilients persistent à travers les défis avec flexibilité et inspirent les autres à continuer vers des objectifs partagés.</p>'
        },
        description: '<p class="mb-4">Les leaders résilients sont capables de persister à travers les défis avec flexibilité. Ils inspirent les autres à continuer vers des objectifs partagés et peuvent dépasser la concurrence grâce à des réponses stratégiques et flexibles aux défis.</p><p class="mb-4">La résilience ne consiste pas à être dur ou à persévérer à tout prix. Il s\'agit de s\'adapter au changement, d\'apprendre des revers, et de maintenir l\'optimisme face à l\'adversité tout en soutenant votre équipe à travers les difficultés.</p>',
        levels: '<p class="mb-2"><strong>Meilleur niveau :</strong> Les leaders résilients de haut niveau cultivent et valorisent la résilience chez leurs suiveurs et équipes. Ils créent une sécurité psychologique et encouragent l\'apprentissage des échecs.</p><p class="mb-2"><strong>En évolution :</strong> Les individus qui développent le leadership résilient reconnaissent le besoin de résilience mais peuvent ne pas avoir de mesures de performance et de processus pour capturer l\'apprentissage des revers.</p><p class="mb-2"><strong>Non prêt :</strong> Les leaders qui ne sont pas prêts en résilience peuvent punir les individus pour les défaillances d\'équipe et manquer de processus pour capturer l\'apprentissage des échecs.</p>',
        tips: '<p class="mb-2">Pratiquez la pleine conscience à travers le journal, le yoga, et les pratiques spirituelles pour construire la résilience émotionnelle et la conscience de soi.</p><p class="mb-2">Prenez de petits risques et essayez de nouvelles choses mensuellement pour construire votre confort avec l\'incertitude et le changement.</p><p class="mb-2">Reconnaissez ouvertement les défis et divisez-les en objectifs plus petits et gérables que votre équipe peut atteindre étape par étape.</p><p class="mb-2">Créez des processus pour apprendre des échecs et célébrer les leçons apprises plutôt que seulement les succès.</p>'
      },
      transparency: {
        status: {
          strength: '<p class="mb-4"><strong>Félicitations !</strong> {{userName}}, votre force HEARTI:Leader est la Transparence. Vous comprenez que partager l\'information est critique pour le succès individuel et d\'équipe.</p>',
          vulnerability: '<p class="mb-4">{{userName}}, un domaine de croissance pour vous est la Transparence. Les leaders transparents comprennent que partager l\'information est critique pour le succès individuel et d\'équipe.</p>',
          neutral: '<p class="mb-4">Les leaders transparents comprennent que partager l\'information est critique pour le succès individuel et d\'équipe.</p>'
        },
        description: '<p class="mb-4">Les leaders transparents comprennent que partager l\'information est critique pour le succès individuel et d\'équipe. Ils créent des environnements où la communication ouverte est valorisée et où les gens se sentent en sécurité pour partager leurs pensées, préoccupations et idées.</p><p class="mb-4">La transparence construit la confiance, améliore la prise de décision, et crée l\'alignement à travers l\'organisation. Elle implique d\'être honnête sur les défis, de partager le contexte des décisions, et d\'admettre quand vous n\'avez pas toutes les réponses.</p>',
        levels: '<p class="mb-2"><strong>Meilleur niveau :</strong> Les leaders transparents de haut niveau partagent proactivement l\'information, créent plusieurs canaux de communication, et cherchent régulièrement des retours de leurs équipes.</p><p class="mb-2"><strong>En évolution :</strong> Les individus qui développent le leadership transparent partagent l\'information quand on le leur demande mais peuvent ne pas communiquer proactivement ou créer des systèmes pour une transparence continue.</p><p class="mb-2"><strong>Non prêt :</strong> Les leaders qui ne sont pas prêts en transparence peuvent accumuler l\'information, communiquer de manière incohérente, ou éviter les conversations difficiles.</p>',
        tips: '<p class="mb-2">Pratiquez l\'honnêteté radicale en partageant à la fois les bonnes nouvelles et les défis avec votre équipe, en fournissant le contexte de vos décisions.</p><p class="mb-2">Créez des rythmes de communication réguliers comme des assemblées générales, des mises à jour d\'équipe, et des réunions individuelles pour assurer que l\'information circule librement.</p><p class="mb-2">Demandez régulièrement des retours et agissez visiblement dessus pour montrer que la transparence est bidirectionnelle.</p><p class="mb-2">Quand vous faites des erreurs, assumez-les rapidement et partagez ce que vous avez appris pour modeler la vulnérabilité et l\'amélioration continue.</p>'
      },
      inclusivity: {
        status: {
          strength: '<p class="mb-4"><strong>Félicitations !</strong> {{userName}}, votre force HEARTI:Leader est l\'Inclusivité. Vous travaillez activement pour vous assurer que toutes les voix sont entendues et valorisées dans votre organisation.</p>',
          vulnerability: '<p class="mb-4">{{userName}}, un domaine de croissance pour vous est l\'Inclusivité. Les leaders inclusifs travaillent activement pour s\'assurer que toutes les voix sont entendues et valorisées dans leur organisation.</p>',
          neutral: '<p class="mb-4">Les leaders inclusifs travaillent activement pour s\'assurer que toutes les voix sont entendues et valorisées dans leur organisation.</p>'
        },
        description: '<p class="mb-4">Les leaders inclusifs travaillent activement pour s\'assurer que toutes les voix sont entendues et valorisées dans leur organisation. Ils reconnaissent et exploitent les perspectives, expériences et talents divers de leurs membres d\'équipe pour stimuler l\'innovation et de meilleurs résultats.</p><p class="mb-4">L\'inclusivité va au-delà de la diversité—il s\'agit de créer un environnement où chacun se sent appartenir, peut contribuer authentiquement, et a des opportunités égales de réussir et grandir.</p>',
        levels: '<p class="mb-2"><strong>Meilleur niveau :</strong> Les leaders inclusifs de haut niveau examinent systématiquement leurs processus et décisions pour les biais, cherchent activement des perspectives diverses, et mesurent les résultats d\'inclusion.</p><p class="mb-2"><strong>En évolution :</strong> Les individus qui développent le leadership inclusif reconnaissent son importance mais peuvent ne pas avoir d\'approches systématiques pour assurer l\'inclusivité dans leurs pratiques quotidiennes.</p><p class="mb-2"><strong>Non prêt :</strong> Les leaders qui ne sont pas prêts en inclusivité peuvent inconsciemment favoriser des perspectives similaires, négliger des voix diverses, ou traiter l\'inclusion comme une priorité secondaire.</p>',
        tips: '<p class="mb-2">Examinez régulièrement vos propres biais et suppositions, et cherchez à comprendre des perspectives différentes des vôtres.</p><p class="mb-2">Assurez-vous activement que toutes les voix sont entendues en réunion en demandant directement des contributions aux membres d\'équipe plus silencieux et en créant des espaces sûrs pour les opinions dissidentes.</p><p class="mb-2">Révisez vos décisions d\'embauche, promotion et développement pour les biais potentiels, et implémentez des approches systématiques pour assurer l\'équité.</p><p class="mb-2">Célébrez et apprenez des origines, expériences et perspectives diverses de votre équipe, montrant un intérêt véritable pour ce qui rend chaque personne unique.</p>'
      }
    },
    habits: {
      title: "Vos Habitudes",
      addHabit: "Ajouter une habitude",
      add: "Ajouter",
      cancel: "Annuler",
      markComplete: "Marquer comme terminé",
      complete: "Terminer",
      completedToday: "Terminé aujourd'hui",
      skipToday: "Sauter aujourd'hui",
      streak: "Série actuelle: {{count}} jour",
      streaks: "Série actuelle: {{count}} jours",
      daily: "QUOTIDIEN",
      weekly: "HEBDOMADAIRE",
      monthly: "MENSUEL",
      noHabits: "Aucune habitude trouvée. Cliquez sur \"Ajouter une habitude\" pour en créer une.",
    },
  },
};
