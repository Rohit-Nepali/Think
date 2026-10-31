import { create } from 'zustand';
import { loadWorkspace, saveWorkspace } from '../db/database';
import { createEmptyWorkspace, type ThinkingWorkspace } from '../types/thinking';
import {
  addAnswer,
  addFollowUpQuestion,
  createRootQuestion,
  deleteAnswer,
  deleteQuestion,
  editAnswer,
  editQuestion,
} from './tree';

type ThinkingState = {
  workspace: ThinkingWorkspace;
  isLoading: boolean;
  persistenceError: string | null;
  restore: () => Promise<void>;
  createRoot: (text: string) => void;
  addAnswer: (questionId: string) => void;
  addFollowUp: (answerId: string) => void;
  selectAnswer: (answerId: string | null) => void;
  selectQuestion: (questionId: string) => void;
  editQuestion: (questionId: string, text: string) => void;
  editAnswer: (answerId: string, text: string) => void;
  deleteQuestion: (questionId: string) => void;
  deleteAnswer: (answerId: string) => void;
  dismissReflection: (questionId: string) => void;
};

export const useThinkingStore = create<ThinkingState>((set, get) => {
  const updateWorkspace = (update: (workspace: ThinkingWorkspace) => ThinkingWorkspace) => {
    const workspace = update(get().workspace);
    set({ workspace, persistenceError: null });
    void saveWorkspace(workspace).catch((error: unknown) => {
      console.error('Unable to save the thinking workspace.', error);
      set({ persistenceError: 'Your changes could not be saved on this device.' });
    });
  };

  return {
    workspace: createEmptyWorkspace(),
    isLoading: true,
    persistenceError: null,
    restore: async () => {
      try {
        const savedWorkspace = await loadWorkspace();
        const workspace = savedWorkspace
          ? {
            ...savedWorkspace,
            reflectionDismissedQuestionIds: savedWorkspace.reflectionDismissedQuestionIds ?? [],
          }
          : createEmptyWorkspace();
        set({ workspace, isLoading: false, persistenceError: null });
        if (!savedWorkspace) await saveWorkspace(workspace);
      } catch (error) {
        console.error('Unable to restore the thinking workspace.', error);
        set({
          isLoading: false,
          persistenceError: 'Your saved workspace could not be opened. Changes may not persist.',
        });
      }
    },
    createRoot: (text) => updateWorkspace((workspace) => createRootQuestion(workspace, text.trim())),
    addAnswer: (questionId) => updateWorkspace((workspace) => addAnswer(workspace, questionId)),
    addFollowUp: (answerId) => updateWorkspace((workspace) => addFollowUpQuestion(workspace, answerId)),
    selectAnswer: (answerId) => updateWorkspace((workspace) => ({
      ...workspace,
      selectedAnswerId: answerId,
      updatedAt: Date.now(),
    })),
    selectQuestion: (questionId) => {
      const question = get().workspace.questions[questionId];
      updateWorkspace((workspace) => ({
        ...workspace,
        selectedAnswerId: question?.parentAnswerId ?? null,
        updatedAt: Date.now(),
      }));
    },
    editQuestion: (questionId, text) => updateWorkspace((workspace) => editQuestion(workspace, questionId, text)),
    editAnswer: (answerId, text) => updateWorkspace((workspace) => editAnswer(workspace, answerId, text)),
    deleteQuestion: (questionId) => updateWorkspace((workspace) => deleteQuestion(workspace, questionId)),
    deleteAnswer: (answerId) => updateWorkspace((workspace) => deleteAnswer(workspace, answerId)),
    dismissReflection: (questionId) => updateWorkspace((workspace) => ({
      ...workspace,
      reflectionDismissedQuestionIds: workspace.reflectionDismissedQuestionIds.includes(questionId)
        ? workspace.reflectionDismissedQuestionIds
        : [...workspace.reflectionDismissedQuestionIds, questionId],
      updatedAt: Date.now(),
    })),
  };
});
