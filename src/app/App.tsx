import { useEffect, useState, type FormEvent } from 'react';
import Canvas from '../components/Canvas';
import { useThinkingStore } from '../store/thinkingStore';

export default function App() {
  const workspace = useThinkingStore((state) => state.workspace);
  const isLoading = useThinkingStore((state) => state.isLoading);
  const persistenceError = useThinkingStore((state) => state.persistenceError);
  const restore = useThinkingStore((state) => state.restore);
  const createRoot = useThinkingStore((state) => state.createRoot);
  const [rootQuestion, setRootQuestion] = useState('');

  useEffect(() => {
    void restore();
  }, [restore]);

  function submitRootQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = rootQuestion.trim();
    if (!text) return;
    createRoot(text);
    setRootQuestion('');
  }

  return (
    <main className="app-shell" aria-label="Think canvas">
      {isLoading ? (
        <div className="loading-state">Opening your canvas…</div>
      ) : workspace.rootQuestionId ? (
        <Canvas />
      ) : (
        <section className="empty-canvas">
          <div className="empty-prompt">
            <div className="app-mark">Think</div>
            <p>Start with one question.</p>
            <form onSubmit={submitRootQuestion}>
              <input
                autoFocus
                aria-label="Your original question"
                value={rootQuestion}
                onChange={(event) => setRootQuestion(event.target.value)}
                placeholder="What are you thinking through?"
              />
              <button className="button-primary" type="submit" disabled={!rootQuestion.trim()}>
                Begin
              </button>
            </form>
          </div>
        </section>
      )}
      {persistenceError && (
        <div className="persistence-error" role="alert">
          {persistenceError}
        </div>
      )}
    </main>
  );
}
