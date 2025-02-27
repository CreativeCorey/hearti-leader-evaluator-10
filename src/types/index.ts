
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

export type ManagementLevel = 
  | 'Individual Contributor'
  | 'Manager'
  | 'Director'
  | 'VP'
  | 'C-Suite'
  | 'Entrepreneur'
  | 'Student'
  | 'Not Employed'
  | undefined;

export type CompanySize = 
  | '1 - 250 Employees'
  | '251 - 2,000 Employees'
  | '2,501 - 10,000 Employees'
  | '10,000+ Employees'
  | 'Not Employed'
  | undefined;

export type JobRole = 
  | 'C-Suite / Partner'
  | 'Sales'
  | 'Operations'
  | 'Finance'
  | 'Marketing'
  | 'Engineering'
  | 'Procurement'
  | 'HR'
  | 'Legal'
  | 'Technology'
  | 'Research and development'
  | 'Production'
  | 'Customer Service'
  | 'Supply Chain'
  | 'Management'
  | 'Entrepreneur'
  | 'Communications'
  | 'Student'
  | undefined;

export type AgeRange = 
  | '18 - 24'
  | '25 - 34'
  | '35 - 44'
  | '45 - 54'
  | '55 - 64'
  | '65+'
  | 'Decline to answer'
  | undefined;

export type GenderIdentity = 
  | 'Man'
  | 'Woman'
  | 'Non-Binary / Gender Non-conforming'
  | 'Decline to answer'
  | undefined;

export type RaceEthnicity = string[] | undefined;

export interface Demographics {
  managementLevel?: ManagementLevel;
  companySize?: CompanySize;
  jobRole?: JobRole;
  location?: string;
  ageRange?: AgeRange;
  genderIdentity?: GenderIdentity;
  raceEthnicity?: RaceEthnicity;
}

export interface HEARTIAssessment {
  id: string;
  userId: string;
  organizationId?: string;
  date: string;
  answers: HEARTIAnswer[];
  dimensionScores: Record<HEARTIDimension, number>;
  overallScore: number;
  demographics?: Demographics;
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
