import { useEffect, useMemo } from 'react';
import { ReactFlow, ReactFlowProvider, useReactFlow, type Edge } from '@xyflow/react';
import { getActiveDepth, getActivePath, getQuestionDepth } from '../store/tree';
import { useThinkingStore } from '../store/thinkingStore';
import AnswerNode, { type AnswerFlowNode } from './AnswerNode';
import CanvasToolbar from './CanvasToolbar';
import DepthPrompt from './DepthPrompt';
import QuestionNode, { type QuestionFlowNode } from './QuestionNode';

type ThinkFlowNode = QuestionFlowNode | AnswerFlowNode;

const nodeTypes = {
  question: QuestionNode,
  answer: AnswerNode,
};

function ThinkingCanvas() {
  const workspace = useThinkingStore((state) => state.workspace);
  const selectAnswer = useThinkingStore((state) => state.selectAnswer);
  const selectQuestion = useThinkingStore((state) => state.selectQuestion);
  const editQuestion = useThinkingStore((state) => state.editQuestion);
  const editAnswer = useThinkingStore((state) => state.editAnswer);
  const addAnswer = useThinkingStore((state) => state.addAnswer);
  const addFollowUp = useThinkingStore((state) => state.addFollowUp);
  const deleteQuestion = useThinkingStore((state) => state.deleteQuestion);
  const deleteAnswer = useThinkingStore((state) => state.deleteAnswer);
  const dismissReflection = useThinkingStore((state) => state.dismissReflection);
  const { fitView } = useReactFlow();

  const { nodes, edges } = useMemo(() => {
    const activePath = getActivePath(workspace);
    const flowNodes: ThinkFlowNode[] = [];
    const flowEdges: Edge[] = [];
    let row = 0;

    function placeQuestion(questionId: string, level: number): number {
      const question = workspace.questions[questionId];
      if (!question) return row * 160;

      const x = (level - 1) * 600;
      const answerCenters: number[] = [];
      for (const answerId of question.answerIds) {
        const answer = workspace.answers[answerId];
        if (!answer) continue;

        const answerY = row * 160;
        const answerCenter = answerY + 44;
        row += 1;
        answerCenters.push(answerCenter);
        const active = activePath.answerIds.has(answerId);
        flowNodes.push({
          id: `answer:${answerId}`,
          type: 'answer',
          position: { x: x + 310, y: answerY },
          draggable: false,
          data: {
            answer,
            active,
            selected: workspace.selectedAnswerId === answerId,
            onSelect: selectAnswer,
            onEdit: editAnswer,
            onAddFollowUp: addFollowUp,
            onDelete: (id) => {
              const current = workspace.answers[id];
              if (!current) return;
              if (current.followUpQuestionId && !window.confirm('Delete this answer and all questions beneath it?')) return;
              deleteAnswer(id);
            },
          },
        });
        flowEdges.push({
          id: `edge:question:${questionId}:answer:${answerId}`,
          source: `question:${questionId}`,
          target: `answer:${answerId}`,
          type: 'smoothstep',
          style: { stroke: active ? 'var(--color-active)' : 'var(--color-border-strong)' },
        });

        if (answer.followUpQuestionId) {
          flowEdges.push({
            id: `edge:answer:${answerId}:question:${answer.followUpQuestionId}`,
            source: `answer:${answerId}`,
            target: `question:${answer.followUpQuestionId}`,
            type: 'smoothstep',
            style: { stroke: active ? 'var(--color-active)' : 'var(--color-border-strong)' },
          });
          placeQuestion(answer.followUpQuestionId, level + 1);
        }
      }

      const centerY = answerCenters.length
        ? answerCenters.reduce((total, center) => total + center, 0) / answerCenters.length
        : row++ * 160 + 44;
      flowNodes.push({
        id: `question:${questionId}`,
        type: 'question',
        position: { x, y: centerY - 44 },
        draggable: false,
        data: {
          question,
          depth: getQuestionDepth(workspace, questionId),
          active: activePath.questionIds.has(questionId),
          onSelect: selectQuestion,
          onEdit: editQuestion,
          onAddAnswer: addAnswer,
          onDelete: (id) => {
            const current = workspace.questions[id];
            if (!current) return;
            if (current.answerIds.length && !window.confirm('Delete this question and all answers and questions beneath it?')) return;
            deleteQuestion(id);
          },
        },
      });
      return centerY;
    }

    if (workspace.rootQuestionId) placeQuestion(workspace.rootQuestionId, 1);
    return { nodes: flowNodes, edges: flowEdges };
  }, [
    workspace,
    selectAnswer,
    selectQuestion,
    editQuestion,
    editAnswer,
    addAnswer,
    addFollowUp,
    deleteQuestion,
    deleteAnswer,
  ]);

  const activeDepth = getActiveDepth(workspace);
  const activeQuestionId = workspace.selectedAnswerId
    ? workspace.answers[workspace.selectedAnswerId]?.followUpQuestionId
      ?? workspace.answers[workspace.selectedAnswerId]?.questionId
    : workspace.rootQuestionId;
  const shouldShowPrompt = activeDepth === 5
    && activeQuestionId !== null
    && !workspace.reflectionDismissedQuestionIds.includes(activeQuestionId);

  useEffect(() => {
    if (nodes.length) void fitView({ padding: 0.22, duration: 200 });
  }, [fitView, nodes.length]);

  return (
    <div className="canvas-shell">
      <CanvasToolbar depth={activeDepth} />
      <ReactFlow<ThinkFlowNode>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        minZoom={0.25}
        maxZoom={1.6}
        fitView
        fitViewOptions={{ padding: 0.22 }}
        defaultEdgeOptions={{ interactionWidth: 18 }}
      />
      {shouldShowPrompt && activeQuestionId && (
        <DepthPrompt
          onStop={() => dismissReflection(activeQuestionId)}
          onContinue={() => dismissReflection(activeQuestionId)}
        />
      )}
    </div>
  );
}

export default function Canvas() {
  return (
    <ReactFlowProvider>
      <ThinkingCanvas />
    </ReactFlowProvider>
  );
}
