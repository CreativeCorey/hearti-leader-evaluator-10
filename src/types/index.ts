
export type HEARTIDimension = 'humility' | 'empathy' | 'accountability' | 'resiliency' | 'transparency' | 'inclusivity';

export interface HEARTIQuestion {
  id: number;
  dimension: HEARTIDimension;
  text: string;
  reverseScored?: boolean;
}

export interface HEARTIAnswer {
  questionId: number;
  score: number; // 1-5 scale
}

export interface HEARTIAssessment {
  id: string;
  userId: string;
  organizationId?: string;
  date: string;
  answers: HEARTIAnswer[];
  dimensionScores: Record<HEARTIDimension, number>;
  overallScore: number;
}

export interface UserProfile {
  id: string;
  createdAt: string;
  name?: string;
  email?: string;
  organizationId?: string;
  role?: 'user' | 'admin';
}

export interface Organization {
  id: string;
  createdAt: string;
  name: string;
  description?: string;
}

export type DimensionData = {
  name: string;
  value: number; 
  fullMark: number;
};

export type ChartData = DimensionData[];
