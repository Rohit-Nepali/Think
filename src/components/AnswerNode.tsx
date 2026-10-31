import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { Answer } from '../types/thinking';

export type AnswerNodeData = {
  answer: Answer;
  active: boolean;
  selected: boolean;
  onSelect: (answerId: string) => void;
  onEdit: (answerId: string, text: string) => void;
  onAddFollowUp: (answerId: string) => void;
  onDelete: (answerId: string) => void;
};

export type AnswerFlowNode = Node<AnswerNodeData, 'answer'>;

export default function AnswerNode({ data }: NodeProps<AnswerFlowNode>) {
  const [editing, setEditing] = useState(!data.answer.text.trim());
  const [draft, setDraft] = useState(data.answer.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(data.answer.text);
  }, [data.answer.text]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function saveAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    data.onEdit(data.answer.id, draft.trim());
    setEditing(false);
  }

  return (
    <article
      className={`think-node answer-node${data.active ? ' is-active' : ''}${data.selected ? ' is-selected' : ''}`}
      onClick={() => data.onSelect(data.answer.id)}
    >
      <Handle type="target" position={Position.Left} />
      <div className="node-eyebrow">POSSIBLE ANSWER</div>
      {editing ? (
        <form className="node-edit-form" onSubmit={saveAnswer} onClick={(event) => event.stopPropagation()}>
          <input
            ref={inputRef}
            aria-label="Edit answer"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a possible answer"
          />
          <button className="text-button" type="submit">Save</button>
        </form>
      ) : (
        <button
          className="answer-select"
          type="button"
          aria-pressed={data.selected}
          onClick={(event) => {
            event.stopPropagation();
            data.onSelect(data.answer.id);
          }}
        >
          {data.answer.text || 'Untitled answer'}
        </button>
      )}
      {!editing && (
        <div className="node-actions" onClick={(event) => event.stopPropagation()}>
          <button
            className="text-button"
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Edit answer"
          >
            Edit
          </button>
          {!data.answer.followUpQuestionId && (
            <button
              className="text-button"
              type="button"
              onClick={() => data.onAddFollowUp(data.answer.id)}
            >
              + Next question
            </button>
          )}
          <button
            className="text-button danger-button"
            type="button"
            onClick={() => data.onDelete(data.answer.id)}
            aria-label="Delete answer"
          >
            Delete
          </button>
        </div>
      )}
      <Handle type="source" position={Position.Right} />
    </article>
  );
}
