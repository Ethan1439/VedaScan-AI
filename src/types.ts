export interface Herb {
  id: string;
  name: string;
  sanskritName: string;
  botanicalName: string;
  doshaEffect: string;
  category: string;
  primaryIndications: string[];
  description: string;
  howToUse: string;
  benefits: string[];
  precautions: string;
}

export interface DoshaAnswers {
  energy: string;
  digestion: string;
  sleep: string;
  skin: string;
  stress: string;
}

export interface Remedy {
  name: string;
  sanskritName: string;
  type: string;
  benefits: string;
  dosageInstructions: string;
  safetyNotes: string;
}

export interface RecommendationResponse {
  dominantDoshaAnalysis: string;
  holisticSummary: string;
  medicines: Remedy[];
  dietaryRecommendations: {
    explanation: string;
    toFavor: string[];
    toAvoid: string[];
  };
  lifestyleRecommendations: {
    yogaAsanas: string[];
    breathingExercises: string[];
    lifestyleTips: string[];
  };
  warning?: string;
}

export interface SavedConsultation {
  id: string;
  timestamp: string;
  symptoms: string[];
  customDescription: string;
  diseaseContext: string;
  severity: string;
  duration: string;
  age: string;
  gender: string;
  doshaAnswers: DoshaAnswers;
  result: RecommendationResponse;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  dosha: string;
  createdAt: string;
  notes: HealthNote[];
  weightLogs: WeightLog[];
  completedWeightLossDays: number[]; // e.g., [1, 2, 5]
  savedConsultations: SavedConsultation[];
  emailVerified?: boolean;
}

export interface HealthNote {
  id: string;
  timestamp: string;
  title: string;
  content: string;
}

export interface WeightLog {
  id: string;
  date: string;
  weight: number;
}
