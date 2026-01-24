// Learning system type definitions

export type CourseCategory = 'openings' | 'tactics' | 'strategy' | 'endgame' | 'rules' | 'advanced';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'master';
export type LessonType = 'theory' | 'practice' | 'quiz' | 'video';

export interface Course {
    id: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    category: CourseCategory;
    level: CourseLevel;
    lessons: Lesson[];
    coverImage?: string;
    duration: number; // total minutes
    author: string;
    rating: number;
    studentsEnrolled: number;
    prerequisite?: string[]; // course IDs
}

export interface Lesson {
    id: string;
    courseId: string;
    orderIndex: number;
    title: string;
    type: LessonType;
    content: LessonContent;
    estimatedTime: number; // minutes
}

export interface LessonContent {
    text?: string;
    positions?: ChessPosition[];
    quiz?: Quiz;
    videoUrl?: string;
}

export interface ChessPosition {
    fen: string;
    caption?: string;
    moveSequence?: string; // PGN format
    explanation?: string;
}

export interface Quiz {
    questions: QuizQuestion[];
}

export interface QuizQuestion {
    id: string;
    question: string;
    type: 'multiple-choice' | 'move' | 'true-false';
    options?: string[]; // for multiple choice
    correctAnswer: string | number;
    explanation: string;
    position?: string; // FEN for move-based questions
}

export interface UserProgress {
    userId: string;
    courseProgress: CourseProgress[];
    completedLessons: string[];
    quizScores: Record<string, number>;
    timeSpentLearning: number; // minutes
}

export interface CourseProgress {
    courseId: string;
    enrolledDate: Date;
    lastAccessedDate: Date;
    completedLessons: string[];
    currentLessonId?: string;
    progressPercentage: number;
}
