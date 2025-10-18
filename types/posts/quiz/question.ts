export interface Question {
  question: string;
  options: Array<{ text: string; isCorrect: boolean }>;
}
