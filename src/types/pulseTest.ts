export interface PulseTest {
  id: string;
  userId: string;
  originalAssessmentId: string;
  date: string;
  questionsSelected: string[]; // Array of question IDs
  answers: Array<{ questionId: string; score: number }>;
  dimensionScores: {
    humility: number;
    empathy: number;
    accountability: number;
    resiliency: number;
    transparency: number;
    inclusivity: number;
  };
  overallScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentSchedule {
  id: string;
  userId: string;
  initialAssessmentId: string;
  initialAssessmentDate: string;
  nextPulseDate: string;
  nextFullAssessmentDate: string;
  pulseCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  trialDays: number;
  active: boolean;
  maxUses?: number;
  currentUses: number;
  createdAt: string;
  expiresAt?: string;
}

export interface PromoCodeUse {
  id: string;
  promoCodeId: string;
  userId: string;
  usedAt: string;
  trialStartDate: string;
  trialEndDate: string;
  createdAt: string;
}