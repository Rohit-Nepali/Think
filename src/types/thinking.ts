export type Question = {
  id: string;
  text: string;
  parentAnswerId: string | null;
  answerIds: string[];
};

export type Answer = {
  id: string;
  text: string;
  questionId: string;
  followUpQuestionId: string | null;
};

export type ThinkingWorkspace = {
  id: string;
  rootQuestionId: string | null;
  questions: Record<string, Question>;
  answers: Record<string, Answer>;
  selectedAnswerId: string | null;
  reflectionDismissedQuestionIds: string[];
  updatedAt: number;
};

export function createEmptyWorkspace(): ThinkingWorkspace {
  return {
    id: 'current',
    rootQuestionId: null,
    questions: {},
    answers: {},
    selectedAnswerId: null,
    reflectionDismissedQuestionIds: [],
    updatedAt: Date.now(),
  };
}
