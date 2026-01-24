export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  fen?: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  date: string;
}
