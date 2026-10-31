import type { Answer, Question, ThinkingWorkspace } from '../types/thinking';

function createId(): string {
  return crypto.randomUUID();
}

export function createRootQuestion(workspace: ThinkingWorkspace, text: string): ThinkingWorkspace {
  if (workspace.rootQuestionId) return workspace;

  const id = createId();
  return {
    ...workspace,
    rootQuestionId: id,
    questions: { ...workspace.questions, [id]: { id, text, parentAnswerId: null, answerIds: [] } },
    updatedAt: Date.now(),
  };
}

export function addAnswer(workspace: ThinkingWorkspace, questionId: string): ThinkingWorkspace {
  const question = workspace.questions[questionId];
  if (!question) return workspace;

  const id = createId();
  const answer: Answer = { id, text: '', questionId, followUpQuestionId: null };
  const updatedQuestion: Question = { ...question, answerIds: [...question.answerIds, id] };
  return {
    ...workspace,
    questions: { ...workspace.questions, [questionId]: updatedQuestion },
    answers: { ...workspace.answers, [id]: answer },
    selectedAnswerId: id,
    updatedAt: Date.now(),
  };
}

export function addFollowUpQuestion(workspace: ThinkingWorkspace, answerId: string): ThinkingWorkspace {
  const answer = workspace.answers[answerId];
  if (!answer || answer.followUpQuestionId) return workspace;

  const id = createId();
  return {
    ...workspace,
    answers: {
      ...workspace.answers,
      [answerId]: { ...answer, followUpQuestionId: id },
    },
    questions: {
      ...workspace.questions,
      [id]: { id, text: '', parentAnswerId: answerId, answerIds: [] },
    },
    selectedAnswerId: answerId,
    updatedAt: Date.now(),
  };
}

export function editQuestion(workspace: ThinkingWorkspace, questionId: string, text: string): ThinkingWorkspace {
  const question = workspace.questions[questionId];
  if (!question) return workspace;

  return {
    ...workspace,
    questions: { ...workspace.questions, [questionId]: { ...question, text } },
    updatedAt: Date.now(),
  };
}

export function editAnswer(workspace: ThinkingWorkspace, answerId: string, text: string): ThinkingWorkspace {
  const answer = workspace.answers[answerId];
  if (!answer) return workspace;

  return {
    ...workspace,
    answers: { ...workspace.answers, [answerId]: { ...answer, text } },
    updatedAt: Date.now(),
  };
}

function collectQuestionIds(workspace: ThinkingWorkspace, questionId: string, result: Set<string>): void {
  if (result.has(questionId)) return;
  result.add(questionId);
  const question = workspace.questions[questionId];
  if (!question) return;

  for (const answerId of question.answerIds) {
    const answer = workspace.answers[answerId];
    if (answer?.followUpQuestionId) collectQuestionIds(workspace, answer.followUpQuestionId, result);
  }
}

export function deleteQuestion(workspace: ThinkingWorkspace, questionId: string): ThinkingWorkspace {
  if (!workspace.questions[questionId]) return workspace;
  const deletedQuestionIds = new Set<string>();
  collectQuestionIds(workspace, questionId, deletedQuestionIds);
  if (!deletedQuestionIds.size) return workspace;

  const deletedAnswerIds = new Set<string>();
  for (const id of deletedQuestionIds) {
    for (const answerId of workspace.questions[id]?.answerIds ?? []) deletedAnswerIds.add(answerId);
  }

  const parentAnswerId = workspace.questions[questionId]?.parentAnswerId;
  const questions = Object.fromEntries(
    Object.entries(workspace.questions).filter(([id]) => !deletedQuestionIds.has(id)),
  );
  const answers = Object.fromEntries(
    Object.entries(workspace.answers).filter(([id]) => !deletedAnswerIds.has(id)),
  );

  if (parentAnswerId && answers[parentAnswerId]) {
    answers[parentAnswerId] = { ...answers[parentAnswerId], followUpQuestionId: null };
  }

  return {
    ...workspace,
    rootQuestionId: workspace.rootQuestionId === questionId ? null : workspace.rootQuestionId,
    questions,
    answers,
    selectedAnswerId: workspace.selectedAnswerId && !deletedAnswerIds.has(workspace.selectedAnswerId)
      ? workspace.selectedAnswerId
      : parentAnswerId && answers[parentAnswerId]
        ? parentAnswerId
        : null,
    updatedAt: Date.now(),
  };
}

