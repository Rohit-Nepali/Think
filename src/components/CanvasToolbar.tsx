import { useReactFlow } from '@xyflow/react';

type CanvasToolbarProps = {
  depth: number;
};

export default function CanvasToolbar({ depth }: CanvasToolbarProps) {
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  return (
    <div className="canvas-toolbar">
      <div className={`depth-indicator${depth >= 5 ? ' depth-warning' : ''}`} aria-live="polite">
        <span className="depth-dot" />
        Level {depth}{depth < 5 ? ' of 5' : ''}
      </div>
      <div className="viewport-controls" aria-label="Canvas controls">
        <button type="button" aria-label="Zoom out" onClick={() => void zoomOut()}>−</button>
        <button type="button" aria-label="Zoom in" onClick={() => void zoomIn()}>+</button>
        <span className="control-divider" />
        <button type="button" onClick={() => void fitView({ padding: 0.22, duration: 200 })}>
          Fit view
        </button>
      </div>
    </div>
  );
}
