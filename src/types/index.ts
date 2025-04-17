export interface HEARTIQuestion {
  id: string;
  text: string;
  dimension: string;
  reverseScored?: boolean;
}

export interface HEARTIAnswer {
  questionId: string;
  score: number;
}

export interface DimensionScores {
  humility: number;
  empathy: number;
  accountability: number;
  resiliency: number;
  transparency: number;
  inclusivity: number;
}

export interface HEARTIAssessment {
  id: string;
  userId: string;
  organizationId?: string;
  date: string;
  answers: HEARTIAnswer[];
  dimensionScores: DimensionScores;
  overallScore: number;
  demographics?: Demographics;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  organization?: string;
  useSupabase?: boolean;
}

export interface GoogleConnection {
  email: string | null;
  photoURL: string | null;
  accessToken: string | null;
}

export interface Habit {
  id: string;
  description: string;
  dimension: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completedDates?: string[];
  skippedDates?: string[];
}

export interface Demographics {
  managementLevel?: string;
  companySize?: string;
  jobRole?: string;
  location?: string;
  ageRange?: string;
  genderIdentity?: string;
  raceEthnicity?: string[];
  salaryRange?: string;
}