export function deleteAnswer(workspace: ThinkingWorkspace, answerId: string): ThinkingWorkspace {
  const answer = workspace.answers[answerId];
  if (!answer) return workspace;

  const questions = { ...workspace.questions };
  const parentQuestion = questions[answer.questionId];
  if (parentQuestion) {
    questions[answer.questionId] = {
      ...parentQuestion,
      answerIds: parentQuestion.answerIds.filter((id) => id !== answerId),
    };
  }

  const withoutAnswer = { ...workspace, questions, answers: { ...workspace.answers } };
  delete withoutAnswer.answers[answerId];
  const deleted = answer.followUpQuestionId
    ? deleteQuestion(withoutAnswer, answer.followUpQuestionId)
    : { ...withoutAnswer, updatedAt: Date.now() };
  return {
    ...deleted,
    selectedAnswerId: workspace.selectedAnswerId === answerId ? null : deleted.selectedAnswerId,
    updatedAt: Date.now(),
  };
}

export function getQuestionDepth(workspace: ThinkingWorkspace, questionId: string): number {
  let depth = 0;
  let currentId: string | null = questionId;
  const visited = new Set<string>();

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);
    const question: Question | undefined = workspace.questions[currentId];
    if (!question) break;
    depth += 1;
    currentId = question.parentAnswerId
      ? workspace.answers[question.parentAnswerId]?.questionId ?? null
      : null;
  }

  return depth;
}

export function getActiveQuestionId(workspace: ThinkingWorkspace): string | null {
  if (!workspace.selectedAnswerId) return workspace.rootQuestionId;
  const answer = workspace.answers[workspace.selectedAnswerId];
  if (!answer) return workspace.rootQuestionId;
  return answer.followUpQuestionId ?? answer.questionId;
}

export function getActiveDepth(workspace: ThinkingWorkspace): number {
  const questionId = getActiveQuestionId(workspace);
  return questionId ? getQuestionDepth(workspace, questionId) : 0;
}

export function getActivePath(workspace: ThinkingWorkspace): { questionIds: Set<string>; answerIds: Set<string> } {
  const questionIds = new Set<string>();
  const answerIds = new Set<string>();
  let answerId = workspace.selectedAnswerId;
  const visited = new Set<string>();

  while (answerId && !visited.has(answerId)) {
    visited.add(answerId);
    const answer = workspace.answers[answerId];
    if (!answer) break;
    answerIds.add(answerId);
    questionIds.add(answer.questionId);
    const question = workspace.questions[answer.questionId];
    if (!question) break;
    if (question.parentAnswerId) {
      answerId = question.parentAnswerId;
    } else {
      answerId = null;
      questionIds.add(question.id);
    }
  }

  if (workspace.rootQuestionId && !workspace.selectedAnswerId) questionIds.add(workspace.rootQuestionId);
  const activeQuestionId = getActiveQuestionId(workspace);
  if (activeQuestionId) questionIds.add(activeQuestionId);
  return { questionIds, answerIds };
}

export function isQuestionDescendantOf(workspace: ThinkingWorkspace, questionId: string, ancestorId: string): boolean {
  let currentId: string | null = questionId;
  const visited = new Set<string>();
  while (currentId && !visited.has(currentId)) {
    if (currentId === ancestorId) return true;
    visited.add(currentId);
    const question: Question | undefined = workspace.questions[currentId];
    currentId = question?.parentAnswerId
      ? workspace.answers[question.parentAnswerId]?.questionId ?? null
      : null;
  }
  return false;
}

export function isAnswerDescendantOf(workspace: ThinkingWorkspace, answerId: string, ancestorId: string): boolean {
  const answer = workspace.answers[answerId];
  return answer ? isQuestionDescendantOf(workspace, answer.questionId, ancestorId) : false;
}
