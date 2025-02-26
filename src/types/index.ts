
export type HEARTIDimension = 'humility' | 'empathy' | 'accountability' | 'resiliency' | 'transparency' | 'inclusivity';

export interface HEARTIQuestion {
  id: number;
  dimension: HEARTIDimension;
  text: string;
}

export interface HEARTIAnswer {
  questionId: number;
  score: number; // 1-5 scale
}

export interface HEARTIAssessment {
  id: string;
  date: string;
  answers: HEARTIAnswer[];
  dimensionScores: Record<HEARTIDimension, number>;
  overallScore: number;
}

export type DimensionData = {
  name: string;
  value: number; 
  fullMark: number;
};

export type ChartData = DimensionData[];
