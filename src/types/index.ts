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
  [key: string]: number; // Add index signature for string keys
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
  email?: string;
}

export type UserRole = 'user' | 'admin' | 'super_admin' | 'coach';

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  organization?: string;
  organizationId?: string;
  role?: UserRole;
  useSupabase?: boolean;
  createdAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  created_at: string;
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
  userId: string;
  createdAt: string;
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
  veteranStatus?: string;
  disabilityStatus?: string;
}

// Type for chart data - making it an array type compatible with recharts
export type ChartData = Array<{
  name: string;
  value: number;
  fullMark?: number;
}>;

// Define HEARTIDimension type
export type HEARTIDimension = 'humility' | 'empathy' | 'accountability' | 'resiliency' | 'transparency' | 'inclusivity';

// Define AssessmentTab type for ResultsDisplay component
export type AssessmentTab = 'overview' | 'dimensions' | 'dataViz' | 'report' | 'developSkills' | 'buildHabits' | 'results' | 'take';

// Define types for demographic-related selections
export type AgeRange = string;
export type CompanySize = string;
export type GenderIdentity = string;
export type JobRole = string;
export type ManagementLevel = string;

// Define types for HabitItemHeaderProps
export interface HabitItemHeaderProps {
  title: string;
  dimension: string;
  completedToday: boolean;
  skippedToday: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
}

// Define types for HabitProgressCircleProps
export interface HabitProgressCircleProps {
  completedCount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  completionTarget: number;
  progress: number;
}

// Define types for HabitItemActionsProps
export interface HabitItemActionsProps {
  id: string;
  onDelete: (id: string) => void;
  onSkipToday: (id: string) => void;
  isCompletedToday: boolean;
  skippedToday: boolean;
}

// Add the necessary props types for tab content components
export interface ComparisonTabContentProps {
  assessment: HEARTIAssessment;
  assessments: HEARTIAssessment[];
}

export interface ReportTabContentProps {
  assessment: HEARTIAssessment;
  assessments: HEARTIAssessment[];
  reportRef?: React.RefObject<HTMLDivElement>;
  onExportPDF: () => void;
  exportingPdf: boolean;
}

export interface DevelopmentTabContentProps {
  assessments: HEARTIAssessment[];
  topDevelopmentArea: HEARTIDimension;
  dimensionScores?: Record<HEARTIDimension, number>;
}

export interface HabitTabContentProps {
  topDevelopmentArea: HEARTIDimension;
  onRefreshAssessments?: () => void;
}

export interface ResultsDisplayProps {
  assessment: HEARTIAssessment;
  allAssessments: HEARTIAssessment[];
  activeTab?: AssessmentTab;
  onTabChange?: (tab: AssessmentTab) => void;
  onRefreshAssessments?: () => void;
  loading?: boolean;
  className?: string;
}
