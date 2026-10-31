type DepthPromptProps = {
  onStop: () => void;
  onContinue: () => void;
};

export default function DepthPrompt({ onStop, onContinue }: DepthPromptProps) {
  return (
    <div className="prompt-backdrop">
      <section className="depth-prompt" role="dialog" aria-modal="true" aria-labelledby="prompt-title">
        <div className="prompt-kicker">A MOMENT TO PAUSE</div>
        <h2 id="prompt-title">Are you still solving the original question?</h2>
        <ul>
          <li>Is this question necessary before I can take the next step?</li>
          <li>Do I already have enough information to make a reasonable decision?</li>
        </ul>
        <div className="prompt-actions">
          <button className="button-secondary" type="button" onClick={onContinue}>
            Continue thinking
          </button>
          <button className="button-primary" type="button" onClick={onStop}>
            I have enough. Stop here.
          </button>
        </div>
      </section>
    </div>
  );
}
