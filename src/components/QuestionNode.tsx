import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { Question } from '../types/thinking';

export type QuestionNodeData = {
  question: Question;
  depth: number;
  active: boolean;
  onSelect: (questionId: string) => void;
  onEdit: (questionId: string, text: string) => void;
  onAddAnswer: (questionId: string) => void;
  onDelete: (questionId: string) => void;
};

export type QuestionFlowNode = Node<QuestionNodeData, 'question'>;

export default function QuestionNode({ data }: NodeProps<QuestionFlowNode>) {
  const [editing, setEditing] = useState(!data.question.text.trim());
  const [draft, setDraft] = useState(data.question.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(data.question.text);
  }, [data.question.text]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function saveQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    data.onEdit(data.question.id, draft.trim());
    setEditing(false);
  }

  return (
    <article
      className={`think-node question-node${data.active ? ' is-active' : ''}`}
      onClick={() => data.onSelect(data.question.id)}
    >
      <Handle type="target" position={Position.Left} />
      <div className="node-eyebrow">QUESTION · LEVEL {data.depth}</div>
      {editing ? (
        <form className="node-edit-form" onSubmit={saveQuestion}>
          <input
            ref={inputRef}
            aria-label="Edit question"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write the next question"
          />
          <button className="text-button" type="submit">Save</button>
        </form>
      ) : (
        <div className="node-question-text">{data.question.text || 'Untitled question'}</div>
      )}
      {!editing && (
        <div className="node-actions" onClick={(event) => event.stopPropagation()}>
          <button
            className="text-button"
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Edit question"
          >
            Edit
          </button>
          <button
            className="text-button"
            type="button"
            onClick={() => data.onAddAnswer(data.question.id)}
          >
            + Answer
          </button>
          <button
            className="text-button danger-button"
            type="button"
            onClick={() => data.onDelete(data.question.id)}
            aria-label="Delete question"
          >
            Delete
          </button>
        </div>
      )}
      <Handle type="source" position={Position.Right} />
    </article>
  );
}
