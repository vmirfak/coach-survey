// types/types.ts
export interface Question {
  text: string;
  type: "rating" | "multiSelect";
  options: string[];
}

export interface SurveyCategory {
  category: string;
  questions: Question[];
}

// types/types.ts
export interface Responses {
  [key: string]: string | string[];
}

export interface SurveyAnswer {
  [key: string]: string | string[];
}
