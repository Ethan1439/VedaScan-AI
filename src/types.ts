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
