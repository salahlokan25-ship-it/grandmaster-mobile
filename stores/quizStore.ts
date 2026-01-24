import { create } from 'zustand';
import { QuizQuestion } from '../types/quiz';

interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  isComplete: boolean;

  startQuiz: () => void;
  submitAnswer: (answerIndex: number) => void;
  resetQuiz: () => void;
}

const mockQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'Which piece cannot move backwards?',
    options: ['Rook', 'Pawn', 'Knight', 'Bishop'],
    correctAnswer: 1,
    explanation: 'Pawns are the only chess pieces that can only move forward.',
    difficulty: 'beginner',
    topic: 'Basic Rules'
  },
  {
    id: '2',
    question: 'What is the value of a Queen in standard points?',
    options: ['5', '7', '9', '10'],
    correctAnswer: 2,
    explanation: 'The Queen is the most powerful piece and is worth 9 points.',
    difficulty: 'beginner',
    topic: 'Piece Values'
  },
  {
    id: '3',
    question: 'What is it called when a King is under attack and cannot escape?',
    options: ['Stalemate', 'Check', 'Checkmate', 'En Passant'],
    correctAnswer: 2,
    explanation: 'Checkmate occurs when the king is in check and there is no legal way to get out of it.',
    difficulty: 'beginner',
    topic: 'Core Concepts'
  },
  {
    id: '4',
    question: 'Which opening starts with 1. e4 e5 2. Nf3 Nc6 3. Bb5?',
    options: ['Italian Game', 'Sicilian Defense', 'Ruy Lopez', 'French Defense'],
    correctAnswer: 2,
    explanation: 'The Ruy Lopez is one of the oldest and most popular chess openings.',
    difficulty: 'intermediate',
    topic: 'Openings'
  },
  {
    id: '5',
    question: 'Who was the first official World Chess Champion?',
    options: ['Bobby Fischer', 'Garry Kasparov', 'Wilhelm Steinitz', 'Magnus Carlsen'],
    correctAnswer: 2,
    explanation: 'Wilhelm Steinitz became the first official world champion in 1886.',
    difficulty: 'advanced',
    topic: 'History'
  },
  {
    id: '6',
    question: 'What is "En Passant"?',
    options: ['A special king move', 'A special pawn capture', 'A type of draw', 'A checkmate pattern'],
    correctAnswer: 1,
    explanation: 'En Passant is a special pawn capture that can occur immediately after a pawn makes a double-step move.',
    difficulty: 'intermediate',
    topic: 'Special Moves'
  }
];

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: mockQuestions,
  currentQuestionIndex: 0,
  score: 0,
  isComplete: false,

  startQuiz: () => set({ currentQuestionIndex: 0, score: 0, isComplete: false }),
  submitAnswer: (index) => {
    const { questions, currentQuestionIndex, score } = get();
    const isCorrect = index === questions[currentQuestionIndex].correctAnswer;
    const isLast = currentQuestionIndex === questions.length - 1;
    set({
      score: isCorrect ? score + 1 : score,
      currentQuestionIndex: isLast ? currentQuestionIndex : currentQuestionIndex + 1,
      isComplete: isLast
    });
  },
  resetQuiz: () => set({ currentQuestionIndex: 0, score: 0, isComplete: false }),
}));
