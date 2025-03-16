
export const zh = {
  common: {
    loading: "加载中...",
    error: "发生错误",
    save: "保存",
    cancel: "取消",
    delete: "删除",
    edit: "编辑",
    submit: "提交",
    next: "下一步",
    previous: "上一步",
    back: "返回",
    complete: "完成",
    copyright: "© PrismWork, Inc. 版权所有。",
    share: "分享"
  },
  header: {
    signIn: "登录",
    signOut: "退出",
    anonymous: "匿名模式",
    enableAnonymous: "启用匿名",
    account: "账户"
  },
  auth: {
    welcome: "欢迎来到 HEARTI",
    welcomeDescription: "登录管理您的评估或创建新账户。",
    orContinueWithEmail: "或使用电子邮件继续",
    signIn: "登录",
    signUp: "注册",
    email: "电子邮件",
    emailPlaceholder: "your.email@example.com",
    password: "密码",
    confirmPassword: "确认密码",
    fullName: "全名",
    fullNamePlaceholder: "张三",
    organizationName: "组织",
    createAccount: "创建账户",
    creatingAccount: "创建账户中...",
    passwordsDoNotMatch: "密码不匹配",
    passwordTooShort: "密码长度必须至少为8个字符",
    enterEmailFirst: "请先输入您的电子邮件地址",
    magicLinkSent: "魔法链接已发送！请检查您的电子邮件",
    magicLinkFailed: "发送魔法链接失败。请重试",
    passwordResetSent: "密码重置邮件已发送！请检查您的电子邮件",
    passwordResetFailed: "发送重置邮件失败。请重试",
    forgotPassword: "忘记密码？",
    signInWithMagicLink: "使用魔法链接登录",
    marketingConsent: "将我添加到产品更新和营销信息的邮件列表中。您的个人信息不会被共享。",
    termsAgreement: "继续使用，即表示您同意 PrismWork, Inc. 的",
    termsOfService: "服务条款",
    and: "和",
    privacyPolicy: "隐私政策"
  },
  assessment: {
    title: "HEARTI™ 领导力评估",
    subtitle: "衡量您在Humility、Empathy、Accountability、Resiliency、Transparency和Inclusivity方面的成长",
    cloudStorage: "云存储",
    localStorage: "本地存储",
    instructions: "请回答以下问题以评估您的领导能力",
    reload: "重新加载",
    completed: "评估完成",
    submitSuccess: "您的评估已成功提交",
    of: "共",
    selected: "已选择",
    questionCount: "问题 {{current}}/{{total}}",
    takeAssessment: "参加评估",
    viewResults: "查看结果",
    latestResults: "最新结果",
    scoreLabels: {
      "1": "几乎从不",
      "2": "很少",
      "3": "有时",
      "4": "经常",
      "5": "几乎总是"
    },
    questions: {
      // Humility
      "1": "当我不知道答案时，我会承认。",
      "2": "我会寻求反馈。",
      "3": "如果他人表达批评，我会采纳所学到的东西。",
      "4": "我会公开表扬并宣扬他人的成功。",
      "5": "与他人合作是我成功的基础。",
      "6": "当得不到认可时，我会感到沮丧。",
      "7": "我被说过是一个微观管理者。",
      "8": "我让团队自己找出完成工作的方法。",
      "9": "我听的比说的多。",
      
      // Empathy
      "10": "我通过提问和保持好奇来试图从他人的角度理解情况。",
      "11": "当我看到他人在挣扎时，我会主动表达我的支持。",
      "13": "在做重要决定时，我会特意咨询与我想法不同的人。",
      "14": "我能察觉到他人的困扰，即使不用问他们。",
      "15": "我从他人不同的观点和意见中学习。",
      "16": "我努力让每个人都开心，有时甚至过分如此。",
      "17": "我理解给每个团队成员反馈的最佳方式。",
      "18": "即使会影响团队的健康，我也会优先考虑完成结果。",
      "19": "当我与人交谈时，我经常想着接下来要说什么。",
      
      // Accountability
      "20": "我让他人对其行为负责，以创造一个包容的工作场所。",
      "21": "我对自己的决定和错误的后果负责。",
      "22": "我的同事信任我能完成工作。",
      "23": "我给予团队成员做出关键决定的权力。",
      "24": "当我无法按时完成时，我会沟通。",
      "25": "在做决定时，我倾向于保持选项开放。",
      "26": "我让他人对准确和按时完成任务负责。",
      "27": "即使让我感到不舒服，我也会让他人负起责任。",
      "28": "我的团队会告诉我他们在目标完成方面落后了。",
      
      // Resiliency
      "29": "意外的障碍代表着机会。",
      "30": "我很难放弃一个目标。",
      "31": "当我失败时，我能够适应并尝试另一种方法。",
      "32": "我难以释怀自己犯的错误。",
      "33": "我从失败中获得智慧。",
      "34": "我实现我的目标。",
      "35": "我对生活持积极态度。",
      "36": "当我承受压力时，我会寻求他人的支持。",
      "37": "我通过自我照顾来避免倦怠。",
      "38": "我的团队感到倦怠。",
      
      // Transparency
      "39": "我分享信息以让团队更有效地完成工作。",
      "40": "我回避困难的对话。",
      "41": "我能自在地展示自己的不足和挑战。",
      "42": "我解释我的决定，让他人理解原因。",
      "43": "我认为信息应该只在需要知道的基础上分享。",
      "44": "我确保我的沟通对每个受众都是相关和适当的。",
      "45": "我愿意对有争议的问题公开表态。",
      "46": "我分享我的愿景和目标，让他人更好地理解我的动机。",
      "47": "我优先安排时间进行重要对话。",
      "48": "当有坏消息时，我不会试图粉饰真相。",
      "49": "人们说我很容易交谈。",
      
      // Inclusivity
      "50": "我雇用、推荐和引荐BIPOC候选人。",
      "51": "我寻求并参与提到微歧视、反种族主义或白人特权的培训。",
      "52": "我对表现出性别歧视、种族主义或恐同行为的人提供纠正性反馈。",
      "53": "在工作中，有来自不同世代的人是我的密友。",
      "54": "我觉得很难认识或理解DEI（多样性、公平性和包容性）的问题。",
      "55": "多样性和包容性是对紧迫业务问题的分散注意力。",
      "56": "我发起关于具有挑战性的多样性和包容性话题的对话。",
      "57": "我积极赞助来自代表性不足社区的人。",
      "58": "我询问BIPOC和LGBTQ+同事在我们工作环境中的经历。",
      "59": "我与不同背景的人才合作，确保我们的工作场所计划和政策具有包容性。"
    }
  },
  tabs: {
    summary: "摘要",
    dimensions: "维度",
    dataViz: {
      desktop: "HEARTI 光谱",
      mobile: "光谱"
    },
    report: "报告",
    developSkills: "发展技能",
    buildHabits: "养成习惯",
  },
  results: {
    spectra: {
      title: "HEARTI 光谱",
      subtitle: "您的领导力维度分数",
    },
    lq: {
      title: "HEARTI:Leader 商数结果",
      subtitle: "与他人分享您的 HEARTI:Leader 结果或保存供将来参考。"
    },
    comparison: {
      title: "HEARTI 比较",
      subtitle: "将您的结果与全球基准进行比较",
      combined: "合并",
      separate: "分开",
      noComparison: "无比较",
      average: "平均",
      progress: "HEARTI 随时间的进展",
      progressSubtitle: "跟踪您的领导力发展之旅",
      noProgressData: "完成更多评估以查看您随时间的进展。",
      yourHEARTI: "你的 HEARTI",
      score: "分数",
      strength: "优势",
      vulnerability: "需发展",
      competent: "胜任",
      averageLabel: "平均",
      selectOption: "选择比较选项以查看数据",
      useControls: "使用上方的比较控制查看您的 HEARTI 数据"
    },
    dimensions: {
      humility: "Humility",
      empathy: "Empathy",
      accountability: "Accountability",
      resiliency: "Resiliency",
      transparency: "Transparency",
      inclusivity: "Inclusivity",
      scoreLabel: "分数",
      levelsOf: "水平",
      developmentTips: "发展提示",
      tipsForIncreasing: "提升以下方面的提示",
      leadership: "领导力"
    },
    development: {
      title: "发展活动",
      subtitle: "个性化活动以提升您的领导能力",
      focused: "专注",
      complete: "完整",
      chooseActivitiesFor: "为以下选择活动",
      activitiesDescription: "这些活动旨在帮助您发展您的{{dimension}}领导维度。选择最多3个活动来关注。",
      maxActivities: "已选择最大数量的活动",
      maxActivitiesDescription: "您最多只能选择3个活动。请在添加新活动前移除一个。",
      activityAdded: "活动已添加",
      activityAddedDescription: "活动已添加到您的{{frequency}}习惯跟踪器",
      addToHabitTracker: "添加到习惯跟踪器",
      mySavedActivities: "我的保存活动",
      noActivitiesSaved: "未找到已保存的活动。请在发展选项卡中选择一些活动。",
      tooManySaved: "已保存过多活动",
      removeBeforeSaving: "在保存新活动前请移除一些活动"
    },
    habits: {
      title: "您的习惯",
      addHabit: "添加习惯",
      add: "添加",
      cancel: "取消",
      markComplete: "标记为完成",
      complete: "完成",
      completedToday: "今日已完成",
      skipToday: "今日跳过",
      streak: "当前连续: {{count}} 天",
      streaks: "当前连续: {{count}} 天",
      daily: "每日",
      weekly: "每周",
      monthly: "每月",
      noHabits: "未找到习惯。点击\"添加习惯\"创建一个。"
    },
    report: {
      description: "帮助您发展领导能力的见解和建议",
      title: "领导力报告",
      introduction: "亲爱的21世纪领导者",
      startYourJourney: "开始您的领导力之旅",
      shareFeedback: "分享反馈"
    }
  },
  dimensions: {
    descriptions: {
      humility: "谦逊是承认自己不完美，寻求他人帮助和意见的能力。",
      empathy: "同理心是理解他人感受并从他们的角度看问题的能力。",
      accountability: "责任感是对自己的行动和决定负责的能力。",
      resiliency: "韧性是面对挑战和挫折时保持前进的能力。",
      transparency: "透明度是清晰地沟通，支持开放对话的能力。",
      inclusivity: "包容性是重视差异，创造归属感的能力。"
    },
    feedback: {
      humility: {
        excellent: "您在谦逊方面表现出色。您愿意寻求反馈，承认错误，认可他人贡献。",
        good: "您在谦逊方面表现良好。继续培养您的自我意识和对他人的开放性。",
        average: "您对谦逊的重要性有一定认识。尝试更多地寻求反馈，降低防御性。",
        needsImprovement: "您需要更加关注谦逊。尝试承认自己的局限性，向他人学习。"
      },
      empathy: {
        excellent: "您在同理心方面表现出色。您能理解他人的感受，消除分歧。",
        good: "您在同理心方面表现良好。继续练习积极倾听，理解他人观点。",
        average: "您对同理心有一定理解。尝试更加关注他人的情感需求。",
        needsImprovement: "您需要更加关注同理心。尝试花时间真正理解他人的感受和观点。"
      },
      accountability: {
        excellent: "您在责任感方面表现出色。您始终对自己的行动负责并履行承诺。",
        good: "您在责任感方面表现良好。继续完善您设定目标和跟踪进度的能力。",
        average: "您对责任感有一定理解。尝试更加明确您的角色和期望。",
        needsImprovement: "您需要更加关注责任感。尝试设定明确的目标，并坚持完成承诺。"
      },
      resiliency: {
        excellent: "您在韧性方面表现出色。您能有效管理压力，从挫折中恢复。",
        good: "您在韧性方面表现良好。继续培养您的适应能力和自我照顾习惯。",
        average: "您对韧性有一定理解。尝试培养更积极的心态，面对挑战。",
        needsImprovement: "您需要更加关注韧性。尝试培养自我照顾习惯，寻求支持系统。"
      },
      transparency: {
        excellent: "您在透明度方面表现出色。您以清晰、开放的方式沟通，建立信任。",
        good: "您在透明度方面表现良好。继续培养坦诚对话和信息共享的能力。",
        average: "您对透明度有一定理解。尝试更加主动地分享信息和理由。",
        needsImprovement: "您需要更加关注透明度。尝试更开放地沟通，即使在困难情况下也是如此。"
      },
      inclusivity: {
        excellent: "您在包容性方面表现出色。您重视多样性，创造包容的环境。",
        good: "您在包容性方面表现良好。继续培养您包容不同背景和观点的能力。",
        average: "您对包容性有一定理解。尝试更加关注代表性不足的声音。",
        needsImprovement: "您需要更加关注包容性。尝试了解多样性的价值，挑战自己的假设。"
      }
    }
  },
  activities: {
    categories: {
      activelistening: "主动倾听",
      selfreflectionawareness: "自我反思与意识",
      acknowledgingothers: "认可他人",
      perspectivetaking: "换位思考",
      buildingconnections: "建立联系",
      emotionalawareness: "情感意识",
      settingclearexpectations: "设定明确期望",
      takingownership: "承担责任",
      trackingprogress: "跟踪进度",
      buildingtrust: "建立信任",
      continuousimprovement: "持续改进",
      mindsetshifts: "思维转变",
      stressmanagement: "压力管理",
      problemsolvingskills: "解决问题能力",
      emotionalregulation: "情绪调节",
      supportsystemscommunity: "支持系统与社区",
      opencommunication: "开放交流",
      sharinginformation: "分享信息",
      empoweringothers: "授权他人",
      buildingawareness: "建立意识",
      creatingsafespaces: "创造安全空间",
      promotingequity: "促进公平",
      fosteringcollaboration: "促进协作",
      leadingbyexample: "以身作则"
    },
    descriptions: {
      // Humility Activities
      h1: "每天写下三件你感谢你的团队的事情。",
      h2: "反思最近的一个错误，确定你从中学到了什么。",
      h3: "保持日记，记录那些让你感到自豪或过于自信的时刻—分析原因。",
      h4: "每天问自己："我听的比说的多吗？"",
      h5: "确定一个你可以作为领导者或同事提高的领域。",
      h6: "在对话中完全专注于说话者—不要多任务处理。",
      h7: "在回应前复述别人说的话以确保理解。",
      h8: "避免在他人分享想法时打断他们。",
      h9: "提出澄清问题以表现真正的兴趣。",
      h10: "在会议上公开表扬团队成员的贡献。",

      // Empathy Activities
      e1: "完全专注于说话者，没有干扰。",
      e2: "避免在某人分享想法时打断。",
      e3: "复述某人所说的话以确认理解。",
      e4: "提出开放性问题，如"这让你感觉如何？"",
      e5: "在反应前想象自己处于同事的情况。",
      e6: "花一天时间观察不同角色的人，了解他们的挑战。",
      e7: "从另一个团队成员的角度进行角色扮演。",
      e8: "与团队成员安排定期一对一检查。",
      e9: "适当分享一些个人信息，以鼓励相互信任。",
      e10: "注意同事情绪或能量水平的变化。",

      // 责任感活动（Accountability Activities）
      a1: "为自己和团队设定具体、可衡量的目标。",
      a2: "将大型项目分解为更小、可操作的任务，并设定截止日期。",
      a3: "向他人清晰传达你的角色和责任。",
      a4: "立即承认错误并采取措施纠正。",
      a5: "当事情出错时避免责备他人—专注于解决方案。",
      a6: "将成功和失败都视为你旅程的一部分。",
      a7: "保持日常或每周的已完成任务和成就记录。",
      a8: "与团队分享更新以保持透明度。",
      a9: "持续满足或超越期望以建立信誉。",
      a10: "定期从同事、管理者和下属寻求反馈。",

      // 韧性活动（Resiliency Activities）
      r1: "将挫折重新定义为学习和成长的机会。",
      r2: "通过每天写下三件积极的事情来练习感恩。",
      r3: "专注于你可以控制的事情，而不是担心外部因素。",
      r4: "全天安排短暂休息以充电。",
      r5: "在压力时刻练习深呼吸。",
      r6: "在日常生活中融入正念或冥想。",
      r7: "将压倒性问题分解为更小、可管理的步骤。",
      r8: "在决定一个解决方案前先集思广益多种解决方案。",
      r9: "标记你的情绪（例如，"我感到沮丧"）以更好地处理它们。",
      r10: "与能激励你的同事建立牢固关系。",

      // 透明度活动（Transparency Activities）
      t1: "定期与团队分享更新，即使没有重大新闻。",
      t2: "举行每周检查，讨论进展、挑战和目标。",
      t3: "使用清晰、简单的语言，而不是行话或技术术语。",
      t4: "创建一个共享驱动器或平台，所有相关文档都可访问。",
      t5: "公开分享成功和挫折。",
      t6: "让绩效指标可见以促进责任感。",
      t7: "始终履行承诺。",
      t8: "如果你犯错或沟通不畅，真诚道歉。",
      t9: "在委派任务时提供完整的期望透明度。",
      t10: "进行调查以评估员工认为工作场所有多透明。",

      // 包容性活动（Inclusivity Activities）
      i1: "通过书籍、文章或播客教育自己关于多样性、公平和包容性(DEI)的话题。",
      i2: "参加关于无意识偏见和微侵犯的研讨会或培训。",
      i3: "反思自己的偏见以及它们如何影响你的行为。",
      i4: "鼓励关于包容和归属感的公开讨论。",
      i5: "建立匿名反馈渠道，让员工表达关切。",
      i6: "举办倾听会议，听取不同观点和经验。",
      i7: "审查招聘实践，消除偏见并确保公平。",
      i8: "提供导师计划，将代表性不足的员工与领导者联系起来。",
      i9: "将来自不同部门或背景的员工配对进行项目合作。",
      i10: "在每次互动中以身作则展示包容行为。"
    }
  }
};
