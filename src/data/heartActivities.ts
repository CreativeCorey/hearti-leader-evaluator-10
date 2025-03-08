
import { HEARTIDimension } from '../types';

export interface SkillActivity {
  id: string;
  dimension: HEARTIDimension;
  category: string;
  description: string;
}

export interface SavedActivity {
  id?: string;
  userId: string;
  activityId: string;
  dimension: HEARTIDimension;
  completed: boolean;
  savedAt: string;
}

export const dimensionColors = {
  humility: 'bg-purple-100 text-purple-800 border-purple-200',
  empathy: 'bg-blue-100 text-blue-800 border-blue-200',
  accountability: 'bg-green-100 text-green-800 border-green-200',
  resiliency: 'bg-amber-100 text-amber-800 border-amber-200',
  transparency: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  inclusivity: 'bg-rose-100 text-rose-800 border-rose-200'
};

export const dimensionTitles = {
  humility: 'Humility',
  empathy: 'Empathy',
  accountability: 'Accountability',
  resiliency: 'Resiliency',
  transparency: 'Transparency',
  inclusivity: 'Inclusivity'
};

// Activity data for all HEARTI dimensions
export const activityData: SkillActivity[] = [
  // Humility Activities
  { id: 'h1', dimension: 'humility', category: 'Self-Reflection & Awareness', description: "Write down three things you're grateful for about your team every day." },
  { id: 'h2', dimension: 'humility', category: 'Self-Reflection & Awareness', description: "Reflect on a recent mistake and identify what you learned from it." },
  { id: 'h3', dimension: 'humility', category: 'Self-Reflection & Awareness', description: "Keep a journal to track moments when you felt proud or overly confident—analyze why." },
  { id: 'h4', dimension: 'humility', category: 'Self-Reflection & Awareness', description: "Ask yourself daily: \"Am I listening more than I'm speaking?\"" },
  { id: 'h5', dimension: 'humility', category: 'Self-Reflection & Awareness', description: "Identify one area where you can improve as a leader or colleague." },
  { id: 'h6', dimension: 'humility', category: 'Active Listening', description: "Focus fully on the speaker during conversations—no multitasking." },
  { id: 'h7', dimension: 'humility', category: 'Active Listening', description: "Paraphrase what someone says before responding to ensure understanding." },
  { id: 'h8', dimension: 'humility', category: 'Active Listening', description: "Avoid interrupting others while they're sharing ideas." },
  { id: 'h9', dimension: 'humility', category: 'Active Listening', description: "Ask clarifying questions to show genuine interest." },
  { id: 'h10', dimension: 'humility', category: 'Acknowledging Others', description: "Publicly recognize a teammate's contribution in a meeting." },

  // Empathy Activities
  { id: 'e1', dimension: 'empathy', category: 'Active Listening', description: "Focus entirely on the speaker without distractions." },
  { id: 'e2', dimension: 'empathy', category: 'Active Listening', description: "Avoid interrupting while someone is sharing their thoughts." },
  { id: 'e3', dimension: 'empathy', category: 'Active Listening', description: "Paraphrase what someone says to confirm understanding." },
  { id: 'e4', dimension: 'empathy', category: 'Active Listening', description: "Ask open-ended questions like, \"How did that make you feel?\"" },
  { id: 'e5', dimension: 'empathy', category: 'Perspective-Taking', description: "Imagine yourself in a coworker's situation before reacting." },
  { id: 'e6', dimension: 'empathy', category: 'Perspective-Taking', description: "Spend a day shadowing someone in a different role to understand their challenges." },
  { id: 'e7', dimension: 'empathy', category: 'Perspective-Taking', description: "Role-play scenarios from another team member's point of view." },
  { id: 'e8', dimension: 'empathy', category: 'Building Connections', description: "Schedule regular one-on-one check-ins with team members." },
  { id: 'e9', dimension: 'empathy', category: 'Building Connections', description: "Share something personal (appropriately) to encourage mutual trust." },
  { id: 'e10', dimension: 'empathy', category: 'Emotional Awareness', description: "Notice changes in a colleague's mood or energy levels." },

  // Accountability Activities
  { id: 'a1', dimension: 'accountability', category: 'Setting Clear Expectations', description: "Define specific, measurable goals for yourself and your team." },
  { id: 'a2', dimension: 'accountability', category: 'Setting Clear Expectations', description: "Break down large projects into smaller, actionable tasks with deadlines." },
  { id: 'a3', dimension: 'accountability', category: 'Setting Clear Expectations', description: "Communicate your role and responsibilities clearly to others." },
  { id: 'a4', dimension: 'accountability', category: 'Taking Ownership', description: "Admit mistakes immediately and take steps to correct them." },
  { id: 'a5', dimension: 'accountability', category: 'Taking Ownership', description: "Avoid blaming others when things go wrong—focus on solutions." },
  { id: 'a6', dimension: 'accountability', category: 'Taking Ownership', description: "Own both successes and failures as part of your journey." },
  { id: 'a7', dimension: 'accountability', category: 'Tracking Progress', description: "Keep a daily or weekly log of completed tasks and achievements." },
  { id: 'a8', dimension: 'accountability', category: 'Tracking Progress', description: "Share updates with your team to maintain transparency." },
  { id: 'a9', dimension: 'accountability', category: 'Building Trust', description: "Consistently meet or exceed expectations to build credibility." },
  { id: 'a10', dimension: 'accountability', category: 'Continuous Improvement', description: "Seek feedback regularly from peers, managers, and subordinates." },

  // Resiliency Activities
  { id: 'r1', dimension: 'resiliency', category: 'Mindset Shifts', description: "Reframe setbacks as opportunities to learn and grow." },
  { id: 'r2', dimension: 'resiliency', category: 'Mindset Shifts', description: "Practice gratitude by writing down three positive things each day." },
  { id: 'r3', dimension: 'resiliency', category: 'Mindset Shifts', description: "Focus on what you can control rather than worrying about external factors." },
  { id: 'r4', dimension: 'resiliency', category: 'Stress Management', description: "Take short breaks throughout the day to recharge." },
  { id: 'r5', dimension: 'resiliency', category: 'Stress Management', description: "Practice deep breathing exercises during stressful moments." },
  { id: 'r6', dimension: 'resiliency', category: 'Stress Management', description: "Incorporate mindfulness or meditation into your daily routine." },
  { id: 'r7', dimension: 'resiliency', category: 'Problem-Solving Skills', description: "Break overwhelming problems into smaller, manageable steps." },
  { id: 'r8', dimension: 'resiliency', category: 'Problem-Solving Skills', description: "Brainstorm multiple solutions before deciding on one." },
  { id: 'r9', dimension: 'resiliency', category: 'Emotional Regulation', description: "Label your emotions (e.g., \"I'm feeling frustrated\") to process them better." },
  { id: 'r10', dimension: 'resiliency', category: 'Support Systems & Community', description: "Build strong relationships with coworkers who uplift you." },

  // Transparency Activities
  { id: 't1', dimension: 'transparency', category: 'Open Communication', description: "Share updates regularly with your team, even if there's no major news." },
  { id: 't2', dimension: 'transparency', category: 'Open Communication', description: "Hold weekly check-ins to discuss progress, challenges, and goals." },
  { id: 't3', dimension: 'transparency', category: 'Open Communication', description: "Use clear, simple language instead of jargon or technical terms." },
  { id: 't4', dimension: 'transparency', category: 'Sharing Information', description: "Create a shared drive or platform where all relevant documents are accessible." },
  { id: 't5', dimension: 'transparency', category: 'Sharing Information', description: "Share both successes and setbacks openly with your team." },
  { id: 't6', dimension: 'transparency', category: 'Sharing Information', description: "Make performance metrics visible to promote accountability." },
  { id: 't7', dimension: 'transparency', category: 'Building Trust', description: "Follow through on promises and commitments consistently." },
  { id: 't8', dimension: 'transparency', category: 'Building Trust', description: "Apologize sincerely if you make a mistake or miscommunicate." },
  { id: 't9', dimension: 'transparency', category: 'Empowering Others', description: "Delegate tasks while providing full visibility into expectations." },
  { id: 't10', dimension: 'transparency', category: 'Continuous Improvement', description: "Conduct surveys to gauge how transparent employees feel the workplace is." },

  // Inclusivity Activities
  { id: 'i1', dimension: 'inclusivity', category: 'Building Awareness', description: "Educate yourself on diversity, equity, and inclusion (DEI) topics through books, articles, or podcasts." },
  { id: 'i2', dimension: 'inclusivity', category: 'Building Awareness', description: "Attend workshops or training sessions on unconscious bias and microaggressions." },
  { id: 'i3', dimension: 'inclusivity', category: 'Building Awareness', description: "Reflect on your own biases and how they might influence your behavior." },
  { id: 'i4', dimension: 'inclusivity', category: 'Creating Safe Spaces', description: "Encourage open discussions about inclusion and belonging." },
  { id: 'i5', dimension: 'inclusivity', category: 'Creating Safe Spaces', description: "Establish anonymous feedback channels for employees to voice concerns." },
  { id: 'i6', dimension: 'inclusivity', category: 'Creating Safe Spaces', description: "Host listening sessions to hear diverse perspectives and experiences." },
  { id: 'i7', dimension: 'inclusivity', category: 'Promoting Equity', description: "Review hiring practices to eliminate bias and ensure fairness." },
  { id: 'i8', dimension: 'inclusivity', category: 'Promoting Equity', description: "Offer mentorship programs that connect underrepresented employees with leaders." },
  { id: 'i9', dimension: 'inclusivity', category: 'Fostering Collaboration', description: "Pair employees from different departments or backgrounds for projects." },
  { id: 'i10', dimension: 'inclusivity', category: 'Leading by Example', description: "Model inclusive behavior in every interaction." },
];
